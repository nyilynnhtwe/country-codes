const puppeteer = require("puppeteer");
const fs = require("fs");

const getCountryName = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://www.iban.com/country-codes", {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const countryName = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const trs = document.querySelectorAll("tbody tr");

    let result = "[";

for (let index = 0; index < trs.length; index++) {
    const element   = trs[index];
    const children  = element.childNodes;
    const countryName = children[1].innerText;
    const alpha2Code  = children[3].innerText;
    const alpha3Code  = children[5].innerText;
    const numericCode = children[7].innerText;
    result = result + 
        `{
            "name"      : "${countryName}",
            "alpha2"    : "${alpha2Code}",
            "alpha3"    : "${alpha3Code}",
            "numeric"   : "${numericCode}"
        },`;
}




    return result;
  });


  let result = countryName;

  console.log(result);

  fs.writeFile("country-code.json",result,(err,result)=>
  {
    if(err)
    {
      console.log("file has been written");
    }
  });

  // Close the browser
  await browser.close();

  return countryName;
};

getCountryName();
