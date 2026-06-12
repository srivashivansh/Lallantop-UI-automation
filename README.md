# Lallantop Homepage — Playwright UI Automation

Tests for **https://www.thelallantop.com** homepage.
Covers Desktop Chrome (1280×720) and Mobile Chrome (Pixel 5 — 393×851).

---

## Project Structure

```
lallantop-automation/
├── tests/
│   └── homepage.spec.js     ← All homepage test cases
├── pages/
│   └── HomePage.js          ← Page Object Model (selectors + actions)
├── test-results/            ← Screenshots, videos, traces (auto-created)
├── playwright-report/       ← HTML report (auto-created)
├── playwright.config.js     ← Playwright configuration
└── package.json
```

---

## One-Time Setup (do this once)

### Step 1 — Open the project in VS Code
```
File → Open Folder → select the `lallantop-automation` folder
```

### Step 2 — Open the integrated terminal
```
View → Terminal   (or Ctrl + ` )
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Install Playwright browsers
```bash
npx playwright install chromium
```
> If you want to use your own installed Chrome instead of Playwright's bundled one,
> the config already sets `channel: 'chrome'`. Make sure Google Chrome is installed.

---

## Running Tests

### Run ALL tests (desktop + mobile)
```bash
npm test
```

### Run only Desktop Chrome tests
```bash
npm run test:desktop
```

### Run only Mobile Chrome tests
```bash
npm run test:mobile
```

### Run tests with browser window visible (headed mode)
```bash
npm run test:headed
```

### Open Playwright UI mode (best for beginners — visual runner)
```bash
npm run test:ui
```

### View the HTML report after a run
```bash
npm run report
```

---

## What Each Test Validates

### Core (runs on both desktop + mobile)
| Test | What it checks |
|------|---------------|
| Page loads + correct title | HTTP 200, title contains "Lallantop" |
| No 404/500 errors | Response status < 400 |
| Logo visible | `<img alt="The Lallantop">` in viewport |
| Navigation links present | Home, Shows, Video links exist |
| Content loaded | 5+ article/video links on page |
| Latest video section | Hindi heading is visible |
| Newsletter section | SUBSCRIBE button present |
| SEO meta description | `<meta name="description">` is non-empty |
| No broken images | Filters images with naturalWidth = 0 |
| Open Graph title | `<meta property="og:title">` set correctly |
| Article links are internal | hrefs point to thelallantop.com |

### Desktop only
| Test | What it checks |
|------|---------------|
| Viewport ≥ 1024px | Desktop width confirmed |
| Nav bar visible | Not collapsed into hamburger |
| Partner links present | Aajtak etc. in header |
| No horizontal scrollbar | body.scrollWidth ≤ window.innerWidth |

### Mobile only (Pixel 5)
| Test | What it checks |
|------|---------------|
| Viewport ≤ 768px | Mobile width confirmed |
| Logo visible on mobile | Logo rendered correctly |
| Viewport meta tag set | `width=device-width` in meta |
| No horizontal overflow | Content not clipped |
| Links are tappable | Minimum touch target height |

---

## Troubleshooting

**Error: `browserType.launch: Executable doesn't exist`**
```bash
npx playwright install
```

**Error: `net::ERR_NAME_NOT_RESOLVED`**
→ Check your internet connection. The tests run against the live website.

**Tests are slow / timing out**
→ Increase `navigationTimeout` in `playwright.config.js` from 30000 to 60000.

**Want to see what's happening during a test?**
```bash
npx playwright test --headed --slow-mo=1000
```
`--slow-mo=1000` adds a 1-second delay between each action so you can follow along.

---

## Next Steps After Running These Tests

1. **Add article page tests** — click an article, validate it opens correctly
2. **Add search tests** — if the site has a search bar
3. **Add video page tests** — `/video` section
4. **Set up GitHub Actions** — run automatically on every code push
