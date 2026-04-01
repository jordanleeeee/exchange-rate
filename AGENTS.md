# Agent Instructions

## Overview

This is a browser-based currency converter PWA/extension built with vanilla JavaScript, CSS, and HTML. It fetches live exchange rates from the [open.er-api.com](https://open.er-api.com/v6/latest/HKD) API and falls back to hardcoded rates when offline.

Key features:
- Converts between 13 Asian currencies (HKD, VND, KRW, USD, CNY, TWD, SGD, MYR, EUR, JPY, GBP, AUD, CAD)
- Base currency is HKD; all rates are relative to HKD
- Offline-capable with service worker caching and fallback rates
- PWA installable on mobile and desktop
- Supports "auto-zero" currencies (VND, KRW) that display with "000" suffix

## Build/Lint/Test Commands

### Development

No build step required. This is a static site/extension.

```bash
# Serve locally with Python
python3 -m http.server 8080

# Or with npx
npx serve

# Or with Node.js http-server
npx http-server -p 8080
```

Open `http://localhost:8080` in your browser.

### Testing

No automated test framework configured. Manual testing checklist:

1. Open `index.html` in browser (or via local server)
2. Verify currency dropdowns populate with all 13 currencies
3. Enter an amount and verify conversion works correctly
4. Test swap functionality (button rotates 180 degrees)
5. Test offline fallback:
   - Open DevTools → Network → "Offline" checkbox
   - Reload page and verify "Offline — using cached rates" badge appears
   - Verify conversion still works with fallback rates
6. Test auto-zero currencies (VND, KRW): verify "000" suffix displays
7. Test localStorage persistence: refresh page and verify currency selections persist
8. Test as Chrome extension: load as unpacked at `chrome://extensions`

### Linting

No linter configured. Code should be clean, readable, and consistent with existing conventions.

## Code Style Guidelines

### General

- **No semicolons** required (JS runs in module context via `<script>` tags)
- **2-space indentation**
- **No trailing whitespace**
- **Single blank line between functions**
- **No unnecessary parentheses** in arrow functions: `x => x + 1`

### JavaScript (app.js, sw.js)

#### Variables
- Use `const` by default, `let` when reassignment is needed
- Descriptive names: `rateDate`, `fromCode`, `swapFlipped`
- No leading underscores for private variables
- Global constants in UPPER_SNAKE_CASE: `const CACHE = '...'`, `const FALLBACK = {...}`
- Cache DOM elements in variables at top of script: `const amountInput = document.getElementById('amount')`

#### State Management
- Use module-level variables for state (`let rates`, `let rateDate`, etc.)
- Persist user preferences to localStorage: `localStorage.getItem('fromCode')`
- Use `||` for defaults: `localStorage.getItem('fromCode') || 'HKD'`

#### Functions
- Function declarations preferred for module-level functions: `function fetchRates() {...}`
- Use concise arrow functions for callbacks: `c => c.code === code`
- Keep functions small and focused (single responsibility)
- Helper functions can be defined inline within larger functions

#### Async/Await
- Use `async/await` for asynchronous operations
- Always wrap in try/catch for error handling
- Pattern: `try { ... } catch { ... }` (catch without variable when error not used)
- Never use `console.error` in production; silent fallbacks preferred

#### DOM Manipulation
- Use `classList.add/remove/toggle` for class changes
- Use `textContent` over `innerText` for setting text
- Use `hidden` attribute for show/hide: `element.hidden = true`
- Boolean attributes: set directly without value: `element.disabled = true`

#### Currency Data Structure

```javascript
const CURRENCIES = [
  { code: 'HKD', flag: '🇭🇰', symbol: 'HK$', name: 'HK Dollar', decimals: 2 },
  { code: 'VND', flag: '🇻🇳', symbol: '₫', name: 'Vietnamese Dong', decimals: 0, autoZero: true },
  // ...
];
```

#### Service Worker (sw.js)

- Cache name as constant: `const CACHE = 'hkd-vnd-v2'`
- Assets to cache: `const ASSETS = ['./index.html', './manifest.json']`
- Use `waitUntil` and `self.skipWaiting()` in install event
- Use `self.clients.claim()` in activate event
- Cache-first strategy with network fallback for API responses
- Clean up old caches on activation: `caches.keys().then().then()`

### CSS (style.css)

- **No CSS preprocessor**; plain CSS only
- **2-space indentation**
- One selector per line, properties on their own lines
- BEM-lite naming: `.currency-select-wrap`, `.currency-tag`, `.result-value`
- Use CSS custom properties if needed for theming
- Mobile-first responsive design via media queries if expanded
- System fonts with fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Include vendor prefixes: `-webkit-appearance: none`, `-moz-appearance: textfield`

### HTML (index.html)

- Semantic HTML5 elements
- Lowercase attribute names
- Boolean attributes without value: `autofocus`, `hidden`, `disabled`, `checked`
- External resources: CSS in `<head>`, JS at end of `<body>`
- Use `<label>` elements associated with inputs via `id`
- Accessibility: ARIA labels where needed, include `inputmode` for mobile keyboards

### Naming Conventions

| Type              | Convention    | Example                      |
|-------------------|---------------|------------------------------|
| Variables         | camelCase     | `fromCode`, `swapFlipped`    |
| Constants         | UPPER_SNAKE_CASE | `CACHE`, `FALLBACK`       |
| Functions         | camelCase     | `fetchRates()`, `convert()`  |
| DOM IDs           | kebab-case    | `id="from-select"`           |
| CSS Classes       | kebab-case    | `.currency-row`, `.result-value` |
| Currency Codes    | UPPER_SNAKE_CASE | `'HKD'`, `'VND'`         |

### Error Handling

- Wrap API calls in try/catch with silent fallbacks
- Graceful degradation: fallback to hardcoded values on failure
- No `console.error` in production code
- Validate user input: `parseFloat()`, `isNaN()` checks
- Check API response status: `if (data.result !== 'success')`

### Browser Compatibility

- Target modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Use feature detection: `'serviceWorker' in navigator`
- Include vendor prefixes where needed

## Project Structure

```
/exchange-rate
├── index.html       # Main page (61 lines)
├── app.js          # Application logic (155 lines)
├── sw.js           # Service worker for caching (31 lines)
├── style.css       # Styles (223 lines)
├── manifest.json    # PWA manifest
└── icon-*.png/svg   # App icons
```

## Key Implementation Details

### Rate Calculation

Rates are fetched from `https://open.er-api.com/v6/latest/HKD` and stored as-is. Conversion formula:

```javascript
const converted = amount * (rates[toCode] / rates[fromCode]);
```

### Auto-Zero Currencies

Some currencies (VND, KRW) display with "000" suffix appended to user input for display purposes. The actual value is multiplied by 1000:

```javascript
actualValue = from.autoZero ? displayVal * 1000 : displayVal;
```

### LocalStorage Keys

- `fromCode`: Source currency code (default: 'HKD')
- `toCode`: Target currency code (default: 'VND')
