# Currency Converter

A lightweight, offline-capable currency converter PWA that converts between HKD, VND, KRW, USD, CNY, TWD, SGD, and MYR.

## Features

- Convert between 8 Asian currencies
- Live exchange rates from [open.er-api.com](https://open.er-api.com)
- Offline fallback with cached rates
- PWA installable on mobile/desktop
- Responsive design
- Currency swap functionality

## Quick Start

```bash
# Serve locally
python3 -m http.server 8080

# Or use npx
npx serve
```

Then open `http://localhost:8080` in your browser.

## Install as PWA / Extension

**Browser Extension:**
1. Go to `chrome://extensions` (or your browser's extension page)
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this project directory

**PWA (Mobile/Desktop):**
1. Serve the project via HTTP server
2. Open in Chrome/Safari
3. Use "Add to Home Screen" / "Install"

## Offline Support

The app caches the last fetched exchange rates. When offline, it uses:
- Cached rates from the service worker
- Fallback hardcoded rates if no cache exists

## API

Uses [open.er-api.com](https://open.er-api.com/v6/latest/HKD) for live exchange rates. Base currency is HKD; all rates are relative to HKD.

## Project Structure

```
├── index.html      # Main page
├── app.js          # Application logic
├── sw.js           # Service worker
├── style.css       # Styles
├── manifest.json   # PWA manifest
└── icon*.png/svg   # App icons
```
