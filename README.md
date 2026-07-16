# Susi Air Ops - Pilot Companion

Nuxt 4 mobile-first prototype for pilot schedules, rolling flight-hour limits, and operational documents.

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS for utility-first layout composition
- SCSS for design tokens, reusable component styling, motion, and brand-specific utilities
- Pinia for mock operational data
- Chart.js + vue-chartjs for the rolling-sum hours chart
- `@vite-pwa/nuxt` for PWA basics

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the app locally:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Deployment

Recommended production target for this project:

- VPS with HTTPS and a reverse proxy such as Nginx

This project currently builds to a Nuxt `node-server` output, so it is naturally suited to a VPS that can run a long-lived Node process.

### VPS Requirements

- Linux VPS with SSH access
- Node.js 20 or newer
- npm available on the server
- Nginx or equivalent reverse proxy
- domain or subdomain pointed to the VPS IP
- valid SSL certificate such as Let's Encrypt

### VPS Deployment Flow

1. Push this repository to GitHub.
2. SSH into the VPS.
3. Clone the repository if this is the first deployment:

```bash
git clone YOUR_GITHUB_REPO_URL ~/susiair-pilot-app
cd ~/susiair-pilot-app
```

4. If the repository is already on the VPS, update it instead:

```bash
cd ~/susiair-pilot-app
git pull origin main
```

5. Install dependencies:

```bash
npm install
```

6. Build the production app:

```bash
npm run build
```

7. Start the Nuxt server output manually once to verify the build:

```bash
PORT=3001 npm run start
```

8. Open a second terminal tab and verify the app is responding:

```bash
curl http://127.0.0.1:3001
ss -tulpn | grep 3001
```

9. Stop the manual process with `Ctrl + C` after the check passes.
10. Start the app with PM2 so it stays alive after logout or reboot.
11. Configure Nginx to proxy HTTPS traffic to port `3001`.
12. Point the chosen domain or subdomain DNS to the VPS IP.
13. Enable SSL on the domain or subdomain.
14. Open the final HTTPS URL and verify the PWA install flow from Android Chrome.

### Full VPS Setup From Scratch

1. Connect to the VPS:

```bash
ssh YOUR_USERNAME@YOUR_VPS_IP
```

2. Install Node.js, npm, Git, and Nginx if they are not already available.

3. Clone or update the project repository.

4. Install project dependencies:

```bash
cd ~/susiair-pilot-app
npm install
```

5. Build the app:

```bash
npm run build
```

6. Verify the Nitro output exists:

```bash
ls -lah .output/server/index.mjs
```

7. Run the app on port `3001`:

```bash
PORT=3001 npm run start
```

8. In a new terminal session, verify local response:

```bash
curl http://127.0.0.1:3001
```

9. Stop the manual process and daemonize it with PM2:

```bash
PORT=3001 pm2 start .output/server/index.mjs --name susiair-pilot-app
pm2 save
pm2 startup
```

10. Check PM2 status:

```bash
pm2 list
pm2 logs susiair-pilot-app
```

11. Create an Nginx site config that proxies the public domain to `127.0.0.1:3001`.

12. Enable the Nginx site and reload Nginx.

13. Issue an SSL certificate with Certbot.

14. Test the final public HTTPS URL and the PWA asset endpoints:

```bash
curl -I https://YOUR_SUBDOMAIN
curl -I https://YOUR_SUBDOMAIN/sw.js
curl -I https://YOUR_SUBDOMAIN/pwa-192.png
```

### Recommended Process Manager

PM2 example:

```bash
npm install -g pm2
PORT=3001 pm2 start .output/server/index.mjs --name susiair-pilot-app
pm2 save
pm2 startup
```

If the VPS terminal is accidentally closed, simply reconnect with SSH and continue from the last incomplete step. The running PM2 process can always be checked with:

```bash
pm2 list
pm2 logs susiair-pilot-app
```

### Nginx Notes

- Reverse proxy public HTTPS traffic to the Nuxt server port
- preserve `Host` and `X-Forwarded-*` headers
- do not block `sw.js`, manifest-related assets, or static files under `/_nuxt/`
- keep the site fully available over HTTPS so PWA installability remains valid

Example Nginx server block:

```nginx
server {
	listen 80;
	server_name YOUR_SUBDOMAIN;

	location / {
		proxy_pass http://127.0.0.1:3001;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/susiair-pilot-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

SSL example:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d YOUR_SUBDOMAIN
```

### Submission Deliverables

- GitHub repository with this README
- Live HTTPS deployment URL on a production host such as a VPS, or another HTTPS-capable similar platform
- Notes on future improvements and library choices

## Design System Notes

- Typography uses Inter from Google Fonts.
- Tailwind handles page structure, spacing, layout, and responsive composition.
- SCSS partials in `app/assets/scss/` own tokens, shared component primitives, transitions, and tap feedback patterns.
- Core palette follows the brief: primary navy `#0E2138`, brand red `#E63757`, background `#F5F6F8`, and white card surfaces.

