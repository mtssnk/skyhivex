# SkyHive X

Headless CMS + Astro frontend monorepo.

## Structure

```text
skyhivex/
├── cms/        # Payload 3 CMS (Next.js 16)
└── web/        # Frontend (Astro 6, Node runtime; render strategy TBD)
```

Package manager: **pnpm workspaces**

## Dev

```bash
pnpm run dev:cms   # CMS + Payload admin — http://localhost:3000
pnpm run dev:web   # Astro frontend — http://localhost:4321
```

MongoDB runs locally or via Docker:

```bash
cd cms && docker compose up
```

## Tech stack

| Layer    | Tech                                        |
| -------- | ------------------------------------------- |
| CMS      | Payload 3.83, Next.js 16, React 19          |
| Frontend | Astro 6, Node runtime (render strategy TBD) |
| Database | MongoDB (Mongoose adapter)                  |
| Storage  | Cloudflare R2 (S3-compatible)               |
| Images   | Sharp                                       |
| Editor   | Lexical (rich text)                         |

## Environment variables

**cms/.env** (see `cms/.env.example`):

```bash
DATABASE_URL=                    # MongoDB connection string (local: mongodb://127.0.0.1:27017/skyhivex; Railway: ${{MongoDB.MONGO_URL}})
PAYLOAD_SECRET=                  # Random secret for JWT signing (see below)
PAYLOAD_PUBLIC_SERVER_URL=       # Full CMS URL, e.g. http://localhost:3000 or https://your-cms.up.railway.app
WEB_URL=                         # Full web URL, e.g. http://localhost:4321 or https://your-web.up.railway.app
PREVIEW_SECRET=                  # Shared with web/.env (see below)

# Cloudflare R2 (see "Cloudflare R2 setup" below)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=skyhivex-cms
R2_ENDPOINT=                     # https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=                   # Public URL for the bucket, e.g. https://media.yourdomain.com
```

**web/.env** (see `web/.env.example`):

```bash
PUBLIC_SITE_URL=                 # Full web URL including protocol — used for canonical URLs and JSON-LD
CMS_URL=http://localhost:3000    # Full CMS URL — set to live domain in production
PREVIEW_SECRET=                  # Shared with cms/.env
PAYLOAD_API_KEY=                 # Generate in Payload admin: Users → open user → enable API Key → copy value

RESEND_API_KEY=                  # From resend.com — used for contact form email delivery
CONTACT_EMAIL=                   # Recipient address for contact form submissions
RESEND_FROM=                     # Sender address, e.g. "SkyHive X <hello@yourdomain.com>" — requires verified domain in Resend

PUBLIC_GTM_ID=                   # Google Tag Manager container ID, e.g. GTM-XXXXXXX — omit to disable
PUBLIC_CF_BEACON_TOKEN=          # Cloudflare Web Analytics beacon token — omit to disable
```

Generate secrets — run this twice, once for each:

```bash
node -e 'console.log(crypto.randomUUID())'
```

- `PAYLOAD_SECRET` — CMS only, unique value, not shared
- `PREVIEW_SECRET` — **same value** in both `cms/.env` and `web/.env`

### Cloudflare R2 setup

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → **R2 Object Storage** → **Create bucket**. Name it `skyhivex-cms`.
2. In bucket settings → enable **Public access** (or add a custom domain under **Settings → Custom Domains**). Copy the public URL → `R2_PUBLIC_URL`.
3. Go to **R2 → Manage R2 API Tokens** → **Create API Token**. Grant **Object Read & Write** on the `skyhivex-cms` bucket.
4. Copy the **Access Key ID** → `R2_ACCESS_KEY_ID` and **Secret Access Key** → `R2_SECRET_ACCESS_KEY`.
5. Your account ID is in the Cloudflare dashboard URL (`dash.cloudflare.com/<account-id>`). Set `R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`.

## CMS key files

- `cms/src/payload.config.ts` — main Payload config
- `cms/src/collections/Users.ts` — auth collection
- `cms/src/collections/Media.ts` — uploads, served via R2
- `cms/src/payload-types.ts` — generated types (do not edit)

Generate types after collection changes:

```bash
cd cms && pnpm generate:types
```

Payload admin UI: `/admin`  
REST API: `/api/[collection]`

## Conventions

- **Formatting**: Prettier — single quotes, no semicolons, 100 char line width, trailing commas
- **Linting**: ESLint flat config (`eslint.config.mjs`) — per workspace only, not run from root
- **Modules**: ESM (`"type": "module"`)
- **TypeScript**: strict mode; path alias `@/*` → `src/*`
- Node >=22.12.0 required

## Git hooks (Husky)

Configured at the workspace root. Hooks live in `.husky/`.

| Hook         | Tool                   | What it does                                                          |
| ------------ | ---------------------- | --------------------------------------------------------------------- |
| `pre-commit` | lint-staged + Prettier | Formats staged `ts`, `tsx`, `mjs`, `astro`, `css`, `json`, `md` files |
| `commit-msg` | commitlint             | Enforces Conventional Commits format                                  |

