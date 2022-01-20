const urlLib = require("url");
const axios = require("axios");
const pathLib = require("path");
const fs = require("fs-extra");
const cheerio = require("cheerio");
const mkdirp = require("mkdirp");
const prettier = require("prettier");

const BASE_URL = "https://www.bungie.net/7/en/Destiny/NewLight";

const INITIAL_CHUNKS_RE = /^\/7\/static\/js\//;
const SOURCE_MAP_RE = /\/\/# sourceMappingURL=([\w-\.\?=]+)/;
const NAMED_CHUNKS_RE = /__webpack_require__\.p \+ "static\/js\/" \+ \(([{}"\w:,-]+)/;
const CHUNK_HASHES_RE = /chunkId\) \+ "\." \+ ([{}"\w:,-]+)\[chunkId\] \+ "\.chunk\.js"/;
const CSS_CHUNKS_RE = /chunkId\) \+ "\." \+ ([{}"\w:,-]+)\[chunkId\] \+ "\.chunk\.css";/;
const NAMED_CSS_CHUNKS_RE = /"static\/css\/" \+ \(([{}"\w:,-]+)/;

const ROOT_OUT = pathLib.join(".", "bungie-website-output", "site-source");

function bungieUrl(path) {
  let url;

  if (path.match(/^https?:/)) {
    url = path;
  } else {
    url = `https://www.bungie.net/${path}`
      .replace("net//", "net/")
      .replace(/ca\/\//g, "ca/");
  }

  return url.replace(urlLib.parse(url).search, "");
}

async function getSourceMapURLFromSourceURL(sourceUrl) {
  const url = bungieUrl(sourceUrl);

  // The sourcemap url is referenced at the bottom of the js, so we need to request that
  const { data: sourceJs } = await axios.get(url);
  const match = SOURCE_MAP_RE.exec(sourceJs);
  const mapFileName = match && match[1];

  if (!mapFileName) {
    throw new Error(`Unable to find source map in ${url}`);
  }

  const path = pathLib.dirname(sourceUrl) + "/maps/" + mapFileName;

  return bungieUrl(path);
}

function processSourceMap(sourceMap) {
  return sourceMap.sources
    .map((path, index) => {
      const safePath = pathLib.normalize(path).replace(/^(\.\.(\/|\\|$))+/, "");

      return {
        path,
        safePath,
        index,
        content: sourceMap.sourcesContent[index],
      };
    })
    .filter((v) => !v.path.includes("node_modules"));
}

async function getOriginalFilesFromSourcePath(runtimePath) {
  console.log("getOriginalFilesFromSourcePath:", { runtimePath });

  const sourceMapUrl = await getSourceMapURLFromSourceURL(runtimePath);
  const { data: runtimeSourceMap } = await axios.get(sourceMapUrl);
  return processSourceMap(runtimeSourceMap);
}

async function getOriginalFilesFromSourceMapUrl(sourceMapUrl) {
  const { data: runtimeSourceMap } = await axios.get(sourceMapUrl);
  return processSourceMap(runtimeSourceMap);
}

async function getBootstrapJS(runtimePath) {
  const sourceMapFiles = await getOriginalFilesFromSourcePath(runtimePath);

  return sourceMapFiles.find((v) => v.path.includes("webpack/bootstrap"))
    .content;
}

function getAllSourceMapURLSFromBootstrap(bootstrapSource) {
  const namedChunksMatch = NAMED_CHUNKS_RE.exec(bootstrapSource);
  const namedChunks =
    namedChunksMatch && namedChunksMatch[1] && JSON.parse(namedChunksMatch[1]);

  const chunkHashesMatch = CHUNK_HASHES_RE.exec(bootstrapSource);
  const chunkHashes =
    chunkHashesMatch && chunkHashesMatch[1] && JSON.parse(chunkHashesMatch[1]);

  const urls = Object.keys(chunkHashes).map((chunkId) => {
    const chunkName = namedChunks[chunkId] || chunkId;

    return `https://www.bungie.net/7/static/js/maps/${chunkName}.${chunkHashes[chunkId]}.chunk.js.map`;
  });

  return urls;
}

async function getJSSourceMapUrlsFromHTML(html) {
  const $ = cheerio.load(html);
  const scriptTags = $("script");

  const scriptSrcs = scriptTags
    .map((index, el) => el.attribs.src)
    .toArray()
    .filter(Boolean);

  const runtimePath = scriptSrcs.find((src) =>
    src.includes("/7/static/js/runtime-main")
  );

  const otherSourceUrls = scriptSrcs.filter(
    (src) => src !== runtimePath && src.match(INITIAL_CHUNKS_RE)
  );

  const bootstrapSource = await getBootstrapJS(runtimePath);
  const sourceMapUrls = getAllSourceMapURLSFromBootstrap(bootstrapSource);

  for (const sourceUrl of otherSourceUrls) {
    sourceMapUrls.push(await getSourceMapURLFromSourceURL(sourceUrl));
  }

  return sourceMapUrls;
}

async function safelyWriteFile(path, contents) {
  const fullOutPath = pathLib.join(ROOT_OUT, path);
  const outFolder = pathLib.dirname(fullOutPath);

  await mkdirp(outFolder);

  await fs.writeFile(fullOutPath, contents);
}

function tryPrettier(name, source) {
  const ext = pathLib.extname(name);
  let prettierParser = "typescript";

  if (ext === ".scss") {
    prettierParser = "css";
  } else if (ext === ".html") {
    prettierParser = "html";
  }

  try {
    return prettier.format(source, {
      parser: prettierParser,
    });
  } catch (err) {
    return source;
  }
}

async function saveFilesFromSourceMapUrl(sourceMapUrl) {
  console.log("Processing", sourceMapUrl);
  const baseName = pathLib.basename(sourceMapUrl);

  const files = await getOriginalFilesFromSourceMapUrl(sourceMapUrl);

  for (const file of files) {
    console.log("writing", baseName, "->", file.safePath);

    await safelyWriteFile(
      file.safePath,
      tryPrettier(file.safePath, file.content)
    );
  }
}

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = async (source) => {
  const dirs = await fs.readdir(source);

  return dirs.map((name) => pathLib.join(source, name)).filter(isDirectory);
};

async function writeJSConfig() {
  const topLevelModules = (await getDirectories(ROOT_OUT))
    .map((v) => v.split(pathLib.sep).pop())
    .reduce(
      (acc, topLeveLModule) => ({
        ...acc,
        [`@${topLeveLModule}/*`]: [
          `./bungie-website-output/site-source/${topLeveLModule}/*`,
        ],
      }),
      {}
    );

  const jsConfig = {
    compilerOptions: {
      jsx: "react",
      baseUrl: ".",
      paths: topLevelModules,
    },
    exclude: ["node_modules", "build"],
  };

  await fs.writeJSON(pathLib.join(".", "jsconfig.json"), jsConfig, {
    spaces: 2,
  });
}

async function unpackFromHtml(htmlPage) {
  const jsSourceMapURLs = await getJSSourceMapUrlsFromHTML(htmlPage);

  await Promise.all(jsSourceMapURLs.map(saveFilesFromSourceMapUrl));

  await writeJSConfig();
}

module.exports = { unpackFromHtml, tryPrettier };
