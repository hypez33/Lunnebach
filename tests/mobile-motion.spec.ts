import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

/**
 * Mobiler Rundgang „wie ein Mensch mit Handy“ – läuft nur in den Geräteprojekten (iphone-13, iphone-se, pixel-7)
 * und nimmt pro Gerät ein Video auf (qa/videos/<gerät>.webm).
 * Gescrollt wird mit echten Wheel-Events, gewischt mit echten Touch-Events (CDP) – kein window.scrollTo,
 * damit die ScrollTrigger wie auf dem Gerät auslösen.
 */

/** In kleinen Schritten scrollen, bis das Ziel (oder das Seitenende) erreicht ist */
async function wheelTo(page: Page, until: () => Promise<boolean>, step = 220, pause = 70) {
  for (let i = 0; i < 400; i++) {
    if (await until()) return;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(pause);
  }
}
const atBottom = (page: Page) =>
  page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4);

/** Wischgeste mit echten Touch-Events (Chromium erzeugt daraus Pointer Events) */
async function swipe(page: Page, from: { x: number; y: number }, dx: number, dy: number) {
  const cdp = await page.context().newCDPSession(page);
  const steps = 10;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from.x, y: from.y }] });
  for (let i = 1; i <= steps; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: from.x + (dx * i) / steps, y: from.y + (dy * i) / steps }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
}

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ page }, info) => {
  const video = page.video();
  await page.close();
  if (video) {
    mkdirSync("qa/videos", { recursive: true });
    await video.saveAs(`qa/videos/${info.project.name}.webm`);
  }
});

test("Rundgang: Startseite, Menü, Projektkarte, Galerie, Anfrage", async ({ page }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  // 1 – Startseite komplett durchscrollen
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  let sawActive = false;
  let maxCounter = "";
  await wheelTo(page, async () => {
    const s = await page.evaluate(() => ({
      active: document.querySelectorAll(".is-active").length,
      counter: document.querySelector(".process-vruler .process-counter-current")?.textContent ?? "",
    }));
    if (s.active) sawActive = true;
    if (s.counter > maxCounter) maxCounter = s.counter;
    return atBottom(page);
  });
  expect(sawActive, "In-view active greift auf Touch").toBe(true);
  const stacked = await page.locator(".process--stack").count();
  if (stacked) expect(maxCounter, "Zähler im Werkbank-Stapel zählt bis 05").toBe("05");

  // 2 – Menü öffnen und schließen
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Menü" }).tap();
  const menu = page.getByRole("dialog", { name: "Menü" });
  await expect(menu).toBeVisible();
  await page.waitForTimeout(900);
  await menu.getByRole("button", { name: "Schließen" }).tap();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Menü" })).toBeFocused();

  // 3 – Projektkarte antippen (View Transition zur Detailseite)
  await page.goto("/projekte", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const card = page.getByRole("link", { name: "Emser Therme" });
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await card.tap();
  await page.waitForURL("**/projekte/emser-therme");
  await page.waitForTimeout(900);

  // 4 – Galerie: öffnen, wischen, nach unten wegwischen
  const tile = page.getByRole("button", { name: /^Bild 1 von/ });
  await wheelTo(page, async () => (await tile.boundingBox())!.y < 300);
  await page.waitForTimeout(700);
  await tile.tap();
  const lightbox = page.getByRole("dialog", { name: /Galerie/ });
  await expect(lightbox).toBeVisible();
  await page.waitForTimeout(800);
  const vp = page.viewportSize()!;
  const center = { x: vp.width / 2, y: vp.height / 2 };
  await swipe(page, center, 160, 0); // Rubber-Band an Bild 1
  await page.waitForTimeout(600);
  await expect(lightbox.getByText("01 / 07")).toBeVisible();
  await swipe(page, center, -220, 0);
  await page.waitForTimeout(700);
  await expect(lightbox.getByText("02 / 07")).toBeVisible();
  await swipe(page, center, -220, 0);
  await page.waitForTimeout(700);
  await expect(lightbox.getByText("03 / 07")).toBeVisible();
  await swipe(page, center, 0, 260); // nach unten schließen
  await expect(lightbox).toHaveCount(0);
  await page.waitForTimeout(500);

  // 5 – Anfrage-Assistent durchklicken
  await page.goto("/anfrage", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.getByText("Für mein Zuhause").tap();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Weiter" }).tap();
  await expect(page.locator("#step-title")).toContainText("Schritt 2 von 4");
  await page.waitForTimeout(500);
  await page.getByText("Küche", { exact: true }).tap();
  await page.getByRole("textbox", { name: /Kurze Beschreibung/ }).fill("Neue Küche mit Kochinsel in Eiche, ca. 14 m².");
  await page.getByRole("button", { name: "Weiter" }).tap();
  await expect(page.locator("#step-title")).toContainText("Schritt 3 von 4");
  await page.waitForTimeout(500);
  await page.getByText("In 3 bis 6 Monaten").tap();
  await page.getByRole("button", { name: "Weiter" }).tap();
  await expect(page.locator("#step-title")).toContainText("Schritt 4 von 4");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Zurück" }).tap();
  await expect(page.locator("#step-title")).toContainText("Schritt 3 von 4");
  await page.waitForTimeout(700);

  expect(errors).toEqual([]);
});
