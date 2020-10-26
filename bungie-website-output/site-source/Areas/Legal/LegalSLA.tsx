import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface ILegalSLAState {}

/**
 * Renders the Terms
 *  *
 * @param {ILegalSLAProps} props
 * @returns
 */
export class LegalSLA extends React.Component<
  RouteComponentProps,
  ILegalSLAState
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
  }
}
