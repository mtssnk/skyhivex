# SPEC.md — SkyHive X

Detailed field-level specifications for collections and blocks. See `ARCHITECT.md` for architecture decisions and page structure.

---

## Collections

### Projects

Each project has fixed template fields for the listing and detail page, plus an optional blocks field for additional content below the template sections.

| Field                    | Type                      | Required    | Notes                                                         |
| ------------------------ | ------------------------- | ----------- | ------------------------------------------------------------- |
| `title`                  | Text                      | Yes         | Displayed in the hero and used to generate `slug`             |
| `slug`                   | Text                      | Yes         | Auto-generated from `title`. URL: `/projects/[slug]`          |
| `client`                 | Text                      | Yes         | Client name                                                   |
| `categories`             | Relationship (Categories) | No          | Has many                                                      |
| `listingImage`           | Upload (Media)            | Yes         | Used on the projects index and as the default hero background |
| `heroMedia`              | Group                     | No          | Overrides `listingImage` as the hero background if set        |
| `heroMedia.type`         | Select                    | Yes         | `image`, `video`                                              |
| `heroMedia.image`        | Upload (Media)            | Conditional | Required when `heroMedia.type` is `image`                     |
| `heroMedia.video`        | Upload (Media)            | Conditional | Required when `heroMedia.type` is `video`                     |
| `heroMedia.overlayAlpha` | Number                    | No          | 0–1                                                           |
| `intro`                  | Textarea                  | No          | Displayed before the project summary section                  |
| `summary`                | Array                     | No          | Project summary items                                         |
| `summary[].label`        | Text                      | Yes         |                                                               |
| `summary[].value`        | Text                      | Yes         |                                                               |
| `blocks`                 | Blocks                    | No          | Any shared block type. Appended after the summary section     |

---

### Posts

Each post has fixed template fields for the listing and the post header; the rest of the page is blocks.

| Field          | Type                      | Required | Notes                                               |
| -------------- | ------------------------- | -------- | --------------------------------------------------- |
| `title`        | Text                      | Yes      | Used to generate `slug`                             |
| `slug`         | Text                      | Yes      | Auto-generated from `title`. URL: `/news/[slug]`    |
| `categories`   | Relationship (Categories) | No       | Has many                                            |
| `listingImage` | Upload (Media)            | Yes      | Used on the news index and as the post header image |
| `blocks`       | Blocks                    | Yes      | Page body content                                   |

---

### Pages

Flexible page documents. Editors can create new pages without code changes.

| Field    | Type   | Required | Notes                                             |
| -------- | ------ | -------- | ------------------------------------------------- |
| `title`  | Text   | Yes      | Page title                                        |
| `slug`   | Text   | Yes      | Maps to URL. `home` → `/`, all others → `/[slug]` |
| `blocks` | Blocks | Yes      | Page body content                                 |

---

### Media

Standard Payload upload collection. Used across all other collections for images and videos.

---

### SVGs

Upload collection for SVG assets used in illustrations and icons. Kept separate from Media to avoid mixing raster and vector assets in the same upload picker.

---

### Categories

Shared taxonomy used by both Projects and Posts.

| Field  | Type | Required | Notes                      |
| ------ | ---- | -------- | -------------------------- |
| `name` | Text | Yes      |                            |
| `slug` | Text | Yes      | Auto-generated from `name` |

---

## Common block fields

Every block includes these fields:

| Field          | Type   | Required | Notes                                                       |
| -------------- | ------ | -------- | ----------------------------------------------------------- |
| `paddingWhere` | Select | No       | `top`, `bottom`, `both` — default `both`                    |
| `paddingSize`  | Select | No       | `sm`, `md`, `lg`, `xl` — default `lg`                       |
| `anchorId`     | Text   | No       | Alphanumeric, `-`, `_` only. Used for hash-link navigation. |

---

## Blocks

### Hero

