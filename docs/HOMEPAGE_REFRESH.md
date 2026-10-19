# Homepage refresh: outline development first

Based on the latest default branch, `001-build-a-landing`, at
`3a0cf660b3eb02a4d1310b36491ffd3744557b89` (the merge of PR #7).
No `AGENTS.md` was present; the existing development guidance was inspected.

## What changed

The opening now explains the starting service: helping someone shape a book idea
into a clear outline. “Discuss your book” leads to Contact; Marc’s published books
are the secondary action. The page then presents outline development, formatting
and KDP support, the three-step process, a short introduction to Marc, his books,
his personal web projects and the enquiry route.

The former ghostwriting/editorial team language, timing and package promises,
ARC counts and guaranteed reviews have been removed from the page and service
popup data. ARC is absent from the cards, popup options, contact selector and
footer. AI assistance and Marc’s review of deliverables are explained explicitly.
No prices, qualifications, testimonials, revision allowances or customer results
have been added.

The fox artwork and blue/teal identity remain. The styling now uses system fonts
and Georgia, calmer spacing, bounded content widths, dark action buttons, shared
card treatments and visible keyboard focus. Decorative animation and the unused
Facebook embedding script were removed. This also replaces the malformed CSS
block that prevented the Contact/footer styling from applying. No dependencies
were added and the package manifests and hosting settings are unchanged.

All five existing book covers remain, using `object-fit: contain` in both cards
and popups. No genuine screenshots of the two web projects existed in the
repository, so the missing portfolio image slots were omitted. The sites are
described as Marc’s own projects without client or customer outcome claims.

## Contact and PR #7 safeguards

The enquiry form has no destination and its submit button stays disabled. Its
unavailability notice appears before the first input, and the existing Facebook
profile is the prominent alternative. Newsletter navigation, signup UI and its
unused form initializer were removed while signup is unavailable.

PR #7’s email validation, associated error messages, placeholder-action guard,
HTTP response handling and double-submit guard remain. The shared modal lifecycle
is preserved: Contact closes the popup, releases scroll lock and focuses the
Contact heading; the next Tab reaches Facebook. Escape, Close and backdrop clicks
restore the opener. Same-page navigation now scrolls immediately to avoid competing
long scroll animations. Mobile navigation remains usable without JavaScript.

## Verification performed

- `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` completed without
  changing the lockfile. No new dependencies were installed into the project.
- `npm run lint`, both application JavaScript syntax checks and `git diff --check`
  passed. `npm run build` passed; it is the repository’s static-site no-op.
- **38 Playwright checks passed**, with no skips: 19 at desktop 1440×1000 and 19
  at mobile 390×844, using Chromium. The suite covers the retained enquiry and
  popup safeguards plus the refreshed hierarchy, navigation, mobile menu, image
  loading, contained book covers, visible focus and primary-button text contrast.
- Horizontal overflow was checked at 320, 390, 768, 1024 and 1440 pixels. None
  was observed. Keyboard checks include skip navigation, Tab/Shift+Tab, Enter,
  Escape, modal focus containment and focus restoration.
- Separate local desktop pointer and mobile touch checks exercised all three
  service Contact actions. Captures were visually inspected at both widths.
- Form success, HTTP rejection, network failure and pending submission checks
  use **intercepted test-only responses**. All unmocked external requests are
  blocked in the test suite. No real enquiries or subscriptions were sent.

This is functional Chromium and local visual verification, not a full WCAG audit.
Other browser engines, physical mobile devices, screen readers, real Facebook
messaging, Formspree delivery and the public deployment remain unverified. The
environment’s egress proxy denied the public site (CONNECT 403). A deploy preview
must be obtained from the PR’s Netlify integration when available; no production
deployment was requested or triggered manually.

## Screenshots

These are local captures, not screenshots of a published deployment. Opening
captures include the live header. For the full-height section captures only, the
sticky header was hidden during capture so it does not obscure content halfway
through a tall mobile section.

| Section | Desktop | Mobile |
| --- | --- | --- |
| Opening | [View](screenshots/opening-desktop.png) | [View](screenshots/opening-mobile.png) |
| Services | [View](screenshots/services-desktop.png) | [View](screenshots/services-mobile.png) |
| How it works | [View](screenshots/how-it-works-desktop.png) | [View](screenshots/how-it-works-mobile.png) |
| Marc’s books | [View](screenshots/books-desktop.png) | [View](screenshots/books-mobile.png) |
| Contact | [View](screenshots/contact-desktop.png) | [View](screenshots/contact-mobile.png) |

## Remaining owner decisions

- Supply an owner-verified Formspree enquiry endpoint and confirm the intended
  recipient before enabling the form. The site does not read a hosting variable
  named `FORMSPREE_ENDPOINT`; a real `action` must be configured on `.contact-form`.
  Keep the initial disabled button: JavaScript enables it only for a valid action
  shape. Once a destination is verified, update the surrounding availability copy
  and verify actual delivery separately.
- Supply approved Privacy Policy and Terms content and their published URLs. The
  footer continues to show unavailable notices, with no invented legal text.
- Provide verified purchase and Goodreads URLs if book actions should return.
  They remain absent in cards and popups until destinations are available.
- Confirm a real ARC offering before considering its return. No reviewer-count
  or review guarantee should be restored without an appropriate basis.
- Confirm newsletter destination and consent/privacy arrangements before adding
  signup back to the site. No signup UI remains in this version.

Historical PR #7 notes are in [the previous review](ENQUIRY_NAVIGATION_REVIEW.md).
