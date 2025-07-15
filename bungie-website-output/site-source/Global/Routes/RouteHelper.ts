import { ICrossSaveActivateParams } from "@Areas/CrossSave/CrossSaveActivate";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { RouteActions } from "@Routes/Definitions/RouteActions";
import {
  BuyDetailQueryParams,
  BuyDetailRouteParams,
  IAlphaParams,
  IApplicationParams,
  IClanParams,
  IFireteamFinderParams,
  IFireteamParams,
  IFireteamSearchParams,
  IProfileParams,
  IReportParams,
  IRewardClaimParams,
  ISearchParams,
  LegalRouteParams,
  NewsParams,
  PresentationNodeParams,
} from "@Routes/Definitions/RouteParams";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { ActionRoute } from "./ActionRoute";
import { RouteDefs } from "./RouteDefs";

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

export const ZendeskHelpArticleUrl = (articleId: string) => {
  const articleTemplateUrl: string | null = ConfigUtils.GetParameter(
    SystemNames.ZendeskHelpArticleUrl,
    "TemplateUrl",
    ""
  );

  if (!articleTemplateUrl) {
    return null;
  }

  const currentLoc = Localizer.CurrentCultureName;
  // if zendesk locale is different from bnet locale, get it from webmaster, else current locale is same as zendesk's
  const zendeskLoc = ConfigUtils.GetParameter(
    SystemNames.ZendeskArticleLocales,
    currentLoc,
    currentLoc
  );

  // return article url with replaced locale and article id
  return articleTemplateUrl
    .replace("{locale}", zendeskLoc)
    .replace("{articleId}", articleId);
};

