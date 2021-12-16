const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { appendFileSync } = require("fs");
const { title } = require("process");

// Function to retrieve the featured listing's data on Oneroof's sale list
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

//Retrieve the standard listing's data on Oneroof's sold list
const retrieveStandard = () => {
  return Array.from(
    document.querySelectorAll(".house-standard .info"),
    (standard) => {
      let bed = "";
      let bath = "";
      let car = "";
      let other = "";

      const info = Array.from(standard.querySelectorAll(".other"), (info) => {
        return info.innerHTML;
      });

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

// Controller - we will to go to next page and repeat this and continuously add the new data to the end of an array. We will then need to save the data...
const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "https://www.oneroof.co.nz/search/sold/suburb_avondale-auckland-city-153,blockhouse-bay-auckland-city-2776,kingsland-auckland-city-843,mount-albert-auckland-city-960,mount-roskill-auckland-city-589,new-windsor-auckland-city-1491,onehunga-auckland-city-2899,sandringham-auckland-city-2212,waterview-auckland-city-2155_page_1";
  await page.goto(url);

  const featured = await page.evaluate(retrieveFeatured);
  console.log(featured);
  const standard = await retrieveStandard();
  console.log(standard);
  await browser.close();
};

scrape();
