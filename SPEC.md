# SPEC.md — SkyHive X

Detailed functional specification. Read alongside ARCHITECT.md.

---

## Design System

Design tokens, typography, and visual conventions extracted from the Figma file.

### Colour tokens

| Token          | Value     | Usage                                            |
| -------------- | --------- | ------------------------------------------------ |
| `--night`      | `#25202d` | Footer background, dark body text                |
| `--ash`        | `#f0f0f2` | Section backgrounds, light text on dark          |
| `--terracotta` | `#FF652C` | Secondary accent                                 |
| `--smoke`      | `#b5acbc` | Footer copyright, muted text                     |
| `--mist`       | `#716977` | Section labels, body text, card text             |
| `--sky`        | `#0934c8` | Outline button text/border, "view all"           |
| `--violet`     | `#6008e4` | Primary button, text links, work listing heading |
| `--white`      | `#ffffff` | —                                                |

### Typography

| Role            | Font                 | Weight     | Size | Notes                                              |
| --------------- | -------------------- | ---------- | ---- | -------------------------------------------------- |
| Hero headline   | Acumin Pro Wide      | Medium     | 64px | Line height 70px, tracking -1.28px                 |
| Section heading | Acumin Pro Wide      | Medium     | 40px | Tracking -0.8px                                    |
| Card heading    | Acumin Pro Wide      | Medium     | 24px | Tracking -0.48px                                   |
| Body text       | Acumin Pro           | Regular    | 14px | Line height 21px                                   |
| Large body      | Acumin Pro           | Regular    | 20px | Line height 38px                                   |
| Quote           | Acumin Pro           | Light      | 24px | Line height 34.8px, colour `--mist`                |
| Section label   | Acumin Pro Condensed | Medium     | 20px | Uppercase, tracking 1.4px, colour `--mist`         |
| Buttons         | Acumin Pro Condensed | Medium     | 18px | Uppercase, tracking 1.26px                         |
| Nav / tags      | Acumin Pro Condensed | Medium     | 20px | Uppercase, tracking 1.4px                          |
| Logo wordmark   | Acumin Pro Condensed | Bold/Light | 20px | "SKYHIVE" Bold, "X" Light, tracking 2.08px (TBD)  |

### Spacing

| Token             | Value    | Usage                      |
| ----------------- | -------- | -------------------------- |
| `--spacing-lg-d`  | `100px`  | Section top/bottom padding |
| Page gutters      | `112px`  | Left/right content inset   |
| Max content width | `1216px` | 1440px - 2×112px           |

### Buttons

| Variant   | Background     | Text colour | Border         | Shape                         |
| --------- | -------------- | ----------- | -------------- | ----------------------------- |
| Primary   | `--violet`     | White       | None           | Pill (`border-radius: 100px`) |
| Secondary | `--terracotta` | `--night`   | None           | Pill (`border-radius: 100px`) |
| White     | White          | `--violet`  | None           | Pill                          |
| Outline   | Transparent    | `--violet`  | 2px `--violet` | Pill                          |

### Header

Two variants — both are 103px tall, content starts at 112px from the left.

| Variant | Background  | Text colour | Usage                          |
| ------- | ----------- | ----------- | ------------------------------ |
| Dark    | Transparent | White       | Overlaid on hero (dark images) |
| Light   | White       | `--night`   | All other pages                |

Nav links: **Work, Services, About, Contact**

### Site identity

- **Site name**: SkyHive X
- **Contact email**: TBD
- **Phone**: TBD
- **Footer tagline**: TBD
- **Copyright**: © 2026 SkyHive X

---

## CMS Specification

### Collection: `SVGs`

A library of reusable inline SVG assets. Used by the LogoList and CardList blocks. Defined once and referenced by relationship wherever needed.

| Field  | Type     | Required | Notes                                                                 |
| ------ | -------- | -------- | --------------------------------------------------------------------- |
| `name` | Text     | Yes      | Admin label, e.g. "Partner logo", "Service icon"                      |
| `code` | Textarea | Yes      | Raw SVG markup. Must use `fill="currentColor"` for CSS colour control |

Admin UI notes:

- Use `name` as the list title field
- Add a description in the admin reminding editors to use `fill="currentColor"` on all fill attributes

Frontend:

- Rendered as inline SVG via Astro's `set:html` directive
- CSS `color` property on the parent element controls the fill

---

### Shared blocks

