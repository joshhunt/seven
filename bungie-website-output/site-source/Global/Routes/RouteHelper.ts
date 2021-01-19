import * as H from "history";
import { RouteDefs } from "./RouteDefs";
import { ActionRoute } from "./ActionRoute";
import { ICrossSaveActivateParams } from "@Areas/CrossSave/CrossSaveActivate";
import { BungieCredentialType } from "@Enum";
import { UrlUtils } from "@Utilities/UrlUtils";
import {
  BuyDetailRouteParams,
  BuyDetailQueryParams,
  SignInRouteParams,
  SignInQueryParams,
} from "@Routes/RouteParams";

/**
 * Allows us to create links between the Renderer site and the Renderer.Core site more easily.
 * */
export interface IMultiSiteLink {
  /** The URL to navigate to */
  url: string;

  /** If true, we will treat this as a legacy link instead of a React-style link */
  legacy: boolean;
}

const LegacyPath = (path: string): IMultiSiteLink => {
  const url = UrlUtils.GetUrlForLocale(path);

  return {
    url,
    legacy: true,
  };
};

const DirectLegacyPath = (path: string): IMultiSiteLink => {
  const url = path;

  return {
    url,
    legacy: true,
  };
};

const LegacyPathWithQuery = (path: string) => (
  params?: object
): IMultiSiteLink => {
  const pathBasic = LegacyPath(path);
  const query = params ? "?" + UrlUtils.ObjectToQuery(params) : "";

  const url = pathBasic.url + query;

  return {
    url,
    legacy: true,
  };
};

const BasicReactPath = <T, U = any>(action: ActionRoute) => (
  params?: T,
  extra?: U
): IMultiSiteLink => {
  return action.resolve<T>(params, extra);
};

export class RouteHelper {
  public static Home: IMultiSiteLink = {
    legacy: true,
    url: "/",
  };

  /**
   *
   * User Links
   *
   * */
  public static Profile = (membershipId?: string) => {
    return membershipId
      ? LegacyPath(`/Profile/${membershipId}`)
      : LegacyPath(`/Profile`);
  };

  public static ProfilePage = (action: string) => {
    return LegacyPath(`/Profile/${action}`);
  };

  public static ProfileSettings = (membershipId: string, category: string) => {
    return LegacyPath(
      `/Profile/Settings/254/${membershipId}?category=${category}`
    );
  };

  public static Settings = LegacyPathWithQuery("/Profile/Settings");
  public static ReferAFriend = LegacyPathWithQuery("/Profile/ReferAFriend");
  public static CrossSave = BasicReactPath(
    RouteDefs.Areas.CrossSave.getAction()
  );
  public static CrossSaveActivate = BasicReactPath<ICrossSaveActivateParams>(
    RouteDefs.Areas.CrossSave.getAction("Activate")
  );
  public static Rewards = LegacyPathWithQuery("/Profile/Rewards");
  public static Join = LegacyPathWithQuery(`/User/JoinUp`);
  public static SignIn = (title?: string, bru?: string) => {
    const encodedBru = encodeURIComponent(bru);

    const resultBru =
      bru && title ? `?title=${title}&bru=${encodedBru}` : `?bru=${encodedBru}`;
    const resolved = BasicReactPath(RouteDefs.Areas.User.getAction("SignIn"))();
    resolved.url += bru ? `${resultBru}` : "";

    if (title && !bru) {
      resolved.url += `?title=${title}`;
    }

    return resolved;
  };
  public static SignOut = LegacyPathWithQuery(
    `/User/SignOut?bru=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`
  );
  public static Messages = (iframeMode = false) => {
    const messages = UrlUtils.GetUrlForLocale("/Messages");

    return messages + (iframeMode ? "?iframe=1" : "");
  };

  public static GetAccountLink = (
    cr: BungieCredentialType,
    stateIdentifier: number,
    flowStart: 0 | 1 = 1,
    force: 0 | 1 = 0
  ) =>
    LegacyPath(
      `/User/Link/${BungieCredentialType[cr]}/?flowStart=${flowStart}&force=${force}&stateIdentifier=${stateIdentifier}`
    );

  public static GetAccountAuthVerify = (
    cr: BungieCredentialType,
    stateIdentifier: number,
    resetAuth = false
  ) =>
    LegacyPath(
      `/User/VerifyAuth/${BungieCredentialType[cr]}/?flowStart=1&force=0&stateIdentifier=${stateIdentifier}&resetAuth=${resetAuth}`
    );

  public static Triumphs = LegacyPathWithQuery("/Triumphs");
  public static Collections = LegacyPathWithQuery("/Collections");

  public static ResendEmailVerification = (mid: string) =>
    LegacyPath(`/Emails/ResendVerification?area=Emails&mid=${mid}`);

  public static Registration = BasicReactPath(
    RouteDefs.Areas.Registration.getAction()
  );
  public static RegistrationBenefits = BasicReactPath(
    RouteDefs.Areas.Registration.getAction("Benefits")
  );

