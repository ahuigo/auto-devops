import { Page } from "$puppeteer";

const page = 1 as unknown as Page;

// 1. wait for selector function
await page.waitForFunction(
  'document.querySelector("body").innerText.includes("Hello Ajahne")'
);

const keyword = "Hello Ajahne";
try {
  const document = global.document;
  await page.waitForFunction(
    keyword => document.querySelector('body')?.innerText.includes(keyword),
    {},
    keyword,
  );
} catch (e) {
  console.log(`The text "${keyword}" was not found on the page`);
}

// 2. wait for selector
await page.waitForSelector('.repos-pr-create-header div.version-dropdown', {
  timeout: 2000 * 1000
});

// 3. wait for navigation
/** 事件先后：
  "domcontentloaded"：初始的 HTML 文档已经完全解析和加载，但可能还有一些外部资源（如样式表、脚本、图片等）正在加载。
  "load"：页面完全加载完成，包括所有资源（如样式表、脚本、图片等）。
  "networkidle2"：网络连接处于较空闲状态，只有最多两个网络请求正在进行或等待响应。页面已经加载完成，并且只有少量的网络请求。
  "networkidle0"：网络连接处于空闲状态，没有网络请求正在进行或等待响应。页面已经加载完成，并且没有未决的网络请求。
 */
await page.waitForNavigation({ waitUntil: 'networkidle2' });