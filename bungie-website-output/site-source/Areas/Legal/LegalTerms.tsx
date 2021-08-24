import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { Localizer } from "@bungie/localization";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

/**
 * Renders the Terms
 *  *
 * @param {ILegalTermsProps} props
 * @returns
 */
export const LegalTerms: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Userpages.termstitle}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie terms page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
