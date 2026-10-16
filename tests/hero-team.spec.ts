import { expect, test, type Locator } from "@playwright/test";

const offset = (element: Locator, axis: "x" | "y") => element.evaluate((el, axis) => {
  const matrix = new DOMMatrix(getComputedStyle(el).transform);
  return axis === "x" ? matrix.m41 : matrix.m42;
}, axis);

test("Werkstattfenster füllt auf Desktop den Platz unter den Hero-Buttons und reagiert auf Maus und Scroll", async ({ page, isMobile }) => {
  test.skip(isMobile, "Auf Mobile wird das Werkstattfenster ausgeblendet.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) errors.push(message.text());
  });
  await page.goto("/");
  const team = page.locator(".hero-team");
  const frame = team.locator("[data-team-reveal]");
  await expect(team).toBeVisible();
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveCSS("clip-path", "none");
  const geometry = await team.evaluate((el) => {
    const buttons = el.previousElementSibling!.getBoundingClientRect();
    const photo = el.querySelector(".hero-team-window")!.getBoundingClientRect();
    const cabinet = document.querySelector("[data-hero-door]")!.getBoundingClientRect();
    return { width: photo.width, height: photo.height, gap: photo.top - buttons.bottom, right: photo.right, cabinetLeft: cabinet.left };
  });
  expect(geometry.width).toBeGreaterThan(400);
  expect(geometry.width).toBeLessThanOrEqual(600);
  expect(geometry.height).toBeGreaterThan(180);
  expect(geometry.gap).toBeGreaterThan(20);
  expect(geometry.gap).toBeLessThan(50);
  expect(geometry.right).toBeLessThan(geometry.cabinetLeft);

  const pointer = team.locator("[data-team-pointer]");
  await frame.hover({ position: { x: 80, y: 70 } });
  await expect.poll(() => offset(pointer, "x")).toBeLessThan(-2);
  await frame.hover({ position: { x: 450, y: 170 } });
  await expect.poll(() => offset(pointer, "x")).toBeGreaterThan(2);
  await page.mouse.move(0, 0);
  await expect.poll(() => offset(pointer, "x")).toBeCloseTo(0, 1);

  const depth = team.locator("[data-team-scroll]");
  const before = await offset(depth, "y");
  await page.mouse.wheel(0, 220);
  await expect.poll(() => offset(depth, "y")).toBeLessThan(before - 2);
  expect(errors).toEqual([]);
});

test("Werkstattfenster bleibt auf Mobile ohne Platz und ohne Bildabruf", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Prüft die mobile Ausblendung.");
  const requests: string[] = [];
  page.on("request", (request) => {
    if (decodeURIComponent(request.url()).includes("/images/team/team-lunnebach.jpg")) requests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".hero-team")).toBeHidden();
  expect(await page.locator(".hero-team").evaluate((el) => el.getBoundingClientRect().height)).toBe(0);
  await expect(page.locator("#hero-title")).toBeVisible();
  expect(requests).toEqual([]);
});

test("Werkstattfenster bleibt mit reduzierter Bewegung sichtbar und ist per Tastatur erreichbar", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-Komposition.");
  await page.goto("/");
  const team = page.locator(".hero-team");
  const frame = team.locator("[data-team-reveal]");
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveCSS("clip-path", "none");
  await frame.hover({ position: { x: 80, y: 70 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(team.locator("[data-team-pointer]")).toHaveCSS("transform", "none");
  await expect(team.locator("[data-team-scroll]")).toHaveCSS("transform", "none");
  await expect(frame).toHaveCSS("clip-path", "none");
  const link = team.getByRole("link", { name: "Unser Team und die Werkstatt kennenlernen" });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/werkstatt");
  await expect(page.locator("h1:visible")).toHaveCount(1);
});

test("Werkstattfenster ist auch ohne JavaScript sichtbar", async ({ browser, baseURL, isMobile }) => {
  test.skip(isMobile, "Desktop-Komposition.");
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const team = page.locator(".hero-team");
    await expect(team.locator("img")).toBeVisible();
    await expect(team.locator("[data-team-reveal]")).toHaveCSS("clip-path", "none");
  } finally {
    await context.close();
  }
});
