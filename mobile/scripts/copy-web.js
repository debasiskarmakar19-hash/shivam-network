const fs = require("node:fs");
const path = require("node:path");

const source = path.resolve(__dirname, "../../public");
const target = path.resolve(__dirname, "../www");
const files = ["index.html", "sw.js", "manifest.webmanifest", "app-icon.svg"];

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

for (const file of files) {
  const from = path.join(source, file);
  if (!fs.existsSync(from)) {
    throw new Error(`Required web asset is missing: ${from}`);
  }
  fs.copyFileSync(from, path.join(target, file));
}

console.log("Prepared Shivam Network customer web assets for Android.");
