/*
 *This function loads the webpage first time so i can be cached
 *@note only if website using cache
 *
 */

first_load = async (URL, browser) => {
    //Create new page
    const page = await browser.newPage();
  
    await page.goto(URL);
    return true;
  };

  module.exports = first_load;