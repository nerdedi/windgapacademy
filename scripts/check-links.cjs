const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

async function check() {
  const root = path.join(__dirname, "..", "dist");
  const indexPath = path.join(root, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("dist/index.html not found");
    process.exit(2);
  }
  const html = fs.readFileSync(indexPath, "utf8");
  const $ = cheerio.load(html);
  const links = new Set();
  $("a[href]").each((i, el) => {
    let href = $(el).attr("href");
    if (!href) return;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (href.startsWith("http://") || href.startsWith("https://")) return;
    href = href.replace(/#.*/, "");
    links.add(href);
  });
  const results = [];
  for (const l of links) {
    const file = path.join(root, l.replace(/^\//, ""));
    const exists = fs.existsSync(file);
    results.push({ link: l, exists });
  }
  console.log("Broken link report:");
  results.forEach((r) => {
    console.log(`${r.exists ? "OK " : "BROKEN"} ${r.link}`);
  });
  const broken = results.filter((r) => !r.exists);
  if (broken.length > 0) process.exit(1);
}

check().catch((err) => {
  console.error(err);
  process.exit(2);
});
