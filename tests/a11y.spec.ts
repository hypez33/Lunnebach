import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { routes } from "./routes";

/** Langsam durchscrollen, damit Reveals (clip-path, SplitText) ihren Endzustand erreichen */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1600);
}

for (const route of routes) {
  test.describe(`a11y ${route}`, () => {
    for (const motion of ["reduce", "no-preference"] as const) {
      test(`axe – keine serious/critical Verstöße (motion: ${motion})`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: motion });
        await page.goto(route, { waitUntil: "networkidle" });
        await scrollThrough(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        const summary = blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join(" | ")}`);
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }

    test("genau eine H1, lang=de, Landmarks vorhanden", async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(page.locator("header.site-header")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
    });

    test("kein horizontales Scrollen bei 320 px", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("Ohne JavaScript ist der Inhalt sichtbar", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const route of ["/", "/projekte", "/projekte/emser-therme", "/karriere"]) {
    await page.goto(route);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    // Kein Element mit clip-path-Startzustand oder visibility:hidden durch Motion
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-hero-hidden],[data-hero-door],[data-clip]")].filter((el) => {
        const cs = getComputedStyle(el);
        return cs.visibility === "hidden" || (cs.clipPath && cs.clipPath !== "none");
      }).length,
    );
    expect(hidden, route).toBe(0);
  }
  await ctx.close();
});

test("Unbekannte Projekte liefern 404", async ({ request }) => {
  const res = await request.get("/projekte/gibt-es-nicht");
  expect(res.status()).toBe(404);
});

test("301-Weiterleitungen der alten URLs", async ({ request }) => {
  for (const [from, to] of [
    ["/ueber-uns", "/werkstatt"],
    ["/creativer-moebelbau", "/privat"],
    ["/objekteinrichtung", "/gewerbe"],
    ["/jobs", "/karriere"],
    ["/kontakt-2", "/anfrage"],
    ["/haftungsausschluss", "/impressum"],
  ]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
  }
});
