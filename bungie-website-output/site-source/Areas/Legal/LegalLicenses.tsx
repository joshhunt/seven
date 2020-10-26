import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface ILegalLicensesState {}

/**
 * Renders the Terms
 *  *
 * @param {ILegalLicensesProps} props
 * @returns
 */
export class LegalLicenses extends React.Component<
  RouteComponentProps,
  ILegalLicensesState
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
            tag: "bungie licenses page",
            type: "InformationBlock",
          }}
        />
      </React.Fragment>
    );
  }
}
