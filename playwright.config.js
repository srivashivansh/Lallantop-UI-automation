// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where test files are located
  testDir: './tests',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests once
  retries: 1,

  // Number of workers (parallel threads)
  workers: 2,

  // Reporter: shows results in terminal + generates HTML report
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'on-failure' }]
  ],

  // Global settings for all tests
  use: {
    // Base URL of the website
    baseURL: 'https://www.thelallantop.com',

    // Take screenshot on test failure
    screenshot: 'only-on-failure',

    // Record video on first retry
    video: 'on-first-retry',

    // Capture trace on first retry (for debugging)
    trace: 'on-first-retry',

    // Wait up to 10s for page actions
    actionTimeout: 10000,

    // Wait up to 30s for navigation
    navigationTimeout: 30000,
  },

  // ─── Projects ──────────────────────────────────────────────────────────────

  projects: [
    // 1. Desktop Chrome (1280 x 720)
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        channel: 'chrome',   // uses your locally installed Chrome
      },
    },

    // 2. Mobile Chrome – Pixel 5 emulation (393 x 851)
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        channel: 'chrome',
      },
    },
  ],

  // Output folder for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results/',
});
