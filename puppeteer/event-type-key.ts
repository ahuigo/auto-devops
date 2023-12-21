import { Page } from "$puppeteer";
const page = 1 as unknown as Page;


// type inpput
await page.type('input[placeholder="Enter a title"]', 'hello world');

// keyboard press `Enter` key
await page.keyboard.press('Enter');