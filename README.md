# Battery-MI-DPC project website

This directory follows the organization of [TQPNet](https://github.com/SOLARIS-JHU/TQPNet/tree/main/website): a buildless static site in `website/`, with `index.html`, `style.css`, `main.js`, and locally hosted assets under `static/`. The notebook remains at the repository root.

Published address: https://solaris-jhu.github.io/Battery-MI-DPC/

## Preview and validation

Serve this directory with a local static server, for example `python -m http.server 8000 --directory website` from the repository root, then open `http://localhost:8000`. Use HTTP rather than opening the file directly so the graphical-abstract controls can access the embedded SVG.

Run `node website/scripts/validate.mjs` from the repository root. It checks local HTML/CSS/SVG references, image alternatives, metadata, citation consistency, math parsing, and required interaction targets. It does not replace browser testing. GitHub Actions additionally runs the Nu HTML checker through `html5validator`.

The website has no application framework or package-installation step. Inter and Fraunces fonts, KaTeX, logos, the graphical abstract, and original paper plots are hosted locally. Keep their licenses and provenance records.

## Deployment

`.github/workflows/pages.yml` follows TQPNet's validate → deploy → live smoke-test pattern and publishes `website/` to GitHub Pages when relevant files change on `main`. Pull requests run validation only. The workflow also supports manual dispatch.

The repository's **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. Initial Pages enablement requires repository administration access; the default Actions token cannot perform that initial setup. Once enabled, later updates deploy automatically. A green source commit alone is not a verified live deployment; inspect the workflow's deploy and smoke jobs.

## Maintenance

- Edit scientific prose and tables in `index.html`. Check every change against `research/source-map.md` and the versioned paper.
- Read `research/paper-audit.md` and `research/code-audit.md` before changing claims about feasibility, generalization, gradients, or reproduction.
- Original Figures 2–4 are unmodified SVGs from arXiv v1. Their exact URLs, hashes, and figure locations are in `research/figure-provenance.md`.
- Regenerate the existing graphical abstract with `node scripts/generate-graphical-abstract.mjs` at the repository root, then synchronize the two SVGs from `figs/` into `website/static/figures/`. The website copies are intentionally local to the Pages publication directory.
- Regenerate the social-preview SVG with `node website/scripts/generate-social.mjs`. Export `website/static/og.svg` to `website/static/og.png` with Inkscape at its intrinsic 1200×630 size.
- Keep `citation.bib`, the visible BibTeX, and scholarly metadata consistent. IEEE metadata and the arXiv scientific source are distinct records.
- Before publishing, check desktop/mobile layouts, figure legibility, keyboard focus, copy, animation pause/restart, reduced motion, console errors, and the actual live URL when browser access is available.

## Attribution

The visual foundation uses TQPNet's Fraunces/Inter typography, JHU blue palette, 1100-pixel content width, 14-pixel radii, resource pills, logo treatment, and responsive layout principles. See `NOTICE` and `LICENSE` for website-code attribution. This does not relicense the notebook or paper figures.
