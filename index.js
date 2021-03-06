const puppeteer = require("puppeteer");
const download = require("image-downloader");

(async () => {
  // Mở trình duyệt
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.freecodecamp.org/news/");

  // Script dùng để craw dữ liệu vào biến articles và images
  const getArticles = await page.evaluate(() => {
    let titleLinks = document.querySelectorAll(".post-card-title");
    let imageLinks = document.querySelectorAll(".post-card-image");
    titleLinks = [...titleLinks];
    imageLinks = [...imageLinks];
    let articles = titleLinks.map(link => ({
      title: link.innerText,
      url: link.getElementsByTagName("a")[0].href
    }));
    let images = imageLinks.map(image => ({
      image:
        image.getAttribute("src").indexOf("https") !== -1
          ? `${image.getAttribute("src")}`
          : `https://freecodecamp.org${image.getAttribute("src")}`
    }));
    return {
      articles,
      images
    };
  });

  // In ra title, url
  console.log(getArticles.images);

  // Tải ảnh về máy, và đặt trong thư mục imgs
  await Promise.all(
    getArticles.images.map(image =>
      download.image({
        url: image.image,
        dest: "images/"
      })
    )
  );

  await browser.close();
})();
