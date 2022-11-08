import { Localizer } from "@bungie/localization/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React from "react";
import { useHistory, useLocation } from "react-router";
import { Route } from "react-router-dom";
import { RouteDefs } from "@Routes/RouteDefs";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { ISubNavLink, SubNav } from "@UIKit/Controls/SubNav";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UrlUtils } from "@Utilities/UrlUtils";
import styles from "./News.module.scss";
import NewsByCategory from "./NewsByCategory";

export enum NewsCategory {
  none = 0,
  destiny = 1,
  bungie = 2,
  community = 3,
  updates = 4,
  tech = 5,
}

const News: React.FC = () => {
  const history = useHistory();

  const area = RouteDefs.Areas.News;
  const actions = {
    none: area.getAction("index"),
    destiny: area.getAction("destiny"),
    bungie: area.getAction("bungie"),
    community: area.getAction("community"),
    updates: area.getAction("updates"),
    tech: area.getAction("tech"),
  } as const;

  const location = useLocation();

  const categoryLinks: ISubNavLink[] = [
    {
      label: Localizer.news.TagNone.toUpperCase(),
      to: actions.none.resolve(),
      current: !UrlUtils.GetUrlAction(location),
    },
    {
      label: Localizer.news["TagNews-Destiny"].toUpperCase(),
      to: actions.destiny.resolve(),
      current: actions.destiny.action === UrlUtils.GetUrlAction(location),
    },
    {
      label: Localizer.news["TagNews-Community"].toUpperCase(),
      to: actions.community.resolve(),
      current: actions.community.action === UrlUtils.GetUrlAction(location),
    },
    {
      label: Localizer.news["TagNews-Updates"].toUpperCase(),
      to: actions.updates.resolve(),
      current: actions.updates.action === UrlUtils.GetUrlAction(location),
    },
  ];

  return (
    <>
      <BungieHelmet
        title={Localizer.News.News}
        image={BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <Grid className={styles.pageContent}>
        <GridCol cols={12}>
          <SubNav history={history} links={categoryLinks} />
          <div className={styles.articles}>
            <AnimatedRouter>
              <Route
                path={actions.none.path}
                exact={true}
                component={NewsByCategory}
              />
              <Route path={actions.destiny.path} component={NewsByCategory} />
              <Route path={actions.updates.path} component={NewsByCategory} />
              <Route path={actions.community.path} component={NewsByCategory} />
            </AnimatedRouter>
          </div>
        </GridCol>
      </Grid>
    </>
  );
};

export default React.memo(News);
