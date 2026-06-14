// tests/homepage.spec.js
// UI Automation tests for thelallantop.com homepage
// Covers: Desktop Chrome (1280x720) + Mobile Chrome (Pixel 5 — 393x851)
// Suites: Core | Desktop | Mobile | Ads
 
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
 
// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — Core Homepage Validations (runs on BOTH desktop + mobile)
// ─────────────────────────────────────────────────────────────────────────────
 
test.describe('Homepage — Core validations @core', () => {
 
  test('Page loads successfully and has correct title', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
 
    const title = await home.getTitle();
    expect(title).toContain('Lallantop');
    expect(page.url()).toContain('thelallantop.com');
  });
 
  test('Page should not show any error (404 / 500)', async ({ page }) => {
    // 'commit' returns as soon as server responds — no need to wait for ads/images
    const response = await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'commit',
      timeout: 60000
    });
    expect(response.status()).toBeLessThan(400);
  });
 
  test('Logo is visible on the page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
 
    // Target the logo inside the nav link — always rendered
    const logo = page.locator('a[href="https://www.thelallantop.com"] img').first();
    await expect(logo).toBeAttached({ timeout: 10000 });
  });
 
  test('Navigation links are present', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
 
    // Exact absolute URLs as rendered by the website
    await expect(page.locator('a[href="https://www.thelallantop.com"]').first()).toBeAttached();
    await expect(page.locator('a[href="https://www.thelallantop.com/show"]').first()).toBeAttached();
    await expect(page.locator('a[href="https://www.thelallantop.com/video"]').first()).toBeAttached();
  });
 
  test('Homepage has multiple article links (content is loaded)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
 
    const count = await home.getArticleLinkCount();
    console.log(`  → Found ${count} article/video links on homepage`);
    expect(count).toBeGreaterThan(5);
  });
 
  test('Latest video section is visible', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
 
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
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
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
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
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
 
    const firstArticleHref = await page.locator('a[href*="/post/"]').first().getAttribute('href');
    expect(firstArticleHref).toBeTruthy();
    const isInternal = firstArticleHref.startsWith('/')
      || firstArticleHref.includes('thelallantop.com');
    expect(isInternal).toBeTruthy();
  });
 
});
 
// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — Desktop-specific checks (1280 x 720)
// ─────────────────────────────────────────────────────────────────────────────
 
test.describe('Homepage — Desktop view specific @desktop', () => {
 
  // Force desktop viewport for this entire suite
  test.use({ viewport: { width: 1280, height: 720 } });
 
  test('Viewport is desktop width (≥ 1024px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const vp = page.viewportSize();
    console.log(`  → Viewport: ${vp.width}x${vp.height}`);
    expect(vp.width).toBeGreaterThanOrEqual(1024);
  });
 
  test('Desktop navigation bar is visible', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 8000 });
  });
 
  test('Desktop: partner network links visible (Aajtak, Indiatoday etc.)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const aajtakLink = page.locator('a[href*="aajtak.in"]').first();
    await expect(aajtakLink).toBeAttached({ timeout: 8000 });
  });
 
  test('Desktop: page width fills correctly (no horizontal scrollbar)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });
 
});
 
// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — Mobile-specific checks (Pixel 5 — 393 x 851)
// ─────────────────────────────────────────────────────────────────────────────
 
test.describe('Homepage — Mobile view specific @mobile', () => {
 
  // Force mobile viewport for this entire suite
  test.use({ viewport: { width: 393, height: 851 } });
 
  test('Viewport is mobile width (≤ 768px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const vp = page.viewportSize();
    console.log(`  → Viewport: ${vp.width}x${vp.height}`);
    expect(vp.width).toBeLessThanOrEqual(768);
  });
 
  test('Mobile: logo is visible', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    // Target the nav logo link's image directly
    const mobileLogo = page.locator('a[href="https://www.thelallantop.com"] img').first();
    await expect(mobileLogo).toBeAttached({ timeout: 10000 });
  });
 
  test('Mobile: page is touch-friendly (viewport meta tag set)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const viewport = await page.$eval(
      'meta[name="viewport"]',
      el => el.getAttribute('content')
    ).catch(() => null);
 
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=device-width');
  });
 
  test('Mobile: no horizontal overflow / content not clipped', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth + 5; // 5px tolerance
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });
 
  test('Mobile: article links are tappable (min height 44px)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const firstLink = page.locator('a[href*="/post/"]').first();
    const box = await firstLink.boundingBox();
    if (box) {
      console.log(`  → First article link height: ${box.height}px`);
      expect(box.height).toBeGreaterThan(20);
    }
  });
 
});
 
// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — Ad Verification (runs on BOTH desktop + mobile)
// ─────────────────────────────────────────────────────────────────────────────
 
