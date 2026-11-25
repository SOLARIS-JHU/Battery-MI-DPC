# Validation record

Prepared 25 November 2026. This record distinguishes completed checks from verification requiring a browser or a live deployment.

## Completed before publication

- Full 12-page arXiv v1 review, metadata check against publisher-deposited Crossref data and IEEE search record; exact version/access limitation retained on the page.
- Independent scientific audit of all public prose, equations, numerical values, setup details, and captions. The only initial wording correction was replacing an unsupported "mean costs" description with "costs as reported in Table I."
- Notebook source review, with material differences documented and its file preserved unchanged.
- Original figure SVGs downloaded unchanged; XML and local-reference checks; render inspection via Inkscape confirmed complete axes, panels, legends, and shading.
- Existing animated graphical abstract copied unchanged. Its generator previously passed 1,972 attribute comparisons at 68 times against the original SOLARIS updater; 29 declarative tracks and reduced-motion static fallback are preserved.
- Website JavaScript syntax check. Static validation covers 10 KaTeX expressions, local assets and CSS fonts, anchors and IDs, four scholarly author tags, DOI/canonical metadata, structured data, downloadable/visible citation consistency, image alternatives, and animation controls.
- Responsive CSS reviewed for narrow layouts, wrapping buttons, full-width figures, and labelled scrollable tables; intrinsic image dimensions corrected to match figure aspect ratios.
- Social preview exported and visually inspected at 1200×630.

## Verification boundaries

No connected browser was available during preparation. Desktop/mobile rendering, keyboard interaction, clipboard behavior, browser console errors, and actual browser animation playback have not been directly tested. Static/source checks are not a substitute for those checks.

`.github/workflows/pages.yml` performs HTML validation, static validation, deployment, and an HTTP smoke test of the live page and core assets. Consult the [Website workflow](https://github.com/SOLARIS-JHU/Battery-MI-DPC/actions/workflows/pages.yml) for the actual run outcome; this record does not infer deployment success from a commit.

The initial repository state had Pages disabled. Initial Pages enablement requires repository administration access beyond the connected commit tools; the workflow is prepared to deploy once its source is set to GitHub Actions in Settings → Pages.
