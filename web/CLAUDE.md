# Web — Figma to Code

This document describes the conventions used in the Figma file and how they map to markup, Tailwind classes, and codebase files. It applies to this project and to any future projects derived from this boilerplate.

## Styling approach

Use Tailwind utility classes as the primary styling mechanism. Avoid scoped component styles. Custom CSS classes (e.g. `container`, typography utilities) are defined globally in `_global.css` or `typography.css`. Do not output `<style>` blocks in Astro components unless there is no Tailwind equivalent.

Use `clsx` for any class string that contains conditional logic. Avoid template literal ternaries for this — `clsx` keeps conditionals readable and avoids accidental whitespace issues.

---

## Figma file structure

The Figma file has a page called **Layouts** which contains full-page layout frames. Each frame is named using the pattern `Collection - type`, e.g. `Project - listing`, `Project - detail`. The prefix before the dash is the CMS collection name; the suffix is the page type. These frames are desktop size by default. Responsive variants follow the pattern `Project - detail - mobile`, `Project - detail - tablet`.

Frames in **Layouts** are assembled from components and auto layouts, whose names drive the class names and file structure below.

---

## Layer names → classes

Figma layer names (frames, groups, auto layouts) are used as class names in the output markup, unless the name is an auto-generated Figma default such as `Frame 38` or `Group 12`.

| Layer name       | Class(es) applied |
| ---------------- | ----------------- |
| `container`      | `container`       |
| `grid`           | `grid`            |
| `flex`           | `flex`            |
| `container grid` | `container grid`  |
| `container flex` | `container flex`  |

Descriptive names that don't conflict with Tailwind utility classes may also be used as classes at your discretion (e.g. `work-list-intro`).

### container

```css
.container {
  width: 100%;
  max-width: calc(var(--content-max) + var(--gutter) * 2);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
```

`--content-max` and `--gutter` are set in `:root` in `_global.css`.

### grid

A layer named `grid` gets `class="grid"`. Default to a 12 column grid and apply the appropriated Tailwind col-span class to the grid elements, e.g. `col-span-4` will be 1/3 of a 12 column grid.

### flex

A layer named `flex` gets `class="flex"`. Apply `flex-col` or `flex-row` from the Figma auto layout direction, plus gap and alignment classes as appropriate.

---

## Blocks

Blocks live in `web/src/blocks/`. Each block must exist in both the CMS (`cms/src/blocks/`) and the frontend.

### Section identifier class

Every block's outermost element must carry a class in the format `section-{blockname}`, where `{blockname}` is the block slug in lowercase with no camelCase or hyphens (e.g. `section-logolist`, `section-worklist`, `section-mediatext`). This class is not used for styling — it exists for targeting in scripts, tests, and browser tooling.

Class names in this project follow standard CSS convention: always lowercase, never camelCase. CamelCase is non-standard in CSS and conflicts with the conventions used by Tailwind and every major naming system.

### Vertical padding CMS option

Every block has a CMS option controlling vertical padding. Two separate fields:

- **Where**: `top`, `bottom`, `both` (default: `both`)
- **Size**: `xl`, `lg`, `md`, `sm` (default: `lg`)

These map directly to Tailwind utility classes using the clamp spacing scale:

| Where / Size        | Class   |
| ------------------- | ------- |
| both + lg (default) | `py-lg` |
| top + sm            | `pt-sm` |
| bottom + xl         | `pb-xl` |

### Block list

| Figma name         | Astro file                | Notes                          |
| ------------------ | ------------------------- | ------------------------------ |
| `block/Hero`       | `blocks/Hero.astro`       |                                |
| `block/WorkList`   | `blocks/WorkList.astro`   |                                |
| `block/MediaText`  | `blocks/MediaText.astro`  | Left/right variant — see below |
| `block/MediaBlock` | `blocks/MediaBlock.astro` |                                |
| `block/Quote`      | `blocks/Quote.astro`      | Appears in Work Detail layout  |

`block/MediaText` has a left-media and right-media variant in Figma. These are handled as a single block with a CMS toggle (`mediaPosition: 'left' | 'right'`), not two separate blocks.

---

## Global components

| Figma name      | Astro file                |
| --------------- | ------------------------- |
| `global/Header` | `components/Header.astro` |
| `global/Footer` | `components/Footer.astro` |

### Header variants

Two variants controlled by a CMS or page-level option:

