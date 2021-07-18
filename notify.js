const _ = require("lodash");
const fs = require("fs-extra");
const discord = require("discord-webhook-node");
const simpleGit = require("simple-git");

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

async function notify(_currentRoutes) {
  const changedFiles = await getFilesChanged();

  console.log(changedFiles);

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

  console.log(description);

  let discordMessage = new discord.MessageBuilder()
    .setTitle("Bungie.net website has been updated")
    .setURL("https://github.com/joshhunt/seven")
    .setDescription(description);

  Object.entries(changedFiles).forEach(([changeType, files]) => {
    discordMessage = discordMessage.addField(
      `Files ${changeType}`,
      files.join("\n")
    );
  });

  if (process.env.SILENT_NOTIFICATIONS || !discordHook) {
    console.log("Suppressing discord notification", discordMessage);
  } else {
    await discordHook.send(discordMessage);
  }
}

module.exports = notify;
