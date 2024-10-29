// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { ResponsiveSize } from "@bungie/responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import { LegalRouteParams } from "@Routes/Definitions/RouteParams";
import { ISubNavLink, SubNav } from "@UIKit/Controls/SubNav";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";

export const LegalSubnav: React.FC = () => {
  const history = useHistory();
  const params = useParams<LegalRouteParams>();

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [legalPages, setLegalPages] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("legal_page")
      .Query()
      .only(["title", "url", "order", "last_updated_date"])
      .language(locale)
      .toJSON()
      .find()
      .then((response) => {
        setLegalPages(response[0]);
      });
  }, [locale]);

  if (!legalPages) {
    return null;
  }

  // Sort the legal pages by the Order property
  const links: ISubNavLink[] = Array.from(legalPages)
    .sort((a: any, b: any) => a.order - b.order)
    .map((p: any) => ({
      current: p.url === `/${params.pageName}`,
      label: p.title,
      to: RouteHelper.LegalPage({ pageName: p.url.slice(1) }),
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
