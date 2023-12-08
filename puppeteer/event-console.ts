import { runBrowser } from "./browser.ts";
import { sleep } from "../deps.ts";

//deno test --allow-all --no-check --filter /^test gogo1$/ ./puppeteer-goto_test.ts 
Deno.test("on console", async function (t) {
  await runBrowser(async (page) => {
    await page.goto("https://www.baidu.com");
    //2. open console: console.log(1111)
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await sleep(2000);
  }, {
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
    args: ["--start-maximized", "--no-sandbox"],
  });
},);