export class RouteHelper {
  public static Home: IMultiSiteLink = {
    legacy: false,
    url: "/",
  };
  public static NewProfile = BasicReactPath<IProfileParams>(
    RouteDefs.AreaGroups.User.areas.Profile.getAction("Index")
  );
  public static NewGameHistory = BasicReactPath<IProfileParams>(
    RouteDefs.AreaGroups.User.areas.GameHistory.getAction("Index")
  );
  public static Settings = LegacyPathWithQuery("/Profile/Settings");
  public static NewSettings = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("index")
  );
  public static BlockedUsers = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("BlockedUsers")
  );
  public static BungieFriends = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("BungieFriends")
  );
  public static EmailAndSms = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("EmailSms")
  );
  public static ParentalControls = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("ParentalControls")
  );
  public static ParentalControlsLanding = BasicReactPath(
    RouteDefs.Areas.ParentalControlsLanding.getAction("Index")
  );
  public static Notifications = BasicReactPath(
    RouteDefs.AreaGroups.User.areas.Account.getAction("Notifications")
  );
  public static ReferAFriend = LegacyPathWithQuery("/Profile/ReferAFriend");
  public static CrossSave = BasicReactPath(
    RouteDefs.Areas.CrossSave.getAction()
  );
  public static CrossSaveActivate = BasicReactPath<ICrossSaveActivateParams>(
    RouteDefs.Areas.CrossSave.getAction("Activate")
  );
  public static Rewards = BasicReactPath(
    RouteDefs.Areas.Direct.getAction("Rewards")
  );
  public static DigitalRewards = BasicReactPath(
    RouteDefs.Areas.Rewards.getAction("Rewards")
  );
  public static ClaimDigitalReward = BasicReactPath<IRewardClaimParams>(
    RouteDefs.Areas.Rewards.getAction("Reward")
  );
  public static Join = LegacyPathWithQuery(`/User/JoinUp`);
  public static SignOut = LegacyPathWithQuery(
    `/User/SignOut?bru=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`
  );
  public static SignOutBasic = LegacyPath(`/User/SignOut`);
  public static NewTriumphs = BasicReactPath<PresentationNodeParams>(
    RouteDefs.Areas.Triumphs.getAction("index")
  );
  public static NewCollections = BasicReactPath<PresentationNodeParams>(
    RouteDefs.Areas.Collections.getAction("index")
  );
  public static Registration = BasicReactPath(
    RouteDefs.Areas.Registration.getAction()
  );
  public static RegistrationBenefits = BasicReactPath(
    RouteDefs.Areas.Registration.getAction("Benefits")
  );
  public static Reports = BasicReactPath(
    RouteDefs.Areas.Admin.getAction("Reports")
  );
  public static Report = BasicReactPath<IReportParams>(
    RouteDefs.Areas.Admin.getAction("Report")
  );
  public static CommunityCurator = LegacyPath("/CommunityCurator");
  /**
   *
   * Destiny Links
   *
   * */
  public static DestinyHome = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Index")
  );
  public static News = BasicReactPath(RouteDefs.Areas.News.getAction("Index"));
  public static NewsArticle = BasicReactPath<NewsParams>(
    RouteDefs.Areas.News.getAction("Article")
  );
  public static AboutDestiny = LegacyPathWithQuery("/pub/AboutDestiny");
  public static Companion = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Companion")
  );
  public static Clans = LegacyPathWithQuery("/ClanV2/Search");
  public static MyClan = LegacyPathWithQuery("/ClanV2/MyClan");
  public static NewClans = BasicReactPath(
    RouteDefs.Areas.Clans.getAction("MyClans")
  );
  public static NewMyClan = RouteHelper.NewClans;
  public static NewClansCreate = BasicReactPath(
    RouteDefs.Areas.Clans.getAction("Create")
  );
  public static NewClansSuggested = BasicReactPath(
    RouteDefs.Areas.Clans.getAction("Suggested")
  );
  public static NewClanProfile = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("Profile")
  );
  public static NewClanSettings = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("Settings")
  );
  public static NewClanInvitations = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("Invitations")
  );
  public static NewClanCultureSettings = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("CultureFields")
  );
  public static NewClanGeneralSettings = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("GeneralSettings")
  );
  public static NewClanBanned = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("Banned")
  );
  public static NewClanEditBanner = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("EditBanner")
  );
  public static NewClanAdminHistory = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("AdminHistory")
  );
  public static NewClanEditHistory = BasicReactPath<IClanParams>(
    RouteDefs.Areas.Clan.getAction("EditHistory")
  );
  public static Fireteams = LegacyPathWithQuery(
    "ClanV2/FireteamSearch?activityType=0&platform=0"
  );
  public static FireteamFinderCreate = BasicReactPath<IFireteamFinderParams>(
    RouteDefs.Areas.FireteamFinder.getAction("Create")
  );
  public static FireteamFinderCreateSelectActivity = BasicReactPath(
    RouteDefs.Areas.FireteamFinder.getAction("Create")
  );
  public static FireteamFinder = BasicReactPath(
    RouteDefs.Areas.FireteamFinder.getAction("Index")
  );
  public static FireteamFinderBrowse = BasicReactPath<IFireteamFinderParams>(
    RouteDefs.Areas.FireteamFinder.getAction("Browse")
  );
  public static FireteamFinderDetail = BasicReactPath<IFireteamFinderParams>(
    RouteDefs.Areas.FireteamFinder.getAction("Detail")
  );
  public static FireteamFinderHelp = LegacyPathWithQuery(
    "/Forums/Topics?pNumber=0&tg=Help%20FireteamFinderBetaHelp&tSort=0&tType=0&d=0"
  );
  public static Groups = LegacyPathWithQuery("/Groups");
  public static DestinyCredits = LegacyPathWithQuery("/Destiny/Credits");
  public static Help = LegacyPathWithQuery("/Support");
  public static GuideDestiny = LegacyPathWithQuery("/Guide/Destiny2");
  public static DestinyBuy = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Buy")
  );
  public static DestinyBuyDetail = BasicReactPath<
    BuyDetailRouteParams,
    BuyDetailQueryParams
  >(RouteDefs.Areas.Destiny.getAction("BuyDetail"));
  public static Shadowkeep = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("ShadowKeep")
  );
  public static Forsaken = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Forsaken")
  );
  public static NewLight = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("NewLight")
  );
  public static DestinyNextChapter = {
    url: "/Destiny2NextChapter",
    legacy: true,
  };
  public static SeasonProgress = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("Progress")
  );
  public static PreviousSeason = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("PreviousSeason")
  );
  public static BeyondLightMedia = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Media")
  );
  public static WitchQueen = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("WitchQueen")
  );
  public static Lightfall = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("Lightfall")
  );
  public static FinalShape = BasicReactPath(
    RouteDefs.Areas.Destiny.getAction("TheFinalShape")
  );
  public static PurchaseHistory = LegacyPathWithQuery(
    "/Profile/PurchaseHistory"
  );
  public static ApplicationHistory = LegacyPathWithQuery(
    "/Profile/ApplicationHistory"
  );
  //Seasons
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
  public static SeasonOfTheChosen = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheChosen")
  );
  public static SeasonOfTheSplicer = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheSplicer")
  );
  public static SeasonOfTheLost = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheLost")
  );
  public static SeasonOfTheRisen = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheRisen")
  );
  public static SeasonOfTheHaunted = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheHaunted")
  );
  public static SeasonOfPlunder = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfPlunder")
  );
  public static SeasonOfTheSeraph = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheSeraph")
  );
  public static SeasonOfDefiance = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfDefiance")
  );
  public static SeasonOfTheDeep = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheDeep")
  );
  public static SeasonOfTheWitch = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheWitch")
  );
  public static SeasonOfTheWish = BasicReactPath(
    RouteDefs.Areas.Seasons.getAction("SeasonOfTheWish")
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
  public static About = LegacyPathWithQuery("/AboutUs");
  public static Forums = LegacyPathWithQuery("/Forum/Topics");
  public static Search = BasicReactPath<ISearchParams>(
    RouteDefs.Areas.Search.getAction()
  );
  public static PlayTests = BasicReactPath(
    RouteDefs.Areas.UserResearch.getAction()
  );
  public static BungieNewsRoom = BasicReactPath(
    RouteDefs.Areas.Newsroom.getAction("Index")
  );
  public static BungieTechBlog = BasicReactPath(
    RouteDefs.Areas.BungieTech.getAction("Index")
  );
  /**
   *
   * Legal Links
   *
   * */
  public static LegalPage = BasicReactPath<LegalRouteParams>(
    RouteDefs.Areas.Legal.getAction("Index")
  );
  public static Trademarks = LegacyPathWithQuery("/View/bungie/trademarks");
  public static ApplicationsReact = BasicReactPath(
    RouteDefs.Areas.Application.getAction("Index")
  );
  public static Applications = LegacyPathWithQuery("/Application");
  public static ApplicationCreate = BasicReactPath(
    RouteDefs.Areas.Application.getAction("Create")
  );
  public static ApplicationDetailReact = BasicReactPath<IApplicationParams>(
    RouteDefs.Areas.Application.getAction("Detail")
  );

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

  public static TargetProfile = (
    membershipId: string,
    membershipType: BungieMembershipType
  ) => {
    const profileUrlCreator = BasicReactPath<IProfileParams>(
      RouteDefs.AreaGroups.User.areas.Profile.getAction("Index")
    );

    return profileUrlCreator({
      mid: membershipId,
      mtype: EnumUtils.getNumberValue(
        membershipType,
        BungieMembershipType
      ).toString(),
    });
  };

  public static GameHistory = (
    membershipId: string,
    membershipType: BungieMembershipType
  ) => {
    if (ConfigUtils.SystemStatus("CoreAreaGameHistory")) {
      const profileUrlCreator = BasicReactPath<IProfileParams>(
        RouteDefs.AreaGroups.User.areas.GameHistory.getAction("Index")
      );

      return profileUrlCreator({
        mid: membershipId,
        mtype: EnumUtils.getNumberValue(
          membershipType,
          BungieMembershipType
        ).toString(),
      });
    }

    let params = "";

    if (membershipId && membershipType) {
      params = `/${membershipType}/${membershipId}`;
    }

    return LegacyPath(`/Profile/GameHistory${params}`);
  };

  public static ProfilePage = (action: string) => {
    return LegacyPath(`/Profile/${action}`);
  };

  public static ProfileSettings = (membershipId: string, category: string) => {
    return LegacyPath(
      `/Profile/Settings/254/${membershipId}?category=${category}`
    );
  };

  public static Gear = (
    membershipId: string,
    membershipType: BungieMembershipType,
    characterId: string
  ) => {
    return LegacyPath(`/Gear/${membershipType}/${membershipId}/${characterId}`);
  };

  public static ParentalControlsWithId = (playerId: string) => {
    const baseurl = BasicReactPath(
      RouteDefs.AreaGroups.User.areas.Account.getAction("ParentalControls")
    )();

    return `${baseurl.url}?playerId=${playerId}`;
  };

  public static SignIn = (title?: string, bru?: string) => {
    const encodedBru = encodeURIComponent(bru);

    const resultBru =
      bru && title ? `?title=${title}&bru=${encodedBru}` : `?bru=${encodedBru}`;
    const resolved = BasicReactPath(
      RouteDefs.AreaGroups.User.areas.SignIn.getAction()
    )();
    resolved.url += bru ? `${resultBru}` : "";

    if (title && !bru) {
      resolved.url += `?title=${title}`;
    }

    return resolved;
  };

  public static Messages = (iframeMode = false) => {
    const messages = UrlUtils.GetUrlForLocale("/Messages");

    return messages + (iframeMode ? "?iframe=1" : "");
  };

  public static MarathonAlphaCodePickup = BasicReactPath(
    RouteDefs.Areas.Codes.getAction(RouteActions.GameCodes)
  );

  public static GetAccountLink = (
    cr: BungieCredentialType,
    stateIdentifier: number,
    flowStart: 0 | 1 = 1,
    force: 0 | 1 = 0
  ) =>
    LegacyPath(
      `/User/Link/${BungieCredentialType[cr]}/?flowStart=${flowStart}&force=${force}&stateIdentifier=${stateIdentifier}`
    );

  public static GetAccountUnlink = (
    cr: BungieCredentialType,
    stateIdentifier: number,
    flowStart: 0 | 1 = 1,
    force: 0 | 1 = 0
  ) =>
    LegacyPath(
      `/User/Unlink/${BungieCredentialType[cr]}/?flowStart=${flowStart}&force=${force}&stateIdentifier=${stateIdentifier}`
    );

  public static GetAccountAuthVerify = (
    cr: BungieCredentialType,
    stateIdentifier: number,
    resetAuth = false
  ) =>
    LegacyPath(
      `/User/VerifyAuth/${BungieCredentialType[cr]}/?flowStart=1&force=0&stateIdentifier=${stateIdentifier}&resetAuth=${resetAuth}`
    );

  public static GetReauthLink = (cr: BungieCredentialType) => {
    const stringCredValue = EnumUtils.getStringValue(cr, BungieCredentialType);

    return LegacyPath(`/User/Reauth/${stringCredValue}`);
  };

  public static CloseAuthWindow = () => {
    return LegacyPath(`/User/CloseJSWindow`);
  };

  public static SignInPreview = (cr: BungieCredentialType) => {
    const stringCredValue = EnumUtils.getStringValue(cr, BungieCredentialType);

    return LegacyPath(`/User/SignInAndPreview/${stringCredValue}`);
  };

  public static ResendEmailVerification = (mid: string) =>
    LegacyPath(`/Emails/ResendVerification?area=Emails&mid=${mid}`);

  public static GlobalAdminPage = (pageName: string, idOfItem?: string) => {
    return LegacyPath(`/Admin/${pageName}`);
  };

  public static Clan = (clanId: string) =>
    LegacyPath(`/ClanV2?groupid=${clanId}`);

  public static ClanChat = (clanId: string) =>
    LegacyPath(`/ClanV2/Chat?groupid=${clanId}`);

  public static Fireteam = (groupId: string, fireteamId: string) =>
    LegacyPath(
      `ClanV2/PublicFireteam?groupId=${groupId}&fireteamId=${fireteamId}`
    );

  public static Group = (groupId: string) =>
    LegacyPath(`/Groups/Chat?groupId=${groupId}`);

  public static GroupsPost = (groupId: string, postId: string) =>
    LegacyPath(`Groups/Post?groupId=${groupId}&postId=${postId}&sort=0&page=0`);

  public static CreationsDetail = (creationId: string) =>
    LegacyPath(`/Community/Detail?itemId=${creationId}`);

  public static HelpArticle = (articleId: number | string) => {
    return ZendeskHelpArticleUrl(articleId.toString());
  };

  public static HelpStep = (helpStepId: number) =>
    LegacyPath(`/Help/Troubleshoot?oid=${helpStepId}`);

  public static Sku = (sku: string, store: string, region: string) => {
    return LegacyPathWithQuery(`/Sku/${sku}/${store}/${region}`);
  };

  public static ExternalRelay = (relayName: string, params: any) =>
    LegacyPath(`/ExternalRelay/${relayName}?${UrlUtils.ObjectToQuery(params)}`);

  public static ExternalRelayBuyD2 = (version = "All", store?: string) =>
    RouteHelper.ExternalRelay("BuyD2", { version, store });

  public static DestinyItemDefinition = (itemHash: string) =>
    LegacyPath(`/Explore/Detail/DestinyInventoryItemDefinition/${itemHash}`);

  public static BeyondLight = (hash?: string) => {
    const resolved = BasicReactPath(
      RouteDefs.Areas.Destiny.getAction("BeyondLight")
    )();
    resolved.url += hash ? `#${hash}` : "";

    return resolved;
  };

  public static BeyondLightPhases = (phase: string) => {
    const resolved = BasicReactPath(
      RouteDefs.Areas.Destiny.getAction("BeyondLight")
    )();
    resolved.url += phase ? `/${phase}` : "";

    return resolved;
  };

  public static CodeRedemptionWithCode = (code: string) => {
    const baseurl = BasicReactPath(RouteDefs.Areas.Codes.getAction("Redeem"))();

    return `${baseurl.url}?token=${code}`;
  };

  public static Careers = (subPath = "") =>
    `https://careers.bungie.com/${subPath}`;

  public static ForumsTag = (tag: string) =>
    LegacyPath(`/Forum/Topics/0/?tg=${tag}`);

  public static Post = (postId: string) =>
    LegacyPath(`/Forums/Post/${postId}?sort=0&page=0`);

  public static BungieStore = (subPath = "") =>
    `https://bungiestore.com/${subPath}`;

  public static Foundation = (subPath = "") =>
    `https://bungiefoundation.org/${subPath}`;

  public static pressKitLocale = () => {
    switch (Localizer.CurrentCultureName) {
      case "ja":
        return "/ja-JP";
      case "ko":
        return "/ko-KR";
      case "zh-chs":
        return "/zh-CN";
      case "zh-cht":
        return "/zh-TW";
      default:
        return Localizer.CurrentCultureName !== "en"
          ? `/${Localizer.CurrentCultureName}`
          : "";
    }
  };

  public static PressKits = () =>
    ConfigUtils.GetParameter(
      "WebRenderer",
      "PressKitUrl",
      "https://press.bungie.com"
    ) + RouteHelper.pressKitLocale();

  public static ApplicationDetail = (appId: string) =>
    LegacyPath(`/Application/Detail/${appId}`);
}