- **light** — light-coloured header, for use on dark backgrounds
- **dark** — dark-coloured header, for use on light backgrounds

---

## Components

Components live in `web/src/components/`.

| Figma name                  | Astro file                         | Notes                                      |
| --------------------------- | ---------------------------------- | ------------------------------------------ |
| `component/BackgroundMedia` | `components/BackgroundMedia.astro` | Full CMS-controlled background — see below |
| `component/Button`          | `components/Button.astro`          |                                            |

### BackgroundMedia vs MediaItem

`BackgroundMedia` (`components/BackgroundMedia.astro`) is a CMS-driven background media component with its own functionality (video/image toggle, overlay options, etc.). Refer to the Figma component description for the full CMS option set.

`MediaItem` (`components/MediaItem.astro`) is a simpler inline media element — used inside `MediaBlock`, work list cards, and similar non-background contexts.

### Button

| Prop      | Values                             | Default   |
| --------- | ---------------------------------- | --------- |
| `colour`  | `green`, `white`                   | `primary` |
| `size`    | `lg`, `md`, `sm`                   | `md`      |
| `variant` | `solid`, `text`, `outline`, `icon` | `solid`   |

## Tailwind spacing

### Tailwind Dimensions (numeric scale)

The Figma variable collection **Tailwind Dimensions** maps to Tailwind v4's built-in numeric spacing scale (e.g. `4` = 16px, `8` = 32px). These are already part of Tailwind v4 defaults — no additions to `_global.css` are needed.

When a Figma layer has a spacing value not assigned to a variable, round it to the nearest Tailwind value at your discretion. For example, a 17px gap → `gap-4` (16px). Use an arbitrary value (e.g. `gap-[17px]`) only if the discrepancy is large enough that the nearest step would be visually wrong.

### Clamp spacing (custom scale)

The Figma variable collection **Clamp Spacing** contains fluid values clamped between breakpoints. These are defined in `web/src/styles/_global.css` inside `@theme` as `--spacing-*`:
The following are examples and demonstrate the system being used, the final variables may vary.

```css
@theme {
  --spacing-2xs: clamp(...);
  --spacing-xs: clamp(...);
  --spacing-sm: clamp(...);
  --spacing-md: clamp(...);
  --spacing-lg: clamp(...);
  --spacing-xl: clamp(...);
  --spacing-2xl: clamp(...);
}
```

These generate Tailwind utility classes: `m-sm`, `p-lg`, `pt-xl`, `gap-md`, etc. Use them for block-level vertical padding and large structural spacing. Use the numeric Tailwind scale for component-level spacing.

---

## Typography

Typography utilities are defined in `web/src/styles/typography.css` using Tailwind v4's `@utility`. Use these class names directly in markup — do not inline raw font values.

---

## Colours

Colour variables are defined in `web/src/styles/_global.css` inside `@theme` as `--color-*`. These generate Tailwind colour utilities (`bg-*`, `text-*`, `border-*`, etc.).

---

## Routes and preview

Every CMS-backed page type has **two routes** that render the same output: a static one and a live-SSR preview one.

| Type | Static route | Preview route |
| ---- | ------------ | ------------- |
| Pages | `pages/index.astro`, `pages/[...slug].astro` | `pages/preview/index.astro`, `pages/preview/[...slug].astro` |
| News | `pages/news/[slug].astro` | `pages/preview/news/[slug].astro` |
| Projects | `pages/projects/[slug].astro` | `pages/preview/projects/[slug].astro` |

**The render logic lives once, in a view component** — `components/PageView.astro`, `components/PostView.astro`, `components/ProjectView.astro`. Each takes a resolved `page`/`post`/`project` prop (+ optional `isPreview`) and owns everything: `<Layout>`, `<Hero>`, JSON-LD, meta derivation, hero buttons, `<BlockRenderer>`. **Change page output here, not in a route file** — otherwise the static and preview versions drift.

A route file only carries what genuinely must differ between static and preview:

| Static route | Preview route |
| ------------ | ------------- |
| `export async function getStaticPaths()` | `export const prerender = false` |
| — | `Astro.response.headers.set('Cache-Control', 'no-store')` |
| — | cookie guard: `if (Astro.cookies.get('__preview')?.value !== 'true') return Astro.redirect(<public path>)` |
| `getXBySlug(slug)` | `getXBySlug(slug, { draft: true, apiKey: import.meta.env.PAYLOAD_API_KEY as string })` |
| — | `<XView … isPreview />` |

