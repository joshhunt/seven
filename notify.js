const _ = require("lodash");
const fs = require("fs-extra");
const discord = require("discord-webhook-node");
const simpleGit = require("simple-git");
const util = require("util");

const discordHook =
  process.env.DISCORD_WEBHOOK &&
  new discord.Webhook(process.env.DISCORD_WEBHOOK);

async function getFilesChanged() {
  try {
    const statusSummary = await simpleGit().status();

    const {
      not_added: added1,
      created: added2,
      deleted: removed,
      modified,
    } = statusSummary;
    const added = added1.concat(added2);

    return _({
      added,
      removed,
      modified,
    })
      .mapValues((files) =>
        files
          .filter((f) => !f.endsWith(".scss"))
          .filter((f) => f.startsWith("bungie-website-output/site-source/"))
          .map((f) => f.replace("bungie-website-output/site-source/", ""))
      )
      .pickBy((files) => files.length)
      .value();
  } catch (err) {
    console.error("Error checking for files changed", err);
    return [];
  }
}

function countObjectArrays(obj) {
  return Object.values(obj).reduce((acc, arr) => acc + arr.length, 0);
}

async function notify(_currentRoutes) {
  const changedFiles = await getFilesChanged();

  const currentRoutes = _.sortBy(_currentRoutes, (v) => v.path);
  const currentPaths = currentRoutes.map((v) => v.path);

  const _previousRoutes = await fs.readJSON(
    "./bungie-website-output/routes.json"
  );
  const previousRoutes = _.sortBy(_previousRoutes, (v) => v.path);
  const previousPaths = previousRoutes.map((v) => v.path);

  const pathsDiff = { added: [], removed: [] };

  currentPaths.forEach((currentPath) => {
    if (!previousPaths.includes(currentPath)) {
      pathsDiff.added.push(currentPath);
    }
  });

  previousPaths.forEach((previousPath) => {
    if (!currentPaths.includes(previousPath)) {
      pathsDiff.removed.push(previousPath);
    }
  });

  if (
    countObjectArrays(pathsDiff) === 0 &&
    countObjectArrays(changedFiles) === 0
  ) {
    console.log("Nothing changed so not going to send a notification");
    return;
  }

  await fs.writeJSON("./bungie-website-output/routes.json", currentRoutes, {
    spaces: 2,
  });

  const addedMessage = pathsDiff.added.map((v) => ` - ${v}`).join("\n");
  const removedMessage = pathsDiff.removed.map((v) => ` - ${v}`).join("\n");

  const description = [
    pathsDiff.added.length > 0 && `**Routes added**:\n${addedMessage}`,
    pathsDiff.removed.length > 0 && `**Routes removed**:\n${removedMessage}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const title = "Bungie.net website has been updated";
  const url = "https://github.com/joshhunt/seven";

  const MAX_MESSAGE_LENGTH = 5000;
  const MAX_FIELD_VALUE_LENGTH = 1024;

  let messageLength = description.length + title.length + url.length;

  let discordMessage = new discord.MessageBuilder()
    .setTitle(title)
    .setURL(url)
    .setDescription(description);

  Object.entries(changedFiles).forEach(([changeType, files]) => {
    const fieldTitle = `Files ${changeType}`;
    let fieldBody = "";

    let filesIncluded = 0;

    const filesTreeText = printTree(treeifyPathList(files)).split("\n");

    for (const file of filesTreeText) {
      if (fieldBody) {
        fieldBody += "\n";
      }

      const truncationMessage = `_plus ${
        files.length - filesIncluded
      } more files_`;

      const newFieldBodyLength =
        fieldBody.length + file.length + truncationMessage.length;
      const newEmbedTotalLength =
        messageLength + fieldTitle.length + newFieldBodyLength;

      if (
        newFieldBodyLength < MAX_FIELD_VALUE_LENGTH &&
        newEmbedTotalLength < MAX_MESSAGE_LENGTH
      ) {
        fieldBody = fieldBody + file;
        filesIncluded += 1;
      } else {
        fieldBody = fieldBody + truncationMessage;
        break;
      }
    }

    discordMessage = discordMessage.addField(fieldTitle, fieldBody);
    messageLength += fieldTitle.length + fieldBody.length;
  });

  if (process.env.SILENT_NOTIFICATIONS || !discordHook) {
    console.log("Suppressing discord notification", discordMessage);
  } else {
    try {
      await discordHook.send(discordMessage);
    } catch (err) {
      console.error("Error testing discord notification");
      console.error(err);
      console.error(util.inspect(discordMessage, false, null, true));
      let fallbackDiscordMessage = new discord.MessageBuilder()
        .setTitle(title)
        .setURL(url)
        .setDescription("Unknown changes - previous message failed");

      await discordHook.send(fallbackDiscordMessage);
    }
  }
}

module.exports = notify;

function treeifyPathList(paths) {
  const pathList = Array.isArray(paths) ? paths : paths.split("\n");
  const tree = {};
  for (const p of pathList) {
    const path = p.split("/");
    _.set(tree, path, false);
  }
  return tree;
}

function printTree(tree, indent = 0) {
  let didFirst = false;
  return Object.entries(tree)
    .map(([segment, children]) => {
      const bullet = indent % 2 ? "◦" : "•";
      let ret = `${"⠀⠀".repeat(indent)}${
        indent === 0 ? "" : didFirst ? "⠀⠀" : "└⠀"
      }${bullet} ${segment}`;

      while (
        typeof children === "object" &&
        Object.keys(children).length === 1
      ) {
        const childKey = Object.keys(children)[0];
        ret += "/" + childKey;
        children = children[childKey];
      }

      if (typeof children === "object")
        ret += "\n" + printTree(children, indent + 1);

      didFirst = true;
      return ret;
    })
    .join("\n");
}
