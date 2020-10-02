/*
*This function generates the data hash map
*/
const generate_data_map = async (url, browser) => {
    const page = await browser.newPage();

    const dataHashMap = {
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

    let is_leverage_cache = '';
    

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
            is_leverage_cache = `${url} is leveraging browser cache`;
          } else {
            is_leverage_cache = `${url} does not leverage browser cache`;
          }
    
          dataHashMap.html.push([request.url(), cache]);
        } else {
          dataHashMap.other.push([request.url(), response._fromDiskCache]);
        }
      });

    await page.goto(url);
    await page.waitFor(5000);

    return {
        dataHashMap,
        is_leverage_cache
    }
};

module.exports = generate_data_map;