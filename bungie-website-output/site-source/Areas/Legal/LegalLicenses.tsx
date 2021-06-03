import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { Localizer } from "@Global/Localization/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

/**
 * Renders the Terms
 *  *
 * @returns
 */
export const LegalLicenses: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Pagetitles.Licenses}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie licenses page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
