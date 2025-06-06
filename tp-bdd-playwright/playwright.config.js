module.exports = {
  testDir: 'features',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: 'list',
  use: {
    headless: true,
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node server/index.js',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};