`export const prerender = false` must be a literal per-file export (statically analysed by Astro) — it can't be moved into a component or middleware, which is why the preview route file can't be collapsed away entirely.

Preview flow: the CMS "Preview" button hits `pages/api/preview.ts` (validates `PREVIEW_SECRET`, sets the `__preview` cookie, redirects to `/preview/…`); `pages/api/exit-preview.ts` clears the cookie. `Layout.astro`'s `isPreview` prop renders the "exit preview" bar.

## Images and responsive delivery

Two delivery paths, switched by the `PUBLIC_IMAGE_CDN_BASE` env var:

- **Set** (e.g. `https://media.skyhivex.com/cdn-cgi/image`) → Cloudflare Image Transformations resize / crop / re-encode on the fly at the edge (`format=auto` picks AVIF/WebP/original per the request). This is the target state — see `ARCHITECT.md` D-7.
- **Unset** (local dev, and production until the Cloudflare zone is ready) → falls back to the pre-generated Sharp `imageSizes` (`cms/src/collections/Media.ts`), uncropped, exactly as before.

Once the CDN cutover is verified in production, a cleanup commit removes `imageSizes` from `Media.ts`, deletes the orphaned `-WxH.webp` objects from R2, and drops the fallback branch from `MediaItem.astro`.

### `web/src/lib/image.ts`