Blocks are defined in `cms/src/blocks/` and imported into any collection or global that needs a `blocks` field. Adding a new block type in one place makes it available everywhere.

---

#### Block: `Hero`

Full-width hero section with a heading and one or more call-to-action buttons.

| Field     | Type  | Required | Notes                   |
| --------- | ----- | -------- | ----------------------- |
| `heading` | Text  | Yes      | Main hero heading       |
| `buttons` | Array | No       | One or more CTA buttons |

Each button in the `buttons` array:

| Field      | Type   | Required    | Options                   | Notes                                                                               |
| ---------- | ------ | ----------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `label`    | Text   | Yes         | —                         | Button text                                                                         |
| `type`     | Select | Yes         | `page`, `scroll`, `video` | Controls which destination field is shown                                           |
| `url`      | Text   | Conditional | —                         | Shown when `type = page`. Full URL or relative path                                 |
| `anchorId` | Text   | Conditional | —                         | Shown when `type = scroll`. CSS ID of the target element on the page (without `#`)  |
| `videoUrl` | Text   | Conditional | —                         | Shown when `type = video`. Hosted video URL (YouTube, Vimeo, etc.)                  |

Frontend behaviour:

- `page` — standard `<a href>` link
- `scroll` — `<a href="#anchorId">` with smooth scroll via CSS `scroll-behavior: smooth`
- `video` — button opens the video URL in a lightbox/modal overlay

---

#### Block: `LogoList`

A labelled row of SVG logos, typically used for client or partner showcases.

| Field     | Type                      | Required | Notes                                |
| --------- | ------------------------- | -------- | ------------------------------------ |
| `heading` | Text                      | Yes      | Section heading                      |
| `logos`   | Relationship (SVGs, many) | Yes      | Ordered list of SVG items to display |

Frontend behaviour:

- Each logo rendered as inline SVG via `set:html`
- `fill="currentColor"` in the SVG code allows logo colour to be set via CSS

---

#### Block: `WorkList`

A hand-picked selection of Work entries. Always shows a "View all" link to `/work`.

| Field          | Type                      | Required | Notes                                                  |
| -------------- | ------------------------- | -------- | ------------------------------------------------------ |
| `works`        | Relationship (Work, many) | Yes      | Min 1, max 3 Work entries selected by the editor       |
| `viewAllLabel` | Text                      | No       | Label for the view all link. Default: "View all work"  |

Frontend behaviour:

- Renders each Work entry as a card showing `listingMedia` and `client`
- Each card links to `/work/[slug]`
- "View all" link always points to `/work`

---

#### Block: `CardList`

A titled section containing a grid of service cards. Cards are not linked.

| Field      | Type  | Required | Notes           |
| ---------- | ----- | -------- | --------------- |
| `title`    | Text  | Yes      | Section heading |
| `services` | Array | Yes      | List of cards   |

Each item in the `services` array:

| Field   | Type                     | Required | Notes                                      |
| ------- | ------------------------ | -------- | ------------------------------------------ |
| `icon`  | Relationship (SVGs, one) | No       | Optional SVG icon from the SVGs collection |
| `title` | Text                     | Yes      | Card heading                               |
| `body`  | Textarea                 | Yes      | Card body text                             |

---

#### Block: `ContactForm`

A heading above a hardcoded contact form. Submission handling is TBD.

| Field     | Type | Required | Notes           |
| --------- | ---- | -------- | --------------- |
| `heading` | Text | Yes      | Section heading |

Hardcoded form fields (defined in the Astro component, not the CMS):

- Name (text input, required)
- Email (email input, required)
- Message (textarea, required)

---

#### Block: `MediaText`

Two-column layout with a media item and rich text. Column order is switchable.

| Field           | Type         | Required | Options         | Notes                              |
| --------------- | ------------ | -------- | --------------- | ---------------------------------- |
| `media`         | Upload       | Yes      | —               | Relationship to `media` collection |
| `text`          | Rich text    | Yes      | —               | Lexical editor                     |
| `mediaPosition` | Radio/Select | Yes      | `left`, `right` | Controls column order              |

Frontend behaviour:

- `left` — media in left column, text in right
- `right` — media in right column, text in left
- Both columns equal width by default; stacks to single column on small screens

---

#### Block: `Media`

A single media item. Display options TBC pending Figma review.

