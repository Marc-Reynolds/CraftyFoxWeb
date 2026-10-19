const { test, expect } = require('@playwright/test');

const forms = [
    { selector: '.contact-form', email: '#contact-email', error: '#email-error', status: '.form-status', success: /message has been sent successfully/ },
    { selector: '.newsletter-form', email: '#newsletter-email', error: '#newsletter-error', status: '.newsletter-status', success: /Thank you for subscribing/ }
];
const pageErrors = new WeakMap();

// Every test is local. External assets and unmocked requests are blocked;
// even the configured-form tests never send data to Formspree.
test.beforeEach(async ({ context, page }) => {
    await context.route('**/*', route => {
        if (new URL(route.request().url()).origin === 'http://127.0.0.1:8081') return route.continue();
        return route.abort();
    });
    const errors = [];
    pageErrors.set(page, errors);
    page.on('pageerror', error => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
    expect(pageErrors.get(page)).toEqual([]);
});

async function openPage(page, action) {
    if (action) {
        await page.route('http://127.0.0.1:8081/', async route => {
            const response = await route.fetch();
            const html = (await response.text()).replace(/class="(contact-form|newsletter-form)"/g,
                (_, name) => `class="${name}" action="${action}"`);
            await route.fulfill({ response, body: html });
        });
    }
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/js-enabled/);
}

async function fillForm(page, form, email = 'marc+books@example.com') {
    if (form.selector === '.contact-form') {
        await page.locator('#contact-name').fill('Test Author');
        await page.locator('#contact-message').fill('Automated test only; no enquiry is sent.');
    }
    await page.locator(form.email).fill(email);
}

for (const form of forms) {
    test(`${form.selector}: ordinary and plus-addressed emails pass; invalid emails have accessible feedback`, async ({ page }) => {
        await openPage(page);
        const input = page.locator(form.email);
        for (const email of ['marc@example.com', 'marc+books@example.com', 'susan.smith+arc@sub.example.co.uk']) {
            await input.fill(email);
            await input.press('Tab');
            await expect(input).toHaveAttribute('aria-invalid', 'false');
            await expect(page.locator(form.error)).toBeEmpty();
        }
        for (const email of ['', 'invalid', 'marc@', '@example.com', 'marc name@example.com', 'marc@@example.com']) {
            await input.fill(email);
            await input.press('Tab');
            await expect(input).toHaveAttribute('aria-invalid', 'true');
            await expect(input).toHaveAttribute('aria-describedby', form.error.slice(1));
            await expect(page.locator(form.error)).toHaveAttribute('role', 'alert');
            await expect(page.locator(form.error)).toHaveText(email ? 'Please enter a valid email address.' : 'This field is required.');
        }
        await input.fill('marc@example.com');
        await input.press('Tab');
        await expect(input).toHaveAttribute('aria-invalid', 'false');
        await expect(page.locator(form.error)).toBeEmpty();
    });

    test(`${form.selector}: missing and placeholder destinations cannot submit`, async ({ page }) => {
        const posts = [];
        page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
        for (const action of [undefined, 'https://formspree.io/f/your-form-id', 'https://formspree.io/f/your-newsletter-id']) {
            await openPage(page, action);
            await fillForm(page, form);
            await expect(page.locator(`${form.selector} button[type="submit"]`)).toBeDisabled();
            await page.locator(form.email).press('Enter');
            // Also exercise the submit guard directly, independently of the disabled button.
            await page.locator(form.selector).evaluate(element => element.requestSubmit());
            await expect(page.locator(form.status)).toContainText('unavailable');
            await expect(page.locator(form.status)).not.toContainText('Thank you');
        }
        expect(posts).toEqual([]);
    });

    test(`${form.selector}: configured submit focuses the first invalid field without sending`, async ({ page }) => {
        const posts = [];
        page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
        await openPage(page, 'https://formspree.io/f/testonly');
        await fillForm(page, form, 'invalid');
        await page.locator(`${form.selector} button[type="submit"]`).click();
        await expect(page.locator(form.email)).toBeFocused();
        await expect(page.locator(form.error)).toHaveText('Please enter a valid email address.');
        await expect(page.locator(form.status)).toBeEmpty();
        expect(posts).toEqual([]);
    });

    for (const outcome of ['success', 'rejected', 'network']) {
        test(`${form.selector}: mocked ${outcome} response reports the real outcome`, async ({ page }) => {
            const action = 'https://formspree.io/f/testonly';
            let requests = 0;
            await page.route(action, async route => {
                requests++;
                expect(route.request().method()).toBe('POST');
                expect(route.request().postData()).toContain('marc+books@example.com');
                if (outcome === 'network') return route.abort('failed');
                return route.fulfill({ status: outcome === 'success' ? 200 : 422,
                    contentType: 'application/json', body: JSON.stringify({ ok: outcome === 'success' }) });
            });
            await openPage(page, action);
            await fillForm(page, form);
            await page.locator(`${form.selector} button[type="submit"]`).click();
            if (outcome === 'success') {
                await expect(page.locator(form.status)).toHaveText(form.success);
                await expect(page.locator(form.email)).toHaveValue('');
            } else {
                await expect(page.locator(form.status)).toContainText('could not');
                await expect(page.locator(form.status)).not.toContainText('Thank you');
                await expect(page.locator(form.email)).toHaveValue('marc+books@example.com');
            }
            await expect(page.locator(`${form.selector} button[type="submit"]`)).toBeEnabled();
            expect(requests).toBe(1);
        });
    }
}