- `cfImage(src, { width, height?, fit?, gravity?, quality })` — builds a `/cdn-cgi/image/…/<full source URL>` URL, or returns `src` untouched when the CDN base isn't set.
- `buildSrcset(src, { ratio?, gravity?, maxWidth? })` — a `srcset` across the width ladder `[400, 800, 1200, 1600, 2000, 2400]`. With `ratio` each candidate is a `width × round(width/ratio)` `fit=cover` crop; without it, width only. `maxWidth` (the source's real width, from `media.width`) caps the ladder so candidates never upscale.
- `focalGravity(focalX, focalY)` — `${x}x${y}` from Payload's focal-point fields (stored 0–100). The focal-point editor in the CMS is the crop-focus control; every crop uses it (default 50/50 = centre). No `gravity=auto`.
- Default quality is `72`.

### `web/src/components/MediaItem.astro`

Every CMS image/video renders through this one component. Branches:

| Prop | Situation | Renders |
| ---- | --------- | ------- |
| `crops={[{ media, ratio }, …]}` | **B** — art-directed | `<picture>`, one `<source media>` per group, last group is the `<img>`. Each group cropped to its `ratio`. |
| `aspectRatio="16/9"` etc. | **A** — one known ratio | `<img>` in an `aspect-*` wrapper, srcset cropped to that ratio. |
| neither | fluid, ratio unknown | `<img>`, width only, source ratio preserved. |
| video mimeType | — | `<video>` (with/without the aspect wrapper), always `media.url` directly. |

**A vs B — which surface is which.** If the display aspect ratio is knowable at build time it's A (crop server-side, zero wasted pixels). If it depends on the viewport it's B — an art-directed `<picture>` where each `<source media>` condition **mirrors the CSS mechanism that actually changes that container's shape**:

- **Hero background** — container tracks the viewport, so `(orientation: landscape)` (→ `16/9`) vs default portrait (→ `4/5`). A width breakpoint would misread a narrow desktop window.
- **MediaText split variant** — the ratio is redefined by the `lg:` CSS breakpoint, so `(min-width: 1024px)` (→ `1/1`) vs default (→ `4/3`). Orientation would misread a portrait tablet ≥1024px.

A `crops` group with `ratio` omitted = that breakpoint gets width-only, no crop.

**`priority` prop** → `loading="eager" fetchpriority="high"`. Only the hero background sets it (it's the LCP). Everything else defaults to `loading="lazy"`.

### `sizes` is still mandatory and must match the real rendered width

Per the HTML spec an `<img>`/`<source>` with `srcset` but no `sizes` defaults to `100vw` for candidate selection — the browser then downloads the largest candidate regardless of how small the element actually renders. This bit us before (every MediaText image loaded the 2400px variant). When adding or moving a `MediaItem` caller, work out the element's CSS width at each breakpoint from its grid/flex classes and write `sizes` to match — copy an accurate existing example (`Hero.astro`'s `"100vw"`, `NewsCardList.astro`'s `"(max-width: 768px) 100vw, 33vw"`). Nothing enforces `sizes` staying in sync with the layout.

### Other notes

- **Video** — `imageSizes` / transformations don't apply; `<video src>` is always `media.url`.
- **OG/social tags** — `Layout.astro`'s `og:image`/`twitter:image` use `media.url` (the original) directly; there's one `<meta>`, so no responsive selection.
- No `astro:assets` (`<Image>`/`<Picture>`) for CMS media — it optimizes local build-time assets, not remote R2 URLs.

---

## Page transitions

Astro's `<ClientRouter />` is enabled in `web/src/layouts/Layout.astro`. This intercepts same-origin link clicks and swaps `<body>` content via `fetch()` + DOM diffing (animated with the browser's View Transition API where supported) instead of doing a full page reload. The `document`/`window` are **never destroyed** across an internal navigation — it behaves like an SPA, not a series of independent page loads. This has real consequences for any script that assumes a classic page-load lifecycle:

### Problem 1: a script's top-level code only ever runs once per session

Browsers cache ES modules by URL for the life of the JS realm. Since the realm now persists across navigations, a `<script>` tag's top-level code (e.g. a bare `main()` call) will **not** re-run just because the same script tag reappears in a later swapped-in page — it already ran, once, the first time that module was ever evaluated.

**Fix:** if something needs to (re-)initialize on every navigation — not just the first — hook it to the `astro:page-load` event instead of calling it directly:

```js
function main() {
  // init logic
}
document.addEventListener('astro:page-load', main)
```

`astro:page-load` fires on the initial hard load **and** every subsequent client-side navigation, so this is the one event to reach for when something needs to "run after every page load." Register the listener once (on `document`, which persists) — it keeps firing for the rest of the session.

If the init does anything stateful (starts a render loop, opens a connection, adds other listeners), tear down the previous instance at the top of the handler before creating a new one, or you'll leak one instance per navigation. See `web/src/components/HexShader.astro` for a worked example (a WebGL canvas renderer that re-inits on every visit and destroys the previous instance first).

Astro also fires `astro:before-preparation`, `astro:after-preparation`, `astro:before-swap`, and `astro:after-swap` around each navigation. These are useful for temporary `console.log` debugging when working on transition behaviour, but aren't wired up permanently in the codebase — add and remove them locally as needed rather than leaving them in committed code.

### Problem 2: elements a script bound listeners to may no longer exist

Anything not explicitly persisted (see below) is torn down and replaced with fresh, un-hydrated HTML on every navigation. A listener bound directly to a specific element at load time ends up listening to a detached node once that element is swapped out, or the new element on the page has no listener at all.

**Fix:** delegate from `document` instead of binding to the element directly:

```js
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-video-url]')
  if (!trigger) return
  // ...
})
```

Since `document` persists, this only needs to be attached once and keeps working regardless of what gets swapped in and out of the page. See the video-trigger click handler in `web/src/layouts/Layout.astro` for a live example.

### `transition:persist` — keeping an element's actual state, not just re-initializing it

Some things shouldn't be re-initialized on navigation at all — they should physically survive: an open mobile nav, scroll position, a GTM script that's already injected. `transition:persist` tells Astro to move the _old_ DOM element into the new page instead of swapping in a fresh one.

Two non-obvious rules, both learned the hard way:

- **It must be on the actual HTML element, not passed as a prop at a component's call site.** `<Header transition:persist />` in `Layout.astro` does nothing — it only auto-forwards for hydrated islands (`client:*` components). For a plain `.astro` component, put the directive on the root element _inside_ that component (e.g. directly on `<header>` in `Header.astro`).
- **Every top-level sibling element needs it independently.** `Header.astro` renders `<header>` and `<nav id="mobile-nav">` as siblings, not one nested in the other — persisting only `<header>` broke the mobile nav toggle, because its script held a closure reference to the non-persisted `#mobile-nav`, which got replaced on every navigation while the (persisted, still-listening) toggle button kept updating the detached old one. Both siblings now carry `transition:persist`.

**Rule of thumb:** reach for `astro:page-load` when a script needs to do something on every navigation; delegate from `document` when binding to elements that might not survive a swap; use `transition:persist` directly on an element when you want its actual state — not just its re-initialization — to carry over.
