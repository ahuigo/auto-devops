import * as puppeteer from 'puppeteer-core';
import getargs from './lib/argparser';
import { sleep } from './lib/date';

interface Args {
  repo: string;
  from: string;
  to: string;
  msg: string;
}
const g = {} as any;

const MO_DEVOPS_PROJECT_URL = process.env.MO_DEVOPS_PROJECT_URL;

async function getLoginPage(args: Args) {

  const repo = args.repo;
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
    headless: false,
    args: ["--start-maximized",],
    // args: ["--start-maximized", "--no-sandbox"],
    // '--start-maximized' // you can also use '--start-fullscreen'
  });
  const page = await browser.newPage();
  const username = process.env.MO_ME_USERNAME;
  const password = process.env.MO_ME_PASSWD;
  await page.authenticate({ 'username': username, 'password': password });

  const url = `${MO_DEVOPS_PROJECT_URL}/_git/${repo}/pullrequests?_a=mine`;
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto(url, { waitUntil: 'networkidle2' });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.evaluate(() => console.log(`url is ${location.href}`));

  return page;
  //await browser.close();
};


async function main() {
  const args = getargs() as Args;
  console.log('args', args);
  if (!args.to || !args.msg || args.repo) {
    console.log(`require to=? and msg=? and repo=?`);
    return;
  }
  //1. login
  const page = await getLoginPage(args);
  //2. goto pull request
  await gotoPullRequest(page, args);
  //3. creat request

}

async function gotoPullRequest(page: any, args: Args) {
  await page.goto(`${MO_DEVOPS_PROJECT_URL}/_git/${args.repo}/pullrequestcreate`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.vss-PickListDropdown--title-textContainer');
  const url = await page.evaluate((args) => {
    const setSearchParam = (params: Record<string, string>) => {
      let urlInfo = new URL(window.location.href);
      let searchParams = new window.URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      });

      // @ts-ignore
      urlInfo.search = searchParams;
      const url = urlInfo.toString();
      return url;
    };
    const url = setSearchParam({
      sourceRef: args.from,
      targetRef: args.to,
    });
    location.href = url;
    return url;
  }, args);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForSelector('input[placeholder="Enter a title"]');
  await page.type('input[placeholder="Enter a title"]', args.msg || '');
  await page.click('.vc-pullRequestCreate-createButton button');
  await page.waitForSelector('#pull-request-vote-button');
  await page.click('#pull-request-vote-button');
  await sleep(1);

  let selector = '#pull-request-complete-button';
  await page.waitForSelector(selector);
  await page.click(selector);
  await sleep(1);
  console.log('dialog');

  selector = 'div[role="dialog"] .bolt-panel-footer-buttons button';
  await page.waitForSelector(selector);
  await page.click(selector);
  // div = document.evaluate("//div[contains(., 'Hello')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()
}

main();