| Field             | Type           | Required    | Notes                                                                       |
| ----------------- | -------------- | ----------- | --------------------------------------------------------------------------- |
| `heading`         | Text           | Yes         | Wrap text in `{{double curly braces}}` to apply serif/italic emphasis style |
| `subtitle`        | Text           | No          |                                                                             |
| `intro`           | Textarea       | No          |                                                                             |
| `buttons`         | Array          | No          | See button fields below                                                     |
| `backgroundMedia` | Select         | Yes         | `image`, `video`, `shader`                                                  |
| `backgroundImage` | Upload (Media) | Conditional | Required when `backgroundMedia` is `image`                                  |
| `backgroundVideo` | Upload (Media) | Conditional | Required when `backgroundMedia` is `video` — muted, looped, autoplay        |
| `overlayAlpha`    | Number         | No          | 0–1. Controls dark overlay opacity for text contrast                        |

**Button fields (per item):**

| Field          | Type           | Required    | Notes                                                       |
| -------------- | -------------- | ----------- | ----------------------------------------------------------- |
| `label`        | Text           | Yes         |                                                             |
| `type`         | Select         | Yes         | `anchor`, `video`, `link`                                   |
| `anchorTarget` | Text           | Conditional | Required when `type` is `anchor`. Hash target without `#`   |
| `videoFile`    | Upload (Media) | Conditional | Required when `type` is `video`. Opens in a dialog, unmuted |
| `linkUrl`      | Text           | Conditional | Required when `type` is `link`                              |
| `variant`      | Select         | Yes         | `solid`, `outline`                                          |
| `colour`       | Select         | Yes         | `white`, `green`                                            |

---

### Text and Media

| Field           | Type           | Required    | Notes                                                                   |
| --------------- | -------------- | ----------- | ----------------------------------------------------------------------- |
| `variant`       | Select         | Yes         | `split` (50vw media, 100vh), `contained` (12-col grid, half width each) |
| `heading`       | Text           | No          | Supports `{{curly brace}}` emphasis                                     |
| `headingStyle`  | Select         | No          | Select from available typography utilities                              |
| `body`          | RichText       | No          | WYSIWYG                                                                 |
| `mediaPosition` | Select         | Yes         | `left`, `right`                                                         |
| `mediaType`     | Select         | Yes         | `image`, `video`                                                        |
| `image`         | Upload (Media) | Conditional | Required when `mediaType` is `image`                                    |
| `video`         | Upload (Media) | Conditional | Required when `mediaType` is `video` — muted, looped, autoplay          |
| `aspectRatio`   | Select         | Conditional | `4:3`, `16:9`, `1:1`, `3:4`, `auto` — `contained` variant only          |

---

### Media

| Field          | Type           | Required    | Notes                                                                 |
| -------------- | -------------- | ----------- | --------------------------------------------------------------------- |
| `mediaType`    | Select         | Yes         | `image`, `video`                                                      |
| `image`        | Upload (Media) | Conditional | Required when `mediaType` is `image`                                  |
| `video`        | Upload (Media) | Conditional | Required when `mediaType` is `video` — muted, looped, autoplay        |
| `openVideo`    | Upload (Media) | No          | If set, shows a play button that opens this video unmuted in a dialog |
| `heading`      | Text           | No          |                                                                       |
| `headingStyle` | Select         | Conditional | Required when `heading` is set                                        |
| `overlayAlpha` | Number         | Conditional | 0–1. Available when `heading` is set                                  |
| `size`         | Select         | Yes         | `fullscreen`, `large` (container width), `small`                      |
| `aspectRatio`  | Select         | No          | `4:3`, `16:9`, `1:1`, `3:4`, `auto`                                   |

---

### Illustration Card List

| Field     | Type  | Required | Notes                       |
| --------- | ----- | -------- | --------------------------- |
| `heading` | Text  | No       | Section heading above cards |
| `cards`   | Array | Yes      | Min 1                       |
| `button`  | Group | No       | If empty, button is hidden  |

