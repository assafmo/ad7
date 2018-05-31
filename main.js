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
flags.defineBoolean("hi", false, "Hearing impaired");
flags.parse();

if (flags.get("show") == "") {
  console.log("Must provide show name");
  console.log("");
  flags.help();
  process.exit(1);
}
if (flags.get("s") == -1) {
  console.log("Must provide a season");
  console.log("");
  flags.help();
  process.exit(1);
}
if (flags.get("e") == -1) {
  console.log("Must provide an episode");
  console.log("");
  flags.help();
  process.exit(1);
}

const show = flags.get("show");
const season = "" + flags.get("s");
const episode = "" + flags.get("e");
const hearingImpaired = flags.get("hi");

const lang = flags.get("lang").toLowerCase();

(async () => {
  const subs = await addic7edApi.search(show, season, episode);
  if (!subs || !subs.length) {
    console.error("Found nothing for", show, season, episode);
    process.exit(1);
  }

  subs.sort((a, b) => b.link > a.link); // Newest versions first

  const alreadyDownloaded = new Set();
  for (let subInfo of subs) {
    if (
      (subInfo.langId.toLowerCase() != lang &&
        subInfo.lang.toLowerCase() != lang) ||
      hearingImpaired != subInfo.hearingImpaired
    ) {
      continue;
    }

    let fileName = `${show.replace(/ /g, ".")}.`;
    fileName += `S${season.length == 1 ? `0${season}` : season}`;
    fileName += `E${episode.length == 1 ? `0${episode}` : episode}.`;
    fileName += `${subInfo.distribution}.`;
    fileName += `${subInfo.version}.`;
    fileName += `${subInfo.team}${subInfo.hearingImpaired ? ".HI" : ""}.srt`;
    fileName = fileName.replace(/\//g, "-");

    if (alreadyDownloaded.has(fileName)) {
      continue;
    }

    console.log("Downloading", fileName);
    let tries = 5;
    while (tries > 0) {
      tries--;
      try {
        await addic7edApi.download(subInfo, "./" + fileName);
      } catch (e) {
        if (tries == 0) {
          console.log("Failed to download", fileName, "(5 retries)");
        }
      }
      break;
    }
    alreadyDownloaded.add(fileName);
  }
})();