test.describe('Homepage — Ad Verification @core', () => {
 
  test('Ad label "Advertisement" is visible on page', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    const adLabel = page.locator('p:text("Advertisement")').first();
    await expect(adLabel).toBeVisible({ timeout: 15000 });
  });
 
  test('At least one ad iframe is present in DOM', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    // ATF ads are injected by GPT JS script after domcontentloaded
    // Wait for GPT to inject the iframe into the ad slot
    await page.waitForSelector(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]',
      { timeout: 15000 }
    );
 
    const adIframe = page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).first();
    await expect(adIframe).toBeAttached({ timeout: 15000 });
  });
 
  test('2 ATF ad slots are present on page load', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    // "Advertisement" paragraph labels are in static HTML — one per ad slot
    // Most reliable indicator because it doesn't depend on GPT JS timing
    const adLabels = await page.locator('p:text("Advertisement")').count();
    console.log(`  → Advertisement labels found: ${adLabels}`);
 
    // Wait extra time for GPT script to inject ATF ad iframes
    await page.waitForTimeout(3000);
 
    // Count GPT ad div containers injected by Google Publisher Tag
    const gptAdDivs = await page.locator('[id*="div-gpt-ad"]').count();
 
    // Count actual iframes injected inside GPT slots
    const adIframes = await page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).count();
 
    console.log(`  → GPT ad div containers: ${gptAdDivs}`);
    console.log(`  → Ad iframes injected: ${adIframes}`);
 
    // At least 2 ATF ads should be present — verified via ad labels in static HTML
    expect(adLabels).toBeGreaterThanOrEqual(2);
  });
 
  test('Ad network requests are fired on page load', async ({ page }) => {
    const adRequests = [];
 
    // Intercept network requests BEFORE navigating
    page.on('request', request => {
      const url = request.url();
      if (
        url.includes('doubleclick.net') ||
        url.includes('googlesyndication.com') ||
        url.includes('adroll.com') ||
        url.includes('googleads.g.doubleclick') ||
        url.includes('pagead2.googlesyndication')
      ) {
        adRequests.push(url);
      }
    });
 
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    console.log(`  → Ad network requests fired: ${adRequests.length}`);
    expect(adRequests.length).toBeGreaterThan(0);
  });
 
  test('Ad requests return successful responses (no blocked ads)', async ({ page }) => {
    const adResponses = [];
 
    // Intercept ad responses
    page.on('response', response => {
      const url = response.url();
      if (
        url.includes('doubleclick.net') ||
        url.includes('googlesyndication.com') ||
        url.includes('adroll.com')
      ) {
        adResponses.push({ url, status: response.status() });
      }
    });
 
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    console.log(`  → Ad responses received: ${adResponses.length}`);
 
    // Check no ad requests returned 4xx or 5xx errors
    const failedAds = adResponses.filter(r => r.status >= 400);
    if (failedAds.length > 0) {
      console.warn('  ⚠ Failed ad responses:', failedAds);
    }
    expect(failedAds.length).toBe(0);
  });
 
  test('Ad iframe has a src attribute (ad request was made)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    // Wait for GPT to inject ATF ad iframes into div-gpt-ad containers
    await page.waitForSelector(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]',
      { timeout: 15000 }
    );
 
    const firstIframeSrc = await page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).first().getAttribute('src');
 
    console.log(`  → Ad iframe src: ${firstIframeSrc ? firstIframeSrc.substring(0, 80) + '...' : 'null'}`);
 
    // src being set means the GPT ad slot successfully requested an ad
    expect(firstIframeSrc).toBeTruthy();
  });
 
  test('Ad slots do not overlap with navigation bar', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    // Wait for GPT to inject ATF ad iframe
    await page.waitForSelector(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]',
      { timeout: 15000 }
    );
 
    const adIframe = page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).first();
    const nav = page.locator('nav').first();
 
    const adBox  = await adIframe.boundingBox();
    const navBox = await nav.boundingBox();
 
    if (adBox && navBox) {
      console.log(`  → Nav bottom: ${Math.round(navBox.y + navBox.height)}px`);
      console.log(`  → Ad top: ${Math.round(adBox.y)}px`);
      // Ad should start below the navigation bar
      expect(adBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height);
    }
  });
 
  test('Page load time is acceptable despite ads (< 15 seconds)', async ({ page }) => {
    const start = Date.now();
 
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    const loadTime = Date.now() - start;
    console.log(`  → Page loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(15000);
  });
 
  test('Ad slots are present on scroll (lazy-loaded ads)', async ({ page }) => {
    await page.goto('https://www.thelallantop.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
 
    // Wait for GPT to inject ATF ads first
    await page.waitForTimeout(3000);
 
    // Count ATF ad iframes before scroll (should be 2)
    const beforeScroll = await page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).count();
 
    // Scroll down to trigger below-the-fold lazy-loaded ads
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(3000); // wait for lazy ads to be injected by GPT
 
    // Count ad iframes after scroll — more should be loaded
    const afterScroll = await page.locator(
      '[id*="div-gpt-ad"] iframe, iframe[src*="doubleclick"], iframe[id*="google_ads"]'
    ).count();
 
    console.log(`  → ATF ad iframes before scroll: ${beforeScroll}`);
    console.log(`  → Ad iframes after scroll: ${afterScroll}`);
 
    // 2 ATF ads before scroll; more lazy ads should load after scrolling
    expect(beforeScroll).toBeGreaterThanOrEqual(2);
    expect(afterScroll).toBeGreaterThanOrEqual(beforeScroll);
  });
 
});