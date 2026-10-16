import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

/**
 * Geräte für den mobilen Rundgang (tests/mobile-motion.spec.ts, je ein Video).
 * iPhones laufen in Chromium mit Geräte-Emulation (Viewport, DPR, Touch, UA): WebKit braucht unter WSL
 * Systembibliotheken (libgtk-4, libgraphene …), die hier nicht installiert sind – siehe DECISIONS.md.
 */
const phone = (name: keyof typeof devices) => {
  const { defaultBrowserType: _browser, ...device } = devices[name];
  void _browser;
  return { ...device, browserName: "chromium" as const, video: { mode: "on" as const, size: device.viewport } };
};

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", testIgnore: /mobile-motion/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testIgnore: /mobile-motion/, use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    { name: "iphone-13", testMatch: /mobile-motion/, use: phone("iPhone 13") },
    { name: "iphone-se", testMatch: /mobile-motion/, use: phone("iPhone SE (3rd gen)") },
    { name: "pixel-7", testMatch: /mobile-motion/, use: phone("Pixel 7") },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
