import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

/**
 * Renders the Terms
 *  *
 * @param {ILegalPrivacyPolicyProps} props
 * @returns
 */
export const LegalPrivacyPolicy: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Pagetitles.privacypolicy}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie privacy page 2",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
