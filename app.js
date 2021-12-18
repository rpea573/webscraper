const { last } = require("cheerio/lib/api/traversing");
const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://www.oneroof.co.nz/search/sold/suburb_mount-albert-auckland-city-960,sandringham-auckland-city-2212,waterview-auckland-city-2155_bedroom_5_page_1"
  );

  let lastPageNumber = await page.evaluate(() => {
    return document.querySelector(".pager").lastChild.innerText;
  });

  lastPageNumber = parseInt(lastPageNumber);

  let results = []; // variable to hold collection of all book titles and prices
  for (let i = 0; i < lastPageNumber; i++) {
    // wait 1 sec for page load
    await page.waitForTimeout(1000);
    // call and wait extractedEvaluateCall and concatenate results every iteration.
    // You can use results.push, but will get collection of collections at the end of iteration
    results = results.concat(await pageListings(page));
    console.log("inside");
    // this is where next button on page clicked to jump to another page
    if (i != lastPageNumber) {
      // no next button on last page
      await page.click(".btn-next");
    }
  }
  console.log("outside");
  //   browser.close();
  return results;
};

const retrieveFeatured = () => {
  return Array.from(document.querySelectorAll(".house-feature"), (feature) => {
    let bed = "";
    let bath = "";
    let car = "";
    let other = "";

    const info = Array.from(
      feature.querySelectorAll(".info .other .s"),
      (info) => {
        return info.innerHTML;
      }
    );

    for (const i of info) {
      if (i.includes("badroom")) {
        bed = i.replace(/[^0-9]/g, "");
      } else if (i.includes("bathroom")) {
        bath = i.replace(/[^0-9]/g, "");
      } else if (i.includes("carspace")) {
        car = i.replace(/[^0-9]/g, "");
      } else {
        other = i;
      }
    }

    return {
      price: feature.querySelector(".mask .price").innerText,
      street: feature.querySelector(".info .s").innerText,
      location: feature.querySelector(".info .price").innerText,
      bed: bed,
      bath: bath,
      car: car,
      other: other,
    };
  });
};

const retrieveStandard = () => {
  return Array.from(
    document.querySelectorAll(".house-standard .info"),
    (standard) => {
      let bed = "";
      let bath = "";
      let car = "";
      let other = "";

      const info = Array.from(
        standard.querySelectorAll(".other .s"),
        (info) => {
          return info.innerHTML;
        }
      );

      for (const i of info) {
        if (i.includes("badroom")) {
          bed = i.replace(/[^0-9]/g, "");
        } else if (i.includes("bathroom")) {
          bath = i.replace(/[^0-9]/g, "");
        } else if (i.includes("carspace")) {
          car = i.replace(/[^0-9]/g, "");
        } else {
          other = i;
        }
      }

      return {
        price: standard.querySelector(".price").innerText,
        street: standard.querySelector(".position").innerText,
        location: standard.querySelector(".address").innerText,
        bed: bed,
        bath: bath,
        car: car,
        other: other,
      };
    }
  );
};

async function pageListings(page) {
  let listings = [];
  let featured = await page.evaluate(retrieveFeatured);
  let standard = await page.evaluate(retrieveStandard);

  return (listings = listings.concat(featured, standard));
}

scrape().then((value) => {
  console.log(value);
  console.log("Collection length: " + value.length);
  console.log(value[0]);
  console.log(value[value.length - 1]);
});
