import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { ContentStackClient } from "Platform/ContentStack/ContentStackClient";
import React, { useEffect, useState } from "react";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import sharedStyles from "./SharedStyles.module.scss";
import classNames from "classnames";

const defaultCredits = {
  title: "",
  content: "",
};

export function Credits() {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [credits, setCredits] = useState(defaultCredits);
  useEffect(() => {
    ContentStackClient()
      .ContentType("credits")
      .Entry("blte5d5c574adafa6b6")
      .language(locale)
      .toJSON()
      .fetch()
      .then((result) => {
        setCredits({
          title: result.title,
          content: result.credits_content,
        });
      });
  }, []);
  return (
    <>
      <BungieHelmet title={credits.title} />
      <div
        className={classNames(
          sharedStyles.pageRoot,
          sharedStyles.centeredContainer
        )}
      >
        {/* Setting the HTML here should be safe since it is parsed from a JSON format that does not allow scripting. */}
        <div
          dangerouslySetInnerHTML={{ __html: jsonToHtml(credits.content) }}
        />
      </div>
    </>
  );
}
