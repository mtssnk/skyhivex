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
| `block/CardList`   | `blocks/CardList.astro`   |                                |
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

| Figma name                  | Astro file                         | Notes                                       |
| --------------------------- | ---------------------------------- | ------------------------------------------- |
| `component/Card/Link`       | `components/CardLink.astro`        | Separate files — designs vary significantly |
| `component/Card/Text`       | `components/CardText.astro`        |                                             |
| `component/BackgroundMedia` | `components/BackgroundMedia.astro` | Full CMS-controlled background — see below  |
| `component/Button`          | `components/Button.astro`          |                                             |

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

Some things shouldn't be re-initialized on navigation at all — they should physically survive: an open mobile nav, scroll position, a GTM script that's already injected. `transition:persist` tells Astro to move the *old* DOM element into the new page instead of swapping in a fresh one.

Two non-obvious rules, both learned the hard way:

- **It must be on the actual HTML element, not passed as a prop at a component's call site.** `<Header transition:persist />` in `Layout.astro` does nothing — it only auto-forwards for hydrated islands (`client:*` components). For a plain `.astro` component, put the directive on the root element *inside* that component (e.g. directly on `<header>` in `Header.astro`).
- **Every top-level sibling element needs it independently.** `Header.astro` renders `<header>` and `<nav id="mobile-nav">` as siblings, not one nested in the other — persisting only `<header>` broke the mobile nav toggle, because its script held a closure reference to the non-persisted `#mobile-nav`, which got replaced on every navigation while the (persisted, still-listening) toggle button kept updating the detached old one. Both siblings now carry `transition:persist`.

**Rule of thumb:** reach for `astro:page-load` when a script needs to do something on every navigation; delegate from `document` when binding to elements that might not survive a swap; use `transition:persist` directly on an element when you want its actual state — not just its re-initialization — to carry over.
