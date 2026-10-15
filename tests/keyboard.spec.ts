import { expect, test } from "@playwright/test";

test.describe("Tastatur", () => {
  test("Skip-Link ist erstes Fokusziel und springt zum Inhalt", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("Fokus ist überall sichtbar (Outline vorhanden)", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return "body";
        const cs = getComputedStyle(el);
        const after = getComputedStyle(el, "::after");
        const visible =
          (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) ||
          (after.outlineStyle !== "none" && parseFloat(after.outlineWidth) >= 2) ||
          // React-Aria-Komponenten zeichnen den Ring auf ein Kind (data-focus-visible)
          !!el.closest("[data-focus-visible]") ||
          !!el.querySelector("[data-focus-visible]");
        return visible ? "ok" : `${el.tagName}.${el.className}`;
      });
      expect(outline, `Tab ${i + 1}`).not.toMatch(/^(?!ok|body)/);
    }
  });

  test("Mobile-Menü: Fokus gefangen, Escape schließt, Fokus zurück", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menü" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Lightbox: Pfeiltasten, Escape, Fokus zurück", async ({ page }) => {
    await page.goto("/projekte/emser-therme");
    const thumb = page.getByRole("button", { name: /Bild 1 von 7/ });
    await thumb.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("01 / 07")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText("02 / 07")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText("07 / 07")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(thumb).toBeFocused();
  });

  test("Projektfilter per Tastatur", async ({ page }) => {
    await page.goto("/projekte");
    const privat = page.getByRole("radio", { name: /Privat/ }).or(page.getByRole("button", { name: /Privat/ })).first();
    await privat.focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("status")).toContainText("Privat");
  });

  test("Projektanfrage komplett per Tastatur", async ({ page }) => {
    await page.goto("/anfrage");
    await page.getByRole("radio", { name: /Für mein Unternehmen/ }).focus();
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: "Weiter" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#step-title")).toBeFocused();
    await expect(page.locator("#step-title")).toContainText("Schritt 2 von 4");
    await page.getByRole("checkbox", { name: "Ladenbau" }).focus();
    await page.keyboard.press("Space");
    await page.getByRole("textbox", { name: /Kurze Beschreibung/ }).focus();
    await page.keyboard.type("Neuer Laden mit Theke und Regalwand, ca. 80 m².");
    await page.getByRole("button", { name: "Weiter" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#step-title")).toContainText("Schritt 3 von 4");
    await page.getByRole("radio", { name: "So bald wie möglich" }).focus();
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: "Weiter" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#step-title")).toContainText("Schritt 4 von 4");
    await page.getByRole("textbox", { name: /^Name/ }).focus();
    await page.keyboard.type("Erika Muster");
    await page.getByRole("textbox", { name: /^E-Mail/ }).focus();
    await page.keyboard.type("erika@beispiel.de");
    await page.getByRole("button", { name: "Anfrage senden" }).focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/anfrage/danke");
    await expect(page.locator("#thanks-title")).toContainText("Danke, Erika.");
  });
});

test.describe("Bewegung", () => {
  test("Schalter „Bewegung reduzieren“ setzt data-motion und bleibt gespeichert", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("switch", { name: "Bewegung reduzieren" }).last();
    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
    // Prozess bleibt vertikal, keine Pin-Strecke
    await expect(page.locator(".process--horizontal")).toHaveCount(0);
  });

  test("Desktop ohne Reduktion: Prozess ist gepinnte Horizontal-Strecke", async ({ page, isMobile }) => {
    test.skip(isMobile, "nur Desktop");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator(".process--horizontal")).toHaveCount(1);
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  });
});
