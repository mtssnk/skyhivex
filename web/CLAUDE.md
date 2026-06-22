# Web — Figma to Code

This document describes the conventions used in the Figma file and how they map to markup, Tailwind classes, and codebase files. It applies to this project and to any future projects derived from this boilerplate.

## Styling approach

Use Tailwind utility classes as the primary styling mechanism. Avoid scoped component styles. Custom CSS classes (e.g. `container`, typography utilities) are defined globally in `global.css` or `typography.css`. Do not output `<style>` blocks in Astro components unless there is no Tailwind equivalent.

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

`--content-max` and `--gutter` are set in `:root` in `global.css`.

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
| `block/LogoList`   | `blocks/LogoList.astro`   |                                |
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

The Figma variable collection **Tailwind Dimensions** maps to Tailwind v4's built-in numeric spacing scale (e.g. `4` = 16px, `8` = 32px). These are already part of Tailwind v4 defaults — no additions to `global.css` are needed.

When a Figma layer has a spacing value not assigned to a variable, round it to the nearest Tailwind value at your discretion. For example, a 17px gap → `gap-4` (16px). Use an arbitrary value (e.g. `gap-[17px]`) only if the discrepancy is large enough that the nearest step would be visually wrong.

### Clamp spacing (custom scale)

The Figma variable collection **Clamp Spacing** contains fluid values clamped between breakpoints. These are defined in `web/src/styles/global.css` inside `@theme` as `--spacing-*`:
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

Colour variables are defined in `web/src/styles/global.css` inside `@theme` as `--color-*`. These generate Tailwind colour utilities (`bg-*`, `text-*`, `border-*`, etc.).
