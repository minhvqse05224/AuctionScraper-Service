const puppeteer = require('puppeteer');

const    scrapeSite = async(url) => {
  console.log("Scraping now")
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);



  await browser.close();
};


const mySites = 
["https://buyee.jp/item/search/category/2084199079"
,"https://buyee.jp/item/search/category/2084048720"]

mySites.forEach(site => {
    scrapeSite(site)
});
