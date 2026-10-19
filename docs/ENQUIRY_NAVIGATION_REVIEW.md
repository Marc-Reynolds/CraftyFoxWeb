# Enquiry and navigation fixes

Review base: `f20f77dcade3a88cbad8007e593e742d3b398a58`.
The remote has no `main` branch. Its default branch, `001-build-a-landing`,
was fetched and inspected and still pointed to that commit. No `AGENTS.md`
was present in the checkout or its workspace ancestors.

## Behaviour fixed

- Contact and newsletter email fields use native HTML email syntax validation,
  accepting `marc@example.com` and plus addressing. Required/invalid feedback is
  associated with the field, announced through alert regions, and reflected in
  `aria-invalid`. A configured form focuses the first invalid field on submit.
  Feedback space is reserved to prevent a blur error moving the submit button
  during a mobile click.
- Both forms have no action and disabled submit buttons in the shipped HTML.
  Visible notices explain that enquiry/signup is unavailable. This also prevents
  implicit Enter submission without JavaScript. JavaScript blocks missing,
  malformed and placeholder Formspree actions, including programmatic
  `requestSubmit()`. No placeholder receives a request.
- Once a real Formspree action is configured, JavaScript enables that form.
  Only an HTTP success response produces success feedback and resets the fields.
  Non-success responses and network failures preserve the entered values and
  display an error. Pending submissions cannot send twice.
- All ten unavailable book-card purchase/Goodreads actions, all ten equivalent
  popup actions, and four unavailable Amazon/Goodreads social actions are omitted.
  The Contact Facebook link reuses the exact profile URL already in the footer:
  `https://www.facebook.com/profile.php?id=61571109431155`.
- Each of the six service popup Contact actions closes the dialog, restores
  scrolling, navigates to Contact, and focuses its heading below the sticky
  header. The next Tab reaches the name field. Shared dialog handling traps Tab
  while open and restores focus to the opener on Escape, Close or backdrop click.
- The two Privacy Policy links and Terms of Service link previously pointed to
  missing `#privacy` / `#terms` sections. They now show plain unavailable notices.
  No policy text has been created or approved by this change.

## Configuration the owner must supply

| Item | Required input | Where it will be used |
| --- | --- | --- |
| Enquiries | The complete, owner-verified Formspree HTTPS `/f/` endpoint for the contact form, with its intended recipient configured and confirmed in Formspree | Add an `action` attribute to `.contact-form` in `index.html` |
| Newsletter | The complete, owner-verified Formspree HTTPS `/f/` endpoint for newsletter signup, and confirmation of the intended list/recipient and subscription process | Add an `action` attribute to `.newsletter-form` in `index.html` |
| Book actions | Verified Amazon purchase and Goodreads book URLs for each of Lucid Dream, The Lost Keys, How to Work Smarter, Reboot Your Career, and Dream Journal | Restore only the supplied card actions in `index.html` and set the matching `bookData` URLs in `src/js/modals-and-expansions.js`; missing values stay `null` |
| Social actions | Verified publisher/author Amazon and Goodreads profile URLs | Restore only the supplied Contact/footer actions in `index.html` |
| Privacy | Approved Privacy Policy content and its intended published URL | Replace the newsletter and footer unavailable notices with links only after that content exists |
| Terms | Approved Terms of Service content and its intended published URL | Replace the footer unavailable notice with a link only after that content exists |

The static site does **not** read a `FORMSPREE_ENDPOINT` environment variable;
setting the example variable in the old hosting notes alone will not configure
either form. Keep the HTML submit buttons disabled as a safe initial state:
JavaScript enables each only when its action has the expected Formspree URL
shape. That check validates configuration shape, not account ownership or
delivery. No credentials belong in the HTML. Do not replace missing destinations
with service homepages, searches or guessed URLs.

## Separate content decision: ARC claims

Both `index.html` (the ARC service detail block) and
`src/js/modals-and-expansions.js` (the `arc-review` popup data) claim:

- “Access to 200+ active book reviewers across genres”
- “Minimum 15-25 reviews guaranteed”

No supporting evidence was found in the repository. The owner should substantiate,
revise or remove these claims in a separate content review. They remain unchanged
in this focused fix; this review does not endorse them.

## Checks and reproduction

The original browser reproduction rejected both `marc@example.com` and
`marc+books@example.com`. Clicking a service popup Contact action changed the
hash but left the popup visible and body overflow locked. There were 15 static
`href="#"` links plus ten generated popup placeholders; neither legal target
existed.

The repository previously had no automated test runner (`npm test` only printed
a placeholder). This change adds a pinned Playwright test dependency compatible
with the existing Node 18 hosting pin, without changing hosting configuration.

```bash
npm ci
npm run lint
npm run build
npx playwright install chromium
npm test
```

To use an existing Chromium installation instead of downloading a browser:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

The tests start and stop their own local server on port 8081. All external
requests are blocked; form responses use test-only endpoints intercepted in the
browser, so no real enquiries or subscriptions are sent. Failure screenshots and
traces go to ignored `test-results/`.

Validation in this environment: **36 Playwright checks passed**, 18 at each
viewport, with none skipped. Node 24.19.0 and system Chromium 154 were used.

- Code checks: frozen-lockfile installation, HTMLHint, both JavaScript syntax
  checks and `git diff --check`. The existing build command succeeds but is a
  static-site no-op; there is no bundling step.
- Functional browser checks: Chromium at desktop 1440×1000 and mobile 390×844,
  including keyboard Tab/Shift+Tab/Enter/Escape, all six service CTAs, all five
  book popups, close/backdrop behaviour and focus/scroll restoration. Also checks
  forms and unavailable links with JavaScript disabled. Separate local browser
  checks also exercised a desktop pointer click and mobile touch tap on the
  Editing popup CTA and inspected the Contact/error states.
- Mocked form checks: accepted responses, HTTP 422 rejection, network failure,
  pending/double-submit behaviour, invalid-field focus and no requests to missing
  or placeholder destinations. These establish client behaviour only.
- Actual delivery: **unverified**. No configured destination was available and
  no enquiry or subscription was sent. A successful HTTP response would still
  not independently prove email arrival or newsletter fulfilment.
- Production: **unverified**. The environment's egress proxy denied access to
  `craftyfox-publishing.netlify.app` (CONNECT 403). External Facebook ownership,
  fonts/embedding, other browser engines, real mobile devices and assistive
  technology were not independently checked.

The two pre-existing portfolio image 404s and malformed CSS text in the existing
Contact/newsletter/footer styling block are outside this focused change. No
hosting settings, production deployment or legal content were changed.
