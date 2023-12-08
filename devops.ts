import { Page } from "$puppeteer";
import { runBrowser } from "./puppeteer/browser.ts";
import { getArgs, sleep } from "./deps.ts";
interface Args {
  repo: string;
  from: string;
  to: string;
  msg: string;
}

const cookiePath = getHomeFile('/tmp/cookies.json');

async function syncCookie(page: Page) {
  const cookies = await page.cookies();
  Deno.writeTextFileSync(cookiePath, JSON.stringify(cookies, null, 2));
}

async function loadCookie(page: Page) {
  const cookiesString = Deno.readTextFileSync(cookiePath);
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);
}

function isCookiePathValid() {
  if (!isCookiePathExist()) {
    return false;
  }
  const cookiesString = Deno.readTextFileSync(cookiePath);
  const cookies = JSON.parse(cookiesString);
  if (cookies.length === 0) {
    return false;
  }
  return true;
}
function isCookiePathExist() {
  try {
    Deno.statSync(cookiePath);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }

}

const MO_DEVOPS_PROJECT_URL = Deno.env.get('MO_DEVOPS_PROJECT_URL');

async function getLoginPage(args: Args, page: Page) {

  const repo = args.repo;
  const username = Deno.env.get('MO_ME_USERNAME') as string;
  const password = getPassword();
  const userpass = { 'username': username, 'password': password };
  if (!username || !password) {
    console.log(username, password);
    Deno.exit(1);
  }
  const url = `${MO_DEVOPS_PROJECT_URL}/_git/${repo}/pullrequests?_a=mine`;
  await page.setViewport({ width: 1366, height: 768 });

  if (!isCookiePathValid()) {
    console.log(userpass);
    await page.authenticate(userpass);
  } else {
    console.log("loadCookie");
    await loadCookie(page);
  }

  await page.goto(url, { waitUntil: 'networkidle2' });
  await syncCookie(page);

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));

  return page;
  //await browser.close();
};



function getHomeFile(path: string) {
  const home = Deno.env.get('HOME');
  return home + path;
}

async function main() {
  const args = getArgs() as any as Args;
  console.log('args', args);
  if (!args.to || !args.msg || !args.repo) {
    console.log(`require to=? and msg=? and repo=?`);
    return;
  }

  await runBrowser(async (page) => {
    //1. login
    await getLoginPage(args, page);
    //window.page = page
    //2. goto pull request
    await gotoPullRequest(page, args);
    //3. creat request
  }, {
    headless: false,
    executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
    // args: ["--start-maximized", "--no-sandbox"],
    // '--start-maximized' // you can also use '--start-fullscreen'
  });

}

import { parse } from "$std/yaml/mod.ts";

function getPassword(): string {
  const home = Deno.env.get('HOME');
  const data = parse(Deno.readTextFileSync(home + '/.your-config.yaml')) as any;
  return data.passwdme;
}

async function gotoPullRequest(page: Page, args: Args) {
  await page.goto(`${MO_DEVOPS_PROJECT_URL}/_git/${args.repo}/pullrequestcreate`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.vss-PickListDropdown--title-textContainer', {
    timeout: 2000 * 1000
  });
  await page.evaluate((args) => {
    const setSearchParam = (params: Record<string, string>) => {
      const urlInfo = new URL(window.location.href);
      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      });

      urlInfo.search = searchParams.toString();
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

  let selector = 'input[placeholder="Enter a title"]';
  const element = await page.$(selector);
  const title = await page.evaluate(element => element.value, element);
  if (!title) {
    await page.type('input[placeholder="Enter a title"]', args.msg || '');
  }
  await page.click('.vc-pullRequestCreate-createButton button');
  await page.waitForSelector('#pull-request-vote-button');
  await page.click('#pull-request-vote-button');
  await sleep(1000);

  selector = '#pull-request-complete-button';
  await page.waitForSelector(selector);
  await page.click(selector);
  await sleep(1000);
  console.log('dialog');

  selector = 'div[role="dialog"] .bolt-panel-footer-buttons button';
  await page.waitForSelector(selector);
  await page.click(selector);
  // div = document.evaluate("//div[contains(., 'Hello')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()
}

if (import.meta.main) {
  main();
}
