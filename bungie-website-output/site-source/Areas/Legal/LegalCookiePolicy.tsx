// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { Localizer } from "@Global/Localizer";

interface ILegalCookiePolicyProps {}

interface ILegalCookiePolicyState {}

/**
 * LegalCookiePolicy - Replace this description
 *  *
 * @param {ILegalCookiePolicyProps} props
 * @returns
 */
export class LegalCookiePolicy extends React.Component<
  ILegalCookiePolicyProps,
  ILegalCookiePolicyState
> {
  constructor(props: ILegalCookiePolicyProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Pagetitles.CookiePolicy}
          image={BungieHelmet.DefaultBoringMetaImage}
        />
        <InfoBlock
          tagAndType={{
            tag: "bungie cookiepolicy page",
            type: "InformationBlock",
          }}
        />
      </React.Fragment>
    );
  }
}
