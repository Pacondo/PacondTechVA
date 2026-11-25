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
- `css/portfolio.css`: aligned cards, workflow overview graphics, landscape preview
  frames, responsive layouts, and case study styling.
- `css/styles.css`: shared typography, accessible colors, focus indicators, and
  light-theme tokens.
- `css/image-viewer.css`: shared fit-to-screen and full-resolution viewer layouts,
  with the image, border, and controls zooming in together on opening, plus a
  backdrop fade; reduced motion skips those animations. The animated panel sits
  inside the dialog so the custom cursor keeps its viewport position.
- `css/landing-pages.css`: the landing page carousel: an open, frameless reel
  whose neighbor cards run out to the section's edges, the highlight ring,
  controls bar, and the "Show all" grid. Screenshots live in `images/landing pages/`. The dedicated
  `#landing-pages` section is linked from the main navigation and footer.
- `js/landing-gallery.js`: center-focus carousel. Places every card from one
  continuous reel position (looping with 3+ designs) and handles touch swipes,
  mouse drags and flicks, clicking a peeking neighbor, dots,
  Left/Right/Home/End keys, horizontal trackpad swipes, the "Show all" grid,
  screen reader announcements, and reduced motion.
- `projects/larkhaven-realty/index.html`: case study copy, workflow explanations,
  technology details, screenshot references, and SEO metadata.
- `js/project-gallery.js`: preview selection, thumbnail keyboard navigation,
  screenshot orientation, and gallery controls.
- `js/image-viewer.js`: shared native dialog for project, certificate, and case
  study images. Includes 100% zoom, previous/next, Escape, and focus return.
- `js/case-study.js`: active section navigation while reading the case study.
- `js/script.js`: homepage navigation, theme switch, project filters and counts,
  reduced-motion handling, and the existing resume interaction.
- `js/hero-handwriting.js`: SVG pen masks write the greeting once per page load,
  then restore the normal selectable heading. The stroke data matches the fixed
  words “Hey!”, “I'm”, and “Pacondo”; update the masks when changing that copy.
  The same Dancing Script Bold font is bundled in `images/fonts/` with its license.
  Reduced motion, font-loading failures, and disabled JavaScript show plain text.
- `js/project-demos.js`: existing demos retained and labeled sample simulations.

## Screenshots

All automation projects start with clearly labeled HTML workflow overviews,
including the n8n lead intake, invoice follow-up, and Facebook assistant builds.
Their actual screenshots are available in the thumbnail rail and through
"Inspect." Selected tall screenshots scroll inside the preview instead of
shrinking to an unreadable size. No screenshot assets were fabricated or replaced.

Homepage preview markup lives inside each project's `.port-gallery`. When
replacing a screenshot, update its thumbnail `src`, `data-full`, `alt`, and
`width`/`height` attributes. Set those dimensions to the new image's actual size;
they determine whether the preview should scroll. Update the initial viewport
image as well if it is the first screenshot. The original image is retained for
the full-resolution viewer; loading is lazy and asynchronous.

The landing page showcase uses `.landing-design-card` articles inside
`.landing-reel` in `index.html`. The active design sits in the center of the
stage while the previous and next designs peek in from both sides; swiping,
dragging, clicking a peeking design, or the dots bring a design to the
center. Clicking the centered image or its "Preview design" link opens the
shared image viewer (zoom, previous/next, Escape, focus return). In "Show all,"
clicking a design image or its preview link opens that viewer and keeps the grid
expanded; closing the viewer returns focus to the clicked preview. To add a
design, copy one of the later articles as a sibling inside `.landing-reel` and
update the image `src`, `alt`, and `width`/`height`, the `h3` title, and the
preview link's `href` and `aria-label`. The script numbers the labels, builds
the dots, and derives the count from the markup. Keep
screenshot paths, alt text, and dimensions in sync when replacing designs.

Case study screenshots are in the `#screenshots` section of
`projects/larkhaven-realty/index.html`. Existing images remain in `images/n8n/`
and `images/GHL/Larkhaven Realty/`. Replace an image's `src`, `alt`, and caption
together. Use redacted images containing fictional information and test leads.

The “Claude AI qualification” dashed card is a labeled placeholder. Replace that
figure with the same button/image/figcaption markup as the other screenshot
figures. Its button must have `class="screenshot-open"`; the shared viewer then
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

## Verification and remaining content

Local Chrome checks covered homepage widths of 320, 390, 768, 1024, and 1440px,
and the case study at 320, 390, 768, and 1440px. Filters, gallery arrow/Home/End
keys, image navigation, zoom, Escape, focus return, mobile navigation, both
themes, and all nine sample simulations were checked. Both reduced-motion and
animated simulation paths completed. No JavaScript runtime errors were detected.

Third-party requests were blocked for the final repeatable browser checks. This
does not verify the live Calendly embed or externally hosted font/icon services.
The calendar retains a direct booking link as a fallback.

The Claude qualification screenshot remains a labeled placeholder. Testimonials
remain empty with an honest availability message; add only approved feedback.
Other projects remain labeled portfolio builds, without invented client status
or results. The local-only refinement adds no dependencies and makes no changes
to hosting, deployment, or GitHub.
