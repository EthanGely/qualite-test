import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173', // adapte si besoin
    timeout: 30000, // en ms : 30 secondes
  },
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
});