| Field         | Type   | Required | Options | Notes                              |
| ------------- | ------ | -------- | ------- | ---------------------------------- |
| `media`       | Upload | Yes      | —       | Relationship to `media` collection |
| `aspectRatio` | Select | TBC      | TBC     | e.g. `16:9`, `4:3`, `auto`         |
| `alignment`   | Select | TBC      | TBC     | e.g. `left`, `center`, `right`     |
| `columnWidth` | Select | TBC      | TBC     | e.g. full, contained               |

---

#### Block: `Quote`

A pull quote, typically attributed to a client.

| Field         | Type     | Required | Notes                  |
| ------------- | -------- | -------- | ---------------------- |
| `quote`       | Textarea | Yes      | The quote text         |
| `attribution` | Text     | No       | Person or company name |

---

### Collection: `Work`

#### Field specification

| Field             | Type            | Required | Validation / behaviour                                                    |
| ----------------- | --------------- | -------- | ------------------------------------------------------------------------- |
| `title`           | Text            | Yes      | Freeform — not derived from client name                                   |
| `slug`            | Text            | Yes      | Auto-generated from `title`, lowercase, hyphens. Locked after first save  |
| `client`          | Text            | Yes      | Displayed above `title` in hero and on listing card                       |
| `listingMedia`    | Upload (Media)  | Yes      | Supports image and video                                                  |
| `heroMedia`       | Upload (Media)  | No       | If empty, frontend falls back to `listingMedia`                           |
| `services`        | Array of Text   | No       | Free-text service tags, e.g. "Drone Show", "Choreography"                 |
| `url`             | Text            | No       | Must be a valid URL if provided                                           |
| `body`            | Blocks          | No       | MediaText, Media, Quote                                                   |
| `featured`        | Checkbox        | —        | Default: false                                                            |
| `metaDescription` | Text            | No       | SEO meta description (max 160 chars). Fallback: `client — title`          |
| `_status`         | Draft/Published | —        | Payload built-in; only published entries are shown on the frontend        |

#### Admin UI notes

- Use `title` as the admin list title field
- Group `listingMedia` and `heroMedia` together under a "Media" section in the admin
- Group `title`, `client`, `slug` at the top
- `services` displayed as a simple repeatable text input

---

### Collection: `Pages`

All site pages are documents in this collection. CMS editors can create new pages at any time without developer involvement — create a document, set a slug, add blocks, publish.

