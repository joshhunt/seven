// Created by larobinson, 2020
// Copyright Bungie, Inc.

import React from "react";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { Localizer } from "@Global/Localizer";

/**
 * LegalTrademarks - Legal info around Bungie intellectual property and trademarks
 *  *
 * @returns
 */
export const LegalTrademarks: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.UserPages.LegalTrademarksTitle}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie trademarks page 3",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
