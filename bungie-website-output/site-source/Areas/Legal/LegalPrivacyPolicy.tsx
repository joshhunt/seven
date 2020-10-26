import { InfoBlock } from "@UI/Content/InfoBlock";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { GlobalStateComponentProps } from "@Global/DataStore/GlobalStateDataStore";

interface ILegalPrivacyPolicyProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"loggedInUser"> {}

interface ILegalPrivacyPolicyState {}

/**
 * Renders the Terms
 *  *
 * @param {ILegalPrivacyPolicyProps} props
 * @returns
 */
export class LegalPrivacyPolicy extends React.Component<
  ILegalPrivacyPolicyProps,
  ILegalPrivacyPolicyState
> {
  constructor(props: ILegalPrivacyPolicyProps) {
    super(props);

    this.state = {};
  }

  public render() {
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
  }
}
