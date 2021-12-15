const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { appendFileSync } = require("fs");

const port = 8000;

const url =
  "https://www.oneroof.co.nz/search/sold/suburb_avondale-auckland-city-153,blockhouse-bay-auckland-city-2776,kingsland-auckland-city-843,mount-albert-auckland-city-960,mount-roskill-auckland-city-589,new-windsor-auckland-city-1491,onehunga-auckland-city-2899,sandringham-auckland-city-2212,waterview-auckland-city-2155_page_1";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(url);

  const names = page.evaluate(() => {
    document.querySelector("");
  });
  // This allows you to create a file using the node file system. r and n is return and new line.
  //   await fs.writeFile("names.txt", names.join("\r\n"));

  await browser.close();
})();
