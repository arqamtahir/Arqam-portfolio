import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const shots = [
  { url: "https://www.nice2stay.com", file: "nice2stay.png", slug: "nice2stay" },
  { url: "https://staywithlumina.com", file: "staywithlumina.png", slug: "staywithlumina" },
  { url: "https://hotel-weekend.com", file: "hotel-weekend.png", slug: "hotel-weekend" },
  { url: "https://arqamtahir.com", file: "arqam-tahir-portfolio.png", slug: "portfolio" },
  { url: "https://arqamtahir.com/playground", file: "arqam-tahir-playground.png", slug: "playground" },
];

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const outDir = path.join(process.cwd(), "public/images/projects");
  fs.mkdirSync(outDir, { recursive: true });

  for (const shot of shots) {
    console.log(`Capturing ${shot.url}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 2500));
    const outPath = path.join(outDir, shot.file);
    await page.screenshot({
      path: outPath,
      type: "png",
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    });
    console.log(`Saved: ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log("All screenshots captured.");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
