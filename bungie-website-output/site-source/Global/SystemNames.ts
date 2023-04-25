export type SystemNamesKeys = keyof typeof SystemNames;
export type ValidSystemNames = typeof SystemNames[SystemNamesKeys];

export const SystemNames = {
  AccountServices: "AccountServices",
  Applications: "Applications",
  Authentication: "Authentication",
  BeyondLightRevealYoutube: "BeyondLightRevealYoutube",
  BeyondLightGamePlayYoutube: "BeyondLightGamePlayYoutube",
  BeyondLightRevealStreamYoutube: "BeyondLightRevealStreamYoutube",
  BeyondLightVidocYoutube: "BeyondLightVidocYoutube",
  BeyondLightPhase1: "BeyondLightPhase1",
  BeyondLightPhase2: "BeyondLightPhase2",
  BeyondLightPhase3: "BeyondLightPhase3",
  BeyondLightPhase4: "BeyondLightPhase4",
  BeyondLightPhase5: "BeyondLightPhase5",
  BuyFlow: "BuyFlow",
  BungieAnalytics: "BungieAnalytics",
  BungieFriends: "BungieFriends",
  BungieTokens: "BungieTokens",
  Clans: "Clans",
  CodeRedemptionReact: "CodeRedemptionReact",
  CompanionFeaturePage: "CompanionFeaturePage",
  CoreAreaSeasons: "CoreAreaSeasons",
  CoreDestinyBuy: "CoreDestinyBuy",
  CoreHomeandNews: "CoreHomeandNews",
  CrossSave: "CrossSave",
  CrossSaveStadiaException: "CrossSaveStadiaSeasonsException",
  Destiny2: "Destiny2",
  FacebookPixel: "FacebookPixel",
  Forums: "Forums",
  GamescomVideo: "GamescomVideo",
  GoogleAnalytics: "GoogleAnalytics",
  Groups: "Groups",
  Localizer: "Localizer",
  LocalizerDebug: "LocalizerDebug",
  LunaVideo: "LunaVideo",
  shadowKeepRevealTrailerVideo: "shadowKeepRevealTrailerVideo",
  Messages: "Messages",
  Notifications: "Notifications",
  PartnerOfferClaims: "PartnerOfferClaims",
  PlayTestsSetting: "PlayTestsSetting",
  SeasonUndyingVideo: "SeasonUndyingVideo",
  PSNAuth: "PSNAuth",
  XuidAuth: "XuidAuth",
  Twitch: "Twitch",
  Blizzard: "Blizzard",
  SteamIdAuth: "SteamIdAuth",
  StadiaIdAuth: "StadiaIdAuth",
  StrangerEditionForSale: "StrangerEditionForSale",
  Season10GoLive: "Season10GoLive",
  Season11Page: "Season11Page",
  Season13Page: "Season13Page",
  StadiaLimited: "StadiaLimited",
  RealTimeCounts: "RealTimeCounts",
  SessionTracking: "SessionTracking",
  DestinyMarketingPages: "DestinyMarketingPages",
  CookieConsent: "CookieConsent",
  PrivacyAuthCheck: "PrivacyAuthCheck",
  RegistrationBenefitsContentVersion2: "RegistrationBenefitsContentVersion2",
  RegistrationBenefitsEnabled: "RegistrationBenefitsEnabled",
  RegistrationUI: "RegistrationUI",
  RegistrationNavVersion2: "RegistrationNavVersion2",
  SignInLearnMore: "SignInLearnMore",
  WebRendererCore: "WebRendererCore",
  RegistrationUpsellContentVersion2: "RegistrationUpsellContentVersion2",
  DestinyArg: "DestinyArg",
  BuyFlowGetStartedContent: "BuyFlowGetStartedContent",
  SmsVerification: "SmsVerification",
  DirectWorldsFirst: "DirectWorldsFirst",
  SeasonHuntYoutube: "SeasonHuntYoutube",
  SeasonHuntSeasonPassYoutube: "SeasonHuntSeasonPassYoutube",
  LegendaryEditionEnabled: "LegendaryEditionEnabled",
  GoogleRecaptcha: "GoogleRecaptcha",
  SeasonHuntHawkmoonTrailer: "SeasonHuntHawkmoonTrailer",
  SmsResendCodeRecaptcha: "SmsResendCodeRecaptcha",
  ProvingGroupsTrailer: "ProvingGroupsTrailer",
  FacebookUrlByLocale: "FacebookUrlByLocale",
  TwitterUrlByLocale: "TwitterUrlByLocale",
  InstagramUrlByLocale: "InstagramUrlByLocale",
  ContentStack: "ContentStack",
  LegalContentStackPages: "LegalContentStackPages",
  ContentStackFetchReverseProxy: "ContentStackFetchReverseProxy",
  Season14PageUpdate: "Season14PageUpdate",
  Season14Page: "Season14Page",
  SeasonsFAQUrlByLocale: "SeasonsFAQUrlByLocale",
  Season14HelpArticleUrlByLocale: "Season14HelpArticleUrlByLocale",
  WebRenderer: "WebRenderer",
  MagentoStore: "MagentoStore",
  ZendeskHelpArticleUrl: "ZendeskHelpArticleUrl",
  ZendeskArticleLocales: "ZendeskArticleLocales",
  DestinyShowcase: "DestinyShowcase",
  EmbeddedTwitchStreams: "EmbeddedTwitchStreams",
  Season15Page: "Season15Page",
  Season15HelpArticleUrlByLocale: "Season15HelpArticleUrlByLocale",
  WitchQueen: "WitchQueen",
  CrossSaveMSHelp: "CrossSaveMSHelp",
  PlatformFriendImporter: "PlatformFriendImporter",
  PlatformFriendBulkImporter: "PlatformFriendBulkImporter",
  AllowGlobalBungieDisplayNameEditing: "AllowGlobalBungieDisplayNameEditing",
  CrossSaveEntitlementTables: "CrossSaveEntitlementTables",
  UseGlobalBungieDisplayNames: "UseGlobalBungieDisplayNames",
  WorldsFirstStream: "WorldsFirstStream",
  CoreHomeAndNews: "CoreHomeAndNews",
  Tools: "Tools",
  D2Rewards: "D2Rewards",
  D2RewardsStoreMigration: "D2RewardsStoreMigration",
  StoreMigrationHelpArticleByLocale: "StoreMigrationHelpArticleByLocale",
  D2RewardsHelpArticleFirehoseId: "D2RewardsHelpArticleFirehoseId",
  D2RewardsReact: "D2RewardsReact",
  CoreUserHistories: "CoreUserHistories",
  CoreAreaGameHistory: "CoreAreaGameHistory",
  DestinyClanSearch: "DestinyClanSearch",
  EpicIdAuth: "EpicIdAuth",
  ExactMatchClanSearchOnly: "ExactMatchClanSearchOnly",
  CoreAreaCollections: "CoreAreaCollections",
  CoreAreaTriumphs: "CoreAreaTriumphs",
  ContentstackGlobalAlerts: "ContentstackGlobalAlerts",
  FirehoseNewsMigrator: "FirehoseNewsMigrator",
  DirectVideoCS: "DirectVideoCS",
  StadiaSunsetAlerts: "StadiaSunsetAlerts",
  Fireteams: "ClanFireteams",
  ReactFireteamUI: "ReactFireteamUI",
  ClanReactUI: "ClanReactUI",
} as const;
