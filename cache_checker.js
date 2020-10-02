const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
// constants
const URL_HAS_PROTOCOL_REGEX = /^https?:\/\//i;

/*
 *This function loads the webpage first time so i can be cached
 *@note only if website using cache
 *
 */
first_load = async (URL) => {
  //Create browser instance
  const browser = await puppeteer.launch({
    userDataDir: '/tmp/user-data-dir', //<--- to save user data like cache
    headless: true, //<-- false for headful mode
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto(URL);
  browser.close();
  return true;
};

/*
 * Main Method
 *This function loads the webpage and check if we have cached data
 *
 *
 */
is_cached = async (URL) => {
  console.log('Cache Checker is running on ' + URL);
  console.log('Please wait.....');

  const updatedURL = URL.match(URL_HAS_PROTOCOL_REGEX) ? URL : `https://${URL}`;

  await first_load(updatedURL); //<-- This function loads the webpage first time so i can be cached

  //Create browser instance
  const browser = await puppeteer.launch({
    userDataDir: '/tmp/user-data-dir', //<--- to save user data like cache
    headless: true, //<-- false for headful mode
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  // Data Map to store the results
  let dataHashMap = {
    css: [],
    html: [],
    image: [],
    js: [],
    font: [],
    compression: [],
    count: {
      cssCount: 0,
      imageCount: 0,
      jsCount: 0,
      fontCount: 0,
    },
    other: [],
  };
  is_leverage_cache = '';
  page.on('requestfinished', (request) => {
    let response = request.response();

    //check for compression headers in request
    if (response.headers()['content-encoding'] !== undefined)
      dataHashMap.compression.push([
        request.url(),
        response.headers()['content-encoding'],
      ]);

    if (request.resourceType() === 'stylesheet') {
      dataHashMap.css.push([request.url(), response._fromDiskCache]);
      dataHashMap.count.cssCount++;
    } else if (request.resourceType() === 'script') {
      dataHashMap.js.push([request.url(), response._fromDiskCache]);
      dataHashMap.count.jsCount++;
    } else if (request.resourceType() === 'image') {
      dataHashMap.image.push([request.url(), response._fromDiskCache]);
      dataHashMap.count.imageCount++;
    } else if (request.resourceType() === 'font') {
      dataHashMap.font.push([request.url(), response._fromDiskCache]);
      dataHashMap.count.fontCount++;
    } else if (request.resourceType() === 'document') {
      let cache = response._fromDiskCache;

      if (cache === false) {
        if (response._status === 304) {
          //<--The HTTP 304 Not Modified client redirection response code indicates that there is no need to retransmit the requested resources.
          //It is an implicit redirection to a cached resource.
          cache = true;
        }
      } else {
        cache = response._fromDiskCache;
      }

      if (cache === true) {
        is_leverage_cache = `${URL} is leveraging browser cache`;
      } else {
        is_leverage_cache = `${URL} does not leverage browser cache`;
      }

      dataHashMap.html.push([request.url(), cache]);
    } else {
      dataHashMap.other.push([request.url(), response._fromDiskCache]);
    }
  });

  await page.goto(updatedURL);
  await page.waitFor(5000);

  //Print the Results
  console.log(dataHashMap);
  console.log(is_leverage_cache);
  browser.close();
  console.log('Completed!');

  /* To check if the URL has SSL certificate */
  const options = updatedURL;

  var client = http; // To check if the http has a SSL certificate

  if (updatedURL.indexOf('https') === 0) {
    client = https;
  }
  var req = client.request(options, function (res) {
    if (res.socket.authorized) {
      console.log('The website uses SSL Certificate!!');
    } else {
      console.log('The website does not use SSL Certificate!!');
    }
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
};

//is_cached('https://github.com');

// process command line argument
if (!process.argv[2]) {
  console.log('Please enter a link');
  process.exit(1);
} else {
  is_cached(process.argv[2]);
}