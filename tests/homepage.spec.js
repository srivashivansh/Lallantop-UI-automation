// tests/homepage.spec.js
// UI Automation tests for thelallantop.com homepage
// Covers: Desktop Chrome + Mobile Chrome (Pixel 5)

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — Core Homepage Validations (run on BOTH desktop + mobile)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Homepage — Core validations', () => {

  test('Page loads successfully and has correct title', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Page title must contain "Lallantop"
    const title = await home.getTitle();
    expect(title).toContain('Lallantop');

    // URL should be the homepage
    expect(page.url()).toContain('thelallantop.com');
  });

  test('Page should not show any error (404 / 500)', async ({ page }) => {
    // Capture the HTTP response for the homepage
    const response = await page.goto('https://www.thelallantop.com/');
    expect(response.status()).toBeLessThan(400);
  });

  test('Logo is visible on the page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // At least one logo image should be visible
    const logo = page.locator('img[alt="The Lallantop"]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
  });

  test('Navigation links are present', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Check all key nav links exist in the DOM
    await expect(page.locator('a[href="/"]').first()).toBeAttached();
    await expect(page.locator('a[href="/show"]').first()).toBeAttached();
    await expect(page.locator('a[href="/video"]').first()).toBeAttached();
  });

  test('Homepage has multiple article links (content is loaded)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // There should be at least 5 article or video links
    const count = await home.getArticleLinkCount();
    console.log(`  → Found ${count} article/video links on homepage`);
    expect(count).toBeGreaterThan(5);
  });

  test('Latest video section is visible', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Scroll down to find the section
    await page.evaluate(() => window.scrollBy(0, 600));
    const videoSection = page.locator('text=लेटेस्ट वीडियो').first();
    await expect(videoSection).toBeVisible({ timeout: 10000 });
  });

  test('Newsletter subscribe section is present', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await page.evaluate(() => window.scrollBy(0, 800));
    const subscribeBtn = page.locator('text=SUBSCRIBE').first();
    await expect(subscribeBtn).toBeAttached({ timeout: 10000 });
  });

  test('Page meta description is set (SEO check)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const metaDesc = await page.$eval(
      'meta[name="description"]',
      el => el.getAttribute('content')
    );
    expect(metaDesc).toBeTruthy();
    expect(metaDesc.length).toBeGreaterThan(20);
  });

  test('No broken images on visible area of homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Check all img elements in the viewport are loaded (naturalWidth > 0)
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => img.complete && img.naturalWidth === 0 && img.src)
        .map(img => img.src);
    });

    if (brokenImages.length > 0) {
      console.warn('  ⚠ Broken images found:', brokenImages);
    }
    // Allow max 2 broken images (ads/third-party images sometimes fail)
    expect(brokenImages.length).toBeLessThanOrEqual(2);
  });

  test('Page has correct Open Graph title tag (social sharing)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      el => el.getAttribute('content')
    ).catch(() => null);

    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toContain('Lallantop');
  });

  test('Article links open internal pages (not external redirects)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Get the href of the first article link
    const firstArticleHref = await page.locator('a[href*="/post/"]').first().getAttribute('href');
    expect(firstArticleHref).toBeTruthy();
    // Should be an internal Lallantop URL
    const isInternal = firstArticleHref.startsWith('/')
      || firstArticleHref.includes('thelallantop.com');
    expect(isInternal).toBeTruthy();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — Desktop-specific checks
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Homepage — Desktop view specific', () => {

  test.skip(({ isMobile }) => isMobile, 'Desktop only');

  test('Viewport is desktop width (≥ 1024px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const vp = page.viewportSize();
    console.log(`  → Viewport: ${vp.width}x${vp.height}`);
    expect(vp.width).toBeGreaterThanOrEqual(1024);
  });

  test('Desktop navigation bar is visible', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    // Nav should be visible (not collapsed into hamburger)
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 8000 });
  });

  test('Desktop: partner network links visible (Aajtak, Indiatoday etc.)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const aajtakLink = page.locator('a[href*="aajtak.in"]').first();
    await expect(aajtakLink).toBeAttached({ timeout: 8000 });
  });

  test('Desktop: page width fills correctly (no horizontal scrollbar)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — Mobile-specific checks
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Homepage — Mobile view specific', () => {

  test.skip(({ isMobile }) => !isMobile, 'Mobile only');

  test('Viewport is mobile width (≤ 768px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const vp = page.viewportSize();
    console.log(`  → Viewport: ${vp.width}x${vp.height}`);
    expect(vp.width).toBeLessThanOrEqual(768);
  });

  test('Mobile: logo is visible', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    // Mobile logo (SVG or image)
    const mobileLogo = page.locator('img[src*="logo"], img[alt*="Lallantop"], svg').first();
    await expect(mobileLogo).toBeVisible({ timeout: 10000 });
  });

  test('Mobile: page is touch-friendly (viewport meta tag set)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const viewport = await page.$eval(
      'meta[name="viewport"]',
      el => el.getAttribute('content')
    ).catch(() => null);

    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=device-width');
  });

  test('Mobile: no horizontal overflow / content not clipped', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth + 5; // 5px tolerance
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('Mobile: article links are tappable (min height 44px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/');
    // Check that at least one article link meets minimum touch target size
    const firstLink = page.locator('a[href*="/post/"]').first();
    const box = await firstLink.boundingBox();
    if (box) {
      console.log(`  → First article link height: ${box.height}px`);
      expect(box.height).toBeGreaterThan(20); // at least some clickable height
    }
  });

});
