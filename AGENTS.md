# Agent Instructions

## Overview
This is a simple browser-based currency converter PWA/extension. The project consists of vanilla JavaScript, CSS, and HTML files. It fetches live exchange rates from the open.er-api.com API and falls back to hardcoded rates when offline.

## Build/Lint/Test Commands

### Development
No build step required. This is a static site/extension.

- **Serve locally**: Use any static file server
  ```bash
  python3 -m http.server 8080
  # or
  npx serve
  ```

- **Test the extension**: Load the project directory as an unpacked Chrome extension at `chrome://extensions` (enable Developer mode), or serve via HTTP server for PWA testing.

### Testing
No automated test framework is configured. Manual testing:
1. Open `index.html` in a browser
2. Verify currency dropdowns populate correctly
3. Enter an amount and verify conversion works
4. Test swap functionality
5. Test offline fallback behavior

### Linting
No linter configured. Code should be written to be clean, readable, and consistent with existing conventions.

## Code Style Guidelines

### General
- No semicolons required (JS runs in module context via `<script>` tags)
- 2-space indentation
- No trailing whitespace
- Single blank line between functions
- No unnecessary parentheses in arrow functions: `x => x + 1`

### JavaScript (app.js, sw.js)

#### Variables
- Use `const` by default, `let` when reassignment is needed
- Descriptive names: `rateDate`, `fromCode`, `swapFlipped`
- No leading underscores for private variables
- Global constants in UPPER_SNAKE_CASE: `const CACHE = '...'`, `const FALLBACK = {...}`

#### Functions
- Function declarations preferred for module-level functions: `function fetchRates() {...}`
- Use concise function expressions where appropriate: `c => c.code === code`
- Keep functions small and focused (single responsibility)

#### Async/Await
- Use `async/await` for asynchronous operations
- Always wrap in try/catch for error handling
- Pattern: `try { ... } catch { ... }` (catch without variable when error not used)

#### DOM
- Cache DOM elements in variables: `const amountInput = document.getElementById('amount')`
- Use `classList.add/remove/toggle` for class changes
- Use `textContent` over `innerText` for setting text

#### Data Structures
- Currency definitions in array of objects with consistent structure
- Fallback rates as a plain object mapping currency codes to values
- Rates from API stored as-is from response

#### Service Worker (sw.js)
- Cache name as constant: `const CACHE = '...'`
- Use `waitUntil` and `self.skipWaiting()` in install
- Use `caches.keys().then().then()` pattern for activation cleanup
- Respond with cache-first, network-fallback strategy

### CSS (style.css)

- No CSS preprocessor; plain CSS only
- 2-space indentation
- One selector per line, properties on their own lines
- BEM-lite naming: `.currency-select-wrap`, `.currency-tag`, `.result-value`
- Use CSS custom properties if needed for theming
- Mobile-first responsive design via media queries if expanded
- Use system fonts with fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### HTML (index.html)

- Semantic HTML5 elements
- Lowercase attribute names
- Boolean attributes without value: `autofocus`, `checked`
- External resources: CSS in `<head>`, JS at end of `<body>`
- Use `<label>` elements associated with inputs via `id`
- Accessibility: include `alt` attributes, ARIA labels where needed

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `fromCode`, `swapFlipped` |
| Constants | UPPER_SNAKE_CASE | `CACHE`, `FALLBACK` |
| Functions | camelCase | `fetchRates()`, `convert()` |
| DOM IDs | kebab-case | `id="from-select"` |
| CSS Classes | kebab-case | `.currency-row`, `.result-value` |
| Currency Codes | UPPER_SNAKE_CASE | `'HKD'`, `'VND'` |

### Error Handling

- Wrap API calls in try/catch
- Graceful degradation: fallback to hardcoded values on failure
- No console.error in production code; silent fallbacks acceptable
- Validate user input (parseFloat, isNaN checks)

### Browser Compatibility
- Target modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Use feature detection: `'serviceWorker' in navigator`
- Include vendor prefixes where needed: `-webkit-appearance: none`

## Project Structure

```
/exchange-rate
├── index.html      # Main page
├── app.js          # Application logic
├── sw.js           # Service worker for caching
├── style.css       # Styles
├── manifest.json    # PWA manifest
└── icon-*.png/svg   # App icons
```

## Key Files

| File | Purpose |
|------|---------|
| `app.js:1-10` | Currency definitions array |
| `app.js:13` | Fallback exchange rates |
| `app.js:40-57` | `fetchRates()` - API call with fallback |
| `app.js:82-97` | `convert()` - conversion logic |
| `sw.js:1-2` | Cache name and assets to cache |
