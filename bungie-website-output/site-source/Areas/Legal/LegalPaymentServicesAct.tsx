// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { Localizer } from "@Global/Localizer";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React from "react";

interface LegalPaymentServicesActProps {}

export const LegalPaymentServicesAct: React.FC<LegalPaymentServicesActProps> = (
  props
) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Pagetitles.paymentServicesAct}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie payment services act page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