| Field             | Type            | Required | Validation / behaviour                                                                                           |
| ----------------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`           | Text            | Yes      | Page title, used in the `<title>` tag                                                                            |
| `slug`            | Text            | Yes      | URL path. `home` maps to `/`, all others map to `/[slug]`. Auto-generated from `title`, locked after first save  |
| `blocks`          | Blocks          | No       | Full page content via shared block definitions                                                                   |
| `metaDescription` | Text            | No       | SEO meta description (max 160 chars)                                                                             |
| `_status`         | Draft/Published | —        | Only published pages are publicly accessible                                                                     |

Reserved slugs (pre-seeded, not to be deleted or renamed):

| Slug      | URL        | Purpose      |
| --------- | ---------- | ------------ |
| `home`    | `/`        | Homepage     |
| `about`   | `/about`   | About page   |
| `contact` | `/contact` | Contact page |

Any additional slugs (e.g. `services`, `process`) create new publicly accessible pages automatically.

---

## Frontend Specification

### Navigation

Part of `src/layouts/Layout.astro`, rendered on every page. Two variants (dark/light) controlled by a prop passed from each page.

Links: **Work** (`/work`) · **About** (`/about`) · **Contact** (`/contact`)

Logo: icon SVG + wordmark, links to `/`. Final logo asset TBD.

---

### Footer

Fixed content — not CMS-managed. Part of `src/layouts/Layout.astro`.

- Left: logo icon + tagline (TBD)
- Right: email, phone, social icons (TBD)
- Bottom: copyright line + Privacy policy + Cookie policy links

---

### Media type handling

The `listingMedia`, `heroMedia`, and block `media` fields all accept image or video uploads via the `media` collection. The frontend must handle both:

- **Image** — render as `<img>` with the `alt` text from the Media document
- **Video** — render as `<video>` with `autoplay`, `muted`, `loop`, `playsinline` (no controls); no audio track expected

The media document's `mimeType` field is used to determine which element to render.

---

### Data fetching

All fetches are server-side. A typed helper module at `src/lib/payload.ts` wraps all Payload REST API calls.

Note: fetch strategy (SSR vs static with build-time fetch) is subject to the render strategy decision in ARCHITECT.md.

`depth=2` is used for Pages — this ensures relationships inside blocks (e.g. Work entries inside a WorkList block, Media inside those Work entries, SVGs inside a LogoList block) are fully populated in a single request.

| Helper                | Endpoint                                                                              | Used by                                   |
| --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| `getPageBySlug(slug)` | `GET /api/pages?where[slug][equals]=${slug}&where[_status][equals]=published&depth=2` | `pages/index.astro`, `pages/[slug].astro` |
| `getWork()`           | `GET /api/work?where[_status][equals]=published&depth=1`                              | `pages/work/index.astro`                  |
| `getWorkBySlug(slug)` | `GET /api/work?where[slug][equals]=${slug}&where[_status][equals]=published&depth=1`  | `pages/work/[slug].astro`                 |

---

### Block rendering

A single `BlockRenderer` component in `src/blocks/BlockRenderer.astro` accepts the `blocks` array and renders the correct component per `blockType`. Adding a new block type means adding one branch in BlockRenderer and one component file — no other changes required.

```
src/blocks/
├── BlockRenderer.astro
├── Hero.astro
├── LogoList.astro
├── WorkList.astro
├── CardList.astro
├── ContactForm.astro
├── MediaText.astro
├── Media.astro
└── Quote.astro
```

---

### Routing

| Astro route               | Behaviour                                                                        |
| ------------------------- | -------------------------------------------------------------------------------- |
| `pages/index.astro`       | Calls `getPageBySlug('home')`, renders via BlockRenderer                         |
| `pages/[slug].astro`      | Calls `getPageBySlug(slug)`, renders via BlockRenderer. Returns 404 if no match  |
| `pages/work/index.astro`  | Calls `getWork()`, renders work listing grid                                     |
| `pages/work/[slug].astro` | Calls `getWorkBySlug(slug)`, renders work detail. Returns 404 if not found       |

The `/work` routes are defined before the catch-all `[slug]` route so they take priority.

---

### Page specifications

#### Any page (`/`, `/about`, `/contact`, `/[slug]`)

Fetches: `getPageBySlug(slug)`

All content is driven by `Page.blocks` rendered via BlockRenderer. The editor controls block order and content entirely in the CMS. Returns 404 if no published page matches the slug.

---

#### Work listing (`/work`)

Fetches: `getWork()`

- Displays all published Work entries as a grid
- Each card: `listingMedia` (image or video) + `client` name, links to `/work/[slug]`
- No filtering or pagination at this stage

---

#### Work detail (`/work/[slug]`)

Fetches: `getWorkBySlug(slug)`

- Returns 404 if no published entry matches the slug

Sections (in order):

1. **Hero** — `heroMedia` (falls back to `listingMedia`), `client` above `title`
2. **Meta** — `services` list, `url` (if provided)
3. **Body blocks** — `Work.body` rendered via BlockRenderer

---

### SEO

Each page sets `<title>` and `<meta name="description">` via the base `Layout.astro`. Site name TBD.

| Route          | `<title>`                | `<meta name="description">`                                    |
| -------------- | ------------------------ | -------------------------------------------------------------- |
| `/[slug]`      | `Page.title — Site name` | `Page.metaDescription` if set, otherwise empty                 |
| `/work`        | `Work — Site name`       | Static fallback TBD                                            |
| `/work/[slug]` | `{client} — {title}`     | `Work.metaDescription` if set, otherwise `{client} — {title}`  |

---

### Error handling

- **404** — Astro's `src/pages/404.astro` handles all not-found routes. Both `[slug].astro` and `work/[slug].astro` return a 404 if no published document matches.
- **CMS unavailable** — if a Payload fetch fails, pages should fail gracefully. Implementation detail TBD.

---

## Open decisions

| Decision                    | Status | Notes                                                    |
| --------------------------- | ------ | -------------------------------------------------------- |
| Render strategy             | TBD    | SSR, static, or hybrid — see ARCHITECT.md D-3            |
| Contact form submission     | TBD    | Options: Resend, Formspree, Payload custom endpoint      |
| Media block display options | TBD    | Aspect ratio, alignment, column width — pending Figma    |
| CMS fetch error handling    | TBD    | Graceful fallback behaviour when Payload is unreachable  |
| Work listing pagination     | TBD    | Not needed initially                                     |
| Privacy/cookie policy pages | TBD    | Linked in footer — content and pages needed              |
| Site identity (logo, footer)| TBD    | Tagline, contact details, social links pending client    |
