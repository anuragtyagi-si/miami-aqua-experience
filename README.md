# Miami Aqua Experience

A finished, mobile-first sales funnel for Miami Aqua Experience, built as a Freelancer contest concept. React, TypeScript, Vite, Lucide, ESLint, Prettier and Vitest; no runtime CDN or third-party form dependency.

## Run locally

Requires **Node.js 22.12+** (or a supported newer LTS) and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check         # lint, booking-rule tests, TypeScript, production build
npm run format:check
npm run preview      # serve the production build after npm run build
```

Deploy `dist/` to any static host after `npm run build`. All images, video, icons and fonts are local; the only outbound navigation is to original Instagram sources. The production JS bundle is tree-shaken and video is loaded only when opened.

## GitHub Pages

The public site is hosted at **https://anuragtyagi-si.github.io/miami-aqua-experience/**.
The `Deploy GitHub Pages` workflow checks and builds the React app from **main**, then publishes `dist/` through GitHub's official Pages actions. It runs on pushes to main or can be run manually against main. Repository Settings → Pages uses **GitHub Actions** as the publishing source; no generated build files or separate publishing branch are committed.

Vite's base path is `/miami-aqua-experience/`; media URLs use that same base. For local development or production preview, open the printed URL with `/miami-aqua-experience/` appended. The design, media, pricing and booking rules are unchanged by deployment.

## Booking behavior

- Choose wake surfing ($350) or e-foil / e-surf ($350, 2 hours).
- Choose 1–6 guests, a date in the next 90 days, and one of 9:30 am, 12:30 pm or 3:30 pm.
- Dates and elapsed slots use **America/New_York**, including daylight saving time, independently of the visitor’s timezone.
- Enter every guest’s name and one international phone number, review the details, acknowledge preview mode, and confirm.
- A confirmation reference and downloadable text summary complete the flow. No account, payment, external message, or backend submission occurs. Personal information exists only in React memory and disappears on reload.

**Pricing decision:** The supplied brief says $350 per experience, not per person. The total therefore stays $350 when party size changes. This is explicit in the UI. The preview’s six-guest planning limit is not a claim about actual operating capacity. Confirm commercial pricing and capacity with the operator before making this a live booking system.

## Preview versus live operation

This is intentionally a **clearly labelled contest preview**, not a real reservation or payment system. It does not invent company availability, reviews, certifications, cancellation rules or contact details. A real launch needs an operator-approved availability/booking API, payment provider if needed, server-side validation, capacity rules, customer notifications, and privacy/retention policies. No submission to Freelancer is performed.

## Project structure

```text
src/
  App.tsx              Landing page sections and accessible media dialog
  BookingFunnel.tsx     Three-step flow, review, confirmation and receipt
  Calendar.tsx          Month navigation and date selection
  booking.ts           Typed services, price and Miami-time validation rules
  booking.test.ts      Booking, timezone, phone and pricing regressions
  styles.css           Design tokens and responsive styles
public/assets/         Optimized real Instagram media and local fonts
docs/media-sources.md  Exact Instagram provenance for every photo and video
.github/workflows/     CI: formatting, lint, tests, type checking, build, audit
```

Accessibility includes semantic landmarks and fieldsets, radio-group input semantics, visible focus states, a keyboard-dismissable native modal, descriptive alt text, a skip link, live error messages, reduced-motion support, mobile navigation and touch-sized controls.

See [media sources](docs/media-sources.md) for original posts and processing details.
