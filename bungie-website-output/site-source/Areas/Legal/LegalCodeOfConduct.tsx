import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { Localizer } from "@Global/Localization/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

/**
 * Renders the Terms
 *  *
 * @returns
 */
export const LegalCodeOfConduct: React.FC = (props) => {
  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Userpages.CodeOfConduct}
        image={Localizer.Userpages.codetitle}
      />
      <InfoBlock
        tagAndType={{
          tag: "bungie conduct page",
          type: "InformationBlock",
        }}
      />
    </React.Fragment>
  );
};
