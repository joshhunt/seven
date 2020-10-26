import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface ILegalTermsState {}

/**
 * Renders the Terms
 *  *
 * @param {ILegalTermsProps} props
 * @returns
 */
export class LegalTerms extends React.Component<
  RouteComponentProps,
  ILegalTermsState
> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      profile: null,
    };
  }

  public render() {
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
  }
}