**Commit message format**: `type: description` — e.g. `feat: add blog section`, `fix: correct image URL`, `chore: update dependencies`

Valid types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`

## Web key files

- `web/src/lib/payload.ts` — typed CMS fetch helpers (`getPageBySlug`, `getWork`, `getWorkBySlug`) + all response types
- `web/src/lib/lexical.ts` — Lexical JSON → HTML serialiser for rich text fields
- `web/src/layouts/Layout.astro` — base HTML shell (`title`, `description`, `isDark` props)
- `web/src/blocks/BlockRenderer.astro` — renders the correct block component per `blockType`
- `web/src/styles/global.css` — Tailwind v4 with design tokens (`--color-*`, `--font-*`)

## Type management

Payload generates CMS types into `cms/src/payload-types.ts` (run `cd cms && pnpm generate:types`). The web package maintains its own simplified types in `web/src/lib/payload.ts` — these assume relationships are always resolved (e.g. `media: Media`, never `string | Media`) which keeps frontend code clean.

This duplication is intentional. When adding or changing a CMS field, update all three:

1. The block/collection file in `cms/src/` (e.g. `cms/src/blocks/Hero.ts`)
2. Run `cd cms && pnpm generate:types`
3. Add the field to the matching type in `web/src/lib/payload.ts`

## Figma

**File**: SkyHive X — key `EmNXKRIR2baEqqnc77feJU`

Top-level frames on Page 1: `home`, `home - mobile`, `projects - collection`, `about - company`, `about - services`, `project - single`, `news`, `FAQs`, `contact`.

### Accessing Figma data

The Figma MCP (`figma-developer-mcp`) is configured globally in `~/.claude/settings.json`. It works in the **Claude Code terminal** but does **not** load in the VS Code extension — the extension silently skips local MCP servers named `"figma"` because that name conflicts with an OAuth-based connector in Anthropic's MCP registry, causing a "cached needs-auth" state that blocks connection.

If `/mcp` does not show Figma (common in the VS Code extension), use the REST API directly:

```bash
# List top-level frames on a page
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/EmNXKRIR2baEqqnc77feJU/nodes?ids=0:1"

# Inspect a specific frame (replace node id)
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/EmNXKRIR2baEqqnc77feJU/nodes?ids=171:715"
```

The API key is `FIGMA_API_KEY` in `~/.claude/settings.json` under `mcpServers.figma.env`.

## Web conventions

See `web/CLAUDE.md` for Figma-to-code conventions: layer naming, block/component structure, spacing scale, typography, and colours.

## CMS skill

See `cms/CLAUDE.md` for Payload-specific guidance and the skill reference at `cms/.claude/skills/payload/`.

## Build / deploy

CMS has a multi-stage Dockerfile (Node 22 alpine, standalone Next.js output). Web uses Railpack via `web/nixpacks.toml`.

Current deployment target: **Railway for both CMS and web** while architecture is being finalised.  
Final Astro render strategy (**SSR/static/hybrid**) is **TBD**.

### Payload version pinning

All `@payloadcms/*` packages must be pinned to the **exact same version** with no `^` ranges — including `@payloadcms/storage-s3`. A minor version gap (e.g. `storage-s3@3.84.1` with everything else at `3.83.0`) causes a React context error (`useUploadHandlers must be used within UploadHandlersProvider`) in the admin UI because Payload's UI package is loaded twice at different versions.

When upgrading Payload, bump all packages together in one commit.

### Lockfile strategy

Three lockfiles exist in this repo — each serves a different context:

| File                 | Used by                        | Notes                                            |
| -------------------- | ------------------------------ | ------------------------------------------------ |
| `pnpm-lock.yaml`     | Root workspace (local dev, CI) | Updated by `pnpm install` at repo root           |
| `cms/pnpm-lock.yaml` | CMS Dockerfile on Railway      | Standalone — must not include workspace packages |
| `web/pnpm-lock.yaml` | Web Railpack build on Railway  | Standalone — same reason                         |

When Railway builds the CMS or web service, pnpm traverses up from the service root directory and finds the root `pnpm-workspace.yaml`. This means Railway uses the **root lockfile**, not the per-package ones. Keep the root lockfile up to date.

To regenerate a standalone lockfile (e.g. after changing `cms/package.json`):

```bash
mv pnpm-workspace.yaml pnpm-workspace.yaml.bak
cd cms && pnpm install
cd .. && mv pnpm-workspace.yaml.bak pnpm-workspace.yaml
```

### Railway-specific config

- **Port**: both services start on port 8080. Set this in each Railway service under Settings → Networking.
- **Host binding**: `web/astro.config.mjs` has `server: { host: true }` — this makes `@astrojs/node` bind to `0.0.0.0` instead of `localhost`. Without it, Railway's proxy cannot reach the service.
- **`CMS_URL`**: must be the live CMS domain in production, not `localhost`. Set it in the web service's Railway variables.
- **MongoDB**: use Railway's MongoDB plugin within the same project. Set `DATABASE_URL=${{MongoDB.MONGO_URL}}` using Railway's variable reference syntax.
