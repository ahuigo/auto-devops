
import puppeteer, { Page, } from "$puppeteer";
import { runBrowser } from "./browser.ts";

//deno test --allow-all --no-check --filter /^test gogo1$/ ./puppeteer-goto_test.ts 

Deno.test("connect ws", async function (t) {
  await runBrowser(async (page) => {
    const socketUrl = "ws://";
    const browser = await puppeteer.connect({
      browserWSEndpoint: socketUrl,
      ignoreHTTPSErrors: true,
    });
    await browser.newPage();
  }, {
    headless: true,
  });
});

Deno.test("test goto", async function (t) {
  await runBrowser(async (page) => {
    await page.goto("https://t.cn", { waitUntil: 'networkidle2' });
  }, {
    headless: true,
  });
});