const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context, page }) => {
    await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:8081'
        ? route.continue() : route.abort());
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/js-enabled/);
});

test('outline-first hierarchy identifies Marc and removes unavailable or unsupported offers', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turn your book idea into a clear outline.');
    expect(await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id)))
        .toEqual(['home', 'services', 'how-it-works', 'about', 'books', 'portfolio', 'contact']);
    expect(await page.locator('[data-service]').evaluateAll(buttons => buttons.map(button => button.dataset.service)))
        .toEqual(['outline', 'formatting', 'kdp']);
    await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href', '#contact');
    await expect(page.locator('.hero-actions a').last()).toHaveAttribute('href', '#books');
    await expect(page.locator('.process-grid h3')).toHaveText(['Share your idea', 'Agree the scope', 'Develop the outline together']);
    await expect(page.locator('#about')).toContainText('Marc is the author of the books shown below');
    await expect(page.locator('.approach-note')).toContainText('AI tools can assist the work. Marc reviews the deliverables.');
    await expect(page.locator('#newsletter, .newsletter-form, a[href="#newsletter"], [data-service="arc-review"]')).toHaveCount(0);
    await expect(page.locator('.portfolio-grid img')).toHaveCount(0);
    await expect(page.locator('.portfolio-section')).toContainText('personal portfolio projects');
    await expect(page.locator('main')).not.toContainText(/200\+|15.25 reviews|professional writers|our talented authors|our clients|reviews guaranteed/i);
});

test('every in-page link has a real target and navigation works by keyboard', async ({ page }, testInfo) => {
    expect(await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link =>
        !document.getElementById(link.getAttribute('href').slice(1))).map(link => link.outerHTML))).toEqual([]);
    for (const id of ['services', 'how-it-works', 'about', 'books', 'portfolio', 'contact']) {
        if (testInfo.project.name === 'mobile') {
            await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
        }
        const link = page.locator(`.nav-menu a[href="#${id}"]`);
        await link.focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(page.locator(`#${id} h2`)).toBeFocused();
        await expect(page.locator('body')).not.toHaveClass(/menu-open/);
    }
    await page.locator('.hero-actions .primary').click();
    await expect(page.locator('#contact-heading')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('.social-link.facebook')).toBeFocused();
});

test('enquiry unavailability is explained before inputs and Facebook remains the alternative', async ({ page }) => {
    const form = page.locator('.contact-form');
    expect(await form.getAttribute('action')).toBeNull();
    await expect(page.locator('.form-submit')).toBeDisabled();
    await expect(page.locator('.form-status')).toContainText('currently unavailable');
    expect(await page.locator('#contact-status').evaluate(status => Boolean(
        status.compareDocumentPosition(document.getElementById('contact-name')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await expect(page.locator('.social-link.facebook')).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61571109431155');
    await expect(page.locator('.social-link.facebook')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.locator('.social-link.facebook')).toHaveAccessibleName(/Contact Marc on Facebook.*opens in a new tab/);
});

test('all images load and book covers use containment in cards and popups', async ({ page }) => {
    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    await expect(page.locator('.book-cover img')).toHaveCount(5);
    for (const image of await page.locator('.book-cover img').all()) {
        await expect(image).toHaveCSS('object-fit', 'contain');
    }
    for (const button of await page.locator('.book-details-btn').all()) {
        await button.click();
        await expect(page.locator('.modal-book-cover')).toHaveCSS('object-fit', 'contain');
        await expect.poll(() => page.locator('.modal-book-cover').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
        await page.keyboard.press('Escape');
    }
});

test('layout has no horizontal overflow at narrow mobile, tablet and desktop widths', async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth), `viewport ${width}`).toBeLessThanOrEqual(width);
        expect(await page.locator('main > section, .book-card, .service-card, .contact-form').evaluateAll(elements => elements.every(element => {
            const box = element.getBoundingClientRect();
            return box.left >= -1 && box.right <= innerWidth + 1;
        })), `content at ${width}`).toBe(true);
    }
});

test('keyboard focus is visible and primary actions have readable contrast', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const primary = page.locator('.hero-actions .primary');
    await primary.focus();
    const style = await primary.evaluate(element => {
        const css = getComputedStyle(element);
        return { color: css.color, background: css.backgroundColor, outline: css.outlineStyle, width: parseFloat(css.outlineWidth) };
    });
    expect(style.outline).toBe('solid');
    expect(style.width).toBeGreaterThanOrEqual(2);
    function luminance(rgb) {
        const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }
    const values = [luminance(style.color), luminance(style.background)].sort((a, b) => a - b);
    expect((values[1] + 0.05) / (values[0] + 0.05)).toBeGreaterThanOrEqual(4.5);
});

test('mobile menu supports Tab, Escape and focus restoration', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') {
        await expect(page.getByRole('button', { name: 'Toggle mobile menu' })).toBeHidden();
        return;
    }
    const toggle = page.getByRole('button', { name: 'Toggle mobile menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav-menu a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
});
