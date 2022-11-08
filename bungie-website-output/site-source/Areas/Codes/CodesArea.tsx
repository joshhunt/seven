import { ResponsiveSize } from "@bungie/responsive";
import { RouteDefs } from "@Global/Routes/RouteDefs";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { ISubNavLink, SubNav } from "@UI/UIKit/Controls/SubNav";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Localizer } from "@bungie/localization";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { CodesRedemption } from "./Redemption/CodesRedemption";
import { CodesHistory } from "./History/CodesHistory";
import { PartnerRewards } from "./PartnerRewards/PartnerRewards";
import styles from "./Codes.module.scss";
import { UrlUtils } from "@Utilities/UrlUtils";

class CodesArea extends React.Component<RouteComponentProps> {
  public render() {
    const currentAction = UrlUtils.GetUrlAction(this.props.location);

    const redemption = RouteDefs.Areas.Codes.getAction("Redeem");
    const history = RouteDefs.Areas.Codes.getAction("History");
    const partnerRewards = RouteDefs.Areas.Codes.getAction("Partners");

    const links: ISubNavLink[] = [
      {
        label: Localizer.Coderedemption.CodeRedemption,
        to: redemption.resolve(),
        current: redemption.action === currentAction,
      },
      {
        label: Localizer.Coderedemption.CodeHistoryTitle,
        to: history.resolve(),
        current: history.action === currentAction,
      },
      {
        label: Localizer.Coderedemption.PartnerRewards,
        to: partnerRewards.resolve(),
        current: partnerRewards.action === currentAction,
      },
    ];

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Coderedemption.Coderedemption}
          image={BungieHelmet.DefaultBoringMetaImage}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.headerBungie}>
          <Grid isTextContainer={true}>
            <GridCol cols={12} className={`bungie-title`}>
              <SwitchWithErrors>
                <Route path={redemption.path}>
                  <h2>{Localizer.Coderedemption.CodeRedemption}</h2>
                </Route>
                <Route path={history.path}>
                  <h2>{Localizer.Coderedemption.CodeHistoryTitle}</h2>
                </Route>
                <Route path={partnerRewards.path}>
                  <h2>{Localizer.Coderedemption.PartnerRewards}</h2>
                </Route>
              </SwitchWithErrors>
            </GridCol>
          </Grid>
        </div>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <SubNav
              history={this.props.history}
              links={links}
              mobileDropdownBreakpoint={ResponsiveSize.mobile}
            />
          </GridCol>
        </Grid>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <AnimatedRouter>
              <Route path={redemption.path} component={CodesRedemption} />
              <Route path={history.path} component={CodesHistory} />
              <Route path={partnerRewards.path} component={PartnerRewards} />
            </AnimatedRouter>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

export default WithRouteData(CodesArea);
