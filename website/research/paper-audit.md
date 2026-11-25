# Battery MI-DPC: scientific source map and audit

Checked 25 November 2026. Internal maintenance record; do not present this as paper prose. Page references below are PDF page numbers in arXiv v1.

## Sources and version policy

- **Scientific source:** [arXiv:2609.12968v1](https://arxiv.org/abs/2609.12968v1), submitted 11 September 2026. The entire [12-page PDF](https://arxiv.org/pdf/2609.12968v1) was read, including all equations, four figures, three tables, acknowledgments and references. There are **no appendices** in this version. The [HTML](https://arxiv.org/html/2609.12968v1) was also inspected; some equations/figures are incomplete there, so prefer the PDF for mathematical details. PDF SHA-256: `165361f1c02672a33507014ddf8c2713e22fa8f8766ceeaf95e178a7d558ea0a`.
- **Publication metadata:** [IEEE Xplore 11707737](https://ieeexplore.ieee.org/document/11707737/), [DOI 10.1109/TSG.2026.3737375](https://doi.org/10.1109/TSG.2026.3737375), and [publisher-deposited Crossref metadata](https://api.crossref.org/works/10.1109/TSG.2026.3737375). IEEE identifies *IEEE Transactions on Smart Grid*, Early Access, publication date 24 September 2026. Crossref confirms title, author order, affiliations, journal, year and DOI. Omit unassigned volume/issue and placeholder pages `1-1`.
- The arXiv comment still says submitted; it is stale relative to the publisher record. Use published / Early Access 2026, not under review.
- **Version limitation:** IEEE's live document page returned a JavaScript challenge / empty 202 response; the Crossref-supplied version-of-record PDF link returned HTTP 418. The final publisher full text was not available for comparison. Do not claim that the arXiv and publisher versions are identical. Scientific claims and numbers below follow arXiv v1 explicitly.
- The paper itself links [SOLARIS-JHU/Battery-MI-DPC](https://github.com/SOLARIS-JHU/Battery-MI-DPC). Research code and website share this repository by the user's explicit request. A separate implementation audit should record notebook-specific scope and unavailable checkpoints/data; do not claim the notebook alone reproduces the complete published study.

## Identity

**Exact title:** End-to-End Battery Dispatch with Exact Rainflow Degradation via Mixed-Integer Differentiable Predictive Control.

| Order | Author | Verified affiliation (PDF p. 1 and Crossref) |
|---|---|---|
| 1 | Eshagh Safarzadeh Ravajiri | Department of Environmental Health and Engineering, Johns Hopkins University |
| 2 | Ján Drgoňa | Department of Civil and Systems Engineering, Johns Hopkins University |
| 3 | Mahdi Mehrtash | Department of Electrical and Biomedical Engineering, University of Nevada, Reno |
| 4 | Benjamin F. Hobbs | Department of Environmental Health and Engineering, Johns Hopkins University |

PDF typesets the accented Ján Drgoňa; Crossref/arXiv metadata use Jan Drgona. Both identify the same author. Corresponding authors are Eshagh Safarzadeh Ravajiri and Mahdi Mehrtash. Use JHU and University of Nevada, Reno logos; SOLARIS is a lab mark, not a third author affiliation.

## Claim-to-source map

| Website claim / section | Scientific source | Qualification |
|---|---|---|
| Battery arbitrage must balance energy bills with cycle degradation | Sections I-II, pp. 1-2 | Empirical cycle-aging model, not complete electrochemical aging physics |
| Day-ahead residential PV/battery dispatch | Section II-A, Eq. (1)-(2), p. 2 | 24 hours, 96 intervals of 15 minutes; deterministic forecast profiles |
| Neural policy predicts modes and continuous power from forecasts | Section III-B/C, Eq. (7)-(15), pp. 4-5; Algorithm 1 p. 3 | Offline-trained approximate solution map; no exact/global optimization claim |
| Hard mode exclusivity and power limits | Section III-C3/C4, Eq. (12)-(15), pp. 4-5 | Hard one-hot forward modes, straight-through soft Gumbel-Softmax backward |
| Battery dynamics and power balance computed explicitly | Section III-C5/C6, Eq. (16)-(17), p. 5 | These equalities hold by construction; SOC bounds and terminal equality are separately penalized |
| Rainflow degradation evaluated in the forward pass | Sections II-B and III-C7, Eq. (3)-(4)/(18), pp. 2,5 | Exact evaluation of the adopted counting/stress-model convention, not exact physical degradation |
| Hybrid backward signal combines extrema and proxy terms | Section III-E2, Eq. (25)-(29), pp. 5-6; Fig. 2 p. 7 | The combined backward signal is not the exact derivative of the whole forward objective |
| Optional inference-time safety projection | Section III-G, Eq. (30)-(31), Theorem 1, p. 7 | Preserves chosen modes; guarantees the stated QP constraints under a feasible initial SOC; does not establish optimal dispatch or all Eq. (2) constraints |
| In-distribution synthetic comparison | Section IV-C p. 9; Table I p. 10 | Ten held-out synthetic scenarios; DE only three; no seed uncertainty reported |
| Single-customer annual evaluation | Section IV-D1 p. 9; Table II p. 10 | The training customer's 365 days; use projected 0.36% with 208x and 365/365 |
| Transfer of single-customer policy to the complete fleet | Section IV-D2 pp. 10-11; Table III p. 11 | Includes training customer; nine additional customers and two additional utility regions |
| Fleet-wide trained policy evaluated on fleet | Section IV-E pp. 10-11; Table III p. 11 | Training explicitly uses complete 3,650 scenarios; no held-out fleet split established |
| Mixing-weight sensitivity | Section IV-A p. 8; Fig. 3 | 50 trajectories; lambda=0.5 is a default, not a proven optimum |
| Projection behavior | Section IV-F p. 11; Fig. 4 | See arithmetic/timing discrepancies below; do not reconstruct statistics from the plot |
| Funding and data partners | Acknowledgments p. 11 | APS and sonnen data; DOE BENEFIT DE-EE0010902 and ASCR/SciDAC LEADS |

## Problem and essential method

Forecast inputs are solar generation `s_t`, demand `d_t`, purchase price and sell price. The decision is a daily sequence of charge/discharge/idle modes and continuous power. In this paper `SOC_t` is stored energy in kWh, not a dimensionless fraction. Capacity is `E_cap`.

Useful public equations, preserving paper notation:

```tex
J = \sum_t (p_t^{\rm import}\pi_t^{\rm buy}
            -p_t^{\rm export}\pi_t^{\rm sell})\Delta t
    + C_{\rm cyc}({\rm SOC}_{0:T}),

{\rm SOC}_{t+1}={\rm SOC}_t+
  (\eta_{\rm ch}p_t^{\rm ch}-p_t^{\rm dis}/\eta_{\rm dis})\Delta t,

C_{\rm cyc}=\frac{R}{\eta_{\rm dis}}
  \sum_i n_i\Phi(\delta_i),\qquad \Phi(\delta)=a\delta^b,

g_{\rm hybrid}=\lambda g_{\rm extrema}+(1-\lambda)g_{\rm proxy}.
```

Sources: objective Eq. (1), dynamics Eq. (2d), degradation Eq. (3)-(4), hybrid Eq. (25). `n_i` is a cycle count (0.5 or 1), `delta_i` is normalized cycle depth, `R` is replacement cost. The specified Li-NMC stress law has `a=5.24e-4`, `b=2.03`. Eq. (18) / Section III-C7 includes half-cycles only for discharge events; retain this convention if claiming exact agreement with the implementation. Avoid reproducing the long derivative formulas unless their counting conventions are also explained.

Algorithmic stages to retain:

1. Normalize daily solar/demand/price/spread inputs and encode them with a neural policy.
2. Predict a categorical mode with hard one-hot Gumbel-Softmax / straight-through estimation and bounded powers using sigmoid heads multiplied by mode indicators. This makes charging/discharging mutually exclusive and respects power limits.
3. Unroll SOC dynamics; compute net grid exchange from power balance and derive imports/exports using positive and negative parts.
4. Identify rainflow cycles and evaluate the adopted nonlinear cycle cost exactly in the forward pass. Add energy cost, SOC-bound penalties and terminal-SOC penalty.
5. During **offline training**, combine sparse cycle-extrema gradients and dense incremental-SOC proxy gradients, backpropagate through dynamics and policy, and update weights. The proxy component is biased; do not describe this as an exact gradient of rainflow everywhere.
6. During **inference**, a forward pass produces a candidate daily schedule. An optional QP adjusts continuous powers while locking predicted modes and enforcing the QP's SOC dynamics/bounds/power limits/initial state. It is not part of the training backpropagation graph.

The paper's full objective formulation includes `SOC_0=SOC_T=0.5 E_cap` (Eq. 2f). Training treats terminal equality through SmoothL1 (Eq. 23). The published projection equations (31a-f) constrain initial SOC but **do not include terminal equality**. Therefore say “SOC and power constraints under the projection model,” not “all original constraints guaranteed.” Its uniqueness/feasibility theorem assumes an initially feasible SOC and feasible zero-power action; mode decisions can be suboptimal.

## Experimental context

Section IV-B, pp. 8-9:

- Numerical dispatch experiments using one year of real metered rooftop PV and household demand; not a physical closed-loop deployment.
- Ten residential batteries: six SDG&E California, one Xcel Colorado, three APS Arizona; 365 days each, total 3,650 battery-day instances. Each day is a 96-step schedule.
- Common battery: 10 kWh, 4.8 kW, stated 92% efficiency, SOC range 10%-90%, Li-NMC cycle stress law. Do not reinterpret 92% as a verified round-trip figure; equations use separate charge/discharge efficiencies.
- Single-battery training uses one SDG&E customer with synthetic augmentation. Fleet-wide training uses all 3,650 scenarios. Only Table I explicitly states held-out synthetic scenarios; do not invent a train/test split for fleet results.
- PWL baseline: mixed-integer linear program with a piecewise-linear degradation approximation, solved using Gurobi 13.0. Reported schedules are **post-evaluated using exact rainflow**. Its cost is a reference, not the certified global optimum of the exact rainflow problem. Use “performance gap relative to PWL,” never “optimality gap.”
- Offline training: NVIDIA Tesla T4 16 GB, host Intel Xeon Gold 6248R 3.00 GHz / 1.5 TB memory; about 8.5 hours. This cost is excluded from inference speedups.
- Timed inference and Gurobi use the same Intel Core Ultra 7 155H CPU (16 cores), 16 GB RAM. MI-DPC is batch size 1. Table I reports per-instance time; Tables II and III sum inference/solve time over their respective instance sets.
- No repeated-seed confidence intervals, standard deviations, or significance testing are reported in Tables I-III. Do not add error bars or present uncertainty from synthetic data as measured experiments.

Training details (Section III-C/F, pp. 4-6): three encoder layers with LayerNorm, ReLU, dropout 0.1; degradation curriculum 2.0 to 1.0; Gumbel temperature 5.0 to 0.1; input augmentation 5% Gaussian noise; AdamW weight decay 1e-4, gradient norm clipping 1.0, OneCycleLR 1e-4 -> 1e-3 -> 1e-5; SOC/terminal penalty weights 20/10. The paper does not provide the network widths, training batch size and epoch count needed to reconstruct the exact experiment solely from this text. Keep notebook settings separately attributed.

## Exact numerical results

Preserve displayed values rather than recalculating gaps/speedups from rounded entries.

### Table I: ten held-out synthetic scenarios, p. 10

Dollar costs retain the table's reported units and precision; its caption does not separately define their aggregation formula. Timing is per-instance, and the text describes a mean performance gap. DE has three scenarios rather than ten.

| Method | Economic $ | Degradation $ | Total $ | Gap vs PWL % | Feasible days | Time s | Speedup |
|---|---:|---:|---:|---:|---|---:|---:|
| PWL | 28.55 | 0.58 | 29.13 | 0.00 | 10/10 | 9.42 | 1.0x |
| Throughput | 28.52 | 1.29 | 29.81 | 2.34 | 10/10 | 1.10 | 8.6x |
| DE (n=3) | 29.63 | 0.50 | 30.13 | 3.43 | 3/3 | 3559.1 | 0.003x |
| PPO, no projection | 35.62 | 0.20 | 35.82 | 22.98 | 6/10 | 0.071 | 132.5x |
| PPO + projection | 34.18 | 0.16 | 34.34 | 17.90 | 10/10 | 0.132 | 71.4x |
| MI-DPC-PWL, no projection | 31.35 | 0.15 | 31.50 | 8.14 | 10/10 | 0.0004 | 24154x |
| MI-DPC-PWL + projection | 31.35 | 0.15 | 31.50 | 8.14 | 10/10 | 0.019 | 496x |
| MI-DPC rainflow, no projection | 29.02 | 0.62 | 29.64 | 1.74 | 10/10 | 0.008 | 1239.9x |
| MI-DPC rainflow + projection | 29.01 | 0.62 | 29.63 | 1.74 | 10/10 | 0.041 | 228.7x |

### Table II: training customer, 365 days, p. 10

Costs and times are annual totals.

| Method | Economic $ | Degradation $ | Total $ | Gap vs PWL % | Feasible days | Total time s | Speedup |
|---|---:|---:|---:|---:|---|---:|---:|
| No battery | 8355.98 | 0.00 | 8355.98 | 9.04 | 365/365 | - | - |
| PWL | 7502.97 | 160.41 | 7663.38 | 0.00 | 365/365 | 4370.24 | 1.0x |
| MI-DPC, no projection | 7529.87 | 160.56 | 7690.43 | 0.35 | 357/365 | 2.35 | 1859x |
| MI-DPC + projection | 7530.71 | 160.32 | 7691.03 | 0.36 | 365/365 | 21.06 | 208x |

### Table III: full fleet, 3,650 battery-days, p. 11

Costs and times are totals over the complete fleet-year.

| Training / method | Economic $ | Degradation $ | Total $ | Gap vs PWL % | Feasible /3650 | Total time s | Speedup |
|---|---:|---:|---:|---:|---:|---:|---:|
| No battery | 20600 | 0 | 20600 | - | 3650 | - | - |
| PWL | 14691 | 1310 | 16000 | 0.00 | 3650 | 35011 | 1.0x |
| Single battery, no projection | 16118 | 1692 | 17810 | 11.31 | 3193 | 52.7 | 664x |
| Single battery + projection | 16114 | 1691 | 17804 | 11.27 | 3650 | 485 | 72x |
| Fleet-wide, no projection | 15160 | 1373 | 16533 | 3.33 | 3650 | 21.9 | 1598x |
| Fleet-wide + projection | 15160 | 1373 | 16533 | 3.33 | 3650 | 62.0 | 564x |

Suggested featured comparison: **3.33% performance gap versus the PWL reference; 62.0 s for 3,650 schedules versus 35,011 s; 564x reported speedup; 3,650/3,650 feasible schedules**, for fleet-wide training with projection. Caption must include the CPU/batch context, excluded offline training, and fleet-wide training/evaluation scope. Do not relabel 3,650 battery-days as 3,650 distinct batteries.

## Original figures and extraction candidates

| Figure | Location | Contents and usage |
|---|---|---|
| 1 | PDF p. 4, full-width top | Original pipeline diagram. HTML asset [MI-DPC.png](https://arxiv.org/html/2609.12968v1/MI-DPC.png); inspect native resolution before enlarging. Existing SOLARIS graphical abstract can instead serve the main overview. |
| 2 | PDF p. 7, full-width top; `hybrid_gradient.svg` in versioned arXiv HTML directory | Five panels: SOC/cycle extrema, sparse extrema gradient, dense proxy gradient, hybrid gradient, initial/final SOC. Good method-detail figure; preserve all panels/axes/legends. It is a method illustration, not the fleet performance table. |
| 3 | PDF p. 8, upper right; `lambda_ab.svg` in versioned arXiv HTML directory | Mixing-weight sensitivity over 50 trajectories, exact rainflow cost convergence and final-cost sweep. Good ablation figure; lambda=0.5 is a robust default rather than a proven optimum. |
| 4 | PDF p. 11, upper right; `feasibility_projection_compact.svg` in versioned arXiv HTML directory | Representative before/after projection trajectory, violation-magnitude distribution and monthly infeasible counts. Good application-detail figure; preserve axes and explain single-battery policy transfer context. |

The asset audit subsequently located the original vector SVGs for Figures 2-4 in the versioned arXiv HTML directory. Use these unchanged original assets rather than PDF crops or recreated unprovided data; see `figure-provenance.md` for exact URLs and integrity hashes. Original PDFs and text used during the audit are in the task's scratch `research/battery-arxiv-v1.*`; do not accidentally publish full extracted text as a public page. Generated assets should retain provenance and distinguish stylized animation from measured results.

## Discrepancies and claims to avoid

1. **Projected/unprojected conflation:** abstract and conclusion combine the unprojected 0.35% single-battery gap with projected speed/feasibility. Table II projected result is **0.36%, 208x, 365/365**. Use internally consistent rows.
2. **Fleet training/evaluation overlap:** Section IV-E explicitly trains on complete 3,650 scenarios then reports that fleet; no held-out fleet split is established. Describe broader training coverage, not an unseen-fleet generalization guarantee.
3. **Projection scope:** Eq. (31) omits terminal equality from Eq. (2f). The theorem concerns the stated QP and feasible initial SOC. Do not promise all original optimization constraints, robust physical safety under model error, or globally optimal modes.
4. **Hybrid derivative:** exact forward rainflow does not mean the full hybrid backward signal is exact. The prose itself identifies a biased proxy component; avoid extending its claimed nonsmooth-analysis argument into an independently verified convergence guarantee. A nonzero gradient at every timestep is not generally guaranteed.
5. **Timing:** the text says all timings are per-instance, but Tables II-III are explicitly annual/fleet totals. Label each table accordingly. Do not include 8.5-hour offline training in reported inference speedups, nor omit it when discussing end-to-end cost.
6. **Violation arithmetic:** Section IV-F calls 0.31 kWh mean violation 2.3% capacity despite a stated 10 kWh battery (0.31/10=3.1%). Omit that percentage or flag the inconsistency.
7. **Projection timing arithmetic:** the stated 51 ms average QP solve per infeasible day does not explain Table III's 52.7 -> 485 s total increase; preserve table totals and do not derive a new consistent-looking claim by mixing them.
8. **Rounding:** Table III PWL components 14691+1310 sum to 16001, but the printed total is 16000. Preserve the printed total and gaps; small mismatches in Table I follow rounded reporting.
9. **Physical scope:** evaluation uses real traces with simulated/modelled dispatch. No hardware deployment, battery lifetime extension measurement, calendar aging, temperature effects, forecast-error robustness study or receding-horizon closed-loop validation is established. Receding-horizon operation and online adaptation are future work (p. 11).
10. **Chemistry scope:** reported trade-offs use a Li-NMC stress function. The paper argues the architecture can accommodate other monotonic stress functions; this is not experimental validation on other chemistries.
11. **Baseline:** the PWL-MILP is not the exact rainflow MINLP global optimum. “Exact rainflow” concerns model evaluation, not exact optimal decisions or complete degradation physics. Do not claim state of the art, universal speedup, first-ever capability, or globally optimal dispatch.

## Citation

```bibtex
@article{ravajiri2026battery,
  author = {Ravajiri, Eshagh Safarzadeh and Drgona, Jan
            and Mehrtash, Mahdi and Hobbs, Benjamin F.},
  title = {End-to-End Battery Dispatch with Exact Rainflow
           Degradation via Mixed-Integer Differentiable
           Predictive Control},
  journal = {IEEE Transactions on Smart Grid},
  year = {2026},
  note = {Early Access},
  doi = {10.1109/TSG.2026.3737375},
  url = {https://ieeexplore.ieee.org/document/11707737/}
}
```
