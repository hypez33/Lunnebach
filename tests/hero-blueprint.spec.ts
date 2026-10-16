import { expect, test, type Locator } from "@playwright/test";

const variable = (host: Locator, name: string) =>
  host.evaluate((el, key) => parseFloat(el.style.getPropertyValue(key)), name);

test("Hero-Lupe zeigt die Werkzeichnung und folgt der Maus", async ({ page, isMobile }) => {
  test.skip(isMobile, "Die Touch-Variante verwendet die Scanlinie.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const host = page.locator("[data-hero-door]");
  await expect(host).toHaveClass(/bp--lens/);
  await host.scrollIntoViewIfNeeded();
  await host.hover({ position: { x: 100, y: 150 } });
  await expect.poll(() => variable(host, "--r")).toBeGreaterThan(80);
  await expect(host.locator(".bp")).toHaveCSS("position", "absolute");
  await expect(host.locator(".bp")).toHaveCSS("mask-image", /radial-gradient/);
  await expect(host.locator(".bp")).toContainText("H 2 180");
  const before = await variable(host, "--mx");
  await host.hover({ position: { x: 220, y: 300 } });
  await expect.poll(() => variable(host, "--mx")).toBeGreaterThan(before + 15);
  await page.mouse.move(0, 0);
  await expect.poll(() => variable(host, "--r")).toBe(0);
  await expect(host.locator(".bp-ring")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test("Hero-Lupe führt ihren Hinweis einmal aus und schließt anschließend", async ({ page, isMobile }) => {
  test.skip(isMobile, "Kein automatischer Maus-Hinweis auf Touch-Geräten.");
  await page.goto("/");
  const host = page.locator("[data-hero-door]");
  await expect(host).toHaveClass(/bp--lens/);
  await expect.poll(() => variable(host, "--r"), { timeout: 6500 }).toBeGreaterThan(10);
  const before = await variable(host, "--my");
  await expect.poll(() => variable(host, "--my")).not.toBe(before);
  await expect.poll(() => variable(host, "--r"), { timeout: 6500 }).toBe(0);
  await expect(host.locator(".bp-ring")).toHaveCSS("opacity", "0");
});

test("Hero-Scan zeigt mobil beim Scrollen ein wanderndes Band", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Scanlinie ist die Touch-Variante.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const host = page.locator("[data-hero-door]");
  await expect(host).toHaveClass(/bp--scan/);
  await host.scrollIntoViewIfNeeded();
  await expect.poll(() => variable(host, "--sy")).toBeGreaterThan(0);
  await expect(host.locator(".bp")).toHaveCSS("mask-image", /linear-gradient/);
  await expect(host.locator(".bp-scanline")).toBeVisible();
  await expect(page.locator(".bp-hint")).toBeHidden();
  const before = await variable(host, "--sy");
  await page.mouse.wheel(0, 150);
  await expect.poll(() => variable(host, "--sy")).toBeGreaterThan(before + 10);
  const after = await variable(host, "--sy");
  await page.mouse.wheel(0, -150);
  await expect.poll(() => variable(host, "--sy")).toBeLessThan(after - 10);
  expect(errors).toEqual([]);
});

test("Reduzierte Bewegung räumt aktive Hero-Effekte und ihre Variablen auf", async ({ page, isMobile }) => {
  await page.goto("/");
  const host = page.locator("[data-hero-door]");
  await expect(host).toHaveClass(/bp-host/);
  if (!isMobile) await host.hover({ position: { x: 100, y: 150 } });
  else await host.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(host).not.toHaveClass(/bp-host/);
  await expect(host.locator(".bp")).toBeHidden();
  await expect(host.locator(".bp-ring")).toBeHidden();
  await expect(host.locator(".bp-scanline")).toBeHidden();
  await page.waitForTimeout(500);
  expect(await host.evaluate((el) => ["--mx", "--my", "--r", "--sy", "--bp-opacity"].map((key) => el.style.getPropertyValue(key)))).toEqual(["", "", "", "", ""]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(host).toHaveClass(isMobile ? /bp--scan/ : /bp--lens/);
});

test("Ohne JavaScript bleibt das Hero-Foto ohne Blueprint-Overlay sichtbar", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 375, height: 812 } : { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const host = page.locator("[data-hero-door]");
    await expect(host.locator("img")).toBeVisible();
    await expect(host.locator(".bp")).toBeHidden();
    await expect(host.locator(".bp-ring")).toBeHidden();
    await expect(host.locator(".bp-scanline")).toBeHidden();
    await expect(page.locator(".bp-hint")).toBeHidden();
  } finally {
    await context.close();
  }
});
