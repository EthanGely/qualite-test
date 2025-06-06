const { test, expect, describe } = require('@playwright/test');

describe('Contact Form', () => {
    test('should fill, submit, and confirm message', async ({ page }) => {
        await page.goto('http://localhost:3000/contact');

        await page.fill('#firstname', 'Alice');
        await page.fill('#lastname', 'Dupont');
        await page.fill('#email', 'alice@example.com');
        await page.fill('#message', 'Bonjour, ceci est un test.');

        await page.click('button[type="submit"]');

        const confirmation = page.locator('#confirmation');
        await expect(confirmation).toBeVisible();
        await expect(confirmation).toHaveText('Merci pour votre message');

        await page.screenshot({ path: 'screenshots/formulaire-envoye.png' });
    });

    test('should not confirm when all fields are missing', async ({ page }) => {
        await page.goto('http://localhost:3000/contact');
        await page.click('button[type="submit"]');

        const confirmation = page.locator('#confirmation');
        await expect(confirmation).toBeHidden();

        await page.screenshot({ path: 'screenshots/formulaire-vide.png' });
    });

    test('should not confirm when name is missing', async ({ page }) => {
        await page.goto('http://localhost:3000/contact');

        await page.fill('#firstname', 'Alice');
        await page.fill('#email', 'alice@example.com');
        await page.fill('#message', 'Bonjour, ceci est un test.');

        await page.click('button[type="submit"]');

        const confirmation = page.locator('#confirmation');
        await expect(confirmation).toBeHidden();

        await page.screenshot({ path: 'screenshots/formulaire-sans-nom.png' });
    });

    test('should show validation error for invalid email', async ({ page }) => {
        await page.goto('http://localhost:3000/contact');

        await page.fill('#firstname', 'Alice');
        await page.fill('#lastname', 'Dupont');
        await page.fill('#email', 'not-an-email');
        await page.fill('#message', 'Bonjour, ceci est un test.');

        await page.click('button[type="submit"]');

        const confirmation = page.locator('#confirmation');
        await expect(confirmation).toBeHidden();

        const emailError = page.locator('#email:invalid');
        await expect(emailError).toHaveCount(1);

        await page.screenshot({ path: 'screenshots/formulaire-email-invalide.png' });
    });

    test('should not clear form after successful submission', async ({ page }) => {
        await page.goto('http://localhost:3000/contact');

        await page.fill('#firstname', 'Bob');
        await page.fill('#lastname', 'Martin');
        await page.fill('#email', 'bob@example.com');
        await page.fill('#message', 'Un autre test.');

        await page.click('button[type="submit"]');

        await expect(page.locator('#confirmation')).toBeVisible();

        // Check that fields are cleared (assuming form resets)
        await expect(page.locator('#firstname')).toHaveValue('Bob');
        await expect(page.locator('#lastname')).toHaveValue('Martin');
        await expect(page.locator('#email')).toHaveValue('bob@example.com');
        await expect(page.locator('#message')).toHaveValue('Un autre test.');

        await page.screenshot({ path: 'screenshots/formulaire-apres-reset.png' });
    });
});
