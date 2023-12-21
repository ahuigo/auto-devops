import { Page } from "$puppeteer";

const page = 1 as unknown as Page;
await page.screenshot({ path: 'login_screenshot.png' });