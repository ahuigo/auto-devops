import puppeteer, { Page, Browser, } from "$puppeteer";
import { ChromeArgOptions, LaunchOptions } from "LaunchOptions";


export async function runBrowser(
  fn: (page: Page, browser: Browser) => void,
  options: ChromeArgOptions & LaunchOptions = {},
) {
  // 不同放在外面
  const browser = await puppeteer.launch({
    args: ["--start-maximized", "--no-sandbox"], // you can also use '--start-fullscreen'
    // executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
    headless: false,
    ...options,
  });
  try {
    const page = await browser.newPage();
    await fn(page, browser);
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
  }
}