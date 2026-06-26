import { test, expect } from "@playwright/test";

test.describe("LUMINARA marketing site", () => {
  test("home renders with all five sections", async ({ page }) => {
    await page.goto("/");

    // Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /system around the model/i
    );

    // Pillars (the h2 says "Three products, one runtime.")
    await expect(page.getByRole("heading", { name: /three products/i })).toBeVisible();
    await expect(page.locator("#agent-os")).toContainText(/Agent OS/i);
    await expect(page.locator("#sigil-engine")).toContainText(/Sigil Engine/i);
    await expect(page.locator("#multimedia")).toContainText(/Multimedia/i);

    // Live state
    await expect(page.getByRole("heading", { name: /what.s running/i })).toBeVisible();

    // Manifesto
    await expect(page.getByRole("heading", { name: /five commitments/i })).toBeVisible();

    // Get involved
    await expect(page.getByRole("heading", { name: /build with us/i })).toBeVisible();

    // Skip link target
    await expect(page.locator("#main")).toBeVisible();
  });

  test("nav links resolve to sections", async ({ page }) => {
    await page.goto("/");
    const links = ["Ecosystem", "Live", "Manifesto", "Get in touch", "Skills"];
    for (const label of links) {
      await expect(page.getByRole("link", { name: new RegExp(label, "i") }).first()).toBeVisible();
    }
  });

  test("external links use rel=noopener", async ({ page }) => {
    await page.goto("/");
    const ext = page.locator('a[href^="https://github.com"]').first();
    await expect(ext).toHaveAttribute("rel", /noopener/);
    await expect(ext).toHaveAttribute("target", "_blank");
  });

  test("skills page lists all skills with per-skill pricing", async ({ page }) => {
    await page.goto("/skills");
    await expect(page.getByRole("heading", { name: /per-skill pricing/i })).toBeVisible();

    // 122 cards rendered (matches generated SKILLS array).
    const cards = page.locator(".skill-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(100);

    // Every card has a price block (real number, free, or "talk to us").
    const priceBlocks = page.locator(".skill-card__price");
    expect(await priceBlocks.count()).toBe(count);

    // Filter narrows the result set.
    await page.locator('select[name="cat"]').selectOption("creative");
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/cat=creative/);
    const filtered = await page.locator(".skill-card").count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(count);
  });
});

