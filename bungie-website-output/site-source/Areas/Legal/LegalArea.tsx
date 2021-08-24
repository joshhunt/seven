// import {LegalPaymentServicesAct} from "@Areas/Legal/LegalPaymentServicesAct";
import { LegalAreaV2 } from "@Areas/Legal/LegalAreaV2";
import { LegalPaymentServicesAct } from "@Areas/Legal/LegalPaymentServicesAct";
import { LegalTrademarks } from "@Areas/Legal/LegalTrademarks";
import { Localizer } from "@bungie/localization";
import { ResponsiveSize } from "@bungie/responsive";
import { RouteDefs } from "@Global/Routes/RouteDefs";
import { SystemNames } from "@Global/SystemNames";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ISubNavLink, SubNav } from "@UI/UIKit/Controls/SubNav";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import styles from "./LegalArea.module.scss";
import { LegalCodeOfConduct } from "./LegalCodeOfConduct";
import { LegalCookiePolicy } from "./LegalCookiePolicy";
import { LegalLicenses } from "./LegalLicenses";
import { LegalPrivacyPolicy } from "./LegalPrivacyPolicy";
import { LegalSLA } from "./LegalSLA";
import { LegalTerms } from "./LegalTerms";

interface LegalAreaState {}

class LegalArea extends React.Component<RouteComponentProps, LegalAreaState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const currentAction = UrlUtils.GetUrlAction(this.props.location);

    const terms = RouteDefs.Areas.Legal.getAction("Terms");
    const sla = RouteDefs.Areas.Legal.getAction("SLA");
    const privacyPolicy = RouteDefs.Areas.Legal.getAction("PrivacyPolicy");
    const cookiePolicy = RouteDefs.Areas.Legal.getAction("CookiePolicy");
    const licenses = RouteDefs.Areas.Legal.getAction("Licenses");
    const codeOfConduct = RouteDefs.Areas.Legal.getAction("CodeOfConduct");
    const paymentServicesAct = RouteDefs.Areas.Legal.getAction(
      "paymentServicesAct"
    );
    const trademarks = RouteDefs.Areas.Legal.getAction(
      "IntellectualPropertyTrademarks"
    );

    // Check if the new system is enabled and show that instead if it is
    if (ConfigUtils.SystemStatus(SystemNames.LegalContentStackPages)) {
      return <LegalAreaV2 />;
    }

    const links: ISubNavLink[] = [
      {
        label: Localizer.Userpages.termstitle,
        to: terms.resolve(),
        current: terms.action === currentAction,
      },
      {
        label: Localizer.Userpages.eulatitle,
        to: sla.resolve(),
        current: sla.action === currentAction,
      },
      {
        label: Localizer.Pagetitles.privacypolicy,
        to: privacyPolicy.resolve(),
        current: privacyPolicy.action === currentAction,
      },
      {
        label: Localizer.Pagetitles.CookiePolicy,
        to: cookiePolicy.resolve(),
        current: cookiePolicy.action === currentAction,
      },
      {
        label: Localizer.Userpages.codetitle,
        to: codeOfConduct.resolve(),
        current: codeOfConduct.action === currentAction,
      },
      {
        label: Localizer.Pagetitles.Licenses,
        to: licenses.resolve(),
        current: licenses.action === currentAction,
      },
      {
        label: Localizer.Userpages.LegalTrademarksTitle,
        to: trademarks.resolve(),
        current: trademarks.action === currentAction,
      },
      (Localizer.CurrentCultureName === "en" ||
        Localizer.CurrentCultureName === "ja") && {
        label: Localizer.Pagetitles.paymentServicesAct,
        to: paymentServicesAct.resolve(),
        current: paymentServicesAct.action === currentAction,
      },
    ];

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Helptext.BungieLegal}
          image={BungieHelmet.DefaultBoringMetaImage}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.headerBungie}>
          <Grid>
            <GridCol cols={12} className={`bungie-title`}>
              <SwitchWithErrors>
                <Route path={terms.path}>
                  <h2>{Localizer.Userpages.termstitle}</h2>
                </Route>
                <Route path={sla.path}>
                  <h2>{Localizer.Userpages.eulatitle}</h2>
                </Route>
                <Route path={privacyPolicy.path}>
                  <h2>{Localizer.Pagetitles.privacypolicy}</h2>
                </Route>
                <Route path={licenses.path}>
                  <h2>{Localizer.Pagetitles.Licenses}</h2>
                </Route>
                <Route path={codeOfConduct.path}>
                  <h2>{Localizer.Userpages.codetitle}</h2>
                </Route>
                <Route path={cookiePolicy.path}>
                  <h2>{Localizer.Pagetitles.CookiePolicy}</h2>
                </Route>
                <Route path={trademarks.path}>
                  <h2>{Localizer.UserPages.LegalTrademarksTitle}</h2>
                </Route>
                <Route path={paymentServicesAct.path}>
                  <h2>{Localizer.Pagetitles.paymentServicesAct}</h2>
                </Route>
              </SwitchWithErrors>
            </GridCol>
          </Grid>
        </div>
        <div className={styles.container}>
          <Grid className={styles.subNav}>
            <GridCol cols={12}>
              <SubNav
                history={this.props.history}
                links={links}
                vertical={true}
                mobileDropdownBreakpoint={ResponsiveSize.medium}
              />
            </GridCol>
          </Grid>
          <Grid className={styles.legalContent}>
            <GridCol cols={12}>
              <AnimatedRouter>
                <Route path={terms.path} component={LegalTerms} />
                <Route path={sla.path} component={LegalSLA} />
                <Route
                  path={privacyPolicy.path}
                  component={LegalPrivacyPolicy}
                />
                <Route path={cookiePolicy.path} component={LegalCookiePolicy} />
                <Route
                  path={codeOfConduct.path}
                  component={LegalCodeOfConduct}
                />
                <Route path={licenses.path} component={LegalLicenses} />
                <Route path={trademarks.path} component={LegalTrademarks} />
                <Route
                  path={paymentServicesAct.path}
                  component={LegalPaymentServicesAct}
                />
              </AnimatedRouter>
            </GridCol>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default WithRouteData(LegalArea);
