
import puppeteer, { Page, } from "$puppeteer";
import { runBrowser } from "./browser.ts";

//deno test --allow-all --no-check --filter /^test gogo1$/ ./puppeteer-goto_test.ts 
Deno.test("get dom", async function (t) {
  await runBrowser(async (page) => {
    await page.goto("https://www.baidu.com");
    const dimensions = await page.evaluate(() => {
      return {
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio
      };
    });
    console.log('Dimensions:', dimensions);
  }, {
    headless: true,
  });
});

