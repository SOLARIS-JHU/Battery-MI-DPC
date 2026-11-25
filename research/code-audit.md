# Released notebook audit

Reviewed 25 November 2026. This is an implementation source map for website maintenance, not a new experimental result. No training, checkpoint loading, dispatch evaluation, or algorithm modification was performed for this audit.

## Sources and indexing

- Code: [`Battery-MI-DPC.ipynb`](../../Battery-MI-DPC.ipynb), in the existing [SOLARIS-JHU/Battery-MI-DPC repository](https://github.com/SOLARIS-JHU/Battery-MI-DPC).
- Notebook SHA-256 at review: `80e91c0de9abd8c119d4a3101e0d6ad1a1e7a4f73c117c66dfc934d59b520552`.
- Usage and availability: [`README.md`](../../README.md).
- Scientific comparison: [arXiv:2609.12968v1](https://arxiv.org/abs/2609.12968v1), especially Sections II-B, III-C–G, and IV-B. The paper, rather than this demonstration notebook, is the source for reported experimental results.
- Cell numbers below are **one-based and count every cell**, including Markdown; zero-based JSON indices are supplied alongside them. Notebook section labels are a separate numbering system and skip Section 11.

| Cells (JSON indices) | Implementation source |
| --- | --- |
| 3–4 (2–3) | Installation and imports |
| 6 (5) | `BatteryParams`; normal synthetic profile generator |
| 8 (7) | `xu_battery_optimization`; PWL mixed-integer baseline |
| 10 (9) | `rainflow_degradation_exact`; finite-difference helper |
| 12 (11) | `RainflowFunction`, `L2O`, loss, schedules, and training loop |
| 14 (13) | `project_to_feasible`; SOC violation screening |
| 16 (15) | Synthetic policy training invocation |
| 18 (17) | Fleet-policy checkpoint loading |
| 20 (19) | Out-of-distribution synthetic profile generator |
| 22 (21) | Baseline/policy evaluation and summary metrics |
| 23 (22) | Previously saved illustrative result tables |

## Algorithm implemented in the notebook

**Problem parameters — cell 6.** The default horizon is 24 hours at 15-minute resolution (96 intervals). The battery has 10 kWh capacity, 4.8 kW charge/discharge limits, charge/discharge efficiencies of 0.92, and energy bounds corresponding to 10–90% SOC. Initial and target terminal energy are both 50% of capacity. Although variables are named `soc`, trajectory values used in the dynamics and constraints are energy in kWh; normalization by capacity produces a fractional SOC trajectory for cycle counting. These are demonstration defaults, not additional experiments.

**Inputs and neural policy — cell 12, `L2O`.** The policy receives complete horizon profiles for solar, demand, buying price, and selling price. Its actual encoded features are normalized solar, demand, buying price, and the buying-minus-selling price spread. Three fully connected hidden layers use LayerNorm, ReLU, and dropout; the default width is 1,024. A categorical head predicts charge/discharge/idle modes and a continuous head predicts two power magnitudes per interval.

**Discrete and continuous outputs — cell 12.** During training, `F.gumbel_softmax(..., hard=True)` makes a hard one-hot forward selection with straight-through relaxed gradients. Evaluation uses a deterministic argmax. Sigmoid power outputs are multiplied by the selected mode and the power limit. Thus raw network outputs have nonnegative bounded powers and mutually exclusive charging/discharging; idle gives zero power. This architectural property does not automatically carry through the notebook's subsequent projection, discussed below.

**Dynamics and grid exchange — cell 12.** `compute_soc` unrolls the known battery dynamics from the fixed initial energy. Net grid exchange is demand minus solar plus charging minus discharging; positive and negative parts give imports and exports. The notebook predicts a complete daily schedule in one forward pass. It does not implement a physical closed-loop controller or a receding-horizon loop, and initial SOC is a parameter rather than an additional learned-policy input.

**Rainflow forward computation — cells 10 and 12.** Both evaluation and custom autograd call `rainflow.extract_cycles` on normalized SOC. Full cycles are retained; half cycles are retained only when their start SOC exceeds their end SOC. The stress function is `a * depth**b`, with `a = 5.24e-4` and `b = 2.03`. In this released code, every retained cycle contributes the full stress value, including a retained discharge half cycle; the extracted count is not multiplied into the forward cost. The cost is multiplied by replacement cost per kWh times battery capacity. See the paper/code discrepancy table before describing this expression as the published equation.

**Backward estimator — cell 12, `RainflowFunction.backward`.** The code adds sparse endpoint derivatives for detected cycle extrema and dense derivatives of a successive-SOC-variation proxy. Default weights are 0.5 and 0.5. It clamps the resulting SOC gradient componentwise to [-1, 1]. This is a hybrid training estimator; the entire backward pass must not be described as the exact derivative of the forward rainflow operation.

**Loss — cell 12, `compute_loss`.** The loss combines import costs minus export revenue, curriculum-weighted rainflow cost, an SOC-bound violation penalty, and a terminal-energy penalty. The SOC penalty is a mean of positive lower/upper violations; the terminal penalty is SmoothL1. Defaults are 20 for the SOC penalty and 10 for the terminal penalty. A separate grid-balance tracking term has default weight zero and computes a residual that is already zero by the grid-exchange construction. SOC bounds and terminal energy are therefore soft training objectives, not architectural guarantees.

**Offline training — cells 12 and 16.** Training uses AdamW, a OneCycleLR schedule, shuffled minibatches, 5% Gaussian input perturbations, and parameter-gradient norm clipping. The degradation weight follows a square-root schedule from 2 toward 1; Gumbel temperature decreases linearly from 5 toward 0.1. The invocation creates 10,000 synthetic days and trains for 1,500 epochs with batch size 48. No random seed is fixed. The default tensors and model are on CPU; choosing a GPU runtime alone does not move them to a GPU. This training invocation does not save a checkpoint.

**Inference projection — cell 14.** The optional CVXPY QP minimizes squared deviation from predicted charge/discharge powers subject to the initial energy, linear energy dynamics, energy bounds, and nonnegative upper-bounded powers. It is attempted only for samples failing the SOC screen at tolerance `1e-4` kWh. OSQP uses absolute and relative tolerances of `1e-4`; `optimal` and `optimal_inaccurate` statuses are accepted. If a solve fails, the function retains the original schedule and prints a warning. `n_projected` counts attempted samples, not independently verified successful corrections. The implemented QP has no mode-locking constraints and no terminal-energy equality.

**PWL baseline — cell 8.** The baseline uses 16 energy segments, binary charge/discharge mode variables, linear battery dynamics, energy and power bounds, power balance, and a hard terminal-energy equality. Its objective combines energy costs with a piecewise-linear discharge-degradation approximation. It tries installed Gurobi, GLPK_MI, then CBC solvers. The listed pip installation supplies CVXOPT/GLPK_MI; Gurobi is optional and requires an appropriate installation/license. The baseline is post-evaluated using the notebook's rainflow function in cell 22. It is a comparison baseline, not a certified optimum of the exact-rainflow mixed-integer nonlinear problem.

## Material differences from the paper

Keep these distinctions in the internal source map. Public claims and equations should state which source they describe; do not silently combine paper guarantees with this demonstration implementation.

| Topic | Paper source | Released notebook behavior and website consequence |
| --- | --- | --- |
| Rainflow cost scaling | Section II-B, Eq. (4), and III-C7, Eq. (18), write `(R / eta_dis) * sum(n_i * Phi(delta_i))`. | Cells 10 and 12 use `R * sum(Phi(delta_i))` for retained cycles, without the `1 / eta_dis` factor or half-cycle weight. Use the paper's formula when explaining the paper; the notebook does not establish numerical reproduction of that formula. |
| Safety projection | Section III-G, Eqs. (31e–f), locks powers to the network's selected modes. The theorem assumes feasible initial SOC and concerns this specified QP. | Cell 14 omits mode locking, so charge/discharge exclusivity is not enforced by its QP. Solver failure also returns the original schedule. Do not transfer the paper's full projection guarantee to this function. |
| Terminal energy | The paper's Eq. (31) projection itself contains no terminal-energy equality. | Cell 14 also omits it; cell 12 penalizes terminal error, while the cell-8 PWL baseline imposes equality. Do not say projection guarantees return to target terminal SOC. |
| Hybrid gradient details | Section III-E, Eqs. (25–29), describes sparse and proxy components. | In cell 12, `weighted_proxy` already incorporates upstream `grad_output`, and the combined gradient is multiplied by `grad_output` again before clipping. Thus the proxy branch receives that factor twice. This observation was made by code inspection, not a numerical gradient test; avoid claiming exact agreement with the published backward expression. |
| Solve-time protocol | Section IV-B specifies hardware-matched CPU, per-instance inference with batch size 1 and projection included. | Cell 22 evaluates 10 neural samples in a batch and divides elapsed time by 10. Its PWL timing includes problem construction and solving. These notebook timings cannot be substituted for the paper's per-instance timings. |
| Experimental scope | Section IV includes real residential traces, fleet studies, and additional baselines/ablations. | The released notebook supplies synthetic in-distribution/OOD generation, PWL comparison, synthetic training, and loading of an external fleet model. It does not contain the complete real-fleet training/evaluation data and all paper experiment pipelines. |

## Evaluation interpretation

Cell 22 generates 10 in-distribution and 10 out-of-distribution synthetic days without a fixed seed. It compares PWL with synthetic-trained and checkpoint-loaded policies, with and without projection. The displayed relative cost difference is `(policy_total - PWL_total) / abs(PWL_total) * 100`; this is a **cost gap relative to PWL**, not a global optimality gap.

The unprojected feasibility flag checks only SOC bounds with a 0.1 kWh tolerance. Projected rows set `feasible=True` directly, without revalidating the result or propagating projection solver failure. These flags do not demonstrate satisfaction of every dispatch constraint. The notebook's stored Markdown result tables are prior illustrative outputs; they were not regenerated for the website. Public numerical results should be transcribed from the designated paper version with the paper's settings and qualifications.

## Checkpoints, data, and execution requirements

- Cells 18 and 22 each load `model_15min_div_16.pt` with `torch.load(..., weights_only=False)`. The reviewed repository snapshot does not contain this checkpoint. It is a pickled full model requiring the preceding class definitions and a trusted compatible file. The complete comparison cannot run from the repository alone.
- Synthetic training and generation are available without that checkpoint. For a synthetic-only comparison, both the checkpoint load/evaluation lines and the real-policy evaluation call must be omitted as explained in the README; deleting only `torch.load` leaves references to an undefined model.
- No real customer data tables, per-battery time series, or raw fleet experimental outputs are included in the reviewed repository snapshot. Synthetic generators are the locally available data source. This does not establish that such resources are unavailable elsewhere.
- The setup installs unpinned NumPy, SciPy, pandas, Matplotlib, PyTorch, CVXPY, OSQP, rainflow, Pyomo, and CVXOPT. No environment lockfile is supplied. Pyomo is imported, while the included baseline uses CVXPY.
- The README links to [the notebook in Google Colab](https://colab.research.google.com/github/SOLARIS-JHU/Battery-MI-DPC/blob/main/Battery-MI-DPC.ipynb). Saving a notebook copy to Drive does not itself persist arbitrary runtime checkpoints or output files.
- Existing static and animated SVG graphical abstracts are conceptual illustrations, not measured dispatch traces. Their source and regeneration script are documented in [`figs/README.md`](../../figs/README.md). Existing paper and asset rights must be retained.

## Maintenance rule

Recheck this document when code cells, the checkpoint/data release, or the designated paper version changes. Refresh the notebook hash and cell map after edits. A future execution audit should validate actual post-projection constraints and solver status, use the paper's timing protocol, and resolve the documented cost/gradient differences before claiming experimental reproduction.
