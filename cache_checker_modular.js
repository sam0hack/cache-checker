const puppeteer = require('puppeteer');
const first_load = require('./first_load');
const url_verify = require('./url_verify');
const ssl_check = require('./ssl_check');
const generate_data_map = require('./generate_data_map');

/*
 * Main Method
 *This function loads the webpage and check if we have cached data
 *
 *
 */
is_cached = async (URL) => {
    console.log('Cache Checker is running on ' + URL);
    console.log('Please wait.....');
  
    const updatedURL = url_verify(URL);
  
    //Create browser instance
    const browser = await puppeteer.launch({
      userDataDir: '/tmp/user-data-dir', //<--- to save user data like cache
      headless: true, //<-- false for headful mode
      args: ['--no-sandbox'],
    });
  
    await first_load(updatedURL, browser); //<-- This function loads the webpage first time so i can be cached
  
    const { dataHashMap, is_leverage_cache } = await generate_data_map(updatedURL, browser);
  
    //Print the Results
    console.log(dataHashMap);
    console.log(is_leverage_cache);

    /*
    Close browser after all processes done
    */
    browser.close();
    console.log('Completed!');
  
    /* 
    To check if the URL has SSL certificate 
    */
    ssl_check(updatedURL);
};
  
//is_cached("https://github.com");

if (!process.argv[2]) {
    console.log('Please enter a link');
    process.exit(1);
} else {
    is_cached(process.argv[2]);
}
  