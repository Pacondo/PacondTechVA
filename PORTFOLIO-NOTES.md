# Portfolio editing notes

This is a buildless static HTML/CSS/JavaScript site. No package manager, lint,
type-check, or build scripts are configured. Serve the repository root with your
usual static preview server. The case study is at `/projects/larkhaven-realty/`;
directory-index hosting serves `projects/larkhaven-realty/index.html` without a
router or rewrite rules.

## Files

- `index.html`: all nine existing project cards and four filters; Larkhaven cards
  link to the dedicated page. Other cards expand their existing project approach
  and outcome under “View Case Study.”
- `css/portfolio.css`: scoped card styling and case study layouts, including mobile
  breakpoints, focus indicators, and reduced-motion support.
- `projects/larkhaven-realty/index.html`: case study copy, workflow explanations,
  technology details, screenshot references, and SEO metadata.
- `js/case-study.js`: native screenshot dialog with Escape, focus return, and
  background scroll locking.
- `js/script.js`: existing gallery behavior with keyboard support and bounded
  navigation, plus focus management for the existing lightbox.
- `js/project-demos.js`: existing demos retained and labeled sample simulations.

## Screenshots

Case study screenshots are in the `#screenshots` section of
`projects/larkhaven-realty/index.html`. Existing images remain in `images/n8n/`
and `images/GHL/Larkhaven Realty/`. Replace an image's `src`, `alt`, and caption
together. Use redacted images containing fictional information and test leads.

The “Claude AI qualification” dashed card is a labeled placeholder. Replace that
figure with the same button/image/figcaption markup as the other screenshot
figures. Its button must have `class="screenshot-open"`; the shared script then
opens the image in the lightbox automatically. Put the image under `images/` and
use a relative path beginning with `../../images/` on the case study page.

## Demo links

No external live-demo URL was present, so no “Try Live Demo” link was invented.
Existing browser simulations remain available on every homepage project card.
They use scripted data and do not connect to the real services.

Once you have verified a live demo, add an anchor with its actual HTTPS URL and
class `case-secondary` to the case study `.case-actions` and the corresponding
homepage `.port-body`. Label it “Try Live Demo.” For a new tab, include
`target="_blank" rel="noopener noreferrer"`.

Contact buttons return to the existing homepage contact section. No deployment,
publishing, or pushing is needed to review these local changes.
