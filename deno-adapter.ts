import {
  runChrome,
  puppeteer,
} from './deno-puppeteer-adapter/index.js';
//} from 'https://denopkg.com/nikfrank/deno-puppeteer-adapter/index.js';


const [process, ws] = await runChrome();

//... ws is the address of chrome's top level socket
//... I don't ever use it, idk maybe you need it



// wait for chrome to open the websocket
const wait = (t:number)=> (new Promise(f=> setTimeout(f, t)));
await wait(900);


// load the url for the socket we want

const url = 'http://dev-account-server.hdmap.momenta.works/api/v1/user/list?size=1';
//http://local.hdmap.momenta.works:3002/pmui/workorder/workorder-list
const port = 9222;
const response = await fetch('http://localhost:'+port+'/json')
const tabs = await response.json();
console.log(tabs)

const socketUrl = tabs[0].webSocketDebuggerUrl;


// connect puppeteer to it

const browser = await puppeteer.connect({
  browserWSEndpoint: socketUrl,
  ignoreHTTPSErrors: true,
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle2' });

// now you can do anything with puppeteer you want!

//process.close();

Deno.exit(0);
