# Website scientific source map

Reviewed 25 November 2026 against the complete scientific source and the current `index.html`. This record maps the public page to evidence; it is not public research prose. The detailed paper audit, exact tables and discrepancy list are in [paper-audit.md](paper-audit.md), implementation differences in [code-audit.md](code-audit.md), and asset URLs/hashes in [figure-provenance.md](figure-provenance.md).

## Source records

| ID | Source | Role |
|---|---|---|
| P | [arXiv:2609.12968v1 PDF](https://arxiv.org/pdf/2609.12968v1), 11 September 2026, 12 pages; [HTML](https://arxiv.org/html/2609.12968v1) | Primary scientific source, read in full; no appendices. PDF controls when HTML omits equation content. |
| B | [IEEE Xplore document 11707737](https://ieeexplore.ieee.org/document/11707737/), [DOI](https://doi.org/10.1109/TSG.2026.3737375), [publisher-deposited Crossref record](https://api.crossref.org/works/10.1109/TSG.2026.3737375) | Title, author order, affiliations, IEEE Transactions on Smart Grid / Early Access / 2026 status and citation. |
| C | [Battery-MI-DPC.ipynb](../../Battery-MI-DPC.ipynb) and [README](../../README.md) | Released implementation, runnable notebook scope and missing resources; cell map and reviewed SHA-256 in code-audit.md. |
| A | Existing repository `figs/battery-midpc-graphical-abstract*.svg` and `scripts/generate-graphical-abstract.mjs` | SOLARIS explanatory diagram and motion, copied into website static assets; not experimental data. |
| F | Original author SVGs in `https://arxiv.org/html/2609.12968v1/` | Unmodified original Figures 2-4, with full axes, legends and source attribution. |

The IEEE full text was inaccessible during preparation, so no equivalence between P and the final version of record is asserted. The arXiv “submitted” comment is stale relative to B. Public bibliographic fields use B; method, figures and numbers use P. Do not add unverified volume/issue/page numbers; `1-1` in current metadata is a placeholder.

## Identity, opening and metadata

- Exact paper title and author order: P p. 1 and B. Eshagh Safarzadeh Ravajiri; Ján Drgoňa; Mahdi Mehrtash; Benjamin F. Hobbs. The PDF supports the accented second name; machine-readable publisher metadata also uses Jan Drgona.
- Superscripts on the website denote departments, not author ordering: Ravajiri/Hobbs 1 = JHU Environmental Health and Engineering; Drgoňa 2 = JHU Civil and Systems Engineering; Mehrtash 3 = University of Nevada, Reno, Electrical and Biomedical Engineering. P p. 1 and B agree.
- Hero summary: P Sections I and III, pp. 1,3-6. Forecast-driven mode/power policy; exact forward rainflow evaluation under the adopted stress model; sparse/dense hybrid backward signal. It does not claim exact optimal dispatch or a fully exact backward derivative.
- Resource buttons: B for IEEE/DOI; P for arXiv; C for code and the actual `main/Battery-MI-DPC.ipynb` Colab path. No invented dataset/checkpoint/demo links.
- Organization logos establish affiliation/identity, not scientific evidence. Their origin and presentation are recorded in design-audit.md.
- Animated abstract: A, supported conceptually by P Algorithm 1 and Sections III-C/E. Moving markers and cycle highlights are illustrative operations, not measured customer traces or benchmark evidence. Two gradient branches represent the backward construction, not two independent physical controllers.

## Section-by-section map

| Public section / item | Exact scientific source | Interpretation to preserve |
|---|---|---|
| `#problem`: arbitrage and cycle-depth motivation | P Sections I, II-A/B, pp. 1-2 | Similar throughput can give different cycle costs; empirical stress model, not a complete physical aging model. |
| 24-hour / 15-minute / 96-interval setup and SOC units | P Section II-A, p. 2 | SOC notation denotes stored energy in kWh. |
| Scheduling objective equation | P Eq. (1), p. 2 | Energy import less export revenue plus degradation; omitted constraints described immediately below. |
| Rainflow cost and stress-law equation | P Eqs. (3)-(4), p. 2; Eq. (18)/Section III-C7, p. 5 | Cycle counts and normalized depths; discharge-half-cycle convention; paper formula rather than notebook variant. |
| Bounds, exclusivity, dynamics, grid balance and terminal target | P Eq. (2a-g), p. 2 | Terminal equality is part of original problem, but not part of the later projection formulation. |
| `#method`: self-supervised offline training / optional inference filter | P Algorithm 1 p. 3; Sections III-A/G, pp. 4,7 | No optimal-dispatch labels required; projection is at inference, not an end-to-end trained projection layer. |
| Step 1: normalized forecasts / shared encoder / separate heads | P Section III-C1/C2, Eqs. (9)-(11), p. 4 | Uses solar, demand, buy price and price spread over the horizon. |
| Step 2: one-hot modes and bounded powers | P Section III-C3/C4, Eqs. (12)-(15), pp. 4-5; C cell 12 | Hard-forward/soft-backward training and discrete inference; sigmoid powers gated by mode. |
| Step 3: explicit physical calculation and cost | P Section III-C5/C6/C7, Eqs. (16)-(18), p. 5 | Dynamics and balance by construction; SOC bounds remain separately penalized. |
| Step 4: hybrid gradients and penalty terms | P Section III-D/E, Eqs. (19)-(29), pp. 5-6 | Bias from proxy component; no universal training convergence or exact-gradient claim. |
| Hybrid formula / lambda=0.5 | P Eq. (25), p. 6; Section IV-A, p. 8 | Website tilde explicitly identifies an estimator. Lambda is a default supported by sensitivity study, not a proven universal optimum. |
| Self-supervised loss / curriculum and temperature | P Eq. (19), p. 5; Section III-F, p. 6 | Soft SOC and terminal penalties do not guarantee feasibility. |
| Original Figure 2 / hybrid gradient caption | P Fig. 2, p. 7; Section III-E2 | A trajectory-optimization explanation; not the fleet benchmark. |
| Projection description and uniqueness | P Section III-G, Eqs. (30)-(31), Assumption 1/Theorem 1, p. 7 | Fixed modes; stated QP constraints; initial SOC within bounds; no terminal equality or global-dispatch optimality. |
| `#results`: real traces and PWL reference | P Section IV-B, pp. 8-9 | Numerical dispatch on measured PV/demand; PWL schedules post-evaluated using rainflow. |
| Fleet cards and annual fleet comparison | P Table III, p. 11; Sections IV-D/E, pp. 9-11 | 3,650 battery-days, not batteries; totals over a fleet-year; no established held-out fleet split. |
| Battery and timing conditions | P Section IV-B, pp. 8-9 | Common specs; batch-size-1 CPU inference; same CPU for Gurobi; offline GPU cost separate. |
| Original Figure 4 / projection behavior | P Fig. 4 and Section IV-F, p. 11 | Single-customer-trained policy transferred across the fleet; retain source axes without inventing statistics. |
| Training-objective comparison / selected Table I rows | P Table I, p. 10; Section IV-C, p. 9 | Ten held-out synthetic scenarios; both learned methods shown with projection; preserve printed costs/gaps. |
| Original Figure 3 / 50 trajectories | P Fig. 3 and Section IV-A, p. 8 | Preserve log cost axis, inset and shading; do not invent confidence-level interpretation. |
| `#scope`: model/traces, gradient and chemistry qualifications | P Sections II-B, III-E/G, IV-B/E, V, pp. 2,6-11 | No physical closed-loop experiment, global optimum, universal gradient/feasibility/chemistry claim. |
| Day-ahead scope / future receding-horizon operation | P Section II-A p. 2 and Conclusion p. 11 | Receding horizon and online adaptation are future work. Independent battery problems contain no coupled feeder/network constraints; that limitation follows from the formulation. |
| `#resources`: notebook and reproduction caveats | C, code-audit.md, README | Synthetic notebook available; fleet checkpoint/customer dataset missing; paper/code differences kept explicit. |
| Citation | B | Journal, year, DOI, title and authors match metadata; Early Access, no placeholder page range. |
| Footer funding/data acknowledgment | P Acknowledgments, p. 11 | APS/sonnen, DOE BENEFIT DE-EE0010902, DOE Office of Science ASCR/SciDAC LEADS. |

## Displayed numerical data audit

All public values in the first draft were checked against P. The site intentionally selects relevant Table III rows and three Table I rows; it does not claim to reproduce every experiment.

### Fleet totals (Table III, p. 11)

| Row | Total cost $ | Gap % | Feasible /3650 | Total time s |
|---|---:|---:|---:|---:|
| PWL | 16000 | 0.00 | 3650 | 35011 |
| Single battery, no projection | 17810 | 11.31 | 3193 | 52.7 |
| Single battery + projection | 17804 | 11.27 | 3650 | 485 |
| Fleet-wide, no projection | 16533 | 3.33 | 3650 | 21.9 |
| Fleet-wide + projection | 16533 | 3.33 | 3650 | 62.0 |

The headline 564x speedup is the table's reported fleet-wide/projected value. These totals exclude approximately 8.5 hours of offline training. Section IV-E explicitly uses the complete 3,650 scenarios for fleet-wide training; the page retains this limitation immediately beside the results. Feasibility counts are reported observations under the source's checks, not a universal guarantee for arbitrary future profiles.

### Selected synthetic comparison (Table I, p. 10)

| Row | Economic $ | Degradation $ | Gap % | Per-instance time s | Feasible |
|---|---:|---:|---:|---:|---|
| PWL | 28.55 | 0.58 | 0.00 | 9.42 | 10/10 |
| MI-DPC-PWL + projection | 31.35 | 0.15 | 8.14 | 0.019 | 10/10 |
| MI-DPC exact rainflow + projection | 29.01 | 0.62 | 1.74 | 0.041 | 10/10 |

Use **reported costs** and per-instance timings. Section IV-C explicitly describes a mean performance gap, but the Table I caption does not separately define cost-column aggregation. Do not label the costs “mean” solely by inference from a different notebook evaluation. Retain rounded source values and do not recompute gaps from them. Baselines omitted from the small public table are acknowledged in its note; full values remain in paper-audit.md.

### Context values

10 batteries x 365 days = 3,650 battery-days; 10 kWh capacity; 4.8 kW; stated efficiency 92%; SOC bounds 10%-90%; 96 daily intervals; Intel Core Ultra 7 155H / 16 GB RAM; batch size 1; Gurobi 13.0; Tesla T4 / 16 GB GPU memory; about 8.5-hour offline training: P Section IV-B, pp. 8-9. The page does not label the 92% as round-trip efficiency. Figure 3's 50 trajectories and lambda=0.5: Section IV-A, p. 8. Tables I-III provide no confidence intervals or repeated-seed/run uncertainty.

## Code and publication caveats retained on the public page

- The scientific page follows P, not a fresh execution of C. Missing `model_15min_div_16.pt` and real customer traces prevent a complete fleet reproduction from the repository alone.
- Notebook cells 10/12 omit the paper's half-cycle multiplier and discharge-efficiency cost factor; cell 14 projection omits mode-locking and terminal equality and can return uncorrected outputs after solver failure. The manuscript's theorem must not be transferred to that function.
- Notebook cell 22 times a multi-sample neural batch and uses different feasibility reporting, while P describes CPU batch-size-1 timing. Notebook saved outputs are not the page's result source.
- P's own projection omits the original terminal equality; the public method and scope sections explicitly explain this.
- Known source inconsistencies not propagated: projected single-battery cost gap is 0.36% rather than abstract's mixed 0.35%; 0.31 kWh is not 2.3% of 10 kWh; 51 ms stated projection time does not explain aggregate timing changes. No new values are synthesized to resolve them.
- See figure-provenance.md for exact asset identity and rights. Original source SVGs are unchanged, while the abstract is a labeled explanatory animation.

## Audit outcome and maintenance

No incorrect numerical transcription or substantive algorithm misstatement was found in the first draft. The review requested replacing the unsupported Table I wording “mean costs” with “reported costs.” Recheck this map after changes to public claims, code/checkpoints/data, source version, equations or figures. A successful source audit is separate from browser/deployment validation.
