# SpeedUp Attendee Card Generator

Generate custom **1080×1080** event attendance poster cards in the browser. Fill in your details, upload a photo, preview live, and download a high-resolution PNG ready for LinkedIn, Facebook, or Instagram.

## Features

- Live poster preview with responsive scaling
- Drag-and-drop attendee photo upload
- One-click high-resolution PNG export
- Bundled default template background (works offline after load)
- No backend or API keys required — everything runs in the browser

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

This is a static Vite + React app. Vercel auto-detects the build settings from `vercel.json`.

### Option A — Vercel Dashboard (recommended)

1. Push this project to a GitHub / GitLab / Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will detect:
   - **Framework:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**. No environment variables are required.

### Option B — Vercel CLI

```bash
npm install
npx vercel login
npx vercel deploy --prod
```

## Environment variables

None required. The app is fully client-side:

- Form inputs and image uploads stay in the browser
- PNG export uses `html-to-image` locally
- The default background template is bundled with the app

## Build verification

```bash
npm run build
npm run preview
```

## Notes

- Uploaded images are converted to base64 in-browser, so PNG export works reliably on Vercel.
- The default template is included in the build; no external image fetch is needed for normal use.
- If you use a custom remote background URL, some browsers may block export due to CORS — upload the template file locally instead.