test('pending submission cannot report success or send twice', async ({ page }) => {
    const action = 'https://formspree.io/f/testonly';
    let releaseResponse;
    const responseReady = new Promise(resolve => { releaseResponse = resolve; });
    let requests = 0;
    await page.route(action, async route => {
        requests++;
        await responseReady;
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await openPage(page, action);
    await fillForm(page, forms[0]);
    await page.locator('.form-submit').click();
    await expect(page.locator('.contact-form')).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('.form-submit')).toBeDisabled();
    await expect(page.locator('.form-status')).toBeEmpty();
    await page.locator('.contact-form').evaluate(element => element.requestSubmit());
    releaseResponse();
    await expect(page.locator('.form-status')).toHaveText(forms[0].success);
    expect(requests).toBe(1);
});

test('unavailable forms and actions stay safe without JavaScript', async ({ browser, baseURL, viewport, isMobile, hasTouch }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport, isMobile, hasTouch });
    await context.route('**/*', route => new URL(route.request().url()).origin === baseURL ? route.continue() : route.abort());
    const page = await context.newPage();
    const posts = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.goto(baseURL);
    for (const form of forms) {
        await fillForm(page, form);
        await page.locator(form.email).press('Enter');
        await expect(page.locator(`${form.selector} button[type="submit"]`)).toBeDisabled();
        await expect(page.locator(form.status)).toContainText('unavailable');
    }
    expect(posts).toEqual([]);
    await expect(page.locator('a[href="#"], a[href="#privacy"], a[href="#terms"]')).toHaveCount(0);
    await context.close();
});

test('page and every book popup omit unavailable purchase/social actions', async ({ page }) => {
    await openPage(page);
    await expect(page.locator('a[href="#"], a[href="#privacy"], a[href="#terms"]')).toHaveCount(0);
    await expect(page.locator('.social-link.facebook')).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61571109431155');
    await expect(page.locator('.book-link, .social-link.amazon, .social-link.goodreads')).toHaveCount(0);
    for (const id of ['lucid-dream', 'lost-keys', 'work-smarter', 'reboot-career', 'dream-journal']) {
        const opener = page.locator(`[data-book="${id}"]`);
        await opener.focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.locator('#book-modal a')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Close modal' })).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(page.getByRole('button', { name: 'Close modal' })).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(opener).toBeFocused();
    }
});

test('all service Contact actions close the popup, unlock scrolling and focus Contact', async ({ page }) => {
    await openPage(page);
    for (const id of ['ghost-writing', 'editing', 'publishing', 'marketing', 'arc-review', 'landing-page']) {
        const opener = page.locator(`[data-service="${id}"]`);
        await opener.focus();
        await page.keyboard.press('Enter');
        const close = page.getByRole('button', { name: 'Close modal' });
        const contact = page.locator('#book-modal a[href="#contact"]');
        await expect(close).toBeFocused();
        await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
        await page.keyboard.press('Shift+Tab');
        await expect(contact).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(close).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(contact).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
        await expect(page.locator('#main-content')).not.toHaveAttribute('inert');
        await expect(page).toHaveURL(/#contact$/);
        await expect(page.locator('#contact-heading')).toBeFocused();
        // Contact must be visible beneath the sticky header after scrolling completes.
        await expect.poll(async () => page.locator('#contact-heading').evaluate(heading => {
            const top = heading.getBoundingClientRect().top;
            return top >= document.querySelector('.site-header').getBoundingClientRect().bottom && top < innerHeight;
        })).toBe(true);
        await page.keyboard.press('Tab');
        await expect(page.locator('#contact-name')).toBeFocused();
    }
});

test('Escape, close button and backdrop restore the opener and previous scroll state', async ({ page }) => {
    await openPage(page);
    await page.locator('body').evaluate(body => { body.style.overflow = 'auto'; });
    for (const openerSelector of ['[data-book="lucid-dream"]', '[data-service="editing"]']) {
        const opener = page.locator(openerSelector);
        for (const method of ['escape', 'close', 'backdrop']) {
            await opener.click();
            await expect(page.getByRole('dialog')).toBeVisible();
            if (method === 'escape') await page.keyboard.press('Escape');
            if (method === 'close') await page.getByRole('button', { name: 'Close modal' }).click();
            if (method === 'backdrop') await page.locator('#book-modal').click({ position: { x: 2, y: 2 } });
            await expect(page.getByRole('dialog')).toBeHidden();
            await expect(opener).toBeFocused();
            await expect(page.locator('body')).toHaveCSS('overflow', 'auto');
            await expect(page.locator('.site-header')).not.toHaveAttribute('inert');
        }
    }
});

test('Contact navigation works with keyboard on desktop and mobile menus', async ({ page }, testInfo) => {
    await openPage(page);
    if (testInfo.project.name === 'mobile') {
        const toggle = page.getByRole('button', { name: 'Toggle mobile menu' });
        await toggle.focus();
        await page.keyboard.press('Enter');
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    }
    await page.getByRole('menuitem', { name: 'Contact', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contact-heading')).toBeFocused();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
});
