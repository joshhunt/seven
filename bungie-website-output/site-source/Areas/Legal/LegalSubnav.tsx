// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { LegalSubnavQuery } from "@Areas/Legal/__generated__/LegalSubnavQuery.graphql";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { ResponsiveSize } from "@bungie/responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import { LegalRouteParams } from "@Routes/RouteParams";
import { ISubNavLink, SubNav } from "@UIKit/Controls/SubNav";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useHistory, useParams } from "react-router";

export const LegalSubnav: React.FC = () => {
  const history = useHistory();
  const params = useParams<LegalRouteParams>();

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);

  const data = useLazyLoadQuery<LegalSubnavQuery>(
    graphql`
      query LegalSubnavQuery($locale: String!) {
        all_legal_page(locale: $locale, fallback_locale: true) {
          items {
            title
            url
            order
          }
        }
      }
    `,
    { locale }
  );

  const legalPages = data?.all_legal_page?.items;

  // Sort the legal pages by the Order property
  const links: ISubNavLink[] = Array.from(legalPages)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      current: p.url === `/${params.url}`,
      label: p.title,
      to: RouteHelper.LegalPage({ url: p.url.substr(1) }),
    }));

  return (
    <SubNav
      history={history}
      links={links}
      vertical={true}
      mobileDropdownBreakpoint={ResponsiveSize.medium}
    />
  );
};
