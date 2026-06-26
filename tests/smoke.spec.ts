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
    const links = ["Ecosystem", "Live", "Manifesto", "Get in touch"];
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
});
