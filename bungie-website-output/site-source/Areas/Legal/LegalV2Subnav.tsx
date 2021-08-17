// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { LegalV2SubnavQuery } from "@Areas/Legal/__generated__/LegalV2SubnavQuery.graphql";
import { TempGetContentStackLocale } from "@Areas/Legal/TempContentStackLocaleMap";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { LegalRouteParams } from "@Routes/RouteParams";
import { ISubNavLink, SubNav } from "@UIKit/Controls/SubNav";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useHistory, useParams } from "react-router";

export const LegalV2Subnav: React.FC = () => {
  const history = useHistory();
  const params = useParams<LegalRouteParams>();

  const locale = TempGetContentStackLocale(Localizer.CurrentCultureName);

  const data = useLazyLoadQuery<LegalV2SubnavQuery>(
    graphql`
      query LegalV2SubnavQuery($locale: String!) {
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

  return <SubNav history={history} links={links} vertical={true} />;
};
