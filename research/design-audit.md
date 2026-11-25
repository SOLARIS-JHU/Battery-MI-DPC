# Visual foundation and asset audit

Verified 25 November 2026. These are design references, not scientific evidence. Inspection used the published HTML/CSS and repository source; browser rendering was unavailable during this audit.

## Selected foundation: TQPNet

- Published reference: https://solaris-jhu.github.io/TQPNet/
- Source: https://github.com/SOLARIS-JHU/TQPNet/tree/main/website
- CSS blob: `3cfd222665f81386d365a1c310aaf5f516741de1`; HTML blob: `a692a0aeb83213e1d925de1e164f0be14bc59538`.
- Repository license: Apache-2.0, LICENSE blob `9af26733803db7bc5df30233b591b62c2066ccfd`.
- TQPNet is the single foundation. Use its type, palette, spacing, pill buttons, logos and responsive grids. The battery diagram should occupy a full-width row so its labels remain legible.

| Element | TQPNet value |
| --- | --- |
| Body | Inter 400/500/600; system-ui, -apple-system, Segoe UI, Roboto, sans-serif fallback |
| Headings | Fraunces 600; Georgia, Times New Roman, serif fallback; line-height 1.15; letter-spacing -0.01em |
| Background / text | `#fbfbfd` / `#1a1f2b` |
| Muted / border | `#5b6470` / `#dfe3ea` |
| Accent / soft accent | JHU Heritage Blue `#002d72` / `rgba(0,45,114,.08)` |
| Card / radius | White / 14px |
| Content width | `min(100% - 2.5rem, 1100px)` |
| Body size / line-height | 1.125rem / 1.6; 1rem below 560px |
| Hero title | `clamp(1.9rem,3.7vw,2.7rem)`; balanced centered text |
| Section heading | `clamp(1.6rem,2.8vw,2.2rem)`, accent color |
| Section spacing | `clamp(2.5rem,5vw,4rem)` block padding |
| Resource buttons | Pill radius 999px; padding .6rem 1.15rem; 1px border; gap .6rem; blue primary |
| Cards | Padding 1.25rem 1.35rem; 1px border |
| Logo strip | Centered flex wrap; gaps 1.5rem 3.5rem; top border; 44px-tall marks (34px below 560px) |
| Focus | 3px visible outline; 3px offset |
| Responsive layout | Hero/grids collapse below 900px; tables scroll horizontally |
| Figure captions | .92rem, muted, line-height 1.45 |
| Math | Horizontally scrollable KaTeX, .95rem; preserve display equation semantics |

The upstream includes a dark palette (`#0d1628` background, `#e8ecf3` text, `#68ace5` accent). A consistently light page is appropriate for the white scientific artwork and matches the existing homotopy project adaptation. Avoid partial dark styling that inverts scientific graphics.

## Other supplied references

All nine URLs returned HTTP 200 for page HTML; associated stylesheets were inspected for typography and section patterns.

