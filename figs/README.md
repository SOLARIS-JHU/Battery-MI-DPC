# Graphical abstract provenance

- **Paper:** End-to-End Battery Dispatch with Exact Rainflow Degradation via Mixed-Integer Differentiable Predictive Control.
- **Source:** [SOLARIS papers page](https://solaris-jhu.github.io/solaris-website/papers.html#energy-systems), paper ID `arxiv-2609.12968`, scene `v11-rainflow`.
- **Original asset:** [static/images/papers/v13/arxiv-2609.12968.svg](https://github.com/SOLARIS-JHU/solaris-website/blob/main/static/images/papers/v13/arxiv-2609.12968.svg).
- **Original Git blob SHA:** `1033abd7a78f4b237eb325ce2abdb8a46a470fd8`.
- **Static source:** `battery-midpc-graphical-abstract.svg`, copied without changes on 25 November 2026.
- **Animation source:** The `v11-rainflow` updater in [static/js/paper-abstracts-v13.js](https://github.com/SOLARIS-JHU/solaris-website/blob/main/static/js/paper-abstracts-v13.js).
- **README asset:** `battery-midpc-graphical-abstract-animated.svg`, a self-contained SVG derivative using declarative animation. It retains the original diagram, state-of-charge trajectory, mode and power updates, battery fill, cycle-pairing highlights, and 12-second timeline (10 seconds of progression followed by a 2-second hold).
- **Regeneration:** Run `node scripts/generate-graphical-abstract.mjs` from the repository root. The generator uses the preserved static source and does not require third-party packages.
- **Accessibility:** A static diagram is displayed when the viewer requests reduced motion.
- **Interpretation:** This is a conceptual illustration of the method; no benchmark curves or measured experimental data were generated for the README.
- **Attribution:** SOLARIS Lab. Existing asset rights are retained; this adaptation does not introduce a new license.