## Libraries Chosen And Why

- Nuxt 4: gives a clean app structure with first-class routing, layouts, build tooling, and a production-ready Node server output.
- Pinia: keeps mock operational data organized in focused stores without unnecessary boilerplate.
- Tailwind CSS: speeds up mobile-first composition and layout iteration directly in Vue templates.
- SCSS: handles reusable design tokens, motion, component primitives, and brand-specific styling that should not be repeated inline.
- Chart.js with vue-chartjs: a pragmatic choice for the rolling-sum hours chart because it is stable, well-documented, and flexible enough for the regulatory limit overlay.
- date-fns: keeps date math explicit and lightweight for anchor-date logic, calendar generation, and chart labels.
- lucide-vue-next: matches the brief direction for clean line icons and works well with the minimalist operational UI.

## PWA Status

PWA basics are configured through `@vite-pwa/nuxt` with:

- manifest metadata for app name, theme color, background color, standalone display, and start URL
- generated service worker via Workbox
- install-prompt capable client registration
- app icon and Apple touch icon wiring through the shared `public/susiair-pilot-ops-favicon.png` asset

The app also includes an in-app install banner that appears only when the browser fires the native `beforeinstallprompt` event, giving Android Chrome and Chromium-based browsers a more consistent install entry point.

## Android Install Test

1. Do not use `http://192.168.x.x:3000` from Android for install testing. That is plain HTTP on a LAN IP and is not a secure context for installable PWA behavior.
2. Use one of these valid approaches instead:
3. Deploy the app to an HTTPS host.
4. Or expose the local app through an HTTPS tunnel such as Cloudflare Tunnel or ngrok.
5. Open the HTTPS URL in Chrome on Android.
6. Visit the app at least once and wait a few seconds for the service worker to register.
7. Look for the in-app install banner or open the Chrome menu and look for `Install app`.
8. Tap `Install now` from the banner or `Install app` from the browser menu.
9. Accept the browser confirmation dialog.
10. Launch the installed app from the home screen and verify it opens in standalone mode without the browser address bar.

### Why `npm run dev -- --host` Was Not Enough

- `--host` only makes the dev server reachable on the network.
- It does not make the origin secure.
- On Android, `http://192.168.x.x:3000` is not treated like desktop `http://localhost`.
- Because of that, `beforeinstallprompt` may never fire and the app will not be installable as a real PWA.

### Correct Technical Flow For Android

Option 1: HTTPS deployment

```bash
npm.cmd run build
node .output/server/index.mjs
```

Then expose the app through a real HTTPS domain on the VPS.

Option 2: HTTPS tunnel from local machine

Run your app locally, then expose it with a tunnel that gives you an `https://` URL.

Examples:

```bash
npm run dev -- --host
cloudflared tunnel --url http://localhost:3000
```

or

```bash
npm run dev -- --host
ngrok http 3000
```

Open the generated `https://` URL on Android, not the raw LAN IP.

## Installable PWA Checklist

- App served from desktop `localhost` during local desktop testing, or HTTPS for mobile and deployment
- Web app manifest present with name, short name, theme color, background color, display mode, scope, and start URL
- App icons declared in the manifest
- Service worker generated and registered
- Install surface available via Chromium `beforeinstallprompt` or browser menu
- App opens successfully after installation in standalone mode

## Install Prompt Consistency Notes

- Chromium browsers may delay or suppress the native mini-infobar based on engagement heuristics.
- The in-app install banner improves consistency by storing the deferred install event and surfacing an explicit CTA.
- If the origin is not secure, the native event will not fire and the app will not become installable.
- If the native event is never fired on a secure origin, the browser still controls eligibility; installation may remain available from the browser menu when criteria are met.

## Logo Provenance

- Official Susi Air brand reference observed on the public website: `https://susiair.com/`
- Public logo asset visible on the site: `https://susiair.com/images/susiairlogo.png`
- The local files `public/susiair-pilot-ops-index.png` and `public/susiair-pilot-ops-favicon.png` are app-specific derived assets used for this prototype

If strict submission review requires a verbatim official asset export, replace those local files with an approved source export from Susi Air while keeping the same filenames.

## Validation Notes

- Production build passes successfully with `npm.cmd run build` on Windows PowerShell.
- No compile errors are present in the edited Vue and SCSS files.
- Preview checks show no horizontal overflow on the implemented screens.
- The app is operationally ready for VPS deployment because the current Nuxt output is `node-server` and runs as a standard Node process.

## What I Would Do Differently With More Time

- Replace the current derived logo assets with an approved official export pipeline and generate a full dedicated PWA icon set.
- Add a final device-based QA pass at exact 390px width and on real Android install flows after deployment to HTTPS.
- Expand the document and schedule interactions beyond placeholders so more cards and rows lead to real detail screens.
- Add automated tests for store calculations, especially rolling-hour sums and schedule mapping.
- Refine the in-app install guidance for platform-specific cases such as Android Chrome versus iOS Safari.
