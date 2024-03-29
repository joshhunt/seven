const axios = require("axios");
const pathLib = require("path");
const fs = require("fs-extra");
const { unpackFromHtml, tryPrettier } = require("./unpack-website");
const extractRoutes = require("./extractRoutes");
const notify = require("./notify");
const validateChangedFiles = require("./validateChangedFiles");

const BASE_URL = "https://www.bungie.net/7/en/Destiny/NewLight";

async function main() {
  const localHtmlFilePath = pathLib.join(
    ".",
    "bungie-website-output",
    "index.html"
  );

  const localHtml = (await fs.readFile(localHtmlFilePath)).toString();
  const { data: bungieHtml } = await axios.get(BASE_URL);

  if (localHtml === bungieHtml) {
    console.log("Site has not changed, returning");
    return;
  }

  console.log("Site has changed, extracting source");
  await unpackFromHtml(bungieHtml);

  console.log("Writing index.html");
  const prettyHtml = tryPrettier("index.html", bungieHtml);
  await fs.writeFile(localHtmlFilePath, prettyHtml);

  await validateChangedFiles();

  console.log("Extracting routes");
  const routes = await extractRoutes();

  console.log("Sending notifications");
  await notify(routes);
}

main().catch(console.error);
