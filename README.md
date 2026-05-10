# Prayer Request

A simple, mobile-first prayer wall for the church. People scan a QR code, share a request, and the church prays for them by name.

## Pages

- `/` — three-step flow: prayer request → name → thank-you (auto-resets after 5 seconds)
- `/qr` — display page with a QR code that points back to `/`
- `/admin` — list of all prayer requests, with search and CSV export (password protected)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase Postgres for storage
- Vercel for hosting

## Local development

```bash
bun install
cp .env.example .env.local   # then fill in values
bun run dev
```

### Env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL
```

## Build

```bash
bun run build
```
