const { test, expect } = require("@playwright/test");

test.describe.configure({ mode: 'parallel' });

test.describe("Order Form", () => {
    test("should submit a valid order with standard delivery", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.screenshot({ path: "screenshots/order-page-standard.png" });
        await page.selectOption("#product", "T-shirt");
        await page.screenshot({ path: "screenshots/order-T-shirt-selected.png" });
        await page.fill("#quantity", "2");
        await page.check('input[name="delivery"][value="standard"]');
        await page.click('button[type="submit"]');

        const summary = page.locator("#summary");
        await expect(summary).toBeVisible();
        await expect(summary).toHaveText("Commande confirmée : 2 x T-shirt, livraison standard");
        await page.screenshot({ path: "screenshots/order-T-shirt-standard-summary.png" });
    });

    test("should submit a valid order with express delivery", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.screenshot({ path: "screenshots/order-page-express.png" });
        await page.selectOption("#product", "Mug");
        await page.screenshot({ path: "screenshots/order-Mug-selected.png" });
        await page.fill("#quantity", "1");
        await page.check('input[name="delivery"][value="express"]');
        await page.click('button[type="submit"]');

        const summary = page.locator("#summary");
        await expect(summary).toBeVisible();
        await expect(summary).toHaveText("Commande confirmée : 1 x Mug, livraison express");
        await page.screenshot({ path: "screenshots/order-Mug-express-summary.png" });
    });

    test("should show alert if product is not selected", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.fill("#quantity", "1");
        await page.screenshot({ path: "screenshots/order-no-product.png" });
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("Veuillez remplir tous les champs");
            dialog.dismiss();
        });
        await page.click('button[type="submit"]');
        await expect(page.locator("#summary")).toBeHidden();
        await page.screenshot({ path: "screenshots/order-no-product-alert.png" });
    });

    test("should show alert if quantity is missing", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.selectOption("#product", "T-shirt");
        await page.screenshot({ path: "screenshots/order-T-shirt-no-quantity.png" });
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("Veuillez remplir tous les champs");
            dialog.dismiss();
        });
        await page.click('button[type="submit"]');
        await expect(page.locator("#summary")).toBeHidden();
        await page.screenshot({ path: "screenshots/order-T-shirt-no-quantity-alert.png" });
    });

    test("should show alert if quantity is zero", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.selectOption("#product", "T-shirt");
        await page.fill("#quantity", "0");
        await page.screenshot({ path: "screenshots/order-T-shirt-quantity-zero.png" });
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("Veuillez remplir tous les champs");
            dialog.dismiss();
        });
        await page.click('button[type="submit"]');
        await expect(page.locator("#summary")).toBeHidden();
        await page.screenshot({ path: "screenshots/order-T-shirt-quantity-zero-alert.png" });
    });

    test("should show alert if quantity is negative", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.selectOption("#product", "Mug");
        await page.fill("#quantity", "-5");
        await page.screenshot({ path: "screenshots/order-Mug-quantity-negative.png" });
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("Veuillez remplir tous les champs");
            dialog.dismiss();
        });
        await page.click('button[type="submit"]');
        await expect(page.locator("#summary")).toBeHidden();
        await page.screenshot({ path: "screenshots/order-Mug-quantity-negative-alert.png" });
    });

    test("should keep summary hidden before submission", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.screenshot({ path: "screenshots/order-summary-hidden.png" });
        await expect(page.locator("#summary")).toBeHidden();
    });

    test("should allow switching delivery method before submit", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.selectOption("#product", "T-shirt");
        await page.fill("#quantity", "3");
        await page.check('input[name="delivery"][value="express"]');
        await page.screenshot({ path: "screenshots/order-T-shirt-express-before-submit.png" });
        await page.click('button[type="submit"]');
        const summary = page.locator("#summary");
        await expect(summary).toBeVisible();
        await expect(summary).toHaveText("Commande confirmée : 3 x T-shirt, livraison express");
        await page.screenshot({ path: "screenshots/order-T-shirt-express-summary.png" });
    });

    test("should show alert if all fields are empty", async ({ page }) => {
        await page.goto("http://localhost:3000/order.html");
        await page.screenshot({ path: "screenshots/order-all-fields-empty.png" });
        page.once("dialog", (dialog) => {
            expect(dialog.message()).toContain("Veuillez remplir tous les champs");
            dialog.dismiss();
        });
        await page.click('button[type="submit"]');
        await expect(page.locator("#summary")).toBeHidden();
        await page.screenshot({ path: "screenshots/order-all-fields-empty-alert.png" });
    });
});
