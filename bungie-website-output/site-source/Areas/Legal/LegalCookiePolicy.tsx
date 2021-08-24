// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { Localizer } from "@bungie/localization";

/**
 * LegalCookiePolicy - Replace this description
 *  *
 * @returns
 */
export const LegalCookiePolicy: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Pagetitles.CookiePolicy}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie cookiepolicy page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
