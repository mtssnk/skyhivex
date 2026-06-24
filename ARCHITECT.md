# ARCHITECT.md — SkyHive X

Brochure site for a drone light show company based in the USA. Headless CMS (Payload 3) + Astro 6 frontend.

See `SPEC.md` for detailed field-level specifications and page breakdowns.

---

## Goals

- Showcase projects and services to prospective clients
- Keep all content publicly accessible (no gated content)
- Implement web design from Figma

---

## Architecture decisions

### Headless CMS + separate frontend

Payload 3 handles content authoring and serves a REST API. Astro consumes this API server-side. This keeps the admin UI and public site decoupled, so the CMS can be deployed independently and the frontend can be replaced without changing content.

### Astro render strategy (SSR, static, or hybrid)

**Status: TBD (intentional).**

Current operational setup:

- Deploy both CMS and frontend on **Railway** to keep infrastructure simple during planning.

Final decision pending:

- Choose **SSR**, **static**, or **hybrid** once requirements, editor workflow, and performance targets are confirmed.

Notes:

- SSR: newly published pages can go live without a frontend rebuild.
- Static/hybrid: may require rebuild/deploy hooks depending on prerender strategy.

### Collections

- Projects - Each project requires a listing image, a heading and a client name. The project page will display the heading in the hero and the listing image in the background if another media item isn't specified in the CMS (can be image or video with alpha opacity options). We can utilise the hero block on the front end. There is an optional intro section (textarea) which is displayed before the project summary section. The project summary section consists of an array field consisting of label and value. A project can have a category or more than one.
- Pages - see below
- Media
- Posts - A post requires a heading and a listing image. The rest of the news post page consists of blocks. News posts can have a category or more than one.
- SVGs

### Pages collection instead of Globals

All pages (Home, FAQs and future pages) are documents in a single `Pages` collection. Each document has a `slug` field that maps to its URL. Astro uses `pages/index.astro` for the home slug and `pages/[slug].astro` as a catch-all for other pages.

This allows CMS editors to create a new page (for example, Services) without developer changes to route files.

Most pages are block-based. Current exceptions under discussion:

- News collection pages
- Projects collection pages
- Contact page template

These may use predefined templates/fields, with optional block content appended after templated content.

### Contact page

This is a templated page with a heading, and a templated form. The contact number, email address and postal address are output from the Site Settings CMS section. There is a text section which is displayed below the contact details and edited via the contact page section in the CMS.

### Shared block system (Payload Blocks field)

Page content is built from shared block types. Blocks are defined once in `cms/src/blocks/` and imported into any collection or global that needs flexible content. This is equivalent to ACF Flexible Content in WordPress: adding a new block type in one place makes it available wherever that block set is used.

Each block has an **Anchor ID** field for hash-link navigation.

---

## Common block options

- **Padding**: Editor chooses top, bottom, or both; size options are small, medium, large, or extra-large. These map to custom Tailwind spacing classes.
- **Anchor ID**: String used for hash anchor links. No spaces; alphanumeric plus `-` and `_` only.

## Block definitions

### Hero

- **Heading**: Text field with optional emphasis syntax using double curly braces, e.g. `This is the {{hero block}}`.
- **Subtitle**: Text field.
- **Intro**: Textarea field.
- **Buttons**: Array field. Each button includes:
  - Label/text
  - Type: scroll to section (anchor), open video (self-hosted), or page link
  - Variant: solid or outline
  - Colour: white or green
  - Conditional fields based on selected button type
- **Background media**: Image, video, or GLSL shader (single option currently).
- **Overlay alpha**: Adjustable opacity to improve text contrast.

### Text and Media

Two variants:

1. **Split viewport variant**: media spans 50% viewport width and 100vh on wide viewports.
2. **Contained grid variant**: text and media are constrained in a 12-column container, each taking half width on wide viewports.

Fields:

- Heading text field (supports double-curly-brace emphasis)
- Heading style selection
- Body copy (WYSIWYG)
- Media position (left or right)
- Media type (image or self-hosted video, muted/loop/autoplay)

For the contained variant, selectable media aspect ratios:

- 4:3, 16:9, square, 3:4, or auto

### Media

- Image or video
- Video behavior: background playback (muted, looped, autoplay)
- Optional button opens unmuted video in a dialog
- Optional heading with selectable heading style
- Overlay alpha option when text is present
- Size options: full screen, large (container width), small
- Aspect ratio options available

### Illustration card list

- List of cards, each with heading, body copy, and illustration
- Illustration choices are predefined (not user-uploaded)
- Optional section heading above cards
- Optional button link below cards

### News card list

Editor can:

- Manually pick up to three articles
- Select a category and show the latest three in that category
- Show the latest three articles overall

Optional button label/text links to the news index page. If empty, the button is hidden.

### Project list

Editor can:

- Manually pick projects
- Select a category and number of projects
- Show a selected number of latest projects

Optional button label/text links to the projects index page. If empty, the button is hidden.

### Body copy

- WYSIWYG content block

### Testimonial

- Quote style selection
- Quote text (textarea)
- Attribution text (text field)

### CTA

- Full-width block
- Required background image
- Optional contrast overlay alpha
- Text with selectable typographic style
- Button link

### Person list

- Heading
- Body text (WYSIWYG)
- Array of people:
  - Image (required)
  - Name (required)
  - Job role

### Accordion list

When the heading is clicked, the body is revealed.

- Heading (text field)
- Body text (WYSIWYG)

---

## Current state vs planned state

### Current state

- CMS and frontend are deployed on Railway
- Astro runs on Node runtime
- Final render strategy is not yet decided

### Planned state

- Finalise render strategy after design and workflow validation
- Define caching policy and publish-to-live SLA
- Confirm long-term hosting pattern after render decision

---

## Decision log (ADR-lite)

| ID  | Decision                                    | Status   | Date       | Owner |
| --- | ------------------------------------------- | -------- | ---------- | ----- |
| D-1 | Payload CMS + Astro frontend                | Accepted | 2026-06-19 | Team  |
| D-2 | Deploy CMS + web on Railway (initially)     | Accepted | 2026-06-19 | Team  |
| D-3 | Astro render strategy: `output: 'static'`   | Accepted | 2026-06-24 | Team  |
| D-4 | Template exceptions (News/Projects/Contact) | Proposed | 2026-06-19 | Team  |

## Assumptions / unknowns

- Figma may still refine spacing, breakpoints, and media ratios
- Contact form backend/provider is not finalised
- News/Contact template boundaries vs block flexibility need confirmation
- SEO metadata requirements per page type need confirmation

## Performance and caching targets (draft)

- Mobile LCP target (p75): <= 2.5s
- Optimised responsive media across media-heavy blocks
- Publish-to-live SLA by render strategy:
  - SSR: near-instant
  - static/hybrid: rebuild + deploy within agreed SLA

## Editorial workflow (draft)

- Draft → review → publish flow in Payload
- Define preview URL/auth model
- Define rollback expectations (republish prior revision)
- Confirm publish permissions by role

## Requirements traceability (template)

| Requirement                    | CMS schema file          | Web type/API impact      | Web route/component         | Acceptance criteria                                                  |
| ------------------------------ | ------------------------ | ------------------------ | --------------------------- | -------------------------------------------------------------------- |
| Hero supports background video | `cms/src/blocks/Hero.ts` | `web/src/lib/payload.ts` | `web/src/blocks/Hero.astro` | Video renders correctly, overlay works, responsive behavior verified |
