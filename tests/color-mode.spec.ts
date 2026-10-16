import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const key = "lunnebach:color-mode";

test("Systemfarbe, explizite Auswahl und Speicherung bleiben konsistent", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(28, 25, 22)");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(244, 241, 236)");
  await expect(page.locator("footer")).toHaveCSS("background-color", "rgb(28, 25, 22)");
  await expect(page.locator(".site-header .logo-on-dark")).toHaveCSS("opacity", "1");
  let toggle = page.locator("header").getByRole("switch", { name: "Dunkelmodus" });
  if (isMobile) {
    await page.getByRole("button", { name: "Menü", exact: true }).click();
    const menu = page.getByRole("dialog");
    await expect(menu).toBeVisible();
    await expect(menu.locator("[data-menu-meta]")).toHaveCount(5);
    await expect(menu.locator("[data-menu-num]")).toHaveCount(0);
    expect(await menu.locator("[data-menu-meta]").allTextContents()).toEqual(["Wohnräume", "Objekteinrichtung", "Ausgewählte Arbeiten", "Über uns", "Offene Stellen"]);
    toggle = menu.getByRole("switch", { name: "Dunkelmodus" });
    const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
  }
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(244, 241, 236)");
  if (isMobile) {
    await expect(page.getByRole("dialog")).toHaveCSS("background-color", "rgb(28, 25, 22)");
    await page.getByRole("button", { name: "Schließen" }).click();
  }
  expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe("light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", /#f4f1ec/i);
  await page.goto("/projekte");
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "light");
  expect(errors).toEqual([]);
});

test("Gespeicherter Dark Mode bleibt beim Seitenwechsel aktiv", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(k => localStorage.setItem(k, "dark"), key);
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "Projekte", exact: true }).click();
  await page.waitForURL("**/projekte");
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(28, 25, 22)");
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll(nodes => nodes.every(node => node.getAttribute("content")?.toLowerCase() === "#1c1916"))).toBe(true);
});

test("Systemwechsel folgt ohne Auswahl und Toggle funktioniert ohne Speicher", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error("blocked"); }; });
  await page.goto("/");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
  const toggle = page.locator("footer").getByRole("switch", { name: "Dunkelmodus" });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "light");
});

for (const route of ["/", "/privat", "/gewerbe", "/projekte", "/projekte/emser-therme", "/werkstatt", "/karriere", "/anfrage"]) {
  test(`Dark Mode: Kontraste und Layout ${route}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter(v => v.impact === "serious" || v.impact === "critical").map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
    for (const width of [320, 375, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth), { message: `Breite ${width}` }).toBeLessThanOrEqual(0);
      expect(await page.locator('header button:visible, header a:visible').evaluateAll(elements => elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.left < 0 || rect.right > innerWidth;
      }).map(el => el.getAttribute("aria-label") || el.textContent))).toEqual([]);
    }
    await expect(page.locator(".btn-primary").first()).toHaveCSS("color", "rgb(28, 25, 22)");
  });
}
