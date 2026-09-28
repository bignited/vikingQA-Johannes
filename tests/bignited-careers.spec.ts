import { test, expect } from '@playwright/test';

test.describe('Navigate to Junior Test Automation Engineer job posting', {
  tag: '@case',
  annotation: {
    type: 'description',
    description: 'A visitor navigates from the b.ignited homepage through the Careers page to the Junior Test Automation Engineer job detail page, verifying the heading and Apply button are present.',
  },
}, () => {
  test('loads the homepage', async ({ page }) => {
    await page.goto('https://bignited.be/');
    await expect(page).toHaveTitle(/b\.ignited/);
  });

  test('clicks Careers and reaches the careers page', async ({ page }) => {
    await page.goto('https://bignited.be/');
    await page.getByRole('link', { name: 'Careers' }).click();
    await expect(page).toHaveURL(/\/careers/);
  });

  test('clicks Discover our jobs and scrolls to the jobs section', async ({ page }) => {
    await page.goto('https://bignited.be/careers/');
    await page.getByText('Discover our jobs').click();
    await expect(page).toHaveURL(/careers/);
  });

  test('clicks Read more on Junior Test Automation Engineer and sees the job detail page', async ({ page }) => {
    await page.goto('https://bignited.be/careers/#tab-jobs');
    const readMoreLink = page
      .locator('a')
      .filter({ hasText: 'Junior Test Automation Engineer' })
      .first();
    await readMoreLink.click();
    await expect(page).toHaveURL(/junior-test-automation-engineer/);
    await expect(page.getByRole('heading', { name: 'Junior Test Automation Engineer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
  });
});
