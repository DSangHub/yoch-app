# YOCH — Your Channel. Your Choice. You Choose.

Installable Progressive Web App for a private, local, AI-native personal channel.
Think MySpace instincts (your page, your circle, your rules) with modern privacy, geolocation, and a thin Grok layer.

**Repo:** [github.com/DSangHub/yoch-app](https://github.com/DSangHub/yoch-app)  
**Intended home:** [yoch.app](https://yoch.app)

## Product map

| Pillar | Meaning | In this prototype |
| --- | --- | --- |
| Channel | Personal page you own | Profile, mood, vibe, adventure feed |
| Who can watch | Public is optional | Friends / local / invite / only you |
| Geolocation | Keep it local | Browser geo + radius (km) |
| YOFR | Your Friends | Top 8 + circle + message |
| YOCR | Your Creations | Star-video storyboard + minimal Grok drafts |
| YOMO | Your Money | Demo tips / subs / sales ledger |
| YOLI | Your Life Your Love | Private journal |
| Mail | Private column | Slide-over messages |

Data stays in `localStorage` until you attach a backend. The Grok panel is a local draft generator so the product feel is present without shipping keys in the client.

## Run locally

Any static server from this folder:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`. On a phone, use your LAN IP. HTTPS (or localhost) is required for geolocation and for `beforeinstallprompt`.

### Install as an app

- **Chromium / Android:** banner or browser Install menu. Manifest + service worker are already wired.
- **iOS Safari:** Share → Add to Home Screen.
- Icon: `icons/icon.svg`

## Path to iOS / Android store apps

This PWA is the client. Wrap it when you are ready:

1. Host the folder on HTTPS at `yoch.app`.
2. [PWABuilder](https://www.pwabuilder.com/) → Android TWA / iOS package.
3. Or [Capacitor](https://capacitorjs.com/).

Keep one codebase. Native shells get push, camera, and store listing; the channel UI stays this PWA.

## Suggested backend (not in this drop)

- Auth: passkeys + phone
- Visibility: audience ACL evaluated with last-known geo (consent required)
- Media: object storage for star videos
- Grok: server-side xAI API for drafts and optional face-preserving video pipelines
- Money: Stripe Connect or in-app purchases
- Messages: encrypted threads

## Brand

Hot pink, lemon, sky, lime. Fat outlines. Slogan lockup: **Your Channel. Your Choice. You Choose.**

Enable GitHub Pages on `main` to preview at `https://dsanghub.github.io/yoch-app/`.
