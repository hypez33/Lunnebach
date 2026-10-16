import { expect, test } from "@playwright/test";

test("Mobile Scroll-Motion startet auch nach einem Sprung ans Seitenende fehlerfrei", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Regression betrifft die Touch-Trigger auf mobilen Geräten.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  // Langsames mobiles Netz: Die Sprungmarke wird erreicht, bevor die Motion-Plugins geladen sind.
  await page.route("**/_next/static/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.continue();
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt === 0) await page.goto("/privat#outdoor");
    else await page.reload();
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await expect(page.locator("#outdoor")).toBeInViewport();

    // Diese Touch-Trigger wurden beim Absturz nicht mehr angelegt.
    const card = page.locator(".project-card").first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-active/);
    await expect(card.locator(".card-dim .dim-label")).toHaveCSS("opacity", "1");
    expect(errors).toEqual([]);
  }
});

test("Schriften werden mobil ohne ungenutzte globale Font-Preloads geladen", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Prüft das mobile Laden der Schriften.");
  const response = await page.goto("/privat");
  const links = response?.headers().link ?? "";
  expect(links).not.toMatch(/as="?font/);
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
  await expect.poll(() => page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((font) => font.status === "loaded")
      .map((font) => font.family);
  })).toEqual(expect.arrayContaining(["Fraunces", "Instrument Sans"]));
});
