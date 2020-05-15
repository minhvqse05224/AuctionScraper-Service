const puppeteer = require('puppeteer');
const Item = require('./models/items.model.js');
 
const scrapeSite = async(url) => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto(url,{"waitUntil" : "networkidle0"});
  
  let totalResults=[];
  while(true){
      try{
        //return array of items in one page
        const getDatas = await page.evaluate(async()=>{ 
    
            const pics = document.querySelectorAll(".g-thumbnail__image");
            const picsArray = [...pics]
            const picsSrc = picsArray.map(e=>e.src)
        
            
            const prices = document.querySelectorAll(".g-priceFx");
            const pricesArrays = [...prices]
            const pricesVal = pricesArrays.map(e=>e.innerText)
        
            const names = document.querySelectorAll(".itemCard__itemName");
            const namesArrays = [...names]
            const namesTexts = namesArrays.map(e=>e.innerText)
        
            const links = document.querySelectorAll(".itemCard__itemName a")
            const linksArrays = [...links]
            const linksTexts = linksArrays.map(e=>e.href)

            
        
            const results = picsSrc.map((item,i) => {
                let name = namesTexts[i];
                let price = pricesVal[i];
                let pic = item;
                let link = linksTexts[i];
                const listObj = new Object({name,price,pic,link});
                return listObj
            });
            console.log(results)
            return results;
            })
        totalResults = [...totalResults,...getDatas]


        const nextPgPointer = await page.$x("//a[contains(text(), '>')]");
        if (nextPgPointer.length > 0) {

        //click next pg and wait to load
          await Promise.all([
             nextPgPointer[0].click(),
             page.waitForNavigation({ waitUntil: 'networkidle0' }),
           ]);
      
        } else {
          throw new Error("Link not found");
        }
 
      }
      catch(e){
          console.log(e);
          break;
      }
  }

  await browser.close();
  console.log("finished with: "+url+"\n with res:"+totalResults.length)
  return (totalResults)

};
module.exports = {
  scrapeSite
}


