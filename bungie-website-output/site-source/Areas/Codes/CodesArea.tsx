import { ResponsiveSize } from "@bungie/responsive";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteDefs } from "@Global/Routes/RouteDefs";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { ISubNavLink, SubNavLink } from "@UI/UIKit/Controls/SubNav";
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
import { AclHelper } from "@Areas/Marathon/Helpers/AclHelper";
import { Respond } from "@Boot/Respond";
import { Select } from "plxp-web-ui/components/base";

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
    const codeLoc = Localizer.CodeRedemption;

    const redemption = RouteDefs.Areas.Codes.getAction("Redeem");
    const history = RouteDefs.Areas.Codes.getAction("History");
    const partnerRewards = RouteDefs.Areas.Codes.getAction("Partners");
    const gameCodes = RouteDefs.Areas.Codes.getAction("GameCodes");

    const links: ISubNavLink[] = [
      {
        label: codeLoc.RedeemCodeText,
        to: redemption.resolve(),
        current: redemption.action === currentAction,
      },
      {
        label: codeLoc.CodeHistoryTitle,
        to: history.resolve(),
        current: history.action === currentAction,
      },
      {
        label: codeLoc.PartnerRewards,
        to: partnerRewards.resolve(),
        current: partnerRewards.action === currentAction,
      },
    ];

    if (
      AclHelper.hasGameCodesAccess(
        this.props.globalState?.loggedInUser?.userAcls
      )
    ) {
      links.push({
        label: codeLoc.GameCodes,
        to: gameCodes.resolve(),
        current: gameCodes.action === currentAction,
      });
    }

    return (
      <React.Fragment>
        <BungieHelmet
          title={codeLoc.Coderedemption}
          image={BungieHelmet.DefaultBoringMetaImage}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.headerBungie}>
          <SwitchWithErrors>
            <Route path={redemption.path}>
              <h2>{codeLoc.CodeRedemption}</h2>
            </Route>
            <Route path={history.path}>
              <h2>{codeLoc.CodeHistoryTitle}</h2>
            </Route>
            <Route path={partnerRewards.path}>
              <h2>{codeLoc.PartnerRewards}</h2>
            </Route>
            <Route path={gameCodes.path}>
              <h2>{codeLoc.GameCodes}</h2>
            </Route>
          </SwitchWithErrors>
        </div>
        <Respond at={ResponsiveSize.medium} hide={true} responsive={null}>
          <div className={styles.nav}>
            {links.map((link) => (
              <SubNavLink
                key={link.label}
                link={link}
                classes={{
                  clickableLink: styles.link,
                  current: styles.current,
                }}
                isSpan={false}
              />
            ))}
          </div>
          {/* <SubNav
						className={styles.nav}
						classes={{ clickableLink: styles.link, current: styles.current }}
						history={this.props.history}
						links={links}
						mobileDropdownBreakpoint={ResponsiveSize.tiny}
					/> */}
        </Respond>
        <Respond at={ResponsiveSize.medium} responsive={null}>
          <div className={styles.dropdown}>
            <Select
              labelArea={{ labelString: "" }}
              selectProps={{
                className: styles.select,
                displayEmpty: false,
                value: links.find((l) => l.current)?.to.url,
                onChange: (e) =>
                  this.props.history.push(e.target.value as string),
              }}
              menuOptions={links.map((l) => ({
                value: l.to.url,
                label: l.label,
              }))}
            />
          </div>
        </Respond>
        <AnimatedRouter>
          <Route path={redemption.path} component={CodesRedemption} />
          <Route path={history.path} component={CodesHistory} />
          <Route path={partnerRewards.path} component={PartnerRewards} />
          <Route path={gameCodes.path} component={GameCodes} />
        </AnimatedRouter>
      </React.Fragment>
    );
  }
}

const CodesAreaWithGlobalState = withGlobalState(CodesArea, ["loggedInUser"]);
export default WithRouteData(CodesAreaWithGlobalState);