  /**
   *
   * Destiny Links
   *
   * */
  public static News = LegacyPathWithQuery("/News");
  public static NewsArticle = (articleId: number) =>
    LegacyPath(`/Explore/Detail/News/${articleId}`);
  public static AboutDestiny = LegacyPathWithQuery("/pub/AboutDestiny");
  public static Companion = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Companion")
  );
  public static Clans = LegacyPathWithQuery("/ClanV2/Search");
  public static MyClan = LegacyPathWithQuery("/ClanV2/MyClan");
  public static Fireteams = LegacyPathWithQuery(
    "ClanV2/FireteamSearch?activityType=0&platform=0"
  );
  public static Groups = LegacyPathWithQuery("/Groups");
  public static DestinyCredits = LegacyPathWithQuery("/Destiny/Credits");
  public static Help = LegacyPathWithQuery("/Support");
  public static HelpArticle = (articleId: number) =>
    LegacyPath(`/Help/Article/${articleId}`);
  public static HelpStep = (helpStepId: number) =>
    LegacyPath(`/Help/Troubleshoot?oid=${helpStepId}`);
  public static GuideDestiny = LegacyPathWithQuery("/Guide/Destiny2");
  public static DestinyBuy = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Buy")
  );
  public static DestinyBuyDetail = BasicReactPath<
    BuyDetailRouteParams,
    BuyDetailQueryParams
  >(RouteDefs.Areas.Destiny.getAction("BuyDetail"));
  public static Sku = (sku: string, store: string, region: string) =>
    LegacyPath(`/Sku/${sku}/${store}/${region}`);
  public static ExternalRelay = (relayName: string, params: any) =>
    LegacyPath(`/ExternalRelay/${relayName}?${UrlUtils.ObjectToQuery(params)}`);
  public static ExternalRelayBuyD2 = (version = "All", store?: string) =>
    RouteHelper.ExternalRelay("BuyD2", { version, store });
  public static Shadowkeep = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("ShadowKeep")
  );
  public static Forsaken = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Forsaken")
  );
  public static NewLight = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("NewLight")
  );
  public static PCMigration = BasicReactPath(
    RouteDefs.Areas.PCMigration.getAction("Index")
  );
  public static DestinyNextChapter = {
    url: "/Destiny2NextChapter",
    legacy: true,
  };
  public static DestinyItemDefinition = (itemHash) =>
    LegacyPath(`/Explore/Detail/DestinyInventoryItemDefinition/${itemHash}`);
  public static SeasonProgress = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("Progress")
  );
  public static PreviousSeason = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("PreviousSeason")
  );
  public static BeyondLight = (hash?: string) => {
    const resolved = BasicReactPath(
      RouteDefs.Areas.Destiny.getAction("BeyondLight")
    )();
    resolved.url += hash ? `#${hash}` : "";

    return resolved;
  };
  public static BeyondLightMedia = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Media")
  );
  public static BeyondLightPhases = (phase: string) => {
    const resolved = BasicReactPath(
      RouteDefs.Areas.Destiny.getAction("BeyondLight")
    )();
    resolved.url += phase ? `/${phase}` : "";

    return resolved;
  };

  //Seasons
  public static SeasonOfDrifterLink = LegacyPath("/pub/SeasonOfTheDrifter");
  public static SeasonOfOpulenceLink = LegacyPath("/pub/SeasonOfOpulence");
  public static SeasonOfTheUndying = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheUndying")
  );
  public static SeasonOfDawn = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfDawn")
  );
  public static SeasonOfTheWorthy = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheWorthy")
  );
  public static Season11 = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfArrivals")
  );
  public static Season12 = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheHunt")
  );
  public static Seasons = BasicReactPath(RouteDefs.Areas.Seasons.getAction());
  public static SeasonsProgress = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("Progress")
  );
  public static SeasonsPreviousSeason = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("PreviousSeason")
  );

  //Codes & Partner Rewards
  public static CodeRedemption = BasicReactPath(
    RouteDefs.Areas.Codes.getAction("Redeem")
  );
  //temporarily using CodeRedemptionReact so that rollback is easier....famous last words I know
  public static CodeRedemptionReact = BasicReactPath(
    RouteDefs.Areas.Codes.getAction("Redeem")
  );
  public static CodeHistoryReact = BasicReactPath(
    RouteDefs.Areas.Codes.getAction("History")
  );
  public static PartnerRewards = BasicReactPath(
    RouteDefs.Areas.Codes.getAction("Partners")
  );

  /**
   *
   * Bungie Links
   *
   * */
  public static Contact = LegacyPathWithQuery("/contactus");
  public static Careers = (subPath = "") =>
    `https://careers.bungie.com/${subPath}`;
  public static About = LegacyPathWithQuery("/AboutUs");
  public static Forums = LegacyPathWithQuery("/Forum/Topics");
  public static BungieStore = (subPath = "") =>
    `https://bungiestore.com/${subPath}`;
  public static PressKits = () => "https://presskits.bungie.com";
  public static Search = LegacyPathWithQuery("/Search");
  public static Foundation = (subPath = "") =>
    `https://bungiefoundation.org/${subPath}`;
  public static PlayTests = BasicReactPath(
    RouteDefs.Areas.UserResearch.getAction()
  );
  public static BungieNewsRoom = LegacyPath("/Newsroom");

  /**
   *
   * Legal Links
   *
   * */
  public static LegalTermsOfUse = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("Terms")
  );
  public static LegalPrivacyPolicy = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("PrivacyPolicy")
  );
  public static LegalSLA = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("SLA")
  );
  public static LegalLicenses = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("Licenses")
  );
  public static LegalCodeOfConduct = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("CodeOfConduct")
  );
  public static LegalCookiePolicy = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("CookiePolicy")
  );
  public static LegalPaymentServicesAct = BasicReactPath(
    RouteDefs.Areas.Legal.getAction("PaymentServicesAct")
  );
  public static Trademarks = LegacyPathWithQuery("/View/bungie/trademarks");
  public static Applications = LegacyPathWithQuery("/Application");
}
