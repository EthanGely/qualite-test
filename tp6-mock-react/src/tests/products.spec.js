import { test, expect } from '@playwright/test';

test.describe('Catalogue produits (UI)', () => {
  test('affiche la liste des produits', async ({ page }) => {
    await page.goto('http://localhost:5173/', { ignoreHTTPSErrors: true }, 'networkidle');
    await expect(page.getByRole('heading', { name: /catalogue produits/i })).toBeVisible();
    const items = page.locator('ul > li');
    await expect(items.count()).resolves.toBeGreaterThan(0);
  });

  test('chaque produit affiche un nom et un prix', async ({ page }) => {
    await page.goto('http://localhost:5173/', { ignoreHTTPSErrors: true }, 'networkidle');
    await expect(page.getByRole('heading', { name: /catalogue produits/i })).toBeVisible();
    const items = page.locator('ul > li');
    const count = await items.count();
    await expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      expect(text).toMatch(/.+ — \d+(\.\d+)?€?/);
    }
  });
});

test.describe('API /api/products', () => {
  test('renvoie une liste de produits', async ({ request }) => {
    const res = await request.get('https://localhost:5173/api/products',  { ignoreHTTPSErrors: true }, 'networkidle');
    expect(res.ok()).toBeTruthy();
    const products = await res.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('string');
      expect(!isNaN(Number(product.price))).toBe(true);
    }
  });
});