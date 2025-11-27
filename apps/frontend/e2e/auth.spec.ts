import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to register and login', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Click register link
    await page.click('text=Get Started');

    // Fill registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.selectOption('select[name="role"]', 'patient');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');

    // Should show welcome message
    await expect(page.locator('text=Welcome back, Test')).toBeVisible();
  });

  test('should show validation errors for invalid form data', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Email address is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});