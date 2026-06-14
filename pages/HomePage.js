// pages/HomePage.js
// Page Object Model for thelallantop.com homepage
// All selectors and reusable actions live here — tests stay clean

const { expect } = require('@playwright/test');

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Logo ──────────────────────────────────────────────────────────────────
    this.logo = page.locator('img[alt="The Lallantop"]').first();

    // ── Navigation bar ────────────────────────────────────────────────────────
    this.navBar        = page.locator('nav').first();
    this.navHomeLink   = page.locator('a[href="https://www.thelallantop.com"]').first();
    this.navShowsLink  = page.locator('a[href="https://www.thelallantop.com/show"]').first();
    this.navVideoLink  = page.locator('a[href="https://www.thelallantop.com/video"]').first();

    // ── Hero / top news section ───────────────────────────────────────────────
    this.heroSection   = page.locator('main, [class*="hero"], [class*="top"]').first();
    this.articleLinks  = page.locator('a[href*="/post/"], a[href*="/video/"]');

    // ── Latest video section ──────────────────────────────────────────────────
    this.latestVideoSection = page.locator('text=लेटेस्ट वीडियो').first();

    // ── Newsletter subscribe ───────────────────────────────────────────────────
    this.newsletterSection  = page.locator('text=SUBSCRIBE').first();

    // ── Page title ────────────────────────────────────────────────────────────
    this.pageTitle = 'The Lallantop';
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Navigate to the homepage */
  async goto() {
    await this.page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
  }
  /** Get the current page title */
  async getTitle() {
    return await this.page.title();
  }

  /** Count all article/video links on the page */
  async getArticleLinkCount() {
    return await this.articleLinks.count();
  }

  /** Click a nav link by its visible text */
  async clickNavLink(linkText) {
    await this.page.getByRole('link', { name: linkText }).first().click();
  }

  /** Check if the page is mobile-width (viewport width ≤ 768px) */
  async isMobileView() {
    const vp = this.page.viewportSize();
    return vp ? vp.width <= 768 : false;
  }
}

module.exports = { HomePage };
