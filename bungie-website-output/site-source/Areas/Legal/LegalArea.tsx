// import {LegalPaymentServicesAct} from "@Areas/Legal/LegalPaymentServicesAct";
import { LegalPaymentServicesAct } from "@Areas/Legal/LegalPaymentServicesAct";
import { RouteDefs } from "@Global/Routes/RouteDefs";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { ISubNavLink, SubNav } from "@UI/UIKit/Controls/SubNav";
import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import styles from "./LegalArea.module.scss";
import { LegalCodeOfConduct } from "./LegalCodeOfConduct";
import { LegalPrivacyPolicy } from "./LegalPrivacyPolicy";
import { LegalSLA } from "./LegalSLA";
import { LegalTerms } from "./LegalTerms";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Localizer } from "@Global/Localizer";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { LegalLicenses } from "./LegalLicenses";
import { RouteHelper } from "@Routes/RouteHelper";
import { LegalCookiePolicy } from "./LegalCookiePolicy";
import { UrlUtils } from "@Utilities/UrlUtils";

class LegalArea extends React.Component<RouteComponentProps> {
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
          <Grid isTextContainer={true}>
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
                <Route path={paymentServicesAct.path}>
                  <h2>{Localizer.Pagetitles.paymentServicesAct}</h2>
                </Route>
              </SwitchWithErrors>
            </GridCol>
          </Grid>
        </div>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <SubNav history={this.props.history} links={links} />
          </GridCol>
        </Grid>
        <Grid isTextContainer={true} className={styles.legalContent}>
          <GridCol cols={12}>
            <AnimatedRouter>
              <Route path={terms.path} component={LegalTerms} />
              <Route path={sla.path} component={LegalSLA} />
              <Route path={privacyPolicy.path} component={LegalPrivacyPolicy} />
              <Route path={cookiePolicy.path} component={LegalCookiePolicy} />
              <Route path={codeOfConduct.path} component={LegalCodeOfConduct} />
              <Route path={licenses.path} component={LegalLicenses} />
              <Route
                path={paymentServicesAct.path}
                component={LegalPaymentServicesAct}
              />
            </AnimatedRouter>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

export default WithRouteData(LegalArea);
