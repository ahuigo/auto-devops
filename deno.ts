import { createRequire } from "https://deno.land/std/node/module.ts";
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
 
(async () => {
  const browser = await puppeteer.launch({
      executablePath:"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
      headless:false,
  });
  const page = await browser.newPage();
  const url = 'http://dev-production-management.hdmap.momenta.works/api/v1/worker-history?&task_name=iw_auto_acc_lane_compute';
  await page.goto(url);
 
  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: window.document.documentElement.clientWidth,
      height: window.document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });
 
  console.log('Dimensions:', dimensions);
 
    //await browser.close();
})();
