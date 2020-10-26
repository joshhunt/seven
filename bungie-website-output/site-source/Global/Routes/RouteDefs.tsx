/* tslint:disable member-ordering */
import { ActionRoute } from "./ActionRoute";
import { Area } from "./Area";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { createAsyncComponent } from "./AsyncRoute";

export interface ILocaleParams {
  locale?: string;
}

export class RouteDefs {
  private static readonly AreaNames = {
    Codes: "Codes",
    CrossSave: "CrossSave",
    Destiny: "Destiny",
    Direct: "Direct",
    GameHistory: "GameHistory",
    Legal: "Legal",
    PCMigration: "PCMove",
    UserResearch: "UserResearch",
    Seasons: "Seasons",
    Static: "Static",
    Registration: "Registration",
    BeyondLight: "BeyondLight",
    User: "User",
  };

  public static Areas = {
    CrossSave: new Area({
      name: RouteDefs.AreaNames.CrossSave,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/CrossSave/CrossSaveArea" /* webpackChunkName: "CrossSave" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, "index"),
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
        (area) => new ActionRoute(area, "index"),
        (area) => new ActionRoute(area, "ProductPage"),
        (area) => new ActionRoute(area, "Buy"),
        (area) =>
          new ActionRoute(area, "BuyDetail", {
            path: "Buy/:productFamilyTag",
            isOverride: true,
          }),
        (area) => new ActionRoute(area, "Companion"),
        (area) => new ActionRoute(area, "NewLight"),
        (area) => new ActionRoute(area, "Forsaken"),
        (area) => new ActionRoute(area, "Shadowkeep"),
        (area) => new ActionRoute(area, "SeasonPass"),
        (area) => new ActionRoute(area, "GameHistory"),
        (area) => new ActionRoute(area, "PcRegister"),
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
      ],
    }),
    Direct: new Area({
      name: RouteDefs.AreaNames.Direct,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Direct/DirectArea")
      ),
      routes: [
        (area) => new ActionRoute(area, "Video", { path: ":videoContentId" }),
        (area) => new ActionRoute(area, "Analyze"),
      ],
    }),
    GameHistory: new Area({
      name: RouteDefs.AreaNames.GameHistory,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/GameHistory/GameHistoryArea")
      ),
      routes: [(area) => new ActionRoute(area, "index")],
    }),
    Legal: new Area({
      name: RouteDefs.AreaNames.Legal,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/Legal/LegalArea" /* webpackChunkName: "Legal" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "Terms"),
        (area) => new ActionRoute(area, "PrivacyPolicy"),
        (area) => new ActionRoute(area, "Licenses"),
        (area) => new ActionRoute(area, "SLA"),
        (area) => new ActionRoute(area, "CodeOfConduct"),
        (area) => new ActionRoute(area, "CookiePolicy"),
        (area) => new ActionRoute(area, "PaymentServicesAct"),
      ],
    }),
    PCMigration: new Area({
      name: RouteDefs.AreaNames.PCMigration,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/PCMigration/PCMigrationArea" /* webpackChunkName: "PCMigration" */
          )
      ),
      routes: [(area) => new ActionRoute(area, "index")],
    }),
    Seasons: new Area({
      name: RouteDefs.AreaNames.Seasons,
      lazyComponent: createAsyncComponent(
        () =>
          import("@Areas/Seasons/SeasonsArea" /* webpackChunkName: "Seasons" */)
      ),
      routes: [
        (area) => new ActionRoute(area, "index"),
        (area) => new ActionRoute(area, "SeasonOfTheUndying"),
        (area) => new ActionRoute(area, "SeasonOfDawn"),
        (area) => new ActionRoute(area, "SeasonOfTheWorthy"),
        (area) => new ActionRoute(area, "SeasonOfArrivals"),
        (area) => new ActionRoute(area, "Progress"),
        (area) => new ActionRoute(area, "PreviousSeason"),
        (area) => new ActionRoute(area, "Events", { path: ":eventTag" }),
        (area) => new ActionRoute(area, "Event", { path: ":slug" }),
        (area) => new ActionRoute(area, "News"),
      ],
      webmasterSystem: SystemNames.CoreAreaSeasons,
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
        (area) => new ActionRoute(area, "index"),
        (area) => new ActionRoute(area, "UserResearch"),
        (area) => new ActionRoute(area, "UserResearchCanTravel"),
      ],
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
    Registration: new Area({
      name: RouteDefs.AreaNames.Registration,
      lazyComponent: createAsyncComponent(
        () =>
          import(
            "@Areas/Registration/RegistrationArea" /* webpackChunkName: "Registration" */
          )
      ),
      routes: [
        (area) => new ActionRoute(area, "index"),
        (area) => new ActionRoute(area, "RegistrationPage"),
        (area) => new ActionRoute(area, "Benefits"),
        (area) => new ActionRoute(area, "Apps"),
      ],
    }),
    User: new Area({
      name: RouteDefs.AreaNames.User,
      lazyComponent: createAsyncComponent(
        () => import("@Areas/User/UserArea" /* webpackChunkName: "User" */)
      ),
      routes: [(area) => new ActionRoute(area, "SignIn")],
    }),
  };

  /**
   * Returns all of the routes for all areas defined in RouteDefs
   */
  public static get AllAreaRoutes() {
    const allAreas: Area[] = Object.keys(RouteDefs.Areas)
      .map((key) => RouteDefs.Areas[key])
      .filter((area: Area) => {
        let enabled = true;
        if (area.params && area.params.webmasterSystem) {
          enabled = ConfigUtils.SystemStatus(area.params.webmasterSystem);
        }

        return enabled;
      });

    const areaRoutes = allAreas.map((area) => area.areaRoute);

    return areaRoutes;
  }
}
