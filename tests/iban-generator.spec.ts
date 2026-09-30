import { test, expect } from '@playwright/test';

test.describe('Generate Belgian IBANs via Test Data Generator', {
  tag: '@case',
  annotation: {
    type: 'description',
    description: 'A user navigates from the bignited.be homepage through Services to the Test Data Generator, generates 5 Belgian IBANs and copies them to the clipboard.',
  },
}, () => {
  test.describe.configure({ mode: 'serial' });

  test('navigates to Services and clicks Read more for Test Data Generator', async ({ page }) => {
    await page.goto('https://bignited.be/');
    await page.getByRole('list').getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('https://bignited.be/services');
    await page.getByRole('link', { name: 'Read more' }).nth(1).click();
    await expect(page).toHaveURL('https://bignited.be/services/test-data-generator');
  });

  test('opens the Test Data Generator tool', async ({ page }) => {
    await page.goto('https://bignited.be/services/test-data-generator');
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('link', { name: 'To the Test Data Generator' }).click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://testdatagenerator.bignited.be/');
  });

  test('generates 5 Belgian IBANs and copies them', async ({ page }) => {
    await page.goto('https://testdatagenerator.bignited.be/');

    // Dismiss the extension notification popup if present
    const closeButton = page.getByRole('button', { name: 'closeButton' });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }

    // Open IBAN section
    await page.getByRole('button', { name: 'iban International Bank' }).click();

    // Wait for country combobox to appear
    const countryInput = page.locator('#iban-iban');
    await expect(countryInput).toBeVisible({ timeout: 10000 });

    // Select Belgium
    await countryInput.click();
    await countryInput.fill('Belgium');
    await page.getByRole('option', { name: 'Belgium' }).click();

    // Set amount to 5
    await page.locator('#iban-amount').fill('5');

    // Generate
    await page.locator('#iban-generate-button').click();

    // Verify results are shown
    await expect(page.locator('#iban-copy')).toBeVisible();

    // Copy
    await page.locator('#iban-copy > svg').click();
  });
});