| Reference | Useful pattern | Foundation / attribution observed |
| --- | --- | --- |
| [TQPNet](https://solaris-jhu.github.io/TQPNet/) | Centered scholarly header; readable summary; results figures/tables; copyable citation | Selected; Apache-2.0 |
| [MI-DPC for UPHES](https://solaris-jhu.github.io/MI-DPC-UPHES/) | Energy application narrative; scheduling → method → results | Same Fraunces/Inter tokens as TQPNet |
| [SD-DPC](https://solaris-jhu.github.io/SD-DPC-website/) | Compact method/results grouping | Different all-Inter visual style; Academic Project Page Template; CC BY-SA 4.0 |
| [Mixed-Integer DPC](https://xboldocky.github.io/midpc-web/) | Problem formulation and numerical example | Bulma/Nerfies; CC BY-SA 4.0 |
| [PDE Control with DPC](https://centrum-intelliphysics.github.io/PDEControl_DPC_website/) | Clear offline training / inference explanation | Academic Project Page Template; CC BY-SA 4.0 |
| [CINOC](https://solaris-jhu.github.io/CINOC-website/) | Large graphical abstract with algorithm explanation | Academic Project Page Template; CC BY-SA 4.0 |
| [SCORE](https://solaris-jhu.github.io/score-website/) | Formulation, method, results, tutorials | Academic Project Page Template credit |
| [Chiller Plant MI-DPC](https://xboldocky.github.io/chiller-plant-MIDPC/) | Explicit simulation results section | Bulma/Nerfies; CC BY-SA 4.0 |
| [Neural DAEs](https://drgona.github.io/NeuralDAEs/) | Method and application examples | Bulma/Nerfies; CC BY-SA 4.0 |

No CSS or source from the differently licensed alternative templates needs to be copied. Do not copy their funding, authorship, badges, or scientific claims.

## Local reusable assets

The existing local `homotopy-opf-website/assets/` includes the same Inter and Fraunces WOFF2 binaries, SIL OFL notices, KaTeX 0.16.22 JS/CSS/fonts and MIT license, and JHU/SOLARIS marks. Copy them under this website's `static/` hierarchy, retaining notices and provenance. This is independent of the notebook implementation.

| Asset | Verified upstream |
| --- | --- |
| JHU Whiting SVG | https://github.com/SOLARIS-JHU/TQPNet/blob/main/website/static/logos/jhu-whiting.svg ; blob `b02d08417d5e3983cfdb7fa0ffedbc04394344d1` |
| SOLARIS PNG | https://github.com/SOLARIS-JHU/TQPNet/blob/main/website/static/logos/solaris.png ; blob `c217b3fae21f8b381842c5f289484f79a3acf4ee` |
| Optional ROSEI PNG | https://github.com/SOLARIS-JHU/TQPNet/blob/main/website/static/logos/rosei.png ; blob `dcf070de60996c74d2c8b2b38f7e480d39ec1bd5` |
| Nevada SVG (downloaded unchanged) | https://www.unr.edu/Assets/Icons/logos/university-wordmark-new.svg |

`static/logos/nevada.svg` was downloaded unchanged from the University of Nevada, Reno website header, as exposed on https://www.unr.edu/marketing-communications/brand/visual-identity/primary-logo . It has a `0 0 480.52 190.09` viewBox, navy `#143460` paths, and SHA-256 `32d1b77433382ce272b57690050d0fe64709d4c5c4b77a8fa6a16d0ca53874e8`. Keep its native proportions. University marks retain their copyright/trademark rights and are not relicensed under the website code license. The official UNR brand page documents approved logo use; the page's preview-watermarked samples were not used.

Use JHU + Nevada as institutional marks because the verified paper affiliations span those universities. SOLARIS is the lab mark. ROSEI is optional only if the paper's acknowledgement or affiliation justifies displaying it.

## Author links

| Author | Verified official resource |
| --- | --- |
| Eshagh Safarzadeh Ravajiri | https://ai2ai.engineering.jhu.edu/2026-2027-amazon-doctoral-fellows/ (official JHU biography paragraph; no individual homepage identified) |
| Mahdi Mehrtash | https://www.unr.edu/ebme/people/mahdi-mehrtash |
| Benjamin F. Hobbs | https://engineering.jhu.edu/faculty/benjamin-hobbs/ |

The two JHU pages were accessible through the search service; direct automated HTTP requests returned Cloudflare 403. The official Mahdi profile also links to https://www.mahdimehrtash.com/ . Do not infer paper affiliations from current biographies when the paper lists a different department.

## Attribution implementation

Include a website-scoped Apache-2.0 LICENSE and NOTICE for adapted TQPNet source; do not apply a new root-level license to the existing notebook implicitly. A short footer can say: “Website adapted from TQPNet. Institution marks and paper figures retain their original rights.” Link TQPNet and the website license. Preserve font and KaTeX notices alongside the assets. Do not copy TQPNet's project-specific funding footer.

## Suggested page structure

1. Exact paper title, publication badge, authors and source-verified affiliations.
2. Paper / arXiv / Code / Colab / BibTeX resource buttons.
3. Full-width existing animated SOLARIS graphical abstract with pause/restart and reduced-motion fallback; describe its algorithmic stages in the method text.
4. Concise summary and battery-dispatch problem.
5. Policy, dynamics, exact forward rainflow, hybrid backward gradient, training loss and optional inference projection.
6. Original paper results with experimental context and comparisons.
7. Scope, resources and copyable citation.

Avoid redundant redraws of the existing graphical abstract and avoid interpreting its illustrative motion as a measured trajectory.

## Draft source review

Reviewed the website draft without a browser. JavaScript syntax check passed. Image alternative text, a skip link, visible focus styling, labelled horizontally scrollable result tables, unique HTML IDs, and resolvable in-page anchors were present. The CSS collapses the two-column content at 900px and methods/statistics at 600px; equations and tables have their own horizontal overflow containers. No definite page-width overflow blocker was identified from source.

Original figure aspect ratios differ substantially: Figure 2 is 456.48439×667.22439 (portrait); Figure 3 is 247.1346×336.3525 (portrait); Figure 4 is 497.19889×280.3825 (landscape). Recommended maximum display widths are 620px, 520px, and 1000px respectively. Use matching intrinsic image attributes to avoid layout shifts. JHU logo intrinsic dimensions are 240×64; SOLARIS 240×199. Root received these recommendations.

At the draft snapshot, citation.bib, NOTICE, and static/og.png were referenced before their creation; final validation must check them. No browser, keyboard-interaction, or screenshot-based validation was performed in this audit.
