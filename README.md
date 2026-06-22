# SkyHive X

Monorepo — Payload CMS (`/cms`) + Astro frontend (`/web`)

## TODO

### Launch checklist

- **Test Open Graph** — use [opengraph.xyz](https://www.opengraph.xyz) or the Facebook Sharing Debugger to verify `og:title`, `og:description`, and `og:image` render correctly for key pages. Upload OG images in the CMS for any page without a natural fallback image.
- **Resend sending domain** — verify `snookstudio.co.uk` in the Resend dashboard (Domains → Add domain); add the SPF, DKIM, and DMARC DNS records at your DNS provider. Once verified, set `RESEND_FROM=Snook Studio <hello@snookstudio.co.uk>` in the production environment. Currently using `onboarding@resend.dev` which only delivers to the Resend account email.
- **Favicon** — `web/public/favicon.svg` is the default Astro placeholder; replace with the studio mark
- **robots.txt** — add `web/public/robots.txt`
- **Sitemap** — install `@astrojs/sitemap` and add to `astro.config.mjs`; configure it to exclude admin and API routes

### Nice to have

- **View transitions** — Astro has built-in View Transitions API support (`<ViewTransitions />`) which would suit a portfolio site well

## Prerequisites

- Node >= 22.12.0
- pnpm (`npm i -g pnpm`)
- Docker (for MongoDB)

## First-time setup

```bash
pnpm install
cp cms/.env.example cms/.env
cp web/.env.example web/.env
```

Fill in both env files. `DATABASE_URL` in `cms/.env` is pre-set to the local MongoDB default:

```
DATABASE_URL=mongodb://127.0.0.1:27017/snookstudio
```

`CMS_URL` in `web/.env` is pre-set to `http://localhost:3000` — no change needed for local dev.

## Start MongoDB

```bash
cd cms && docker compose up -d mongo
```

Runs MongoDB on port `27017` in the background. Only start the `mongo` service — `docker compose up -d` (without `mongo`) also starts a `payload` container that binds port 3000 and will conflict with `dev:cms`.

To stop it:

```bash
cd cms && docker compose down
```

## Start dev servers

Open two terminals from the project root:

```bash
pnpm run dev:cms   # http://localhost:3000
pnpm run dev:web   # http://localhost:4321
```

Visit `http://localhost:3000/admin` to create your first admin user.
If Payload starts on a different port, the following will kill whatever is on 3000:

```bash
lsof -ti :3000 | xargs kill
```

## Troubleshooting

### MongoDB can't connect

1. Check Docker is running: `docker ps` — you should see a `mongo` container
2. If the container isn't running: `cd cms && docker compose up -d mongo`
3. Check the port isn't already in use: `lsof -i :27017`
4. Verify `DATABASE_URL` in `cms/.env` matches `mongodb://127.0.0.1:27017/<dbname>`

### Port already in use

- CMS default is `3000`, web default is `4321`
- Kill the process: `lsof -ti :3000 | xargs kill`

### Setting up draft previews

1. Generate a random secret: `node -e "console.log(crypto.randomUUID())"` and add it as `PREVIEW_SECRET` to both `cms/.env` and `web/.env`
2. Add `WEB_URL=http://localhost:4321` to `cms/.env` (use your production URL in prod)
3. Regenerate Payload types and restart the CMS: `cd cms && pnpm generate:types`
4. In the Payload admin, go to **Users**, open your user record, enable **API Key**, copy the generated key
5. Add `PAYLOAD_API_KEY=<key>` to `web/.env` and restart `dev:web`
6. Open any Page in the Payload admin — a preview link will appear in the top bar; click it to open the page in preview mode

### After changing CMS collections or globals

Regenerate TypeScript types:

```bash
cd cms && pnpm generate:types
```

## Deploy (Railway)

Both services deploy to Railway from the same repo. The CMS uses a Dockerfile; the web service uses Railpack (detected from `nixpacks.toml`).

### First deploy — order matters

Deploy the CMS first, then the web service. The web service needs the live CMS URL for `CMS_URL`.

### 1. Create the Railway project

In the Railway dashboard, create a new project and add **two services from GitHub repo**, setting the root directory for each:

| Service | Root directory | Build method                                 |
| ------- | -------------- | -------------------------------------------- |
| CMS     | `cms`          | Dockerfile (auto-detected)                   |
| Web     | `web`          | Railpack (auto-detected via `nixpacks.toml`) |

### 2. Add MongoDB

In the Railway project, click **+ New → Database → MongoDB**. Once provisioned, go to its **Variables** tab — you'll use `MONGO_URL` in the next step.

### 3. Set environment variables

**CMS service variables:**

```
DATABASE_URL=${{MongoDB.MONGO_URL}}
PAYLOAD_SECRET=<random string, e.g. node -e "console.log(crypto.randomUUID())">
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_ENDPOINT=
R2_PUBLIC_URL=
```

Use Railway's Variable Reference syntax (`${{MongoDB.MONGO_URL}}`) so the value stays in sync automatically.

**Web service variables:**

```
PUBLIC_SITE_URL=https://<your-web-domain>
CMS_URL=https://<your-cms-railway-domain>
```

`PUBLIC_SITE_URL` is the public-facing URL of the web service (your custom domain, or the Railway `*.up.railway.app` domain). Without it, Railway's internal address (`localhost:8080`) appears in canonical URLs and JSON-LD.

### 4. Configure networking ports

In each service's **Settings → Networking → Public Networking**, set the port to **8080**. Both services default to port 8080 in production.

### 5. Deploy

Trigger a deploy for both services. Visit `https://<your-cms-domain>/admin` to create your first admin user.

### Gotchas

- **All URL env vars must include the protocol** (`https://`) — `CMS_URL`, `WEB_URL`, and `PAYLOAD_PUBLIC_SERVER_URL`. A missing protocol causes silent fetch failures (404s on the frontend) or broken admin navigation (Payload treats the bare domain as a document ID)
- **All `@payloadcms/*` packages must be pinned to the same version** with no `^` range on `@payloadcms/storage-s3` — a version mismatch causes a React context error in the admin UI
- **Lockfiles**: the project has three lockfiles. `pnpm-lock.yaml` (root workspace), `cms/pnpm-lock.yaml` (standalone for the Dockerfile), and `web/pnpm-lock.yaml` (standalone for Railpack). After updating any package in `cms/` or `web/`, regenerate the standalone lockfile by temporarily renaming `pnpm-workspace.yaml` to stop pnpm traversing up, running `pnpm install` inside the package directory, then renaming it back.

## Useful commands

| Command                                | Description              |
| -------------------------------------- | ------------------------ |
| `pnpm run dev:cms`                     | Start CMS dev server     |
| `pnpm run dev:web`                     | Start web dev server     |
| `cd cms && docker compose up -d mongo` | Start MongoDB            |
| `cd cms && docker compose down`        | Stop MongoDB             |
| `cd cms && docker compose logs mongo`  | View MongoDB logs        |
| `cd cms && pnpm generate:types`        | Regenerate Payload types |
