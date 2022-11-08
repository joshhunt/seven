/* tslint:disable member-ordering */
import { SystemNames } from "@Global/SystemNames";
import { AreaGroup } from "@Routes/AreaGroup";
import { RouteHelper } from "@Routes/RouteHelper";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { ActionRoute } from "./ActionRoute";
import { Area, IArea } from "./Area";
import { createAsyncComponent } from "./AsyncRoute";

export interface ILocaleParams {
  locale?: string;
}

export class RouteDefs {
  private static readonly AreaNames = {
    Admin: "Admin",
    BeyondLight: "BeyondLight",
    BungieTech: "BungieTech",
    Clans: "Clans",
    Codes: "Codes",
    Collections: "Collections",
    CrossSave: "CrossSave",
    Destiny: "Destiny",
    Direct: "Direct",
    Guide: "Guide",
    Legal: "Legal",
    News: "News",
    Pgcr: "Pgcr",
    Registration: "Registration",
    Rewards: "Rewards",
    Search: "Search",
    Seasons: "Seasons",
    Static: "Static",
    Sms: "Sms",
    Triumphs: "Triumphs",
    User: "User",
    UserResearch: "UserResearch",
  };

  public static Areas = {
    Admin: new Area({
      name: RouteDefs.AreaNames.Admin,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Admin/AdminArea" /* webpackChunkName: "Admin" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "Reports"),
        (area) => new ActionRoute(area, "Report", { path: ":reportId?" }),
        (area) => new ActionRoute(area, "MigrateNews"),
      ],
    }),
    BungieTech: new Area({
      name: RouteDefs.AreaNames.BungieTech,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/BungieTech/BungieTechArea" /* webpackChunkName: "BungieTech" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, "index"),
        (area) => new ActionRoute(area, "article", { path: "articleUrl?" }),
      ],
    }),
    Clans: new Area({
      name: RouteDefs.AreaNames.Clans,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Clans/ClansArea" /* webpackChunkName: "Clans" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "Create"),
        (area) => new ActionRoute(area, "Suggested"),
        (area) => new ActionRoute(area, "MyClans"),
      ],
    }),
    Collections: new Area({
      name: RouteDefs.AreaNames.Collections,
      indexParams: {
        path: ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
      },
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Collections/Collections" /* webpackChunkName: "Collections" */
          )
      ),
      routes: [
        (area) =>
          new ActionRoute(area, "index", {
            path:
              ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
          }),
      ],
    }),
    CrossSave: new Area({
      name: RouteDefs.AreaNames.CrossSave,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/CrossSave/CrossSaveArea" /* webpackChunkName: "CrossSave" */
          )
      ),
      routes: [
        (area) =>
          new ActionRoute(area, "Activate", { path: ":step?/:skuName?" }),
        (area) => new ActionRoute(area, "Confirmation"),
        (area) => new ActionRoute(area, "Deactivate"),
        (area) => new ActionRoute(area, "Recap"),
      ],
    }),
    Codes: new Area({
      name: RouteDefs.AreaNames.Codes,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Codes/CodesArea" /* webpackChunkName: "Codes" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "Redeem"),
        (area) => new ActionRoute(area, "History", { path: ":membershipId?" }),
        (area) => new ActionRoute(area, "Partners", { path: ":membershipId?" }),
      ],
    }),
    Destiny: new Area({
      name: RouteDefs.AreaNames.Destiny,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Destiny/DestinyArea" /* webpackChunkName: "Destiny" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "ProductPage"),
        (area) => new ActionRoute(area, "Buy"),
        (area) =>
          new ActionRoute(area, "BuyDetail", {
            path: "Buy/:productFamilyTag",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, "Companion"),
        (area) => new ActionRoute(area, "NewLight"),
        (area) => new ActionRoute(area, "FreeToPlay"),
        (area) => new ActionRoute(area, "Forsaken"),
        (area) => new ActionRoute(area, "Shadowkeep"),
        (area) => new ActionRoute(area, "SeasonPass"),
        (area) => new ActionRoute(area, "GameHistory"),
        (area) => new ActionRoute(area, "StadiaRegister"),
        (area) => new ActionRoute(area, "BeyondLight"),
        (area) =>
          new ActionRoute(area, "Media", {
            path: "BeyondLight/Media",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, "PhaseOne", {
            path: "BeyondLight/Stasis",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, "PhaseTwo", {
            path: "BeyondLight/Europa",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, "PhaseThree", {
            path: "BeyondLight/Gear",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, "BeyondLightPhaseFour", {
            path: "BeyondLight/Story",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, "Reveal"),
        (area) => new ActionRoute(area, "Info", { path: ":eventTag" }),
        (area) => new ActionRoute(area, "WitchQueen"),
        (area) =>
          new ActionRoute(area, "WitchQueenComparison", {
            path: "WitchQueen/Comparison",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, "Lightfall"),
      ],
    }),
    Direct: new Area({
      name: RouteDefs.AreaNames.Direct,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Direct/DirectArea")
      ),
      routes: [
        (area) => new ActionRoute(area, "Video", { path: ":title" }),
        (area) => new ActionRoute(area, "Circles"),
        (area) => new ActionRoute(area, "RaidRace"),
        (area) => new ActionRoute(area, "Rewards"),
        (area) => new ActionRoute(area, "DestinyShowcase"),
        (area) => new ActionRoute(area, "Anniversary"),
        (area) => new ActionRoute(area, "Reveal"),
      ],
    }),
    Guide: new Area({
      name: RouteDefs.AreaNames.Guide,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Guide/GuideArea")
      ),
      indexParams: { path: ":guide" },
      routes: [(area) => new ActionRoute(area, "index", { path: ":guide" })],
    }),
    Legal: new Area({
      name: RouteDefs.AreaNames.Legal,
      indexParams: { path: ":url" },
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Legal/LegalArea" /* webpackChunkName: "Legal" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "terms"),
        (area) => new ActionRoute(area, "privacypolicy"),
        (area) => new ActionRoute(area, "licenses"),
        (area) => new ActionRoute(area, "sla"),
        (area) => new ActionRoute(area, "codeofconduct"),
        (area) => new ActionRoute(area, "cookiepolicy"),
        (area) => new ActionRoute(area, "intellectualpropertytrademarks"),
        (area) => new ActionRoute(area, "paymentservicesact"),
      ],
    }),
    News: new Area({
      name: RouteDefs.AreaNames.News,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/News/NewsArea" /* webpackChunkName: "News" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "destiny"),
        (area) => new ActionRoute(area, "bungie"),
        (area) => new ActionRoute(area, "community"),
        (area) => new ActionRoute(area, "updates"),
        (area) => new ActionRoute(area, "tech"),
        (area) => new ActionRoute(area, "article", { path: ":articleUrl?" }),
      ],
      webmasterSystem: SystemNames.CoreHomeAndNews,
    }),
    Pgcr: new Area({
      name: RouteDefs.AreaNames.Pgcr,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Pgcr/PgcrRouter" /* webpackChunkName: "PGCR Direct Link" */
          )
      ),
      indexParams: { path: ":id?" },
      routes: [],
    }),
    Registration: new Area({
      name: RouteDefs.AreaNames.Registration,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Registration/RegistrationArea" /* webpackChunkName: "Registration" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, "RegistrationPage"),
        (area) => new ActionRoute(area, "Benefits"),
        (area) => new ActionRoute(area, "Apps"),
      ],
    }),
    Rewards: new Area({
      name: RouteDefs.AreaNames.Rewards,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Rewards/RewardsArea" /* webpackChunkName: "Rewards" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "Rewards"),
        (area) =>
          new ActionRoute(area, "Reward", { path: ":mtype?/:rewardId?" }),
      ],
    }),
    Search: new Area({
      name: RouteDefs.AreaNames.Search,
      indexParams: { path: ":query?" },
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Search/SearchArea" /* webpackChunkName: "Search" */)
      ),
      routes: [(area) => new ActionRoute(area, "index", { path: ":query?" })],
    }),
    Seasons: new Area({
      name: RouteDefs.AreaNames.Seasons,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Seasons/SeasonsArea" /* webpackChunkName: "Seasons" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "SeasonOfTheUndying"),
        (area) => new ActionRoute(area, "SeasonOfDawn"),
        (area) => new ActionRoute(area, "SeasonOfTheWorthy"),
        (area) => new ActionRoute(area, "SeasonOfArrivals"),
        (area) => new ActionRoute(area, "SeasonOfTheHunt"),
        (area) => new ActionRoute(area, "SeasonOfTheChosen"),
        (area) => new ActionRoute(area, "SeasonOfTheSplicer"),
        (area) => new ActionRoute(area, "SeasonOfTheLost"),
        (area) => new ActionRoute(area, "SeasonOfTheRisen"),
        (area) => new ActionRoute(area, "SeasonOfTheHaunted"),
        (area) => new ActionRoute(area, "SeasonOfPlunder"),
        (area) => new ActionRoute(area, "Progress"),
        (area) => new ActionRoute(area, "PreviousSeason"),
        (area) => new ActionRoute(area, "Events", { path: ":eventTag" }),
        (area) => new ActionRoute(area, "Event", { path: ":slug" }),
        (area) => new ActionRoute(area, "News", { path: ":slug" }),
      ],
      webmasterSystem: SystemNames.CoreAreaSeasons,
    }),
    Sms: new Area({
      name: RouteDefs.AreaNames.Sms,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Sms/SmsArea" /* webpackChunkName: "Sms" */)
      ),
      routes: [(area) => new ActionRoute(area, "index")],
      webmasterSystem: SystemNames.SmsVerification,
    }),
    Static: new Area({
      name: RouteDefs.AreaNames.Static,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Static/StaticArea" /* webpackChunkName: "Static" */)
      ),
      indexParams: { path: ":page?" },
      routes: [],
    }),
    Triumphs: new Area({
      name: RouteDefs.AreaNames.Triumphs,
      indexParams: {
        path: ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
      },
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Triumphs/TriumphsArea" /* webpackChunkName: "Triumphs" */
          )
      ),
      routes: [
        (area) =>
          new ActionRoute(area, "index", {
            path:
              ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
          }),
      ],
    }),
    UserResearch: new Area({
      name: RouteDefs.AreaNames.UserResearch,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/UserResearch/UserResearchArea" /* webpackChunkName: "UserResearch" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, "UserResearch"),
        (area) => new ActionRoute(area, "UserResearchCanTravel"),
      ],
    }),
  } as const;

  public static AreaGroups = {
    User: new AreaGroup({
      name: RouteDefs.AreaNames.User,
      children: {
        ZendeskAuth: {
          lazyComponent: createAsyncComponent(
            () =>
              import(
                "@Areas/User/ZendeskAuth" /* webpackChunkName: "UserZendesk" */
              )
          ),
          routes: [],
        },
        SignIn: {
          lazyComponent: createAsyncComponent(
            () =>
              import("@Areas/User/SignIn" /* webpackChunkName: "UserSignIn" */)
          ),
          routes: [],
        },
        Profile: {
          lazyComponent: createAsyncComponent(
            () =>
              import(
                "@Areas/User/Profile" /* webpackChunkName: "UserProfile" */
              )
          ),
          routes: [
            (urlPrefix) =>
              new ActionRoute(urlPrefix, "index", {
                path: ":mtype?/:mid?/:section?",
              }),
          ],
        },
        Account: {
          lazyComponent: createAsyncComponent(
            () =>
              import(
                "@Areas/User/Account" /* webpackChunkName: "UserAccount" */
              )
          ),
          routes: [
            (urlPrefix) => new ActionRoute(urlPrefix, "IdentitySettings"),
            (urlPrefix) => new ActionRoute(urlPrefix, "BungieFriends"),
            (urlPrefix) => new ActionRoute(urlPrefix, "EmailSms"),
            (urlPrefix) => new ActionRoute(urlPrefix, "Notifications"),
            (urlPrefix) => new ActionRoute(urlPrefix, "AccountLinking"),
            (urlPrefix) => new ActionRoute(urlPrefix, "Privacy"),
            (urlPrefix) => new ActionRoute(urlPrefix, "LanguageRegion"),
            (urlPrefix) => new ActionRoute(urlPrefix, "BlockedUsers"),
            (urlPrefix) => new ActionRoute(urlPrefix, "CrossSave"),
            (urlPrefix) => new ActionRoute(urlPrefix, "EververseHistory"),
            (urlPrefix) => new ActionRoute(urlPrefix, "SilverBalanceHistory"),
            (urlPrefix) => new ActionRoute(urlPrefix, "AppHistory"),
          ],
        },
        GameHistory: {
          lazyComponent: createAsyncComponent(
            () =>
              import(
                "@Areas/User/GameHistory/GameHistoryArea" /* webpackChunkName: "GameHistory" */
              )
          ),
          routes: [
            (urlPrefix) =>
              new ActionRoute(urlPrefix, "index", { path: ":mtype?/:mid?" }),
          ],
        },
      },
      indexComponent: () => <Redirect to={RouteHelper.SignIn().url} />,
    }),
  } as const;

  /**
   * Returns all of the routes for all areas defined in RouteDefs
   */
  public static get AllAreaRoutes() {
    const areas: IArea[] = Object.keys(RouteDefs.Areas).map(
      (key: keyof typeof RouteDefs.Areas) => RouteDefs.Areas[key]
    );

    const areaGroups: AreaGroup<any>[] = Object.values(RouteDefs.AreaGroups);

    const areaGroupAreas = areaGroups.reduce(
      (acc: IArea[], areaGroup: AreaGroup<any>) => {
        acc.push(...Object.values(areaGroup.areas));

        return acc;
      },
      []
    );

    let allAreas = [...areas, ...areaGroupAreas];

    allAreas = allAreas.filter((area: IArea) => {
      let enabled = true;
      if (area.webmasterSystem) {
        enabled = ConfigUtils.SystemStatus(area.webmasterSystem);
      }

      return enabled;
    });

    const areaRoutes = allAreas.map((area) => area.render());
    const areaGroupIndexComponents = areaGroups.map((ag, i) => (
      <Route key={i} exact path={ag.resolve()}>
        {ag.render()}
      </Route>
    ));

    return [...areaRoutes, ...areaGroupIndexComponents];
  }
}
