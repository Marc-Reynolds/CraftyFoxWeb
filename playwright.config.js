const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: 2,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:8081',
        browserName: 'chromium',
        launchOptions: {
            executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined
        },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    projects: [
        { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
        { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
    ],
    webServer: {
        command: 'node node_modules/live-server/live-server.js --host=127.0.0.1 --port=8081 --no-browser --ignore=test-results,playwright-report',
        url: 'http://127.0.0.1:8081',
        reuseExistingServer: false
    }
});
