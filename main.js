#!/usr/bin/env node

const addic7edApi = require("addic7ed-api");
const flags = require("flags");

flags.defineString(
  "lang",
  "eng",
  "Subtitles languege or code (case insensitive)"
);
flags.defineString("show", "", "Show name");
flags.defineNumber("s", -1, "Season");
flags.defineNumber("e", -1, "Episode");
flags.parse();

if (flags.get("show") == "") {
  console.error("Must provide show name");
  process.exit(1);
}
if (flags.get("s") == -1) {
  console.error("Must provide a season");
  process.exit(1);
}
if (flags.get("e") == -1) {
  console.error("Must provide an episode");
  process.exit(1);
}

const show = flags.get("show");
const season = "" + flags.get("s");
const episode = "" + flags.get("e");

const lang = flags.get("show").toLowerCase();

(async () => {
  let subs = await addic7edApi.search(show, season, episode);
  subs.sort((a, b) => b.link > a.link); // Newest versions first

  const alreadyDownloaded = new Set();
  for (let subInfo of subs) {
    if (
      subInfo.langId.toLowerCase() != lang &&
      subInfo.languege.toLowerCase() != lang
    ) {
      continue;
    }

    let fileName = `${show.replace(/ /g, ".")}.`;
    fileName += `S${season.length == 1 ? `0${season}` : season}`;
    fileName += `E${episode.length == 1 ? `0${episode}` : episode}.`;
    fileName += `${subInfo.distribution}.`;
    fileName += `${subInfo.version}.`;
    fileName += `${subInfo.team}.srt`;
    fileName = fileName.replace(/\//g, "-");

    if (alreadyDownloaded.has(fileName)) {
      continue;
    }

    console.log("Downloading", fileName);
    await addic7edApi.download(subInfo, "./" + fileName);

    alreadyDownloaded.add(fileName);
  }
})();