**Card fields (per item):**

| Field          | Type     | Required | Notes                                           |
| -------------- | -------- | -------- | ----------------------------------------------- |
| `heading`      | Text     | Yes      |                                                 |
| `body`         | RichText | No       |                                                 |
| `illustration` | Select   | Yes      | Predefined illustration set — not user-uploaded |

**Button fields:**

| Field   | Type | Required | Notes |
| ------- | ---- | -------- | ----- |
| `label` | Text | Yes      |       |
| `url`   | Text | Yes      |       |

---

### News Card List

| Field           | Type                    | Required    | Notes                                            |
| --------------- | ----------------------- | ----------- | ------------------------------------------------ |
| `selectionMode` | Select                  | Yes         | `manual`, `category`, `latest`                   |
| `articles`      | Relationship (News)     | Conditional | Required when `selectionMode` is `manual`. Max 3 |
| `category`      | Relationship (Category) | Conditional | Required when `selectionMode` is `category`      |
| `buttonLabel`   | Text                    | No          | If empty, button linking to news index is hidden |

---

### Project List

| Field           | Type                    | Required    | Notes                                                          |
| --------------- | ----------------------- | ----------- | -------------------------------------------------------------- |
| `selectionMode` | Select                  | Yes         | `manual`, `category`, `latest`                                 |
| `projects`      | Relationship (Work)     | Conditional | Required when `selectionMode` is `manual`                      |
| `category`      | Relationship (Category) | Conditional | Required when `selectionMode` is `category`                    |
| `count`         | Number                  | Conditional | Required when `selectionMode` is `category` or `latest`. Min 1 |
| `buttonLabel`   | Text                    | No          | If empty, button linking to projects index is hidden           |

---

### Body Copy

| Field     | Type     | Required | Notes   |
| --------- | -------- | -------- | ------- |
| `content` | RichText | Yes      | WYSIWYG |

---

### Testimonial

| Field         | Type     | Required | Notes                                    |
| ------------- | -------- | -------- | ---------------------------------------- |
| `quoteStyle`  | Select   | Yes      | TBD — options to be confirmed from Figma |
| `quote`       | Textarea | Yes      |                                          |
| `attribution` | Text     | No       |                                          |

---

### CTA

| Field             | Type           | Required | Notes                                      |
| ----------------- | -------------- | -------- | ------------------------------------------ |
| `backgroundImage` | Upload (Media) | Yes      |                                            |
| `overlayAlpha`    | Number         | No       | 0–1                                        |
| `text`            | Text           | Yes      |                                            |
| `textStyle`       | Select         | Yes      | Select from available typography utilities |
| `button`          | Group          | Yes      |                                            |

**Button fields:**

| Field   | Type | Required | Notes |
| ------- | ---- | -------- | ----- |
| `label` | Text | Yes      |       |
| `url`   | Text | Yes      |       |

---

### Person List

| Field     | Type     | Required | Notes |
| --------- | -------- | -------- | ----- |
| `heading` | Text     | No       |       |
| `body`    | RichText | No       |       |
| `people`  | Array    | Yes      | Min 1 |

**Person fields (per item):**

| Field   | Type           | Required | Notes |
| ------- | -------------- | -------- | ----- |
| `image` | Upload (Media) | Yes      |       |
| `name`  | Text           | Yes      |       |
| `role`  | Text           | No       |       |

---

### Accordion List

Click the heading to reveal the body. Multiple items per block.

| Field   | Type  | Required | Notes |
| ------- | ----- | -------- | ----- |
| `items` | Array | Yes      | Min 1 |

**Item fields (per item):**

| Field     | Type     | Required | Notes                      |
| --------- | -------- | -------- | -------------------------- |
| `heading` | Text     | Yes      | Acts as the toggle trigger |
| `body`    | RichText | Yes      | Revealed on click          |
