import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface ILegalSLAState {}

/**
 * Renders the Terms
 *  *
 * @returns
 */
export const LegalSLA: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Userpages.eulatitle}
        image={BungieHelmet.DefaultBoringMetaImage}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie eula page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
