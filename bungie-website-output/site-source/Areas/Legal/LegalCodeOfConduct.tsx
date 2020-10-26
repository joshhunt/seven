import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface ILegalCodeOfConductState {}

/**
 * Renders the Terms
 *  *
 * @param {ILegalCodeOfConductProps} props
 * @returns
 */
export class LegalCodeOfConduct extends React.Component<
  RouteComponentProps,
  ILegalCodeOfConductState
> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {};
  }

  public render() {
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
  }
}
