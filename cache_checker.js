const puppeteer = require('puppeteer');


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
}

/*
 * Main Method
 *This function loads the webpage and check if we have cached data
 *
 *
 */
is_cached = async (URL) => {
    console.log("Cache Checker is running on "+URL);
    console.log("Please wait.....")
    await first_load(URL); //<-- This function loads the webpage first time so i can be cached 

    //Create browser instance
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/user-data-dir', //<--- to save user data like cache
        headless: true, //<-- false for headful mode
        args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    // Data Map to store the results
    let dataHashMap = {
        'css': [],
        'html': [],
        'image': [],
        'js': [],
        'font': [],
        'other': []
    };
    is_leverage_cache = '';
    page.on('requestfinished', (request) => {

        let response = request.response();

        if (request.resourceType() === 'stylesheet') {

            dataHashMap.css.push([request.url(), response._fromDiskCache]);
        } else if (request.resourceType() === 'script') {

            dataHashMap.js.push([request.url(), response._fromDiskCache]);
        } else if (request.resourceType() === 'image') {

            dataHashMap.image.push([request.url(), response._fromDiskCache]);
        } else if (request.resourceType() === 'font') {

            dataHashMap.font.push([request.url(), response._fromDiskCache]);
        } else if (request.resourceType() === 'document') {

            let cache = response._fromDiskCache;

            
            if (cache === false) {

                if (response._status === 304) //<--The HTTP 304 Not Modified client redirection response code indicates that there is no need to retransmit the requested resources. 
                                              //It is an implicit redirection to a cached resource.
                {
                    cache = true;
                }

            } else {
                cache = response._fromDiskCache;
            }

            if(cache===true) { is_leverage_cache= `${URL} is leveraging broweser cache`  }else { is_leverage_cache= `${URL} does not leverage broweser cache`};

            dataHashMap.html.push([request.url(), cache]);
        } else {
            dataHashMap.other.push([request.url(), response._fromDiskCache]);
        }

    });


    await page.goto(URL);
    await page.waitFor(5000);

    //Print the Results
    console.log(dataHashMap);
    console.log(is_leverage_cache);
    browser.close();
    console.log('Completed!');
}


//is_cached('https://github.com');

is_cached('https://ilmtechnosolutions.com');
