import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/content/projects";

const counts = {
  Alle: projects.length,
  Privat: projects.filter((project) => project.world === "privat").length,
  Gewerbe: projects.filter((project) => project.world === "gewerbe").length,
};

async function openProjects(page: Page) {
  await page.goto("/projekte");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("radiogroup", { name: "Projekte filtern" }).evaluate((el) => {
    el.scrollIntoView({ block: "start", behavior: "instant" });
  });
}

async function expectFilter(page: Page, name: keyof typeof counts) {
  await expect(page.getByRole("radio", { name: new RegExp(`^${name}`) })).toBeChecked();
  const expectedStatus = `${counts[name]} Projekte${name === "Alle" ? "" : ` · ${name}`}`;
  await expect(page.getByRole("status")).toHaveText(expectedStatus);
  const grid = page.getByRole("region", { name: "Projektübersicht" }).locator("ul");
  await expect(grid.locator(":scope > li:visible")).toHaveCount(counts[name]);
  await expect(grid).toHaveCSS("opacity", "1");
  await expect(grid).not.toHaveAttribute("aria-busy", "true");
  if (name !== "Alle") {
    for (const card of await grid.locator("li:visible .project-card").all()) {
      await expect(card).toContainText(name);
    }
  }
}

test("Projektfilter verschiebt Karten in beiden Richtungen sichtbar und ohne Verzerrung", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openProjects(page);

  for (const name of ["Gewerbe", "Alle"] as const) {
    const sampling = page.evaluate(async () => {
      const grid = document.querySelector<HTMLElement>('[aria-label="Projektübersicht"] ul')!;
      const card = grid.querySelector<HTMLElement>('[data-project="buero-konferenz"]')!;
      const media = card.querySelector<HTMLElement>(".grain")!;
      const frames: { top: number; scaleX: number; scaleY: number; aspect: number; gridHeight: number; opacity: string }[] = [];
      const start = performance.now();
      do {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const box = media.getBoundingClientRect();
        const transform = new DOMMatrix(getComputedStyle(card).transform);
        frames.push({
          top: card.getBoundingClientRect().top - grid.getBoundingClientRect().top,
          scaleX: transform.a,
          scaleY: transform.d,
          aspect: box.width / box.height,
          gridHeight: grid.getBoundingClientRect().height,
          opacity: getComputedStyle(grid).opacity,
        });
      } while (performance.now() - start < 900);
      return frames;
    });
    await page.getByRole("radio", { name: new RegExp(`^${name}`) }).click();
    const frames = await sampling;
    // Ein Fade oder ein harter Sprung darf die gleitende Umsortierung nicht ersetzen.
    expect(new Set(frames.map((frame) => Math.round(frame.top))).size).toBeGreaterThan(5);
    const minHeight = Math.min(frames[0].gridHeight, frames.at(-1)!.gridHeight);
    for (const frame of frames) {
      expect(frame.scaleX).toBeCloseTo(1, 3);
      expect(frame.scaleY).toBeCloseTo(1, 3);
      expect(frame.aspect).toBeCloseTo(4 / 3, 2);
      expect(frame.gridHeight).toBeGreaterThanOrEqual(minHeight - 1);
      expect(frame.opacity).toBe("1");
    }
    await expectFilter(page, name);
    // Nach der Bewegung müssen auch die temporären absoluten Positionen entfernt sein.
    await expect(page.locator('[data-project="buero-konferenz"]')).toHaveCSS("position", "static");
  }
  expect(errors).toEqual([]);
});

test("Schnelle Projektfilter-Wechsel enden beim zuletzt gewählten Filter", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openProjects(page);
  for (const name of ["Gewerbe", "Alle", "Privat", "Gewerbe", "Alle"] as const) {
    await page.getByRole("radio", { name: new RegExp(`^${name}`) }).click();
  }
  await expectFilter(page, "Alle");
  await page.getByRole("radio", { name: /^Gewerbe/ }).focus();
  await page.keyboard.press("Space");
  await expectFilter(page, "Gewerbe");
  await expect(page.getByRole("radio", { name: /^Gewerbe/ })).toBeFocused();
  expect(errors).toEqual([]);
});

test("Projektfilter bleibt bei reduzierter Bewegung sofort sichtbar", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openProjects(page);
  for (const name of ["Gewerbe", "Alle"] as const) {
    await page.getByRole("radio", { name: new RegExp(`^${name}`) }).click();
    await expectFilter(page, name);
    const gridOpacity = await page.getByRole("region", { name: "Projektübersicht" }).locator("ul").evaluate((el) => getComputedStyle(el).opacity);
    expect(gridOpacity).toBe("1");
  }
});
