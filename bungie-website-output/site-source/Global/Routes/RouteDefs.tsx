import { SystemNames } from "@Global/SystemNames";
import { AreaGroup } from "@Routes/AreaGroup";
import { AreaNames } from "@Routes/Definitions/AreaNames";
import { RouteActions } from "@Routes/Definitions/RouteActions";
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
  public static Areas = {
    Admin: new Area({
      name: AreaNames.Admin,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Admin/AdminArea" /* webpackChunkName: "Admin" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Reports),
        (area) =>
          new ActionRoute(area, RouteActions.Report, { path: ":reportId?" }),
      ],
    }),
    Application: new Area({
      name: AreaNames.Application,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Application/ApplicationArea" /* webpackChunkName: "Application" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Index),
        (area) => new ActionRoute(area, RouteActions.Create),
        (area) =>
          new ActionRoute(area, RouteActions.Detail, { path: ":appId" }),
      ],
    }),
    BungieTech: new Area({
      name: AreaNames.BungieTech,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/BungieTech/BungieTechArea" /* webpackChunkName: "BungieTech" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Index),
        (area) =>
          new ActionRoute(area, RouteActions.Article, { path: "articleUrl?" }),
      ],
    }),
    Clan: new Area({
      name: AreaNames.Clan,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Clan/ClanArea" /* webpackChunkName: "Clan" */)
      ),
      routes: [
        (area) =>
          new ActionRoute(area, RouteActions.Profile, { path: ":clanId" }),
        (area) =>
          new ActionRoute(area, RouteActions.Settings, { path: ":clanId" }),
        (area) =>
          new ActionRoute(area, RouteActions.CultureFields, {
            path: ":clanId",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.GeneralSettings, {
            path: ":clanId",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.EditBanner, { path: ":clanId" }),
        (area) =>
          new ActionRoute(area, RouteActions.AdminHistory, {
            path: ":clanId/:page?",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.EditHistory, {
            path: ":clanId/:page?",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.Banned, {
            path: ":clanId/:page?",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.Invitations, {
            path: ":clanId/:page?",
          }),
      ],
    }),
    Clans: new Area({
      name: AreaNames.Clans,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Clans/ClansArea" /* webpackChunkName: "Clans" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Create),
        (area) => new ActionRoute(area, RouteActions.Suggested),
        (area) => new ActionRoute(area, RouteActions.MyClans),
      ],
    }),
    Collections: new Area({
      name: AreaNames.Collections,
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
          new ActionRoute(area, RouteActions.Index, {
            path:
              ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
          }),
      ],
    }),
    CrossSave: new Area({
      name: AreaNames.CrossSave,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/CrossSave/CrossSaveArea" /* webpackChunkName: "CrossSave" */
          )
      ),
      routes: [
        (area) =>
          new ActionRoute(area, RouteActions.Activate, {
            path: ":step?/:skuName?",
          }),
        (area) => new ActionRoute(area, RouteActions.Confirmation),
        (area) => new ActionRoute(area, RouteActions.Deactivate),
        (area) => new ActionRoute(area, RouteActions.Recap),
      ],
    }),
    Codes: new Area({
      name: AreaNames.Codes,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Codes/CodesArea" /* webpackChunkName: "Codes" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Redeem),
        (area) =>
          new ActionRoute(area, RouteActions.History, {
            path: ":membershipId?",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.Partners, {
            path: ":membershipId?",
          }),
      ],
    }),
    Emails: new Area({
      name: AreaNames.Emails,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Emails/EmailsArea" /* webpackChunkName: "Emails" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Unsubscribe, {}),
        (area) => new ActionRoute(area, RouteActions.Verify, {}),
      ],
    }),
    Destiny: new Area({
      name: AreaNames.Destiny,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Destiny/DestinyArea" /* webpackChunkName: "Destiny" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Index),
        (area) => new ActionRoute(area, RouteActions.ProductPage),
        (area) => new ActionRoute(area, RouteActions.Buy),
        (area) =>
          new ActionRoute(area, RouteActions.BuyDetail, {
            path: "Buy/:productFamilyTag",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, RouteActions.Companion),
        (area) => new ActionRoute(area, RouteActions.NewLight),
        (area) => new ActionRoute(area, RouteActions.FreeToPlay),
        (area) => new ActionRoute(area, RouteActions.Forsaken),
        (area) => new ActionRoute(area, RouteActions.Shadowkeep),
        (area) => new ActionRoute(area, RouteActions.SeasonPass),
        (area) => new ActionRoute(area, RouteActions.GameHistory),
        (area) => new ActionRoute(area, RouteActions.StadiaRegister),
        (area) => new ActionRoute(area, RouteActions.BeyondLight),
        (area) =>
          new ActionRoute(area, RouteActions.Media, {
            path: "BeyondLight/Media",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, RouteActions.PhaseOne, {
            path: "BeyondLight/Stasis",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, RouteActions.PhaseTwo, {
            path: "BeyondLight/Europa",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, RouteActions.PhaseThree, {
            path: "BeyondLight/Gear",
            isOverride: true,
          }),
        (area) =>
          new ActionRoute(area, RouteActions.BeyondLightPhaseFour, {
            path: "BeyondLight/Story",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, RouteActions.Reveal),
        (area) =>
          new ActionRoute(area, RouteActions.Info, { path: ":eventTag" }),
        (area) => new ActionRoute(area, RouteActions.WitchQueen),
        (area) =>
          new ActionRoute(area, RouteActions.WitchQueenComparison, {
            path: "WitchQueen/Comparison",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, RouteActions.Lightfall),
        (area) => new ActionRoute(area, RouteActions.TheFinalShape),
      ],
    }),
    Direct: new Area({
      name: AreaNames.Direct,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Direct/DirectArea")
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Video, { path: ":title" }),
        (area) => new ActionRoute(area, RouteActions.Circles),
        (area) => new ActionRoute(area, RouteActions.RaidRace),
        (area) => new ActionRoute(area, RouteActions.Rewards),
        (area) => new ActionRoute(area, RouteActions.DestinyShowcase),
        (area) => new ActionRoute(area, RouteActions.Anniversary),
        (area) => new ActionRoute(area, RouteActions.Reveal),
      ],
    }),
    FireteamFinder: new Area({
      name: AreaNames.FireteamFinder,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/FireteamFinder/FireteamFinderArea")
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Dashboard),
        (area) =>
          new ActionRoute(area, RouteActions.Browse, {
            path: ":graphId?/:activityId?",
          }),
        (area) =>
          new ActionRoute(area, RouteActions.Detail, { path: ":lobbyId?" }),
        (area) =>
          new ActionRoute(area, RouteActions.Create, {
            path: ":graphId?/:activityId?",
          }),
      ],
    }),
    Fireteams: new Area({
      name: AreaNames.Fireteams,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Fireteams/FireteamsArea")
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Search),
        (area) =>
          new ActionRoute(area, RouteActions.Fireteam, { path: ":fireteamId" }),
      ],
    }),
    Guide: new Area({
      name: AreaNames.Guide,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Guide/GuideArea")
      ),
      indexParams: { path: ":guide" },
      routes: [
        (area) => new ActionRoute(area, RouteActions.Index, { path: ":guide" }),
      ],
    }),
    Legal: new Area({
      name: AreaNames.Legal,
      indexParams: { path: ":pageName" },
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Legal/LegalArea" /* webpackChunkName: "Legal" */)
      ),
      routes: [
        (area) =>
          new ActionRoute(area, RouteActions.Index, { path: ":pageName" }),
      ],
    }),
    //	Marathon: new Area({
    //		name: AreaNames.Marathon, lazyComponent: createAsyncComponent(() => import(
    //			"@Areas/Marathon/MarathonArea" /* webpackChunkName: "Marathon" */
    //			)), routes: [area => new ActionRoute(area, RouteActions.Alpha)]
    //
    //	}),
    News: new Area({
      name: AreaNames.News,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/News/NewsArea" /* webpackChunkName: "News" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Destiny),
        (area) => new ActionRoute(area, RouteActions.Bungie),
        (area) => new ActionRoute(area, RouteActions.Community),
        (area) => new ActionRoute(area, RouteActions.Updates),
        (area) => new ActionRoute(area, RouteActions.Tech),
        (area) =>
          new ActionRoute(area, RouteActions.Article, { path: ":articleUrl?" }),
      ],
      webmasterSystem: SystemNames.CoreHomeAndNews,
    }),
    Newsroom: new Area({
      name: AreaNames.Newsroom,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Newsroom/NewsroomArea" /* webpackChunkName: "Newsroom" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Index),
        (area) =>
          new ActionRoute(area, RouteActions.Article, { path: "articleUrl?" }),
      ],
    }),
    Pgcr: new Area({
      name: AreaNames.Pgcr,
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
      name: AreaNames.Registration,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Registration/RegistrationArea" /* webpackChunkName: "Registration" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.RegistrationPage),
        (area) => new ActionRoute(area, RouteActions.Benefits),
        (area) => new ActionRoute(area, RouteActions.Apps),
      ],
    }),
    Rewards: new Area({
      name: AreaNames.Rewards,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Rewards/RewardsArea" /* webpackChunkName: "Rewards" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.Rewards),
        (area) =>
          new ActionRoute(area, RouteActions.Reward, {
            path: ":mtype?/:rewardId?",
          }),
      ],
    }),
    Search: new Area({
      name: AreaNames.Search,
      indexParams: { path: ":query?" },
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Search/SearchArea" /* webpackChunkName: "Search" */)
      ),
      routes: [
        (area) =>
          new ActionRoute(area, RouteActions.Index, { path: ":query?" }),
      ],
    }),
    Seasons: new Area({
      name: AreaNames.Seasons,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Seasons/SeasonsArea" /* webpackChunkName: "Seasons" */)
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheUndying),
        (area) => new ActionRoute(area, RouteActions.SeasonOfDawn),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheWorthy),
        (area) => new ActionRoute(area, RouteActions.SeasonOfArrivals),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheHunt),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheChosen),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheSplicer),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheLost),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheRisen),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheHaunted),
        (area) => new ActionRoute(area, RouteActions.SeasonOfPlunder),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheSeraph),
        (area) => new ActionRoute(area, RouteActions.SeasonOfDefiance),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheDeep),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheWitch),
        (area) => new ActionRoute(area, RouteActions.SeasonOfTheWish),
        (area) => new ActionRoute(area, RouteActions.Progress),
        (area) => new ActionRoute(area, RouteActions.PreviousSeason),
        (area) => new ActionRoute(area, RouteActions.Events),
        (area) => new ActionRoute(area, RouteActions.News, { path: ":slug" }),
      ],
      webmasterSystem: SystemNames.CoreAreaSeasons,
    }),
    Sms: new Area({
      name: AreaNames.Sms,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Sms/SmsArea" /* webpackChunkName: "Sms" */)
      ),
      routes: [(area) => new ActionRoute(area, RouteActions.Index)],
      webmasterSystem: SystemNames.SmsVerification,
    }),
    Static: new Area({
      name: AreaNames.Static,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Static/StaticArea" /* webpackChunkName: "Static" */)
      ),
      indexParams: { path: ":page?" },
      routes: [],
    }),
    Triumphs: new Area({
      name: AreaNames.Triumphs,
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
          new ActionRoute(area, RouteActions.Index, {
            path:
              ":mtype?/:mid?/:cid?/:root?/:parent?/:category?/:subcategory?",
          }),
      ],
    }),
    UserResearch: new Area({
      name: AreaNames.UserResearch,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/UserResearch/UserResearchArea" /* webpackChunkName: "UserResearch" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, RouteActions.UserResearch),
        (area) => new ActionRoute(area, RouteActions.UserResearchCanTravel),
      ],
    }),
  } as const;

  public static AreaGroups = {
    User: new AreaGroup({
      name: AreaNames.User,
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
              new ActionRoute(urlPrefix, RouteActions.Index, {
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
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.IdentitySettings),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.BungieFriends),
            //urlPrefix => new ActionRoute(urlPrefix, RouteActions.ParentalControls),
            (urlPrefix) => new ActionRoute(urlPrefix, RouteActions.EmailSms),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.Notifications),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.AccountLinking),
            (urlPrefix) => new ActionRoute(urlPrefix, RouteActions.Privacy),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.LanguageRegion),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.BlockedUsers),
            (urlPrefix) => new ActionRoute(urlPrefix, RouteActions.CrossSave),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.EververseHistory),
            (urlPrefix) =>
              new ActionRoute(urlPrefix, RouteActions.SilverBalanceHistory),
            (urlPrefix) => new ActionRoute(urlPrefix, RouteActions.AppHistory),
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
              new ActionRoute(urlPrefix, RouteActions.Index, {
                path: ":mtype?/:mid?",
              }),
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
