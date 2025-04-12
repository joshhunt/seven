import { ResponsiveSize } from "@bungie/responsive";
import { AclEnum } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteDefs } from "@Global/Routes/RouteDefs";
import { SystemNames } from "@Global/SystemNames";
import AuthContainer from "@UI/User/Authentication/components/AuthContainer";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { ISubNavLink, SubNav } from "@UI/UIKit/Controls/SubNav";
import { EnumUtils } from "@Utilities/EnumUtils";
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
import { GameCodes } from "@Areas/Codes/GameCodes/GameCodesSection";
import styles from "./Codes.module.scss";
import { UrlUtils } from "@Utilities/UrlUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";

interface CodesAreaProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps {}
/**
 * CodesArea - Replace this description
 *  *
 * @param {CodesAreaProps} props
 * @returns
 */
class CodesArea extends React.Component<CodesAreaProps> {
  public render() {
    const currentAction = UrlUtils.GetUrlAction(this.props.location);

    const redemption = RouteDefs.Areas.Codes.getAction("Redeem");
    const history = RouteDefs.Areas.Codes.getAction("History");
    const partnerRewards = RouteDefs.Areas.Codes.getAction("Partners");
    const gameCodes = RouteDefs.Areas.Codes.getAction("GameCodes");

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

    const gameCodesTab = {
      label: "Game Codes",
      to: gameCodes.resolve(),
      current: gameCodes.action === currentAction,
    };

    const gameCodesRoute = (
      <Route path={gameCodes.path}>
        <h2>{"Game Codes"}</h2>
      </Route>
    );

    const gameCodesComponentRoute = (
      <Route path={gameCodes.path} component={GameCodes} />
    );

    const alphaUnlocked = ConfigUtils.SystemStatus(SystemNames.MarathonAlpha);

    const hasAlphaAccess = AclHelper.hasMarathonAccess(
      this.props.globalState?.loggedInUser?.userAcls
    );

    if (hasAlphaAccess && alphaUnlocked) {
      links.push(gameCodesTab);
    }

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
                {alphaUnlocked && gameCodesRoute}
              </SwitchWithErrors>
            </GridCol>
          </Grid>
        </div>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <SubNav
              history={this.props.history}
              links={links}
              mobileDropdownBreakpoint={ResponsiveSize.medium}
            />
          </GridCol>
        </Grid>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <AnimatedRouter>
              <Route path={redemption.path} component={CodesRedemption} />
              <Route path={history.path} component={CodesHistory} />
              <Route path={partnerRewards.path} component={PartnerRewards} />
              {alphaUnlocked && gameCodesComponentRoute}
            </AnimatedRouter>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

const CodesAreaWithGlobalState = withGlobalState(CodesArea, ["loggedInUser"]);
export default WithRouteData(CodesAreaWithGlobalState);
