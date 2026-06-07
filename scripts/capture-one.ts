import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const url = process.argv[2];
const file = process.argv[3];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const outDir = path.join(process.cwd(), "public/images/projects");
  fs.mkdirSync(outDir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 2500));
  const outPath = path.join(outDir, file);
  await page.screenshot({ path: outPath, type: "png", clip: { x: 0, y: 0, width: 1280, height: 800 } });
  console.log(`Saved: ${outPath}`);
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
