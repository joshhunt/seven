// Auto generated code based on B.net Service Interfaces.  Do not edit manually.

import { ApiIntermediary } from "@ApiIntermediary";
import * as Globals from "@Enum";

const e = (param: any) => encodeURIComponent(String(param));

const getParamString = (params: [string, any][]): string => {
  const paramString = params.map((kvp) => kvp.join("=")).join("&");

  return `&${paramString}`;
};

type EnumStrings<K> = keyof K & string;
type EnumVals<K> = K[keyof K] & (number | string);

export declare namespace User {
  export interface GeneralUser {
    membershipId: string;

    uniqueName: string;

    normalizedName: string;

    displayName: string;

    profilePicture: number;

    profileTheme: number;

    userTitle: number;

    successMessageFlags: string;

    isDeleted: boolean;

    about: string;

    firstAccess?: string;

    lastUpdate?: string;

    legacyPortalUID?: string;

    context: User.UserToUserContext;

    psnDisplayName: string;

    xboxDisplayName: string;

    fbDisplayName: string;

    showActivity?: boolean;

    locale: string;

    localeInheritDefault: boolean;

    lastBanReportId?: string;

    showGroupMessaging: boolean;

    profilePicturePath: string;

    profilePictureWidePath: string;

    profileThemeName: string;

    userTitleDisplay: string;

    statusText: string;

    statusDate: string;

    profileBanExpire?: string;

    blizzardDisplayName: string;

    steamDisplayName: string;

    stadiaDisplayName: string;

    twitchDisplayName: string;

    cachedBungieGlobalDisplayName: string;

    cachedBungieGlobalDisplayNameCode?: number;

    egsDisplayName: string;
  }

  export interface UserToUserContext {
    isFollowing: boolean;

    ignoreStatus: Ignores.IgnoreResponse;

    globalIgnoreEndDate?: string;
  }

  /**
	This contract supplies basic information commonly used to display a minimal amount of information about 
	a user.  Take care to not add more properties here unless the property applies in all (or at least the majority) of the 
	situations where UserInfoCard is used.  Avoid adding game specific or platform specific details here. In cases
	where UserInfoCard is a subset of the data needed in a contract, use UserInfoCard as a property of other contracts.
	*/
  export interface UserInfoCard {
    /**
		A platform specific additional display name - ex: psn Real Name, bnet Unique Name, etc.
		*/
    supplementalDisplayName: string;

    /**
		URL the Icon if available.
		*/
    iconPath: string;

    crossSaveOverride: Globals.BungieMembershipType;

    applicableMembershipTypes: Globals.BungieMembershipType[];

    isPublic: boolean;

    membershipType: Globals.BungieMembershipType;

    membershipId: string;

    displayName: string;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }

  export interface UserAuthContextResponse {
    MembershipId: string;

    DeviceType: Globals.ClientDeviceType;

    AuthProvider: Globals.BungieCredentialType;

    Scope: Globals.ApplicationScopes;

    IsOAuth: boolean;
  }

  export interface UserNameEditRequest {
    displayName: string;
  }

  export interface UserNameEditResponse {
    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }

  export interface UserEmailVerificationResponse {
    EmailValidationStatusCode: number;

    Title: string;

    Message: string;
  }

  export interface UserEmailVerificationRequest {
    tokenGuid: string;
  }

  export interface DestinyEmblemSourceRequest {
    MembershipType: Globals.BungieMembershipType;

    DestinyMembershipId: string;

    DestinyCharacterId: string;
  }

  export interface AckState {
    /**
		Indicates the related item has not been acknowledged.
		*/
    needsAck: boolean;

    /**
		Identifier to use when acknowledging the related item.
		[category]:[entityId]:[targetId]
		*/
    ackId: string;
  }

  export interface NotificationSetting {
    notificationSettingId: string;

    membershipId: string;

    optInFlags: string;

    scheduleFlags: number;

    notificationMethod: string;

    notificationType: string;

    displayName: string;

    settingDescription: string;

    possibleMethods: Globals.NotificationMethods;

    grouping: Globals.NotificationGrouping;
  }

  export interface MobileAppPairing {
    ApnLocale: string;

    ApnToken: number[];

    AppInstallationId: string;

    AppType: string;

    C2dmRegistrationId: string;

    DeviceName: string;

    DeviceType: Globals.ClientDeviceType;

    MembershipId: string;

    MembershipType: Globals.BungieMembershipType;

    PairId: string;

    PairingDate: string;
  }

  export interface UserMembershipData {
    /**
		this allows you to see destiny memberships that are visible and linked to this account 
		(regardless of whether or not they have characters on the world server)
		*/
    destinyMemberships: GroupsV2.GroupUserInfoCard[];

    /**
		If this property is populated, it will have the membership ID of the account considered to be "primary"
		 in this user's cross save relationship.
		
		 If null, this user has no cross save relationship, nor primary account.
		*/
    primaryMembershipId?: string;

    bungieNetUser: User.GeneralUser;
  }

  export interface BlizzardToSteamMigrationStatusResponse {
    MigrationTransferStatus: Globals.PlatformErrorCodes;

    SourceBlizzardUniqueDisplayName: string;

    DestinationSteamDisplayName: string;

    DestinationSteamId: string;

    CallerIsLinkedToSourceAndDestinationCredential: boolean;

    MigrationStarted: boolean;

    MigrationFirstAttempt?: string;

    MigrationComplete: boolean;

    DestinationSteamMembershipId?: string;

    SourceBlizzardMembershipId?: string;

    CharacterMigratedDate?: string;

    EntitlementMigratedDate?: string;

    SilverMigratedDate?: string;

    SeasonPassMigratedDate?: string;
  }

  export interface HardLinkedUserMembership {
    membershipType: Globals.BungieMembershipType;

    membershipId: string;

    CrossSaveOverriddenType: Globals.BungieMembershipType;

    CrossSaveOverriddenMembershipId?: string;
  }

  export interface UserPhoneResponse {
    /**
		This is the phase of the SMS verification flow that a user is in
		*/
    phoneStatus: Globals.PhoneValidationStatusEnum;

    /**
		These are the last two digits of the phone number a user has requested a code be sent to
		 In order to link that number to their account
		
		 Or the last two digits of the phone number that is connected to their account
		*/
    lastDigits: string;
  }

  export interface UserSearchResponse {
    searchResults: User.UserSearchResponseDetail[];

    page: number;

    hasMore: boolean;
  }

  export interface UserSearchResponseDetail {
    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;

    bungieNetMembershipId?: string;

    destinyMemberships: User.UserInfoCard[];
  }

  export interface UserSearchPrefixRequest {
    displayNamePrefix: string;
  }

  export interface SetParentalControlFlagsRequest {
    TargetChildBungieId?: string;

    TargetChildMembershipId?: string;

    TargetChildMembershipType?: Globals.BungieMembershipType;

    UnsetParentalControls: boolean;

    ParentalControlFlags: Globals.BungieAgeGateFeatures;
  }

  export interface ParentalControlsIdRequest {
    InputIdentifier: string;
  }

  /**
	Very basic info about a user as returned by the Account server.
	*/
  export interface UserMembership {
    /**
		Type of the membership.  Not necessarily the native type.
		*/
    membershipType: Globals.BungieMembershipType;

    /**
		Membership ID as they user is known in the Accounts service
		*/
    membershipId: string;

    /**
		Display Name the player has chosen for themselves. The display name is optional when
		the data type is used as input to a platform API.
		*/
    displayName: string;

    /**
		The bungie global display name, if set.
		*/
    bungieGlobalDisplayName: string;

    /**
		The bungie global display name code, if set.
		*/
    bungieGlobalDisplayNameCode?: number;
  }

  export interface UserBanState {
    membershipId: string;

    bnetProfileBanExpireDate?: string;

    isProfileBanned: boolean;

    isForumBanned: boolean;

    bnetBanExpireDate?: string;

    psnBanExpireDate?: string;

    xblBanExpireDate?: string;

    demonBanExpireDate?: string;

    blizzardBanExpireDate?: string;

    steamBanExpireDate?: string;

    stadiaBanExpireDate?: string;

    epicBanExpireDate?: string;

    isMsgBanned: boolean;

    bnetMessageBanExpireDate?: string;

    psnMessageBanExpireDate?: string;

    xblMessageBanExpireDate?: string;

    demonMessageBanExpireDate?: string;

    blizzardMessageBanExpireDate?: string;

    steamMessageBanExpireDate?: string;

    stadiaMessageBanExpireDate?: string;

    epicMessageBanExpireDate?: string;

    isGroupWallBanned: boolean;

    bnetGroupWallBanExpireDate?: string;

    psnGroupWallBanExpireDate?: string;

    xblGroupWallBanExpireDate?: string;

    demonGroupWallBanExpireDate?: string;

    blizzardGroupWallBanExpireDate?: string;

    steamGroupWallBanExpireDate?: string;

    stadiaGroupWallBanExpireDate?: string;

    epicGroupWallBanExpireDate?: string;

    isFireteamBanned: boolean;

    psnFireteamBanExpireDate?: string;

    xboxFireteamBanExpireDate?: string;

    blizzardFireteamBanExpireDate?: string;

    steamFireteamBanExpireDate?: string;

    stadiaFireteamBanExpireDate?: string;

    epicFireteamBanExpireDate?: string;
  }

  export interface ExactSearchRequest {
    displayName: string;

    displayNameCode: number;
  }

  export interface IAnonymousIdentifier {
    Source: Globals.AnonymousIdentifierSource;

    Seed: string;

    Identifier: string;
  }

  /**
	The set of all email subscription/opt-in settings and definitions.
	*/
  export interface EmailSettings {
    /**
		Keyed by the name identifier of the opt-in definition.
		*/
    optInDefinitions: { [key: string]: User.EmailOptInDefinition };

    /**
		Keyed by the name identifier of the Subscription definition.
		*/
    subscriptionDefinitions: {
      [key: string]: User.EmailSubscriptionDefinition;
    };

    /**
		Keyed by the name identifier of the View definition.
		*/
    views: { [key: string]: User.EmailViewDefinition };
  }

  /**
	Defines a single opt-in category: a wide-scoped permission to send emails for the subject related to the opt-in.
	*/
  export interface EmailOptInDefinition {
    /**
		The unique identifier for this opt-in category.
		*/
    name: string;

    /**
		The flag value for this opt-in category.  For historical reasons, this is defined as a flags enum.
		*/
    value: Globals.OptInFlags;

    /**
		If true, this opt-in setting should be set by default in situations where accounts are created without
		explicit choices about what they're opting into.
		*/
    setByDefault: boolean;

    /**
		Information about the dependent subscriptions for this opt-in.
		*/
    dependentSubscriptions: User.EmailSubscriptionDefinition[];
  }

  /**
	Defines a single subscription: permission to send emails for a specific, focused subject (generally timeboxed, such as
	for a specific release of a product or feature).
	*/
  export interface EmailSubscriptionDefinition {
    /**
		The unique identifier for this subscription.
		*/
    name: string;

    /**
		A dictionary of localized text for the EMail Opt-in setting, keyed by the locale.
		*/
    localization: { [key: string]: User.EMailSettingSubscriptionLocalization };

    /**
		The bitflag value for this subscription.  Should be a unique power of two value.
		*/
    value: string;
  }

  /**
	Localized text relevant to a given EMail setting in a given localization.
	Extra settings specifically for subscriptions.
	*/
  export interface EMailSettingSubscriptionLocalization {
    unknownUserDescription: string;

    registeredUserDescription: string;

    unregisteredUserDescription: string;

    unknownUserActionText: string;

    knownUserActionText: string;

    title: string;

    description: string;
  }

  /**
	Represents a data-driven view for Email settings.  Web/Mobile UI can use this data to show
	new EMail settings consistently without further manual work.
	*/
  export interface EmailViewDefinition {
    /**
		The identifier for this view.
		*/
    name: string;

    /**
		The ordered list of settings to show in this view.
		*/
    viewSettings: User.EmailViewDefinitionSetting[];
  }

  export interface EmailViewDefinitionSetting {
    /**
		The identifier for this UI Setting, which can be used to relate it to custom strings or other data as desired.
		*/
    name: string;

    /**
		A dictionary of localized text for the EMail setting, keyed by the locale.
		*/
    localization: { [key: string]: User.EMailSettingLocalization };

    /**
		If true, this setting should be set by default if the user hasn't chosen whether it's set or cleared yet.
		*/
    setByDefault: boolean;

    /**
		The OptInFlags value to set or clear if this setting is set or cleared in the UI.  It is the aggregate
		of all underlying opt-in flags related to this setting.
		*/
    optInAggregateValue: Globals.OptInFlags;

    /**
		The subscriptions to show as children of this setting, if any.
		*/
    subscriptions: User.EmailSubscriptionDefinition[];
  }

  /**
	Localized text relevant to a given EMail setting in a given localization.
	*/
  export interface EMailSettingLocalization {
    title: string;

    description: string;
  }
}

export declare namespace Ignores {
  export interface IgnoreResponse {
    isIgnored: boolean;

    ignoreFlags: Globals.IgnoreStatus;
  }

  export interface IgnoredPlayer {
    membershipId: string;

    bungieName: string;

    bungieNameCode?: number;

    dateBlocked: string;
  }

  export interface ReportContextResponse {
    reportId: string;

    contextItemId: string;

    contextItemType: Globals.IgnoredItemType;

    subject: string;

    body: string;

    urlLinkOrImage: string;

    tags: string[];

    author: User.GeneralUser;
  }
}

export declare namespace Applications {
  export interface ApplicationCredentials {
    /**
		This token is use on the Authorization header in requests to the Bungie.net APIs.
		*/
    accessToken: Applications.Token;

    /**
		This token can be traded for a fresh pair of access and refresh tokens.
		*/
    refreshToken: Applications.Token;

    /**
		Scope granted to the application.
		*/
    scope: Globals.ApplicationScopes;

    /**
		Bungie.net Membership ID of the authenticated user.
		*/
    membershipId: string;
  }

  export interface Token {
    /**
		Token value
		*/
    value: string;

    /**
		Number of seconds before the provide token can be used.
		*/
    readyin: number;

    /**
		Number of seconds before token expires.
		*/
    expires: number;
  }

  export interface RequestWithCode {
    /**
		This authorization code the application was given in the redirect URL.
		*/
    code: string;
  }

  export interface RequestWithRefreshToken {
    /**
		This refresh token the application was given in a previous authorization request.
		*/
    refreshToken: string;
  }

  export interface CreateApplicationAction {
    /**
		Name of the application
		*/
    name: string;

    /**
		URL used to pass the user's authorization code to the application
		*/
    redirectUrl: string;

    /**
		Link to website for the application where a user can learn more about the app.
		*/
    link: string;

    /**
		Permissions the application needs to work
		*/
    scope: string;

    /**
		Value of the Origin header sent in requests generated by this application.
		*/
    origin: string;

    /**
		Indicates the user agreed with the current EULA.
		*/
    agreedToCurrentEula: boolean;

    applicationType: Globals.OAuthApplicationType;
  }

  export interface Application {
    applicationType: Globals.OAuthApplicationType;

    /**
		Unique ID assigned to the application
		*/
    applicationId: number;

    /**
		Name of the application
		*/
    name: string;

    /**
		URL used to pass the user's authorization code to the application
		*/
    redirectUrl: string;

    /**
		Link to website for the application where a user can learn more about the app.
		*/
    link: string;

    /**
		Permissions the application needs to work
		*/
    scope: string;

    /**
		Value of the Origin header sent in requests generated by this application.
		*/
    origin: string;

    /**
		Current status of the application.
		*/
    status: Globals.ApplicationStatus;

    /**
		Date the application was first added to our database.
		*/
    creationDate: string;

    /**
		Date the application status last changed.
		*/
    statusChanged: string;

    /**
		Date the first time the application status entered the 'Public' status.
		*/
    firstPublished: string;

    /**
		List of team members who manage this application on Bungie.net.  Will always consist of at least
		the application owner.
		*/
    team: Applications.ApplicationDeveloper[];

    /**
		An optional override for the Authorize view name.
		*/
    overrideAuthorizeViewName: string;
  }

  export interface ApplicationDeveloper {
    role: Globals.DeveloperRole;

    apiEulaVersion: number;

    user: User.UserInfoCard;
  }

  export interface EditApplicationAction {
    /**
		Name of the application
		*/
    name: string;

    /**
		URL used to pass the user's authorization code to the application
		*/
    redirectUrl: string;

    /**
		Link to website for the application where a user can learn more about the app.
		*/
    link: string;

    /**
		Permissions the application needs to work
		*/
    scope?: string;

    /**
		Value of the Origin header sent in requests generated by this application.
		*/
    origin: string;

    /**
		Change the status of the application
		*/
    status?: Globals.ApplicationStatus;

    applicationType?: Globals.OAuthApplicationType;
  }

  export interface ApplicationApiKey {
    /**
		Integer ID of the API key.
		*/
    apiKeyId: number;

    /**
		Value of the key to use on the wire.
		*/
    apiKey: string;

    /**
		Client secret used for OAuth token endpoint
		*/
    clientSecret: string;

    authorizationUrl: string;

    /**
		Date the key was generated.
		*/
    creationDate: string;

    /**
		Status of the key.
		*/
    status: Globals.ApiKeyStatus;
  }

  export interface ApiUsage {
    /**
		Counts for on API calls made for the time range.
		*/
    apiCalls: Applications.Series[];

    /**
		Instances of blocked requests or requests that crossed the warn threshold
		during the time range.
		*/
    throttledRequests: Applications.Series[];
  }

  export interface Series {
    /**
		Collection of samples with time and value.
		*/
    datapoints: Applications.Datapoint[];

    /**
		Target to which to datapoints apply.
		*/
    target: string;
  }

  export interface Datapoint {
    /**
		Timestamp for the related count.
		*/
    time: string;

    /**
		Count associated with timestamp
		*/
    count?: number;
  }

  export interface Authorization {
    /**
		Unique ID assigned to the application
		*/
    applicationId: number;

    /**
		Name of the application
		*/
    name: string;

    /**
		URL used to pass the user's authorization code to the application
		*/
    redirectUrl: string;

    /**
		Link to website for the application where a user can learn more about the app.
		*/
    link: string;

    /**
		Scope granted by the user.
		*/
    scope: string;

    /**
		Value of the Origin header sent in requests generated by this application.
		*/
    origin: string;

    /**
		Current status of the application.
		*/
    applicationStatus: Globals.ApplicationStatus;

    /**
		Bungie.net membership ID for which the application is authorized.
		*/
    membershipId: string;

    /**
		Status of the authorization
		*/
    authorizationStatus: Globals.AuthorizationStatus;

    /**
		Date that the authorization expires.
		*/
    authExpirationDate: string;

    /**
		Date that the authorization was established.
		*/
    authorizationDate: string;

    /**
		Session ID assigned to the authorization.
		*/
    sessionId: string;
  }

  export interface ApplicationQuery {
    name: string;

    ownerMembershipId: string;

    itemsPerPage: number;

    currentPage: number;

    requestContinuationToken: string;
  }

  export interface OAuthTokenResponse {
    accessToken: string;

    tokenType: string;

    accessTokenExpiresIn: number;

    refreshToken: string;

    refreshTokenExpiresIn: number;

    membershipId: string;

    error: string;

    errorDescription: string;
  }

  export interface OAuthClientCredentialTokenResponse {
    accessToken: string;

    tokenType: string;

    accessTokenExpiresIn: number;

    refreshToken: string;

    error: string;

    errorDescription: string;
  }

  export interface ApplicationSummary {
    /**
		Unique ID assigned to the application
		*/
    applicationId: number;

    /**
		Name of the application
		*/
    name: string;

    /**
		Link provided by the app developer
		*/
    link: string;
  }
}

export declare namespace Dates {
  export interface DateRange {
    start: string;

    end: string;
  }
}

export declare namespace Queries {
  export interface SearchResultAuthorization {
    results: Applications.Authorization[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface PagedQuery {
    itemsPerPage: number;

    currentPage: number;

    requestContinuationToken: string;
  }

  export interface SearchResultApplication {
    results: Applications.Application[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultGeneralUser {
    results: User.GeneralUser[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultContentItemPublicContract {
    results: Content.ContentItemPublicContract[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultLegacyFollowingResponse {
    results: Contract.LegacyFollowingResponse[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultFollowerResponse {
    results: Followers.FollowerResponse[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultDestinyItemActivityRecord {
    results: Activities.DestinyItemActivityRecord[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultGroupMember {
    results: GroupsV2.GroupMember[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultGroupBan {
    results: GroupsV2.GroupBan[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultGroupEditHistory {
    results: GroupsV2.GroupEditHistory[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultGroupMemberApplication {
    results: GroupsV2.GroupMemberApplication[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultReportedItemResponse {
    results: Contracts.ReportedItemResponse[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultTokenSupportClaimEntry {
    results: Tokens.TokenSupportClaimEntry[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultEververseChangeEvent {
    results: Tokens.EververseChangeEvent[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultEververseVendorPurchaseEvent {
    results: Tokens.EververseVendorPurchaseEvent[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultDestinyEntitySearchResultItem {
    results: Definitions.DestinyEntitySearchResultItem[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultTrendingEntry {
    results: Trending.TrendingEntry[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultFireteamSummary {
    results: Fireteam.FireteamSummary[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SearchResultFireteamResponse {
    results: Fireteam.FireteamResponse[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }
}

export declare namespace Contract {
  export interface UserDetail {
    user: User.GeneralUser;

    email: string;

    emailStatus: number;

    emailUsage: string;

    emailSubscriptions: string;

    realName: string;

    gamerTag: string;

    psnId: string;

    facebookName: string;

    blizzardDisplayName: string;

    steamDisplayName: string;

    stadiaDisplayName: string;

    twitchDisplayName: string;

    egsDisplayName: string;

    userAcls: Globals.AclEnum[];

    showGamertagPublic: boolean;

    showFacebookPublic: boolean;

    showPsnPublic: boolean;

    showBlizzardPublic: boolean;

    showSteamPublic: boolean;

    showStadiaPublic: boolean;

    showTwitchPublic: boolean;

    showEgsPublic: boolean;

    publicCredentialTypes: Globals.BungieCredentialType[];

    crossSaveCredentialTypes: Globals.BungieCredentialType[];

    isThemeLight: boolean;

    adultMode: boolean;

    userResearchStatusFlags: string;

    lastViewedConversations?: string;

    privacy: Globals.BNetAccountPrivacy;

    hideDestinyData: boolean;

    destinyEmblemMembershipType?: Globals.BungieMembershipType;

    destinyEmblemMembershipId?: string;

    destinyEmblemCharacterId?: string;

    pmToastsEnabled: boolean;

    privacyVersion: number;

    rejectAllFriendRequests: boolean;

    isUltrabanned: boolean;

    birthDate?: string;

    countryOfResidence: string;

    adminBirthDateChanges: number;

    adminCountryChanges: number;
  }

  export interface CreateBungieProfileRequest {
    email: string;

    emailUsage?: string;

    credentialPublic: boolean;

    termsAccepted: boolean;

    authProviderType: Globals.BungieCredentialType;

    locale: string;

    offer: string;

    emailSubscriptions?: string;

    birthDate: string;

    countryOfResidence: string;
  }

  export interface CreateEmailUserRequest {
    email: string;

    termsAccepted: boolean;

    locale: string;

    /**
		The flags enumeration value of subscriptions that the user wished to sign up for, if any.
		*/
    emailSubscriptions: string;
  }

  export interface UserEditRequest {
    membershipId: string;

    displayName: string;

    profilePicture?: number;

    userTitle?: number;

    about: string;

    emailUsage?: string;

    addedOptIns?: string;

    removedOptIns?: string;

    addedSubscriptions?: string;

    removedSubscriptions?: string;

    emailAddress: string;

    showActivity?: boolean;

    profileTheme?: number;

    locale: string;

    localeInheritDefault?: boolean;

    showGroupMessaging?: boolean;

    hideDestinyData?: boolean;

    statusText: string;

    privacyFlags?: Globals.BNetAccountPrivacy;

    pmToastsEnabled?: boolean;

    rejectAllFriendRequests?: boolean;

    showGamertagPublic?: boolean;

    showFacebookPublic?: boolean;

    showPsnPublic?: boolean;

    showBlizzardDisplayNamePublic?: boolean;

    showSteamDisplayNamePublic?: boolean;

    showStadiaDisplayNamePublic?: boolean;

    showTwitchDisplayNamePublic?: boolean;

    showEgsDisplayNamePublic?: boolean;

    adultMode?: boolean;

    isThemeLight?: boolean;
  }

  export interface UserBirthdayAndCountryResponse {
    birthday?: string;

    country: string;

    isChild: boolean;

    adminBirthDateChanges: number;

    adminCountryChanges: number;
  }

  export interface UserBirthdayOrCountryEditRequest {
    birthday: string;

    country: string;
  }

  export interface UserCounts {
    notificationCount: number;

    messageCount: number;

    groupMessageCounts: Contracts.GroupItemCount[];

    providersNeedingReauth: Globals.BungieCredentialType[];

    lastUpdated: string;

    acks: Contract.Acknowlegements;

    reportCount?: number;
  }

  export interface Acknowlegements {
    triumphs: User.AckState;

    gearManager: User.AckState;
  }

  export interface ForumUser {
    userId: string;

    email: string;

    displayName: string;

    uniqueName: string;

    profilePicturePath: string;
  }

  export interface GetCredentialTypesForAccountResponse {
    credentialType: Globals.BungieCredentialType;

    credentialDisplayName: string;

    isPublic: boolean;

    credentialAsString: string;
  }

  export interface LinkOverrideInput {
    crType: Globals.BungieCredentialType;

    Credential: string;

    DisplayName: string;
  }

  export interface ExternalMessage {
    dateCreated: string;

    message: string;

    service: Globals.ExternalService;

    extendedData: { [key: string]: string };
  }

  export interface PostLocation {
    parentPostId?: string;

    tagCategory: string;

    groupId?: string;

    isGroupPrivate?: boolean;

    subTopicOverride: boolean;
  }

  export interface PostResponse {
    lastReplyTimestamp: string;

    IsPinned: boolean;

    urlMediaType: Globals.ForumMediaType;

    thumbnail: string;

    popularity: Globals.ForumPostPopularity;

    isActive: boolean;

    isAnnouncement: boolean;

    userRating: number;

    userHasRated: boolean;

    userHasMutedPost: boolean;

    latestReplyPostId: string;

    latestReplyAuthorId: string;

    ignoreStatus: Ignores.IgnoreResponse;

    locale: string;

    postId: string;

    parentPostId?: string;

    topicId?: string;

    lastReplyId?: string;

    threadDepth: number;

    category: Globals.ForumPostCategoryEnums;

    authorMembershipId: string;

    editorMembershipId?: string;

    subject: string;

    body: string;

    urlLinkOrImage: string;

    metadata: any;

    creationDate: string;

    lastModified: string;

    lastReplyDate?: string;

    editCount: number;

    replyCount: number;

    topicReplyCount: number;

    ratingCount: number;

    rating: number;

    upvotes: number;

    downvotes: number;

    ratingScore: number;

    groupOwnerId?: string;

    isGroupPrivate: boolean;

    parentGroupId?: string;

    parentTopicId?: string;

    flags: Globals.ForumFlagsEnum;

    lockedForReplies: boolean;

    parentAuthorId: string;

    topicAuthorId: string;

    tags: string[];

    isTopicBanned: boolean;

    actualParentPostId?: string;

    playerSupportFlags?: number;

    playerSupportMetadata: string;

    pinned: number;

    awaitingApproval: boolean;

    forumId?: number;

    archivedLastReplyDate?: string;
  }

  export interface CreatePostRequest {
    subject: string;

    body: string;

    tagInput: string;

    category: Globals.ForumPostCategoryEnums;

    urlLinkOrImage: string;

    metadata: any;

    playerSupportFlags: number;

    playerSupportMetadata: string;

    recruitMicrophoneRequired?: boolean;

    recruitIntensity?: Globals.ForumRecruitmentIntensityLabel;

    recruitTone?: Globals.ForumRecruitmentToneLabel;

    recruitSlots?: number;

    locale: string;

    parentPostId?: string;

    tagCategory: string;

    groupId?: string;

    isGroupPrivate?: boolean;

    subTopicOverride: boolean;
  }

  export interface CreateContentCommentRequest {
    contentId: string;

    subject: string;

    body: string;

    tagInput: string;

    category: Globals.ForumPostCategoryEnums;

    urlLinkOrImage: string;

    metadata: any;

    playerSupportFlags: number;

    playerSupportMetadata: string;

    recruitMicrophoneRequired?: boolean;

    recruitIntensity?: Globals.ForumRecruitmentIntensityLabel;

    recruitTone?: Globals.ForumRecruitmentToneLabel;

    recruitSlots?: number;

    locale: string;

    parentPostId?: string;

    tagCategory: string;

    groupId?: string;

    isGroupPrivate?: boolean;

    subTopicOverride: boolean;
  }

  export interface EditPostRequest {
    subject: string;

    body: string;

    tagInput: string;

    tagCategory: string;

    urlLinkOrImage: string;

    metadata: any;

    category?: Globals.ForumPostCategoryEnums;

    disableBits?: Globals.ForumPostCategoryEnums;

    isGroupPostPrivate?: boolean;

    playerSupportFlags?: number;

    playerSupportMetadata: string;

    locale: string;
  }

  export interface PostSearchResponse {
    relatedPosts: Contract.PostResponse[];

    authors: User.GeneralUser[];

    groups: GroupsV2.GroupResponse[];

    searchedTags: Contracts.TagResponse[];

    polls: Contract.PollResponse[];

    recruitmentDetails: Contract.ForumRecruitmentDetail[];

    availablePages?: number;

    results: Contract.PostResponse[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface PollResponse {
    topicId: string;

    results: Contract.PollResult[];

    totalVotes: number;
  }

  export interface PollResult {
    answerText: string;

    answerSlot: number;

    lastVoteDate: string;

    votes: number;

    requestingUserVoted: boolean;
  }

  export interface ForumRecruitmentDetail {
    topicId: string;

    microphoneRequired: boolean;

    intensity: Globals.ForumRecruitmentIntensityLabel;

    tone: Globals.ForumRecruitmentToneLabel;

    approved: boolean;

    conversationId?: string;

    playerSlotsTotal: number;

    playerSlotsRemaining: number;

    Fireteam: User.GeneralUser[];

    kickedPlayerIds: string[];
  }

  export interface LegacyFollowingResponse {
    detail: Followers.FollowingDecorations;

    following: Followers.LegacyFollowing;
  }

  export interface Post {
    downvotes: number;

    ratingScore: number;

    isAnnouncement: boolean;

    locale: string;

    popularity: string;

    postId: string;

    parentPostId?: string;

    topicId?: string;

    lastReplyId?: string;

    threadDepth: number;

    category: Globals.ForumPostCategoryEnums;

    authorMembershipId: string;

    editorMembershipId?: string;

    subject: string;

    body: string;

    urlLinkOrImage: string;

    metadata: any;

    flags: Globals.ForumFlagsEnum;

    creationDate: string;

    lastModified: string;

    lastReplyDate?: string;

    editCount: number;

    replyCount: number;

    topicReplyCount: number;

    ratingCount: number;

    rating: number;

    upvotes: number;

    pinned: number;

    forumId?: number;

    groupOwnerId?: string;

    isGroupPrivate: boolean;

    parentGroupId?: string;

    parentTopicId?: string;

    lockedForReplies: boolean;

    parentAuthorId: string;

    topicAuthorId: string;

    tags: string[];

    isTopicBanned: boolean;

    actualParentPostId?: string;

    playerSupportFlags: number;

    playerSupportMetadata: string;

    awaitingApproval: boolean;

    archivedLastReplyDate?: string;
  }

  export interface UserBanRequest {
    comment: string;

    banExpireDate?: string;

    profileBanExpireDate?: string;
  }

  export interface BulkEditPostRequest {
    PostsToEdit: { [key: string]: Contract.EditPostRequest };
  }

  export interface CommunityContentSubmission {
    sourceUrl: string;

    title: string;

    description: string;
  }
}

export declare namespace Tokens {
  export interface MarathonInviteTokenResponse {
    InviterId: string;

    InviterCohort: string;

    FriendIndex: string;
  }

  export interface TokenSupportDetails {
    tokenId: string;

    code: string;

    claimStateLastUpdated?: string;

    currentUseCount: number;

    dateCreated: string;

    dateProvisioned?: string;

    isUnlimitedUse: boolean;

    isValid: boolean;

    maximumUseCount: number;

    offerKey: string;

    offerHideInHistory: boolean;

    offerDateAdded?: string;

    campaignName: string;

    campaignDateAdded?: string;

    claims: Queries.SearchResultTokenSupportClaimEntry;
  }

  export interface TokenSupportClaimEntry {
    membershipId: string;

    membershipType: Globals.BungieMembershipType;

    displayName: string;

    dateClaimed: string;
  }

  export interface EververseChangeEvent {
    EventId: string;

    Timestamp: string;

    ItemHash: string;

    ItemDisplayName: string;

    ItemDisplayDescription: string;

    NewQuantity: number;

    PreviousQuantity: number;

    EventClassification: Globals.EververseChangeEventClassification;
  }

  export interface EververseVendorPurchaseEvent {
    EventId: string;

    Timestamp: string;

    ItemHash: string;

    PurchasedItemDisplayName: string;

    PurchasedItemDisplayDescription: string;

    PurchasedItemQuantity: number;

    EventClassification: Globals.EververseVendorPurchaseEventClassification;

    PaidCosts: Tokens.EververseVendorPaidCostPair[];
  }

  export interface EververseVendorPaidCostPair {
    ItemHash: string;

    ItemDisplayName: string;

    ItemDisplayDescription: string;

    Quantity: number;
  }

  export interface EververseSilverBalanceResponse {
    SilverBalance?: number;
  }

  export interface EververseCashout {
    CurrentSilverBalance: number;

    BungieGrantedSilver: number;

    PlatformGrantedSilver: number;

    TotalSilverSpent: number;

    CashoutQuantity: number;
  }

  export interface RAFBondDetailResponse {
    requestingUser: User.GeneralUser;

    requestingMembershipId: string;

    requestingMembershipType: Globals.BungieMembershipType;

    requestingUserIsVeteran: boolean;

    bonds: Tokens.RAFBondDetails[];
  }

  /**
	The external-facing contract for Refer-a-friend information.
	*/
  export interface RAFBondDetails {
    bondedPlayer: User.GeneralUser;

    rafId: string;

    targetDeviceType: Globals.ClientDeviceType;

    bondedPlayerMembershipId?: string;

    bondedPlayerMembershipType?: Globals.BungieMembershipType;

    isVeteran: boolean;

    dateCreated: string;

    bondStatus: Globals.RAFBondState;
  }

  export interface RAFEligibilityResponse {
    MembershipId?: string;

    MembershipType?: Globals.BungieMembershipType;

    DisplayName: string;

    VeteranEligibilityStatus: Globals.RAFEligibility;

    NewPlayerEligibilityStatus: Globals.RAFEligibility;
  }

  export interface RAFVeteranRewardStatusResponse {
    MembershipId: string;

    MembershipType: Globals.BungieMembershipType;

    RewardsEarned: number;

    RewardsApplied: number;
  }

  export interface RAFQuestProgressResponse {
    MembershipId?: string;

    MembershipType?: Globals.BungieMembershipType;

    CurrentStep: Globals.RAFQuestStepsForsaken;

    IsVeteran: boolean;
  }

  export interface PartnerOfferClaimRequest {
    PartnerOfferId: string;

    BungieNetMembershipId: string;

    TransactionId: string;
  }

  export interface PartnerOfferSkuHistoryResponse {
    SkuIdentifier: string;

    LocalizedName: string;

    LocalizedDescription: string;

    ClaimDate: string;

    AllOffersApplied: boolean;

    TransactionId: string;

    SkuOffers: Tokens.PartnerOfferHistoryResponse[];
  }

  export interface PartnerOfferHistoryResponse {
    PartnerOfferKey: string;

    MembershipId?: string;

    MembershipType?: Globals.BungieMembershipType;

    LocalizedName: string;

    LocalizedDescription: string;

    IsConsumable: boolean;

    QuantityApplied: number;

    ApplyDate?: string;
  }

  export interface PartnerRewardHistoryResponse {
    PartnerOffers: Tokens.PartnerOfferSkuHistoryResponse[];

    TwitchDrops: Tokens.TwitchDropHistoryResponse[];
  }

  export interface TwitchDropHistoryResponse {
    Title: string;

    Description: string;

    CreatedAt?: string;

    ClaimState?: Globals.DropStateEnum;
  }

  export interface BungieRewardDisplay {
    UserRewardAvailabilityModel: Tokens.UserRewardAvailabilityModel;

    ObjectiveDisplayProperties: Tokens.RewardDisplayProperties;

    RewardDisplayProperties: Tokens.RewardDisplayProperties;
  }

  export interface UserRewardAvailabilityModel {
    AvailabilityModel: Tokens.RewardAvailabilityModel;

    IsAvailableForUser: boolean;

    IsUnlockedForUser: boolean;
  }

  export interface RewardAvailabilityModel {
    HasExistingCode: boolean;

    RecordDefinitions: Records.DestinyRecordDefinition[];

    CollectibleDefinitions: Tokens.CollectibleDefinitions[];

    IsOffer: boolean;

    HasOffer: boolean;

    OfferApplied: boolean;

    DecryptedToken: string;

    IsLoyaltyReward: boolean;

    ShopifyEndDate?: string;

    GameEarnByDate: string;

    RedemptionEndDate: string;
  }

  export interface CollectibleDefinitions {
    CollectibleDefinition: Collectibles.DestinyCollectibleDefinition;

    DestinyInventoryItemDefinition: Definitions.DestinyInventoryItemDefinition;
  }

  export interface RewardDisplayProperties {
    Name: string;

    Description: string;

    ImagePath: string;
  }

  export interface BungieRewardClaimResponse {
    TargetRewardId: string;

    TargetDestinyMembershipType: Globals.BungieMembershipType;

    TargetDestinyMembershipId: string;

    IsOffer: boolean;

    IsLoyaltyReward: boolean;

    OwnsOffer: boolean;

    DecryptedToken: string;

    OfferApplied: boolean;

    OfferAsCode: boolean;

    CodeCharges: number;

    RedemptionEndDate: string;

    RedemptionPeriodExpired: boolean;

    ClaimPeriodExpired: boolean;

    Email: string;

    RewardDisplayProperties: Tokens.RewardDisplayProperties;
  }

  export interface CohortConfigResponse {
    FeatureFlag: string;

    FriendLinkCount: number;

    FriendCohortToken: string;

    SkipNda?: boolean;

    SurveyType: string;
  }
}

export declare namespace Notifications {
  export interface NotificationUpdateRequest {
    settings: Notifications.NotificationUpdateSetting[];
  }

  export interface NotificationUpdateSetting {
    notificationType?: string;

    notifyEmail?: boolean;

    notifyMobile?: boolean;

    notifyWeb?: boolean;
  }

  export interface NotificationResponse {
    notifications: Notifications.Notification[];

    invitations: { [key: string]: Invitations.Invitation };

    tagActivityCount: number;

    groupActivityCount: number;
  }

  export interface Notification {
    notificationId: string;

    membershipId: string;

    notificationType: Globals.NotificationType;

    createdDate: string;

    notificationDetail: string;

    memberInitiatedId?: string;

    relatedItemId?: string;

    relatedChildItemId?: string;

    relatedGroupId?: string;

    relatedGroupType?: Globals.GroupType;

    isNew: boolean;

    icon: string;

    memberInitiated: User.GeneralUser;

    relatedItemDetail: string;

    relatedEntityType: Globals.EntityType;

    invitationId?: string;
  }

  export interface RealTimeEventData {
    eventType: Globals.RealTimeEventType;

    /**
		Used with: ConversationChanged, Typing, RecruitThreadUpdate, ClanFireteamUpdate
		The ID of the conversation that changed, had typing, or was created the for recruitment
		*/
    conversationId?: string;

    /**
		Used with: ConversationChanged
		The ID of the conversation that received a new message
		*/
    messageId?: string;

    /**
		Used with: Typing
		The display name of the user who is typing.
		*/
    whoIsTyping: string;

    /**
		Used with: ConversationChanged, Typing
		The Bungie.net membership ID of the user who is typing or added the new message.
		*/
    senderMembershipId?: string;

    /**
		Used with: ConversationChanged
		The type of conversation (private, group) receiving the new message.
		*/
    conversationType: Globals.EventConversationType;

    /**
		Used with: ConversationChanged
		Preview of the message that was added to the conversation.
		*/
    preview: string;

    /**
		Used with: NotificationsChanged
		The number of web notifications the user has yet to observe
		*/
    notificationCount?: number;

    /**
		Used with: MessageCounts
		The number of private conversations that have new messages.
		*/
    privateMessageCount?: number;

    /**
		Used with: MessageCounts
		The number of group conversations that have new messages.
		*/
    externalMessageCount?: number;

    /**
		Used with: FriendCounts
		Dictionary with the number of friends online for various platforms (PSN, Xbox, etc)
		*/
    friendCounts: {
      [K in EnumStrings<typeof Globals.BungieCredentialType>]?: number;
    };

    /**
		Used with: FriendCounts
		List of credentials that have expired preventing new friend counts from being provided.
		*/
    needsReauth: Globals.BungieCredentialType[];

    /**
		Used with: Announcements
		Dictionary with global announcements that have yet to be acknowledged by the user.
		*/
    announcements: {
      [K in EnumStrings<
        typeof Globals.GlobalAcknowledgementItem
      >]?: User.AckState;
    };

    /**
		Used with: RecruitThreadUpdate, ClanFireteamUpdate
		Bungie.net Membership ID of a user who joined a fire team via the recruitment forum or clan fireteam.
		*/
    targetMembershipId?: string;

    /**
		Used with: RecruitThreadUpdate/ClanFireteamUpdate
		True if the indicated targetMembershipId was removed from the fire team
		*/
    isRemoved?: boolean;

    /**
		Used with: RecruitThreadUpdate
		Topic ID that identifies the recruitment thread being modified.
		*/
    topicId?: string;

    /**
		Used with group conversations
		*/
    groupId?: string;

    /**
		Used for optional group chat walls - they have names.
		*/
    name: string;

    /**
		Used with ClanFireteamUpdate
		The fireteam id being updated
		*/
    fireteamId?: string;

    /**
		Used with FireteamFinderUpdate
		The Fireteam Finder LobbyId being updated
		*/
    fireteamFinderLobbyId?: string;

    /**
		Used with FireteamFinderUpdate
		The Fireteam Finder ListingId being updated
		*/
    fireteamFinderListingId?: string;
  }
}

export declare namespace Contracts {
  export interface GroupItemCount {
    groupId: string;

    count: number;

    conversationId: string;
  }

  export interface FrontPageContentResponseV3 {
    featuredArticle: Content.ContentItemPublicContract;

    pinnedArticles: Content.ContentItemPublicContract[];
  }

  export interface DestinyContentResponse {
    aboutContent: Content.ContentItemPublicContract;

    mediaBuckets: Contracts.ContentBucket[];
  }

  export interface ContentBucket {
    ContentId: string;

    Title: string;

    Items: Content.ContentItemPublicContract[];
  }

  export interface DestinyContentResponseV2 {
    TopSet: Content.ContentItemPublicContract;

    StorySet: Content.ContentItemPublicContract;

    GuardianSet: Content.ContentItemPublicContract;

    FrontierSet: Content.ContentItemPublicContract;

    EnemySet: Content.ContentItemPublicContract;

    MediaBuckets: Content.ContentItemPublicContract;

    PressReleases: Queries.SearchResultContentItemPublicContract;
  }

  export interface ModerationRequest {
    moderatedItemId: string;

    moderatedItemType: Globals.IgnoredItemType;

    comments: string;

    reason: string;

    requestedPunishment: Globals.ModeratorRequestedPunishment;

    requestedBlastBan: boolean;
  }

  export interface TagResponse {
    tagText: string;

    ignoreStatus: Ignores.IgnoreResponse;
  }

  export interface ActivityMessageSearchResponse {
    users: User.GeneralUser[];

    results: Contracts.ActivityMessage[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface ActivityMessage {
    activity: Activities.Activity;

    message: string;
  }

  export interface IgnoreSearchResult {
    tags: Contracts.IgnoreDetailResponseTag[];

    groups: Contracts.IgnoreDetailResponseGroup[];

    posts: Contracts.IgnoreDetailResponsePost[];

    users: Contracts.IgnoreDetailResponseUser[];

    totalResults: number;

    hasMore: boolean;

    availablePages: number;

    currentPage: number;

    itemsPerPage: number;
  }

  export interface IgnoreDetailResponseTag {
    tagText: string;

    displayName: string;

    displayNameCode?: number;

    dateCreated: string;

    dateExpires: string;

    dateModified: string;

    comment: string;

    flags: number;

    reason: string;
  }

  export interface IgnoreDetailResponseGroup {
    group: GroupsV2.GroupV2;

    displayName: string;

    displayNameCode?: number;

    dateCreated: string;

    dateExpires: string;

    dateModified: string;

    comment: string;

    flags: number;

    reason: string;
  }

  export interface IgnoreDetailResponsePost {
    post: Contract.Post;

    displayName: string;

    displayNameCode?: number;

    dateCreated: string;

    dateExpires: string;

    dateModified: string;

    comment: string;

    flags: number;

    reason: string;
  }

  export interface IgnoreDetailResponseUser {
    user: User.GeneralUser;

    displayName: string;

    displayNameCode?: number;

    dateCreated: string;

    dateExpires: string;

    dateModified: string;

    comment: string;

    flags: number;

    reason: string;
  }

  export interface IgnoreDetailResponse {
    displayName: string;

    displayNameCode?: number;

    dateCreated: string;

    dateExpires: string;

    dateModified: string;

    comment: string;

    flags: number;

    reason: string;
  }

  export interface IgnoreItemRequest {
    ignoredItemId: string;

    ignoredItemType: Globals.IgnoredItemType;

    comment: string;

    reason: string;

    itemContextId: string;

    itemContextType: Globals.IgnoredItemType;

    requestedPunishment: Globals.ModeratorRequestedPunishment;

    requestedBlastBan: boolean;
  }

  export interface UnignoreItemRequest {
    ignoredItemId: string;

    ignoredItemType: Globals.IgnoredItemType;
  }

  export interface LastReportedItemResponse {
    membershipId: string;

    reportId?: string;

    banSourceId: string;

    banSourceType: Globals.IgnoredItemType;

    banReason?: string;
  }

  export interface ReportedItemResponse {
    moderatedMemberDisplayName: string;

    RelatedStrings: string[];

    AutoTriggerHelpText: string;

    reportId: string;

    reportedItem: string;

    reportedItemType: Globals.IgnoredItemType;

    dateCreated: string;

    dateResolved?: string;

    comment: string;

    result: Globals.ReportResolutionStatus;

    reason: string;

    moderatorMembershipId: string;

    dateAssigned?: string;

    overturnComment: string;

    resultOverturned: Globals.ReportResolutionStatus;

    dateOverturned?: string;

    overturnedMembershipId?: string;

    entity: any;

    reportCount: number;

    banDurationInDays: number;

    autoTriggerId?: number;

    reportedItemGroupContextId?: string;

    locale: string;
  }

  export interface ReportAssignmentFilter {
    locale: string;
  }

  export interface ReportResolution {
    reportId: string;

    reason: string;

    result: Globals.ReportResolutionStatus;

    comments: string;

    banLength: Globals.IgnoreLength;
  }

  export interface IgnoreItemOverrideRequest {
    globalIgnoreEndDate: string;

    ignoredItemId: string;

    ignoredItemType: Globals.IgnoredItemType;

    comment: string;
  }

  export interface AdminHistoryEntry {
    historyId: string;

    historyDate: string;

    historyType: Globals.AdminHistoryType;

    historyTypeText: string;

    historyItemId: string;

    historyItemFlags: Globals.AdminHistoryItemFlags;

    historyItemText: string;

    adminMembershipId: string;

    adminMembershipFlags: Globals.AdminHistoryMembershipFlags;

    adminMembershipFlagsText: string;

    targetMembershipId?: string;

    targetGroupId?: string;

    foundAdminUser: boolean;

    adminUser: User.GeneralUser;

    foundTargetUser: boolean;

    targetUser: User.GeneralUser;

    foundTargetGroup: boolean;

    targetGroup: GroupsV2.GroupV2;
  }

  export interface OfferHistoryResponse {
    OfferKey: string;

    OfferDisplayName: string;

    OfferDisplayDetail: string;

    OfferImagePath: string;

    OfferPurchaseDate: string;

    OfferQuantity: number;

    ConsumableQuantity: number;

    RedeemType: Globals.OfferRedeemMode;

    GrantedPlatformCode: boolean;

    Code: string;
  }

  export interface TokenThrottleStateResponse {
    IsThrottled: boolean;

    ThrottleExpires: string;

    NumberOfFailedAttemptsToday: number;

    MaximumFailedAttemptsPerDay: number;

    AgeVerificationState: boolean;
  }

  export interface ClaimResponse {
    tokenId?: string;

    membershipId?: string;

    membershipType?: Globals.BungieMembershipType;

    OfferName: string;

    OfferClaimText: string;
  }

  export interface PlatformMarketplaceCodeResponse {
    offerKey: string;

    deviceType: Globals.ClientDeviceType;

    platformCodeRegion: Globals.MarketplaceCodeRegion;

    OfferDistributionDate: string;

    platformCode: string;

    OfferDisplayName: string;

    OfferDisplayDetail: string;
  }
}

export declare namespace Common {
  export interface CEDictionaryBungieCredentialTypeString {
    Comparer: any;

    Count: number;

    Keys: any;

    Values: any;

    Item: string;
  }

  /**
	Many Destiny*Definition contracts - the "first order" entities of Destiny
	that have their own tables in the Manifest Database - also have displayable
	information.  This is the base class for that display information.
	*/
  export interface DestinyDisplayPropertiesDefinition {
    description: string;

    name: string;

    /**
		Note that "icon" is sometimes misleading, and should be interpreted in the context of the entity.
		For instance, in Destiny 1 the DestinyRecordBookDefinition's icon was a big picture of a book.
		
		But usually, it will be a small square image that you can use as... well, an icon.
		
		They are currently represented as 96px x 96px images.
		*/
    icon: string;

    iconSequences: Common.DestinyIconSequenceDefinition[];

    /**
		If this item has a high-res icon (at least for now, many things won't), then the path to that icon will be here.
		*/
    highResIcon: string;

    hasIcon: boolean;
  }

  export interface DestinyIconSequenceDefinition {
    frames: string[];
  }

  export interface DestinyPositionDefinition {
    x: number;

    y: number;

    z: number;
  }

  export interface DestinyIntrinsicUnlockDefinition {
    unlockHash: number;

    value: Globals.DestinyUnlockState;
  }

  export interface CEDictionaryStringString {
    Comparer: any;

    Count: number;

    Keys: any;

    Values: any;

    Item: string;
  }
}

export declare namespace Config {
  export interface UserTheme {
    userThemeId: number;

    userThemeName: string;

    userThemeDescription: string;
  }

  export interface GroupTheme {
    name: string;

    folder: string;

    description: string;
  }

  export interface ReportTrigger {
    Id: number;

    Reason: string;

    MatchUrl: boolean;

    QueueText: string;

    Enabled: boolean;

    Locale: string;

    Scope: Globals.ReportTriggerScope;

    Sources: Globals.ReportTriggerSourceFlags;

    SilentBlock: boolean;

    AutoWarn: boolean;

    AutoBan: boolean;
  }

  /**
	DestinyManifest is the external-facing contract for just the properties needed by those calling the Destiny Platform.
	*/
  export interface DestinyManifest {
    version: string;

    mobileAssetContentPath: string;

    mobileGearAssetDataBases: Config.GearAssetDataBaseDefinition[];

    mobileWorldContentPaths: { [key: string]: string };

    /**
		This points to the generated JSON that contains all the Definitions. Each key is a locale.
		The value is a path to the aggregated world definitions (warning: large file!)
		*/
    jsonWorldContentPaths: { [key: string]: string };

    /**
		This points to the generated JSON that contains all the Definitions. Each key is a locale.
		The value is a dictionary, where the key is a definition type by name, and the value is the path to the file for that definition.
		WARNING: This is unsafe and subject to change - do not depend on data in these files staying around long-term.
		*/
    jsonWorldComponentContentPaths: {
      [key: string]: { [key: string]: string };
    };

    mobileClanBannerDatabasePath: string;

    mobileGearCDN: { [key: string]: string };

    /**
		Information about the "Image Pyramid" for Destiny icons.
		Where possible, we create smaller versions of Destiny icons.
		These are found as subfolders under the location of the "original/full size" Destiny images,
		with the same file name and extension as the original image itself.  (this lets us avoid sending largely redundant
		path info with every entity, at the expense of the smaller versions of the image being less discoverable)
		*/
    iconImagePyramidInfo: Config.ImagePyramidEntry[];
  }

  export interface GearAssetDataBaseDefinition {
    version: number;

    path: string;
  }

  export interface ImagePyramidEntry {
    /**
		The name of the subfolder where these images are located.
		*/
    name: string;

    /**
		The factor by which the original image size has been reduced.
		*/
    factor: number;
  }
}

export declare namespace GroupsV2 {
  export interface GroupUserInfoCard {
    /**
		This will be the display name the clan server last saw the user as. If the account is
		an active cross save override, this will be the display name to use.  Otherwise, this will match the displayName property.
		*/
    LastSeenDisplayName: string;

    /**
		The platform of the LastSeenDisplayName
		*/
    LastSeenDisplayNameType: Globals.BungieMembershipType;

    supplementalDisplayName: string;

    iconPath: string;

    crossSaveOverride: Globals.BungieMembershipType;

    applicableMembershipTypes: Globals.BungieMembershipType[];

    isPublic: boolean;

    membershipType: Globals.BungieMembershipType;

    membershipId: string;

    displayName: string;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }

  export interface GroupV2 {
    groupId: string;

    name: string;

    groupType: Globals.GroupType;

    membershipIdCreated: string;

    creationDate: string;

    modificationDate: string;

    about: string;

    tags: string[];

    memberCount: number;

    isPublic: boolean;

    isPublicTopicAdminOnly: boolean;

    motto: string;

    allowChat: boolean;

    isDefaultPostPublic: boolean;

    chatSecurity: Globals.ChatSecuritySetting;

    locale: string;

    avatarImageIndex: number;

    homepage: Globals.GroupHomepage;

    membershipOption: Globals.MembershipOption;

    defaultPublicity: Globals.GroupPostPublicity;

    theme: string;

    bannerPath: string;

    avatarPath: string;

    conversationId: string;

    enableInvitationMessagingForAdmins: boolean;

    banExpireDate?: string;

    features: GroupsV2.GroupFeatures;

    remoteGroupId?: string;

    clanInfo: GroupsV2.GroupV2ClanInfoAndInvestment;
  }

  export interface GroupFeatures {
    maximumMembers: number;

    /**
		Maximum number of groups of this type a typical membership may join. For example,
		a user may join about 50 General groups with their Bungie.net account.  They may
		join one clan per Destiny membership.
		*/
    maximumMembershipsOfGroupType: number;

    capabilities: Globals.Capabilities;

    membershipTypes: Globals.BungieMembershipType[];

    /**
		Minimum Member Level allowed to invite new members to group
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    invitePermissionOverride: boolean;

    /**
		Minimum Member Level allowed to update group culture
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    updateCulturePermissionOverride: boolean;

    /**
		Minimum Member Level allowed to host guided games
		
		Always Allowed: Founder, Acting Founder, Admin
		
		Allowed Overrides: None, Member, Beginner
		
		Default is Member for clans, None for groups, although this means nothing for groups.
		*/
    hostGuidedGamePermissionOverride: Globals.HostGuidedGamesPermissionLevel;

    /**
		Minimum Member Level allowed to update banner
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    updateBannerPermissionOverride: boolean;

    /**
		Level to join a member at when accepting an invite, application, or joining an open clan
		
		Default is Beginner.
		*/
    joinLevel: Globals.RuntimeGroupMemberType;
  }

  /**
	The same as GroupV2ClanInfo, but includes any investment data.
	*/
  export interface GroupV2ClanInfoAndInvestment {
    d2ClanProgressions: { [key: number]: World.DestinyProgression };

    clanCallsign: string;

    clanBannerData: GroupsV2.ClanBanner;
  }

  export interface ClanBanner {
    decalId: number;

    decalColorId: number;

    decalBackgroundColorId: number;

    gonfalonId: number;

    gonfalonColorId: number;

    gonfalonDetailId: number;

    gonfalonDetailColorId: number;
  }

  export interface GroupResponse {
    detail: GroupsV2.GroupV2;

    founder: GroupsV2.GroupMember;

    alliedIds: string[];

    parentGroup: GroupsV2.GroupV2;

    allianceStatus: Globals.GroupAllianceStatus;

    groupJoinInviteCount: number;

    /**
		A convenience property that indicates if every membership you (the current user) have that is a part of this group
		are part of an account that is considered inactive - for example, overridden accounts in Cross Save.
		*/
    currentUserMembershipsInactiveForDestiny: boolean;

    /**
		This property will be populated if the authenticated user is a member of the group. Note that because of
		account linking, a user can sometimes be part of a clan more than once.  As such, this returns the
		highest member type available.
		*/
    currentUserMemberMap: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: GroupsV2.GroupMember;
    };

    /**
		This property will be populated if the authenticated user is an applicant or has an outstanding invitation to join.
		Note that because of account linking, a user can sometimes be part of a clan more than once.
		*/
    currentUserPotentialMemberMap: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: GroupsV2.GroupPotentialMember;
    };
  }

  export interface GroupMember {
    memberType: Globals.RuntimeGroupMemberType;

    isOnline: boolean;

    lastOnlineStatusChange: string;

    groupId: string;

    destinyUserInfo: GroupsV2.GroupUserInfoCard;

    bungieNetUserInfo: User.UserInfoCard;

    joinDate: string;
  }

  export interface GroupPotentialMember {
    potentialStatus: Globals.GroupPotentialMemberStatus;

    groupId: string;

    destinyUserInfo: GroupsV2.GroupUserInfoCard;

    bungieNetUserInfo: User.UserInfoCard;

    joinDate: string;
  }

  /**
	A small infocard of group information, usually used for when a list of groups are returned
	*/
  export interface GroupV2Card {
    groupId: string;

    name: string;

    groupType: Globals.GroupType;

    creationDate: string;

    about: string;

    motto: string;

    memberCount: number;

    locale: string;

    membershipOption: Globals.MembershipOption;

    capabilities: Globals.Capabilities;

    remoteGroupId?: string;

    clanInfo: GroupsV2.GroupV2ClanInfo;

    avatarPath: string;

    theme: string;
  }

  /**
	This contract contains clan-specific group information.  It does not include any investment data.
	*/
  export interface GroupV2ClanInfo {
    clanCallsign: string;

    clanBannerData: GroupsV2.ClanBanner;
  }

  export interface GroupSearchResponse {
    results: GroupsV2.GroupV2Card[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  /**
	NOTE: GroupQuery, as of Destiny 2, has essentially two totally different and incompatible "modes".
	
	If you are querying for a group, you can pass any of the properties below.
	
	If you are querying for a Clan, you MUST NOT pass any of the following properties (they must be null or undefined in your request, not just empty string/default values):
	
	- groupMemberCountFilter
	- localeFilter
	- tagText
	
	If you pass these, you will get a useless InvalidParameters error.
	*/
  export interface GroupQuery {
    name: string;

    groupType: Globals.GroupType;

    creationDate: Globals.GroupDateRange;

    sortBy: Globals.GroupSortBy;

    groupMemberCountFilter?: Globals.GroupMemberCountFilter;

    localeFilter: string;

    tagText: string;

    itemsPerPage: number;

    currentPage: number;

    requestContinuationToken: string;
  }

  export interface GroupNameSearchRequest {
    groupName: string;

    groupType: Globals.GroupType;
  }

  export interface GroupOptionalConversation {
    groupId: string;

    conversationId: string;

    chatEnabled: boolean;

    chatName: string;

    chatSecurity: Globals.ChatSecuritySetting;
  }

  export interface GroupCreationResponse {
    groupId: string;
  }

  export interface GroupAction {
    /**
		Type of group, either Bungie.net hosted group, or a game services hosted clan.
		*/
    groupType: Globals.GroupType;

    name: string;

    about: string;

    motto: string;

    theme: string;

    avatarImageIndex: number;

    tags: string;

    isPublic: boolean;

    membershipOption: Globals.MembershipOption;

    isPublicTopicAdminOnly: boolean;

    isDefaultPostPublic: boolean;

    allowChat: boolean;

    isDefaultPostAlliance: boolean;

    chatSecurity: Globals.ChatSecuritySetting;

    callsign: string;

    locale: string;

    homepage: Globals.GroupHomepage;

    /**
		When operation needs a platform specific account ID for the present user, use this property.
		In particular, groupType of Clan requires this value to be set.
		*/
    platformMembershipType: Globals.BungieMembershipType;
  }

  export interface GroupEditAction {
    name: string;

    about: string;

    motto: string;

    theme: string;

    avatarImageIndex?: number;

    tags: string;

    isPublic?: boolean;

    membershipOption?: Globals.MembershipOption;

    isPublicTopicAdminOnly?: boolean;

    allowChat?: boolean;

    chatSecurity?: Globals.ChatSecuritySetting;

    callsign: string;

    locale: string;

    homepage?: Globals.GroupHomepage;

    enableInvitationMessagingForAdmins?: boolean;

    defaultPublicity?: Globals.GroupPostPublicity;
  }

  export interface GroupOptionsEditAction {
    /**
		Minimum Member Level allowed to invite new members to group
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    InvitePermissionOverride?: boolean;

    /**
		Minimum Member Level allowed to update group culture
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    UpdateCulturePermissionOverride?: boolean;

    /**
		Minimum Member Level allowed to host guided games
		
		Always Allowed: Founder, Acting Founder, Admin
		
		Allowed Overrides: None, Member, Beginner
		
		Default is Member for clans, None for groups, although this means nothing for groups.
		*/
    HostGuidedGamePermissionOverride?: Globals.HostGuidedGamesPermissionLevel;

    /**
		Minimum Member Level allowed to update banner
		
		Always Allowed: Founder, Acting Founder
		
		True means admins have this power, false means they don't
		
		Default is false for clans, true for groups.
		*/
    UpdateBannerPermissionOverride?: boolean;

    /**
		Level to join a member at when accepting an invite, application, or joining an open clan
		
		Default is Beginner.
		*/
    JoinLevel?: Globals.RuntimeGroupMemberType;
  }

  export interface GroupOptionalConversationAddRequest {
    chatName: string;

    chatSecurity: Globals.ChatSecuritySetting;
  }

  export interface GroupOptionalConversationEditRequest {
    chatEnabled?: boolean;

    chatName: string;

    chatSecurity?: Globals.ChatSecuritySetting;
  }

  export interface GroupMemberLeaveResult {
    group: GroupsV2.GroupV2;

    groupDeleted: boolean;
  }

  export interface GroupBanRequest {
    comment: string;

    length: Globals.IgnoreLength;
  }

  export interface GroupBan {
    groupId: string;

    lastModifiedBy: User.UserInfoCard;

    createdBy: User.UserInfoCard;

    dateBanned: string;

    dateExpires: string;

    comment: string;

    bungieNetUserInfo: User.UserInfoCard;

    destinyUserInfo: GroupsV2.GroupUserInfoCard;
  }

  export interface GroupEditHistory {
    groupId: string;

    name: string;

    nameEditors?: string;

    about: string;

    aboutEditors?: string;

    motto: string;

    mottoEditors?: string;

    clanCallsign: string;

    clanCallsignEditors?: string;

    editDate?: string;

    groupEditors: User.UserInfoCard[];
  }

  export interface GroupApplicationResponse {
    resolution: Globals.GroupApplicationResolveState;
  }

  export interface GroupApplicationRequest {
    message: string;
  }

  export interface GroupMemberApplication {
    groupId: string;

    creationDate: string;

    resolveState: Globals.GroupApplicationResolveState;

    resolveDate?: string;

    resolvedByMembershipId?: string;

    requestMessage: string;

    resolveMessage: string;

    destinyUserInfo: GroupsV2.GroupUserInfoCard;

    bungieNetUserInfo: User.UserInfoCard;
  }

  export interface GroupApplicationListRequest {
    memberships: User.UserMembership[];

    message: string;
  }

  export interface GetGroupsForMemberResponse {
    /**
		A convenience property that indicates if every membership this user has that is a part of this group
		 are part of an account that is considered inactive - for example, overridden accounts in Cross Save.
		
		 The key is the Group ID for the group being checked, and the value is true if the users' memberships
		 for that group are all inactive.
		*/
    areAllMembershipsInactive: { [key: string]: boolean };

    results: GroupsV2.GroupMembership[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface GroupMembership {
    member: GroupsV2.GroupMember;

    group: GroupsV2.GroupV2;
  }

  export interface GroupMembershipSearchResponse {
    results: GroupsV2.GroupMembership[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface GroupPotentialMembershipSearchResponse {
    results: GroupsV2.GroupPotentialMembership[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface GroupPotentialMembership {
    member: GroupsV2.GroupPotentialMember;

    group: GroupsV2.GroupV2;
  }
}

export declare namespace ParentalControls {
  /**
	Response contract for linking a guardian in the context of parental controls.
	*/
  export interface ParentalControlsLinkGuardianResponse {
    ErrorMessage: string;
  }

  /**
	Response contract for unlinking a child-guardian relationship in the context of parental controls.
	*/
  export interface ParentalControlsUnlinkGuardianResponse {
    ErrorMessage: string;
  }

  /**
	Response contract for retrieving player info in the context of parental controls.
	*/
  export interface ParentalControlsGetPlayerContextResponse {
    Player: ParentalControls.ParentalControlsPlayerContext;

    Children: ParentalControls.ParentalControlsChildContext[];

    Preferences: ParentalControls.ParentalControlsPreferenceContext[];
  }

  /**
	Detailed class for player info in the context of parental controls.
	*/
  export interface ParentalControlsPlayerContext {
    GuardianId: string;

    Email: string;

    DateOfBirth?: string;

    Category: Globals.ParentalControlsCategoryType;

    LinkStatus: Globals.ParentalControlsGuardianChildLinkStatus;

    IsEmailVerified: boolean;

    IsVerifiedAdult: boolean;

    PlayerId: string;

    UniqueName: string;

    ProfilePicturePath: string;
  }

  /**
	Detailed class for child info in the context of parental controls.
	*/
  export interface ParentalControlsChildContext {
    Permissions: ParentalControls.ParentalControlsPermission[];

    PlayerId: string;

    UniqueName: string;

    ProfilePicturePath: string;
  }

  /**
	A data structure representing a permission for a player in the context of parental controls.
	*/
  export interface ParentalControlsPermission {
    Name: string;

    Value: boolean;
  }

  /**
	Detailed class preference info, with an additional parameter representing mutability.
	*/
  export interface ParentalControlsPreferenceContext {
    Preference: ParentalControls.ParentalControlsPreference;

    IsEditable: boolean;
  }

  /**
	A data structure representing a preference for a player in the context of parental controls.
	*/
  export interface ParentalControlsPreference {
    Name: string;

    Value: boolean;
  }

  /**
	Response contract for updating a child's permissions in the context of parental controls.
	*/
  export interface ParentalControlsUpdatePermissionsForChildResponse {
    ErrorMessage: string;

    StatusCode: Globals.ParentalControlsResponseStatus;
  }

  /**
	Request contract for updating a child's permissions in the context of parental controls.
	*/
  export interface ParentalControlsUpdatePermissionsForChildRequest {
    Permissions: ParentalControls.ParentalControlsPermission[];
  }

  /**
	Response contract for retrieving child preferences in the context of parental controls.
	*/
  export interface ParentalControlsGetPreferencesForChildResponse {
    Preferences: ParentalControls.ParentalControlsPreference[];
  }

  /**
	Response contract for updating a child's preferences in the context of parental controls.
	*/
  export interface ParentalControlsUpdatePreferencesForChildResponse {
    ErrorMessage: string;

    StatusCode: Globals.ParentalControlsResponseStatus;
  }

  export interface ParentalControlsUpdatePreferencesForChildRequest {
    Preferences: ParentalControls.ParentalControlsPreference[];
  }

  /**
	Response contract for a webhook with Kid's Web Services (KWS).
	*/
  export interface ParentalControlsKWSWebhookResponse {
    Success: boolean;

    ErrorMessage: string;
  }

  /**
	Request contract for a webhook with Kid's Web Services (KWS).
	*/
  export interface ParentalControlsKWSWebhookRequest {
    Payload: ParentalControls.ParentalControlsKWSWebHookPayload;
  }

  /**
	Parental controls webhook payload for KWS.
	*/
  export interface ParentalControlsKWSWebHookPayload {
    ParentEmail: string;

    Status: ParentalControls.ParentalControlsKWSWebHookStatus;

    ExternalPayload: string;
  }

  /**
	Status for a KWS webhook payload.
	*/
  export interface ParentalControlsKWSWebHookStatus {
    Verified: boolean;
  }

  /**
	Response contract for retrieving a token in the context of parental controls.
	*/
  export interface ParentalControlsTokenResponse {
    Token: string;

    TokenExpiresIn: number;

    RefreshToken: string;

    RefreshTokenExpiresIn: number;
  }

  /**
	Request contract for retrieving a token in the context of parental controls.
	*/
  export interface ParentalControlsTokenRequest {
    Code: string;
  }
}

export declare namespace Responses {
  /**
	A response wrapper for a single Message Conversation, that includes any linked entity information and additional
	information about the conversation.
	*/
  export interface MessageConversationResponse {
    users: { [key: string]: User.GeneralUser };

    invitationDetail: Invitations.InvitationResponseCodeDetail;

    group: GroupsV2.GroupV2;

    detail: Messages.MessageConversation;

    participants: Messages.MessageConversationMember[];
  }

  export interface MessageSearchResult {
    users: { [key: string]: User.GeneralUser };

    invitationDetails: {
      [key: string]: Invitations.InvitationResponseCodeDetail;
    };

    userNotificationPreference: boolean;

    results: Messages.Message[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface SaveMessageResult {
    conversationId: string;

    messageId: string;
  }

  /**
	A response wrapper for a set of Conversations, that includes any linked entity information and additional
	information about those conversations.
	*/
  export interface MessageConversationSearchResult {
    users: { [key: string]: User.GeneralUser };

    invitationDetails: {
      [key: string]: Invitations.InvitationResponseCodeDetail;
    };

    groups: { [key: string]: GroupsV2.GroupV2 };

    unreadCount: number;

    results: Messages.MessageConversationDetail[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface UnreadConversationCountResult {
    unreadConversations: string[];

    unreadConversationTotal: number;
  }

  /**
	I know what you seek.  You seek linked accounts.  Found them, you have.
	
	This contract returns a minimal amount of data about Destiny Accounts that are linked through your
	Bungie.Net account.  We will not return accounts in this response whose
	*/
  export interface DestinyLinkedProfilesResponse {
    /**
		Any Destiny account for whom we could successfully pull characters will be returned here,
		as the Platform-level summary of user data.  (no character data, no Destiny account data other
		than the Membership ID and Type so you can make further queries)
		*/
    profiles: Responses.DestinyProfileUserInfoCard[];

    /**
		If the requested membership had a linked Bungie.Net membership ID, this is the basic information
		about that BNet account.
		
		I know, Tetron; I know this is mixing UserServices concerns with DestinyServices concerns.  But
		it's so damn convenient!  https://www.youtube.com/watch?v=X5R-bB-gKVI
		*/
    bnetMembership: User.UserInfoCard;

    /**
		This is brief summary info for profiles that we believe have valid Destiny info, but who
		failed to return data for some other reason and thus we know that subsequent calls for
		their info will also fail.
		*/
    profilesWithErrors: Responses.DestinyErrorProfile[];
  }

  export interface DestinyProfileUserInfoCard {
    dateLastPlayed: string;

    /**
		If this profile is being overridden/obscured by Cross Save, this will be set to true.
		We will still return the profile for display purposes where users need to know the info: it is
		up to any given area of the app/site to determine if this profile should still be shown.
		*/
    isOverridden: boolean;

    /**
		If true, this account is hooked up as the "Primary" cross save account for one or more platforms.
		*/
    isCrossSavePrimary: boolean;

    /**
		This is the silver available on this Profile across any platforms on which they have purchased
		 silver.
		
		 This is only available if you are requesting yourself.
		*/
    platformSilver: Inventory.DestinyPlatformSilverComponent;

    /**
		If this profile is not in a cross save pairing, this will return the game versions
		 that we believe this profile has access to.
		
		 For the time being, we will not return this information for any membership that
		 is in a cross save pairing.  The gist is that, once the pairing occurs, we do
		 not currently have a consistent way to get that information for the profile's
		 original Platform, and thus gameVersions would be too inconsistent (based on
		 the last platform they happened to play on) for the info to be useful.
		
		 If we ever can get this data, this field will be deprecated
		 and replaced with data on the DestinyLinkedProfileResponse itself, with
		 game versions per linked Platform.  But since we can't get that, we have
		 this as a stop-gap measure for getting the data in the only situation
		 that we currently need it.
		*/
    unpairedGameVersions?: Globals.DestinyGameVersions;

    supplementalDisplayName: string;

    iconPath: string;

    crossSaveOverride: Globals.BungieMembershipType;

    applicableMembershipTypes: Globals.BungieMembershipType[];

    isPublic: boolean;

    membershipType: Globals.BungieMembershipType;

    membershipId: string;

    displayName: string;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }

  /**
	If a Destiny Profile can't be returned, but we're pretty certain it's a valid Destiny account,
	this will contain as much info as we can get about the profile for your use.
	
	Assume that the most you'll get is the Error Code, the Membership Type and the Membership ID.
	*/
  export interface DestinyErrorProfile {
    /**
		The error that we encountered.  You should be able to look up localized text to show to the
		user for these failures.
		*/
    errorCode: Globals.PlatformErrorCodes;

    /**
		Basic info about the account that failed.  Don't expect anything other than membership ID,
		Membership Type, and displayName to be populated.
		*/
    infoCard: User.UserInfoCard;
  }

  export interface DestinyProfileSummaryResponse {
    profile: Profiles.DestinyProfileComponent;

    characters: { [key: string]: Characters.DestinyCharacterComponent };

    platformSilver: Inventory.DestinyPlatformSilverComponent;

    entitlements: Responses.DestinyPlatformEntitlements;
  }

  export interface DestinyPlatformEntitlements {
    /**
		The last date in which it appears we were able to obtain entitlement data for this platform.
		
		 If null, we have never gotten data for this platform - this may mean you've not played
		 Destiny on the platform yet with your linked account.
		*/
    dateEntitlementsRefreshed?: string;

    /**
		The known game versions for this player, as best as we can determine from their purchase
		history.  This will not account for physical disk purchases.
		*/
    gameVersions: Globals.DestinyGameVersions;

    /**
		Sometimes, platforms will have subscriptions that give you access to entitlements.
		This is information about what subscriptions you have active for this platform, if any.
		*/
    subscriptions: Globals.DestinySubscriptions;
  }

  /**
	The response for GetDestinyProfile, with components for character and item-level data.
	*/
  export interface DestinyProfileResponse {
    /**
		Records the timestamp of when most components were last generated from the world server source. Unless the component type is specified
		in the documentation for secondaryComponentsMintedTimestamp, this value is sufficient to do data freshness.
		*/
    responseMintedTimestamp: string;

    /**
		Some secondary components are not tracked in the primary response timestamp and have their timestamp tracked here.  If your component is any of the following,
		 this field is where you will find your timestamp value:
		
		 PresentationNodes, Records, Collectibles, Metrics, StringVariables, Craftables, Transitory
		
		 All other component types may use the primary timestamp property.
		*/
    secondaryComponentsMintedTimestamp: string;

    /**
		Recent, refundable purchases you have made from vendors.  When will you use it?  Couldn't say...
		
		COMPONENT TYPE: VendorReceipts
		*/
    vendorReceipts: Components.SingleComponentResponseDestinyVendorReceiptsComponent;

    /**
		The profile-level inventory of the Destiny Profile.
		
		COMPONENT TYPE: ProfileInventories
		*/
    profileInventory: Components.SingleComponentResponseDestinyInventoryComponent;

    /**
		The profile-level currencies owned by the Destiny Profile.
		
		COMPONENT TYPE: ProfileCurrencies
		*/
    profileCurrencies: Components.SingleComponentResponseDestinyInventoryComponent;

    /**
		The basic information about the Destiny Profile (formerly "Account").
		
		COMPONENT TYPE: Profiles
		*/
    profile: Components.SingleComponentResponseDestinyProfileComponent;

    /**
		Silver quantities for any platform on which this Profile plays destiny.
		
		 COMPONENT TYPE: PlatformSilver
		*/
    platformSilver: Components.SingleComponentResponseDestinyPlatformSilverComponent;

    /**
		Items available from Kiosks that are available Profile-wide (i.e. across all characters)
		
		This component returns information about what Kiosk items are available to you on a *Profile*
		level.  It is theoretically possible for Kiosks to have items gated by specific Character as well.
		If you ever have those, you will find them on the characterKiosks property.
		
		COMPONENT TYPE: Kiosks
		*/
    profileKiosks: Components.SingleComponentResponseDestinyKiosksComponent;

    /**
		When sockets refer to reusable Plug Sets (see DestinyPlugSetDefinition for more info), this is
		the set of plugs and their states that are profile-scoped.
		
		This comes back with ItemSockets, as it is needed for a complete picture of the sockets on requested items.
		
		COMPONENT TYPE: ItemSockets
		*/
    profilePlugSets: Components.SingleComponentResponseDestinyPlugSetsComponent;

    /**
		When we have progression information - such as Checklists - that may apply profile-wide, it will
		be returned here rather than in the per-character progression data.
		
		COMPONENT TYPE: ProfileProgression
		*/
    profileProgression: Components.SingleComponentResponseDestinyProfileProgressionComponent;

    /**
		COMPONENT TYPE: PresentationNodes
		*/
    profilePresentationNodes: Components.SingleComponentResponseDestinyPresentationNodesComponent;

    /**
		COMPONENT TYPE: Records
		*/
    profileRecords: Components.SingleComponentResponseDestinyProfileRecordsComponent;

    /**
		COMPONENT TYPE: Collectibles
		*/
    profileCollectibles: Components.SingleComponentResponseDestinyProfileCollectiblesComponent;

    /**
		COMPONENT TYPE: Transitory
		*/
    profileTransitoryData: Components.SingleComponentResponseDestinyProfileTransitoryComponent;

    /**
		COMPONENT TYPE: Metrics
		*/
    metrics: Components.SingleComponentResponseDestinyMetricsComponent;

    /**
		COMPONENT TYPE: StringVariables
		*/
    profileStringVariables: Components.SingleComponentResponseDestinyStringVariablesComponent;

    /**
		COMPONENT TYPE: SocialCommendations
		*/
    profileCommendations: Components.SingleComponentResponseDestinySocialCommendationsComponent;

    /**
		Basic information about each character, keyed by the CharacterId.
		
		COMPONENT TYPE: Characters
		*/
    characters: Components.DictionaryComponentResponseInt64DestinyCharacterComponent;

    /**
		The character-level non-equipped inventory items, keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterInventories
		*/
    characterInventories: Components.DictionaryComponentResponseInt64DestinyInventoryComponent;

    /**
		The character loadouts, keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterLoadouts
		*/
    characterLoadouts: Components.DictionaryComponentResponseInt64DestinyLoadoutsComponent;

    /**
		Character-level progression data, keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterProgressions
		*/
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent;

    /**
		Character rendering data - a minimal set of info needed to render a character in 3D - keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterRenderData
		*/
    characterRenderData: Components.DictionaryComponentResponseInt64DestinyCharacterRenderComponent;

    /**
		Character activity data - the activities available to this character and its status, keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterActivities
		*/
    characterActivities: Components.DictionaryComponentResponseInt64DestinyCharacterActivitiesComponent;

    /**
		The character's equipped items, keyed by the Character's Id.
		
		COMPONENT TYPE: CharacterEquipment
		*/
    characterEquipment: Components.DictionaryComponentResponseInt64DestinyInventoryComponent;

    /**
		Items available from Kiosks that are available to a specific character as opposed to the account as a whole.
		It must be combined with data from the profileKiosks property to get a full picture of the character's available
		items to check out of a kiosk.
		
		This component returns information about what Kiosk items are available to you on a *Character*
		level.  Usually, kiosk items will be earned for the entire Profile (all characters) at once.
		To find those, look in the profileKiosks property.
		
		COMPONENT TYPE: Kiosks
		*/
    characterKiosks: Components.DictionaryComponentResponseInt64DestinyKiosksComponent;

    /**
		When sockets refer to reusable Plug Sets (see DestinyPlugSetDefinition for more info), this is
		the set of plugs and their states, per character, that are character-scoped.
		
		This comes back with ItemSockets, as it is needed for a complete picture of the sockets on requested items.
		
		COMPONENT TYPE: ItemSockets
		*/
    characterPlugSets: Components.DictionaryComponentResponseInt64DestinyPlugSetsComponent;

    /**
		Do you ever get the feeling that a system was designed *too* flexibly?  That it can be used
		in so many different ways that you end up being unable to provide an easy to use abstraction
		for the mess that's happening under the surface?
		
		Let's talk about character-specific data that might be related to items without
		instances.  These two statements are totally unrelated, I promise.
		
		At some point during D2, it was decided that items - such as Bounties - could be given to characters
		and *not* have instance data, but that *could* display and even use relevant state information
		on your account and character.
		
		Up to now, any item that had meaningful dependencies on character or account state had to be instanced,
		and thus "itemComponents" was all that you needed: it was keyed by item's instance IDs and provided the
		stateful information you needed inside.
		
		Unfortunately, we don't live in such a magical world anymore.  This is information held on a per-character
		basis about non-instanced items that the characters have in their inventory - or that reference character-specific
		state information even if it's in Account-level inventory - and the values related to that item's state
		in relation to the given character.
		
		To give a concrete example, look at a Moments of Triumph bounty.  They exist in a character's inventory,
		and show/care about a character's progression toward completing the bounty.  But the bounty itself is a
		non-instanced item, like a mod or a currency.  This returns that data for the characters who have the bounty
		in their inventory.
		
		I'm not crying, you're crying
		Okay we're both crying but it's going to be okay I promise
		Actually I shouldn't promise that, I don't know if it's going to be okay
		*/
    characterUninstancedItemComponents: {
      [key: string]: Sets.DestinyBaseItemComponentSetUInt32;
    };

    /**
		COMPONENT TYPE: PresentationNodes
		*/
    characterPresentationNodes: Components.DictionaryComponentResponseInt64DestinyPresentationNodesComponent;

    /**
		COMPONENT TYPE: Records
		*/
    characterRecords: Components.DictionaryComponentResponseInt64DestinyCharacterRecordsComponent;

    /**
		COMPONENT TYPE: Collectibles
		*/
    characterCollectibles: Components.DictionaryComponentResponseInt64DestinyCollectiblesComponent;

    /**
		COMPONENT TYPE: StringVariables
		*/
    characterStringVariables: Components.DictionaryComponentResponseInt64DestinyStringVariablesComponent;

    /**
		COMPONENT TYPE: Craftables
		*/
    characterCraftables: Components.DictionaryComponentResponseInt64DestinyCraftablesComponent;

    /**
		Information about instanced items across all returned characters, keyed by the item's instance ID.
		
		COMPONENT TYPE: [See inside the DestinyItemComponentSet contract for component types.]
		*/
    itemComponents: Sets.DestinyItemComponentSetInt64;

    /**
		A "lookup" convenience component that can be used to quickly check if the character has access
		to items that can be used for purchasing.
		
		COMPONENT TYPE: CurrencyLookups
		*/
    characterCurrencyLookups: Components.DictionaryComponentResponseInt64DestinyCurrenciesComponent;
  }

  /**
	The response contract for GetDestinyCharacter, with components that can be returned for character
	and item-level data.
	*/
  export interface DestinyCharacterResponse {
    /**
		The character-level non-equipped inventory items.
		
		COMPONENT TYPE: CharacterInventories
		*/
    inventory: Components.SingleComponentResponseDestinyInventoryComponent;

    /**
		Base information about the character in question.
		
		COMPONENT TYPE: Characters
		*/
    character: Components.SingleComponentResponseDestinyCharacterComponent;

    /**
		Character progression data, including Milestones.
		
		COMPONENT TYPE: CharacterProgressions
		*/
    progressions: Components.SingleComponentResponseDestinyCharacterProgressionComponent;

    /**
		Character rendering data - a minimal set of information about equipment and dyes used for rendering.
		
		COMPONENT TYPE: CharacterRenderData
		*/
    renderData: Components.SingleComponentResponseDestinyCharacterRenderComponent;

    /**
		Activity data - info about current activities available to the player.
		
		COMPONENT TYPE: CharacterActivities
		*/
    activities: Components.SingleComponentResponseDestinyCharacterActivitiesComponent;

    /**
		Equipped items on the character.
		
		COMPONENT TYPE: CharacterEquipment
		*/
    equipment: Components.SingleComponentResponseDestinyInventoryComponent;

    /**
		The loadouts available to the character.
		
		COMPONENT TYPE: CharacterLoadouts
		*/
    loadouts: Components.SingleComponentResponseDestinyLoadoutsComponent;

    /**
		Items available from Kiosks that are available to this specific character. 
		
		COMPONENT TYPE: Kiosks
		*/
    kiosks: Components.SingleComponentResponseDestinyKiosksComponent;

    /**
		When sockets refer to reusable Plug Sets (see DestinyPlugSetDefinition for more info), this is
		the set of plugs and their states that are scoped to this character.
		
		This comes back with ItemSockets, as it is needed for a complete picture of the sockets on requested items.
		
		COMPONENT TYPE: ItemSockets
		*/
    plugSets: Components.SingleComponentResponseDestinyPlugSetsComponent;

    /**
		COMPONENT TYPE: PresentationNodes
		*/
    presentationNodes: Components.SingleComponentResponseDestinyPresentationNodesComponent;

    /**
		COMPONENT TYPE: Records
		*/
    records: Components.SingleComponentResponseDestinyCharacterRecordsComponent;

    /**
		COMPONENT TYPE: Collectibles
		*/
    collectibles: Components.SingleComponentResponseDestinyCollectiblesComponent;

    /**
		The set of components belonging to the player's instanced items.
		
		COMPONENT TYPE: [See inside the DestinyItemComponentSet contract for component types.]
		*/
    itemComponents: Sets.DestinyItemComponentSetInt64;

    /**
		The set of components belonging to the player's UNinstanced items.  Because apparently
		now those too can have information relevant to the character's state.
		
		COMPONENT TYPE: [See inside the DestinyItemComponentSet contract for component types.]
		*/
    uninstancedItemComponents: Sets.DestinyBaseItemComponentSetUInt32;

    /**
		A "lookup" convenience component that can be used to quickly check if the character has access
		to items that can be used for purchasing.
		
		COMPONENT TYPE: CurrencyLookups
		*/
    currencyLookups: Components.SingleComponentResponseDestinyCurrenciesComponent;
  }

  export interface DestinyQueryUnlocksResponse {
    membershipType: Globals.BungieMembershipType;

    destinyMembershipId: string;

    AggregateUnlockFlagDictionary: { [key: number]: boolean };

    ProfileUnlockValueDictionary: { [key: number]: number };

    CharacterUnlockValueDictionary: {
      [key: number]: Responses.DestinyQueryUnlockValueCharacterResponse[];
    };
  }

  export interface DestinyQueryUnlockValueCharacterResponse {
    CharacterId: string;

    UnlockValue: number;
  }

  /**
	The response object for retrieving an individual instanced item.  None of these components are relevant
	for an item that doesn't have an "itemInstanceId": for those, get your information from the DestinyInventoryDefinition.
	*/
  export interface DestinyItemResponse {
    /**
		If the item is on a character, this will return the ID of the character that is holding the item.
		*/
    characterId?: string;

    /**
		Common data for the item relevant to its non-instanced properties.
		
		COMPONENT TYPE: ItemCommonData
		*/
    item: Components.SingleComponentResponseDestinyItemComponent;

    /**
		Basic instance data for the item.
		
		COMPONENT TYPE: ItemInstances
		*/
    instance: Components.SingleComponentResponseDestinyItemInstanceComponent;

    /**
		Information specifically about the item's objectives.
		
		COMPONENT TYPE: ItemObjectives
		*/
    objectives: Components.SingleComponentResponseDestinyItemObjectivesComponent;

    /**
		Information specifically about the perks currently active on the item.
		
		COMPONENT TYPE: ItemPerks
		*/
    perks: Components.SingleComponentResponseDestinyItemPerksComponent;

    /**
		Information about how to render the item in 3D.
		
		COMPONENT TYPE: ItemRenderData
		*/
    renderData: Components.SingleComponentResponseDestinyItemRenderComponent;

    /**
		Information about the computed stats of the item: power, defense, etc...
		
		COMPONENT TYPE: ItemStats
		*/
    stats: Components.SingleComponentResponseDestinyItemStatsComponent;

    /**
		Information about the talent grid attached to the item.  Talent nodes can provide a variety of
		benefits and abilities, and in Destiny 2 are used almost exclusively for the character's "Builds".
		
		COMPONENT TYPE: ItemTalentGrids
		*/
    talentGrid: Components.SingleComponentResponseDestinyItemTalentGridComponent;

    /**
		Information about the sockets of the item: which are currently active, what potential sockets
		you could have and the stats/abilities/perks you can gain from them.
		
		COMPONENT TYPE: ItemSockets
		*/
    sockets: Components.SingleComponentResponseDestinyItemSocketsComponent;

    /**
		Information about the Reusable Plugs for sockets on an item.  These are
		 plugs that you can insert into the given socket regardless of if you actually own an instance
		 of that plug: they are logic-driven plugs rather than inventory-driven.
		
		 These may need to be combined with Plug Set component data to get a full picture of available plugs
		 on a given socket.
		 
		 COMPONENT TYPE: ItemReusablePlugs
		*/
    reusablePlugs: Components.SingleComponentResponseDestinyItemReusablePlugsComponent;

    /**
		Information about objectives on Plugs for a given item.  See the component's documentation
		for more info.
		
		COMPONENT TYPE: ItemPlugObjectives
		*/
    plugObjectives: Components.SingleComponentResponseDestinyItemPlugObjectivesComponent;
  }

  /**
	A response containing all of the components for all requested vendors.
	*/
  export interface DestinyVendorsResponse {
    /**
		For Vendors being returned, this will give you the information you need to group them and order them
		in the same way that the Bungie Companion app performs grouping.  It will automatically be returned
		if you request the Vendors component.
		
		COMPONENT TYPE: Vendors
		*/
    vendorGroups: Components.SingleComponentResponseDestinyVendorGroupComponent;

    /**
		The base properties of the vendor.
		These are keyed by the Vendor Hash, so you will get one Vendor Component per vendor returned.
		
		COMPONENT TYPE: Vendors
		*/
    vendors: Components.DictionaryComponentResponseUInt32DestinyVendorComponent;

    /**
		Categories that the vendor has available, and references to the sales therein.
		These are keyed by the Vendor Hash, so you will get one Categories Component per vendor returned.
		
		COMPONENT TYPE: VendorCategories
		*/
    categories: Components.DictionaryComponentResponseUInt32DestinyVendorCategoriesComponent;

    /**
		Sales, keyed by the vendorItemIndex of the item being sold.
		These are keyed by the Vendor Hash, so you will get one Sale Item Set Component per vendor returned.
		
		Note that within the Sale Item Set component, the sales are themselves keyed by the vendorSaleIndex, so you
		can relate it to the current sale item definition within the Vendor's definition.
		
		COMPONENT TYPE: VendorSales
		*/
    sales: Components.DictionaryComponentResponseUInt32PersonalDestinyVendorSaleItemSetComponent;

    /**
		The set of item detail components, one set of item components per Vendor.
		These are keyed by the Vendor Hash, so you will get one Item Component Set per vendor returned.
		
		The components contained inside are themselves keyed by the vendorSaleIndex, and will have whatever
		item-level components you requested (Sockets, Stats, Instance data etc...) per item being sold by the vendor.
		*/
    itemComponents: { [key: number]: Sets.DestinyVendorItemComponentSetInt32 };

    /**
		A "lookup" convenience component that can be used to quickly check if the character has access
		to items that can be used for purchasing.
		
		COMPONENT TYPE: CurrencyLookups
		*/
    currencyLookups: Components.SingleComponentResponseDestinyCurrenciesComponent;

    /**
		A map of string variable values by hash for this character context.
		
		COMPONENT TYPE: StringVariables
		*/
    stringVariables: Components.SingleComponentResponseDestinyStringVariablesComponent;
  }

  export interface PersonalDestinyVendorSaleItemSetComponent {
    saleItems: { [key: number]: Vendors.DestinyVendorSaleItemComponent };
  }

  /**
	A response containing all of the components for a vendor.
	*/
  export interface DestinyVendorResponse {
    /**
		The base properties of the vendor.
		
		COMPONENT TYPE: Vendors
		*/
    vendor: Components.SingleComponentResponseDestinyVendorComponent;

    /**
		Categories that the vendor has available, and references to the sales therein.
		
		COMPONENT TYPE: VendorCategories
		*/
    categories: Components.SingleComponentResponseDestinyVendorCategoriesComponent;

    /**
		Sales, keyed by the vendorItemIndex of the item being sold.
		
		COMPONENT TYPE: VendorSales
		*/
    sales: Components.DictionaryComponentResponseInt32DestinyVendorSaleItemComponent;

    /**
		Item components, keyed by the vendorItemIndex of the active sale items.
		
		COMPONENT TYPE: [See inside the DestinyVendorItemComponentSet contract for component types.]
		*/
    itemComponents: Sets.DestinyVendorItemComponentSetInt32;

    /**
		A "lookup" convenience component that can be used to quickly check if the character has access
		to items that can be used for purchasing.
		
		COMPONENT TYPE: CurrencyLookups
		*/
    currencyLookups: Components.SingleComponentResponseDestinyCurrenciesComponent;

    /**
		A map of string variable values by hash for this character context.
		
		COMPONENT TYPE: StringVariables
		*/
    stringVariables: Components.SingleComponentResponseDestinyStringVariablesComponent;
  }

  /**
	A response containing all valid components for the public Vendors endpoint.
	
	 It is a decisively smaller subset of data compared to what we can get when we know
	 the specific user making the request.
	
	 If you want any of the other data - item details, whether or not you can buy it, etc... you'll have
	 to call in the context of a character.  I know, sad but true.
	*/
  export interface DestinyPublicVendorsResponse {
    /**
		For Vendors being returned, this will give you the information you need to group them and order them
		in the same way that the Bungie Companion app performs grouping.  It will automatically be returned
		if you request the Vendors component.
		
		COMPONENT TYPE: Vendors
		*/
    vendorGroups: Components.SingleComponentResponseDestinyVendorGroupComponent;

    /**
		The base properties of the vendor.
		These are keyed by the Vendor Hash, so you will get one Vendor Component per vendor returned.
		
		COMPONENT TYPE: Vendors
		*/
    vendors: Components.DictionaryComponentResponseUInt32DestinyPublicVendorComponent;

    /**
		Categories that the vendor has available, and references to the sales therein.
		These are keyed by the Vendor Hash, so you will get one Categories Component per vendor returned.
		
		COMPONENT TYPE: VendorCategories
		*/
    categories: Components.DictionaryComponentResponseUInt32DestinyVendorCategoriesComponent;

    /**
		Sales, keyed by the vendorItemIndex of the item being sold.
		These are keyed by the Vendor Hash, so you will get one Sale Item Set Component per vendor returned.
		
		Note that within the Sale Item Set component, the sales are themselves keyed by the vendorSaleIndex, so you
		can relate it to the corrent sale item definition within the Vendor's definition.
		
		COMPONENT TYPE: VendorSales
		*/
    sales: Components.DictionaryComponentResponseUInt32PublicDestinyVendorSaleItemSetComponent;

    /**
		A set of string variable values by hash for a public vendors context.
		
		COMPONENT TYPE: StringVariables
		*/
    stringVariables: Components.SingleComponentResponseDestinyStringVariablesComponent;
  }

  export interface PublicDestinyVendorSaleItemSetComponent {
    saleItems: { [key: number]: Vendors.DestinyPublicVendorSaleItemComponent };
  }

  /**
	Returns the detailed information about a Collectible Presentation Node and any Collectibles
	that are direct descendants.
	*/
  export interface DestinyCollectibleNodeDetailResponse {
    /**
		COMPONENT TYPE: Collectibles
		*/
    collectibles: Components.SingleComponentResponseDestinyCollectiblesComponent;

    /**
		Item components, keyed by the item hash of the items pointed at collectibles found under the requested Presentation Node.
		
		NOTE: I had a lot of hemming and hawing about whether these should be keyed by collectible hash or item hash... but
		ultimately having it be keyed by item hash meant that UI that already uses DestinyItemComponentSet data wouldn't have
		to have a special override to do the collectible -> item lookup once you delve into an item's details, and it also
		meant that you didn't have to remember that the Hash being used as the key for plugSets was different from the
		Hash being used for the other Dictionaries.  As a result, using the Item Hash felt like the least crappy solution.
		
		We may all come to regret this decision.  We will see.
		
		COMPONENT TYPE: [See inside the DestinyItemComponentSet contract for component types.]
		*/
    collectibleItemComponents: Sets.DestinyItemComponentSetUInt32;
  }

  export interface DestinyItemChangeResponse {
    item: Responses.DestinyItemResponse;

    addedInventoryItems: Items.DestinyItemComponent[];

    removedInventoryItems: Items.DestinyItemComponent[];
  }

  /**
	this returns the relevant entitlements/purchases made on that platform when possible to
	determine that info.  In some cases, like if your entitlement comes from physical disks,
	it will not be possible to return that information.
	*/
  export interface DestinyEntitlementsResponse {
    /**
		Keyed by the Membership Type related to the platform on which you have made purchases,
		This returns the per-platform entitlement info.
		*/
    platformEntitlements: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: Responses.DestinyPlatformEntitlements;
    };

    /**
		Mostly the same information as platformEntitlements, except keyed by marketplace.
		*/
    platformEntitlementsByMarketplace: {
      [K in EnumStrings<
        typeof Globals.BungieMarketplaceType
      >]?: Responses.DestinyPlatformEntitlements;
    };

    /**
		Seasons are accessible/purchased on a per-profile basis,
		*/
    profileSeasons: { [key: string]: Seasons.DestinySeasonEntitlements };
  }
}

export declare namespace Invitations {
  export interface InvitationResponseCodeDetail {
    invitationId: string;

    membershipId: string;

    resolutionStatus: Globals.InvitationResponseState;

    expireDate: string;

    invitationType: Globals.InvitationType;

    requestingObjectId: string;

    targetObjectId?: string;

    targetState?: number;

    requestMessage: string;

    responseMessage: string;

    responseCode: string;

    hasExpired: boolean;

    message: string;

    membershipIdCreated: string;

    canRespond: boolean;
  }

  export interface Invitation {
    invitationId: string;

    invitationType: Globals.InvitationType;

    dateCreated: string;

    dateResolved?: string;

    expireDate: string;

    membershipIdCreated: string;

    membershipIdResolved?: string;

    requestingObjectId: string;

    resolutionStatus: Globals.InvitationResponseState;

    targetObjectId?: string;

    targetState?: number;

    requestMessage: string;

    responseMessage: string;

    isExpired: boolean;
  }
}

export declare namespace World {
  /**
	Information about a current character's status with a Progression.
	A progression is a value that can increase with activity and has levels.
	Think Character Level and Reputation Levels.
	Combine this "live" data with the related DestinyProgressionDefinition for a full picture
	of the Progression.
	*/
  export interface DestinyProgression {
    /**
		The hash identifier of the Progression in question.  Use it to look up the DestinyProgressionDefinition in static data.
		*/
    progressionHash: number;

    /**
		The amount of progress earned today for this progression.
		*/
    dailyProgress: number;

    /**
		If this progression has a daily limit, this is that limit.
		*/
    dailyLimit: number;

    /**
		The amount of progress earned toward this progression in the current week.
		*/
    weeklyProgress: number;

    /**
		If this progression has a weekly limit, this is that limit.
		*/
    weeklyLimit: number;

    /**
		This is the total amount of progress obtained overall for this
		progression (for instance, the total amount of Character Level experience earned)
		*/
    currentProgress: number;

    /**
		This is the level of the progression (for instance, the Character Level).
		*/
    level: number;

    /**
		This is the maximum possible level you can achieve for this progression (for example, the maximum
		character level obtainable)
		*/
    levelCap: number;

    /**
		Progressions define their levels in "steps".  Since the last step may be repeatable, the user may
		be at a higher level than the actual Step achieved in the progression.  Not necessarily useful, but
		potentially interesting for those cruising the API.  Relate this to the "steps" property of the DestinyProgression
		to see which step the user is on, if you care about that.  (Note that this is Content Version dependent since
		it refers to indexes.)
		*/
    stepIndex: number;

    /**
		The amount of progression (i.e. "Experience") needed to reach the next level of this Progression.
		Jeez, progression is such an overloaded word.
		*/
    progressToNextLevel: number;

    /**
		The total amount of progression (i.e. "Experience") needed in order to reach the next level.
		*/
    nextLevelAt: number;

    /**
		The number of resets of this progression you've executed this season, if applicable to this progression.
		*/
    currentResetCount?: number;

    /**
		Information about historical resets of this progression, if there is any data for it.
		*/
    seasonResets: World.DestinyProgressionResetEntry[];

    /**
		Information about historical rewards for this progression, if there is any data for it.
		*/
    rewardItemStates: Globals.DestinyProgressionRewardItemState[];

    /**
		Information about items stats and states that have socket overrides, if there is any data for it.
		*/
    rewardItemSocketOverrideStates: {
      [key: number]: World.DestinyProgressionRewardItemSocketOverrideState;
    };
  }

  /**
	Represents a season and the number of resets you had in that season.
	
	 We do not necessarily - even for progressions with resets - track it over all seasons.  So be
	 careful and check the season numbers being returned.
	*/
  export interface DestinyProgressionResetEntry {
    season: number;

    resets: number;
  }

  /**
	Represents the stats and item state if applicable for progression reward items with socket overrides
	*/
  export interface DestinyProgressionRewardItemSocketOverrideState {
    /**
		Information about the computed stats from socket and plug overrides for this progression, if there is any data for it.
		*/
    rewardItemStats: { [key: number]: World.DestinyStat };

    /**
		Information about the item state, specifically deepsight if there is any data for it
		*/
    itemState: Globals.ItemState;
  }

  /**
	Represents a stat on an item *or* Character (NOT a Historical Stat, but a physical attribute stat like Attack, Defense etc...)
	*/
  export interface DestinyStat {
    /**
		The hash identifier for the Stat.  Use it to look up the DestinyStatDefinition for static data about the stat.
		*/
    statHash: number;

    /**
		The current value of the Stat.
		*/
    value: number;
  }

  /**
	Used in a number of Destiny contracts to return data about an item stack and its quantity.
	Can optionally return an itemInstanceId if the item is instanced - in which case, the quantity returned
	will be 1.  If it's not... uh, let me know okay?  Thanks.
	*/
  export interface DestinyItemQuantity {
    /**
		The hash identifier for the item in question.  Use it to look up the item's DestinyInventoryItemDefinition.
		*/
    itemHash: number;

    /**
		If this quantity is referring to a specific instance of an item, this will have the item's instance ID.
		Normally, this will be null.
		*/
    itemInstanceId?: string;

    /**
		The amount of the item needed/available depending on the context of where DestinyItemQuantity is being used.
		*/
    quantity: number;

    /**
		Indicates that this item quantity may be conditionally shown or hidden, based on various sources of state.
		For example: server flags, account state, or character progress.
		*/
    hasConditionalVisibility: boolean;
  }

  export interface DyeReference {
    channelHash: number;

    dyeHash: number;
  }

  /**
	Represents the "Live" data that we can obtain about a Character's status with a specific Activity.
	This will tell you whether the character can participate in the activity, as well as some other
	basic mutable information.  
	
	Meant to be combined with static DestinyActivityDefinition data for a full
	picture of the Activity.
	*/
  export interface DestinyActivity {
    /**
		The hash identifier of the Activity.  Use this to look up the DestinyActivityDefinition of the activity.
		*/
    activityHash: number;

    /**
		If true, then the activity should have a "new" indicator in the Director UI.
		*/
    isNew: boolean;

    /**
		If true, the user is allowed to lead a Fireteam into this activity.
		*/
    canLead: boolean;

    /**
		If true, the user is allowed to join with another Fireteam in this activity.
		*/
    canJoin: boolean;

    /**
		If true, we both have the ability to know that the user has completed this activity and
		they have completed it.  Unfortunately, we can't necessarily know this for all activities.  As such,
		this should probably only be used if you already know in advance which specific activities you wish to check.
		*/
    isCompleted: boolean;

    /**
		If true, the user should be able to see this activity.
		*/
    isVisible: boolean;

    /**
		The difficulty level of the activity, if applicable.
		*/
    displayLevel?: number;

    /**
		The recommended light level for the activity, if applicable.
		*/
    recommendedLight?: number;

    /**
		A DestinyActivityDifficultyTier enum value indicating the difficulty of the activity.
		*/
    difficultyTier: Globals.DestinyActivityDifficultyTier;

    challenges: Challenges.DestinyChallengeStatus[];

    /**
		If the activity has modifiers, this will be the list of modifiers that all variants
		have in common.  Perform lookups against DestinyActivityModifierDefinition which defines the modifier 
		being applied to get at the modifier data.
		
		Note that, in the DestiyActivityDefinition, you will see many more modifiers than this
		being referred to: those are all *possible* modifiers for the activity, not the active ones.
		Use only the active ones to match what's really live.
		*/
    modifierHashes: number[];

    /**
		The set of activity options for this activity, keyed by an identifier that's unique for this activity
		(not guaranteed to be unique between or across all activities, though should be unique for every *variant* of a
		given *conceptual* activity: for instance, the original D2 Raid has many variant DestinyActivityDefinitions.  While
		other activities could potentially have the same option hashes, for any given D2 base Raid variant the hash will be unique).
		
		As a concrete example of this data, the hashes you get for Raids will correspond to the currently active "Challenge Mode".
		
		We don't have any human readable information for these, but saavy 3rd party app users could manually associate the key
		(a hash identifier for the "option" that is enabled/disabled) and the value (whether it's enabled or disabled presently)
		
		On our side, we don't necessarily even know what these are used for (the game designers know, but we don't), 
		and we have no human readable data for them.  In order to use them, you will have to do some experimentation.
		*/
    booleanActivityOptions: { [key: number]: boolean };

    /**
		If returned, this is the index into the DestinyActivityDefinition's "loadouts" property,
		indicating the currently active loadout requirements.
		*/
    loadoutRequirementIndex?: number;
  }

  /**
	I see you've come to find out more about Talent Nodes.  I'm so sorry.
	Talent Nodes are the conceptual, visual nodes that appear on Talent Grids.
	Talent Grids, in Destiny 1, were found on almost every instanced item: they had Nodes that could
	be activated to change the properties of the item.
	In Destiny 2, Talent Grids only exist for Builds/Subclasses, and while the basic concept is the same
	(Nodes can be activated once you've gained sufficient Experience on the Item, and provide effects),
	there are some new concepts from Destiny 1.  Examine DestinyTalentGridDefinition and its subordinates
	for more information.
	This is the "Live" information for the current status of a Talent Node on a specific item.
	Talent Nodes have many Steps, but only one can be active at any one time: and it is the Step that determines
	both the visual and the game state-changing properties that the Node provides.  Examine this and DestinyTalentNodeStepDefinition
	carefully.
	*IMPORTANT NOTE* Talent Nodes are, unfortunately, Content Version DEPENDENT.  Though they refer to hashes for Nodes and Steps,
	those hashes are not guaranteed to be immutable across content versions.  This is a source of great exasperation for me,
	but as a result anyone using Talent Grid data must ensure that the content version of their static content
	matches that of the server responses before showing or making decisions based on talent grid data.
	*/
  export interface DestinyTalentNode {
    /**
		The index of the Talent Node being referred to (an index into DestinyTalentGridDefinition.nodes[]).
		CONTENT VERSION DEPENDENT.
		*/
    nodeIndex: number;

    /**
		The hash of the Talent Node being referred to (in DestinyTalentGridDefinition.nodes).
		Deceptively CONTENT VERSION DEPENDENT.  We have no guarantee of the hash's immutability between content versions.
		*/
    nodeHash: number;

    /**
		An DestinyTalentNodeState enum value indicating the node's state: whether it can be activated or swapped, and why not
		if neither can be performed.
		*/
    state: Globals.DestinyTalentNodeState;

    /**
		If true, the node is activated: it's current step then provides its benefits.
		*/
    isActivated: boolean;

    /**
		The currently relevant Step for the node.  It is this step that has rendering data for the node
		and the benefits that are provided if the node is activated.  (the actual rules for benefits provided
		are extremely complicated in theory, but with how Talent Grids are being used in Destiny 2 you don't have to worry
		about a lot of those old Destiny 1 rules.)  This is an index into:
		DestinyTalentGridDefinition.nodes[nodeIndex].steps[stepIndex]
		*/
    stepIndex: number;

    /**
		If the node has material requirements to be activated, this is the list of those requirements.
		*/
    materialsToUpgrade: Definitions.DestinyMaterialRequirement[];

    /**
		The progression level required on the Talent Grid in order to be able to activate this talent node.
		Talent Grids have their own Progression - similar to Character Level, but in this case it is experience
		related to the item itself.
		*/
    activationGridLevel: number;

    /**
		If you want to show a progress bar or circle for how close this talent node is to being activate-able, this
		is the percentage to show.  It follows the node's underlying rules about when the progress bar should first
		show up, and when it should be filled.
		*/
    progressPercent: number;

    /**
		Whether or not the talent node is actually visible in the game's UI.  Whether you want to show it in your own
		UI is up to you!  I'm not gonna tell you who to sock it to.
		*/
    hidden: boolean;

    /**
		This property has some history.  A talent grid can provide stats on both the item it's related to and
		the character equipping the item.  This returns data about those stat bonuses.
		*/
    nodeStatsBlock: World.DestinyTalentNodeStatBlock;
  }

  /**
	This property has some history.  A talent grid can provide stats on both the item it's related to and
	the character equipping the item.  This returns data about those stat bonuses.
	*/
  export interface DestinyTalentNodeStatBlock {
    /**
		The stat benefits conferred when this talent node is activated for the current Step that is active on the node.
		*/
    currentStepStats: World.DestinyStat[];

    /**
		This is a holdover from the old days of Destiny 1, when a node could be activated multiple times, conferring
		multiple steps worth of benefits: you would use this property to show what activating the "next" step on the node
		would provide vs. what the current step is providing.
		While Nodes are currently not being used this way, the underlying system for this functionality still exists.
		I hesitate to remove this property while the ability for designers to make such a talent grid still exists.
		Whether you want to show it is up to you.
		*/
    nextStepStats: World.DestinyStat[];
  }

  /**
	Indicates the status of an "Unlock Flag" on a Character or Profile.
	
	These are individual bits of state that can be either set or not set, and sometimes provide interesting
	human-readable information in their related DestinyUnlockDefinition.
	*/
  export interface DestinyUnlockStatus {
    /**
		The hash identifier for the Unlock Flag.  Use to lookup DestinyUnlockDefinition for static data.
		Not all unlocks have human readable data - in fact, most don't.  But when they do, it can be very useful to show.
		Even if they don't have human readable data, you might be able to infer the meaning of an unlock flag
		with a bit of experimentation...
		*/
    unlockHash: number;

    /**
		Whether the unlock flag is set.
		*/
    isSet: boolean;
  }

  /**
	The results of a bulk Equipping operation performed through the Destiny API.
	*/
  export interface DestinyEquipItemResults {
    equipResults: World.DestinyEquipItemResult[];
  }

  /**
	The results of an Equipping operation performed through the Destiny API.
	*/
  export interface DestinyEquipItemResult {
    /**
		The instance ID of the item in question (all items that can be equipped must, but definition,
		be Instanced and thus have an Instance ID that you can use to refer to them)
		*/
    itemInstanceId: string;

    /**
		A PlatformErrorCodes enum indicating whether it succeeded, and if it failed why.
		*/
    equipStatus: Globals.PlatformErrorCodes;
  }
}

export declare namespace Messages {
  export interface MessageConversation {
    conversationId: string;

    memberFromId: string;

    dateStarted: string;

    totalMessageCount: number;

    lastMessageSent: string;

    lastMessageId?: string;

    isGlobal?: boolean;

    isLocked?: boolean;

    invitationId?: string;

    starter: string;

    lastRead: string;

    status: number;

    subject: string;

    body: string;

    isAutoResponse: boolean;

    isRead: boolean;

    ownerEntityId: string;

    ownerEntityType: Globals.EntityType;

    targetMembershipId?: string;

    ownerEntityGroupType?: Globals.GroupType;

    systemId?: number;
  }

  export interface MessageConversationMember {
    membershipId: string;

    /**
		This property is deprecated and will always be false.
		*/
    isDeleted?: boolean;
  }

  export interface Message {
    messageId: string;

    conversationId: string;

    dateSent: string;

    subject: string;

    body: string;

    folderId?: number;

    systemId?: number;

    isAutoResponse?: boolean;

    memberFromId: string;

    isDeleted: boolean;

    invitationId?: string;
  }

  /**
	The information about the conversation, including members of that conversation.
	*/
  export interface MessageConversationDetail {
    detail: Messages.MessageConversation;

    participants: Messages.MessageConversationMember[];
  }
}

export declare namespace Requests {
  export interface SaveMessageForConversationRequest {
    conversationId: string;

    subject: string;

    body: string;
  }

  export interface UserIsTypingRequest {
    conversationId: string;
  }

  export interface CreateConversationRequest {
    membersToId: string[];

    subject: string;

    body: string;
  }

  export interface DestinyQueryUnlocksRequest {
    UnlockFlagsToQuery: number[];

    UnlockValuesToQuery: number[];
  }

  export interface DestinyItemTransferRequest {
    itemReferenceHash: number;

    stackSize: number;

    transferToVault: boolean;

    itemId: string;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  /**
	If you want to report a player causing trouble in a game, this request will let you report that player
	and the specific PGCR in which the trouble was caused, along with why.
	
	Please don't do this just because you dislike the person!  I mean, I know people will do it anyways, but 
	can you like take a good walk, or put a curse on them or something?  Do me a solid and reconsider.
	
	Note that this request object doesn't have the actual PGCR ID nor your Account/Character ID in it.
	We will infer that information from your authentication information and the PGCR ID that you pass into
	the URL of the reporting endpoint itself.
	*/
  export interface DestinyReportOffensePgcrRequest {
    /**
		So you've decided to report someone instead of cursing them and their descendants.  Well, okay then.
		This is the category or categorie(s) of infractions for which you are reporting the user.
		These are hash identifiers that map to DestinyReportReasonCategoryDefinition entries.
		*/
    reasonCategoryHashes: number[];

    /**
		If applicable, provide a more specific reason(s) within the general category of problems provided by the
		reasonHash.  This is also an identifier for a reason.  All reasonHashes provided must be children
		of at least one the reasonCategoryHashes provided.
		*/
    reasonHashes: number[];

    /**
		Within the PGCR provided when calling the Reporting endpoint, this should be the character ID of
		the user that you thought was violating terms of use.  They must exist in the PGCR provided.
		*/
    offendingCharacterId: string;
  }
}

export declare namespace Entities {
  export interface EntityActionResult {
    entityId: string;

    result: Globals.PlatformErrorCodes;
  }

  export interface EntityList {
    entityIds: string[];
  }
}

export declare namespace Models {
  export interface GroupInvitationSearchResponse {
    groups: GroupsV2.GroupResponse[];

    results: Invitations.Invitation[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }

  export interface ContentTypeDescription {
    cType: string;

    name: string;

    contentDescription: string;

    previewImage: string;

    priority: number;

    reminder: string;

    properties: Models.ContentTypeProperty[];

    tagMetadata: Models.TagMetadataDefinition[];

    tagMetadataItems: { [key: string]: Models.TagMetadataItem };

    usageExamples: string[];

    showInContentEditor: boolean;

    typeOf: string;

    bindIdentifierToProperty: string;

    boundRegex: string;

    forceIdentifierBinding: boolean;

    allowComments: boolean;

    autoEnglishPropertyFallback: boolean;

    bulkUploadable: boolean;

    previews: Models.ContentPreview[];

    suppressCmsPath: boolean;

    propertySections: Models.ContentTypePropertySection[];
  }

  export interface ContentTypeProperty {
    name: string;

    rootPropertyName: string;

    readableName: string;

    value: string;

    propertyDescription: string;

    localizable: boolean;

    fallback: boolean;

    enabled: boolean;

    order: number;

    visible: boolean;

    isTitle: boolean;

    required: boolean;

    maxLength: number;

    maxByteLength: number;

    maxFileSize: number;

    regexp: string;

    validateAs: string;

    rssAttribute: string;

    visibleDependency: string;

    visibleOn: string;

    datatype: Globals.ContentPropertyDataTypeEnum;

    attributes: { [key: string]: string };

    childProperties: Models.ContentTypeProperty[];

    contentTypeAllowed: string;

    bindToProperty: string;

    boundRegex: string;

    representationSelection: { [key: string]: string };

    defaultValues: Models.ContentTypeDefaultValue[];

    isExternalAllowed: boolean;

    propertySection: string;

    weight: number;

    entitytype: string;

    isCombo: boolean;

    suppressProperty: boolean;

    legalContentTypes: string[];

    representationValidationString: string;

    minWidth: number;

    maxWidth: number;

    minHeight: number;

    maxHeight: number;

    isVideo: boolean;

    isImage: boolean;
  }

  export interface ContentTypeDefaultValue {
    whenClause: string;

    whenValue: string;

    defaultValue: string;
  }

  export interface TagMetadataDefinition {
    description: string;

    order: number;

    items: Models.TagMetadataItem[];

    datatype: string;

    name: string;

    isRequired: boolean;
  }

  export interface TagMetadataItem {
    description: string;

    tagText: string;

    groups: string[];

    isDefault: boolean;

    name: string;
  }

  export interface ContentPreview {
    name: string;

    path: string;

    itemInSet: boolean;

    setTag: string;

    setNesting: number;

    useSetId: number;
  }

  export interface ContentTypePropertySection {
    name: string;

    readableName: string;

    collapsed: boolean;
  }

  export interface ContentQueryPublic {
    contentTypes: string[];

    tag: string;

    notTag: string;

    sortBy: Globals.ContentSortBy;

    creationDate: Globals.ContentDateRange;

    modifiedDate: Globals.ContentDateRange;

    itemsPerPage: number;

    currentPage: number;

    requestContinuationToken: string;
  }

  export interface IgnoreQuery {
    itemType: Globals.IgnoredItemType;

    itemsPerPage: number;

    currentPage: number;

    requestContinuationToken: string;
  }

  export interface SurveyEncryptedVariables {
    d: string;

    dn: string;

    ptype: string;

    p: string;

    co: string;

    b: string;

    e: string;

    uq: string;

    fi: string;

    im: string;

    _ts: string;
  }

  export interface SurveyVariablesRequest {
    d: string;

    dn: string;

    ptype: string;

    p: string;

    co: string;

    b: string;

    e: string;

    uq: string;

    fi: string;

    im: string;
  }

  export interface CoreSettingsConfiguration {
    environment: string;

    systems: { [key: string]: Models.CoreSystem };

    ignoreReasons: Models.CoreSetting[];

    forumCategories: Models.CoreSetting[];

    groupAvatars: Models.CoreSetting[];

    defaultGroupTheme: Models.CoreSetting;

    destinyMembershipTypes: Models.CoreSetting[];

    recruitmentPlatformTags: Models.CoreSetting[];

    recruitmentMiscTags: Models.CoreSetting[];

    recruitmentActivities: Models.CoreSetting[];

    userContentLocales: Models.CoreSetting[];

    systemContentLocales: Models.CoreSetting[];

    clanBannerDecals: Models.CoreSetting[];

    clanBannerDecalColors: Models.CoreSetting[];

    clanBannerGonfalons: Models.CoreSetting[];

    clanBannerGonfalonColors: Models.CoreSetting[];

    clanBannerGonfalonDetails: Models.CoreSetting[];

    clanBannerGonfalonDetailColors: Models.CoreSetting[];

    clanBannerStandards: Models.CoreSetting[];

    destiny2CoreSettings: Models.Destiny2CoreSettings;

    emailSettings: User.EmailSettings;

    fireteamActivities: Models.CoreSetting[];
  }

  export interface CoreSystem {
    enabled: boolean;

    parameters: { [key: string]: string };
  }

  export interface CoreSetting {
    identifier: string;

    isDefault: boolean;

    displayName: string;

    summary: string;

    imagePath: string;

    childSettings: Models.CoreSetting[];
  }

  export interface Destiny2CoreSettings {
    collectionRootNode: number;

    badgesRootNode: number;

    recordsRootNode: number;

    medalsRootNode: number;

    metricsRootNode: number;

    activeTriumphsRootNodeHash: number;

    activeSealsRootNodeHash: number;

    legacyTriumphsRootNodeHash: number;

    legacySealsRootNodeHash: number;

    medalsRootNodeHash: number;

    exoticCatalystsRootNodeHash: number;

    loreRootNodeHash: number;

    craftingRootNodeHash: number;

    loadoutConstantsHash: number;

    guardianRankConstantsHash: number;

    fireteamFinderConstantsHash: number;

    guardianRanksRootNodeHash: number;

    currentRankProgressionHashes: number[];

    insertPlugFreeProtectedPlugItemHashes: number[];

    insertPlugFreeBlockedSocketTypeHashes: number[];

    enabledFireteamFinderActivityGraphHashes: number[];

    undiscoveredCollectibleImage: string;

    ammoTypeHeavyIcon: string;

    ammoTypeSpecialIcon: string;

    ammoTypePrimaryIcon: string;

    currentSeasonalArtifactHash: number;

    currentSeasonHash?: number;

    seasonalChallengesPresentationNodeHash?: number;

    futureSeasonHashes: number[];

    pastSeasonHashes: number[];
  }
}

export declare namespace Legacy {
  export interface LegacyConversationV2 {
    conversationId: string;

    memberFromId: string;

    dateStarted: string;

    totalMessageCount: number;

    lastMessageSent: string;

    lastMessageId?: string;

    isGlobal?: boolean;

    isLocked?: boolean;

    memberToId?: string;

    invitationId?: string;

    ownerEntityType: number;

    ownerEntityId?: string;

    starter: string;

    lastRead: string;

    status: number;

    subject: string;

    body: string;

    isAutoResponse: boolean;

    membersToId: Messages.MessageConversationMember[];

    usersTo: User.GeneralUser[];

    invitationDetail: Invitations.InvitationResponseCodeDetail;

    isRead: boolean;
  }

  export interface LegacySaveMessageRequestV2 {
    membersToId: string[];

    conversationId: string;

    subject: string;

    body: string;
  }

  export interface LegacyConversationResponse {
    conversations: Legacy.LegacyConversationV2[];

    unreadCount: number;
  }

  export interface LegacyConversationMessageV2 {
    invitationDetail: Invitations.InvitationResponseCodeDetail;

    messageId: string;

    conversationId: string;

    dateSent: string;

    subject: string;

    body: string;

    folderId?: number;

    systemId?: number;

    isAutoResponse?: boolean;

    memberFromId: string;

    isDeleted: boolean;

    invitationId?: string;

    userFrom: User.GeneralUser;
  }
}

export declare namespace RealTimeEventing {
  export interface EventChannelResponse {
    seq: number;

    tab: number;

    /**
		The is set to true to let the client know it should not re-create this event channel right away.
		It has been replaced by another event channel from the same user.
		*/
    replaced: boolean;

    events: Notifications.RealTimeEventData[];
  }
}

export declare namespace Content {
  export interface ContentItemPublicContract {
    contentId: string;

    cType: string;

    cmsPath: string;

    creationDate: string;

    modifyDate: string;

    allowComments: boolean;

    hasAgeGate: boolean;

    minimumAge: number;

    ratingImagePath: string;

    author: User.GeneralUser;

    autoEnglishPropertyFallback: boolean;

    /**
		Firehose content is really a collection of metadata and "properties", which are
		the potentially-but-not-strictly localizable data that comprises the meat of
		whatever content is being shown.
		
		As Cole Porter would have crooned, "Anything Goes" with Firehose properties.
		They are most often strings, but they can theoretically be anything.  They are JSON
		encoded, and could be JSON structures, simple strings, numbers etc...  The Content Type
		of the item (cType) will describe the properties, and thus how they ought to be deserialized.
		*/
    properties: { [key: string]: any };

    representations: Content.ContentRepresentation[];

    /**
		NOTE: Tags will always be lower case.
		*/
    tags: string[];

    commentSummary: Content.CommentSummary;
  }

  export interface ContentRepresentation {
    name: string;

    path: string;

    validationString: string;
  }

  export interface CommentSummary {
    topicId: string;

    commentCount: number;
  }

  export interface NewsArticleRssResponse {
    CurrentPaginationToken: number;

    NextPaginationToken?: number;

    ResultCountThisPage: number;

    NewsArticles: Content.NewsArticleRssItem[];

    CategoryFilter: string;

    PagerAction: string;
  }

  export interface NewsArticleRssItem {
    Title: string;

    Link: string;

    PubDate: string;

    UniqueIdentifier: string;

    Description: string;

    HtmlContent: string;

    ImagePath: string;

    OptionalMobileImagePath: string;
  }
}

export declare namespace Careers {
  export interface CareerSetResponse {
    categories: Careers.CareerCategory[];
  }

  export interface CareerCategory {
    categoryName: string;

    tag: string;

    careers: Careers.CareerSummary[];
  }

  export interface CareerSummary {
    careerId: string;

    title: string;

    categoryTag: string;
  }

  export interface CareerResponse {
    careerId: string;

    title: string;

    category: string;

    categoryTag: string;

    tags: string[];

    detail: string;

    /**
		If actionLink has a value, that is the link you should go to if you click "Apply" on this career.
		Otherwise, you should initiate an email to be sent to the Bungie Careers email address.
		*/
    actionLink: string;
  }
}

export declare namespace Followers {
  export interface FollowingDecorations {
    displayName: string;

    avatarImage: string;

    sourceMissing: boolean;

    memberType: Globals.RuntimeGroupMemberType;

    allianceStatus: Globals.GroupAllianceStatus;
  }

  export interface LegacyFollowing {
    entityId: string;

    identifier: string;

    entityType: string;

    activityCount: number;
  }

  export interface FollowerResponse {
    user: User.GeneralUser;

    dateFollowed: string;
  }
}

export declare namespace Activities {
  export interface Activity {
    /**
		Globally unique ID for the activity instance.
		*/
    activityId: string;

    /**
		The type of activity that has occurred.  A string, such as "CREATEPOST" for creating a forum post for example.
		Used in combination with the affected item type to determine the message presented as a representation of this activity.
		*/
    activityType: Globals.ActivityType;

    /**
		The ID of the item affected by the activity.  When a user updates their profile, this is the user's membership Id.
		When a post is created, it is the post's Id.
		*/
    affectedItemId: string;

    /**
		This will be used in combination with the activity type to determine
		the message presented as a representation of this activity.
		*/
    affectedItemType: Globals.AffectedItemType;

    affectedItemDescription: string;

    creationDate: string;

    relatedItemId: string;

    relatedMembershipId: string;

    applicationId: number;

    gameVersion: number;
  }

  export interface DestinyItemActivityRecord {
    activityId: string;

    details: Activities.DestinyItemActivityDetails;

    permission: Activities.AwaPermissionRecord;

    application: Applications.ApplicationSummary;
  }

  export interface DestinyItemActivityDetails {
    activityType: Globals.ActivityType;

    activityDescription: string;

    creationDate: string;

    membershipId: string;

    itemSummary: Activities.ItemSummary;

    secondItemSummary: Activities.ItemSummary;

    characterId: string;

    characterSummary: Activities.CharacterSummary;

    membershipType: Globals.BungieMembershipType;

    destinyMembershipId: string;

    stackSize: number;

    /**
		If the operation completed, the outcome field contains the enumeration indicating
		if the operation was successful or failed.
		*/
    outcome?: Globals.PlatformErrorCodes;

    /**
		The player facing text related to the error code in the outcome field.
		*/
    outcomeDescription: string;
  }

  export interface ItemSummary {
    itemReferenceHash: number;

    iconPath: string;

    name: string;

    itemType: string;
  }

  export interface CharacterSummary {
    iconPath: string;

    className: string;

    light: number;

    level: number;
  }

  export interface AwaPermissionRecord {
    /**
		Type of advanced write action.
		*/
    type: Globals.AwaType;

    /**
		Item instance ID the action shall be applied to. This is optional for all but a new
		AwaType values. Rule of thumb is to provide the item instance ID if one is available.
		*/
    itemInstanceId?: string;

    /**
		Destiny membership type of the account to modify.
		*/
    destinyMembershipType: Globals.BungieMembershipType;

    /**
		Destiny membership ID of the account to modify.
		*/
    destinyMembershipId: string;

    /**
		Destiny character ID, if applicable, that will be affected by the action.
		*/
    characterId?: string;

    /**
		The correlation ID of the approved request.
		*/
    correlationId: string;

    /**
		The name of the device that approved the request.
		*/
    deviceName: string;

    /**
		Date and time the request was approved.
		*/
    approvalDate: string;

    /**
		Date and time when the request expires.
		*/
    expiration: string;

    /**
		The maximum number of times a permission token can be used.
		*/
    maxNumberOfUses: number;
  }

  export interface CapturedActivityRequest {
    Challenge: string;

    ActionType: Globals.ActivityType;

    ActionTargetIdentifier: string;

    ActionTargetType: Globals.AffectedItemType;

    ActionContextIdentifier: string;

    ActionContextType: Globals.AffectedItemType;

    ActivityMetadata: { [key: string]: string };
  }

  /**
	Represents the public-facing status of an activity: any data about what is currently active in the
	Activity, regardless of an individual character's progress in it.
	*/
  export interface DestinyPublicActivityStatus {
    /**
		Active Challenges for the activity, if any - represented as hashes for DestinyObjectiveDefinitions.
		*/
    challengeObjectiveHashes: number[];

    /**
		The active modifiers on this activity, if any - represented as hashes for DestinyActivityModifierDefinitions.
		*/
    modifierHashes: number[];

    /**
		If the activity itself provides any specific "mock" rewards, this will be the items and their quantity.
		
		Why "mock", you ask?  Because these are the rewards as they are represented in the tooltip of the Activity.
		
		These are often pointers to fake items that look good in a tooltip, but represent an abstract concept of 
		what you will get for a reward rather than the specific items you may obtain.
		*/
    rewardTooltipItems: World.DestinyItemQuantity[];
  }
}

export declare namespace Core {
  /**
	Use when you need to send a date and string together across the wire.
	*/
  export interface StringDatePackage {
    Data: string;

    Date: string;
  }

  export interface BungieNetVersionInfo {
    BuildNumber: string;

    FullVersionString: string;

    IsLocalBuild: boolean;

    DestinyContentVersionString: string;

    AnonIdentifier: User.IAnonymousIdentifier;
  }

  export interface GlobalAlert {
    AlertKey: string;

    AlertHtml: string;

    AlertTimestamp: string;

    AlertLink: string;

    AlertLevel: Globals.GlobalAlertLevel;

    AlertType: Globals.GlobalAlertType;

    StreamInfo: Core.StreamInfo;
  }

  export interface StreamInfo {
    ChannelName: string;
  }

  export interface ScheduledBroadcastNotification {
    Id: string;

    BroadcastTitle: string;

    BroadcastMessage: string;

    BroadcastLink: string;

    BroadcastTime: string;
  }
}

export declare namespace Forums {
  /**
	This response object returns information about edits made to a specific Forum Post.
	
	 This should be useful for admins/support/ninjas who need this information.
	*/
  export interface PostRevisionHistoryResponse {
    postId: string;

    revisions: Forums.PostRevisionHistoryEntry[];
  }

  /**
	A specific edit made to a forum post.
	*/
  export interface PostRevisionHistoryEntry {
    editId: string;

    editorMembershipId: string;

    editorDisplayName: string;

    subject: string;

    body: string;

    urlLinkOrImage: string;

    category: Globals.ForumPostCategoryEnums;

    flags: Globals.ForumFlagsEnum;

    editDate: string;

    playerSupportFlags?: number;

    playerSupportMetadata: string;

    awaitingApproval: boolean;

    forumId?: number;
  }
}

export declare namespace Admin {
  export interface GiftSubscriptionBountyHistoryResponse {
    requestingUser: User.GeneralUser;

    twitchName: string;

    twitchId: string;

    isTwitchLinked: boolean;

    broadcasterTwitchId?: string;

    selectedRewardPlatform: Globals.BungieMembershipType;

    history: Admin.GiftSubscriptionEntry[];

    unclaimed: Admin.GiftSubscriptionUnclaimed[];

    adminGrantHistory: Admin.GiftSubscriptionAdminEntry[];
  }

  export interface GiftSubscriptionEntry {
    giftSubscriptionId: string;

    receiverTwitchId?: string;

    broadcasterTwitchId?: string;

    broadcasterTwitchName: string;

    isCompleted: boolean;

    dateGranted?: string;

    admin: Admin.GiftSubscriptionAdminDetail;
  }

  export interface GiftSubscriptionAdminDetail {
    grantReason: string;

    adminMembershipId: string;
  }

  export interface GiftSubscriptionUnclaimed {
    receiverTwitchId: string;

    receiverTwitchName: string;
  }

  export interface GiftSubscriptionAdminEntry {
    giftSubscriptionId: string;

    dateGranted: string;

    receiverTwitchId?: string;

    broadcasterTwitchId?: string;

    admin: Admin.GiftSubscriptionAdminDetail;
  }

  export interface GiftSubscriptionGrantResponse {
    grantedSubscription: Admin.GiftSubscriptionEntry;
  }

  export interface GiftSubscriptionGrantRequest {
    giftSubscriptionId?: string;

    grantReason: string;

    grantedToBnetMembershipId: string;

    broadcasterTwitchId?: string;

    receiverTwitchId?: string;
  }
}

export declare namespace Records {
  export interface DestinyRecordDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Indicates whether this Record's state is determined on a per-character or on an account-wide basis.
		*/
    scope: Globals.DestinyScope;

    presentationInfo: Presentation.DestinyPresentationChildBlock;

    loreHash?: number;

    objectiveHashes: number[];

    recordValueStyle: Globals.DestinyRecordValueStyle;

    forTitleGilding: boolean;

    /**
		A hint to show a large icon for a reward
		*/
    shouldShowLargeIcons: boolean;

    titleInfo: Records.DestinyRecordTitleBlock;

    completionInfo: Records.DestinyRecordCompletionBlock;

    stateInfo: Records.SchemaRecordStateBlock;

    requirements: Presentation.DestinyPresentationNodeRequirementsBlock;

    expirationInfo: Records.DestinyRecordExpirationBlock;

    /**
		Some records have multiple 'interval' objectives, and the record may be claimed at each completed interval
		*/
    intervalInfo: Records.DestinyRecordIntervalBlock;

    /**
		If there is any publicly available information about rewards earned for achieving this record,
		 this is the list of those items.
		
		 However, note that some records intentionally have "hidden" rewards.  These will not be returned
		 in this list.
		*/
    rewardItems: World.DestinyItemQuantity[];

    /**
		A display name for the type of record this is (Triumphs, Lore, Medals, Seasonal Challenge, etc.).
		*/
    recordTypeName: string;

    presentationNodeType: Globals.DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyRecordTitleBlock {
    hasTitle: boolean;

    titlesByGender: {
      [K in EnumStrings<typeof Globals.DestinyGender>]?: string;
    };

    /**
		For those who prefer to use the definitions.
		*/
    titlesByGenderHash: { [key: number]: string };

    gildingTrackingRecordHash?: number;
  }

  export interface DestinyRecordCompletionBlock {
    /**
		The number of objectives that must be completed before the objective is considered "complete"
		*/
    partialCompletionObjectiveCountThreshold: number;

    ScoreValue: number;

    shouldFireToast: boolean;

    toastStyle: Globals.DestinyRecordToastStyle;
  }

  export interface SchemaRecordStateBlock {
    featuredPriority: number;

    /**
		A display name override to show when this record is 'obscured' instead of the default obscured display name.
		*/
    obscuredName: string;

    /**
		A display description override to show when this record is 'obscured' instead of the default obscured display description.
		*/
    obscuredDescription: string;
  }

  /**
	If this record has an expiration after which it cannot be earned, this is some information about
	that expiration.
	*/
  export interface DestinyRecordExpirationBlock {
    hasExpiration: boolean;

    description: string;

    icon: string;
  }

  export interface DestinyRecordIntervalBlock {
    intervalObjectives: Records.DestinyRecordIntervalObjective[];

    intervalRewards: Records.DestinyRecordIntervalRewards[];

    originalObjectiveArrayInsertionIndex: number;
  }

  export interface DestinyRecordIntervalObjective {
    intervalObjectiveHash: number;

    intervalScoreValue: number;
  }

  export interface DestinyRecordIntervalRewards {
    intervalRewardItems: World.DestinyItemQuantity[];
  }

  export interface DestinyProfileRecordsComponent {
    /**
		Your 'active' Triumphs score, maintained for backwards compatibility.
		*/
    score: number;

    /**
		Your 'active' Triumphs score.
		*/
    activeScore: number;

    /**
		Your 'legacy' Triumphs score.
		*/
    legacyScore: number;

    /**
		Your 'lifetime' Triumphs score.
		*/
    lifetimeScore: number;

    /**
		If this profile is tracking a record, this is the hash identifier of the record it is tracking.
		*/
    trackedRecordHash?: number;

    records: { [key: number]: Records.DestinyRecordComponent };

    recordCategoriesRootNodeHash: number;

    recordSealsRootNodeHash: number;
  }

  export interface DestinyRecordComponent {
    state: Globals.DestinyRecordState;

    objectives: Quests.DestinyObjectiveProgress[];

    intervalObjectives: Quests.DestinyObjectiveProgress[];

    intervalsRedeemedCount: number;

    /**
		If available, this is the number of times this record has been completed.
		For example, the number of times a seal title has been gilded.
		*/
    completedCount?: number;

    /**
		If available, a list that describes which reward rewards should be shown (true) or hidden (false).
		This property is for regular record rewards, and not for interval objective rewards.
		*/
    rewardVisibilty: boolean[];
  }

  export interface DestinyCharacterRecordsComponent {
    featuredRecordHashes: number[];

    records: { [key: number]: Records.DestinyRecordComponent };

    recordCategoriesRootNodeHash: number;

    recordSealsRootNodeHash: number;
  }
}

export declare namespace Presentation {
  export interface DestinyPresentationChildBlock {
    presentationNodeType: Globals.DestinyPresentationNodeType;

    parentPresentationNodeHashes: number[];

    displayStyle: Globals.DestinyPresentationDisplayStyle;
  }

  /**
	Presentation nodes can be restricted by various requirements.  This defines the rules
	of those requirements, and the message(s) to be shown if these requirements aren't met.
	*/
  export interface DestinyPresentationNodeRequirementsBlock {
    /**
		If this node is not accessible due to Entitlements (for instance, you don't own
		the required game expansion), this is the message to show.
		*/
    entitlementUnavailableMessage: string;
  }

  export interface DestinyPresentationNodesComponent {
    nodes: { [key: number]: Presentation.DestinyPresentationNodeComponent };
  }

  export interface DestinyPresentationNodeComponent {
    state: Globals.DestinyPresentationNodeState;

    /**
		An optional property: presentation nodes MAY have objectives, which can be used to infer
		more human readable data about the progress.  However, progressValue and completionValue
		ought to be considered the canonical values for progress on Progression Nodes.
		*/
    objective: Quests.DestinyObjectiveProgress;

    /**
		How much of the presentation node is considered to be completed so far by the given character/profile.
		*/
    progressValue: number;

    /**
		The value at which the presentation node is considered to be completed.
		*/
    completionValue: number;

    /**
		If available, this is the current score for the record category that this node represents.
		*/
    recordCategoryScore?: number;
  }

  /**
	A PresentationNode is an entity that represents a logical grouping of other entities visually/organizationally.
	
	For now, Presentation Nodes may contain the following... but it may be used for more in the future:
	
	- Collectibles
	- Records (Or, as the public will call them, "Triumphs."  Don't ask me why we're overloading the term "Triumph", 
	it still hurts me to think about it)
	- Metrics (aka Stat Trackers)
	- Other Presentation Nodes, allowing a tree of Presentation Nodes to be created
	
	Part of me wants to break these into conceptual definitions per entity being collected, but the possibility of 
	these different types being mixed in the same UI and the possibility that it could actually be more useful to return
	the "bare metal" presentation node concept has resulted in me deciding against that for the time being.
	
	We'll see if I come to regret this as well.
	*/
  export interface DestinyPresentationNodeDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The original icon for this presentation node, before we futzed with it.
		*/
    originalIcon: string;

    /**
		Some presentation nodes are meant to be explicitly shown on the "root" or "entry" screens for the feature to 
		which they are related.  You should use this icon when showing them on such a view, if you have a similar "entry point"
		view in your UI.  If you don't have a UI, then I guess it doesn't matter either way does it?
		*/
    rootViewIcon: string;

    nodeType: Globals.DestinyPresentationNodeType;

    /**
		Primarily for Guardian Ranks, this property if the contents of this node are tied to the current season.
		These nodes are shown with a different color for the in-game Guardian Ranks display.
		*/
    isSeasonal: boolean;

    /**
		Indicates whether this presentation node's state is determined on a per-character or on an account-wide basis.
		*/
    scope: Globals.DestinyScope;

    /**
		If this presentation node shows a related objective (for instance, if it tracks the progress of its
		children), the objective being tracked is indicated here.
		*/
    objectiveHash?: number;

    /**
		If this presentation node has an associated "Record" that you can accomplish for completing its
		children, this is the identifier of that Record.
		*/
    completionRecordHash?: number;

    /**
		The child entities contained by this presentation node.
		*/
    children: Presentation.DestinyPresentationNodeChildrenBlock;

    /**
		A hint for how to display this presentation node when it's shown in a list.
		*/
    displayStyle: Globals.DestinyPresentationDisplayStyle;

    /**
		A hint for how to display this presentation node when it's shown in its own detail screen.
		*/
    screenStyle: Globals.DestinyPresentationScreenStyle;

    /**
		The requirements for being able to interact with this presentation node and its children.
		*/
    requirements: Presentation.DestinyPresentationNodeRequirementsBlock;

    /**
		If this presentation node has children, but the game doesn't let you inspect the details
		of those children, that is indicated here.
		*/
    disableChildSubscreenNavigation: boolean;

    maxCategoryRecordScore: number;

    presentationNodeType: Globals.DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	As/if presentation nodes begin to host more entities as children, these lists will be added to.
	One list property exists per type of entity that can be treated as a child of this presentation
	node, and each holds the identifier of the entity and any associated information needed to
	display the UI for that entity (if anything)
	*/
  export interface DestinyPresentationNodeChildrenBlock {
    presentationNodes: Presentation.DestinyPresentationNodeChildEntry[];

    collectibles: Presentation.DestinyPresentationNodeCollectibleChildEntry[];

    records: Presentation.DestinyPresentationNodeRecordChildEntry[];

    metrics: Presentation.DestinyPresentationNodeMetricChildEntry[];

    craftables: Presentation.DestinyPresentationNodeCraftableChildEntry[];
  }

  export interface DestinyPresentationNodeChildEntry {
    presentationNodeHash: number;

    nodeDisplayPriority: number;
  }

  export interface DestinyPresentationNodeCollectibleChildEntry {
    collectibleHash: number;

    nodeDisplayPriority: number;
  }

  export interface DestinyPresentationNodeRecordChildEntry {
    recordHash: number;

    nodeDisplayPriority: number;
  }

  export interface DestinyPresentationNodeMetricChildEntry {
    metricHash: number;

    nodeDisplayPriority: number;
  }

  export interface DestinyPresentationNodeCraftableChildEntry {
    craftableItemHash: number;

    nodeDisplayPriority: number;
  }
}

export declare namespace Collectibles {
  /**
	Defines a
	*/
  export interface DestinyCollectibleDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Indicates whether the state of this Collectible is determined on a per-character or on an account-wide basis.
		*/
    scope: Globals.DestinyScope;

    /**
		A human readable string for a hint about how to acquire the item.
		*/
    sourceString: string;

    /**
		This is a hash identifier we are building on the BNet side in an attempt to let people group collectibles
		by similar sources.
		
		I can't promise that it's going to be 100% accurate, but if the designers were consistent in assigning
		the same source strings to items with the same sources, it *ought to* be.  No promises though.
		
		This hash also doesn't relate to an actual definition, just to note: we've got nothing useful other than
		the source string for this data.
		*/
    sourceHash?: number;

    itemHash: number;

    acquisitionInfo: Collectibles.DestinyCollectibleAcquisitionBlock;

    stateInfo: Collectibles.DestinyCollectibleStateBlock;

    presentationInfo: Presentation.DestinyPresentationChildBlock;

    presentationNodeType: Globals.DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyCollectibleAcquisitionBlock {
    acquireMaterialRequirementHash?: number;

    acquireTimestampUnlockValueHash?: number;
  }

  export interface DestinyCollectibleStateBlock {
    obscuredOverrideItemHash?: number;

    requirements: Presentation.DestinyPresentationNodeRequirementsBlock;
  }

  export interface DestinyCollectiblePurchaseBlock {
    purchaseDisabledReason: string;

    disablePurchasing: boolean;
  }

  export interface DestinyProfileCollectiblesComponent {
    /**
		The list of collectibles determined by the game as having been "recently" acquired.
		*/
    recentCollectibleHashes: number[];

    /**
		The list of collectibles determined by the game as having been "recently" acquired.
		
		The game client itself actually controls this data, so I personally question whether anyone
		will get much use out of this: because we can't edit this value through the API.  But in case
		anyone finds it useful, here it is.
		*/
    newnessFlaggedCollectibleHashes: number[];

    collectibles: { [key: number]: Collectibles.DestinyCollectibleComponent };

    collectionCategoriesRootNodeHash: number;

    collectionBadgesRootNodeHash: number;
  }

  export interface DestinyCollectibleComponent {
    state: Globals.DestinyCollectibleState;
  }

  export interface DestinyCollectiblesComponent {
    collectibles: { [key: number]: Collectibles.DestinyCollectibleComponent };

    /**
		The hash for the root presentation node definition of Collection categories.
		*/
    collectionCategoriesRootNodeHash: number;

    /**
		The hash for the root presentation node definition of Collection Badges.
		*/
    collectionBadgesRootNodeHash: number;
  }
}

export declare namespace Definitions {
  /**
	So much of what you see in Destiny is actually an Item used in a new and creative way.
	This is the definition for Items in Destiny, which started off as just entities that could exist
	in your Inventory but ended up being the backing data for so much more: quests, reward previews,
	slots, and subclasses.
	
	In practice, you will want to associate this data with "live" item data
	from a Bungie.Net Platform call: these definitions describe the item in generic, non-instanced
	terms: but an actual instance of an item can vary widely from these generic definitions.
	*/
  export interface DestinyInventoryItemDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Tooltips that only come up conditionally for the item.  Check the live data 
		DestinyItemComponent.tooltipNotificationIndexes property for which of these should be shown at runtime.
		*/
    tooltipNotifications: Definitions.DestinyItemTooltipNotification[];

    /**
		If this item has a collectible related to it, this is the hash identifier of that collectible entry.
		*/
    collectibleHash?: number;

    /**
		If available, this is the original 'active' release watermark overlay for the icon.
		If the item has different versions, this can be overridden by the 'display version watermark icon' from the 'quality' block.
		Alternatively, if there is no watermark for the version, and the item version has a power cap below the current season power cap,
		this can be overridden by the iconWatermarkShelved property.
		*/
    iconWatermark: string;

    /**
		If available, this is the 'shelved' release watermark overlay for the icon.
		If the item version has a power cap below the current season power cap, it can be treated as 'shelved',
		and should be shown with this 'shelved' watermark overlay.
		*/
    iconWatermarkShelved: string;

    /**
		A secondary icon associated with the item.  Currently this is used in very context specific
		applications, such as Emblem Nameplates.
		*/
    secondaryIcon: string;

    /**
		Pulled from the secondary icon, this is the "secondary background" of the secondary
		icon.  Confusing?  Sure, that's why I call it "overlay" here: because as far as it's
		been used thus far, it has been for an optional overlay image.  We'll see if that holds up,
		but at least for now it explains what this image is a bit better.
		*/
    secondaryOverlay: string;

    /**
		Pulled from the Secondary Icon, this is the "special" background for the item.
		For Emblems, this is the background image used on the Details view: but it need
		not be limited to that for other types of items.
		*/
    secondarySpecial: string;

    /**
		Sometimes, an item will have a background color.  Most notably this occurs with Emblems, who use the Background Color
		for small character nameplates such as the "friends" view you see in-game.  There are almost certainly other items
		that have background color as well, though I have not bothered to investigate what items have it nor what purposes they serve:
		use it as you will.
		*/
    backgroundColor: Misc.DestinyColor;

    /**
		If we were able to acquire an in-game screenshot for the item, the path to that screenshot
		will be returned here.  Note that not all items have screenshots: particularly not any non-equippable
		items.
		*/
    screenshot: string;

    /**
		The localized title/name of the item's type.  This can be whatever the designers want, and has no guarantee
		of consistency between items.
		*/
    itemTypeDisplayName: string;

    flavorText: string;

    /**
		A string identifier that the game's UI uses to determine how the item should be rendered in inventory screens and the like.
		This could really be anything - at the moment, we don't have the time to really breakdown and maintain all the possible 
		strings this could be, partly because new ones could be added ad hoc.  But if you want to use it to dictate your own UI, or
		look for items with a certain display style, go for it!
		*/
    uiItemDisplayStyle: string;

    /**
		It became a common enough pattern in our UI to show Item Type and Tier combined into a single localized
		string that I'm just going to go ahead and start pre-creating these for items.
		*/
    itemTypeAndTierDisplayName: string;

    /**
		In theory, it is a localized string telling you about how you can find the item.
		I really wish this was more consistent.  Many times, it has nothing.  Sometimes, it's instead a more narrative-forward
		description of the item.  Which is cool, and I wish all properties had that data, but it should really be
		its own property.
		*/
    displaySource: string;

    /**
		An identifier that the game UI uses to determine what type of tooltip to show for the item.  These have no
		corresponding definitions that BNet can link to: so it'll be up to you to interpret and display your UI differently
		according to these styles (or ignore it).
		*/
    tooltipStyle: string;

    /**
		If the item can be "used", this block will be non-null, and will have data related to the action performed
		when using the item.  (Guess what?  99% of the time, this action is "dismantle".  Shocker)
		*/
    action: Definitions.DestinyItemActionBlockDefinition;

    /**
		Recipe items will have relevant crafting information available here.
		*/
    crafting: Definitions.DestinyItemCraftingBlockDefinition;

    /**
		If this item can exist in an inventory, this block will be non-null.  In practice,
		every item that currently exists has one of these blocks.  But note that it is not necessarily guaranteed.
		*/
    inventory: Definitions.DestinyItemInventoryBlockDefinition;

    /**
		If this item is a quest, this block will be non-null.  In practice, I wish I had called this the Quest
		block, but at the time it wasn't clear to me whether it would end up being used for purposes other than quests.
		It will contain data about the steps in the quest, and mechanics we can use for displaying and tracking the quest.
		*/
    setData: Definitions.DestinyItemSetBlockDefinition;

    /**
		If this item can have stats (such as a weapon, armor, or vehicle), this block will be non-null and
		populated with the stats found on the item.
		*/
    stats: Definitions.DestinyItemStatBlockDefinition;

    /**
		If the item is an emblem that has a special Objective attached to it - for instance, if the emblem
		tracks PVP Kills, or what-have-you.  This is a bit different from, for example, the Vanguard Kill Tracker
		mod, which pipes data into the "art channel".  When I get some time, I would like to standardize these so
		you can get at the values they expose without having to care about what they're being used for and how they
		are wired up, but for now here's the raw data.
		*/
    emblemObjectiveHash?: number;

    /**
		If this item can be equipped, this block will be non-null and will be populated with the conditions
		under which it can be equipped.
		*/
    equippingBlock: Definitions.DestinyEquippingBlockDefinition;

    /**
		If this item can be rendered, this block will be non-null and will be populated with rendering
		information.
		*/
    translationBlock: Definitions.DestinyItemTranslationBlockDefinition;

    /**
		If this item can be Used or Acquired to gain other items (for instance, how Eververse Boxes
		can be consumed to get items from the box), this block will be non-null and will give summary information
		for the items that can be acquired.
		*/
    preview: Definitions.DestinyItemPreviewBlockDefinition;

    /**
		If this item can have a level or stats, this block will be non-null and will be populated
		with default quality (item level, "quality", and infusion) data.  See the block for more details, there's
		often less upfront information in D2 so you'll want to be aware of how you use quality and item level on
		the definition level now.
		*/
    quality: Definitions.DestinyItemQualityBlockDefinition;

    /**
		The conceptual "Value" of an item, if any was defined.  See the DestinyItemValueBlockDefinition for more details.
		*/
    value: Definitions.DestinyItemValueBlockDefinition;

    /**
		If this item has a known source, this block will be non-null and populated
		with source information.  Unfortunately, at this time we are not generating sources: that is some
		aggressively manual work which we didn't have time for, and I'm hoping to get back to at some point in the future.
		*/
    sourceData: Definitions.DestinyItemSourceBlockDefinition;

    /**
		If this item has Objectives (extra tasks that can be accomplished related to the item... most frequently
		when the item is a Quest Step and the Objectives need to be completed to move on to the next Quest Step),
		this block will be non-null and the objectives defined herein.
		*/
    objectives: Definitions.DestinyItemObjectiveBlockDefinition;

    /**
		If this item has available metrics to be shown, this block will be non-null have the appropriate hashes defined.
		*/
    metrics: Definitions.DestinyItemMetricBlockDefinition;

    /**
		If this item *is* a Plug, this will be non-null and the info defined herein.
		See DestinyItemPlugDefinition for more information.
		*/
    plug: Items.DestinyItemPlugDefinition;

    /**
		If this item has related items in a "Gear Set", this will be non-null and the relationships defined herein.
		*/
    gearset: Definitions.DestinyItemGearsetBlockDefinition;

    /**
		If this item is a "reward sack" that can be opened to provide other items, this will be non-null and
		the properties of the sack contained herein.
		*/
    sack: Definitions.DestinyItemSackBlockDefinition;

    /**
		If this item has any Sockets, this will be non-null and the individual sockets on the item
		will be defined herein.
		*/
    sockets: Definitions.DestinyItemSocketBlockDefinition;

    /**
		Summary data about the item.
		*/
    summary: Definitions.DestinyItemSummaryBlockDefinition;

    /**
		If the item has a Talent Grid, this will be non-null and the properties of the grid defined herein.
		Note that, while many items still have talent grids, the only ones with meaningful Nodes still on them
		will be Subclass/"Build" items.
		*/
    talentGrid: Definitions.DestinyItemTalentGridBlockDefinition;

    /**
		If the item has stats, this block will be defined.  It has the "raw" investment stats for the item.
		These investment stats don't take into account the ways that the items can spawn, nor do they take
		into account any Stat Group transformations.  I have retained them for debugging purposes, but I
		do not know how useful people will find them.
		*/
    investmentStats: Definitions.DestinyItemInvestmentStatDefinition[];

    /**
		If the item has any *intrinsic* Perks (Perks that it will provide regardless of Sockets, Talent Grid,
		and other transitory state), they will be defined here.
		*/
    perks: Definitions.DestinyItemPerkEntryDefinition[];

    /**
		If the item has any related Lore (DestinyLoreDefinition), this will be the hash identifier you can use
		to look up the lore definition.
		*/
    loreHash?: number;

    /**
		There are times when the game will show you a "summary/vague" version of an item - such as a description of its type
		represented as a DestinyInventoryItemDefinition - rather than display the item itself.
		
		This happens sometimes when summarizing possible rewards in a tooltip.  This is the item displayed instead, if
		it exists.
		*/
    summaryItemHash?: number;

    /**
		If any animations were extracted from game content for this item, these will be the definitions
		of those animations.
		*/
    animations: Animations.DestinyAnimationReference[];

    /**
		BNet may forbid the execution of actions on this item via the API.  If that is occurring, allowActions will be set to false.
		*/
    allowActions: boolean;

    /**
		If we added any help or informational URLs about this item, these will be those links.
		*/
    links: Links.HyperlinkReference[];

    /**
		The boolean will indicate to us (and you!) whether something *could* happen when you transfer this item from the Postmaster
		that might be considered a "destructive" action.
		
		It is not feasible currently to tell you (or ourelves!) in a consistent way whether this *will* actually cause a destructive action,
		so we are playing it safe: if it has the potential to do so, we will not allow it to be transferred from the Postmaster
		by default.  You will need to check for this flag before transferring an item from the Postmaster, or else you'll end
		up receiving an error.
		*/
    doesPostmasterPullHaveSideEffects: boolean;

    /**
		The intrinsic transferability of an item.
		
		I hate that this boolean is negative - but there's a reason.
		
		Just because an item is intrinsically transferrable doesn't mean that it can be transferred,
		and we don't want to imply that this is the only source of that transferability.
		*/
    nonTransferrable: boolean;

    /**
		BNet attempts to make a more formal definition of item "Categories", as defined by 
		DestinyItemCategoryDefinition.  This is a list of all Categories that we were able to
		algorithmically determine that this item is a member of.  (for instance, that it's a "Weapon",
		that it's an "Auto Rifle", etc...)
		
		The algorithm for these is, unfortunately, volatile.  If you believe you see a miscategorized
		item, please let us know on the Bungie API forums.
		*/
    itemCategoryHashes: number[];

    /**
		In Destiny 1, we identified some items as having particular categories that we'd like to know about
		for various internal logic purposes.  These are defined in SpecialItemType, and while these days
		the itemCategoryHashes are the preferred way of identifying types, we have retained this enum
		for its convenience.
		*/
    specialItemType: Globals.SpecialItemType;

    /**
		A value indicating the "base" the of the item.  This enum is a useful but dramatic oversimplification
		of what it means for an item to have a "Type".  Still, it's handy in many situations.
		
		itemCategoryHashes are the preferred way of identifying types, we have retained this enum
		for its convenience.
		*/
    itemType: Globals.DestinyItemType;

    /**
		A value indicating the "sub-type" of the item.  For instance, where an item might have an
		itemType value "Weapon", this will be something more specific like "Auto Rifle".
		
		itemCategoryHashes are the preferred way of identifying types, we have retained this enum
		for its convenience.
		*/
    itemSubType: Globals.DestinyItemSubType;

    /**
		We run a similarly weak-sauce algorithm to try and determine whether an item is restricted to a specific
		class.  If we find it to be restricted in such a way, we set this classType property to match
		the class' enumeration value so that users can easily identify class restricted items.
		
		If you see a mis-classed item, please inform the developers in the Bungie API forum.
		*/
    classType: Globals.DestinyClass;

    /**
		Some weapons and plugs can have a "Breaker Type": a special ability that works sort of like damage type
		vulnerabilities.  This is (almost?) always set on items by plugs.
		*/
    breakerType: Globals.DestinyBreakerType;

    /**
		Since we also have a breaker type definition, this is the hash for that breaker type for your convenience.
		Whether you use the enum or hash and look up the definition depends on what's cleanest for your code.
		*/
    breakerTypeHash?: number;

    /**
		If true, then you will be allowed to equip the item if you pass its other requirements.
		
		This being false means that you cannot equip the item under any circumstances.
		*/
    equippable: boolean;

    /**
		Theoretically, an item can have many possible damage types.  In *practice*, this is not true,
		but just in case weapons start being made that have multiple (for instance, an item where a socket
		has reusable plugs for every possible damage type that you can choose from freely), this field
		will return all of the possible damage types that are available to the weapon by default.
		*/
    damageTypeHashes: number[];

    /**
		This is the list of all damage types that we know ahead of time the item can take on.
		Unfortunately, this does not preclude the possibility of something funky happening
		to give the item a damage type that cannot be predicted beforehand: for example,
		if some designer decides to create arbitrary non-reusable plugs that cause damage type
		to change.
		
		This damage type prediction will only use the following to determine potential damage types:
		
		- Intrinsic perks
		
		- Talent Node perks
		
		- Known, reusable plugs for sockets
		*/
    damageTypes: Globals.DamageType[];

    /**
		If the item has a damage type that could be considered to be default, it will be populated here.
		
		For various upsetting reasons, it's surprisingly cumbersome to figure this out.  I hope you're happy.
		*/
    defaultDamageType: Globals.DamageType;

    /**
		Similar to defaultDamageType, but represented as the hash identifier for a DestinyDamageTypeDefinition.
		
		I will likely regret leaving in the enumeration versions of these properties, but for now they're
		very convenient.
		*/
    defaultDamageTypeHash?: number;

    /**
		If this item is related directly to a Season of Destiny, this is the hash identifier for that season.
		*/
    seasonHash?: number;

    /**
		If true, this is a dummy vendor-wrapped item template.  Items purchased from Eververse will be "wrapped"
		by one of these items so that we can safely provide refund capabilities before the item is "unwrapped".
		*/
    isWrapper: boolean;

    /**
		Traits are metadata tags applied to this item. For example: armor slot, weapon type, foundry, faction, etc.
		These IDs come from the game and don't map to any content, but should still be useful.
		*/
    traitIds: string[];

    /**
		These are the corresponding trait definition hashes for the entries in traitIds.
		*/
    traitHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyItemTooltipNotification {
    displayString: string;

    displayStyle: string;
  }

  /**
	If an item can have an action performed on it (like "Dismantle"), it will be defined here
	if you care.
	*/
  export interface DestinyItemActionBlockDefinition {
    /**
		Localized text for the verb of the action being performed.
		*/
    verbName: string;

    /**
		Localized text describing the action being performed.
		*/
    verbDescription: string;

    /**
		The content has this property, however it's not entirely clear how it is used.
		*/
    isPositive: boolean;

    /**
		If the action has an overlay screen associated with it, this is the name of that screen.
		Unfortunately, we cannot return the screen's data itself.
		*/
    overlayScreenName: string;

    /**
		The icon associated with the overlay screen for the action, if any.
		*/
    overlayIcon: string;

    /**
		The number of seconds to delay before allowing this action to be performed again.
		*/
    requiredCooldownSeconds: number;

    /**
		If the action requires other items to exist or be destroyed, this is
		the list of those items and requirements.
		*/
    requiredItems: Definitions.DestinyItemActionRequiredItemDefinition[];

    /**
		If performing this action earns you Progression, this is the list of progressions and values granted
		for those progressions by performing this action.
		*/
    progressionRewards: Definitions.DestinyProgressionRewardDefinition[];

    /**
		The internal identifier for the action.
		*/
    actionTypeLabel: string;

    /**
		Theoretically, an item could have a localized string for a hint about the location in which
		the action should be performed.  In practice, no items yet have this property.
		*/
    requiredLocation: string;

    /**
		The identifier hash for the Cooldown associated with this action.  We have not pulled this data yet
		for you to have more data to use for cooldowns.
		*/
    requiredCooldownHash: number;

    /**
		If true, the item is deleted when the action completes.
		*/
    deleteOnAction: boolean;

    /**
		If true, the entire stack is deleted when the action completes.
		*/
    consumeEntireStack: boolean;

    /**
		If true, this action will be performed as soon as you earn this item.
		Some rewards work this way, providing you a single item to pick up from
		a reward-granting vendor in-game and then immediately consuming itself
		to provide you multiple items.
		*/
    useOnAcquire: boolean;
  }

  /**
	The definition of an item and quantity required in a character's inventory in order to
	perform an action.
	*/
  export interface DestinyItemActionRequiredItemDefinition {
    /**
		The minimum quantity of the item you have to have.
		*/
    count: number;

    /**
		The hash identifier of the item you need to have.  Use it to look up the DestinyInventoryItemDefinition for more info.
		*/
    itemHash: number;

    /**
		If true, the item/quantity will be deleted from your inventory when the action is performed.  Otherwise,
		you'll retain these required items after the action is complete.
		*/
    deleteOnAction: boolean;
  }

  /**
	Inventory Items can reward progression when actions are performed on them.  A common example
	of this in Destiny 1 was Bounties, which would reward Experience on your Character and the like 
	when you completed the bounty.
	
	Note that this maps to a DestinyProgressionMappingDefinition, and *not* a DestinyProgressionDefinition
	directly.  This is apparently so that multiple progressions can be granted progression points/experience
	at the same time.
	*/
  export interface DestinyProgressionRewardDefinition {
    /**
		The hash identifier of the DestinyProgressionMappingDefinition that contains the progressions
		for which experience should be applied.
		*/
    progressionMappingHash: number;

    /**
		The amount of experience to give to each of the mapped progressions.
		*/
    amount: number;

    /**
		If true, the game's internal mechanisms to throttle progression should be applied.
		*/
    applyThrottles: boolean;
  }

  /**
	If an item can have an action performed on it (like "Dismantle"), it will be defined here
	if you care.
	*/
  export interface DestinyItemCraftingBlockDefinition {
    /**
		A reference to the item definition that is created when crafting with this 'recipe' item.
		*/
    outputItemHash: number;

    /**
		A list of socket type hashes that describes which sockets are required for crafting with this recipe.
		*/
    requiredSocketTypeHashes: number[];

    failedRequirementStrings: string[];

    /**
		A reference to the base material requirements for crafting with this recipe.
		*/
    baseMaterialRequirements?: number;

    /**
		A list of 'bonus' socket plugs that may be available if certain requirements are met.
		*/
    bonusPlugs: Definitions.DestinyItemCraftingBlockBonusPlugDefinition[];
  }

  export interface DestinyItemCraftingBlockBonusPlugDefinition {
    socketTypeHash: number;

    plugItemHash: number;
  }

  /**
	If the item can exist in an inventory - the overwhelming majority of them can and do -
	then this is the basic properties regarding the item's relationship with the inventory.
	*/
  export interface DestinyItemInventoryBlockDefinition {
    /**
		If this string is populated, you can't have more than one stack with this label in a given inventory.
		Note that this is different from the equipping block's unique label, which is used for equipping uniqueness.
		*/
    stackUniqueLabel: string;

    /**
		The maximum quantity of this item that can exist in a stack.
		*/
    maxStackSize: number;

    /**
		The hash identifier for the DestinyInventoryBucketDefinition to which this item belongs.
		I should have named this "bucketHash", but too many things refer to it now.  Sigh.
		*/
    bucketTypeHash: number;

    /**
		If the item is picked up by the lost loot queue, this is the hash identifier
		for the DestinyInventoryBucketDefinition into which it will be placed.
		Again, I should have named this recoveryBucketHash instead.
		*/
    recoveryBucketTypeHash: number;

    /**
		The hash identifier for the Tier Type of the item, use to look up its DestinyItemTierTypeDefinition
		if you need to show localized data for the item's tier.
		*/
    tierTypeHash: number;

    /**
		If TRUE, this item is instanced.  Otherwise, it is a generic item that merely has a quantity in a stack (like Glimmer).
		*/
    isInstanceItem: boolean;

    /**
		The localized name of the tier type, which is a useful shortcut so you don't have to look up the definition every 
		time.  However, it's mostly a holdover from days before we had a DestinyItemTierTypeDefinition to refer to.
		*/
    tierTypeName: string;

    /**
		The enumeration matching the tier type of the item to known values, again for convenience sake.
		*/
    tierType: Globals.TierType;

    /**
		The tooltip message to show, if any, when the item expires.
		*/
    expirationTooltip: string;

    /**
		If the item expires while playing in an activity, we show a different message.
		*/
    expiredInActivityMessage: string;

    /**
		If the item expires in orbit, we show a... more different message.  ("Consummate V's, consummate!")
		*/
    expiredInOrbitMessage: string;

    suppressExpirationWhenObjectivesComplete: boolean;

    /**
		A reference to the associated crafting 'recipe' item definition, if this item can be crafted.
		*/
    recipeItemHash?: number;
  }

  /**
	Primarily for Quests, this is the definition of properties related to the item if it is a quest
	and its various quest steps.
	*/
  export interface DestinyItemSetBlockDefinition {
    /**
		A collection of hashes of set items, for items such as Quest Metadata items that possess this data.
		*/
    itemList: Definitions.DestinyItemSetBlockEntryDefinition[];

    /**
		If true, items in the set can only be added in increasing order, and adding an item will remove any previous item.
		For Quests, this is by necessity true.  Only one quest step is present at a time, and previous steps are removed
		as you advance in the quest.
		*/
    requireOrderedSetItemAdd: boolean;

    /**
		If true, the UI should treat this quest as "featured"
		*/
    setIsFeatured: boolean;

    /**
		A string identifier we can use to attempt to identify the category of the Quest.
		*/
    setType: string;

    /**
		The name of the quest line that this quest step is a part of.
		*/
    questLineName: string;

    /**
		The description of the quest line that this quest step is a part of.
		*/
    questLineDescription: string;

    /**
		An additional summary of this step in the quest line.
		*/
    questStepSummary: string;
  }

  /**
	Defines a particular entry in an ItemSet (AKA a particular Quest Step in a Quest)
	*/
  export interface DestinyItemSetBlockEntryDefinition {
    /**
		Used for tracking which step a user reached.  These values will be populated in the user's
		internal state, which we expose externally as a more usable DestinyQuestStatus object.
		If this item has been obtained, this value will be set in trackingUnlockValueHash.
		*/
    trackingValue: number;

    /**
		This is the hash identifier for a DestinyInventoryItemDefinition representing this quest step.
		*/
    itemHash: number;
  }

  /**
	Information about the item's calculated stats, with as much data as we can find for the stats
	without having an actual instance of the item.
	
	Note that this means the entire concept of providing these stats is fundamentally insufficient:
	we cannot predict with 100% accuracy the conditions under which an item can spawn, so we use various
	heuristics to attempt to simulate the conditions as accurately as possible.  Actual stats for 
	items in-game can and will vary, but these should at least be useful base points for comparison
	and display.
	
	It is also worth noting that some stats, like Magazine size, have further calculations performed on them
	by scripts in-game and on the game servers that BNet does not have access to.  We cannot know how those stats
	are further transformed, and thus some stats will be inaccurate even on instances of items in BNet vs. how
	they appear in-game.  This is a known limitation of our item statistics, without any planned fix.
	*/
  export interface DestinyItemStatBlockDefinition {
    /**
		If true, the game won't show the "primary" stat on this item when you inspect it.
		
		NOTE: This is being manually mapped, because I happen to want it in a block that isn't going to directly create this
		derivative block.
		*/
    disablePrimaryStatDisplay: boolean;

    /**
		If the item's stats are meant to be modified by a DestinyStatGroupDefinition, this will
		be the identifier for that definition.
		
		If you are using live data or precomputed stats data on the DestinyInventoryItemDefinition.stats.stats
		property, you don't have to worry about statGroupHash and how it alters stats: the already altered
		stats are provided to you.  But if you want to see how the sausage gets made, or perform computations
		yourself, this is valuable information.
		*/
    statGroupHash?: number;

    /**
		If you are looking for precomputed values for the stats on a weapon, this is where they are stored.
		Technically these are the "Display" stat values.  Please see DestinyStatsDefinition for what
		Display Stat Values means, it's a very long story... but essentially these are the closest values
		BNet can get to the item stats that you see in-game.
		 
		These stats are keyed by the DestinyStatDefinition's hash identifier for the stat
		that's found on the item.
		*/
    stats: { [key: number]: Definitions.DestinyInventoryItemStatDefinition };

    /**
		A quick and lazy way to determine whether any stat other than the "primary" stat is actually
		visible on the item.  Items often have stats that we return in case people find them useful, but
		they're not part of the "Stat Group" and thus we wouldn't display them in our UI.  If this is False,
		then we're not going to display any of these stats other than the primary one.
		*/
    hasDisplayableStats: boolean;

    /**
		This stat is determined to be the "primary" stat, and can be looked up in the stats or any
		other stat collection related to the item.
		
		Use this hash to look up the stat's value using DestinyInventoryItemDefinition.stats.stats,
		and the renderable data for the primary stat in the related DestinyStatDefinition.
		*/
    primaryBaseStatHash: number;
  }

  /**
	Defines a specific stat value on an item, and the minimum/maximum range that we could
	compute for the item based on our heuristics for how the item might be generated.
	
	Not guaranteed to match real-world instances of the item, but should hopefully at least
	be close.  If it's not close, let us know on the Bungie API forums.
	*/
  export interface DestinyInventoryItemStatDefinition {
    /**
		The hash for the DestinyStatDefinition representing this stat.
		*/
    statHash: number;

    /**
		This value represents the stat value assuming the minimum possible roll
		but accounting for any mandatory bonuses that should be applied to the stat on item creation.
		
		In Destiny 1, this was different from the "minimum" value because there were certain conditions
		where an item could be theoretically lower level/value than the initial roll.  
		
		In Destiny 2, this is not possible unless Talent Grids begin to be used again for these purposes or some other
		system change occurs... thus in practice, value and minimum should be the same in Destiny 2.  Good riddance.
		*/
    value: number;

    /**
		The minimum possible value for this stat that we think the item can roll.
		*/
    minimum: number;

    /**
		The maximum possible value for this stat that we think the item can roll.
		
		WARNING: In Destiny 1, this field was calculated using the potential stat rolls on the item's talent grid.
		In Destiny 2, items no longer have meaningful talent grids and instead have sockets: but the calculation of this field
		was never altered to adapt to this change.  As such, this field should be considered deprecated until we can address this oversight.
		*/
    maximum: number;

    /**
		The maximum possible value for the stat as shown in the UI, if it is being shown somewhere that reveals maximum
		in the UI (such as a bar chart-style view).
		
		This is pulled directly from the item's DestinyStatGroupDefinition, and placed here for convenience.
		
		If not returned, there is no maximum to use (and thus the stat should not be shown in a way that assumes there is a limit to the stat)
		*/
    displayMaximum?: number;
  }

  /**
	Items that can be equipped define this block.  It contains information we need to
	understand how and when the item can be equipped.
	*/
  export interface DestinyEquippingBlockDefinition {
    /**
		If the item is part of a gearset, this is a reference to that gearset item.
		*/
    gearsetItemHash?: number;

    /**
		If defined, this is the label used to check if the item has other items of
		matching types already equipped.  
		
		For instance, when you aren't allowed to
		equip more than one Exotic Weapon, that's because all exotic weapons have
		identical uniqueLabels and the game checks the to-be-equipped item's uniqueLabel
		vs. all other already equipped items (other than the item in the slot that's
		about to be occupied).
		*/
    uniqueLabel: string;

    /**
		The hash of that unique label.  Does not point to a specific definition.
		*/
    uniqueLabelHash: number;

    /**
		An equipped item *must* be equipped in an Equipment Slot.  This is the hash identifier
		of the DestinyEquipmentSlotDefinition into which it must be equipped.
		*/
    equipmentSlotTypeHash: number;

    /**
		These are custom attributes on the equippability of the item.
		
		For now, this can only be "equip on acquire", which would mean that the item
		will be automatically equipped as soon as you pick it up.
		*/
    attributes: Globals.EquippingItemBlockAttributes;

    /**
		Ammo type used by a weapon is no longer determined by the bucket in which it is contained.
		If the item has an ammo type - i.e. if it is a weapon - this will be the type of ammunition expected.
		*/
    ammoType: Globals.DestinyAmmunitionType;

    /**
		These are strings that represent the possible Game/Account/Character state failure conditions
		that can occur when trying to equip the item.  They match up one-to-one with requiredUnlockExpressions.
		*/
    displayStrings: string[];
  }

  /**
	This Block defines the rendering data associated with the item, if any.
	*/
  export interface DestinyItemTranslationBlockDefinition {
    weaponPatternIdentifier: string;

    weaponPatternHash: number;

    defaultDyes: World.DyeReference[];

    lockedDyes: World.DyeReference[];

    customDyes: World.DyeReference[];

    arrangements: Definitions.DestinyGearArtArrangementReference[];

    hasGeometry: boolean;
  }

  export interface DestinyGearArtArrangementReference {
    classHash: number;

    artArrangementHash: number;
  }

  /**
	Items like Sacks or Boxes can have items that it shows in-game when you view details
	that represent the items you can obtain if you use or acquire the item.
	
	This defines those categories, and gives some insights into that data's source.
	*/
  export interface DestinyItemPreviewBlockDefinition {
    /**
		A string that the game UI uses as a hint for which detail screen to show for the item.
		You, too, can leverage this for your own custom screen detail views.
		Note, however, that these are arbitrarily defined by designers: there's no guarantees
		of a fixed, known number of these - so fall back to something reasonable if you don't recognize it.
		*/
    screenStyle: string;

    /**
		If the preview data is derived from a fake "Preview" Vendor, this will
		be the hash identifier for the DestinyVendorDefinition of that fake vendor.
		*/
    previewVendorHash: number;

    /**
		If this item should show you Artifact information when you preview it,
		this is the hash identifier of the DestinyArtifactDefinition for the artifact
		whose data should be shown.
		*/
    artifactHash?: number;

    /**
		If the preview has an associated action (like "Open"), this will be the localized
		string for that action.
		*/
    previewActionString: string;

    /**
		This is a list of the items being previewed, categorized in the same way as they are
		in the preview UI.
		*/
    derivedItemCategories: Items.DestinyDerivedItemCategoryDefinition[];
  }

  /**
	An item's "Quality" determines its calculated stats.  The Level at which the item spawns
	is combined with its "qualityLevel" along with some additional calculations to determine
	the value of those stats.
	
	In Destiny 2, most items don't have default item levels and quality, making this property
	less useful: these apparently are almost always determined by the complex mechanisms of
	the Reward system rather than statically.  They are still provided here in case they
	are still useful for people.  This also contains some information about Infusion.
	*/
  export interface DestinyItemQualityBlockDefinition {
    /**
		The "base" defined level of an item.  This is a list because, in theory,
		each Expansion could define its own base level for an item.
		
		In practice, not only was that never done in Destiny 1, but now this
		isn't even populated at all.  When it's not populated, the level at which
		it spawns has to be inferred by Reward information, of which BNet receives an imperfect
		view and will only be reliable on instanced data as a result.
		*/
    itemLevels: number[];

    /**
		qualityLevel is used in combination with the item's level to calculate stats like
		Attack and Defense.  It plays a role in that calculation, but not nearly as large as
		itemLevel does.
		*/
    qualityLevel: number;

    /**
		The string identifier for this item's "infusability", if any.  
		
		Items that match the same infusionCategoryName are allowed to infuse with each other.
		
		DEPRECATED: Items can now have multiple infusion categories.  Please use infusionCategoryHashes instead.
		*/
    infusionCategoryName: string;

    /**
		The hash identifier for the infusion.  It does not map to a Definition entity.
		
		DEPRECATED: Items can now have multiple infusion categories.  Please use infusionCategoryHashes instead.
		*/
    infusionCategoryHash: number;

    /**
		If any one of these hashes matches any value in another item's infusionCategoryHashes, the two 
		can infuse with each other.
		*/
    infusionCategoryHashes: number[];

    /**
		An item can refer to pre-set level requirements.  They are defined in DestinyProgressionLevelRequirementDefinition,
		and you can use this hash to find the appropriate definition.
		*/
    progressionLevelRequirementHash: number;

    /**
		The latest version available for this item.
		*/
    currentVersion: number;

    /**
		The list of versions available for this item.
		*/
    versions: Definitions.DestinyItemVersionDefinition[];

    /**
		Icon overlays to denote the item version and power cap status.
		*/
    displayVersionWatermarkIcons: string[];
  }

  /**
	The version definition currently just holds a reference to the power cap.
	*/
  export interface DestinyItemVersionDefinition {
    /**
		A reference to the power cap for this item version.
		*/
    powerCapHash: number;
  }

  /**
	This defines an item's "Value".
	Unfortunately, this appears to be used in different ways depending on the way that the item itself
	is used.
	
	For items being sold at a Vendor, this is the default "sale price" of the item.  These days, the vendor itself
	almost always sets the price, but it still possible for the price to fall back to this value.
	For quests, it is a preview of rewards you can gain by completing the quest.
	For dummy items, if the itemValue refers to an Emblem, it is the emblem that should be shown
	as the reward. (jeez louise)
	
	It will likely be used in a number of other ways in the future, it appears to be a bucket where
	they put arbitrary items and quantities into the item.
	*/
  export interface DestinyItemValueBlockDefinition {
    /**
		References to the items that make up this item's "value", and the quantity.
		*/
    itemValue: World.DestinyItemQuantity[];

    /**
		If there's a localized text description of the value provided, this will be said description.
		*/
    valueDescription: string;
  }

  /**
	Data about an item's "sources": ways that the item can be obtained.
	*/
  export interface DestinyItemSourceBlockDefinition {
    /**
		The list of hash identifiers for Reward Sources that hint where the item can be found (DestinyRewardSourceDefinition).
		*/
    sourceHashes: number[];

    /**
		A collection of details about the stats that were computed for the ways we found that the item
		could be spawned.
		*/
    sources: Sources.DestinyItemSourceDefinition[];

    /**
		If we found that this item is exclusive to a specific platform, this will be set to the
		BungieMembershipType enumeration that matches that platform.
		*/
    exclusive: Globals.BungieMembershipType;

    /**
		A denormalized reference back to vendors that potentially sell this item.
		*/
    vendorSources: Definitions.DestinyItemVendorSourceReference[];
  }

  /**
	Represents that a vendor could sell this item, and provides a quick link to that vendor and sale item.
	
	 Note that we do not and cannot make a guarantee that the vendor will ever *actually* sell this item,
	 only that the Vendor has a definition that indicates it *could* be sold.
	
	 Note also that a vendor may sell the same item in multiple "ways", which means there may be multiple
	 vendorItemIndexes for a single Vendor hash.
	*/
  export interface DestinyItemVendorSourceReference {
    /**
		The identifier for the vendor that may sell this item.
		*/
    vendorHash: number;

    /**
		The Vendor sale item indexes that represent the sale information for this item.  The same vendor
		may sell an item in multiple "ways", hence why this is a list.  (for instance, a weapon may be "sold"
		as a reward in a quest, for Glimmer, and for Masterwork Cores: each of those ways would be represented by
		a different vendor sale item with a different index)
		*/
    vendorItemIndexes: number[];
  }

  /**
	An item can have objectives on it.  In practice, these are the exclusive purview of
	"Quest Step" items: DestinyInventoryItemDefinitions that represent a specific step in a Quest.
	
	Quest steps have 1:M objectives that we end up processing and returning in live data as DestinyQuestStatus
	data, and other useful information.
	*/
  export interface DestinyItemObjectiveBlockDefinition {
    /**
		The hashes to Objectives (DestinyObjectiveDefinition) that are part of this Quest Step, in the
		order that they should be rendered.
		*/
    objectiveHashes: number[];

    /**
		For every entry in objectiveHashes, there is a corresponding entry in this array
		at the same index.  If the objective is meant to be associated with a specific DestinyActivityDefinition,
		there will be a valid hash at that index.  Otherwise, it will be invalid (0).
		
		Rendered somewhat obsolete by perObjectiveDisplayProperties, which currently has much the same information
		but may end up with more info in the future.
		*/
    displayActivityHashes: number[];

    /**
		If True, all objectives must be completed for the step to be completed.
		If False, any one objective can be completed for the step to be completed.
		*/
    requireFullObjectiveCompletion: boolean;

    /**
		The hash for the DestinyInventoryItemDefinition representing the Quest to which this Quest Step belongs.
		*/
    questlineItemHash: number;

    /**
		The localized string for narrative text related to this quest step, if any.
		*/
    narrative: string;

    /**
		The localized string describing an action to be performed associated with the objectives, if any.
		*/
    objectiveVerbName: string;

    /**
		The identifier for the type of quest being performed, if any.  Not associated with any fixed definition, yet.
		*/
    questTypeIdentifier: string;

    /**
		A hashed value for the questTypeIdentifier, because apparently I like to be redundant.
		*/
    questTypeHash: number;

    /**
		One entry per Objective on the item, it will have related display information.
		*/
    perObjectiveDisplayProperties: Definitions.DestinyObjectiveDisplayProperties[];

    displayAsStatTracker: boolean;
  }

  export interface DestinyObjectiveDisplayProperties {
    /**
		The activity associated with this objective in the context of this item, if any.
		*/
    activityHash?: number;

    /**
		If true, the game shows this objective on item preview screens.
		*/
    displayOnItemPreviewScreen: boolean;
  }

  /**
	The metrics available for display and selection on an item.
	*/
  export interface DestinyItemMetricBlockDefinition {
    /**
		Hash identifiers for any DestinyPresentationNodeDefinition entry that can be used to list available metrics.
		Any metric listed directly below these nodes, or in any of these nodes' children will be made available for selection.
		*/
    availableMetricCategoryNodeHashes: number[];
  }

  /**
	If an item has a related gearset, this is the list of items in that set, and an unlock expression
	that evaluates to a number representing the progress toward gearset completion (a very rare use for
	unlock expressions!)
	*/
  export interface DestinyItemGearsetBlockDefinition {
    /**
		The maximum possible number of items that can be collected.
		*/
    trackingValueMax: number;

    /**
		The list of hashes for items in the gearset.  Use them to look up DestinyInventoryItemDefinition entries for
		the items in the set.
		*/
    itemList: number[];
  }

  /**
	Some items are "sacks" - they can be "opened" to produce other items.
	This is information related to its sack status, mostly UI strings.
	Engrams are an example of items that are considered to be "Sacks".
	*/
  export interface DestinyItemSackBlockDefinition {
    /**
		A description of what will happen when you open the sack.
		As far as I can tell, this is blank currently.  Unknown whether it will
		eventually be populated with useful info.
		*/
    detailAction: string;

    /**
		The localized name of the action being performed when you open the sack.
		*/
    openAction: string;

    selectItemCount: number;

    vendorSackType: string;

    openOnAcquire: boolean;
  }

  /**
	If defined, the item has at least one socket.
	*/
  export interface DestinyItemSocketBlockDefinition {
    /**
		This was supposed to be a string that would give per-item details about sockets.
		In practice, it turns out that all this ever has is the localized word "details".
		... that's lame, but perhaps it will become something cool in the future.
		*/
    detail: string;

    /**
		Each non-intrinsic (or mutable) socket on an item is defined here.  Check inside for more info.
		*/
    socketEntries: Definitions.DestinyItemSocketEntryDefinition[];

    /**
		Each intrinsic (or immutable/permanent) socket on an item is defined here, along with the plug that is
		permanently affixed to the socket.
		*/
    intrinsicSockets: Definitions.DestinyItemIntrinsicSocketEntryDefinition[];

    /**
		A convenience property, that refers to the sockets in the "sockets" property, pre-grouped
		by category and ordered in the manner that they should be grouped in the UI.
		You could form this yourself with the existing data, but why would you want to?  Enjoy life man.
		*/
    socketCategories: Definitions.DestinyItemSocketCategoryDefinition[];
  }

  /**
	The definition information for a specific socket on an item.
	This will determine how the socket behaves in-game.
	*/
  export interface DestinyItemSocketEntryDefinition {
    /**
		All sockets have a type, and this is the hash identifier for this particular type.
		Use it to look up the DestinySocketTypeDefinition: read there for more information on
		how socket types affect the behavior of the socket.
		*/
    socketTypeHash: number;

    /**
		If a valid hash, this is the hash identifier for the DestinyInventoryItemDefinition
		representing the Plug that will be initially inserted into the item on item creation.
		Otherwise, this Socket will either start without a plug inserted, or will have one randomly
		inserted.
		*/
    singleInitialItemHash: number;

    /**
		This is a list of pre-determined plugs that can *always* be plugged into this socket, without
		the character having the plug in their inventory.
		
		If this list is populated, you will not be allowed to plug an arbitrary item in the socket: you
		will only be able to choose from one of these reusable plugs.
		*/
    reusablePlugItems: Definitions.DestinyItemSocketEntryPlugItemDefinition[];

    /**
		If this is true, then the socket will not be initialized with a plug if the item is purchased from a Vendor.
		
		Remember that Vendors are much more than conceptual vendors: they include "Collection Kiosks" and other entities.
		See DestinyVendorDefinition for more information.
		*/
    preventInitializationOnVendorPurchase: boolean;

    /**
		If this is true, the perks provided by this socket shouldn't be shown in the item's tooltip.  This might
		be useful if it's providing a hidden bonus, or if the bonus is less important than other benefits on the item.
		*/
    hidePerksInItemTooltip: boolean;

    /**
		Indicates where you should go to get plugs for this socket.  This will affect how you populate your UI,
		as well as what plugs are valid for this socket.  It's an alternative to having to check for the existence
		of certain properties (reusablePlugItems for example) to infer where plugs should come from.
		*/
    plugSources: Globals.SocketPlugSources;

    /**
		If this socket's plugs come from a reusable DestinyPlugSetDefinition, this is the identifier for that set.
		 We added this concept to reduce some major duplication that's going to come from sockets as replacements for
		 what was once implemented as large sets of items and kiosks (like Emotes).
		
		 As of Shadowkeep, these will come up much more frequently and be driven by game content rather than
		 custom curation.
		*/
    reusablePlugSetHash?: number;

    /**
		This field replaces "randomizedPlugItems" as of Shadowkeep launch.  If a socket has randomized plugs,
		 this is a pointer to the set of plugs that could be used, as defined in DestinyPlugSetDefinition.
		
		 If null, the item has no randomized plugs.
		*/
    randomizedPlugSetHash?: number;

    /**
		If true, then this socket is visible in the item's "default" state.
		If you have an instance, you should always check the runtime state, as that
		can override this visibility setting: but if you're looking at the item
		on a conceptual level, this property can be useful for hiding data such
		as legacy sockets - which remain defined on items for infrastructure purposes,
		but can be confusing for users to see.
		*/
    defaultVisible: boolean;
  }

  /**
	The definition of a known, reusable plug that can be applied to a socket.
	*/
  export interface DestinyItemSocketEntryPlugItemDefinition {
    /**
		The hash identifier of a DestinyInventoryItemDefinition representing the plug
		that can be inserted.
		*/
    plugItemHash: number;
  }

  /**
	Represents a socket that has a plug associated with it intrinsically.  This is useful for situations
	where the weapon needs to have a visual plug/Mod on it, but that plug/Mod should never change.
	*/
  export interface DestinyItemIntrinsicSocketEntryDefinition {
    /**
		Indicates the plug that is intrinsically inserted into this socket.
		*/
    plugItemHash: number;

    /**
		Indicates the type of this intrinsic socket.
		*/
    socketTypeHash: number;

    /**
		If true, then this socket is visible in the item's "default" state.
		If you have an instance, you should always check the runtime state, as that
		can override this visibility setting: but if you're looking at the item
		on a conceptual level, this property can be useful for hiding data such
		as legacy sockets - which remain defined on items for infrastructure purposes,
		but can be confusing for users to see.
		*/
    defaultVisible: boolean;
  }

  /**
	Sockets are grouped into categories in the UI.  These define which category
	and which sockets are under that category.
	*/
  export interface DestinyItemSocketCategoryDefinition {
    /**
		The hash for the Socket Category: a quick way to go get the header display information for the category.
		Use it to look up DestinySocketCategoryDefinition info.
		*/
    socketCategoryHash: number;

    /**
		Use these indexes to look up the sockets in the "sockets.socketEntries" property on the item definition.
		These are the indexes under the category, in game-rendered order.
		*/
    socketIndexes: number[];
  }

  /**
	This appears to be information used when rendering rewards.  We don't currently use it on BNet.
	*/
  export interface DestinyItemSummaryBlockDefinition {
    /**
		Apparently when rendering an item in a reward, this should be used as a sort priority.
		We're not doing it presently.
		*/
    sortPriority: number;
  }

  /**
	This defines information that can only come from a talent grid on an item.
	Items mostly have negligible talent grid data these days, but instanced items still retain
	grids as a source for some of this common information.
	
	Builds/Subclasses are the only items left that still have talent grids with meaningful
	Nodes.
	*/
  export interface DestinyItemTalentGridBlockDefinition {
    /**
		The hash identifier of the DestinyTalentGridDefinition attached to this item.
		*/
    talentGridHash: number;

    /**
		This is meant to be a subtitle for looking at the talent grid.
		In practice, somewhat frustratingly, this always merely says the localized word
		for "Details".  Great.  Maybe it'll have more if talent grids ever get used
		for more than builds and subclasses again.
		*/
    itemDetailString: string;

    /**
		A shortcut string identifier for the "build" in question, if this talent grid
		has an associated build.  Doesn't map to anything we can expose at the moment.
		*/
    buildName: string;

    /**
		If the talent grid implies a damage type, this is the enum value for that damage type.
		*/
    hudDamageType: Globals.DamageType;

    /**
		If the talent grid has a special icon that's shown in the game UI (like builds, funny that),
		this is the identifier for that icon.
		Sadly, we don't actually get that icon right now.  I'll be looking to replace this
		with a path to the actual icon itself.
		*/
    hudIcon: string;
  }

  /**
	Represents a "raw" investment stat, before calculated stats are calculated
	and before any DestinyStatGroupDefinition is applied to transform the stat
	into something closer to what you see in-game.
	
	Because these won't match what you see in-game, consider carefully whether
	you really want to use these stats.  I have left them in case someone
	can do something useful or interesting with the pre-processed statistics.
	*/
  export interface DestinyItemInvestmentStatDefinition {
    /**
		The hash identifier for the DestinyStatDefinition defining this stat.
		*/
    statTypeHash: number;

    /**
		The raw "Investment" value for the stat, before transformations are performed
		to turn this raw stat into stats that are displayed in the game UI.
		*/
    value: number;

    /**
		If this is true, the stat will only be applied on the item in certain game state conditions,
		and we can't know statically whether or not this stat will be applied.  Check the "live" API data
		instead for whether this value is being applied on a specific instance of the item in question, and
		you can use this to decide whether you want to show the stat on the generic view of the item, or
		whether you want to show some kind of caveat or warning about the stat value being conditional on game state.
		*/
    isConditionallyActive: boolean;
  }

  /**
	An intrinsic perk on an item, and the requirements for it to be activated.
	*/
  export interface DestinyItemPerkEntryDefinition {
    /**
		If this perk is not active, this is the string to show for why
		it's not providing its benefits.
		*/
    requirementDisplayString: string;

    /**
		A hash identifier for the DestinySandboxPerkDefinition being provided on the item.
		*/
    perkHash: number;

    /**
		Indicates whether this perk should be shown, or if it should be shown disabled.
		*/
    perkVisibility: Globals.ItemPerkVisibility;
  }

  /**
	Where the sausage gets made.  Unlock Expressions are the foundation of the game's gating
	mechanics and investment-related restrictions.  They can test Unlock Flags and Unlock Values
	for certain states, using a sufficient amount of logical operators such that
	unlock expressions are effectively Turing complete.
	
	Use UnlockExpressionParser to evaluate expressions using an IUnlockContext parsed from Babel.
	*/
  export interface DestinyUnlockExpressionDefinition {
    /**
		A shortcut for determining the most restrictive gating that this expression performs.
		See the DestinyGatingScope enum's documentation for more details.
		*/
    scope: Globals.DestinyGatingScope;
  }

  /**
	An individual step represents either a single operation in the stack of operations,
	or an unlock flag/value/mapping/constant value to be evaluated.
	*/
  export interface DestinyUnlockExpressionStepDefinition {}

  /**
	When a sack rolls rewards, it will pick items from categories.
	*/
  export interface DestinyItemSackRewardCategory {
    categoryId: number;

    rewardItemCount: number;
  }

  /**
	Defines the intrinsic unlock flags and values on the item: state changes that will happen
	as long as the item is equipped.
	*/
  export interface DestinyItemUnlockBlockDefinition {
    /**
		Any unlocks (DestinyUnlockDefinition) referred to here will be set as long as the item is equipped.
		*/
    intrinsicUnlockHashes: number[];

    /**
		The list of unlock values and the default values that will be applied to them when the item is equipped.
		*/
    storedUnlockValues: Definitions.DestinyItemUnlockStoredValueDefinition[];

    /**
		Unlike stored unlock values, these are values that are also initiated to a specific value: but I believe
		the distinction is that these values cannot be changed at runtime.
		*/
    intrinsicUnlockValues: Definitions.DestinyIntrinsicUnlockValueDefinition[];
  }

  /**
	Defines an unlock value being set for an item intrinsically.
	*/
  export interface DestinyItemUnlockStoredValueDefinition {
    /**
		The hash identifier of the DestinyUnlockValueDefinition being set when the item is equipped.
		*/
    unlockValueHash: number;

    /**
		The value for the DestinyUnlockValueDefinition.
		*/
    defaultValue: number;
  }

  /**
	Uncomfortable confession time: I don't understand why we have intrinsic vs. stored unlock values.
	For now, I'm going to hold onto them in case we find a good use for them.  I'm pretty sure that intrinsics
	retain the value permanently and stored ones can be altered after creation, but did there really
	need to be two separate collections of them?
	*/
  export interface DestinyIntrinsicUnlockValueDefinition {
    unlockValueHash: number;

    value: number;
  }

  /**
	Provides common properties for destiny definitions.
	*/
  export interface DestinyDefinition {
    /**
		The unique identifier for this entity.  Guaranteed to be unique for the type of entity, but not globally.
		
		When entities refer to each other in Destiny content, it is this hash that they are referring to.
		*/
    hash: number;

    /**
		The index of the entity as it was found in the investment tables.
		*/
    index: number;

    /**
		If this is true, then there is an entity with this identifier/type combination, but BNet is
		not yet allowed to show it.  Sorry!
		*/
    redacted: boolean;
  }

  /**
	Many actions relating to items require you to expend materials:
	- Activating a talent node
	- Inserting a plug into a socket
	The items will refer to material requirements by a materialRequirementsHash in these cases, and this
	is the definition for those requirements in terms of the item required, how much of it is required and other
	interesting info.
	This is one of the rare/strange times where a single contract class is used both in definitions *and*
	in live data response contracts.  I'm not sure yet whether I regret that.
	*/
  export interface DestinyMaterialRequirement {
    /**
		The hash identifier of the material required.  Use it to look up the material's DestinyInventoryItemDefinition.
		*/
    itemHash: number;

    /**
		If True, the material will be removed from the character's inventory when the action is performed.
		*/
    deleteOnAction: boolean;

    /**
		The amount of the material required.
		*/
    count: number;

    /**
		If true, the material requirement count value is constant.
		Since The Witch Queen expansion, some material requirement counts can be dynamic and will need to be returned with an API call.
		*/
    countIsConstant: boolean;

    /**
		If True, this requirement is "silent": don't bother showing it in a material requirements display.
		I mean, I'm not your mom: I'm not going to tell you you *can't* show it.  But we won't show it in our UI.
		*/
    omitFromRequirements: boolean;

    /**
		If true, this material requirement references a virtual item stack size value.
		You can get that value from a corresponding DestinyMaterialRequirementSetState.
		*/
    hasVirtualStackSize: boolean;
  }

  export interface DestinyHistoricalStatsDefinition {
    /**
		Unique programmer friendly ID for this stat
		*/
    statId: string;

    /**
		Statistic group
		*/
    group: Globals.DestinyStatsGroupType;

    /**
		Time periods the statistic covers
		*/
    periodTypes: Globals.PeriodType[];

    /**
		Game modes where this statistic can be reported.
		*/
    modes: Globals.DestinyActivityModeType[];

    /**
		Category for the stat.
		*/
    category: Globals.DestinyStatsCategoryType;

    /**
		Display name
		*/
    statName: string;

    /**
		Display name abbreviated
		*/
    statNameAbbr: string;

    /**
		Description of a stat if applicable.
		*/
    statDescription: string;

    /**
		Unit, if any, for the statistic
		*/
    unitType: Globals.UnitType;

    /**
		Optional URI to an icon for the statistic
		*/
    iconImage: string;

    /**
		Optional icon for the statistic
		*/
    mergeMethod?: Globals.DestinyStatsMergeMethod;

    /**
		Localized Unit Name for the stat.
		*/
    unitLabel: string;

    /**
		Weight assigned to this stat indicating its relative impressiveness.
		*/
    weight: number;

    /**
		The tier associated with this medal - be it implicitly or explicitly.
		*/
    medalTierHash?: number;
  }

  /**
	The results of a search for Destiny content.  This will be improved on over time,
	I've been doing some experimenting to see what might be useful.
	*/
  export interface DestinyEntitySearchResult {
    /**
		A list of suggested words that might make for better search results,
		based on the text searched for.
		*/
    suggestedWords: string[];

    /**
		The items found that are matches/near matches for the searched-for term,
		sorted by something vaguely resembling "relevance".  Hopefully this will
		get better in the future.
		*/
    results: Queries.SearchResultDestinyEntitySearchResultItem;
  }

  /**
	An individual Destiny Entity returned from the entity search.
	*/
  export interface DestinyEntitySearchResultItem {
    /**
		The hash identifier of the entity.  You will use this to look up the DestinyDefinition
		relevant for the entity found.
		*/
    hash: number;

    /**
		The type of entity, returned as a string matching the DestinyDefinition's contract class name.
		You'll have to have your own mapping from class names to actually looking up those definitions
		in the manifest databases.
		*/
    entityType: string;

    /**
		Basic display properties on the entity, so you don't have to look up the definition to show
		basic results for the item.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The ranking value for sorting that we calculated using our relevance formula.  This
		will hopefully get better with time and iteration.
		*/
    weight: number;
  }

  /**
	Defines an "Objective".
	
	An objective is a specific task you should accomplish in the game.  These are referred to by:
	
	- Quest Steps (which are DestinyInventoryItemDefinition entities with Objectives)
	
	- Challenges (which are Objectives defined on an DestinyActivityDefintion)
	
	- Milestones (which refer to Objectives that are defined on both Quest Steps and Activities)
	
	- Anything else that the designers decide to do later.
	
	Objectives have progress, a notion of having been Completed, human readable data describing the task
	to be accomplished, and a lot of optional tack-on data that can enhance the information provided about
	the task.
	*/
  export interface DestinyObjectiveDefinition {
    /**
		Ideally, this should tell you what your task is.  I'm not going to lie to you though.  Sometimes
		this doesn't have useful information at all.  Which sucks, but there's nothing either of us can do
		about it.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The value that the unlock value defined in unlockValueHash must reach in order for
		the objective to be considered Completed.  Used in calculating progress and completion status.
		*/
    completionValue: number;

    /**
		A shortcut for determining the most restrictive gating that this Objective is set to use.
		This includes both the dynamic determination of progress and of completion values.
		See the DestinyGatingScope enum's documentation for more details.
		*/
    scope: Globals.DestinyGatingScope;

    /**
		OPTIONAL: a hash identifier for the location at which this objective must be accomplished,
		if there is a location defined.  Look up the DestinyLocationDefinition for this hash for that
		additional location info.
		*/
    locationHash: number;

    /**
		If true, the value is allowed to go negative.
		*/
    allowNegativeValue: boolean;

    /**
		If true, you can effectively "un-complete" this objective if you lose progress after
		crossing the completion threshold.  
		
		If False, once you complete the task it will remain
		completed forever by locking the value.
		*/
    allowValueChangeWhenCompleted: boolean;

    /**
		If true, completion means having an unlock value less than or equal to the completionValue.
		
		If False, completion means having an unlock value greater than or equal to the completionValue.
		*/
    isCountingDownward: boolean;

    /**
		The UI style applied to the objective.  It's an enum, take a look at DestinyUnlockValueUIStyle for details
		of the possible styles.  Use this info as you wish to customize your UI.
		
		DEPRECATED: This is no longer populated by Destiny 2 game content. Please use inProgressValueStyle and completedValueStyle instead.
		*/
    valueStyle: Globals.DestinyUnlockValueUIStyle;

    /**
		Text to describe the progress bar.
		*/
    progressDescription: string;

    /**
		If this objective enables Perks intrinsically, the conditions for that enabling are defined here.
		*/
    perks: Definitions.DestinyObjectivePerkEntryDefinition;

    /**
		If this objective enables modifications on a player's stats intrinsically, the conditions are defined here.
		*/
    stats: Definitions.DestinyObjectiveStatEntryDefinition;

    /**
		If nonzero, this is the minimum value at which the objective's progression should be shown.
		Otherwise, don't show it yet.
		*/
    minimumVisibilityThreshold: number;

    /**
		If True, the progress will continue even beyond the point where the objective met its minimum completion
		requirements.  Your UI will have to accommodate it.
		*/
    allowOvercompletion: boolean;

    /**
		If True, you should continue showing the progression value in the UI after it's complete.
		I mean, we already do that in BNet anyways, but if you want to be better behaved than us you could honor
		this flag.
		*/
    showValueOnComplete: boolean;

    /**
		The style to use when the objective is completed.
		*/
    completedValueStyle: Globals.DestinyUnlockValueUIStyle;

    /**
		The style to use when the objective is still in progress.
		*/
    inProgressValueStyle: Globals.DestinyUnlockValueUIStyle;

    /**
		Objectives can have arbitrary UI-defined identifiers that define the style applied to objectives.
		For convenience, known UI labels will be defined in the uiStyle enum value.
		*/
    uiLabel: string;

    /**
		If the objective has a known UI label value, this property will represent it.
		*/
    uiStyle: Globals.DestinyObjectiveUiStyle;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Defines the conditions under which an intrinsic perk is applied while participating in an Objective.
	
	These perks will generally not be benefit-granting perks, but rather a perk that modifies gameplay
	in some interesting way.
	*/
  export interface DestinyObjectivePerkEntryDefinition {
    /**
		The hash identifier of the DestinySandboxPerkDefinition that will be applied to the character.
		*/
    perkHash: number;

    /**
		An enumeration indicating whether it will be applied as long as the Objective is active, when it's completed,
		or until it's completed.
		*/
    style: Globals.DestinyObjectiveGrantStyle;
  }

  /**
	Defines the conditions under which stat modifications will be applied to a Character while
	participating in an objective.
	*/
  export interface DestinyObjectiveStatEntryDefinition {
    /**
		The stat being modified, and the value used.
		*/
    stat: Definitions.DestinyItemInvestmentStatDefinition;

    /**
		Whether it will be applied as long as the objective is active, when it's completed, or until it's completed.
		*/
    style: Globals.DestinyObjectiveGrantStyle;
  }

  /**
	An Unlock Value is an internal integer value, stored on the server and used
	in a variety of ways, most frequently for the gating/requirement checks that the
	game performs across all of its main features.  They can also be used as the storage data
	for mapped Progressions, Objectives, and other features that require storage of variable
	numeric values.
	*/
  export interface DestinyUnlockValueDefinition {
    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	A "Location" is a sort of shortcut for referring to a specific
	combination of Activity, Destination, Place, and even Bubble or NavPoint within
	a space.
	
	Most of this data isn't intrinsically useful to us, but Objectives refer to
	locations, and through that we can at least infer the Activity, Destination, and Place
	being referred to by the Objective.
	*/
  export interface DestinyLocationDefinition {
    /**
		If the location has a Vendor on it, this is the hash identifier for that Vendor.
		Look them up with DestinyVendorDefinition.
		*/
    vendorHash: number;

    /**
		A Location may refer to different specific spots in the world based on the world's current state.
		This is a list of those potential spots, and the data we can use at runtime to determine
		which one of the spots is the currently valid one.
		*/
    locationReleases: Definitions.DestinyLocationReleaseDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	A specific "spot" referred to by a location.  Only one of these can be active at a time for
	a given Location.
	*/
  export interface DestinyLocationReleaseDefinition {
    /**
		Sadly, these don't appear to be populated anymore (ever?)
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    smallTransparentIcon: string;

    mapIcon: string;

    largeTransparentIcon: string;

    /**
		If we had map information, this spawnPoint would be interesting.  But sadly, we don't have that info.
		*/
    spawnPoint: number;

    /**
		The Destination being pointed to by this location.
		*/
    destinationHash: number;

    /**
		The Activity being pointed to by this location.
		*/
    activityHash: number;

    /**
		The Activity Graph being pointed to by this location.
		*/
    activityGraphHash: number;

    /**
		The Activity Graph Node being pointed to by this location.  (Remember that
		Activity Graph Node hashes are only unique within an Activity Graph: so use the combination
		to find the node being spoken of)
		*/
    activityGraphNodeHash: number;

    /**
		The Activity Bubble within the Destination.  Look this up in the DestinyDestinationDefinition's
		bubbles and bubbleSettings properties.
		*/
    activityBubbleName: number;

    /**
		If we had map information, this would tell us something cool about the path this location wants
		you to take.  I wish we had map information.
		*/
    activityPathBundle: number;

    /**
		If we had map information, this would tell us about path information related to destination
		on the map.  Sad.  Maybe you can do something cool with it.  Go to town man.
		*/
    activityPathDestination: number;

    /**
		The type of Nav Point that this represents.  See the enumeration for more info.
		*/
    navPointType: Globals.DestinyActivityNavPointType;

    /**
		Looks like it should be the position on the map, but sadly it does not look populated... yet?
		*/
    worldPosition: number[];
  }

  /**
	Unlock Flags are small bits (literally, a bit, as in a boolean value) that the game server
	uses for an extremely wide range of state checks, progress storage, and other interesting
	tidbits of information.
	*/
  export interface DestinyUnlockDefinition {
    /**
		Sometimes, but not frequently, these unlock flags also have
		human readable information: usually when they are being directly tested for some requirement,
		in which case the string is a localized description of why the requirement check failed.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Perks are modifiers to a character or item that can be applied situationally.
	
	- Perks determine a weapon's damage type.
	
	- Perks put the Mods in Modifiers (they are literally the entity that bestows the Sandbox
	benefit for whatever fluff text about the modifier in the Socket, Plug or Talent Node)
	
	- Perks are applied for unique alterations of state in Objectives
	
	Anyways, I'm sure you can see why perks are so interesting.
	
	What Perks often don't have is human readable information, so we attempt to reverse engineer
	that by pulling that data from places that uniquely refer to these perks: namely, Talent Nodes
	and Plugs.  That only gives us a subset of perks that are human readable, but those perks are
	the ones people generally care about anyways.  The others are left as a mystery, their true
	purpose mostly unknown and undocumented.
	*/
  export interface DestinySandboxPerkDefinition {
    /**
		These display properties are by no means guaranteed to be populated.  Usually when it is,
		it's only because we back-filled them with the displayProperties of some Talent Node or
		Plug item that happened to be uniquely providing that perk.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The string identifier for the perk.
		*/
    perkIdentifier: string;

    /**
		If true, you can actually show the perk in the UI.  Otherwise, it doesn't
		have useful player-facing information.
		*/
    isDisplayable: boolean;

    /**
		If this perk grants a damage type to a weapon, the damage type will be defined here.
		
		Unless you have a compelling reason to use this enum value, use the damageTypeHash instead
		to look up the actual DestinyDamageTypeDefinition.
		*/
    damageType: Globals.DamageType;

    /**
		The hash identifier for looking up the DestinyDamageTypeDefinition, if this perk has a damage type.
		
		This is preferred over using the damageType enumeration value, which has been left purely because it is
		occasionally convenient.
		*/
    damageTypeHash?: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	All damage types that are possible in the game are defined here, along with localized info and icons as needed.
	*/
  export interface DestinyDamageTypeDefinition {
    /**
		The description of the damage type, icon etc...
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A variant of the icon that is transparent and colorless.
		*/
    transparentIconPath: string;

    /**
		If TRUE, the game shows this damage type's icon.  Otherwise, it doesn't.  Whether you show it or not is up to you.
		*/
    showIcon: boolean;

    /**
		We have an enumeration for damage types for quick reference.  This is the current definition's damage type enum value.
		*/
    enumValue: Globals.DamageType;

    /**
		A color associated with the damage type. The displayProperties icon is tinted with a color close to this.
		*/
    color: Misc.DestinyColor;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	This represents a stat that's applied to a character or an item (such as a weapon, piece of armor, or a vehicle).
	
	An example of a stat might be Attack Power on a weapon.
	
	Stats go through a complex set of transformations before they end up being shown to the user as
	a number or a progress bar, and those transformations are fundamentally intertwined with the concept
	of a "Stat Group" (DestinyStatGroupDefinition).  Items have both Stats and a reference to a Stat Group,
	and it is the Stat Group that takes the raw stat information and gives it both rendering metadata
	(such as whether to show it as a number or a progress bar) and the final transformation data (interpolation
	tables to turn the raw investment stat into a display stat).  Please see DestinyStatGroupDefinition for
	more information on that transformational process.
	
	Stats are segregated from Stat Groups because different items and types of items can refer to the same stat,
	but have different "scales" for the stat while still having the same underlying value.  For example, both
	a Shotgun and an Auto Rifle may have a "raw" impact stat of 50, but the Auto Rifle's Stat Group will scale
	that 50 down so that, when it is displayed, it is a smaller value relative to the shotgun.  (this is a
	totally made up example, don't assume shotguns have naturally higher impact than auto rifles because of this)
	
	A final caveat is that some stats, even after this "final" transformation, go through yet another set
	of transformations directly in the game as a result of dynamic, stateful scripts that get run.
	BNet has no access to these scripts, nor any way to know which scripts get executed.  As a result, the
	stats for an item that you see in-game - particularly for stats that are often impacted by Perks, like
	Magazine Size - can change dramatically from what we return on Bungie.Net.  This is a known issue with
	no fix coming down the pipeline.  Take these stats with a grain of salt.
	
	Stats actually go through four transformations, for those interested:
	
	1) "Sandbox" stat, the "most raw" form.  These are pretty much useless without transformations applied,
	and thus are not currently returned in the API.  If you really want these, we can provide them.  Maybe
	someone could do something cool with it?
	
	2) "Investment" stat (the stat's value after DestinyStatDefinition's interpolation tables
	and aggregation logic is applied to the "Sandbox" stat value)
	
	3) "Display" stat (the stat's base UI-visible value after DestinyStatGroupDefinition's interpolation tables
	are applied to the Investment Stat value.  For most stats, this is what is displayed.)
	
	4) Underlying in-game stat (the stat's actual value according to the game, after the game runs dynamic
	scripts based on the game and character's state.  This is the final transformation that BNet does not have
	access to.  For most stats, this is not actually displayed to the user, with the exception of Magazine Size
	which is then piped back to the UI for display in-game, but not to BNet.)
	*/
  export interface DestinyStatDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Stats can exist on a character or an item, and they may potentially be aggregated in different
		ways.  The DestinyStatAggregationType enum value indicates the way that this stat is being
		aggregated.
		*/
    aggregationType: Globals.DestinyStatAggregationType;

    /**
		True if the stat is computed rather than being delivered as a raw value on items.
		
		For instance, the Light stat in Destiny 1 was a computed stat.
		*/
    hasComputedBlock: boolean;

    /**
		The category of the stat, according to the game.
		*/
    statCategory: Globals.DestinyStatCategory;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Characters can not only have Inventory buckets (containers of items that are generally matched by their type or
	functionality), they can also have Equipment Slots.
	
	The Equipment Slot is an indicator that the related bucket can have instanced items equipped
	on the character.  For instance, the Primary Weapon bucket has an Equipment Slot that determines
	whether you can equip primary weapons, and holds the association between its slot and the inventory bucket
	from which it can have items equipped.
	
	An Equipment Slot must have a related Inventory Bucket, but not
	all inventory buckets must have Equipment Slots.
	*/
  export interface DestinyEquipmentSlotDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		These technically point to "Equipment Category Definitions".  But don't get excited.  There's
		nothing of significant value in those definitions, so I didn't bother to expose them.  You can use the
		hash here to group equipment slots by common functionality, which serves the same purpose as if we had
		the Equipment Category definitions exposed.
		*/
    equipmentCategoryHash: number;

    /**
		The inventory bucket that owns this equipment slot.
		*/
    bucketTypeHash: number;

    /**
		If True, equipped items should have their custom art dyes applied when rendering the item.
		Otherwise, custom art dyes on an item should be ignored if the item is equipped in this slot.
		*/
    applyCustomArtDyes: boolean;

    /**
		The Art Dye Channels that apply to this equipment slot.
		*/
    artDyeChannels: Definitions.DestinyArtDyeReference[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyArtDyeReference {
    artDyeChannelHash: number;
  }

  /**
	An Inventory (be it Character or Profile level) is comprised of many Buckets.  An example of
	a bucket is "Primary Weapons", where all of the primary weapons on a character are gathered together
	into a single visual element in the UI: a subset of the inventory that has a limited number of slots, and
	in this case also has an associated Equipment Slot for equipping an item in the bucket.
	
	Item definitions declare what their "default" bucket is (DestinyInventoryItemDefinition.inventory.bucketTypeHash),
	and Item instances will tell you which bucket they are currently residing in (DestinyItemComponent.bucketHash).
	You can use this information along with the DestinyInventoryBucketDefinition to show these items grouped by
	bucket.
	
	You cannot transfer an item to a bucket that is not its Default without going through a Vendor's "accepted items"
	(DestinyVendorDefinition.acceptedItems).  This is how transfer functionality like the Vault is implemented, as a
	feature of a Vendor.  See the vendor's acceptedItems property for more details.
	*/
  export interface DestinyInventoryBucketDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Where the bucket is found.  0 = Character, 1 = Account
		*/
    scope: Globals.BucketScope;

    /**
		An enum value for what items can be found in the bucket.  See the BucketCategory enum
		for more details.
		*/
    category: Globals.BucketCategory;

    /**
		Use this property to provide a quick-and-dirty recommended ordering for buckets in the UI.
		Most UIs will likely want to forsake this for something more custom and manual.
		*/
    bucketOrder: number;

    /**
		The maximum # of item "slots" in a bucket.  A slot is a given combination of item + quantity.
		
		For instance, a Weapon will always take up a single slot, and always have a quantity of 1.
		But a material could take up only a single slot with hundreds of quantity.
		*/
    itemCount: number;

    /**
		Sometimes, inventory buckets represent conceptual "locations" in the game that might not be expected.
		This value indicates the conceptual location of the bucket, regardless of where it is actually
		contained on the character/account.  
		
		See ItemLocation for details.  
		
		Note that location includes the Vault and the Postmaster (both of whom being just inventory buckets with 
		additional actions that can be performed on them through a Vendor)
		*/
    location: Globals.ItemLocation;

    /**
		If TRUE, there is at least one Vendor that can transfer items to/from this bucket.  See the DestinyVendorDefinition's
		acceptedItems property for more information on how transferring works.
		*/
    hasTransferDestination: boolean;

    /**
		If True, this bucket is enabled.  Disabled buckets may include buckets that were included for test purposes, or
		that were going to be used but then were abandoned but never removed from content *cough*.
		*/
    enabled: boolean;

    /**
		if a FIFO bucket fills up, it will delete the oldest item from said bucket when a new item tries to be added
		to it.  If this is FALSE, the bucket will not allow new items to be placed in it until room is made by the user
		manually deleting items from it.  You can see an example of this with the Postmaster's bucket.
		*/
    fifo: boolean;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	These are the definitions for Vendors.
	
	In Destiny, a Vendor can be a lot of things - some things that you wouldn't expect, and some things
	that you don't even see directly in the game.  Vendors are the Dolly Levi of the Destiny universe.
	
	- Traditional Vendors as you see in game: people who you come up to and who give you quests, rewards, or who
	you can buy things from.
	
	- Kiosks/Collections, which are really just Vendors that don't charge currency (or charge some pittance of a currency)
	and whose gating for purchases revolves more around your character's state.
	
	- Previews for rewards or the contents of sacks.  These are implemented as Vendors, where you can't actually purchase from
	them but the items that they have for sale and the categories of sale items reflect the rewards or contents of the sack.
	This is so that the game could reuse the existing Vendor display UI for rewards and save a bunch of wheel reinvention.
	
	- Item Transfer capabilities, like the Vault and Postmaster.  Vendors can have "acceptedItem" buckets that determine
	the source and destination buckets for transfers.  When you interact with such a vendor, these buckets are what
	gets shown in the UI instead of any items that the Vendor would have for sale.  Yep, the Vault is a vendor.
	
	It is pretty much guaranteed that they'll be used for even more features in the future.  They have come
	to be seen more as generic categorized containers for items than "vendors" in a traditional sense, for
	better or worse.
	
	Where possible and time allows, we'll attempt to split those out into their own more
	digestible derived "Definitions": but often time does not allow that, as you can see from the above ways
	that vendors are used which we never split off from Vendor Definitions externally.
	
	Since Vendors are so many things to so many parts of the game, the definition is understandably complex.
	You will want to combine this data with live Vendor information from the API when it is available.
	*/
  export interface DestinyVendorDefinition {
    displayProperties: Definitions.DestinyVendorDisplayPropertiesDefinition;

    /**
		The type of reward progression that this vendor has.
		Default - The original rank progression from token redemption.
		Ritual - Progression from ranks in ritual content. For example: Crucible (Shaxx), Gambit (Drifter), and Battlegrounds (War Table).
		*/
    vendorProgressionType: Globals.DestinyVendorProgressionType;

    /**
		If the vendor has a custom localized string describing the "buy" action, that is
		returned here.
		*/
    buyString: string;

    /**
		Ditto for selling.  Not that you can sell items to a vendor anymore.  Will it come back?
		Who knows.  The string's still there.
		*/
    sellString: string;

    /**
		If the vendor has an item that should be displayed as the "featured" item, this is
		the hash identifier for that DestinyVendorItemDefinition.
		
		Apparently this is usually a related currency, like a reputation token.  But it need not be restricted to that.
		*/
    displayItemHash: number;

    /**
		If this is true, you aren't allowed to buy whatever the vendor is selling.
		*/
    inhibitBuying: boolean;

    /**
		If this is true, you're not allowed to sell whatever the vendor is buying.
		*/
    inhibitSelling: boolean;

    /**
		If the Vendor has a faction, this hash will be valid and point to a DestinyFactionDefinition.
		
		The game UI and BNet often mine the faction definition for additional elements and details to place
		on the screen, such as the faction's Progression status (aka "Reputation").
		*/
    factionHash: number;

    /**
		A number used for calculating the frequency of a vendor's inventory resetting/refreshing.
		
		Don't worry about calculating this - we do it on the server side and send you the next refresh
		date with the live data.
		*/
    resetIntervalMinutes: number;

    /**
		Again, used for reset/refreshing of inventory.  Don't worry too much about it.  Unless you want to.
		*/
    resetOffsetMinutes: number;

    /**
		If an item can't be purchased from the vendor, there may be many "custom"/game state specific reasons why not.
		
		This is a list of localized strings with messages for those custom failures.  The live BNet data will return a
		failureIndexes property for items that can't be purchased: using those values to index into this array,
		you can show the user the appropriate failure message for the item that can't be bought.
		*/
    failureStrings: string[];

    /**
		If we were able to predict the dates when this Vendor will be visible/available, this will be the list
		of those date ranges.  Sadly, we're not able to predict this very frequently, so this will often be useless data.
		*/
    unlockRanges: Dates.DateRange[];

    /**
		The internal identifier for the Vendor.  A holdover from the old days of Vendors, but we don't have
		time to refactor it away.
		*/
    vendorIdentifier: string;

    /**
		A portrait of the Vendor's smiling mug.  Or frothing tentacles.
		*/
    vendorPortrait: string;

    /**
		If the vendor has a custom banner image, that can be found here.
		*/
    vendorBanner: string;

    /**
		If a vendor is not enabled, we won't even save the vendor's definition, and we won't return any items or info about them.
		It's as if they don't exist.
		*/
    enabled: boolean;

    /**
		If a vendor is not visible, we still have and will give vendor definition info, but we won't use them
		for things like Advisors or UI.
		*/
    visible: boolean;

    /**
		The identifier of the VendorCategoryDefinition for this vendor's subcategory.
		*/
    vendorSubcategoryIdentifier: string;

    /**
		If TRUE, consolidate categories that only differ by trivial properties (such as having minor differences in name)
		*/
    consolidateCategories: boolean;

    /**
		Describes "actions" that can be performed on a vendor.  Currently, none of these exist.  But theoretically
		a Vendor could let you interact with it by performing actions.  We'll see what these end up looking
		like if they ever get used.
		*/
    actions: Definitions.DestinyVendorActionDefinition[];

    /**
		These are the headers for sections of items that the vendor is selling.
		When you see items organized by category in the header, it is these categories
		that it is showing.
		
		Well, technically not *exactly* these.  On BNet, it doesn't make sense to have categories
		be "paged" as we do in Destiny, so we run some heuristics to attempt to aggregate pages of
		categories together.  
		
		These are the categories post-concatenation, if the vendor had concatenation
		applied.  If you want the pre-aggregated category data, use originalCategories.
		*/
    categories: Definitions.DestinyVendorCategoryEntryDefinition[];

    /**
		See the categories property for a description of categories and why originalCategories exists.
		*/
    originalCategories: Definitions.DestinyVendorCategoryEntryDefinition[];

    /**
		Display Categories are different from "categories" in that these are specifically for visual grouping
		and display of categories in Vendor UI.  
		
		The "categories" structure is for validation of the contained
		items, and can be categorized entirely separately from "Display Categories", there need be and often will be
		no meaningful relationship between the two.
		*/
    displayCategories: Definitions.DestinyDisplayCategoryDefinition[];

    /**
		In addition to selling items, vendors can have "interactions": UI where you "talk" with the vendor
		and they offer you a reward, some item, or merely acknowledge via dialog that you did something cool.
		*/
    interactions: Definitions.DestinyVendorInteractionDefinition[];

    /**
		If the vendor shows you items from your own inventory - such as the Vault vendor does -
		this data describes the UI around showing those inventory buckets and which ones get shown.
		*/
    inventoryFlyouts: Definitions.DestinyVendorInventoryFlyoutDefinition[];

    /**
		If the vendor sells items (or merely has a list of items to show like the "Sack" vendors do),
		this is the list of those items that the vendor can sell.  From this list, only a subset will be
		available from the vendor at any given time, selected randomly and reset on the vendor's refresh interval.
		
		Note that a vendor can sell the same item multiple ways: for instance, nothing stops a vendor from selling
		you some specific weapon but using two different currencies, or the same weapon at multiple "item levels".
		*/
    itemList: Definitions.DestinyVendorItemDefinition[];

    /**
		BNet doesn't use this data yet, but it appears to be an optional list of flavor text
		about services that the Vendor can provide.
		*/
    services: Definitions.DestinyVendorServiceDefinition[];

    /**
		If the Vendor is actually a vehicle for the transferring of items (like the Vault and Postmaster
		vendors), this defines the list of source->destination buckets for transferring.
		*/
    acceptedItems: Definitions.DestinyVendorAcceptedItemDefinition[];

    /**
		As many of you know, Vendor data has historically been pretty brutal on the BNet servers.  In an effort to
		reduce this workload, only Vendors with this flag set will be returned on Vendor requests.  This allows us
		to filter out Vendors that don't dynamic data that's particularly useful: things like "Preview/Sack" vendors, for
		example, that you can usually suss out the details for using just the definitions themselves.
		*/
    returnWithVendorRequest: boolean;

    /**
		A vendor can be at different places in the world depending on the game/character/account state.
		This is the list of possible locations for the vendor, along with conditions we use to determine which
		one is currently active.
		*/
    locations: Vendors.DestinyVendorLocationDefinition[];

    /**
		A vendor can be a part of 0 or 1 "groups" at a time: a group being a collection of Vendors related by
		either location or function/purpose.  It's used for our our Companion Vendor UI.  Only one of these
		can be active for a Vendor at a time.
		*/
    groups: Definitions.DestinyVendorGroupReference[];

    /**
		Some items don't make sense to return in the API, for example because they represent an action to be performed
		rather than an item being sold.  I'd rather we not do this, but at least in the short term this is a workable workaround.
		*/
    ignoreSaleItemHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyVendorDisplayPropertiesDefinition {
    /**
		I regret calling this a "large icon".  It's more like a medium-sized image with a picture of
		the vendor's mug on it, trying their best to look cool.  Not what one would call an icon.
		*/
    largeIcon: string;

    subtitle: string;

    /**
		If we replaced the icon with something more glitzy, this is the original icon that the vendor had
		according to the game's content.  It may be more lame and/or have less razzle-dazzle.  But who am
		I to tell you which icon to use.
		*/
    originalIcon: string;

    /**
		Vendors, in addition to expected display property data, may also show
		some "common requirements" as statically defined definition data.  This might be when
		a vendor accepts a single type of currency, or when the currency is unique to the vendor
		and the designers wanted to show that currency when you interact with the vendor.
		*/
    requirementsDisplay: Definitions.DestinyVendorRequirementDisplayEntryDefinition[];

    /**
		This is the icon used in parts of the game UI such as the vendor's waypoint.
		*/
    smallTransparentIcon: string;

    /**
		This is the icon used in the map overview, when the vendor is located on the map.
		*/
    mapIcon: string;

    /**
		This is apparently the "Watermark".  I am not certain offhand where this is actually used in the Game UI, but some people may find it useful.
		*/
    largeTransparentIcon: string;

    description: string;

    name: string;

    icon: string;

    iconSequences: Common.DestinyIconSequenceDefinition[];

    highResIcon: string;

    hasIcon: boolean;
  }

  /**
	The localized properties of the requirementsDisplay, allowing information about the requirement or
	item being featured to be seen.
	*/
  export interface DestinyVendorRequirementDisplayEntryDefinition {
    icon: string;

    name: string;

    source: string;

    type: string;
  }

  /**
	If a vendor can ever end up performing actions, these are the properties that will be related
	to those actions.  I'm not going to bother documenting this yet, as it is unused and unclear if
	it will ever be used... but in case it is ever populated and someone finds it useful, it is defined here.
	*/
  export interface DestinyVendorActionDefinition {
    description: string;

    executeSeconds: number;

    icon: string;

    name: string;

    verb: string;

    isPositive: boolean;

    actionId: string;

    actionHash: number;

    autoPerformAction: boolean;
  }

  /**
	This is the definition for a single Vendor Category, into which Sale Items are grouped.
	*/
  export interface DestinyVendorCategoryEntryDefinition {
    /**
		The index of the category in the original category definitions for the vendor.
		*/
    categoryIndex: number;

    /**
		Used in sorting items in vendors... but there's a lot more to it.  Just go with the order provided in
		the itemIndexes property on the DestinyVendorCategoryComponent instead, it should be more reliable
		than trying to recalculate it yourself.
		*/
    sortValue: number;

    /**
		The hashed identifier for the category.
		*/
    categoryHash: number;

    /**
		The amount of items that will be available when this category is shown.
		*/
    quantityAvailable: number;

    /**
		If items aren't up for sale in this category, should we still show them (greyed out)?
		*/
    showUnavailableItems: boolean;

    /**
		If you don't have the currency required to buy items from this category, should the items be hidden?
		*/
    hideIfNoCurrency: boolean;

    /**
		True if this category doesn't allow purchases.
		*/
    hideFromRegularPurchase: boolean;

    /**
		The localized string for making purchases from this category, if it is different from the vendor's string for purchasing.
		*/
    buyStringOverride: string;

    /**
		If the category is disabled, this is the localized description to show.
		*/
    disabledDescription: string;

    /**
		The localized title of the category.
		*/
    displayTitle: string;

    /**
		If this category has an overlay prompt that should appear, this contains the details of that prompt.
		*/
    overlay: Definitions.DestinyVendorCategoryOverlayDefinition;

    /**
		A shortcut for the vendor item indexes sold under this category.  Saves us from some expensive reorganization
		at runtime.
		*/
    vendorItemIndexes: number[];

    /**
		Sometimes a category isn't actually used to sell items, but rather to preview them.  This implies different UI
		(and manual placement of the category in the UI) in the game, and special treatment.
		*/
    isPreview: boolean;

    /**
		If true, this category only displays items: you can't purchase anything in them.
		*/
    isDisplayOnly: boolean;

    resetIntervalMinutesOverride: number;

    resetOffsetMinutesOverride: number;
  }

  /**
	The details of an overlay prompt to show to a user.  They are all fairly
	self-explanatory localized strings that can be shown.
	*/
  export interface DestinyVendorCategoryOverlayDefinition {
    choiceDescription: string;

    description: string;

    icon: string;

    title: string;

    /**
		If this overlay has a currency item that it features, this is said featured item.
		*/
    currencyItemHash?: number;
  }

  /**
	Display Categories are different from "categories" in that these are specifically for visual grouping
	and display of categories in Vendor UI.  The "categories" structure is for validation of the contained
	items, and can be categorized entirely separately from "Display Categories", there need be and often will be
	no meaningful relationship between the two.
	*/
  export interface DestinyDisplayCategoryDefinition {
    index: number;

    /**
		A string identifier for the display category.
		*/
    identifier: string;

    displayCategoryHash: number;

    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If true, this category should be displayed in the "Banner" section of the vendor's UI.
		*/
    displayInBanner: boolean;

    /**
		If it exists, this is the hash identifier of a DestinyProgressionDefinition that represents
		the progression to show on this display category.
		
		Specific categories can now have thier own distinct progression, apparently.  So that's cool.
		*/
    progressionHash?: number;

    /**
		If this category sorts items in a nonstandard way, this will be the way we sort.
		*/
    sortOrder: Globals.VendorDisplayCategorySortOrder;

    /**
		An indicator of how the category will be displayed in the UI.  It's up to you to do something
		cool or interesting in response to this, or just to treat it as a normal category.
		*/
    displayStyleHash?: number;

    /**
		An indicator of how the category will be displayed in the UI.  It's up to you to do something
		cool or interesting in response to this, or just to treat it as a normal category.
		*/
    displayStyleIdentifier: string;
  }

  /**
	A Vendor Interaction is a dialog shown by the vendor other than sale items or transfer screens.
	The vendor is showing you something, and asking you to reply to it by choosing an option or reward.
	*/
  export interface DestinyVendorInteractionDefinition {
    /**
		The position of this interaction in its parent array.  Note that this is NOT content agnostic,
		and should not be used as such.
		*/
    interactionIndex: number;

    /**
		The potential replies that the user can make to the interaction.
		*/
    replies: Definitions.DestinyVendorInteractionReplyDefinition[];

    /**
		If >= 0, this is the category of sale items to show along with this interaction dialog.
		*/
    vendorCategoryIndex: number;

    /**
		If this interaction dialog is about a quest, this is the questline related to the interaction.
		You can use this to show the quest overview, or even the character's status with the quest if
		you use it to find the character's current Quest Step by checking their inventory against this questlineItemHash's
		DestinyInventoryItemDefinition.setData.
		*/
    questlineItemHash: number;

    /**
		If this interaction is meant to show you sacks, this is the list of types of sacks to be shown.
		If empty, the interaction is not meant to show sacks.
		*/
    sackInteractionList: Definitions.DestinyVendorInteractionSackEntryDefinition[];

    /**
		A UI hint for the behavior of the interaction screen.
		This is useful to determine what type of interaction is occurring, such as a prompt to receive
		a rank up reward or a prompt to choose a reward for completing a quest.  The hash isn't as useful
		as the Enum in retrospect, well what can you do.  Try using interactionType instead.
		*/
    uiInteractionType: number;

    /**
		The enumerated version of the possible UI hints for vendor interactions, which is a little easier
		to grok than the hash found in uiInteractionType.
		*/
    interactionType: Globals.VendorInteractionType;

    /**
		If this interaction is displaying rewards, this is the text to use for the header of the
		reward-displaying section of the interaction.
		*/
    rewardBlockLabel: string;

    /**
		If the vendor's reward list is sourced from one of his categories, this is the index into
		the category array of items to show.
		*/
    rewardVendorCategoryIndex: number;

    /**
		If the vendor interaction has flavor text, this is some of it.
		*/
    flavorLineOne: string;

    /**
		If the vendor interaction has flavor text, this is the rest of it.
		*/
    flavorLineTwo: string;

    /**
		The header for the interaction dialog.
		*/
    headerDisplayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The localized text telling the player what to do when they see this dialog.
		*/
    instructions: string;
  }

  /**
	When the interaction is replied to, Reward sites will fire and items potentially selected based on
	whether the given unlock expression is TRUE.
	
	You can potentially choose one from multiple replies when replying to an interaction: this is how
	you get either/or rewards from vendors.
	*/
  export interface DestinyVendorInteractionReplyDefinition {
    /**
		The rewards granted upon responding to the vendor.
		*/
    itemRewardsSelection: Globals.DestinyVendorInteractionRewardSelection;

    /**
		The localized text for the reply.
		*/
    reply: string;

    /**
		An enum indicating the type of reply being made.
		*/
    replyType: Globals.DestinyVendorReplyType;
  }

  /**
	Compare this sackType to the sack identifier in the DestinyInventoryItemDefinition.vendorSackType
	property of items.  If they match, show this sack with this interaction.
	*/
  export interface DestinyVendorInteractionSackEntryDefinition {
    sackType: number;
  }

  /**
	The definition for an "inventory flyout": a UI screen where we show you
	part of an otherwise hidden vendor inventory: like the Vault inventory buckets.
	*/
  export interface DestinyVendorInventoryFlyoutDefinition {
    /**
		If the flyout is locked, this is the reason why.
		*/
    lockedDescription: string;

    /**
		The title and other common properties of the flyout.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A list of inventory buckets and other metadata to show on the screen.
		*/
    buckets: Definitions.DestinyVendorInventoryFlyoutBucketDefinition[];

    /**
		An identifier for the flyout, in case anything else needs to refer to them.
		*/
    flyoutId: number;

    /**
		If this is true, don't show any of the glistening "this is a new item" UI elements, like we show on the inventory items
		themselves in in-game UI.
		*/
    suppressNewness: boolean;

    /**
		If this flyout is meant to show you the contents of the player's equipment slot, this is the slot to show.
		*/
    equipmentSlotHash?: number;
  }

  /**
	Information about a single inventory bucket in a vendor flyout UI and how it is shown.
	*/
  export interface DestinyVendorInventoryFlyoutBucketDefinition {
    /**
		If true, the inventory bucket should be able to be collapsed visually.
		*/
    collapsible: boolean;

    /**
		The inventory bucket whose contents should be shown.
		*/
    inventoryBucketHash: number;

    /**
		The methodology to use for sorting items from the flyout.
		*/
    sortItemsBy: Globals.DestinyItemSortType;
  }

  /**
	This represents an item being sold by the vendor.
	*/
  export interface DestinyVendorItemDefinition {
    /**
		The index into the DestinyVendorDefinition.saleList.  This is what we use to refer to items
		being sold throughout live and definition data.
		*/
    vendorItemIndex: number;

    /**
		The hash identifier of the item being sold (DestinyInventoryItemDefinition).
		
		Note that a vendor can sell the same item in multiple ways, so don't assume that itemHash is
		a unique identifier for this entity.
		*/
    itemHash: number;

    /**
		The amount you will recieve of the item described in itemHash if you make the purchase.
		*/
    quantity: number;

    /**
		An list of indexes into the DestinyVendorDefinition.failureStrings array, indicating
		the possible failure strings that can be relevant for this item.
		*/
    failureIndexes: number[];

    /**
		This is a pre-compiled aggregation of item value and priceOverrideList, so that we have one place
		to check for what the purchaser must pay for the item.  Use this instead of trying to piece together
		the price separately.
		
		The somewhat crappy part about this is that, now that item quantity overrides have dynamic modifiers,
		this will not necessarily be statically true.  If you were using this instead of live data, switch to
		using live data.
		*/
    currencies: Definitions.DestinyVendorItemQuantity[];

    /**
		If this item can be refunded, this is the policy for what will be refundd, how, and in what time period.
		*/
    refundPolicy: Globals.DestinyVendorItemRefundPolicy;

    /**
		The amount of time before refundability of the newly purchased item will expire.
		*/
    refundTimeLimit: number;

    /**
		The Default level at which the item will spawn.  Almost always driven by an adjusto these days.
		Ideally should be singular.  It's a long story how this ended up as a list, but there is always either
		going to be 0:1 of these entities.
		*/
    creationLevels: Definitions.DestinyItemCreationEntryLevelDefinition[];

    /**
		This is an index specifically into the display category, as opposed to the server-side Categories
		(which do not need to match or pair with each other in any way: server side categories are really just
		structures for common validation.  Display Category will let us more easily categorize items visually)
		*/
    displayCategoryIndex: number;

    /**
		The index into the DestinyVendorDefinition.categories array, so you can find the category associated with
		this item.
		*/
    categoryIndex: number;

    /**
		Same as above, but for the original category indexes.
		*/
    originalCategoryIndex: number;

    /**
		The minimum character level at which this item is available for sale.
		*/
    minimumLevel: number;

    /**
		The maximum character level at which this item is available for sale.
		*/
    maximumLevel: number;

    /**
		The action to be performed when purchasing the item, if it's not just "buy".
		*/
    action: Definitions.DestinyVendorSaleItemActionBlockDefinition;

    /**
		The string identifier for the category selling this item.
		*/
    displayCategory: string;

    /**
		The inventory bucket into which this item will be placed upon purchase.
		*/
    inventoryBucketHash: number;

    /**
		The most restrictive scope that determines whether the item is available in the Vendor's inventory.
		See DestinyGatingScope's documentation for more information.
		
		This can be determined by Unlock gating, or by whether or not the item has purchase level requirements (minimumLevel
		and maximumLevel properties).
		*/
    visibilityScope: Globals.DestinyGatingScope;

    /**
		Similar to visibilityScope, it represents the most restrictive scope that determines whether the item can be purchased.
		It will at least be as restrictive as visibilityScope, but could be more restrictive if the item has additional
		purchase requirements beyond whether it is merely visible or not.
		
		See DestinyGatingScope's documentation for more information.
		*/
    purchasableScope: Globals.DestinyGatingScope;

    /**
		If this item can only be purchased by a given platform, this indicates the platform to which it is restricted.
		*/
    exclusivity: Globals.BungieMembershipType;

    /**
		If this sale can only be performed as the result of an offer check, this is true.
		*/
    isOffer?: boolean;

    /**
		If this sale can only be performed as the result of receiving a CRM offer, this is true.
		*/
    isCrm?: boolean;

    /**
		*if* the category this item is in supports non-default sorting, this value should
		represent the sorting value to use, pre-processed and ready to go.
		*/
    sortValue: number;

    /**
		If this item can expire, this is the tooltip message to show with its expiration info.
		*/
    expirationTooltip: string;

    /**
		If this is populated, the purchase of this item should redirect to purchasing these other items instead.
		*/
    redirectToSaleIndexes: number[];

    socketOverrides: Definitions.DestinyVendorItemSocketOverride[];

    /**
		If true, this item is some sort of dummy sale item that cannot actually be purchased.  It may be a display only item,
		or some fluff left by a content designer for testing purposes, or something that got disabled because it was
		a terrible idea.  You get the picture.  We won't know *why* it can't be purchased, only that it can't be.  Sorry.
		
		This is also only whether it's unpurchasable as a static property according to game content.  There are other 
		reasons why an item may or may not be purchasable at runtime, so even if this isn't set to True you should trust
		the runtime value for this sale item over the static definition if this is unset.
		*/
    unpurchasable?: boolean;
  }

  /**
	In addition to item quantity information for vendor prices, this also has
	any optional information that may exist about how the item's quantity can be modified.
	(unfortunately not information that is able to be read outside of the BNet servers, but it's there)
	*/
  export interface DestinyVendorItemQuantity {
    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;
  }

  /**
	An overly complicated wrapper for the item level at which the item should spawn.
	*/
  export interface DestinyItemCreationEntryLevelDefinition {
    level: number;
  }

  /**
	Not terribly useful, some basic cooldown interaction info.
	*/
  export interface DestinyVendorSaleItemActionBlockDefinition {
    executeSeconds: number;

    isPositive: boolean;
  }

  /**
	The information for how the vendor purchase should override a given socket with custom plug data.
	*/
  export interface DestinyVendorItemSocketOverride {
    /**
		If this is populated, the socket will be overridden with a specific plug.
		
		If this isn't populated, it's being overridden by something more complicated that
		is only known by the Game Server and God, which means we can't tell you in advance
		what it'll be.
		*/
    singleItemHash?: number;

    /**
		If this is greater than -1, the number of randomized plugs on this socket will be
		set to this quantity instead of whatever it's set to by default.
		*/
    randomizedOptionsCount: number;

    /**
		This appears to be used to select which socket ultimately gets the override defined here.
		*/
    socketTypeHash: number;
  }

  /**
	When a vendor provides services, this is the localized name of those services.
	*/
  export interface DestinyVendorServiceDefinition {
    /**
		The localized name of a service provided.
		*/
    name: string;
  }

  /**
	If you ever wondered how the Vault works, here it is.
	
	The Vault is merely a set of inventory buckets that exist on your Profile/Account level.
	When you transfer items in the Vault, the game is using the Vault Vendor's DestinyVendorAcceptedItemDefinitions
	to see where the appropriate destination bucket is for the source bucket from whence your item is moving.
	If it finds such an entry, it transfers the item to the other bucket.
	
	The mechanics for Postmaster works similarly, which is also a vendor.  All driven by Accepted Items.
	*/
  export interface DestinyVendorAcceptedItemDefinition {
    /**
		The "source" bucket for a transfer.  When a user wants to transfer an item, the appropriate DestinyVendorDefinition's
		acceptedItems property is evaluated, looking for an entry where acceptedInventoryBucketHash matches
		the bucket that the item being transferred is currently located.  If it exists, the item will be
		transferred into whatever bucket is defined by destinationInventoryBucketHash.
		*/
    acceptedInventoryBucketHash: number;

    /**
		This is the bucket where the item being transferred will be put, given that it was being
		transferred *from* the bucket defined in acceptedInventoryBucketHash.
		*/
    destinationInventoryBucketHash: number;
  }

  export interface DestinyVendorGroupReference {
    /**
		The DestinyVendorGroupDefinition to which this Vendor can belong.
		*/
    vendorGroupHash: number;
  }

  /**
	On to one of the more confusing subjects of the API.  What is a Destination, and what
	is the relationship between it, Activities, Locations, and Places?
	
	A "Destination" is a specific region/city/area of a larger "Place".
	For instance, a Place might be Earth where a Destination might be Bellevue, Washington.
	(Please, pick a more interesting destination if you come to visit Earth).
	*/
  export interface DestinyDestinationDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The place that "owns" this Destination.  Use this hash to look up the DestinyPlaceDefinition.
		*/
    placeHash: number;

    /**
		If this Destination has a default Free-Roam activity, this is the hash for that Activity.
		Use it to look up the DestinyActivityDefintion.
		*/
    defaultFreeroamActivityHash: number;

    /**
		If the Destination has default Activity Graphs (i.e. "Map") that should be shown
		in the director, this is the list of those Graphs.  At most, only one should be active
		at any given time for a Destination: these would represent, for example, different
		variants on a Map if the Destination is changing on a macro level based on game state.
		*/
    activityGraphEntries: Definitions.DestinyActivityGraphListEntryDefinition[];

    /**
		A Destination may have many "Bubbles" zones with human readable properties.
		
		We don't get as much info as I'd like about them - I'd love to return info like 
		where on the map they are located - but at least this gives you the name of those bubbles.
		bubbleSettings and bubbles both have the identical number of entries, and you should
		match up their indexes to provide matching bubble and bubbleSettings data.
		
		DEPRECATED - Just use bubbles, it now has this data.
		*/
    bubbleSettings: Definitions.DestinyDestinationBubbleSettingDefinition[];

    /**
		This provides the unique identifiers for every bubble in the destination
		(only guaranteed unique within the destination), and any intrinsic properties of the bubble.
		
		bubbleSettings and bubbles both have the identical number of entries, and you should
		match up their indexes to provide matching bubble and bubbleSettings data.
		*/
    bubbles: Definitions.DestinyBubbleDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Destinations and Activities may have default Activity Graphs that should be shown
	when you bring up the Director and are playing in either.
	
	This contract defines the graph referred to and the gating for when it is relevant.
	*/
  export interface DestinyActivityGraphListEntryDefinition {
    /**
		The hash identifier of the DestinyActivityGraphDefinition that should be shown when opening
		the director.
		*/
    activityGraphHash: number;
  }

  /**
	Human readable data about the bubble.  Combine with DestinyBubbleDefinition - see
	DestinyDestinationDefinition.bubbleSettings for more information.
	
	DEPRECATED - Just use bubbles.
	*/
  export interface DestinyDestinationBubbleSettingDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;
  }

  /**
	Basic identifying data about the bubble.  Combine with DestinyDestinationBubbleSettingDefinition - see
	DestinyDestinationDefinition.bubbleSettings for more information.
	*/
  export interface DestinyBubbleDefinition {
    /**
		The identifier for the bubble: only guaranteed to be unique within the Destination.
		*/
    hash: number;

    /**
		The display properties of this bubble, so you don't have to look them up in a separate list anymore.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;
  }

  /**
	The static data about Activities in Destiny 2.
	
	Note that an Activity must be combined with an ActivityMode to know - from a Gameplay perspective -
	what the user is "Playing".
	
	In most PvE activities, this is fairly straightforward.  A Story Activity can only be played in the Story
	Activity Mode.
	
	However, in PvP activities, the Activity alone only tells you the map being played, or the Playlist that the user
	chose to enter.  You'll need to know the Activity Mode they're playing to know that they're playing Mode X on Map Y.
	
	Activity Definitions tell a great deal of information about what *could* be relevant to a user: what rewards they
	can earn, what challenges could be performed, what modifiers could be applied.  To figure out which of these properties
	is actually live, you'll need to combine the definition with "Live" data from one of the Destiny endpoints.
	
	Activities also have Activity Types, but unfortunately in Destiny 2 these are even less reliable of a source of
	information than they were in Destiny 1.  I will be looking into ways to provide more reliable sources for type information
	as time goes on, but for now we're going to have to deal with the limitations.  See DestinyActivityTypeDefinition
	for more information.
	*/
  export interface DestinyActivityDefinition {
    /**
		The title, subtitle, and icon for the activity.  We do a little post-processing on this to try and account for
		Activities where the designers have left this data too minimal to determine what activity is actually being played.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The unadulterated form of the display properties, as they ought to be shown in the Director (if the activity appears
		in the director).
		*/
    originalDisplayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The title, subtitle, and icon for the activity as determined by Selection Screen data, if there is any for this activity.
		There won't be data in this field if the activity is never shown in a selection/options screen.
		*/
    selectionScreenDisplayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If the activity has an icon associated with a specific release (such as a DLC),
		this is the path to that release's icon.
		*/
    releaseIcon: string;

    /**
		If the activity will not be visible until a specific and known time, this will be
		the seconds since the Epoch when it will become visible.
		*/
    releaseTime: number;

    /**
		The recommended light level for this activity.
		*/
    activityLightLevel: number;

    /**
		The hash identifier for the Destination on which this Activity is played.  Use it to look up
		the DestinyDestinationDefinition for human readable info about the destination.
		A Destination can be thought of as a more specific location than a "Place".  For instance,
		if the "Place" is Earth, the "Destination" would be a specific city or region on Earth.
		*/
    destinationHash: number;

    /**
		The hash identifier for the "Place" on which this Activity is played.  Use it to look up
		the DestinyPlaceDefinition for human readable info about the Place.
		A Place is the largest-scoped concept for location information.  For instance,
		if the "Place" is Earth, the "Destination" would be a specific city or region on Earth.
		*/
    placeHash: number;

    /**
		The hash identifier for the Activity Type of this Activity.  You may use it to look up
		the DestinyActivityTypeDefinition for human readable info, but be forewarned: Playlists and
		many PVP Map Activities will map to generic Activity Types.  You'll have to use your knowledge
		of the Activity Mode being played to get more specific information about what the user is playing.
		*/
    activityTypeHash: number;

    /**
		The difficulty tier of the activity.
		*/
    tier: number;

    /**
		When Activities are completed, we generate a "Post-Game Carnage Report", or PGCR, with details about
		what happened in that activity (how many kills someone got, which team won, etc...)  We use this image
		as the background when displaying PGCR information, and often use it when we refer to the Activity in general.
		*/
    pgcrImage: string;

    /**
		The expected possible rewards for the activity.  These rewards may or may not be accessible for an individual player
		based on their character state, the account state, and even the game's state overall.  But it is a useful reference
		for possible rewards you can earn in the activity.  These match up to rewards displayed when you hover over
		the Activity in the in-game Director, and often refer to Placeholder or "Dummy" items: items that tell you 
		what you can earn in vague terms rather than what you'll specifically be earning (partly because the game
		doesn't even know what you'll earn specifically until you roll for it at the end)
		*/
    rewards: Definitions.DestinyActivityRewardDefinition[];

    /**
		Activities can have Modifiers, as defined in DestinyActivityModifierDefinition.  These are references
		to the modifiers that *can* be applied to that activity, along with data that we use to determine if
		that modifier is actually active at any given point in time.
		*/
    modifiers: Definitions.DestinyActivityModifierReferenceDefinition[];

    /**
		If True, this Activity is actually a Playlist that refers to multiple possible specific Activities and Activity
		Modes.  For instance, a Crucible Playlist may have references to multiple Activities (Maps) with multiple Activity Modes
		(specific PvP gameplay modes).  If this is true, refer to the playlistItems property for the specific entries
		in the playlist.
		*/
    isPlaylist: boolean;

    /**
		An activity can have many Challenges, of which any subset of them may be active for play
		at any given period of time.  This gives the information about the challenges and data
		that we use to understand when they're active and what rewards they provide.
		Sadly, at the moment there's no central definition for challenges: much like "Skulls" were
		in Destiny 1, these are defined on individual activities and there can be many duplicates/near duplicates
		across the Destiny 2 ecosystem.  I have it in mind to centralize these in a future revision of the API, but
		we are out of time.
		*/
    challenges: Definitions.DestinyActivityChallengeDefinition[];

    /**
		If there are status strings related to the activity and based on internal state of the game, account, or character,
		then this will be the definition of those strings and the states needed in order for the strings to be shown.
		*/
    optionalUnlockStrings: Definitions.DestinyActivityUnlockStringDefinition[];

    requirements: Definitions.DestinyActivityRequirementsBlock;

    /**
		Represents all of the possible activities that could be played in the Playlist, along with information
		that we can use to determine if they are active at the present time.
		*/
    playlistItems: Definitions.DestinyActivityPlaylistItemDefinition[];

    /**
		Unfortunately, in practice this is almost never populated.  In theory, this is supposed to tell
		which Activity Graph to show if you bring up the director while in this activity.
		*/
    activityGraphList: Definitions.DestinyActivityGraphListEntryDefinition[];

    /**
		This block of data provides information about the Activity's matchmaking attributes: how many people can join and such.
		*/
    matchmaking: Definitions.DestinyActivityMatchmakingBlockDefinition;

    /**
		This block of data, if it exists, provides information about the guided game experience and restrictions for this
		activity.  If it doesn't exist, the game is not able to be played as a guided game.
		*/
    guidedGame: Definitions.DestinyActivityGuidedBlockDefinition;

    /**
		If this activity had an activity mode directly defined on it, this will be the hash of that mode.
		*/
    directActivityModeHash?: number;

    /**
		If the activity had an activity mode directly defined on it, this will be the enum value of that mode.
		*/
    directActivityModeType?: Globals.DestinyActivityModeType;

    /**
		The set of all possible loadout requirements that could be active for this activity.
		Only one will be active at any given time, and you can discover which one through activity-associated
		data such as Milestones that have activity info on them.
		*/
    loadouts: Definitions.DestinyActivityLoadoutRequirementSet[];

    /**
		The hash identifiers for Activity Modes relevant to this activity.  
		Note that if this is a playlist, the specific playlist entry chosen
		will determine the actual activity modes that end up being relevant.
		*/
    activityModeHashes: number[];

    /**
		The activity modes - if any - in enum form.  Because we can't seem to escape the enums.
		*/
    activityModeTypes: Globals.DestinyActivityModeType[];

    /**
		If true, this activity is a PVP activity or playlist.
		*/
    isPvP: boolean;

    /**
		The list of phases or points of entry into an activity, along with information we can use to
		determine their gating and availability.
		*/
    insertionPoints: Definitions.DestinyActivityInsertionPointDefinition[];

    /**
		A list of location mappings that are affected by this activity.  Pulled out of DestinyLocationDefinitions
		for our/your lookup convenience.
		*/
    activityLocationMappings: Constants.DestinyEnvironmentLocationMapping[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Activities can refer to one or more sets of tooltip-friendly reward data.  These are the definitions
	for those tooltip friendly rewards.
	*/
  export interface DestinyActivityRewardDefinition {
    /**
		The header for the reward set, if any.
		*/
    rewardText: string;

    /**
		The "Items provided" in the reward.  This is almost always a pointer to a DestinyInventoryItemDefintion
		for an item that you can't actually earn in-game, but that has name/description/icon information for
		the vague concept of the rewards you will receive.  This is because the actual reward generation is
		non-deterministic and extremely complicated, so the best the game can do is tell you what you'll get
		in vague terms.  And so too shall we.
		
		Interesting trivia: you actually *do* earn these items when you complete the activity.  They go into a single-slot
		bucket on your profile, which is how you see the pop-ups of these rewards when you complete an activity that match
		these "dummy" items.  You can even see them if you look at the last one you earned in your
		profile-level inventory through the BNet API!  Who said reading documentation is a waste of time?
		*/
    rewardItems: World.DestinyItemQuantity[];
  }

  /**
	A reference to an Activity Modifier from another entity, such as an Activity
	(for now, just Activities).
	
	This defines some
	*/
  export interface DestinyActivityModifierReferenceDefinition {
    /**
		The hash identifier for the DestinyActivityModifierDefinition referenced by this activity.
		*/
    activityModifierHash: number;
  }

  /**
	Represents a reference to a Challenge, which for now is just an Objective.
	*/
  export interface DestinyActivityChallengeDefinition {
    /**
		The hash for the Objective that matches this challenge.  Use it to look up the DestinyObjectiveDefinition.
		*/
    objectiveHash: number;

    /**
		The rewards as they're represented in the UI.  Note that they generally link to "dummy" items that give
		a summary of rewards rather than direct, real items themselves.
		
		If the quantity is 0, don't show the quantity.
		*/
    dummyRewards: World.DestinyItemQuantity[];
  }

  /**
	Represents a status string that could be conditionally displayed about an activity.
	Note that externally, you can only see the strings themselves.  Internally we combine this information
	with server state to determine which strings should be shown.
	*/
  export interface DestinyActivityUnlockStringDefinition {
    /**
		The string to be displayed if the conditions are met.
		*/
    displayString: string;
  }

  export interface DestinyActivityRequirementsBlock {
    /**
		If being a fireteam Leader in this activity is gated, this is the gate being checked.
		*/
    leaderRequirementLabels: Definitions.DestinyActivityRequirementLabel[];

    /**
		If being a fireteam member in this activity is gated, this is the gate being checked.
		*/
    fireteamRequirementLabels: Definitions.DestinyActivityRequirementLabel[];
  }

  export interface DestinyActivityRequirementLabel {
    displayString: string;
  }

  /**
	If the activity is a playlist, this is the definition for a specific entry in the playlist: a single possible
	combination of Activity and Activity Mode that can be chosen.
	*/
  export interface DestinyActivityPlaylistItemDefinition {
    /**
		The hash identifier of the Activity that can be played.  Use it to look up the DestinyActivityDefinition.
		*/
    activityHash: number;

    /**
		If this playlist entry had an activity mode directly defined on it, this will be the hash of that mode.
		*/
    directActivityModeHash?: number;

    /**
		If the playlist entry had an activity mode directly defined on it, this will be the enum value of that mode.
		*/
    directActivityModeType?: Globals.DestinyActivityModeType;

    /**
		The hash identifiers for Activity Modes relevant to this entry.
		*/
    activityModeHashes: number[];

    /**
		The activity modes - if any - in enum form.  Because we can't seem to escape the enums.
		*/
    activityModeTypes: Globals.DestinyActivityModeType[];
  }

  /**
	Information about matchmaking and party size for the activity.
	*/
  export interface DestinyActivityMatchmakingBlockDefinition {
    /**
		If TRUE, the activity is matchmade.  Otherwise, it requires explicit forming of a party.
		*/
    isMatchmade: boolean;

    /**
		The minimum # of people in the fireteam for the activity to launch.
		*/
    minParty: number;

    /**
		The maximum # of people allowed in a Fireteam.
		*/
    maxParty: number;

    /**
		The maximum # of people allowed across all teams in the activity.
		*/
    maxPlayers: number;

    /**
		If true, you have to Solemnly Swear to be up to Nothing But Good(tm) to play.
		*/
    requiresGuardianOath: boolean;
  }

  /**
	Guided Game information for this activity.
	*/
  export interface DestinyActivityGuidedBlockDefinition {
    /**
		The maximum amount of people that can be in the waiting lobby.
		*/
    guidedMaxLobbySize: number;

    /**
		The minimum amount of people that can be in the waiting lobby.
		*/
    guidedMinLobbySize: number;

    /**
		If -1, the guided group cannot be disbanded.  Otherwise, take the total # of players in the activity
		and subtract this number: that is the total # of votes needed for the guided group to disband.
		*/
    guidedDisbandCount: number;
  }

  export interface DestinyActivityLoadoutRequirementSet {
    /**
		The set of requirements that will be applied on the activity if this requirement set
		is active.
		*/
    requirements: Definitions.DestinyActivityLoadoutRequirement[];
  }

  export interface DestinyActivityLoadoutRequirement {
    equipmentSlotHash: number;

    allowedEquippedItemHashes: number[];

    allowedWeaponSubTypes: Globals.DestinyItemSubType[];
  }

  /**
	A point of entry into an activity, gated by an unlock flag and with some more-or-less useless
	(for our purposes) phase information.  I'm including it in case we end up being able to bolt
	more useful information onto it in the future.
	
	UPDATE: Turns out this information isn't actually useless, and is in fact actually useful for people.
	Who would have thought?  We still don't have localized info for it, but at least this will help people
	when they're looking at phase indexes in stats data, or when they want to know what phases have been
	completed on a weekly achievement.
	*/
  export interface DestinyActivityInsertionPointDefinition {
    /**
		A unique hash value representing the phase.  This can be useful for, for example,
		comparing how different instances of Raids have phases in different orders!
		*/
    phaseHash: number;
  }

  /**
	Okay, so Activities (DestinyActivityDefinition) take place in Destinations
	(DestinyDestinationDefinition).  Destinations are part of larger locations known as
	Places (you're reading its documentation right now).
	
	Places are more on the planetary scale, like "Earth" and "Your Mom."
	*/
  export interface DestinyPlaceDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	The definition for an Activity Type.
	
	In Destiny 2, an Activity Type represents a conceptual categorization of Activities.
	
	These are most commonly used in the game for the subtitle under Activities, but BNet
	uses them extensively to identify and group activities by their common properties.
	
	Unfortunately, there has been a movement away from providing the richer data in Destiny 2
	that we used to get in Destiny 1 for Activity Types.  For instance, Nightfalls are
	grouped under the same Activity Type as regular Strikes.  
	
	For this reason, BNet will eventually migrate toward Activity Modes as a better indicator of activity category.
	But for the time being, it is still referred to in many places across our codebase.
	*/
  export interface DestinyActivityTypeDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	This definition represents an "Activity Mode" as it exists in the Historical Stats endpoints.
	An individual Activity Mode represents a collection of activities that are played in a certain way.
	For example, Nightfall Strikes are part of a "Nightfall" activity mode, and any activities played as
	the PVP mode "Clash" are part of the "Clash activity mode.
	
	Activity modes are nested under each other in a hierarchy, so that if you ask for - for example - "AllPvP",
	you will get any PVP activities that the user has played, regardless of what specific PVP mode was being played.
	*/
  export interface DestinyActivityModeDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If this activity mode has a related PGCR image, this will be the path to said image.
		*/
    pgcrImage: string;

    /**
		The Enumeration value for this Activity Mode.  Pass this identifier into Stats endpoints to get
		aggregate stats for this mode.
		*/
    modeType: Globals.DestinyActivityModeType;

    /**
		The type of play being performed in broad terms (PVP, PVE)
		*/
    activityModeCategory: Globals.DestinyActivityModeCategory;

    /**
		If True, this mode has oppositional teams fighting against each other rather than "Free-For-All"
		or Co-operative modes of play.
		
		Note that Aggregate modes are never marked as team based, even if they happen to be team based
		at the moment.  At any time, an aggregate whose subordinates are only team based could be changed
		so that one or more aren't team based, and then this boolean won't make much sense (the aggregation
		would become "sometimes team based").  Let's not deal with that right now.
		*/
    isTeamBased: boolean;

    /**
		If true, this mode is an aggregation of other, more specific modes rather than being a mode
		in itself.  This includes modes that group Features/Events rather than Gameplay, such as Trials of The Nine:
		Trials of the Nine being an Event that is interesting to see aggregate data for, but when you play the activities
		within Trials of the Nine they are more specific activity modes such as Clash.
		*/
    isAggregateMode: boolean;

    /**
		The hash identifiers of the DestinyActivityModeDefinitions that represent all of the "parent" modes
		for this mode.  For instance, the Nightfall Mode is also a member of AllStrikes and AllPvE.
		*/
    parentHashes: number[];

    /**
		A Friendly identifier you can use for referring to this Activity Mode.  We really only used this in
		our URLs, so... you know, take that for whatever it's worth.
		*/
    friendlyName: string;

    /**
		If this exists, the mode has specific Activities (referred to by the Key) that should instead
		map to other Activity Modes when they are played.  This was useful in D1 for Private Matches, where
		we wanted to have Private Matches as an activity mode while still referring to the specific
		mode being played.
		*/
    activityModeMappings: { [key: number]: Globals.DestinyActivityModeType };

    /**
		If FALSE, we want to ignore this type when we're showing activity modes in BNet UI.  It will still be returned in case
		3rd parties want to use it for any purpose.
		*/
    display: boolean;

    /**
		The relative ordering of activity modes.
		*/
    order: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	In an attempt to categorize items by type, usage, and other interesting properties, we created
	DestinyItemCategoryDefinition: information about types that is assembled using a set of heuristics
	that examine the properties of an item such as what inventory bucket it's in, its item type name,
	and whether it has or is missing certain blocks of data.
	
	This heuristic is imperfect, however.  If you find an item miscategorized, let us know on the Bungie
	API forums!
	
	We then populate all of the categories that we think an item belongs to in its 
	DestinyInventoryItemDefinition.itemCategoryHashes property.  You can use that to provide
	your own custom item filtering, sorting, aggregating... go nuts on it!  And let us know if you
	see more categories that you wish would be added!
	*/
  export interface DestinyItemCategoryDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If True, this category should be visible in UI.  Sometimes we make categories that we
		don't think are interesting externally.  It's up to you if you want to skip on showing them.
		*/
    visible: boolean;

    /**
		If True, this category has been deprecated: it may have no items left, or there may be only legacy items
		that remain in it which are no longer relevant to the game.
		*/
    deprecated: boolean;

    /**
		A shortened version of the title.  The reason why we have this is because the Armory in German
		had titles that were too long to display in our UI, so these were localized abbreviated versions
		of those categories.  The property still exists today, even though the Armory doesn't exist for D2... yet.
		*/
    shortTitle: string;

    /**
		The janky regular expression we used against the item type to try and discern whether
		the item belongs to this category.
		*/
    itemTypeRegex: string;

    /**
		If the item in question has this category, it also should have this breaker type.
		*/
    grantDestinyBreakerType: Globals.DestinyBreakerType;

    /**
		If the item is a plug, this is the identifier we expect to find associated with it if it is in this category.
		*/
    plugCategoryIdentifier: string;

    /**
		If the item type matches this janky regex, it does *not* belong to this category.
		*/
    itemTypeRegexNot: string;

    /**
		If the item belongs to this bucket, it does belong to this category.
		*/
    originBucketIdentifier: string;

    /**
		If an item belongs to this category, it will also receive this item type.
		This is now how DestinyItemType is populated for items: it used to be an even jankier process,
		but that's a story that requires more alcohol.
		*/
    grantDestinyItemType: Globals.DestinyItemType;

    /**
		If an item belongs to this category, it will also receive this subtype enum value.
		
		I know what you're thinking - what if it belongs to multiple categories that provide sub-types?
		
		The last one processed wins, as is the case with all of these "grant" enums.  Now you can see
		one reason why we moved away from these enums... but they're so convenient when they work, aren't they?
		*/
    grantDestinySubType: Globals.DestinyItemSubType;

    /**
		If an item belongs to this category, it will also get this class restriction enum value.
		
		See the other "grant"-prefixed properties on this definition for my color commentary.
		*/
    grantDestinyClass: Globals.DestinyClass;

    /**
		The traitId that can be found on items that belong to this category.
		*/
    traitId: string;

    /**
		If this category is a "parent" category of other categories, those children will have their
		hashes listed in rendering order here, and can be looked up using these hashes against
		DestinyItemCategoryDefinition.
		
		In this way, you can build up a visual hierarchy of item categories.  That's what we did,
		and you can do it too.  I believe in you.  Yes, you, Carl.
		
		(I hope someone named Carl reads this someday)
		*/
    groupedCategoryHashes: number[];

    /**
		All item category hashes of "parent" categories: categories that contain this as a child
		through the hierarchy of groupedCategoryHashes.  It's a bit redundant, but having this child-centric
		list speeds up some calculations.
		*/
    parentCategoryHashes: number[];

    /**
		If true, this category is only used for grouping, and should not be evaluated with its own checks.
		Rather, the item only has this category if it has one of its child categories.
		*/
    groupCategoryOnly: boolean;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Aggregations of multiple progressions.
	
	These are used to apply rewards to multiple progressions
	at once.  They can sometimes have human readable data as well, but only extremely sporadically.
	*/
  export interface DestinyProgressionMappingDefinition {
    /**
		Infrequently defined in practice.  Defer to the individual progressions' display properties.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The localized unit of measurement for progression across the progressions defined in this
		mapping.  Unfortunately, this is very infrequently defined.  Defer to the individual
		progressions' display units.
		*/
    displayUnits: string;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Represent a set of material requirements: Items that either need to be owned or need to be consumed
	in order to perform an action.
	
	A variety of other entities refer to these as gatekeepers and payments
	for actions that can be performed in game.
	*/
  export interface DestinyMaterialRequirementSetDefinition {
    /**
		The list of all materials that are required.
		*/
    materials: Definitions.DestinyMaterialRequirement[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	When an inventory item (DestinyInventoryItemDefinition) has Stats (such as Attack Power),
	the item will refer to a Stat Group.  This definition enumerates the properties used to
	transform the item's "Investment" stats into "Display" stats.
	
	See DestinyStatDefinition's documentation for information about the transformation
	of Stats, and the meaning of an Investment vs. a Display stat.
	
	If you don't want to do these calculations on your own, fear not: pulling live data from
	the BNet endpoints will return display stat values pre-computed and ready for you to use.
	I highly recommend this approach, saves a lot of time and also accounts for certain stat
	modifiers that can't easily be accounted for without live data (such as stat modifiers on
	Talent Grids and Socket Plugs)
	*/
  export interface DestinyStatGroupDefinition {
    /**
		The maximum possible value that any stat in this group can be transformed into.
		
		This is used by stats that *don't* have scaledStats entries below, but that
		still need to be displayed as a progress bar, in which case this is used
		as the upper bound for said progress bar.  (the lower bound is always 0)
		*/
    maximumValue: number;

    /**
		This apparently indicates the position of the stats in the UI?  I've returned it
		in case anyone can use it, but it's not of any use to us on BNet.  Something's being
		lost in translation with this value.
		*/
    uiPosition: number;

    /**
		Any stat that requires scaling to be transformed from an "Investment" stat to a "Display"
		stat will have an entry in this list.  For more information on what those types of stats
		mean and the transformation process, see DestinyStatDefinition.
		
		In retrospect, I wouldn't mind if this was a dictionary keyed by the stat hash instead.
		But I'm going to leave it be because [[After Apple Picking]].
		*/
    scaledStats: Definitions.DestinyStatDisplayDefinition[];

    /**
		The game has the ability to override, based on the stat group, what the localized text is
		that is displayed for Stats being shown on the item.
		
		Mercifully, no Stat Groups use this feature currently.  If they start using them,
		we'll all need to start using them (and those of you who are more prudent than I am
		can go ahead and start pre-checking for this.)
		*/
    overrides: { [key: number]: Definitions.DestinyStatOverrideDefinition };

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Describes the way that an Item Stat (see DestinyStatDefinition) is transformed
	using the DestinyStatGroupDefinition related to that item.  See both of the aforementioned
	definitions for more information about the stages of stat transformation.
	
	This represents the transformation of a stat into a "Display" stat (the closest value
	that BNet can get to the in-game display value of the stat)
	*/
  export interface DestinyStatDisplayDefinition {
    /**
		The hash identifier for the stat being transformed into a Display stat.
		
		Use it to look up the DestinyStatDefinition, or key into a DestinyInventoryItemDefinition's
		stats property.
		*/
    statHash: number;

    /**
		Regardless of the output of interpolation, this is the maximum possible value
		that the stat can be.  It should also be used as the upper bound
		for displaying the stat as a progress bar (the minimum always being 0)
		*/
    maximumValue: number;

    /**
		If this is true, the stat should be displayed as a number.  Otherwise, display it as
		a progress bar.  Or, you know, do whatever you want.  There's no displayAsNumeric
		police.
		*/
    displayAsNumeric: boolean;

    /**
		The interpolation table representing how the Investment Stat is transformed into
		a Display Stat.  
		
		See DestinyStatDefinition for a description of the stages of
		stat transformation.
		*/
    displayInterpolation: Interpolation.InterpolationPoint[];
  }

  /**
	Stat Groups (DestinyStatGroupDefinition) has the ability to override the localized text
	associated with stats that are to be shown on the items with which they are associated.
	
	This defines a specific overridden stat.  You could theoretically check these before
	rendering your stat UI, and for each stat that has an override show these displayProperties
	instead of those on the DestinyStatDefinition.
	
	Or you could be like us, and skip that for now because the game has yet to actually
	use this feature.  But know that it's here, waiting for a resilliant young designer to
	take up the mantle and make us all look foolish by showing the wrong name for stats.
	
	Note that, if this gets used, the override will apply only to items using the overriding
	Stat Group.  Other items will still show the default stat's name/description.
	*/
  export interface DestinyStatOverrideDefinition {
    /**
		The hash identifier of the stat whose display properties are being overridden.
		*/
    statHash: number;

    /**
		The display properties to show instead of the base DestinyStatDefinition display properties.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;
  }

  export interface DestinySandboxPatternDefinition {
    patternHash: number;

    patternGlobalTagIdHash: number;

    weaponContentGroupHash: number;

    weaponTranslationGroupHash: number;

    weaponTypeHash?: number;

    weaponType: Globals.DestinyItemSubType;

    filters: Definitions.DestinyArrangementRegionFilterDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyArrangementRegionFilterDefinition {
    artArrangementRegionHash: number;

    artArrangementRegionIndex: number;

    statHash: number;

    arrangementIndexByStatValue: { [key: number]: number };
  }

  /**
	Defines a Character Class in Destiny 2.  These are types of characters you can play, like
	Titan, Warlock, and Hunter.
	*/
  export interface DestinyClassDefinition {
    /**
		In Destiny 1, we added a convenience Enumeration for referring to classes.  We've kept it,
		though mostly for posterity.  This is the enum value for this definition's class.
		*/
    classType: Globals.DestinyClass;

    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A localized string referring to the singular form of the Class's name when referred to in gendered form.
		Keyed by the DestinyGender.
		*/
    genderedClassNames: {
      [K in EnumStrings<typeof Globals.DestinyGender>]?: string;
    };

    genderedClassNamesByGenderHash: { [key: number]: string };

    /**
		Mentors don't really mean anything anymore.  Don't expect this to be populated.
		*/
    mentorVendorHash?: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Gender is a social construct, and as such we have definitions for Genders.  Right now there happens
	to only be two, but we'll see what the future holds.
	*/
  export interface DestinyGenderDefinition {
    /**
		This is a quick reference enumeration for all of the currently defined Genders.  We use the enumeration
		for quicker lookups in related data, like DestinyClassDefinition.genderedClassNames.
		*/
    genderType: Globals.DestinyGender;

    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	These definitions represent Factions in the game.  Factions have ended up unilaterally being
	related to Vendors that represent them, but that need not necessarily be the case.
	
	A Faction is really just an entity that has a related progression for which a character can gain
	experience.  In Destiny 1, Dead Orbit was an example of a Faction: there happens to be a Vendor that represents
	Dead Orbit (and indeed, DestinyVendorDefinition.factionHash defines to this relationship), but
	Dead Orbit could theoretically exist without the Vendor that provides rewards.
	*/
  export interface DestinyFactionDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The hash identifier for the DestinyProgressionDefinition that indicates the character's relationship
		with this faction in terms of experience and levels.
		*/
    progressionHash: number;

    /**
		The faction token item hashes, and their respective progression values.
		*/
    tokenValues: { [key: number]: number };

    /**
		The faction reward item hash, usually an engram.
		*/
    rewardItemHash: number;

    /**
		The faction reward vendor hash, used for faction engram previews.
		*/
    rewardVendorHash: number;

    /**
		List of vendors that are associated with this faction.
		The last vendor that passes the unlock flag checks is the one that should be shown.
		*/
    vendors: Definitions.DestinyFactionVendorDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	These definitions represent faction vendors at different points in the game.
	
	A single faction may contain multiple vendors,
	or the same vendor available at two different locations.
	*/
  export interface DestinyFactionVendorDefinition {
    /**
		The faction vendor hash.
		*/
    vendorHash: number;

    destinationHash: number;

    backgroundImagePath: string;
  }

  /**
	A "Progression" in Destiny is best explained by an example.
	
	A Character's "Level" is a progression:
	it has Experience that can be earned, levels that can be gained, and is evaluated and displayed at
	various points in the game.  A Character's "Faction Reputation" is also a progression for much the same reason.
	
	Progression is used by a variety of systems, and the definition of a Progression will generally 
	only be useful if combining with live data (such as a character's DestinyCharacterProgressionComponent.progressions
	property, which holds that character's live Progression states).
	
	Fundamentally, a Progression measures your "Level" by evaluating the thresholds in its Steps (one step per level, except
	for the last step which can be repeated indefinitely for "Levels" that have no ceiling) against the total earned
	"progression points"/experience. (for simplicity purposes, we will henceforth refer to earned progression points as
	experience, though it need not be a mechanic that in any way resembles Experience in a traditional sense).
	
	Earned experience is calculated in a variety of ways, determined by the Progression's scope.  These go from
	looking up a stored value to performing exceedingly obtuse calculations.  This is why we provide live data
	in DestinyCharacterProgressionComponent.progressions, so you don't have to worry about those.
	*/
  export interface DestinyProgressionDefinition {
    displayProperties: Definitions.DestinyProgressionDisplayPropertiesDefinition;

    /**
		The "Scope" of the progression indicates the source of the progression's live data.
		
		See the DestinyProgressionScope enum for more info: but essentially, a Progression can either be
		backed by a stored value, or it can be a calculated derivative of other values.
		*/
    scope: Globals.DestinyProgressionScope;

    /**
		If this is True, then the progression doesn't have a maximum level.
		*/
    repeatLastStep: boolean;

    /**
		If there's a description of how to earn this progression in the local config, this will
		be that localized description.
		*/
    source: string;

    /**
		Progressions are divided into Steps, which roughly equate to "Levels" in the traditional
		sense of a Progression.  Notably, the last step can be repeated indefinitely if repeatLastStep
		is true, meaning that the calculation for your level is not as simple as comparing your current
		progress to the max progress of the steps.  
		
		These and more calculations are done for you if
		you grab live character progression data, such as in the DestinyCharacterProgressionComponent.
		*/
    steps: Definitions.DestinyProgressionStepDefinition[];

    /**
		If true, the Progression is something worth showing to users.
		
		If false, BNet isn't going to show it.  But that doesn't mean you can't.  We're all friends here.
		*/
    visible: boolean;

    /**
		If the value exists, this is the hash identifier for the Faction that owns this Progression.
		
		This is purely for convenience, if you're looking at a progression and want to know if and who
		it's related to in terms of Faction Reputation.
		*/
    factionHash?: number;

    /**
		The #RGB string value for the color related to this progression, if there is one.
		*/
    color: Misc.DestinyColor;

    /**
		For progressions that have it, this is the rank icon we use in the Companion, displayed
		above the progressions' rank value.
		*/
    rankIcon: string;

    rewardItems: Definitions.DestinyProgressionRewardItemQuantity[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyProgressionDisplayPropertiesDefinition {
    /**
		When progressions show your "experience" gained, that bar has units (i.e. "Experience",
		"Bad Dudes Snuffed Out", whatever).  This is the localized string for that unit of measurement.
		*/
    displayUnitsName: string;

    description: string;

    name: string;

    icon: string;

    iconSequences: Common.DestinyIconSequenceDefinition[];

    highResIcon: string;

    hasIcon: boolean;
  }

  /**
	This defines a single Step in a progression (which roughly equates to a level.  See DestinyProgressionDefinition
	for caveats).
	*/
  export interface DestinyProgressionStepDefinition {
    /**
		Very rarely, Progressions will have localized text describing the Level of the progression.
		This will be that localized text, if it exists.  Otherwise, the standard appears to be
		to simply show the level numerically.
		*/
    stepName: string;

    /**
		This appears to be, when you "level up", whether a visual effect will display and on what entity.
		See DestinyProgressionStepDisplayEffect for slightly more info.
		*/
    displayEffectType: Globals.DestinyProgressionStepDisplayEffect;

    /**
		The total amount of progression points/"experience" you will need to initially reach this step.
		If this is the last step and the progression is repeating indefinitely (DestinyProgressionDefinition.repeatLastStep),
		this will also be the progress needed to level it up further by repeating this step again.
		*/
    progressTotal: number;

    /**
		A listing of items rewarded as a result of reaching this level.
		*/
    rewardItems: World.DestinyItemQuantity[];

    /**
		If this progression step has a specific icon related to it, this is the icon to show.
		*/
    icon: string;
  }

  export interface DestinyProgressionRewardItemQuantity {
    rewardItemIndex: number;

    rewardedAtProgressionLevel: number;

    acquisitionBehavior: Globals.DestinyProgressionRewardItemAcquisitionBehavior;

    uiDisplayStyle: string;

    claimUnlockDisplayStrings: string[];

    socketOverrides: Definitions.DestinyProgressionSocketPlugOverride[];

    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;
  }

  /**
	The information for how progression item definitions should override a given socket with custom plug data.
	*/
  export interface DestinyProgressionSocketPlugOverride {
    socketTypeHash: number;

    overrideSingleItemHash?: number;
  }

  /**
	BNet attempts to group vendors into similar collections.  These groups aren't technically game canonical,
	but they are helpful for filtering vendors or showing them organized into a clean view on a webpage or app.
	
	These definitions represent the groups we've built.  Unlike in Destiny 1, a Vendors' group may change dynamically
	as the game state changes: thus, you will want to check DestinyVendorComponent responses to find a vendor's currently
	active Group (if you care).
	
	Using this will let you group your vendors in your UI in a similar manner to how we will do grouping in the Companion.
	*/
  export interface DestinyVendorGroupDefinition {
    /**
		The recommended order in which to render the groups, Ascending order.
		*/
    order: number;

    /**
		For now, a group just has a name.
		*/
    categoryName: string;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Represents a heuristically-determined "item source" according to Bungie.net.
	These item sources are non-canonical: we apply a combination of special configuration
	and often-fragile heuristics to attempt to discern whether an item should be part of a given
	"source," but we have known cases of false positives and negatives due to our imperfect heuristics.
	
	Still, they provide a decent approximation for people trying to figure out how an item can be obtained.
	DestinyInventoryItemDefinition refers to sources in the sourceDatas.sourceHashes property for all sources
	we determined the item could spawn from.
	
	An example in Destiny 1 of a Source would be "Nightfall".  If an item has the "Nightfall" source associated
	with it, it's extremely likely that you can earn that item while playing Nightfall, either during play
	or as an after-completion reward.
	*/
  export interface DestinyRewardSourceDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Sources are grouped into categories: common ways that items are provided.
		I hope to see this expand in Destiny 2 once we have time to generate accurate 
		reward source data.
		*/
    category: Globals.DestinyRewardSourceCategory;

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyItemSocketEntryPlugItemRandomizedDefinition {
    craftingRequirements: Definitions.DestinyPlugItemCraftingRequirements;

    /**
		Indicates if the plug can be rolled on the current version of the item.
		For example, older versions of weapons may have plug rolls that are no longer possible on the current versions.
		*/
    currentlyCanRoll: boolean;

    plugItemHash: number;
  }

  export interface DestinyPlugItemCraftingRequirements {
    unlockRequirements: Definitions.DestinyPlugItemCraftingUnlockRequirement[];

    /**
		If the plug has a known level requirement, it'll be available here.
		*/
    requiredLevel?: number;

    materialRequirementHashes: number[];
  }

  export interface DestinyPlugItemCraftingUnlockRequirement {
    failureDescription: string;
  }

  /**
	The time has unfortunately come to talk about Talent Grids.
	
	Talent Grids are the most complex and unintuitive part of the Destiny Definition data.  Grab a cup of coffee
	before we begin, I can wait.
	
	Talent Grids were the primary way that items could be customized in Destiny 1.  In Destiny 2, for now,
	talent grids have become exclusively used by Subclass/Build items: but the system is still in place for it
	to be used by items should the direction change back toward talent grids.
	
	Talent Grids have Nodes: the visual circles on the talent grid detail screen that have icons and can
	be activated if you meet certain requirements and pay costs.  The actual visual data and effects, however,
	are driven by the "Steps" on Talent Nodes.  Any given node will have 1:M of these steps, and the specific
	step that will be considered the "current" step (and thus the dictator of all benefits, visual state, and
	activation requirements on the Node) will almost always not be determined until an instance of the item is 
	created.  This is how, in Destiny 1, items were able to have such a wide variety of what users saw as "Perks":
	they were actually Talent Grids with nodes that had a wide variety of Steps, randomly chosen at the time
	of item creation.
	
	Now that Talent Grids are used exclusively by subclasses and builds, all of the properties within
	still apply: but there are additional visual elements on the Subclass/Build screens that are superimposed
	on top of the talent nodes.  Unfortunately, BNet doesn't have this data: if you want to build a subclass
	screen, you will have to provide your own "decorative" assets, such as the visual connectors between
	nodes and the fancy colored-fire-bathed character standing behind the nodes.
	
	DestinyInventoryItem.talentGrid.talentGridHash defines an item's linked Talent Grid, which brings you to
	this definition that contains enough satic data about talent grids to make your head spin.  These *must* be
	combined with instanced data - found when live data returns DestinyItemTalentGridComponent - in order to
	derive meaning.  The instanced data will reference nodes and steps within these definitions, which you will
	then have to look up in the definition and combine with the instanced data to give the user the
	visual representation of their item's talent grid.
	*/
  export interface DestinyTalentGridDefinition {
    /**
		The maximum possible level of the Talent Grid: at this level, any nodes are allowed to be activated.
		*/
    maxGridLevel: number;

    /**
		The meaning of this has been lost in the sands of time: it still exists as a property, but appears to be
		unused in the modern UI of talent grids.  It used to imply that each visual "column" of talent nodes
		required identical progression levels in order to be activated.  Returning this value in case it is still
		useful to someone?  Perhaps it's just a bit of interesting history.
		*/
    gridLevelPerColumn: number;

    /**
		The hash identifier of the Progression (DestinyProgressionDefinition) that drives whether and when
		Talent Nodes can be activated on the Grid.  Items will have instances of this Progression, and will
		gain experience that will eventually cause the grid to increase in level.  As the grid's level increases,
		it will cross the threshold where nodes can be activated.  See DestinyTalentGridStepDefinition's
		activation requirements for more information.
		*/
    progressionHash: number;

    /**
		The list of Talent Nodes on the Grid (recall that Nodes themselves are really just locations in
		the UI to show whatever their current Step is.  You will only know the current step for a node
		by retrieving instanced data through platform calls to the API that return DestinyItemTalentGridComponent).
		*/
    nodes: Definitions.DestinyTalentNodeDefinition[];

    /**
		Talent Nodes can exist in "exclusive sets": these are sets of nodes in which only a single 
		node in the set can be activated at any given time.  Activating a node in this set will automatically
		deactivate the other nodes in the set (referred to as a "Swap").
		
		If a node in the exclusive set has already been activated, the game will not charge you materials
		to activate another node in the set, even if you have never activated it before, because you already
		paid the cost to activate one node in the set.
		
		Not to be confused with Exclusive Groups.  (how the heck do we NOT get confused by that?  Jeez)
		See the groups property for information about that only-tangentially-related concept.
		*/
    exclusiveSets: Definitions.DestinyTalentNodeExclusiveSetDefinition[];

    /**
		This is a quick reference to the indexes of nodes that are not part of exclusive sets.  Handy
		for knowing which talent nodes can only be activated directly, rather than via swapping.
		*/
    independentNodeIndexes: number[];

    /**
		Talent Nodes can have "Exclusive Groups".  These are not to be confused with Exclusive Sets (see exclusiveSets property).
		
		Look at the definition of DestinyTalentExclusiveGroup for more information and how they work.  These groups
		are keyed by the "groupHash" from DestinyTalentExclusiveGroup.
		*/
    groups: { [key: number]: Definitions.DestinyTalentExclusiveGroup };

    /**
		BNet wants to show talent nodes grouped by similar purpose with localized titles.
		This is the ordered list of those categories: if you want to show nodes by category, you can
		iterate over this list, render the displayProperties for the category as the title, and
		then iterate over the talent nodes referenced by the category to show the related nodes.
		
		Note that this is different from Exclusive Groups or Sets, because these categories
		also incorporate "Independent" nodes that belong to neither sets nor groups.  These are purely
		for visual grouping of nodes rather than functional grouping.
		*/
    nodeCategories: Definitions.DestinyTalentNodeCategory[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Talent Grids on items have Nodes.  These nodes have positions in the talent grid's UI,
	and contain "Steps" (DestinyTalentNodeStepDefinition), one of whom will be the "Current" step.
	
	The Current Step determines the visual properties of the node, as well as what the node grants
	when it is activated.
	
	See DestinyTalentGridDefinition for a more complete overview of how Talent Grids work, and how
	they are used in Destiny 2 (and how they were used in Destiny 1).
	*/
  export interface DestinyTalentNodeDefinition {
    /**
		The index into the DestinyTalentGridDefinition's "nodes" property where this node
		is located.  Used to uniquely identify the node within the Talent Grid.  Note that
		this is content version dependent: make sure you have the latest version of content
		before trying to use these properties.
		*/
    nodeIndex: number;

    /**
		The hash identifier for the node, which unfortunately is also content version dependent
		but can be (and ideally, should be) used instead of the nodeIndex to uniquely identify the node.
		
		The two exist side-by-side for backcompat reasons due to the Great Talent Node Restructuring
		of Destiny 1, and I ran out of time to remove one of them and standardize on the other.  Sorry!
		*/
    nodeHash: number;

    /**
		The visual "row" where the node should be shown in the UI.  If negative, then the node is hidden.
		*/
    row: number;

    /**
		The visual "column" where the node should be shown in the UI.  If negative, the node is hidden.
		*/
    column: number;

    /**
		Indexes into the DestinyTalentGridDefinition.nodes property for any nodes
		that must be activated before this one is allowed to be activated.
		
		I would have liked to change this to hashes for Destiny 2, but we have run out of time.
		*/
    prerequisiteNodeIndexes: number[];

    /**
		At one point, Talent Nodes supported the idea of "Binary Pairs": nodes that overlapped each
		other visually, and where activating one deactivated the other.  They ended up not being used,
		mostly because Exclusive Sets are *almost* a superset of this concept, but the potential
		for it to be used still exists in theory.
		
		If this is ever used, this will be the index into
		the DestinyTalentGridDefinition.nodes property for the node that is the binary pair match
		to this node.  Activating one deactivates the other.
		*/
    binaryPairNodeIndex: number;

    /**
		If true, this node will automatically unlock when the Talent Grid's level reaches
		the required level of the current step of this node.
		*/
    autoUnlocks: boolean;

    /**
		At one point, Nodes were going to be able to be activated multiple times, changing
		the current step and potentially piling on multiple effects from the previously
		activated steps.  This property would indicate if the last step could be activated
		multiple times.  
		
		This is not currently used, but it isn't out of the question that
		this could end up being used again in a theoretical future.
		*/
    lastStepRepeats: boolean;

    /**
		If this is true, the node's step is determined randomly rather than
		the first step being chosen.
		*/
    isRandom: boolean;

    /**
		At one point, you were going to be able to repurchase talent nodes that had random steps,
		to "re-roll" the current step of the node (and thus change the properties of your item).
		This was to be the activation requirement for performing that re-roll.
		
		The system still exists to do this, as far as I know, so it may yet come back around!
		*/
    randomActivationRequirement: Definitions.DestinyNodeActivationRequirement;

    /**
		If this is true, the node can be "re-rolled" to acquire a different random current step.
		This is not used, but still exists for a theoretical future of talent grids.
		*/
    isRandomRepurchasable: boolean;

    /**
		At this point, "steps" have been obfuscated into conceptual entities, aggregating 
		the underlying notions of "properties" and "true steps".
		
		If you need to know a step as it truly exists - such as when recreating Node logic when processing
		Vendor data - you'll have to use the "realSteps" property below.
		*/
    steps: Definitions.DestinyNodeStepDefinition[];

    /**
		The nodeHash values for nodes that are in an Exclusive Set with this node.
		
		See DestinyTalentGridDefinition.exclusiveSets for more info about exclusive sets.
		
		Again, note that these are nodeHashes and *not* nodeIndexes.
		*/
    exclusiveWithNodeHashes: number[];

    /**
		If the node's step is randomly selected, this is the amount of the Talent Grid's progression experience
		at which the progression bar for the node should be shown.
		*/
    randomStartProgressionBarAtProgression: number;

    /**
		A string identifier for a custom visual layout to apply to this talent node.  Unfortunately,
		we do not have any data for rendering these custom layouts.  It will be up to you to interpret
		these strings and change your UI if you want to have custom UI matching these layouts.
		*/
    layoutIdentifier: string;

    /**
		As of Destiny 2, nodes can exist as part of "Exclusive Groups".  These differ from exclusive sets in that,
		within the group, many nodes can be activated.  But the act of activating any node in the group will cause "opposing" nodes
		(nodes in groups that are not allowed to be activated at the same time as this group) to deactivate.
		
		See DestinyTalentExclusiveGroup for more information on the details.  This is an identifier for this node's group,
		if it is part of one.
		*/
    groupHash?: number;

    /**
		Talent nodes can be associated with a piece of Lore, generally rendered in a tooltip.  This is the hash identifier
		of the lore element to show, if there is one to be show.
		*/
    loreHash?: number;

    /**
		Comes from the talent grid node style: this identifier should be used to determine
		how to render the node in the UI.
		*/
    nodeStyleIdentifier: string;

    /**
		Comes from the talent grid node style: if true, then this node should be ignored for determining whether the grid is complete.
		*/
    ignoreForCompletion: boolean;
  }

  /**
	Talent nodes have requirements that must be met before they can be activated.
	
	This describes the material costs, the Level of the Talent Grid's progression
	required, and other conditional information that limits whether a talent node can be
	activated.
	*/
  export interface DestinyNodeActivationRequirement {
    /**
		The Progression level on the Talent Grid required to activate this node.
		
		See DestinyTalentGridDefinition.progressionHash for the related Progression, and read
		DestinyProgressionDefinition's documentation to learn more about Progressions.
		*/
    gridLevel: number;

    /**
		The list of hash identifiers for material requirement sets: materials that
		are required for the node to be activated.  See DestinyMaterialRequirementSetDefinition for
		more information about material requirements.
		
		In this case, only a single DestinyMaterialRequirementSetDefinition will be chosen
		from this list, and we won't know which one will be chosen until an instance of the item is created.
		*/
    materialRequirementHashes: number[];
  }

  /**
	This defines the properties of a "Talent Node Step".  When you see a talent node
	in game, the actual visible properties that you see (its icon, description, the
	perks and stats it provides) are not provided by the Node itself, but rather by the 
	currently active Step on the node.
	
	When a Talent Node is activated, the currently active step's benefits are conferred
	upon the item and character.
	
	The currently active step on talent nodes are determined when an item 
	is first instantiated.  Sometimes it is random, sometimes it is more deterministic
	(particularly when a node has only a single step).
	
	Note that, when dealing with Talent Node Steps, you must ensure that you have
	the latest version of content.  stepIndex and nodeStepHash - two ways of
	identifying the step within a node - are both content version dependent, and thus
	are subject to change between content updates.
	*/
  export interface DestinyNodeStepDefinition {
    /**
		These are the display properties actually used to render the Talent Node.
		The currently active step's displayProperties are shown.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The index of this step in the list of Steps on the Talent Node.
		
		Unfortunately, this is the closest thing we have to an identifier for the Step:
		steps are not provided a content version agnostic identifier.  This means that,
		when you are dealing with talent nodes, you will need to first ensure that you have
		the latest version of content.
		*/
    stepIndex: number;

    /**
		The hash of this node step.  Unfortunately, while it can be used to uniquely identify
		the step within a node, it is also content version dependent and should not be relied on
		without ensuring you have the latest vesion of content.
		*/
    nodeStepHash: number;

    /**
		If you can interact with this node in some way, this is the localized description
		of that interaction.
		*/
    interactionDescription: string;

    /**
		An enum representing a damage type granted by activating this step, if any.
		*/
    damageType: Globals.DamageType;

    /**
		If the step provides a damage type, this will be the hash identifier used to look up
		the damage type's DestinyDamageTypeDefinition.
		*/
    damageTypeHash?: number;

    /**
		If the step has requirements for activation (they almost always do, if nothing
		else than for the Talent Grid's Progression to have reached a certain level),
		they will be defined here.
		*/
    activationRequirement: Definitions.DestinyNodeActivationRequirement;

    /**
		There was a time when talent nodes could be activated multiple times, and
		the effects of subsequent Steps would be compounded on each other, essentially
		"upgrading" the node.  We have moved away from this, but theoretically the capability
		still exists.
		
		I continue to return this in case it is used in the future: if true and
		this step is the current step in the node, you are allowed to activate the node
		a second time to receive the benefits of the next step in the node, which will then
		become the active step.
		*/
    canActivateNextStep: boolean;

    /**
		The stepIndex of the next step in the talent node, or -1 if this is the last step or if
		the next step to be chosen is random.
		
		This doesn't really matter anymore unless canActivateNextStep begins to be used again.
		*/
    nextStepIndex: number;

    /**
		If true, the next step to be chosen is random, and if you're allowed to activate the
		next step. (if canActivateNextStep = true)
		*/
    isNextStepRandom: boolean;

    /**
		The list of hash identifiers for Perks (DestinySandboxPerkDefinition) that are applied
		when this step is active.  Perks provide a variety of benefits and modifications - examine
		DestinySandboxPerkDefinition to learn more.
		*/
    perkHashes: number[];

    /**
		When the Talent Grid's progression reaches this value, the circular "progress bar" that
		surrounds the talent node should be shown.
		
		This also indicates the lower bound of said
		progress bar, with the upper bound being the progress required to reach 
		activationRequirement.gridLevel. (at some point I should precalculate the upper bound and put
		it in the definition to save people time)
		*/
    startProgressionBarAtProgress: number;

    /**
		When the step provides stat benefits on the item or character, this is the list of hash identifiers
		for stats (DestinyStatDefinition) that are provided.
		*/
    statHashes: number[];

    /**
		If this is true, the step affects the item's Quality in some way.  See DestinyInventoryItemDefinition
		for more information about the meaning of Quality.  I already made a joke about Zen and the Art of
		Motorcycle Maintenance elsewhere in the documentation, so I will avoid doing it again.  Oops too late
		*/
    affectsQuality: boolean;

    /**
		In Destiny 1, the Armory's Perk Filtering was driven by a concept of TalentNodeStepGroups: categorizations
		of talent nodes based on their functionality.  While the Armory isn't a BNet-facing thing for now, and
		the new Armory will need to account for Sockets rather than Talent Nodes, this categorization capability
		feels useful enough to still keep around.
		*/
    stepGroups: Definitions.DestinyTalentNodeStepGroups;

    /**
		If true, this step can affect the level of the item.  See DestinyInventoryItemDefintion for more
		information about item levels and their effect on stats.
		*/
    affectsLevel: boolean;

    /**
		If this step is activated, this will be a list of information used to replace socket items
		with new Plugs.  See DestinyInventoryItemDefinition for more information about sockets and plugs.
		*/
    socketReplacements: Definitions.DestinyNodeSocketReplaceResponse[];
  }

  /**
	These properties are an attempt to categorize talent node steps by certain common properties.  See
	the related enumerations for the type of properties being categorized.
	*/
  export interface DestinyTalentNodeStepGroups {
    weaponPerformance: Globals.DestinyTalentNodeStepWeaponPerformances;

    impactEffects: Globals.DestinyTalentNodeStepImpactEffects;

    guardianAttributes: Globals.DestinyTalentNodeStepGuardianAttributes;

    lightAbilities: Globals.DestinyTalentNodeStepLightAbilities;

    damageTypes: Globals.DestinyTalentNodeStepDamageTypes;
  }

  /**
	This is a bit of an odd duck.  Apparently, if talent nodes steps have this data, the game will go through on
	step activation and alter the first Socket it finds on the item that has a type matching the given
	socket type, inserting the indicated plug item.
	*/
  export interface DestinyNodeSocketReplaceResponse {
    /**
		The hash identifier of the socket type to find amidst the item's sockets (the item to which this
		talent grid is attached).  See DestinyInventoryItemDefinition.sockets.socketEntries to find
		the socket type of sockets on the item in question.
		*/
    socketTypeHash: number;

    /**
		The hash identifier of the plug item that will be inserted into the socket found.
		*/
    plugItemHash: number;
  }

  /**
	The list of indexes into the Talent Grid's "nodes" property for nodes in this
	exclusive set. (See DestinyTalentNodeDefinition.nodeIndex)
	*/
  export interface DestinyTalentNodeExclusiveSetDefinition {
    /**
		The list of node indexes for the exclusive set.  Historically, these were indexes.
		I would have liked to replace this with nodeHashes for consistency, but it's way too late for that.
		(9:09 PM, he's right!)
		*/
    nodeIndexes: number[];
  }

  /**
	As of Destiny 2, nodes can exist as part of "Exclusive Groups".  These differ from exclusive sets in that,
	within the group, many nodes can be activated.  But the act of activating any node in the group will cause "opposing" nodes
	(nodes in groups that are not allowed to be activated at the same time as this group) to deactivate.
	*/
  export interface DestinyTalentExclusiveGroup {
    /**
		The identifier for this exclusive group.  Only guaranteed unique within the talent grid, not globally.
		*/
    groupHash: number;

    /**
		If this group has an associated piece of lore to show next to it, this will be the identifier for that DestinyLoreDefinition.
		*/
    loreHash?: number;

    /**
		A quick reference of the talent nodes that are part of this group, by their Talent Node hashes.
		(See DestinyTalentNodeDefinition.nodeHash)
		*/
    nodeHashes: number[];

    /**
		A quick reference of Groups whose nodes will be deactivated if any node in this group is activated.
		*/
    opposingGroupHashes: number[];

    /**
		A quick reference of Nodes that will be deactivated if any node in this group is activated, by
		their Talent Node hashes. (See DestinyTalentNodeDefinition.nodeHash)
		*/
    opposingNodeHashes: number[];
  }

  /**
	An artificial construct provided by Bungie.Net, where we attempt to group talent nodes
	by functionality.
	
	This is a single set of references to Talent Nodes that share a common
	trait or purpose.
	*/
  export interface DestinyTalentNodeCategory {
    /**
		Mostly just for debug purposes, but if you find it useful you can have it.
		This is BNet's manually created identifier for this category.
		*/
    identifier: string;

    /**
		If true, we found the localized content in a related DestinyLoreDefinition
		instead of local BNet localization files.  This is mostly for ease of my own future investigations.
		*/
    isLoreDriven: boolean;

    /**
		Will contain at least the "name", which will be the title of the category.
		We will likely not have description and an icon yet, but I'm going to keep my options
		open.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		The set of all hash identifiers for Talent Nodes (DestinyTalentNodeDefinition)
		in this Talent Grid that are part of this Category.
		*/
    nodeHashes: number[];
  }

  /**
	In Destiny, "Races" are really more like "Species".  Sort of.  I mean, are the Awoken a separate species from
	humans?  I'm not sure.  But either way, they're defined here.  You'll see Exo, Awoken, and Human as examples
	of these Species.  Players will choose one for their character.
	*/
  export interface DestinyRaceDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		An enumeration defining the existing, known Races/Species for player characters.  This value
		will be the enum value matching this definition.
		*/
    raceType: Globals.DestinyRace;

    /**
		A localized string referring to the singular form of the Race's name when referred to in gendered form.
		Keyed by the DestinyGender.
		*/
    genderedRaceNames: {
      [K in EnumStrings<typeof Globals.DestinyGender>]?: string;
    };

    genderedRaceNamesByGenderHash: { [key: number]: string };

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	INTERNAL ONLY: Unlock Events are a complicated mechanism for time-based setting of
	unlock information, that ultimately gets used to drive things like weekly rituals and other
	repeatable/predicatable events.  We mine this data, for example, to determine when Milestones
	are active and when they will reset.
	*/
  export interface DestinyUnlockEventDefinition {
    unlockEntries: Definitions.DestinyUnlockEventEntry[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyUnlockEventEntry {}

  /**
	When we parse Unlock Definitions, sometimes we can predict the date ranges when they will be
	locked or unlocked.  In those cases, we turn that information into DestinyCalendarEventDefinitions,
	which gives us an easy and non-CPU intensive way to check the predicted state of an unlock in the future
	by pre-processing it at import time.
	*/
  export interface DestinyCalendarEventDefinition {
    eventDate: string;

    unlockState: Globals.DestinyUnlockState;
  }

  /**
	Some Character/Weapon/Armor stats (particularly, and right now but really only by coincidence, the "Light" stat)
	calculate the total stat value by taking a weighted average of all of the equipped items' values for the stat.
	This is the definition of a specific Equipment Slot's weight in the calculation.
	*/
  export interface DestinySlotAllocationDefinition {
    /**
		If true, the value should be rounded up to the nearest whole number before being added to the aggregation.
		*/
    roundUp: boolean;

    /**
		The hash identifier for the DestinyEquipmentSlotDefinition whose weighting this applies to.
		Examine the stats of the equipped item in this slot and apply the weight and rounding to it while aggregating.
		*/
    slotHash: number;

    /**
		The weight to apply to this slot's stat when making a weighted average across all of the Slot Allocations defined 
		for this stat.
		*/
    weight: number;
  }

  export interface DestinyVendorActionRequirementDefinition {
    materialRequirementHash?: number;
  }

  /**
	Custom data applied to activities for various purposes.
	
	Unfortunately, they are used in various internal logic for the Activities that BNet can't access.
	
	Fortunately, the values are here and accessible so that we can attempt to discern their uses.
	
	Potential for cool, as-yet-untapped features here - I don't really know what to expect in these values!
	*/
  export interface DestinyActivityOptionSet {
    /**
		Some activity options are mappings to arrays of other entities.
		*/
    entityArrayProperties: {
      [key: string]: Definitions.DestinyActivityOptionEntityMappingArray;
    };

    /**
		Some activity options are mappings to specific other entities.
		*/
    entityValueProperties: {
      [key: string]: Definitions.DestinyActivityOptionEntityMappingValue;
    };

    /**
		Some activity options are simple true/false options.
		*/
    booleanProperties: {
      [key: string]: Definitions.DestinyActivityBooleanOption;
    };

    /**
		Some activity options are 32-bit floating point numbers.
		*/
    floatProperties: { [key: string]: Definitions.DestinyActivityFloatOption };

    /**
		Some activity options are 32 bit integers.
		*/
    integerProperties: {
      [key: string]: Definitions.DestinyActivityIntegerOption;
    };

    /**
		Some activity options are of a format that we don't yet recognize.
		*/
    unknownProperties: { [key: string]: Definitions.DestinyActivityOption };
  }

  export interface DestinyActivityOptionEntityMappingArray {
    optionRawValues: number[];

    entityType: string;

    entityHashes: number[][];

    optionName: string;

    optionHash: number;

    optionType: string;
  }

  export interface DestinyActivityOptionEntityMappingValue {
    optionRawValue: number;

    entityType: string;

    entityHashes: number[];

    optionName: string;

    optionHash: number;

    optionType: string;
  }

  export interface DestinyActivityBooleanOption {
    optionRawValue: boolean;

    optionName: string;

    optionHash: number;

    optionType: string;
  }

  export interface DestinyActivityFloatOption {
    floatValue: number;

    optionName: string;

    optionHash: number;

    optionType: string;
  }

  export interface DestinyActivityIntegerOption {
    integerValue: number;

    optionName: string;

    optionHash: number;

    optionType: string;
  }

  /**
	The base class for activity options.  All activity options have a name, hash, and expected type.
	*/
  export interface DestinyActivityOption {
    optionName: string;

    optionHash: number;

    optionType: string;
  }

  /**
	Represents an "Intrinsic" Unlock state provided to a user by virtue of entering this activity.
	Unlocks can be turned on or off intrinsically.  We can mine this for all sorts of "loose" relationships
	between entities, such as Activities that are related to Milestones via relevant unlock flags.
	*/
  export interface DestinyActivityIntrinsicUnlockDefinition {
    /**
		The hash identifier for the unlock flag being set or cleared by virtue of being in this activity.
		*/
    unlockHash: number;

    /**
		Whether the flag is set or cleared.
		*/
    value: Globals.DestinyUnlockState;
  }

  /**
	INTERNAL USE ONLY: Let's not care about how these are used until/unless it's absolutely necessary.
	The rabbit hole of Progression Implementation goes deep.
	*/
  export interface DestinyProgressionMappedDefinitionPointer {}

  export interface DestinyProgressionMappingTableEntry {}

  /**
	INTERNAL USE ONLY: Let's not worry about what these mean until we have to.
	Right now, they're all internal purposes.
	*/
  export interface DestinyProgressionModifier {}

  export interface LocalProgressionResetCountEntry {
    season: number;
  }

  /**
	An individual instance of a Reward Mapping bound to our heuristically-driven Reward Sources.
	*/
  export interface DestinyRewardSourceMappingEntry {}

  /**
	When a Talent Node step is the current step of a Node, it determines whether the node is visible using
	the rules defined below.  
	
	See DestinyTalentGridDefinition and its subordinate properties for more
	information about Talent Nodes and Steps.
	*/
  export interface DestinyNodeVisibilityDefinition {
    /**
		Below this progression level (the progression attached to the Talent Grid, 
		see DestinyTalentGridDefinition.progressionHash), the node should not be visible.
		*/
    minLevel: number;

    /**
		Above this progression level (the progression attached to the Talent Grid, 
		see DestinyTalentGridDefinition.progressionHash), the node should not be visible.
		*/
    maxLevel: number;

    /**
		If a node is "Transient", it means that its visibility is dependent on a transient state
		of a character or the game itself: without an instance of the item, we will be unable to tell you
		whether this node is actually available or not.
		*/
    transient: boolean;
  }

  /**
	INTERNAL ONLY: A seed value used in calculating the properties of a talent grid when it is instantiated.
	*/
  export interface DestinyTalentRandomValue {
    randomHash: number;

    randomId: string;

    maxValue: number;

    rollOnRepurchase: boolean;
  }
}

export declare namespace Misc {
  /**
	Represents a color whose RGBA values are all represented as values between 0 and 255.
	*/
  export interface DestinyColor {
    red: number;

    green: number;

    blue: number;

    alpha: number;
  }
}

export declare namespace Items {
  /**
	A shortcut for the fact that some items have a "Preview Vendor"
	- See DestinyInventoryItemDefinition.preview.previewVendorHash - that is intended
	to be used to show what items you can get as a result of acquiring or using this item.
	
	A common example of this in Destiny 1 was Eververse "Boxes," which could have many possible items.
	This "Preview Vendor" is not a vendor you can actually see in the game, but it defines categories and sale items for all of the possible
	items you could get from the Box so that the game can show them to you.  We summarize that info here
	so that you don't have to do that Vendor lookup and aggregation manually.
	*/
  export interface DestinyDerivedItemCategoryDefinition {
    /**
		The localized string for the category title.  This will be something describing
		the items you can get as a group, or your likelihood/the quantity you'll get.
		*/
    categoryDescription: string;

    /**
		This is the list of all of the items for this category and the basic properties we'll
		know about them.
		*/
    items: Items.DestinyDerivedItemDefinition[];
  }

  /**
	This is a reference to, and summary data for, a specific item that
	you can get as a result of Using or Acquiring some other Item (For example,
	this could be summary information for an Emote that you can get by opening an an Eververse Box)
	See DestinyDerivedItemCategoryDefinition for more information.
	*/
  export interface DestinyDerivedItemDefinition {
    /**
		The hash for the DestinyInventoryItemDefinition of this derived item, if there is one.
		Sometimes we are given this information as a manual override, in which case there won't be
		an actual DestinyInventoryItemDefinition for what we display, but you can still show the strings
		from this object itself.
		*/
    itemHash?: number;

    /**
		The name of the derived item.
		*/
    itemName: string;

    /**
		Additional details about the derived item, in addition to the description.
		*/
    itemDetail: string;

    /**
		A brief description of the item.
		*/
    itemDescription: string;

    /**
		An icon for the item.
		*/
    iconPath: string;

    /**
		If the item was derived from a "Preview Vendor", this will be an index into
		the DestinyVendorDefinition's itemList property.  Otherwise, -1.
		*/
    vendorItemIndex: number;
  }

  /**
	If an item is a Plug, its DestinyInventoryItemDefinition.plug property will be populated
	with an instance of one of these bad boys.
	
	This gives information about when it can be inserted, what the plug's category
	is (and thus whether it is compatible with a socket... see DestinySocketTypeDefinition
	for information about Plug Categories and socket compatibility), whether it is enabled
	and other Plug info.
	*/
  export interface DestinyItemPlugDefinition {
    /**
		The rules around when this plug can be inserted into a socket, aside
		from the socket's individual restrictions.
		
		The live data DestinyItemPlugComponent.insertFailIndexes will be an index into
		this array, so you can pull out the failure strings appropriate for the user.
		*/
    insertionRules: Items.DestinyPlugRuleDefinition[];

    /**
		The string identifier for the plug's category.  Use the socket's DestinySocketTypeDefinition.plugWhitelist
		to determine whether this plug can be inserted into the socket.
		*/
    plugCategoryIdentifier: string;

    /**
		The hash for the plugCategoryIdentifier.  You can use this instead if you wish: I put both in the definition
		for debugging purposes.
		*/
    plugCategoryHash: number;

    /**
		If you successfully socket the item, this will determine whether or not you get "refunded" on the plug.
		*/
    onActionRecreateSelf: boolean;

    /**
		If inserting this plug requires materials, this is the hash identifier for looking up the
		DestinyMaterialRequirementSetDefinition for those requirements.
		*/
    insertionMaterialRequirementHash: number;

    /**
		In the game, if you're inspecting a plug item directly, this will be the item shown
		with the plug attached.  Look up the DestinyInventoryItemDefinition for this hash for the item.
		*/
    previewItemOverrideHash: number;

    /**
		It's not enough for the plug to be inserted.  It has to be enabled as well.
		For it to be enabled, it may require materials.
		This is the hash identifier for the DestinyMaterialRequirementSetDefinition for those requirements,
		if there is one.
		*/
    enabledMaterialRequirementHash: number;

    /**
		The rules around whether the plug, once inserted, is enabled and providing its benefits.
		
		The live data DestinyItemPlugComponent.enableFailIndexes will be an index into
		this array, so you can pull out the failure strings appropriate for the user.
		*/
    enabledRules: Items.DestinyPlugRuleDefinition[];

    /**
		Plugs can have arbitrary, UI-defined identifiers that the UI designers use to determine
		the style applied to plugs.  Unfortunately, we have neither a definitive list of these labels
		nor advance warning of when new labels might be applied or how that relates to how they get
		rendered.  If you want to, you can refer to known labels to change your own styles: but know that
		new ones can be created arbitrarily, and we have no way of associating the labels with any specific
		UI style guidance... you'll have to piece that together on your end.  Or do what we do, and just
		show plugs more generically, without specialized styles.
		*/
    uiPlugLabel: string;

    plugStyle: Globals.PlugUiStyles;

    /**
		Indicates the rules about when this plug can be used.  See the PlugAvailabilityMode enumeration for more 
		information!
		*/
    plugAvailability: Globals.PlugAvailabilityMode;

    /**
		If the plug meets certain state requirements, it may have an alternative label applied to it.
		This is the alternative label that will be applied in such a situation.
		*/
    alternateUiPlugLabel: string;

    /**
		The alternate plug of the plug: only applies when the item is in states that only the server can know about and control, unfortunately.  See AlternateUiPlugLabel for the related label info.
		*/
    alternatePlugStyle: Globals.PlugUiStyles;

    /**
		If TRUE, this plug is used for UI display purposes only, and doesn't have any interesting effects of its own.
		*/
    isDummyPlug: boolean;

    /**
		Do you ever get the feeling that a system has become so overburdened by edge cases that it probably
		should have become some other system entirely?  So do I!
		
		In totally unrelated news, Plugs can now override properties of their parent items.  This is some of
		the relevant definition data for those overrides.
		
		If this is populated, it will have the override data to be applied when this plug is applied to an item.
		*/
    parentItemOverride: Items.DestinyParentItemOverride;

    /**
		IF not null, this plug provides Energy capacity to the item in which it is socketed.
		In Armor 2.0 for example, is implemented in a similar way to Masterworks, where visually it's a single
		area of the UI being clicked on to "Upgrade" to higher energy levels, but it's actually socketing new
		plugs.
		*/
    energyCapacity: Items.DestinyEnergyCapacityEntry;

    /**
		IF not null, this plug has an energy cost.  This contains the details of that cost.
		*/
    energyCost: Items.DestinyEnergyCostEntry;
  }

  /**
	Dictates a rule around whether the plug is enabled or insertable.
	
	In practice, the live Destiny data will refer to these entries by index.  You can then
	look up that index in the appropriate property (enabledRules or insertionRules) to get
	the localized string for the failure message if it failed.
	*/
  export interface DestinyPlugRuleDefinition {
    /**
		The localized string to show if this rule fails.
		*/
    failureMessage: string;
  }

  export interface DestinyParentItemOverride {
    additionalEquipRequirementsDisplayStrings: string[];

    pipIcon: string;
  }

  /**
	Items can have Energy Capacity, and plugs can provide that capacity such as on a piece of Armor in Armor 2.0.
	This is how much "Energy" can be spent on activating plugs for this item.
	*/
  export interface DestinyEnergyCapacityEntry {
    /**
		How much energy capacity this plug provides.
		*/
    capacityValue: number;

    /**
		Energy provided by a plug is always of a specific type - this is the hash identifier for the
		energy type for which it provides Capacity.
		*/
    energyTypeHash: number;

    /**
		The Energy Type for this energy capacity, in enum form for easy use.
		*/
    energyType: Globals.DestinyEnergyType;
  }

  /**
	Some plugs cost Energy, which is a stat on the item that can be increased by other plugs (that, at least
	in Armor 2.0, have a "masterworks-like" mechanic for upgrading).  If a plug has costs, the details of that
	cost are defined here.
	*/
  export interface DestinyEnergyCostEntry {
    /**
		The Energy cost for inserting this plug.
		*/
    energyCost: number;

    /**
		The type of energy that this plug costs, as a reference to the DestinyEnergyTypeDefinition of the energy type.
		*/
    energyTypeHash: number;

    /**
		The type of energy that this plug costs, in enum form.
		*/
    energyType: Globals.DestinyEnergyType;
  }

  /**
	Internal only: Spawn attributes for the item.  A reference to
	a stat set, and to the level requirement associated with the way this item spawned.
	*/
  export interface ItemSpawnAttribute {}

  /**
	Internal only: a single way that an item spawned, in terms of a distinct combination of item level and quality
	through which all of the other stats of the item can be computed.
	
	Computed during the import process as we dig through item sources, it is only output in internal builds:
	its data instead eventually aggregated into the single "stats" property you see on DestinyInventoryItemDefinition
	by taking the min and max of all of the ItemSpawnStatSets generated.
	
	We don't bother returning this because of the sheer amount of data generated.  Some items can be spawned in
	hundreds of level/quality combinations, and while it's useful to see it for debugging, it is a waste of space
	to send it down with the item contract.
	*/
  export interface ItemSpawnStatSet {}

  export interface DestinyReusablePlugOptions {}

  /**
	The base item component, filled with properties that are generally useful to know in any item request or that
	don't feel worthwhile to put in their own component.
	*/
  export interface DestinyItemComponent {
    /**
		The identifier for the item's definition, which is where most of the useful static information for the item
		can be found.
		*/
    itemHash: number;

    /**
		If the item is instanced, it will have an instance ID.  Lack of an instance ID implies
		that the item has no distinct local qualities aside from stack size.
		*/
    itemInstanceId?: string;

    /**
		The quantity of the item in this stack.  Note that Instanced items cannot stack.
		If an instanced item, this value will always be 1 (as the stack has exactly one item in it)
		*/
    quantity: number;

    /**
		If the item is bound to a location, it will be specified in this enum.
		*/
    bindStatus: Globals.ItemBindStatus;

    /**
		An easy reference for where the item is located.  Redundant if you got the item
		from an Inventory, but useful when making detail calls on specific items.
		*/
    location: Globals.ItemLocation;

    /**
		The hash identifier for the specific inventory bucket in which the item is located.
		*/
    bucketHash: number;

    /**
		If there is a known error state that would cause this item to not be transferable, this Flags enum will
		indicate all of those error states.  Otherwise, it will be 0 (CanTransfer).
		*/
    transferStatus: Globals.TransferStatuses;

    /**
		If the item can be locked, this will indicate that state.
		*/
    lockable: boolean;

    /**
		A flags enumeration indicating the transient/custom states of the item that affect how it is rendered: 
		whether it's tracked or locked for example, or whether it has a masterwork plug inserted.
		*/
    state: Globals.ItemState;

    /**
		If populated, this is the hash of the item whose icon (and other secondary styles, but *not* the human readable
		strings) should override whatever icons/styles are on the item being sold.
		
		If you don't do this, certain items whose styles are being overridden by socketed items - such as the "Recycle Shader"
		item - would show whatever their default icon/style is, and it wouldn't be pretty or look accurate.
		*/
    overrideStyleItemHash?: number;

    /**
		If the item can expire, this is the date at which it will/did expire.
		*/
    expirationDate?: string;

    /**
		If this is true, the object is actually a "wrapper" of the object it's representing.
		 This means that it's not the actual item itself, but rather an item that must be "opened" in game
		 before you have and can use the item.
		
		 Wrappers are an evolution of "bundles", which give an easy way to let you preview the contents of what
		 you purchased while still letting you get a refund before you "open" it.
		*/
    isWrapper: boolean;

    /**
		If this is populated, it is a list of indexes into DestinyInventoryItemDefinition.tooltipNotifications
		for any special tooltip messages that need to be shown for this item.
		*/
    tooltipNotificationIndexes: number[];

    /**
		The identifier for the currently-selected metric definition, to be displayed on the emblem nameplate.
		*/
    metricHash?: number;

    /**
		The objective progress for the currently-selected metric definition, to be displayed on the emblem nameplate.
		*/
    metricObjective: Quests.DestinyObjectiveProgress;

    /**
		The version of this item, used to index into the versions list in the item definition quality block.
		*/
    versionNumber?: number;

    /**
		If available, a list that describes which item values (rewards) should be shown (true) or hidden (false).
		*/
    itemValueVisibility: boolean[];
  }

  /**
	Instanced items can have perks: benefits that the item bestows.
	
	These are related to DestinySandboxPerkDefinition, and sometimes - but not always - have human readable info.
	When they do, they are the icons and text that you see in an item's tooltip.
	
	Talent Grids, Sockets, and the item itself can apply Perks, which are then summarized here for your convenience.
	*/
  export interface DestinyItemPerksComponent {
    /**
		The list of perks to display in an item tooltip - and whether or not they have been activated.
		*/
    perks: Perks.DestinyPerkReference[];
  }

  /**
	Items can have objectives and progression.  When you request this block, you will obtain
	information about any Objectives and progression tied to this item.
	*/
  export interface DestinyItemObjectivesComponent {
    /**
		If the item has a hard association with objectives, your progress on them
		will be defined here.  
		
		Objectives are our standard way to describe a series of tasks that have to be completed for a reward.
		*/
    objectives: Quests.DestinyObjectiveProgress[];

    /**
		I may regret naming it this way - but this represents when an item has an objective that doesn't serve
		a beneficial purpose, but rather is used for "flavor" or additional information.  For instance, when Emblems
		track specific stats, those stats are represented as Objectives on the item.
		*/
    flavorObjective: Quests.DestinyObjectiveProgress;

    /**
		If we have any information on when these objectives were completed, this will be the date of that completion.
		This won't be on many items, but could be interesting for some items that do store this information.
		*/
    dateCompleted?: string;
  }

  /**
	If an item is "instanced", this will contain information about the item's instance that doesn't fit easily
	into other components.  One might say this is the "essential" instance data for the item.
	
	Items are instanced if they require information or state that can vary.  For instance, weapons are Instanced:
	they are given a unique identifier, uniquely generated stats, and can have their properties altered.  Non-instanced
	items have none of these things: for instance, Glimmer has no unique properties aside from how much of it you own.
	
	You can tell from an item's definition whether it will be instanced or not by looking at the DestinyInventoryItemDefinition's
	definition.inventory.isInstanceItem property.
	*/
  export interface DestinyItemInstanceComponent {
    /**
		If the item has a damage type, this is the item's current damage type.
		*/
    damageType: Globals.DamageType;

    /**
		The current damage type's hash, so you can look up localized info and icons for it.
		*/
    damageTypeHash?: number;

    /**
		The item stat that we consider to be "primary" for the item.  For instance, this would be "Attack" for
		Weapons or "Defense" for armor.
		*/
    primaryStat: World.DestinyStat;

    /**
		The Item's "Level" has the most significant bearing on its stats, such as Light and Power.
		*/
    itemLevel: number;

    /**
		The "Quality" of the item has a lesser - but still impactful - bearing on stats like Light and Power.
		*/
    quality: number;

    /**
		Is the item currently equipped on the given character?
		*/
    isEquipped: boolean;

    /**
		If this is an equippable item, you can check it here.  There are permanent as well as transitory reasons
		why an item might not be able to be equipped: check cannotEquipReason for details.
		*/
    canEquip: boolean;

    /**
		If the item cannot be equipped until you reach a certain level, that level will be reflected here.
		*/
    equipRequiredLevel: number;

    /**
		Sometimes, there are limitations to equipping that are represented by character-level flags called "unlocks".
		
		This is a list of flags that they need in order to equip the item that the character has not met.
		Use these to look up the descriptions to show in your UI by looking up the relevant DestinyUnlockDefinitions for the hashes.
		*/
    unlockHashesRequiredToEquip: number[];

    /**
		If you cannot equip the item, this is a flags enum that enumerates all of the reasons why you couldn't equip
		the item.  You may need to refine your UI further by using unlockHashesRequiredToEquip and equipRequiredLevel.
		*/
    cannotEquipReason: Globals.EquipFailureReason;

    /**
		If populated, this item has a breaker type corresponding to the given value.
		See DestinyBreakerTypeDefinition for more details.
		*/
    breakerType?: Globals.DestinyBreakerType;

    /**
		If populated, this is the hash identifier for the item's breaker type.
		See DestinyBreakerTypeDefinition for more details.
		*/
    breakerTypeHash?: number;

    /**
		IF populated, this item supports Energy mechanics (i.e. Armor 2.0), and these are the current
		details of its energy type and available capacity to spend energy points.
		*/
    energy: Items.DestinyItemInstanceEnergy;
  }

  export interface DestinyItemInstanceEnergy {
    /**
		The type of energy for this item.  Plugs that require Energy can only be inserted if they
		have the "Any" Energy Type or the matching energy type of this item.  This is a reference
		to the DestinyEnergyTypeDefinition for the energy type, where you can find extended info about it.
		*/
    energyTypeHash: number;

    /**
		This is the enum version of the Energy Type value, for convenience.
		*/
    energyType: Globals.DestinyEnergyType;

    /**
		The total capacity of Energy that the item currently has, regardless of if it is currently
		being used.
		*/
    energyCapacity: number;

    /**
		The amount of Energy currently in use by inserted plugs.
		*/
    energyUsed: number;

    /**
		The amount of energy still available for inserting new plugs.
		*/
    energyUnused: number;
  }

  /**
	Many items can be rendered in 3D.  When you request this block, you will obtain
	the custom data needed to render this specific instance of the item.
	*/
  export interface DestinyItemRenderComponent {
    /**
		If you should use custom dyes on this item, it will be indicated here.
		*/
    useCustomDyes: boolean;

    /**
		A dictionary for rendering gear components, with:
		
		key = Art Arrangement Region Index
		
		value = The chosen Arrangement Index for the Region, based on the value of a stat on the item used for making the choice.
		*/
    artRegions: { [key: number]: number };
  }

  /**
	If you want the stats on an item's instanced data, get this component.
	
	These are stats like Attack, Defense etc... and *not* historical stats.
	
	Note that some stats have additional computation in-game at runtime - for instance, 
	Magazine Size - and thus these stats might not be 100% accurate compared to what you see
	in-game for some stats.  I know, it sucks.  I hate it too.
	*/
  export interface DestinyItemStatsComponent {
    /**
		If the item has stats that it provides (damage, defense, etc...), it will be given here.
		*/
    stats: { [key: number]: World.DestinyStat };
  }

  /**
	Instanced items can have sockets, which are slots on the item where plugs can be inserted.
	
	Sockets are a bit complex: be sure to examine the documentation on the DestinyInventoryItemDefinition's
	"socket" block and elsewhere on these objects for more details.
	*/
  export interface DestinyItemSocketsComponent {
    /**
		The list of all sockets on the item, and their status information.
		*/
    sockets: Items.DestinyItemSocketState[];
  }

  /**
	The status of a given item's socket.  (which plug is inserted, if any: whether it is enabled, what "reusable"
	plugs can be inserted, etc...)
	
	If I had it to do over, this would probably have a DestinyItemPlug representing the inserted item instead of
	most of these properties.  :shrug:
	*/
  export interface DestinyItemSocketState {
    /**
		The currently active plug, if any.
		
		Note that, because all plugs are statically defined, its effect on stats and perks can be
		statically determined using the plug item's definition.  The stats and perks can be taken at face
		value on the plug item as the stats and perks it will provide to the user/item.
		*/
    plugHash?: number;

    /**
		Even if a plug is inserted, it doesn't mean it's enabled.
		
		This flag indicates whether the plug is active and providing its benefits.
		*/
    isEnabled: boolean;

    /**
		A plug may theoretically provide benefits but not be visible - for instance, some older items
		use a plug's damage type perk to modify their own damage type.  These, though they are not visible,
		still affect the item.  This field indicates that state.
		
		An invisible plug, while it provides benefits if it is Enabled, cannot be directly modified by the user.
		*/
    isVisible: boolean;

    /**
		If a plug is inserted but not enabled, this will be populated with indexes into the plug item definition's plug.enabledRules
		property, so that you can show the reasons why it is not enabled.
		*/
    enableFailIndexes: number[];
  }

  export interface DestinyItemReusablePlugsComponent {
    /**
		If the item supports reusable plugs, this is the list of plugs that are allowed to be used for the socket,
		 and any relevant information about whether they are "enabled", whether they are allowed to be inserted,
		 and any other information such as objectives.
		 
		 A Reusable Plug is a plug that you can always insert into this socket as long as its insertion rules are passed,
		 regardless of whether or not you have the plug in your inventory.  An example of it failing an insertion rule
		 would be if it has an Objective that needs to be completed before it can be inserted, and that objective
		 hasn't been completed yet.
		 
		 In practice, a socket will *either* have reusable plugs *or*
		 it will allow for plugs in your inventory to be inserted.  See DestinyInventoryItemDefinition.socket
		 for more info.
		
		 KEY = The INDEX into the item's list of sockets.
		 VALUE = The set of plugs for that socket.
		
		 If a socket doesn't have any reusable plugs defined at the item scope, there will be no entry for that socket.
		*/
    plugs: { [key: number]: Sockets.DestinyItemPlugBase[] };
  }

  export interface DestinyItemPlugObjectivesComponent {
    /**
		This set of data is keyed by the Item Hash (DestinyInventoryItemDefinition) of the plug whose
		 objectives are being returned, with the value being the list of those objectives.
		
		 What if two plugs with the same hash are returned for an item, you ask?
		
		 Good question!  They share the same item-scoped state, and as such would have identical objective state as a result.
		 How's that for convenient.
		
		 Sometimes, Plugs may have objectives: generally, these are used for flavor and display purposes.
		 For instance, a Plug might be tracking the number of PVP kills you have made.  It will use the parent item's
		 data about that tracking status to determine what to show, and will generally show it using the DestinyObjectiveDefinition's
		 progressDescription property.  Refer to the plug's itemHash and objective property for more information if
		 you would like to display even more data.
		*/
    objectivesPerPlug: { [key: number]: Quests.DestinyObjectiveProgress[] };
  }

  /**
	Well, we're here in Destiny 2, and Talent Grids are unfortunately still around.
	
	The good news is that they're pretty much only being used for certain base information
	on items and for Builds/Subclasses.  The bad news is that they still suck.
	If you really want this information, grab this component.
	
	An important note is that talent grids are defined as such:
	
	A Grid has 1:M Nodes, which has 1:M Steps.
	
	Any given node can only have a single step
	active at one time, which represents the actual visual contents and effects of the Node
	(for instance, if you see a "Super Cool Bonus" node, the actual icon and text for the node
	is coming from the current Step of that node).
	
	Nodes can be grouped into exclusivity sets
	*and* as of D2, exclusivity groups (which are collections of exclusivity sets that affect
	each other).
	
	See DestinyTalentGridDefinition for more information.  Brace yourself, the water's cold
	out there in the deep end.
	*/
  export interface DestinyItemTalentGridComponent {
    /**
		Most items don't have useful talent grids anymore, but Builds in particular still do.
		
		You can use this hash to lookup the DestinyTalentGridDefinition attached to this item,
		which will be crucial for understanding the node values on the item.
		*/
    talentGridHash: number;

    /**
		Detailed information about the individual nodes in the talent grid.
		
		A node represents a single visual "pip" in the talent grid or Build detail view,
		though each node may have multiple "steps" which indicate the actual bonuses
		and visual representation of that node.
		*/
    nodes: World.DestinyTalentNode[];

    /**
		Indicates whether the talent grid on this item is completed, and thus whether it should have a gold border around it.
		
		Only will be true if the item actually *has* a talent grid, and only then if it is completed (i.e. every exclusive set
		has an activated node, and every non-exclusive set node has been activated)
		*/
    isGridComplete: boolean;

    /**
		If the item has a progression, it will be detailed here.  A progression
		means that the item can gain experience.  Thresholds of experience are what determines
		whether and when a talent node can be activated.
		*/
    gridProgression: World.DestinyProgression;
  }

  /**
	Plugs are non-instanced items that can provide Stat and Perk benefits when socketed into an instanced item.
	Items have Sockets, and Plugs are inserted into Sockets.
	
	This component finds all items that are considered "Plugs" in your inventory, and return information about
	the plug aside from any specific Socket into which it could be inserted.
	*/
  export interface DestinyItemPlugComponent {
    plugObjectives: Quests.DestinyObjectiveProgress[];

    plugItemHash: number;

    canInsert: boolean;

    enabled: boolean;

    insertFailIndexes: number[];

    enableFailIndexes: number[];

    stackSize?: number;

    maxStackSize?: number;
  }

  /**
	Defines the tier type of an item.  Mostly this provides human readable properties for types
	like Common, Rare, etc...
	
	It also provides some base data for infusion that could be useful.
	*/
  export interface DestinyItemTierTypeDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If this tier defines infusion properties, they will be contained here.
		*/
    infusionProcess: Items.DestinyItemTierTypeInfusionBlock;

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyItemTierTypeInfusionBlock {
    /**
		The default portion of quality that will transfer from the infuser to the infusee item.
		(InfuserQuality - InfuseeQuality) * baseQualityTransferRatio = base quality transferred.
		*/
    baseQualityTransferRatio: number;

    /**
		As long as InfuserQuality > InfuseeQuality, the amount of quality bestowed is guaranteed
		to be at least this value, even if the transferRatio would dictate that it should be less.
		The total amount of quality that ends up in the Infusee cannot exceed the Infuser's quality however
		(for instance, if you infuse a 300 item with a 301 item and the minimum quality increment
		is 10, the infused item will not end up with 310 quality)
		*/
    minimumQualityIncrement: number;
  }
}

export declare namespace Sources {
  /**
	Properties of a DestinyInventoryItemDefinition that store all of the information
	we were able to discern about how the item spawns, and where you can find the item.
	
	Items will have many of these sources, one per level at which it spawns, to try
	and give more granular data about where items spawn for specific level ranges.
	*/
  export interface DestinyItemSourceDefinition {
    /**
		The level at which the item spawns.  Essentially the Primary Key
		for this source data: there will be multiple of these source entries per item that
		has source data, grouped by the level at which the item spawns.
		*/
    level: number;

    /**
		The minimum Quality at which the item spawns for this level.  Examine DestinyInventoryItemDefinition
		for more information about what Quality means.  Just don't ask Phaedrus about it,
		he'll never stop talking and you'll have to write a book about it.
		*/
    minQuality: number;

    /**
		The maximum quality at which the item spawns for this level.
		*/
    maxQuality: number;

    /**
		The minimum Character Level required for equipping the item when the item spawns at the item level
		defined on this DestinyItemSourceDefinition, as far as we saw in our processing.
		*/
    minLevelRequired: number;

    /**
		The maximum Character Level required for equipping the item when the item spawns at the item level
		defined on this DestinyItemSourceDefinition, as far as we saw in our processing.
		*/
    maxLevelRequired: number;

    /**
		The stats computed for this level/quality range.
		*/
    computedStats: {
      [key: number]: Definitions.DestinyInventoryItemStatDefinition;
    };

    /**
		The DestinyRewardSourceDefinitions found that can spawn the item at this level.
		*/
    sourceHashes: number[];
  }
}

export declare namespace Animations {
  export interface DestinyAnimationReference {
    animName: string;

    animIdentifier: string;

    path: string;
  }
}

export declare namespace Links {
  export interface HyperlinkReference {
    title: string;

    url: string;
  }
}

export declare namespace References {
  /**
	Represents all of the ways that a given item can be spawned.
	Every path for spawning an item is unique: most of the data we save here is only for internal debugging
	purposes, but it does provide a wealth of information about exactly what causes an item to spawn,
	when, and with what properties.
	*/
  export interface RewardItemReferenceSet {}

  /**
	Data that indicates the how and by what means an item can be sourced.
	It points to the indexes of spawn data, which is stored in the RewardItemReferenceSet:
	that contains the actual specific data for the item spawning, and is stored separately
	for the sake of brevity in data (data balloons quickly without this optimization).
	
	It also is where we store source and visibility information: that is to say, whether this way
	of spawning the item is actually something we think the user can run into while playing.
	This is determined in post-processing, after all spawn information is calculated across
	all reward data.
	*/
  export interface RewardSourceData {}

  export interface RewardItemSheetReference {}

  export interface RewardItemMappedReference {
    sourceData: References.RewardSourceData;
  }

  export interface RewardItemActivityReference {
    sourceData: References.RewardSourceData;
  }

  export interface RewardItemIncidentReference {
    sourceData: References.RewardSourceData;
  }

  export interface RewardItemActionReference {
    sourceData: References.RewardSourceData;
  }

  export interface RewardTalentNodeActivationReference {
    sourceData: References.RewardSourceData;
  }

  export interface RewardItemVendorReference {
    sourceData: References.RewardSourceData;
  }

  /**
	When a reward has been included in an "Aggregate Source", the information about that aggregate is
	included here.
	For now, this is just a reference to that source's hash, but if we find additional interesting data
	we can add that to this contract.
	*/
  export interface RewardItemAggregateReference {
    sourceHash: number;
  }

  export interface RewardQuestVendorItemReference {
    objectiveHash: number;

    interactionIndex: number;

    rewardVendorReferenceIndex: number;
  }

  export interface RewardItemSiteReference {
    sourceData: References.RewardSourceData;
  }

  /**
	Represents a single way that an item spawns: in this case, as the result of a 
	Reset Entry being run.
	*/
  export interface RewardItemResetEntryReference {
    /**
		The identifier of the reset entry that spawns the item: useful for debugging.
		*/
    resetEntryHash: number;

    /**
		A reset entry that actually has a chance of being run in the real game has to be run from
		a reward site.  This is the site that runs it: we can do more analysis with this info.
		*/
    siteHash: number;

    /**
		The various levels and qualities under which the item spawns through this reset
		entry. (nothing stops a reset entry from spawning the same item in multiple ways)
		*/
    sourceData: References.RewardSourceData;
  }

  /**
	Represents a single way that an item spawns as the result of being generated in a reward sack.
	Sacks are most frequently provided by Vendors, and unlock Destiny 1 sacks, they have a plethora
	of spawning information that is actually used to generate the item.
	*/
  export interface RewardItemSackEntryReference {
    /**
		The identifier of the sack that spawns the item: useful for debugging.
		*/
    sackHash: number;

    /**
		The adjustor that was ultimately used is useful for seeing how this data got generated.
		*/
    adjustorHash: number;

    /**
		The various levels and qualities under which the item spawns through this sack.
		*/
    sourceData: References.RewardSourceData;
  }
}

export declare namespace Triumphs {
  /**
	This class should be considered ephimeral: it is almost certain that this will go away after the summer.
	
	Don't write any permanent systems against it, k thanks
	*/
  export interface DestinyTriumphsResponse {
    categories: Triumphs.DestinyTriumphsCategory[];

    rewards: Triumphs.DestinyTriumphsReward[];

    discountReward: Triumphs.DestinyTriumphsDiscountReward;

    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    backgroundImage: string;

    startDate: string;

    endDate: string;

    discountCodeExpiresDate: string;

    generateCodeEndDate: string;

    eventStartDate: string;

    eventEndDate: string;

    currentPoints: number;

    unclaimedPoints: number;

    maximumPoints: number;

    faqContentId: string;

    helpContentId: string;

    faqLink: string;

    helpLink: string;

    nameplateImage: string;

    upgradedNameplateImage: string;
  }

  export interface DestinyTriumphsCategory {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    records: Triumphs.DestinyTriumphsRecord[];
  }

  export interface DestinyTriumphsRecord {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    progressCaption: string;

    difficulty: Globals.DestinyActivityDifficultyTier;

    pointValue: number;

    state: Globals.DestinyTriumphRecordState;

    hasProgressBar: boolean;

    currentProgress?: number;

    completedAtProgress?: number;

    furthestProgressCharacterId?: string;

    /**
		IF this is populated, it is the live data for a checklist associated with this record.
		Use its contents to look up the corresponding DestinyChecklistDefinition and show some cool data.
		*/
    checklist: Checklists.DestinyChecklistStatus;

    /**
		If there are checklist details to view for this triumph, this will be populatd with the string to use
		for showing the button to link to the checklist details.
		*/
    viewActionString: string;
  }

  export interface DestinyTriumphsReward {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    pointValueThreshold: number;

    earned: boolean;
  }

  export interface DestinyTriumphsDiscountReward {
    itemUrl: string;

    imagePath: string;

    pointValueThreshold: number;

    playerDiscountCode: string;

    claimedDate?: string;

    state: Globals.DestinyTriumphsDiscountState;
  }
}

export declare namespace Checklists {
  export interface DestinyChecklistStatus {
    /**
		The unique identifier of the checklist being referred to.
		*/
    checklistHash: number;

    entries: { [key: number]: boolean };
  }

  /**
	By public demand, Checklists are loose sets of "things to do/things you have done" in Destiny that we were actually able to track.
	They include easter eggs you find in the world, unique chests you unlock, and other such data where the first time you do it is
	significant enough to be tracked, and you have the potential to "get them all".
	
	These may be account-wide, or may be per character.  The status of these will be returned in related "Checklist" data coming
	down from API requests such as GetProfile or GetCharacter.
	
	Generally speaking, the items in a checklist can be completed in any order: we return an ordered list which
	only implies the way we are showing them in our own UI, and you can feel free to alter it as you wish.
	
	Note that, in the future, there will be something resembling the old D1 Record Books in at least some vague form.  When that
	is created, it may be that it will supercede much or all of this Checklist data.  It remains to be seen if that will be
	the case, so for now assume that the Checklists will still exist even after the release of D2: Forsaken.
	*/
  export interface DestinyChecklistDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A localized string prompting you to view the checklist.
		*/
    viewActionString: string;

    /**
		Indicates whether you will find this checklist on the Profile or Character components.
		*/
    scope: Globals.DestinyScope;

    /**
		The individual checklist items.  Gotta catch 'em all.
		*/
    entries: Checklists.DestinyChecklistEntryDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	The properties of an individual checklist item.  Note that almost everything is optional: it is *highly* variable what kind
	of data we'll actually be able to return: at times we may have no other relationships to entities at all.
	
	Whatever UI you build, do it with the knowledge that any given entry might not actually be able to be associated with
	some other Destiny entity.
	*/
  export interface DestinyChecklistEntryDefinition {
    /**
		The identifier for this Checklist entry.  Guaranteed unique only within this Checklist Definition,
		and not globally/for all checklists.
		*/
    hash: number;

    /**
		Even if no other associations exist, we will give you *something* for display properties.
		In cases where we have no associated entities, it may be as simple as a numerical identifier.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    destinationHash?: number;

    locationHash?: number;

    /**
		Note that a Bubble's hash doesn't uniquely identify a "top level" entity in Destiny.
		Only the combination of location and bubble can uniquely identify a place in the world of Destiny:
		so if bubbleHash is populated, locationHash must too be populated for it to have any meaning.
		
		You can use this property if it is populated to look up the DestinyLocationDefinition's associated 
		.locationReleases[].activityBubbleName property.
		*/
    bubbleHash?: number;

    activityHash?: number;

    itemHash?: number;

    vendorHash?: number;

    vendorInteractionIndex?: number;

    /**
		The scope at which this specific entry can be computed.
		*/
    scope: Globals.DestinyScope;
  }
}

export declare namespace Inventory {
  export interface DestinyPlatformSilverComponent {
    /**
		If a Profile is played on multiple platforms, this is the silver they have
		for each platform, keyed by Membership Type.
		*/
    platformSilver: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: Items.DestinyItemComponent;
    };
  }

  /**
	A list of minimal information for items in an inventory: be it a character's inventory, or a Profile's inventory.
	(Note that the Vault is a collection of inventory buckets in the Profile's inventory)
	
	Inventory Items returned here are in a flat list, but importantly they have a bucketHash property that
	indicates the specific inventory bucket that is holding them.  These buckets constitute things like the separate
	sections of the Vault, the user's inventory slots, etc.  See DestinyInventoryBucketDefinition for more info.
	*/
  export interface DestinyInventoryComponent {
    /**
		The items in this inventory.  If you care to bucket them, use the item's bucketHash property to group
		them.
		*/
    items: Items.DestinyItemComponent[];
  }

  /**
	This component provides a quick lookup of every item the requested character has and how much of that item they have.
	
	Requesting this component will allow you to circumvent manually putting together the list of which currencies you have
	for the purpose of testing currency requirements on an item being purchased, or operations that have costs.
	
	You *could* figure this out yourself by doing a GetCharacter or GetProfile request and forming your own lookup table, but
	that is inconvenient enough that this feels like a worthwhile (and optional) redundancy.  Don't bother requesting it if you
	have already created your own lookup from prior GetCharacter/GetProfile calls.
	*/
  export interface DestinyCurrenciesComponent {
    /**
		A dictionary - keyed by the item's hash identifier (DestinyInventoryItemDefinition), and whose value is the amount of
		that item you have across all available inventory buckets for purchasing.
		
		This allows you to see whether the requesting character can afford any given purchase/action without having to re-create
		this list itself.
		*/
    itemQuantities: { [key: number]: number };

    /**
		A map of material requirement hashes and their status information.
		*/
    materialRequirementSetStates: {
      [key: number]: Inventory.DestinyMaterialRequirementSetState;
    };
  }

  export interface DestinyMaterialRequirementSetState {
    /**
		The hash identifier of the material requirement set. Use it to look up the DestinyMaterialRequirementSetDefinition.
		*/
    materialRequirementSetHash: number;

    /**
		The dynamic state values for individual material requirements.
		*/
    materialRequirementStates: Inventory.DestinyMaterialRequirementState[];
  }

  export interface DestinyMaterialRequirementState {
    /**
		The hash identifier of the material required. Use it to look up the material's DestinyInventoryItemDefinition.
		*/
    itemHash: number;

    /**
		The amount of the material required.
		*/
    count: number;

    /**
		A value for the amount of a (possibly virtual) material on some scope.
		For example: Dawning cookie baking material requirements.
		*/
    stackSize: number;
  }
}

export declare namespace Quests {
  /**
	Returns data about a character's status with a given Objective.
	Combine with DestinyObjectiveDefinition static data for display purposes.
	*/
  export interface DestinyObjectiveProgress {
    /**
		The unique identifier of the Objective being referred to.  Use to look up the DestinyObjectiveDefinition in static data.
		*/
    objectiveHash: number;

    /**
		If the Objective has a Destination associated with it, this is the unique identifier of the Destination being referred to.
		Use to look up the DestinyDestinationDefinition in static data.
		This will give localized data about *where* in the universe the objective should be achieved.
		*/
    destinationHash?: number;

    /**
		If the Objective has an Activity associated with it, this is the unique identifier of the Activity being referred to.
		Use to look up the DestinyActivityDefinition in static data.
		This will give localized data about *what* you should be playing for the objective to be achieved.
		*/
    activityHash?: number;

    /**
		If progress has been made, and the progress can be measured numerically, this will be the value of that progress.
		You can compare it to the DestinyObjectiveDefinition.completionValue property for current vs. upper bounds,
		and use DestinyObjectiveDefinition.inProgressValueStyle or completedValueStyle to determine how this should be rendered.
		Note that progress, in Destiny 2, need not be a literal numeric progression.  It could be one of a number of
		possible values, even a Timestamp. Always examine DestinyObjectiveDefinition.inProgressValueStyle 
		or completedValueStyle before rendering progress.
		*/
    progress?: number;

    /**
		As of Forsaken, objectives' completion value is determined dynamically at runtime.
		
		This value represents the threshold of progress you need to surpass in order for this objective to be
		considered "complete".
		
		If you were using objective data, switch from using the DestinyObjectiveDefinition's "completionValue" to
		this value.
		*/
    completionValue: number;

    /**
		Whether or not the Objective is completed.
		*/
    complete: boolean;

    /**
		If this is true, the objective is visible in-game.  Otherwise, it's not yet visible to the player.
		Up to you if you want to honor this property.
		*/
    visible: boolean;
  }

  /**
	Data regarding the progress of a Quest for a specific character.
	Quests are composed of multiple steps, each with potentially multiple objectives:
	this QuestStatus will return Objective data for the *currently active* step in this quest.
	*/
  export interface DestinyQuestStatus {
    /**
		The hash identifier for the Quest Item.  (Note: Quests are defined as Items, and thus you would
		use this to look up the quest's DestinyInventoryItemDefinition).
		For information on all steps in the quest, you can then examine its DestinyInventoryItemDefinition.setData
		property for Quest Steps (which are *also* items).
		You can use the Item Definition to display human readable data about the overall quest.
		*/
    questHash: number;

    /**
		The hash identifier of the current Quest Step, which is also a DestinyInventoryItemDefinition.  You can use
		this to get human readable data about the current step and what to do in that step.
		*/
    stepHash: number;

    /**
		A step can have multiple objectives.  This will give you the progress for each objective in the current step,
		in the order in which they are rendered in-game.
		*/
    stepObjectives: Quests.DestinyObjectiveProgress[];

    /**
		Whether or not the quest is tracked
		*/
    tracked: boolean;

    /**
		The current Quest Step will be an instanced item in the player's inventory.  If you care about that,
		this is the instance ID of that item.
		*/
    itemInstanceId: string;

    /**
		Whether or not the whole quest has been completed, regardless of whether or not
		you have redeemed the rewards for the quest.
		*/
    completed: boolean;

    /**
		Whether or not you have redeemed rewards for this quest.
		*/
    redeemed: boolean;

    /**
		Whether or not you have started this quest.
		*/
    started: boolean;

    /**
		If the quest has a related Vendor that you should talk to in order to initiate the quest/earn 
		rewards/continue the quest, this will be the hash identifier of that Vendor.  Look it up its DestinyVendorDefinition.
		*/
    vendorHash?: number;
  }
}

export declare namespace Profiles {
  /**
	The most essential summary information about a Profile (in Destiny 1, we called these "Accounts").
	*/
  export interface DestinyProfileComponent {
    /**
		If you need to render the Profile (their platform name, icon, etc...) somewhere, this property contains
		that information.
		*/
    userInfo: User.UserInfoCard;

    /**
		The last time the user played with any character on this Profile.
		*/
    dateLastPlayed: string;

    /**
		If you want to know what expansions they own, this will contain that data.
		
		 IMPORTANT: This field may not return the data you're interested in for Cross-Saved users.
		 It returns the last ownership data we saw for this account - which is to say, what they've purchased
		 on the platform on which they last played, which now could be a different platform.
		
		 If you don't care about per-platform ownership and only care about whatever platform it seems
		 they are playing on most recently, then this should be "good enough."  Otherwise, this should be
		 considered deprecated.  We do not have a good alternative to provide at this time with platform
		 specific ownership data for DLC.
		*/
    versionsOwned: Globals.DestinyGameVersions;

    /**
		A list of the character IDs, for further querying on your part.
		*/
    characterIds: string[];

    /**
		A list of seasons that this profile owns.  Unlike versionsOwned, these stay with the profile
		 across Platforms, and thus will be valid.
		
		 It turns out that Stadia Pro subscriptions will give access to seasons
		 but only while playing on Stadia and with an active subscription.  So some users (users who have Stadia Pro
		 but choose to play on some other platform) won't see these as available: it will be whatever seasons are
		 available for the platform on which they last played.
		*/
    seasonHashes: number[];

    /**
		A list of hashes for event cards that a profile owns.
		Unlike most values in versionsOwned, these stay with the profile across all platforms.
		*/
    eventCardHashesOwned: number[];

    /**
		If populated, this is a reference to the season that is currently active.
		*/
    currentSeasonHash?: number;

    /**
		If populated, this is the reward power cap for the current season.
		*/
    currentSeasonRewardPowerCap?: number;

    /**
		If populated, this is a reference to the event card that is currently active.
		*/
    activeEventCardHash?: number;

    /**
		The 'current' Guardian Rank value, which starts at rank 1. This rank value will drop at the start of a new season to your 'renewed' rank from the previous season.
		*/
    currentGuardianRank: number;

    /**
		The 'lifetime highest' Guardian Rank value, which starts at rank 1. This rank value should never go down.
		*/
    lifetimeHighestGuardianRank: number;

    /**
		The seasonal 'renewed' Guardian Rank value. This rank value resets at the start of each new season to the highest-earned non-advanced rank.
		*/
    renewedGuardianRank: number;
  }

  /**
	For now, this isn't used for much: it's a record of the recent refundable purchases
	that the user has made.  In the future, it could be used for providing refunds/buyback via the API.
	Wouldn't that be fun?
	*/
  export interface DestinyVendorReceiptsComponent {
    /**
		The receipts for refundable purchases made at a vendor.
		*/
    receipts: Vendors.DestinyVendorReceipt[];
  }

  /**
	The set of progression-related information that applies at a Profile-wide level for
	your Destiny experience.  This differs from the Jimi Hendrix Experience because there's
	less guitars on fire.  Yet.  #spoileralert?
	
	This will include information such as Checklist info.
	*/
  export interface DestinyProfileProgressionComponent {
    /**
		The set of checklists that can be examined on a profile-wide basis, keyed by the hash identifier
		of the Checklist (DestinyChecklistDefinition)
		
		For each checklist returned, its value is itself a Dictionary keyed by the checklist's hash identifier
		with the value being a boolean indicating if it's been discovered yet.
		*/
    checklists: { [key: number]: { [key: number]: boolean } };

    /**
		Data related to your progress on the current season's artifact that is the same across characters.
		*/
    seasonalArtifact: Artifacts.DestinyArtifactProfileScoped;
  }

  /**
	This is an experimental set of data that Bungie considers to be "transitory" - information that
	may be useful for API users, but that is coming from a non-authoritative data source about information
	that could potentially change at a more frequent pace than Bungie.net will receive updates about it.
	
	This information is provided exclusively for convenience should any of it be useful to users: we provide
	no guarantees to the accuracy or timeliness of data that comes from this source.  Know that this data
	can potentially be out-of-date or even wrong entirely if the user disconnected from the game or suddenly
	changed their status before we can receive refreshed data.
	*/
  export interface DestinyProfileTransitoryComponent {
    /**
		If you have any members currently in your party, this is some (very) bare-bones information about those members.
		*/
    partyMembers: Profiles.DestinyProfileTransitoryPartyMember[];

    /**
		If you are in an activity, this is some transitory info about the activity currently being played.
		*/
    currentActivity: Profiles.DestinyProfileTransitoryCurrentActivity;

    /**
		Information about whether and what might prevent you from joining this person on a fireteam.
		*/
    joinability: Profiles.DestinyProfileTransitoryJoinability;

    /**
		Information about tracked entities.
		*/
    tracking: Profiles.DestinyProfileTransitoryTrackingEntry[];

    /**
		The hash identifier for the DestinyDestinationDefinition of the last location you were orbiting when in orbit.
		*/
    lastOrbitedDestinationHash?: number;
  }

  /**
	This is some bare minimum information about a party member in a Fireteam.  Unfortunately, without great computational expense
	on our side we can only get at the data contained here.  I'd like to give you a character ID for example, but we don't have it.
	But we do have these three pieces of information.  May they help you on your quest to show meaningful data about current Fireteams.
	
	Notably, we don't and can't feasibly return info on characters.  If you can, try to use just the data below for your UI and purposes.  Only
	hit us with further queries if you absolutely must know the character ID of the currently playing character.  Pretty please with sugar on top.
	*/
  export interface DestinyProfileTransitoryPartyMember {
    /**
		The Membership ID that matches the party member.
		*/
    membershipId: string;

    /**
		The identifier for the DestinyInventoryItemDefinition of the player's emblem.
		*/
    emblemHash: number;

    /**
		The player's last known display name.
		*/
    displayName: string;

    /**
		A Flags Enumeration value indicating the states that the player is in relevant to being on a fireteam.
		*/
    status: Globals.DestinyPartyMemberStates;
  }

  /**
	If you are playing in an activity, this is some information about it.
	
	Note that we cannot guarantee any of this resembles what ends up in the PGCR in any way.  They are sourced by two
	entirely separate systems with their own logic, and the one we source this data from should be considered non-authoritative in comparison.
	*/
  export interface DestinyProfileTransitoryCurrentActivity {
    /**
		When the activity started.
		*/
    startTime?: string;

    /**
		If you're still in it but it "ended" (like when folks are dancing around the loot after they beat a boss), this is when the activity ended.
		*/
    endTime?: string;

    /**
		This is what our non-authoritative source thought the score was.
		*/
    score: number;

    /**
		If you have human opponents, this is the highest opposing team's score.
		*/
    highestOpposingFactionScore: number;

    /**
		This is how many human or poorly crafted aimbot opponents you have.
		*/
    numberOfOpponents: number;

    /**
		This is how many human or poorly crafted aimbots are on your team.
		*/
    numberOfPlayers: number;
  }

  /**
	Some basic information about whether you can be joined, how many slots are left etc.
	Note that this can change quickly, so it may not actually be useful.  But perhaps it will be in some
	use cases?
	*/
  export interface DestinyProfileTransitoryJoinability {
    /**
		The number of slots still available on this person's fireteam.
		*/
    openSlots: number;

    /**
		Who the person is currently allowing invites from.
		*/
    privacySetting: Globals.DestinyGamePrivacySetting;

    /**
		Reasons why a person can't join this person's fireteam.
		*/
    closedReasons: Globals.DestinyJoinClosedReasons;
  }

  /**
	This represents a single "thing" being tracked by the player.
	
	This can point to many types of entities, but only a subset of them will actually have
	a valid hash identifier for whatever it is being pointed to.
	
	It's up to you to interpret what it means when various combinations of these entries have values being tracked.
	*/
  export interface DestinyProfileTransitoryTrackingEntry {
    /**
		OPTIONAL - If this is tracking a DestinyLocationDefinition, this is the identifier for that location.
		*/
    locationHash?: number;

    /**
		OPTIONAL - If this is tracking the status of a DestinyInventoryItemDefinition, this is the identifier for that item.
		*/
    itemHash?: number;

    /**
		OPTIONAL - If this is tracking the status of a DestinyObjectiveDefinition, this is the identifier for that objective.
		*/
    objectiveHash?: number;

    /**
		OPTIONAL - If this is tracking the status of a DestinyActivityDefinition, this is the identifier for that activity.
		*/
    activityHash?: number;

    /**
		OPTIONAL - If this is tracking the status of a quest, this is the identifier for the DestinyInventoryItemDefinition that containst that questline data.
		*/
    questlineItemHash?: number;

    /**
		OPTIONAL - I've got to level with you, I don't really know what this is.  Is it when you started tracking it?  Is it only populated for tracked items that have time limits?
		
		I don't know, but we can get at it - when I get time to actually test what it is, I'll update this.  In the meantime, bask in the mysterious data.
		*/
    trackedDate?: string;
  }
}

export declare namespace Characters {
  /**
	This component contains base properties of the character.  You'll probably want to always request this component,
	but hey you do you.
	*/
  export interface DestinyCharacterComponent {
    /**
		Every Destiny Profile has a membershipId.  This is provided on the character as well for convenience.
		*/
    membershipId: string;

    /**
		membershipType tells you the platform on which the character plays.
		Examine the BungieMembershipType enumeration for possible values.
		*/
    membershipType: Globals.BungieMembershipType;

    /**
		The unique identifier for the character.
		*/
    characterId: string;

    /**
		The last date that the user played Destiny.
		*/
    dateLastPlayed: string;

    /**
		If the user is currently playing, this is how long they've been playing.
		*/
    minutesPlayedThisSession: string;

    /**
		If this value is 525,600, then they played Destiny for a year.  Or they're a very dedicated Rent fan.
		Note that this includes idle time, not just time spent actually in activities shooting things.
		*/
    minutesPlayedTotal: string;

    /**
		The user's calculated "Light Level".  Light level is an indicator of your power that mostly matters in
		the end game, once you've reached the maximum character level: it's a level that's dependent on the average
		Attack/Defense power of your items.
		*/
    light: number;

    /**
		Your character's stats, such as Agility, Resilience, etc... *not* historical stats.
		
		You'll have to call a different endpoint for those.
		*/
    stats: { [key: number]: number };

    /**
		Use this hash to look up the character's DestinyRaceDefinition.
		*/
    raceHash: number;

    /**
		Use this hash to look up the character's DestinyGenderDefinition.
		*/
    genderHash: number;

    /**
		Use this hash to look up the character's DestinyClassDefinition.
		*/
    classHash: number;

    /**
		Mostly for historical purposes at this point, this is an enumeration for the character's race.
		
		It'll be preferable in the general case to look up the related definition: but for some people this
		was too convenient to remove.
		*/
    raceType: Globals.DestinyRace;

    /**
		Mostly for historical purposes at this point, this is an enumeration for the character's class.
		
		It'll be preferable in the general case to look up the related definition: but for some people this
		was too convenient to remove.
		*/
    classType: Globals.DestinyClass;

    /**
		Mostly for historical purposes at this point, this is an enumeration for the character's Gender.
		
		It'll be preferable in the general case to look up the related definition: but for some people this
		was too convenient to remove.  And yeah, it's an enumeration and not a boolean.  Fight me.
		*/
    genderType: Globals.DestinyGender;

    /**
		A shortcut path to the user's currently equipped emblem image.  If you're just showing summary
		info for a user, this is more convenient than examining their equipped emblem and looking up the definition.
		*/
    emblemPath: string;

    /**
		A shortcut path to the user's currently equipped emblem background image.  If you're just showing summary
		info for a user, this is more convenient than examining their equipped emblem and looking up the definition.
		*/
    emblemBackgroundPath: string;

    /**
		The hash of the currently equipped emblem for the user.  Can be used to look up the DestinyInventoryItemDefinition.
		*/
    emblemHash: number;

    /**
		A shortcut for getting the background color of the user's currently equipped emblem without having to do a
		DestinyInventoryItemDefinition lookup.
		*/
    emblemColor: Misc.DestinyColor;

    /**
		The progression that indicates your character's level.  Not their light level, but their
		character level: you know, the thing you max out a couple hours in and then ignore for
		the sake of light level.
		*/
    levelProgression: World.DestinyProgression;

    /**
		The "base" level of your character, not accounting for any light level.
		*/
    baseCharacterLevel: number;

    /**
		A number between 0 and 100, indicating the whole and fractional % remaining to get to
		the next character level.
		*/
    percentToNextLevel: number;

    /**
		If this Character has a title assigned to it, this is the identifier of
		the DestinyRecordDefinition that has that title information.
		*/
    titleRecordHash?: number;
  }

  /**
	This component returns anything that could be considered "Progression" on a user: data
	where the user is gaining levels, reputation, completions, rewards, etc...
	*/
  export interface DestinyCharacterProgressionComponent {
    /**
		A Dictionary of all known progressions for the Character, keyed by the Progression's hash.
		
		Not all progressions have user-facing data, but those who do will have that data contained in the DestinyProgressionDefinition.
		*/
    progressions: { [key: number]: World.DestinyProgression };

    /**
		A dictionary of all known Factions, keyed by the Faction's hash.  It contains data about this character's
		status with the faction.
		*/
    factions: { [key: number]: Progression.DestinyFactionProgression };

    /**
		Milestones are related to the simple progressions shown in the game, but return additional and
		hopefully helpful information for users about the specifics of the Milestone's status.
		*/
    milestones: { [key: number]: Milestones.DestinyMilestone };

    /**
		If the user has any active quests, the quests' statuses will be returned here.
		 
		 Note that quests have been largely supplanted by Milestones, but that doesn't mean that
		 they won't make a comeback independent of milestones at some point.
		
		 (Fun fact: quests came back as I feared they would, but we never looped back to populate this...
		 I'm going to put that in the backlog.)
		*/
    quests: Quests.DestinyQuestStatus[];

    /**
		Sometimes, you have items in your inventory that don't have instances, but still have
		Objective information.  This provides you that objective information for uninstanced
		items.  
		
		This dictionary is keyed by the item's hash: which you can use to look up the
		name and description for the overall task(s) implied by the objective.
		The value is the list of objectives for this item, and their statuses.
		*/
    uninstancedItemObjectives: {
      [key: number]: Quests.DestinyObjectiveProgress[];
    };

    /**
		Sometimes, you have items in your inventory that don't have instances, but still have perks (for example: Trials passage cards).
		This gives you the perk information for uninstanced items.
		
		This dictionary is keyed by item hash, which you can use to look up the corresponding item definition.
		The value is the list of perks states for the item.
		*/
    uninstancedItemPerks: { [key: number]: Items.DestinyItemPerksComponent };

    /**
		The set of checklists that can be examined for this specific character, keyed by the hash identifier
		of the Checklist (DestinyChecklistDefinition)
		
		For each checklist returned, its value is itself a Dictionary keyed by the checklist's hash identifier
		with the value being a boolean indicating if it's been discovered yet.
		*/
    checklists: { [key: number]: { [key: number]: boolean } };

    /**
		Data related to your progress on the current season's artifact that can vary per character.
		*/
    seasonalArtifact: Artifacts.DestinyArtifactCharacterScoped;
  }

  /**
	Only really useful if you're attempting to render the character's current appearance in 3D,
	this returns a bare minimum of information, pre-aggregated, that you'll need to perform that rendering.
	Note that you need to combine this with other 3D assets and data from our servers.
	
	Examine the Javascript returned by https://bungie.net/sharedbundle/spasm to see how we use this data, but
	be warned: the rabbit hole goes pretty deep.
	*/
  export interface DestinyCharacterRenderComponent {
    /**
		Custom dyes, calculated by iterating over the character's equipped items.
		Useful for pre-fetching all of the dye data needed from our server.
		*/
    customDyes: World.DyeReference[];

    /**
		This is actually something that Spasm.js *doesn't* do right now, and that we don't return assets for yet.
		This is the data about what character customization options you picked.  You can combine this with
		DestinyCharacterCustomizationOptionDefinition to show some cool info, and hopefully someday to actually
		render a user's face in 3D.  We'll see if we ever end up with time for that.
		*/
    customization: Character.DestinyCharacterCustomization;

    /**
		A minimal view of:
		
		- Equipped items
		
		- The rendering-related custom options on those equipped items
		
		Combined, that should be enough to render all of the items on the equipped character.
		*/
    peerView: Character.DestinyCharacterPeerView;
  }

  /**
	This component holds activity data for a character.  It will tell you about the character's current activity status,
	as well as activities that are available to the user.
	*/
  export interface DestinyCharacterActivitiesComponent {
    /**
		The last date that the user started playing an activity.
		*/
    dateActivityStarted: string;

    /**
		The list of activities that the user can play.
		*/
    availableActivities: World.DestinyActivity[];

    /**
		The list of activity interactables that the player can interact with.
		*/
    availableActivityInteractables: FireteamFinder.DestinyActivityInteractableReference[];

    /**
		If the user is in an activity, this will be the hash of the Activity being played.
		Note that you must combine this info with currentActivityModeHash to get a real picture of what
		the user is doing right now.  For instance, PVP "Activities" are just maps: it's the ActivityMode
		that determines what type of PVP game they're playing.
		*/
    currentActivityHash: number;

    /**
		If the user is in an activity, this will be the hash of the activity mode being played.
		Combine with currentActivityHash to give a person a full picture of what they're doing right now.
		*/
    currentActivityModeHash: number;

    /**
		And the current activity's most specific mode type, if it can be found.
		*/
    currentActivityModeType?: Globals.DestinyActivityModeType;

    /**
		If the user is in an activity, this will be the hashes of the DestinyActivityModeDefinition being played.
		Combine with currentActivityHash to give a person a full picture of what they're doing right now.
		*/
    currentActivityModeHashes: number[];

    /**
		All Activity Modes that apply to the current activity being played, in enum form.
		*/
    currentActivityModeTypes: Globals.DestinyActivityModeType[];

    /**
		If the user is in a playlist, this is the hash identifier for the playlist that they chose.
		*/
    currentPlaylistActivityHash?: number;

    /**
		This will have the activity hash of the last completed story/campaign mission, in case you care about that.
		*/
    lastCompletedStoryHash: number;
  }
}

export declare namespace Vendors {
  /**
	If a character purchased an item that is refundable, a Vendor Receipt will be created on the user's Destiny Profile.
	These expire after a configurable period of time, but until then can be used to get refunds on items.
	BNet does not provide the ability to refund a purchase *yet*, but you know.
	*/
  export interface DestinyVendorReceipt {
    /**
		The amount paid for the item, in terms of items that were consumed in the purchase and their quantity.
		*/
    currencyPaid: World.DestinyItemQuantity[];

    /**
		The item that was received, and its quantity.
		*/
    itemReceived: World.DestinyItemQuantity;

    /**
		The unlock flag used to determine whether you still have the purchased item.
		*/
    licenseUnlockHash: number;

    /**
		The ID of the character who made the purchase.
		*/
    purchasedByCharacterId: string;

    /**
		Whether you can get a refund, and what happens in order for the refund to be received.
		See the DestinyVendorItemRefundPolicy enum for details.
		*/
    refundPolicy: Globals.DestinyVendorItemRefundPolicy;

    /**
		The identifier of this receipt.
		*/
    sequenceNumber: number;

    /**
		The seconds since epoch at which this receipt is rendered invalid.
		*/
    timeToExpiration: string;

    /**
		The date at which this receipt is rendered invalid.
		*/
    expiresOn: string;
  }

  /**
	This component returns references to all of the Vendors in the response, grouped by categorizations
	that Bungie has deemed to be interesting, in the order in which both the groups and the vendors within
	that group should be rendered.
	*/
  export interface DestinyVendorGroupComponent {
    /**
		The ordered list of groups being returned.
		*/
    groups: Vendors.DestinyVendorGroup[];
  }

  /**
	Represents a specific group of vendors that can be rendered in the recommended order.
	
	How do we figure out this order?  It's a long story, and will likely get more complicated over time.
	*/
  export interface DestinyVendorGroup {
    vendorGroupHash: number;

    /**
		The ordered list of vendors within a particular group.
		*/
    vendorHashes: number[];
  }

  /**
	This component contains essential/summary information about the vendor.
	*/
  export interface DestinyVendorComponent {
    /**
		If True, you can purchase from the Vendor.
		*/
    canPurchase: boolean;

    /**
		If the Vendor has a related Reputation, this is the Progression data that represents the character's
		Reputation level with this Vendor.
		*/
    progression: World.DestinyProgression;

    /**
		An index into the vendor definition's "locations" property array, indicating which location they are at
		currently.  If -1, then the vendor has no known location (and you may choose not to show them in your UI
		as a result.  I mean, it's your bag honey)
		*/
    vendorLocationIndex: number;

    /**
		If this vendor has a seasonal rank, this will be the calculated value of that rank.  How nice is that?
		I mean, that's pretty sweeet.  It's a whole 32 bit integer.
		*/
    seasonalRank?: number;

    vendorHash: number;

    nextRefreshDate: string;

    enabled: boolean;
  }

  /**
	A vendor can have many categories of items that they sell.  This component will return the category information
	for available items, as well as the index into those items in the user's sale item list.
	
	Note that, since both the category and items are indexes, this data is Content Version dependent.  Be sure to check
	that your content is up to date before using this data.  This is an unfortunate, but permanent, limitation of
	Vendor data.
	*/
  export interface DestinyVendorCategoriesComponent {
    /**
		The list of categories for items that the vendor sells, in rendering order.
		
		These categories each point to a "display category" in the displayCategories property of the DestinyVendorDefinition,
		as opposed to the other categories.
		*/
    categories: Vendors.DestinyVendorCategory[];
  }

  /**
	Information about the category and items currently sold in that category.
	*/
  export interface DestinyVendorCategory {
    /**
		An index into the DestinyVendorDefinition.displayCategories property, so you can grab the display data for this category.
		*/
    displayCategoryIndex: number;

    /**
		An ordered list of indexes into items being sold in this category (DestinyVendorDefinition.itemList)
		which will contain more information about the items being sold themselves.  Can also be used to index into
		DestinyVendorSaleItemComponent data, if you asked for that data to be returned.
		*/
    itemIndexes: number[];
  }

  /**
	Request this component if you want the details about an item being sold in relation to the character
	making the request: whether the character can buy it,
	whether they can afford it, and other data related to purchasing the item.
	
	Note that if you want instance, stats, etc... data for the item, you'll have to request additional components such as
	ItemInstances, ItemPerks etc... and acquire them from the DestinyVendorResponse's "items" property.
	*/
  export interface DestinyVendorSaleItemComponent {
    /**
		A flag indicating whether the requesting character can buy the item, and if not the reasons why the character can't buy it.
		*/
    saleStatus: Globals.VendorItemStatus;

    /**
		If you can't buy the item due to a complex character state, these will be hashes for
		DestinyUnlockDefinitions that you can check to see messages regarding the failure (if the unlocks
		have human readable information: it is not guaranteed that Unlocks will have human readable strings, and
		your application will have to handle that)
		
		Prefer using failureIndexes instead.  These are provided for informational purposes, but have largely
		been supplanted by failureIndexes.
		*/
    requiredUnlocks: number[];

    /**
		If any complex unlock states are checked in determining purchasability, these will
		be returned here along with the status of the unlock check.
		
		Prefer using failureIndexes instead.  These are provided for informational purposes, but have largely
		been supplanted by failureIndexes.
		*/
    unlockStatuses: World.DestinyUnlockStatus[];

    /**
		Indexes in to the "failureStrings" lookup table in DestinyVendorDefinition for the given Vendor.
		Gives some more reliable failure information for why you can't purchase an item.
		
		It is preferred to use these over requiredUnlocks and unlockStatuses: the latter are provided
		mostly in case someone can do something interesting with it that I didn't anticipate.
		*/
    failureIndexes: number[];

    /**
		A flags enumeration value representing the current state of any "state modifiers" on the item being sold.
		These are meant to correspond with some sort of visual indicator as to the augmentation: for instance, if an
		item is on sale or if you already own the item in question.
		
		Determining how you want to represent these in your own app (or if you even want to) is an exercise left for the reader.
		*/
    augments: Globals.DestinyVendorItemState;

    /**
		If available, a list that describes which item values (rewards) should be shown (true) or hidden (false).
		*/
    itemValueVisibility: boolean[];

    vendorItemIndex: number;

    itemHash: number;

    overrideStyleItemHash?: number;

    quantity: number;

    costs: World.DestinyItemQuantity[];

    overrideNextRefreshDate?: string;

    apiPurchasable?: boolean;
  }

  /**
	This component contains essential/summary information about the vendor from the perspective of a
	character-agnostic view.
	*/
  export interface DestinyPublicVendorComponent {
    vendorHash: number;

    nextRefreshDate: string;

    enabled: boolean;
  }

  /**
	Has character-agnostic information about an item being sold by a vendor.
	
	Note that if you want instance, stats, etc... data for the item, you'll have to request additional components such as
	ItemInstances, ItemPerks etc... and acquire them from the DestinyVendorResponse's "items" property.  For most of these,
	however, you'll have to ask for it in context of a specific character.
	*/
  export interface DestinyPublicVendorSaleItemComponent {
    vendorItemIndex: number;

    itemHash: number;

    overrideStyleItemHash?: number;

    quantity: number;

    costs: World.DestinyItemQuantity[];

    overrideNextRefreshDate?: string;

    apiPurchasable?: boolean;
  }

  /**
	These definitions represent vendors' locations and relevant display information at different times in the game.
	*/
  export interface DestinyVendorLocationDefinition {
    /**
		The hash identifier for a Destination at which this vendor may be located.
		Each destination where a Vendor may exist will only ever have a single entry.
		*/
    destinationHash: number;

    /**
		The relative path to the background image representing this Vendor at this location, for use in a banner.
		*/
    backgroundImagePath: string;
  }
}

export declare namespace Components {
  export interface SingleComponentResponseDestinyVendorReceiptsComponent {
    data: Profiles.DestinyVendorReceiptsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyInventoryComponent {
    data: Inventory.DestinyInventoryComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyProfileComponent {
    data: Profiles.DestinyProfileComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyPlatformSilverComponent {
    data: Inventory.DestinyPlatformSilverComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyKiosksComponent {
    data: Kiosks.DestinyKiosksComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyPlugSetsComponent {
    data: PlugSets.DestinyPlugSetsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyProfileProgressionComponent {
    data: Profiles.DestinyProfileProgressionComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyPresentationNodesComponent {
    data: Presentation.DestinyPresentationNodesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyProfileRecordsComponent {
    data: Records.DestinyProfileRecordsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyProfileCollectiblesComponent {
    data: Collectibles.DestinyProfileCollectiblesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyProfileTransitoryComponent {
    data: Profiles.DestinyProfileTransitoryComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyMetricsComponent {
    data: Metrics.DestinyMetricsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyStringVariablesComponent {
    data: StringVariables.DestinyStringVariablesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinySocialCommendationsComponent {
    data: Social.DestinySocialCommendationsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCharacterComponent {
    data: { [key: string]: Characters.DestinyCharacterComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyInventoryComponent {
    data: { [key: string]: Inventory.DestinyInventoryComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyLoadoutsComponent {
    data: { [key: string]: Loadouts.DestinyLoadoutsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCharacterProgressionComponent {
    data: { [key: string]: Characters.DestinyCharacterProgressionComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCharacterRenderComponent {
    data: { [key: string]: Characters.DestinyCharacterRenderComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCharacterActivitiesComponent {
    data: { [key: string]: Characters.DestinyCharacterActivitiesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyKiosksComponent {
    data: { [key: string]: Kiosks.DestinyKiosksComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyPlugSetsComponent {
    data: { [key: string]: PlugSets.DestinyPlugSetsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemObjectivesComponent {
    data: { [key: number]: Items.DestinyItemObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemPerksComponent {
    data: { [key: number]: Items.DestinyItemPerksComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyPresentationNodesComponent {
    data: { [key: string]: Presentation.DestinyPresentationNodesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCharacterRecordsComponent {
    data: { [key: string]: Records.DestinyCharacterRecordsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCollectiblesComponent {
    data: { [key: string]: Collectibles.DestinyCollectiblesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyStringVariablesComponent {
    data: { [key: string]: StringVariables.DestinyStringVariablesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCraftablesComponent {
    data: { [key: string]: Craftables.DestinyCraftablesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemInstanceComponent {
    data: { [key: string]: Items.DestinyItemInstanceComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemRenderComponent {
    data: { [key: string]: Items.DestinyItemRenderComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemStatsComponent {
    data: { [key: string]: Items.DestinyItemStatsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemSocketsComponent {
    data: { [key: string]: Items.DestinyItemSocketsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemReusablePlugsComponent {
    data: { [key: string]: Items.DestinyItemReusablePlugsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemPlugObjectivesComponent {
    data: { [key: string]: Items.DestinyItemPlugObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemTalentGridComponent {
    data: { [key: string]: Items.DestinyItemTalentGridComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemPlugComponent {
    data: { [key: number]: Items.DestinyItemPlugComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemObjectivesComponent {
    data: { [key: string]: Items.DestinyItemObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyItemPerksComponent {
    data: { [key: string]: Items.DestinyItemPerksComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt64DestinyCurrenciesComponent {
    data: { [key: string]: Inventory.DestinyCurrenciesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCharacterComponent {
    data: Characters.DestinyCharacterComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCharacterProgressionComponent {
    data: Characters.DestinyCharacterProgressionComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCharacterRenderComponent {
    data: Characters.DestinyCharacterRenderComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCharacterActivitiesComponent {
    data: Characters.DestinyCharacterActivitiesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyLoadoutsComponent {
    data: Loadouts.DestinyLoadoutsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCharacterRecordsComponent {
    data: Records.DestinyCharacterRecordsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCollectiblesComponent {
    data: Collectibles.DestinyCollectiblesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyCurrenciesComponent {
    data: Inventory.DestinyCurrenciesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemComponent {
    data: Items.DestinyItemComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemInstanceComponent {
    data: Items.DestinyItemInstanceComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemObjectivesComponent {
    data: Items.DestinyItemObjectivesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemPerksComponent {
    data: Items.DestinyItemPerksComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemRenderComponent {
    data: Items.DestinyItemRenderComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemStatsComponent {
    data: Items.DestinyItemStatsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemTalentGridComponent {
    data: Items.DestinyItemTalentGridComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemSocketsComponent {
    data: Items.DestinyItemSocketsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemReusablePlugsComponent {
    data: Items.DestinyItemReusablePlugsComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyItemPlugObjectivesComponent {
    data: Items.DestinyItemPlugObjectivesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyVendorGroupComponent {
    data: Vendors.DestinyVendorGroupComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyVendorComponent {
    data: { [key: number]: Vendors.DestinyVendorComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyVendorCategoriesComponent {
    data: { [key: number]: Vendors.DestinyVendorCategoriesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32PersonalDestinyVendorSaleItemSetComponent {
    data: {
      [key: number]: Responses.PersonalDestinyVendorSaleItemSetComponent;
    };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemComponent {
    data: { [key: number]: Items.DestinyItemComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemInstanceComponent {
    data: { [key: number]: Items.DestinyItemInstanceComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemRenderComponent {
    data: { [key: number]: Items.DestinyItemRenderComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemStatsComponent {
    data: { [key: number]: Items.DestinyItemStatsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemSocketsComponent {
    data: { [key: number]: Items.DestinyItemSocketsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemReusablePlugsComponent {
    data: { [key: number]: Items.DestinyItemReusablePlugsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemPlugObjectivesComponent {
    data: { [key: number]: Items.DestinyItemPlugObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemTalentGridComponent {
    data: { [key: number]: Items.DestinyItemTalentGridComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemObjectivesComponent {
    data: { [key: number]: Items.DestinyItemObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyItemPerksComponent {
    data: { [key: number]: Items.DestinyItemPerksComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyVendorComponent {
    data: Vendors.DestinyVendorComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface SingleComponentResponseDestinyVendorCategoriesComponent {
    data: Vendors.DestinyVendorCategoriesComponent;

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseInt32DestinyVendorSaleItemComponent {
    data: { [key: number]: Vendors.DestinyVendorSaleItemComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyPublicVendorComponent {
    data: { [key: number]: Vendors.DestinyPublicVendorComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32PublicDestinyVendorSaleItemSetComponent {
    data: { [key: number]: Responses.PublicDestinyVendorSaleItemSetComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemInstanceComponent {
    data: { [key: number]: Items.DestinyItemInstanceComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemRenderComponent {
    data: { [key: number]: Items.DestinyItemRenderComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemStatsComponent {
    data: { [key: number]: Items.DestinyItemStatsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemSocketsComponent {
    data: { [key: number]: Items.DestinyItemSocketsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemReusablePlugsComponent {
    data: { [key: number]: Items.DestinyItemReusablePlugsComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemPlugObjectivesComponent {
    data: { [key: number]: Items.DestinyItemPlugObjectivesComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }

  export interface DictionaryComponentResponseUInt32DestinyItemTalentGridComponent {
    data: { [key: number]: Items.DestinyItemTalentGridComponent };

    privacy: Globals.ComponentPrivacySetting;

    disabled?: boolean;
  }
}

export declare namespace Kiosks {
  /**
	A Kiosk is a Vendor (DestinyVendorDefinition) that sells items based on whether you have
	already acquired that item before.
	
	This component returns information about what Kiosk items are available to you on a *Profile*
	level.  It is theoretically possible for Kiosks to have items gated by specific Character as well.
	If you ever have those, you will find them on the individual character's DestinyCharacterKiosksComponent.
	
	Note that, because this component returns vendorItemIndexes (that is to say, indexes into the Kiosk Vendor's
	itemList property), these results are necessarily content version dependent.  Make sure that you have
	the latest version of the content manifest databases before using this data.
	*/
  export interface DestinyKiosksComponent {
    /**
		A dictionary keyed by the Kiosk Vendor's hash identifier (use it to look up the DestinyVendorDefinition
		for the relevant kiosk vendor), and whose value is a list of all the items that the user can "see" in
		the Kiosk, and any other interesting metadata.
		*/
    kioskItems: { [key: number]: Kiosks.DestinyKioskItem[] };
  }

  export interface DestinyKioskItem {
    /**
		The index of the item in the related DestinyVendorDefintion's itemList property, representing
		the sale.
		*/
    index: number;

    /**
		If true, the user can not only see the item, but they can acquire it.  It is possible that a user
		can see a kiosk item and not be able to acquire it.
		*/
    canAcquire: boolean;

    /**
		Indexes into failureStrings for the Vendor, indicating the reasons why it failed if any.
		*/
    failureIndexes: number[];

    /**
		I may regret naming it this way - but this represents when an item has an objective that doesn't serve
		a beneficial purpose, but rather is used for "flavor" or additional information.  For instance, when Emblems
		track specific stats, those stats are represented as Objectives on the item.
		*/
    flavorObjective: Quests.DestinyObjectiveProgress;
  }
}

export declare namespace PlugSets {
  /**
	Sockets may refer to a "Plug Set": a set of reusable plugs that may be shared across multiple sockets
	(or even, in theory, multiple sockets over multiple items).
	
	This is the set of those plugs that we came across in the users' inventory, along with the values
	for plugs in the set.  Any given set in this component may be represented in Character and Profile-level, as some
	plugs may be Profile-level restricted, and some character-level restricted.  (note that the ones that are even more
	specific will remain on the actual socket component itself, as they cannot be reused)
	*/
  export interface DestinyPlugSetsComponent {
    /**
		The shared list of plugs for each relevant PlugSet, keyed by the hash identifier of the PlugSet (DestinyPlugSetDefinition).
		*/
    plugs: { [key: number]: Sockets.DestinyItemPlug[] };
  }
}

export declare namespace Sockets {
  export interface DestinyItemPlug {
    /**
		Sometimes, Plugs may have objectives: these are often used for flavor and display purposes, but they
		can be used for any arbitrary purpose (both fortunately and unfortunately).  Recently (with Season 2) they
		were expanded in use to be used as the "gating" for whether the plug can be inserted at all.
		For instance, a Plug might be tracking the number of PVP kills you have made.  It will use the parent item's
		data about that tracking status to determine what to show, and will generally show it using the DestinyObjectiveDefinition's
		progressDescription property.  Refer to the plug's itemHash and objective property for more information if
		you would like to display even more data.
		*/
    plugObjectives: Quests.DestinyObjectiveProgress[];

    plugItemHash: number;

    canInsert: boolean;

    enabled: boolean;

    insertFailIndexes: number[];

    enableFailIndexes: number[];

    stackSize?: number;

    maxStackSize?: number;
  }

  export interface DestinyItemPlugBase {
    /**
		The hash identifier of the DestinyInventoryItemDefinition that represents this plug.
		*/
    plugItemHash: number;

    /**
		If true, this plug has met all of its insertion requirements.  Big if true.
		*/
    canInsert: boolean;

    /**
		If true, this plug will provide its benefits while inserted.
		*/
    enabled: boolean;

    /**
		If the plug cannot be inserted for some reason, this will have the indexes into the plug item definition's 
		plug.insertionRules property, so you can show the reasons why it can't be inserted.
		
		This list will be empty if the plug can be inserted.
		*/
    insertFailIndexes: number[];

    /**
		If a plug is not enabled, this will be populated with indexes into the plug item definition's 
		plug.enabledRules property, so that you can show the reasons why it is not enabled.
		
		This list will be empty if the plug is enabled.
		*/
    enableFailIndexes: number[];

    /**
		If available, this is the stack size to display for the socket plug item.
		*/
    stackSize?: number;

    /**
		If available, this is the maximum stack size to display for the socket plug item.
		*/
    maxStackSize?: number;
  }

  /**
	All Sockets have a "Type": a set of common properties that determine when the socket allows
	Plugs to be inserted, what Categories of Plugs can be inserted, and whether the socket is
	even visible at all given the current game/character/account state.
	
	See DestinyInventoryItemDefinition for more information about Socketed items and Plugs.
	*/
  export interface DestinySocketTypeDefinition {
    /**
		There are fields for this display data, but they appear to be unpopulated as of now.
		I am not sure where in the UI these would show if they even were populated, but
		I will continue to return this data in case it becomes useful.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Defines what happens when a plug is inserted into sockets of this type.
		*/
    insertAction: Sockets.DestinyInsertPlugActionDefinition;

    /**
		A list of Plug "Categories" that are allowed to be plugged into sockets of this type.
		
		These should be compared against a given plug item's DestinyInventoryItemDefinition.plug.plugCategoryHash,
		which indicates the plug item's category.
		
		If the plug's category matches any whitelisted plug, or if the whitelist is empty, it is allowed to be inserted.
		*/
    plugWhitelist: Sockets.DestinyPlugWhitelistEntryDefinition[];

    socketCategoryHash: number;

    /**
		Sometimes a socket isn't visible.  These are some of the conditions under which sockets of this
		type are not visible.  Unfortunately, the truth of visibility is much, much more complex.  Best to
		rely on the live data for whether the socket is visible and enabled.
		*/
    visibility: Globals.DestinySocketVisibility;

    alwaysRandomizeSockets: boolean;

    isPreviewEnabled: boolean;

    hideDuplicateReusablePlugs: boolean;

    /**
		This property indicates if the socket type determines whether Emblem icons and nameplates
		should be overridden by the inserted plug item's icon and nameplate.
		*/
    overridesUiAppearance: boolean;

    avoidDuplicatesOnInitialization: boolean;

    currencyScalars: Sockets.DestinySocketTypeScalarMaterialRequirementEntry[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Data related to what happens while a plug is being inserted, mostly for UI purposes.
	*/
  export interface DestinyInsertPlugActionDefinition {
    /**
		How long it takes for the Plugging of the item to be completed once it is initiated, if you care.
		*/
    actionExecuteSeconds: number;

    /**
		The type of action being performed when you act on this Socket Type.  The most common
		value is "insert plug", but there are others as well (for instance, a "Masterwork" socket may
		allow for Re-initialization, and an Infusion socket allows for items to be consumed to upgrade the item)
		*/
    actionType: Globals.SocketTypeActionType;
  }

  /**
	Defines a plug "Category" that is allowed to be plugged into a socket of this type.
	
	This should be compared against a given plug item's DestinyInventoryItemDefinition.plug.plugCategoryHash,
	which indicates the plug item's category.
	*/
  export interface DestinyPlugWhitelistEntryDefinition {
    /**
		The hash identifier of the Plug Category to compare against the plug item's plug.plugCategoryHash.
		
		Note that this does NOT relate to any Definition in itself, it is only used for comparison purposes.
		*/
    categoryHash: number;

    /**
		The string identifier for the category, which is here mostly for debug purposes.
		*/
    categoryIdentifier: string;

    /**
		The list of all plug items (DestinyInventoryItemDefinition) that the socket may randomly be populated with
		when reinitialized.
		
		Which ones you should actually show are determined by the plug being inserted into the socket, and the socket’s type.
		
		When you inspect the plug that could go into a Masterwork Socket, look up the socket type of the socket being inspected and find the DestinySocketTypeDefinition.
		
		Then, look at the Plugs that can fit in that socket.  Find the Whitelist in the DestinySocketTypeDefinition that matches the plug item’s categoryhash.
		
		That whitelist entry will potentially have a new “reinitializationPossiblePlugHashes” property.If it does, that means we know what it will roll if you try to insert this plug into this socket.
		*/
    reinitializationPossiblePlugHashes: number[];
  }

  export interface DestinySocketTypeScalarMaterialRequirementEntry {
    currencyItemHash: number;

    scalarValue: number;
  }

  /**
	Sockets on an item are organized into Categories visually.
	
	You can find references to
	the socket category defined on an item's DestinyInventoryItemDefinition.sockets.socketCategories
	property.
	
	This has the display information for rendering the categories' header, and a hint
	for how the UI should handle showing this category.
	
	The shitty thing about this, however, is that the socket categories' UI style can be overridden by the item's
	UI style.  For instance, the Socket Category used by Emote Sockets says it's "consumable," but that's a lie: they're
	all reusable, and overridden by the detail UI pages in ways that we can't easily account for in the API.
	
	As a result, I will try to compile these rules into the individual sockets on items, and provide the best hint possible
	there through the plugSources property.  In the future, I may attempt to use this information in conjunction with the item
	to provide a more usable UI hint on the socket layer, but for now improving the consistency of plugSources is the best I have
	time to provide.  (See https://github.com/Bungie-net/api/issues/522 for more info)
	*/
  export interface DestinySocketCategoryDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A string hinting to the game's UI system about how the sockets in this category should be displayed.
		
		BNet doesn't use it: it's up to you to find valid values and make your own special UI if you want
		to honor this category style.
		*/
    uiCategoryStyle: number;

    /**
		Same as uiCategoryStyle, but in a more usable enumeration form.
		*/
    categoryStyle: Globals.DestinySocketCategoryStyle;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Sometimes, we have large sets of reusable plugs that are defined identically and thus can (and in some cases,
	 are so large that they *must*) be shared across the places where they are used.  These are the definitions
	 for those reusable sets of plugs.  
	 
	 See DestinyItemSocketEntryDefinition.plugSource and reusablePlugSetHash for the relationship between these
	 reusable plug sets and the sockets that leverage them (for starters, Emotes).
	
	 As of the release of Shadowkeep (Late 2019), these will begin to be sourced from game content directly - which means
	 there will be many more of them, but it also means we may not get all data that we used to get for them.
	
	 DisplayProperties, in particular, will no longer be guaranteed to contain valid information.  We will make a best
	 effort to guess what ought to be populated there where possible, but it will be invalid for many/most plug sets.
	*/
  export interface DestinyPlugSetDefinition {
    /**
		If you want to show these plugs in isolation, these are the display properties for them.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		This is a list of pre-determined plugs that can be plugged into this socket, without
		the character having the plug in their inventory.
		
		If this list is populated, you will not be allowed to plug an arbitrary item in the socket: you
		will only be able to choose from one of these reusable plugs.
		*/
    reusablePlugItems: Definitions.DestinyItemSocketEntryPlugItemRandomizedDefinition[];

    /**
		Mostly for our debugging or reporting bugs, BNet is making "fake" plug sets in a desperate effort to reduce
		 socket sizes.
		
		 If this is true, the plug set was generated by BNet: if it looks wrong, that's a good indicator
		 that it's bungie.net that fucked this up.
		*/
    isFakePlugSet: boolean;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace Artifacts {
  /**
	Represents a Seasonal Artifact and all data related to it for the requested Account.
	
	It can be combined with Character-scoped data for a full picture of what a character
	has available/has chosen, or just these settings can be used for overview information.
	*/
  export interface DestinyArtifactProfileScoped {
    artifactHash: number;

    pointProgression: World.DestinyProgression;

    pointsAcquired: number;

    powerBonusProgression: World.DestinyProgression;

    powerBonus: number;
  }

  export interface DestinyArtifactCharacterScoped {
    artifactHash: number;

    pointsUsed: number;

    resetCount: number;

    tiers: Artifacts.DestinyArtifactTier[];
  }

  export interface DestinyArtifactTier {
    tierHash: number;

    isUnlocked: boolean;

    pointsToUnlock: number;

    items: Artifacts.DestinyArtifactTierItem[];
  }

  export interface DestinyArtifactTierItem {
    itemHash: number;

    isActive: boolean;

    isVisible: boolean;
  }

  /**
	Represents known info about a Destiny Artifact.
	
	We cannot guarantee that artifact definitions will be immutable between seasons - in fact,
	we've been told that they will be replaced between seasons.  But this definition is built
	both to minimize the amount of lookups for related data that have to occur, and is built in
	hope that, if this plan changes, we will be able to accommodate it more easily.
	*/
  export interface DestinyArtifactDefinition {
    /**
		Any basic display info we know about the Artifact.  Currently sourced from a related inventory item,
		but the source of this data is subject to change.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		Any Geometry/3D info we know about the Artifact.  Currently sourced from a related inventory item's
		gearset information, but the source of this data is subject to change.
		*/
    translationBlock: Definitions.DestinyItemTranslationBlockDefinition;

    /**
		Any Tier/Rank data related to this artifact, listed in display order.  
		Currently sourced from a Vendor, but this source is subject to change.
		*/
    tiers: Artifacts.DestinyArtifactTierDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyArtifactTierDefinition {
    /**
		An identifier, unique within the Artifact, for this specific tier.
		*/
    tierHash: number;

    /**
		The human readable title of this tier, if any.
		*/
    displayTitle: string;

    /**
		A string representing the localized minimum requirement text for this Tier, if any.
		*/
    progressRequirementMessage: string;

    /**
		The items that can be earned within this tier.
		*/
    items: Artifacts.DestinyArtifactTierItemDefinition[];

    /**
		The minimum number of "unlock points" that you must have used
		before you can unlock items from this tier.
		*/
    minimumUnlockPointsUsedRequirement: number;
  }

  export interface DestinyArtifactTierItemDefinition {
    /**
		The identifier of the Plug Item unlocked by activating this item in the Artifact.
		*/
    itemHash: number;
  }
}

export declare namespace Metrics {
  export interface DestinyMetricsComponent {
    metrics: { [key: number]: Metrics.DestinyMetricComponent };

    metricsRootNodeHash: number;
  }

  export interface DestinyMetricComponent {
    invisible: boolean;

    objectiveProgress: Quests.DestinyObjectiveProgress;
  }

  export interface DestinyMetricDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    trackingObjectiveHash: number;

    lowerValueIsBetter: boolean;

    presentationNodeType: Globals.DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace StringVariables {
  export interface DestinyStringVariablesComponent {
    integerValuesByHash: { [key: number]: number };
  }
}

export declare namespace Social {
  export interface DestinySocialCommendationsComponent {
    totalScore: number;

    /**
		The percentage for each commendation type out of total received
		*/
    commendationNodePercentagesByHash: { [key: number]: number };

    scoreDetailValues: number[];

    commendationNodeScoresByHash: { [key: number]: number };

    commendationScoresByHash: { [key: number]: number };
  }
}

export declare namespace Loadouts {
  export interface DestinyLoadoutsComponent {
    loadouts: Loadouts.DestinyLoadoutComponent[];
  }

  export interface DestinyLoadoutComponent {
    colorHash: number;

    iconHash: number;

    nameHash: number;

    items: Loadouts.DestinyLoadoutItemComponent[];
  }

  export interface DestinyLoadoutItemComponent {
    itemInstanceId: string;

    plugItemHashes: number[];
  }
}

export declare namespace Progression {
  /**
	Mostly for historical purposes, we segregate Faction progressions from other progressions.
	This is just a DestinyProgression with a shortcut for finding the DestinyFactionDefinition
	of the faction related to the progression.
	*/
  export interface DestinyFactionProgression {
    /**
		The hash identifier of the Faction related to this progression.  Use it to look up the DestinyFactionDefinition
		for more rendering info.
		*/
    factionHash: number;

    /**
		The index of the Faction vendor that is currently available. Will be set to -1 if no vendors are available.
		*/
    factionVendorIndex: number;

    progressionHash: number;

    dailyProgress: number;

    dailyLimit: number;

    weeklyProgress: number;

    weeklyLimit: number;

    currentProgress: number;

    level: number;

    levelCap: number;

    stepIndex: number;

    progressToNextLevel: number;

    nextLevelAt: number;

    currentResetCount?: number;

    seasonResets: World.DestinyProgressionResetEntry[];

    rewardItemStates: Globals.DestinyProgressionRewardItemState[];

    rewardItemSocketOverrideStates: {
      [key: number]: World.DestinyProgressionRewardItemSocketOverrideState;
    };
  }

  /**
	These are pre-constructed collections of data that can be used to determine the Level Requirement
	for an item given a Progression to be tested (such as the Character's level).
	
	For instance, say a character receives a new Auto Rifle, and that Auto Rifle's
	DestinyInventoryItemDefinition.quality.progressionLevelRequirementHash property is pointing
	at one of these DestinyProgressionLevelRequirementDefinitions.  Let's pretend also that the progressionHash
	it is pointing at is the Character Level progression.  In that situation, the character's level will be used
	to interpolate a value in the requirementCurve property.  The value picked up from that interpolation will
	be the required level for the item.
	*/
  export interface DestinyProgressionLevelRequirementDefinition {
    /**
		A curve of level requirements, weighted by the related progressions' level.
		
		Interpolate against this curve with the character's progression level to determine
		what the level requirement of the generated item that is using this data will be.
		*/
    requirementCurve: Interpolation.InterpolationPointFloat[];

    /**
		The progression whose level should be used to determine the level requirement.
		
		Look up the DestinyProgressionDefinition with this hash for more information about
		the progression in question.
		*/
    progressionHash: number;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace Milestones {
  /**
	Represents a runtime instance of a user's milestone status.
	Live Milestone data should be combined with DestinyMilestoneDefinition data to show the user
	a picture of what is available for them to do in the game, and their status in regards to said "things to do."
	Consider it a big, wonky to-do list, or Advisors 3.0 for those who remember the Destiny 1 API.
	*/
  export interface DestinyMilestone {
    /**
		The unique identifier for the Milestone.  Use it to look up the DestinyMilestoneDefinition, so
		you can combine the other data in this contract with static definition data.
		*/
    milestoneHash: number;

    /**
		Indicates what quests are available for this Milestone.
		Usually this will be only a single Quest, but some quests have multiple available that you
		can choose from at any given time.
		All possible quests for a milestone can be found in the DestinyMilestoneDefinition, but they must
		be combined with this Live data to determine which one(s) are actually active right now.
		It is possible for Milestones to not have any quests.
		*/
    availableQuests: Milestones.DestinyMilestoneQuest[];

    /**
		The currently active Activities in this milestone, when the Milestone is driven by Challenges.
		
		Not all Milestones have Challenges, but when they do this will indicate the Activities and Challenges
		under those Activities related to this Milestone.
		*/
    activities: Milestones.DestinyMilestoneChallengeActivity[];

    /**
		Milestones may have arbitrary key/value pairs associated with them, for data that users will
		want to know about but that doesn't fit neatly into any of the common components such as Quests.
		A good example of this would be - if this existed in Destiny 1 - the number of wins you currently have
		on your Trials of Osiris ticket.
		Looking in the DestinyMilestoneDefinition,
		you can use the string identifier of this dictionary to look up more info about the value, including
		localized string content for displaying the value.  The value in the dictionary is the floating point
		number.  The definition will tell you how to format this number.
		*/
    values: { [key: string]: number };

    /**
		A milestone may have one or more active vendors that are "related" to it (that provide rewards, or that
		are the initiators of the Milestone).  I already regret this, even as I'm typing it. [I told you I'd regret this]
		You see, sometimes a milestone may be directly correlated with a set of vendors that provide varying tiers
		of rewards.  The player may not be able to interact with one or more of those vendors.  This will return
		the hashes of the Vendors that the player *can* interact with, allowing you to show their current inventory
		as rewards or related items to the Milestone or its activities.
		
		Before we even use it, it's already deprecated!  How much of a bummer is that?  We need more data.
		*/
    vendorHashes: number[];

    /**
		Replaces vendorHashes, which I knew was going to be trouble the day it walked in the door.
		This will return not only what Vendors are active and relevant to the activity (in an implied
		order that you can choose to ignore), but also other data - for example, if the Vendor is featuring
		a specific item relevant to this event that you should show with them.
		*/
    vendors: Milestones.DestinyMilestoneVendor[];

    /**
		If the entity to which this component is attached has known active Rewards for the player, this will detail
		information about those rewards, keyed by the RewardEntry Hash. (See DestinyMilestoneDefinition for
		more information about Reward Entries)
		Note that these rewards are not for the Quests related to the Milestone.  Think of these as "overview/checklist"
		rewards that may be provided for Milestones that may provide rewards for performing a variety of tasks that
		aren't under a specific Quest.
		*/
    rewards: Milestones.DestinyMilestoneRewardCategory[];

    /**
		If known, this is the date when the event last began or refreshed.  It will only be populated for events with fixed
		and repeating start and end dates.
		*/
    startDate?: string;

    /**
		If known, this is the date when the event will next end or repeat.  It will only be populated for events with fixed
		and repeating start and end dates.
		*/
    endDate?: string;

    /**
		Used for ordering milestones in a display to match how we order them in BNet.  May pull from static data,
		or possibly in the future from dynamic information.
		*/
    order: number;
  }

  /**
	If a Milestone has one or more Quests, this will contain the live information for the character's status with
	one of those quests.
	*/
  export interface DestinyMilestoneQuest {
    /**
		Quests are defined as Items in content.  As such, this is the hash identifier 
		of the DestinyInventoryItemDefinition that represents this quest.  It will have pointers to all of the steps
		in the quest, and display information for the quest (title, description, icon etc)
		Individual steps will be referred to in the Quest item's DestinyInventoryItemDefinition.setData
		property, and themselves are Items with their own renderable data.
		*/
    questItemHash: number;

    /**
		The current status of the quest for the character making the request.
		*/
    status: Quests.DestinyQuestStatus;

    /**
		*IF* the Milestone has an active Activity that can give you greater details
		about what you need to do, it will be returned here.
		Remember to associate this with the DestinyMilestoneDefinition's activities
		to get details about the activity, including what specific quest it is related to if you
		have multiple quests to choose from.
		*/
    activity: Milestones.DestinyMilestoneActivity;

    /**
		The activities referred to by this quest can have many associated challenges.
		They are all contained here, with activityHashes so that you can associate them with
		the specific activity variants in which they can be found.
		In retrospect, I probably should have put these under the specific Activity Variants,
		but it's too late to change it now.
		Theoretically, a quest without Activities can still have Challenges, which is why
		this is on a higher level than activity/variants, but it probably should have been
		in both places.  That may come as a later revision.
		*/
    challenges: Challenges.DestinyChallengeStatus[];
  }

  /**
	Sometimes, we know the specific activity that the Milestone wants you to play.
	This entity provides additional information about that Activity and all of its
	variants.  (sometimes there's only one variant, but I think you get the point)
	*/
  export interface DestinyMilestoneActivity {
    /**
		The hash of an arbitrarily chosen variant of this activity.  We'll go ahead and
		call that the "canonical" activity, because if you're using this value you should
		only use it for properties that are common across the variants: things like the
		name of the activity, it's location, etc...
		Use this hash to look up the DestinyActivityDefinition of this activity for rendering data.
		*/
    activityHash: number;

    /**
		The hash identifier of the most specific Activity Mode under which this activity is played.  This is useful for situations
		where the activity in question is - for instance - a PVP map, but it's not clear what mode the PVP map is being
		played under.  If it's a playlist, this will be less specific: but hopefully useful in some way.
		*/
    activityModeHash?: number;

    /**
		The enumeration equivalent of the most specific Activity Mode under which this activity is played.
		*/
    activityModeType?: Globals.DestinyActivityModeType;

    /**
		If the activity has modifiers, this will be the list of modifiers that all variants
		have in common.  Perform lookups against
		DestinyActivityModifierDefinition which defines the modifier being applied to get
		at the modifier data.
		Note that, in the DestiyActivityDefinition, you will see many more modifiers than this
		being referred to: those are all *possible* modifiers for the activity, not the active ones.
		Use only the active ones to match what's really live.
		*/
    modifierHashes: number[];

    /**
		If you want more than just name/location/etc... you're going to have to dig into
		and show the variants of the conceptual activity.  These will differ in seemingly
		arbitrary ways, like difficulty level and modifiers applied.  Show it in whatever
		way tickles your fancy.
		*/
    variants: Milestones.DestinyMilestoneActivityVariant[];
  }

  /**
	Represents custom data that we know about an individual variant of an activity.
	*/
  export interface DestinyMilestoneActivityVariant {
    /**
		The hash for the specific variant of the activity related to this milestone.
		You can pull more detailed static info from the DestinyActivityDefinition, such as difficulty level.
		*/
    activityHash: number;

    /**
		An OPTIONAL component: if it makes sense to talk about this activity variant in terms of
		whether or not it has been completed or what progress you have made in it, this will be returned.
		Otherwise, this will be NULL.
		*/
    completionStatus: Milestones.DestinyMilestoneActivityCompletionStatus;

    /**
		The hash identifier of the most specific Activity Mode under which this activity is played.  This is useful for situations
		where the activity in question is - for instance - a PVP map, but it's not clear what mode the PVP map is being
		played under.  If it's a playlist, this will be less specific: but hopefully useful in some way.
		*/
    activityModeHash?: number;

    /**
		The enumeration equivalent of the most specific Activity Mode under which this activity is played.
		*/
    activityModeType?: Globals.DestinyActivityModeType;
  }

  /**
	Represents this player's personal completion status for the Activity under a Milestone, if the
	activity has trackable completion and progress information. (most activities won't, or the concept
	won't apply.  For instance, it makes sense to talk about a tier of a raid as being Completed or having
	progress, but it doesn't make sense to talk about a Crucible Playlist in those terms.
	*/
  export interface DestinyMilestoneActivityCompletionStatus {
    /**
		If the activity has been "completed", that information will be returned here.
		*/
    completed: boolean;

    /**
		If the Activity has discrete "phases" that we can track, that info will be here.  Otherwise,
		this value will be NULL.
		Note that this is a list and not a dictionary: the order implies the ascending order of phases
		or progression in this activity.
		*/
    phases: Milestones.DestinyMilestoneActivityPhase[];
  }

  /**
	Represents whatever information we can return about an explicit phase in an activity.
	In the future, I hope we'll have more than just "guh, you done gone and did something,"
	but for the forseeable future that's all we've got.  I'm making it more than just a list of
	booleans out of that overly-optimistic hope.
	*/
  export interface DestinyMilestoneActivityPhase {
    /**
		Indicates if the phase has been completed.
		*/
    complete: boolean;

    /**
		In DestinyActivityDefinition, if the activity has phases, there will be a set of
		phases defined in the "insertionPoints" property.  This is the hash that maps to that phase.
		*/
    phaseHash: number;
  }

  export interface DestinyMilestoneChallengeActivity {
    activityHash: number;

    challenges: Challenges.DestinyChallengeStatus[];

    /**
		If the activity has modifiers, this will be the list of modifiers that all variants
		have in common.  Perform lookups against DestinyActivityModifierDefinition which defines the modifier 
		being applied to get at the modifier data.
		
		Note that, in the DestiyActivityDefinition, you will see many more modifiers than this
		being referred to: those are all *possible* modifiers for the activity, not the active ones.
		Use only the active ones to match what's really live.
		*/
    modifierHashes: number[];

    /**
		The set of activity options for this activity, keyed by an identifier that's unique for this activity
		(not guaranteed to be unique between or across all activities, though should be unique for every *variant* of a
		given *conceptual* activity: for instance, the original D2 Raid has many variant DestinyActivityDefinitions.  While
		other activities could potentially have the same option hashes, for any given D2 base Raid variant the hash will be unique).
		
		As a concrete example of this data, the hashes you get for Raids will correspond to the currently active "Challenge Mode".
		
		We don't have any human readable information for these, but saavy 3rd party app users could manually associate the key
		(a hash identifier for the "option" that is enabled/disabled) and the value (whether it's enabled or disabled presently)
		
		On our side, we don't necessarily even know what these are used for (the game designers know, but we don't), 
		and we have no human readable data for them.  In order to use them, you will have to do some experimentation.
		*/
    booleanActivityOptions: { [key: number]: boolean };

    /**
		If returned, this is the index into the DestinyActivityDefinition's "loadouts" property,
		indicating the currently active loadout requirements.
		*/
    loadoutRequirementIndex?: number;

    /**
		If the Activity has discrete "phases" that we can track, that info will be here.  Otherwise,
		this value will be NULL.
		Note that this is a list and not a dictionary: the order implies the ascending order of phases
		or progression in this activity.
		*/
    phases: Milestones.DestinyMilestoneActivityPhase[];
  }

  /**
	If a Milestone has one or more Vendors that are relevant to it, this will contain information about
	that vendor that you can choose to show.
	*/
  export interface DestinyMilestoneVendor {
    /**
		The hash identifier of the Vendor related to this Milestone.  You can show useful things
		from this, such as thier Faction icon or whatever you might care about.
		*/
    vendorHash: number;

    /**
		If this vendor is featuring a specific item for this event, this will be the hash identifier
		of that item.  I'm taking bets now on how long we go before this needs to be a list or
		some other, more complex representation instead and I deprecate this too.
		I'm going to go with 5 months.  Calling it now, 2017-09-14 at 9:46pm PST.
		*/
    previewItemHash?: number;
  }

  /**
	Represents a category of "summary" rewards that can be earned for the Milestone regardless of
	specific quest rewards that can be earned.
	*/
  export interface DestinyMilestoneRewardCategory {
    /**
		Look up the relevant DestinyMilestoneDefinition, and then use rewardCategoryHash to look up the
		category info in DestinyMilestoneDefinition.rewards.
		*/
    rewardCategoryHash: number;

    /**
		The individual reward entries for this category, and their status.
		*/
    entries: Milestones.DestinyMilestoneRewardEntry[];
  }

  /**
	The character-specific data for a milestone's reward entry.  See DestinyMilestoneDefinition for
	more information about Reward Entries.
	*/
  export interface DestinyMilestoneRewardEntry {
    /**
		The identifier for the reward entry in question.  It is important to look up the related
		DestinyMilestoneRewardEntryDefinition to get the static details about the reward, which
		you can do by looking up the milestone's DestinyMilestoneDefinition and examining the
		DestinyMilestoneDefinition.rewards[rewardCategoryHash].rewardEntries[rewardEntryHash] data.
		*/
    rewardEntryHash: number;

    /**
		If TRUE, the player has earned this reward.
		*/
    earned: boolean;

    /**
		If TRUE, the player has redeemed/picked up/obtained this reward.
		Feel free to alias this to "gotTheShinyBauble" in your own codebase.
		*/
    redeemed: boolean;
  }

  /**
	Represents localized, extended content related to Milestones.
	This is intentionally returned by a separate endpoint and not with Character-level Milestone data
	because we do not put localized data into standard Destiny responses, both for brevity of response
	and for caching purposes.  If you really need this data, hit the Milestone Content endpoint.
	*/
  export interface DestinyMilestoneContent {
    /**
		The "About this Milestone" text from the Firehose.
		*/
    about: string;

    /**
		The Current Status of the Milestone, as driven by the Firehose.
		*/
    status: string;

    /**
		A list of tips, provided by the Firehose.
		*/
    tips: string[];

    /**
		If DPS has defined items related to this Milestone, they can categorize those items in the Firehose.
		That data will then be returned as item categories here.
		*/
    itemCategories: Milestones.DestinyMilestoneContentItemCategory[];
  }

  /**
	Part of our dynamic, localized Milestone content is arbitrary categories of items.
	These are built in our content management system, and thus aren't the same as programmatically
	generated rewards.
	*/
  export interface DestinyMilestoneContentItemCategory {
    title: string;

    itemHashes: number[];
  }

  /**
	Information about milestones, presented in a character state-agnostic manner.
	Combine this data with DestinyMilestoneDefinition to get a full picture of the milestone, which
	is basically a checklist of things to do in the game.  Think of this as GetPublicAdvisors 3.0, for 
	those who used the Destiny 1 API.
	*/
  export interface DestinyPublicMilestone {
    /**
		The hash identifier for the milestone.  Use it to look up the DestinyMilestoneDefinition for
		static data about the Milestone.
		*/
    milestoneHash: number;

    /**
		A milestone not need have even a single quest, but if there are active quests they will be returned here.
		*/
    availableQuests: Milestones.DestinyPublicMilestoneQuest[];

    activities: Milestones.DestinyPublicMilestoneChallengeActivity[];

    /**
		Sometimes milestones - or activities active in milestones - will have relevant vendors.
		These are the vendors that are currently relevant.
		
		Deprecated, already, for the sake of the new "vendors" property that has more data.
		What was I thinking.
		*/
    vendorHashes: number[];

    /**
		This is why we can't have nice things.  This is the ordered list of vendors to be shown that
		relate to this milestone, potentially along with other interesting data.
		*/
    vendors: Milestones.DestinyPublicMilestoneVendor[];

    /**
		If known, this is the date when the Milestone started/became active.
		*/
    startDate?: string;

    /**
		If known, this is the date when the Milestone will expire/recycle/end.
		*/
    endDate?: string;

    /**
		Used for ordering milestones in a display to match how we order them in BNet.  May pull from static data,
		or possibly in the future from dynamic information.
		*/
    order: number;
  }

  export interface DestinyPublicMilestoneQuest {
    /**
		Quests are defined as Items in content.  As such, this is the hash identifier 
		of the DestinyInventoryItemDefinition that represents this quest.  It will have pointers to all of the steps
		in the quest, and display information for the quest (title, description, icon etc)
		Individual steps will be referred to in the Quest item's DestinyInventoryItemDefinition.setData
		property, and themselves are Items with their own renderable data.
		*/
    questItemHash: number;

    /**
		A milestone need not have an active activity, but if there is one it will be returned here,
		along with any variant and additional information.
		*/
    activity: Milestones.DestinyPublicMilestoneActivity;

    /**
		For the given quest there could be 0-to-Many challenges: mini quests
		that you can perform in the course of doing this quest, that may grant you rewards and benefits.
		*/
    challenges: Milestones.DestinyPublicMilestoneChallenge[];
  }

  /**
	A milestone may have one or more conceptual Activities associated with it, and each of those conceptual
	activities could have a variety of variants, modes, tiers, what-have-you.
	Our attempts to determine what qualifies as a conceptual activity are, unfortunately, janky.  So if
	you see missing modes or modes that don't seem appropriate to you, let us know and I'll buy you a beer
	if we ever meet up in person.
	*/
  export interface DestinyPublicMilestoneActivity {
    /**
		The hash identifier of the activity that's been chosen to be considered the canonical 
		"conceptual" activity definition.  This may have many variants, defined herein.
		*/
    activityHash: number;

    /**
		The activity may have 0-to-many modifiers: if it does, this will contain the hashes
		to the DestinyActivityModifierDefinition that defines the modifier being applied.
		*/
    modifierHashes: number[];

    /**
		Every relevant variation of this conceptual activity, including the conceptual activity itself,
		have variants defined here.
		*/
    variants: Milestones.DestinyPublicMilestoneActivityVariant[];

    /**
		The hash identifier of the most specific Activity Mode under which this activity is played.  This is useful for situations
		where the activity in question is - for instance - a PVP map, but it's not clear what mode the PVP map is being
		played under.  If it's a playlist, this will be less specific: but hopefully useful in some way.
		*/
    activityModeHash?: number;

    /**
		The enumeration equivalent of the most specific Activity Mode under which this activity is played.
		*/
    activityModeType?: Globals.DestinyActivityModeType;
  }

  /**
	Represents a variant of an activity that's relevant to a milestone.
	*/
  export interface DestinyPublicMilestoneActivityVariant {
    /**
		The hash identifier of this activity variant.  Examine the activity's definition in the Manifest database
		to determine what makes it a distinct variant.  Usually it will be difficulty level or whether or not it is a
		guided game variant of the activity, but theoretically it could be distinguished in any arbitrary way.
		*/
    activityHash: number;

    /**
		The hash identifier of the most specific Activity Mode under which this activity is played.  This is useful for situations
		where the activity in question is - for instance - a PVP map, but it's not clear what mode the PVP map is being
		played under.  If it's a playlist, this will be less specific: but hopefully useful in some way.
		*/
    activityModeHash?: number;

    /**
		The enumeration equivalent of the most specific Activity Mode under which this activity is played.
		*/
    activityModeType?: Globals.DestinyActivityModeType;
  }

  /**
	A Milestone can have many Challenges.  Challenges are just extra Objectives that provide
	a fun way to mix-up play and provide extra rewards.
	*/
  export interface DestinyPublicMilestoneChallenge {
    /**
		The objective for the Challenge, which should have human-readable data about what
		needs to be done to accomplish the objective.  Use this hash to look up the DestinyObjectiveDefinition.
		*/
    objectiveHash: number;

    /**
		IF the Objective is related to a specific Activity, this will be that activity's hash.
		Use it to look up the DestinyActivityDefinition for additional data to show.
		*/
    activityHash?: number;
  }

  export interface DestinyPublicMilestoneChallengeActivity {
    activityHash: number;

    challengeObjectiveHashes: number[];

    /**
		If the activity has modifiers, this will be the list of modifiers that all variants
		have in common.  Perform lookups against DestinyActivityModifierDefinition which defines the modifier 
		being applied to get at the modifier data.
		
		Note that, in the DestiyActivityDefinition, you will see many more modifiers than this
		being referred to: those are all *possible* modifiers for the activity, not the active ones.
		Use only the active ones to match what's really live.
		*/
    modifierHashes: number[];

    /**
		If returned, this is the index into the DestinyActivityDefinition's "loadouts" property,
		indicating the currently active loadout requirements.
		*/
    loadoutRequirementIndex?: number;

    /**
		The ordered list of phases for this activity, if any.
		Note that we have no human readable info for phases, nor any entities to relate them to: relating these hashes
		to something human readable is up to you unfortunately.
		*/
    phaseHashes: number[];

    /**
		The set of activity options for this activity, keyed by an identifier that's unique for this activity
		(not guaranteed to be unique between or across all activities, though should be unique for every *variant* of a
		given *conceptual* activity: for instance, the original D2 Raid has many variant DestinyActivityDefinitions.  While
		other activities could potentially have the same option hashes, for any given D2 base Raid variant the hash will be unique).
		
		As a concrete example of this data, the hashes you get for Raids will correspond to the currently active "Challenge Mode".
		
		We have no human readable information for this data, so it's up to you if you want to associate it with such info to show it.
		*/
    booleanActivityOptions: { [key: number]: boolean };
  }

  export interface DestinyPublicMilestoneVendor {
    /**
		The hash identifier of the Vendor related to this Milestone.  You can show useful things
		from this, such as thier Faction icon or whatever you might care about.
		*/
    vendorHash: number;

    /**
		If this vendor is featuring a specific item for this event, this will be the hash identifier
		of that item.  I'm taking bets now on how long we go before this needs to be a list or
		some other, more complex representation instead and I deprecate this too.
		I'm going to go with 5 months.  Calling it now, 2017-09-14 at 9:46pm PST.
		*/
    previewItemHash?: number;
  }

  /**
	Milestones are an in-game concept where they're attempting to tell you what you can do next in-game.
	
	If that sounds a lot like Advisors in Destiny 1, it is!  So we threw out Advisors in the Destiny 2
	API and tacked all of the data we would have put on Advisors onto Milestones instead.
	
	Each Milestone represents something going on in the game right now:
	
	- A "ritual activity" you can perform, like nightfall
	
	- A "special event" that may have activities related to it, like Taco Tuesday (there's no Taco Tuesday in Destiny 2)
	
	- A checklist you can fulfill, like helping your Clan complete all of its weekly objectives
	
	- A tutorial quest you can play through, like the introduction to the Crucible.
	
	Most of these milestones appear in game as well.  Some of them are BNet only, because we're so extra.  You're welcome.
	
	There are some important caveats to understand about how we currently render Milestones and their deficiencies.  The game
	currently doesn't have any content that actually tells you oughtright *what* the Milestone is: that is to say, what you'll
	be doing.  The best we get is either a description of the overall Milestone, or of the Quest that the Milestone is having
	you partake in: which is usually something that assumes you already know what it's talking about, like "Complete 5 Challenges".
	5 Challenges for what?  What's a challenge?  These are not questions that the Milestone data will answer for you unfortunately.
	
	This isn't great, and in the future I'd like to add some custom text to give you more contextual information to pass on to
	your users.  But for now, you can do what we do to render what little display info we do have:
	
	Start by looking at the currently active quest (ideally, you've fetched DestinyMilestone or DestinyPublicMilestone data
	from the API, so you know the currently active quest for the Milestone in question).  Look up the Quests property in the
	Milestone Definition, and check if it has display properties.  If it does, show that as the description of the Milestone.
	If it doesn't, fall back on the Milestone's description.
	
	This approach will let you avoid, whenever possible, the even less useful (and sometimes nonexistant) milestone-level names
	and descriptions.
	*/
  export interface DestinyMilestoneDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A hint to the UI to indicate what to show as the display properties for this Milestone when
		showing "Live" milestone data.  Feel free to show more than this if desired: this hint is
		meant to simplify our own UI, but it may prove useful to you as well.
		*/
    displayPreference: Globals.DestinyMilestoneDisplayPreference;

    /**
		A custom image someone made just for the milestone.  Isn't that special?
		*/
    image: string;

    /**
		An enumeration listing one of the possible types of milestones.  Check out the
		DestinyMilestoneType enum for more info!
		*/
    milestoneType: Globals.DestinyMilestoneType;

    /**
		If True, then the Milestone has been integrated with BNet's recruiting feature.
		*/
    recruitable: boolean;

    /**
		If the milestone has a friendly identifier for association with other features - such as Recruiting - that
		identifier can be found here.  This is "friendly" in that it looks better in a URL than whatever
		the identifier for the Milestone actually is.
		*/
    friendlyName: string;

    /**
		If TRUE, this entry should be returned in the list of milestones for the "Explore Destiny"
		(i.e. new BNet homepage) features of Bungie.net (as long as the underlying event is active)
		Note that this is a property specifically used by BNet and the companion app for the "Live Events" feature
		of the front page/welcome view: it's not a reflection of what you see in-game.
		*/
    showInExplorer: boolean;

    /**
		Determines whether we'll show this Milestone in the user's personal Milestones list.
		*/
    showInMilestones: boolean;

    /**
		If TRUE, "Explore Destiny" (the front page of BNet and the companion app) prioritize using the activity image
		over any overriding Quest or Milestone image provided.  This unfortunate hack is brought to you by Trials of
		The Nine.
		*/
    explorePrioritizesActivityImage: boolean;

    /**
		A shortcut for clients - and the server - to understand whether we can predict the start and end dates
		for this event.  In practice, there are multiple ways that an event could have predictable date ranges, but not all
		events will be able to be predicted via any mechanism (for instance, events that are manually triggered on and off)
		*/
    hasPredictableDates: boolean;

    /**
		The full set of possible Quests that give the overview of the Milestone event/activity in question.
		Only one of these can be active at a time for a given Conceptual Milestone, but many of them may be
		"available" for the user to choose from. (for instance, with Milestones you can choose from the three
		available Quests, but only one can be active at a time)
		Keyed by the quest item.
		
		As of Forsaken (~September 2018), Quest-style Milestones are being removed for many types of activities.
		There will likely be further revisions to the Milestone concept in the future.
		*/
    quests: { [key: number]: Milestones.DestinyMilestoneQuestDefinition };

    /**
		If this milestone can provide rewards, this will define the categories
		into which the individual reward entries are placed.
		
		This is keyed by the Category's hash, which is only guaranteed to be unique within a given Milestone.
		*/
    rewards: {
      [key: number]: Milestones.DestinyMilestoneRewardCategoryDefinition;
    };

    /**
		If you're going to show Vendors for the Milestone, you can use this as a localized "header" for the section
		where you show that vendor data.  It'll provide a more context-relevant clue about what the vendor's role
		is in the Milestone.
		*/
    vendorsDisplayTitle: string;

    /**
		Sometimes, milestones will have rewards provided by Vendors.  This definition gives the information needed
		to understand which vendors are relevant, the order in which they should be returned if order matters,
		and the conditions under which the Vendor is relevant to the user.
		*/
    vendors: Milestones.DestinyMilestoneVendorDefinition[];

    /**
		Sometimes, milestones will have arbitrary values associated with them that are of interest to us
		or to third party developers.  This is the collection of those values' definitions, keyed by the identifier
		of the value and providing useful definition information such as localizable names and descriptions for the value.
		*/
    values: { [key: string]: Milestones.DestinyMilestoneValueDefinition };

    /**
		Some milestones are explicit objectives that you can see and interact with in the game.
		Some milestones are more conceptual, built by BNet to help advise you on activities and events
		that happen in-game but that aren't explicitly shown in game as Milestones.
		If this is TRUE, you can see this as a milestone in the game.
		If this is FALSE, it's an event or activity you can participate in, but you won't see it as
		a Milestone in the game's UI.
		*/
    isInGameMilestone: boolean;

    /**
		A Milestone can now be represented by one or more activities directly (without a backing Quest),
		and that activity can have many challenges, modifiers, and  related to it.
		*/
    activities: Milestones.DestinyMilestoneChallengeActivityDefinition[];

    defaultOrder: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Any data we need to figure out whether this Quest Item is the currently active one for the conceptual Milestone.
	Even just typing this description, I already regret it.
	*/
  export interface DestinyMilestoneQuestDefinition {
    /**
		The item representing this Milestone quest.  Use this hash to look up the DestinyInventoryItemDefinition
		for the quest to find its steps and human readable data.
		*/
    questItemHash: number;

    /**
		The individual quests may have different definitions from the overall milestone: if there's a specific active
		quest, use these displayProperties instead of that of the overall DestinyMilestoneDefinition.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If populated, this image can be shown instead of the generic milestone's image when this quest is live,
		or it can be used to show a background image for the quest itself that differs from that of the Activity
		or the Milestone.
		*/
    overrideImage: string;

    /**
		The rewards you will get for completing this quest, as best as we could extract them from
		our data.  Sometimes, it'll be a decent amount of data.  Sometimes, it's going to be sucky.  Sorry.
		*/
    questRewards: Milestones.DestinyMilestoneQuestRewardsDefinition;

    /**
		The full set of all possible "conceptual activities" that are related to this Milestone.
		Tiers or alternative modes of play within these conceptual activities will be defined as sub-entities.
		Keyed by the Conceptual Activity Hash.  Use the key to look up DestinyActivityDefinition.
		*/
    activities: {
      [key: number]: Milestones.DestinyMilestoneActivityDefinition;
    };

    /**
		Sometimes, a Milestone's quest is related to an entire Destination rather than a specific activity.
		In that situation, this will be the hash of that Destination.
		Hotspots are currently the only Milestones that expose this data, but that does not preclude this data
		from being returned for other Milestones in the future.
		*/
    destinationHash?: number;
  }

  /**
	If rewards are given in a quest - as opposed to overall in the entire Milestone - there's way less
	to track.  We're going to simplify this contract as a result.  However, this also gives us the
	opportunity to potentially put more than just item information into the reward data if we're able
	to mine it out in the future.  Remember this if you come back and ask "why are quest reward items
	nested inside of their own class?"
	*/
  export interface DestinyMilestoneQuestRewardsDefinition {
    /**
		The items that represent your reward for completing the quest.
		
		Be warned, these could be "dummy" items: items that are only used to
		render a good-looking in-game tooltip, but aren't the actual items themselves.
		
		For instance, when experience is given there's often a dummy item representing "experience",
		with quantity being the amount of experience you got.  We don't have a programmatic association
		between those and whatever Progression is actually getting that experience... yet.
		*/
    items: Milestones.DestinyMilestoneQuestRewardItem[];
  }

  /**
	A subclass of DestinyItemQuantity, that provides not just the item and its quantity
	but also information that BNet can - at some point - use internally to provide
	more robust runtime information about the item's qualities.
	
	If you want it, please ask!  We're just out of time to wire it up right now.
	Or a clever person just may do it with our existing endpoints.
	*/
  export interface DestinyMilestoneQuestRewardItem {
    /**
		The quest reward item *may* be associated with a vendor.  If so,
		this is that vendor.  Use this hash to look up the DestinyVendorDefinition.
		*/
    vendorHash?: number;

    /**
		The quest reward item *may* be associated with a vendor.  If so,
		this is the index of the item being sold, which we can use at runtime
		to find instanced item information for the reward item.
		*/
    vendorItemIndex?: number;

    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;
  }

  /**
	Milestones can have associated activities which provide additional information about the context, challenges, modifiers, state etc...
	related to this Milestone.  
	
	Information we need to be able to return that data is defined here, along with Tier data to establish
	a relationship between a conceptual Activity and its difficulty levels and variants.
	*/
  export interface DestinyMilestoneActivityDefinition {
    /**
		The "Conceptual" activity hash.  Basically, we picked the lowest level activity
		and are treating it as the canonical definition of the activity for rendering purposes.
		
		If you care about the specific difficulty modes and variations, use the activities under
		"Variants".
		*/
    conceptualActivityHash: number;

    /**
		A milestone-referenced activity can have many variants, such as Tiers or alternative modes of play.
		
		Even if there is only a single variant, the details for these are represented within as a variant definition.
		
		It is assumed that, if this DestinyMilestoneActivityDefinition is active, then all variants should be active.
		
		If a Milestone could ever split the variants' active status conditionally, they should all have their own 
		DestinyMilestoneActivityDefinition instead!  The potential duplication will be worth it for the obviousness of processing
		and use.
		*/
    variants: {
      [key: number]: Milestones.DestinyMilestoneActivityVariantDefinition;
    };
  }

  /**
	Represents a variant on an activity for a Milestone: a specific difficulty tier, or a specific activity variant for example.
	
	These will often have more specific details, such as an associated Guided Game, progression steps, tier-specific rewards,
	and custom values.
	*/
  export interface DestinyMilestoneActivityVariantDefinition {
    /**
		The hash to use for looking up the variant Activity's definition (DestinyActivityDefinition),
		where you can find its distinguishing characteristics such as difficulty level and recommended
		light level.  
		
		Frequently, that will be the only distinguishing characteristics in practice, which
		is somewhat of a bummer.
		*/
    activityHash: number;

    /**
		If you care to do so, render the variants in the order prescribed by this value.
		
		When you combine live Milestone data with the definition, the order becomes more useful
		because you'll be cross-referencing between the definition and live data.
		*/
    order: number;
  }

  /**
	The definition of a category of rewards, that contains many individual rewards.
	*/
  export interface DestinyMilestoneRewardCategoryDefinition {
    /**
		Identifies the reward category.  Only guaranteed unique within this specific component!
		*/
    categoryHash: number;

    /**
		The string identifier for the category, if you want to use it for some end.  Guaranteed unique
		within the specific component.
		*/
    categoryIdentifier: string;

    /**
		Hopefully this is obvious by now.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If this milestone can provide rewards, this will define the sets
		of rewards that can be earned, the conditions under which they can be acquired,
		internal data that we'll use at runtime to determine whether you've
		already earned or redeemed this set of rewards,
		and the category that this reward should be placed under.
		*/
    rewardEntries: {
      [key: number]: Milestones.DestinyMilestoneRewardEntryDefinition;
    };

    /**
		If you want to use BNet's recommended order for rendering categories programmatically,
		use this value and compare it to other categories to determine the order in which
		they should be rendered.  I don't feel great about putting this here, I won't lie.
		*/
    order: number;
  }

  /**
	The definition of a specific reward, which may be contained in a category of rewards and
	that has optional information about how it is obtained.
	*/
  export interface DestinyMilestoneRewardEntryDefinition {
    /**
		The identifier for this reward entry.  Runtime data will refer to reward entries
		by this hash.  Only guaranteed unique within the specific Milestone.
		*/
    rewardEntryHash: number;

    /**
		The string identifier, if you care about it.  Only guaranteed unique within the specific Milestone.
		*/
    rewardEntryIdentifier: string;

    /**
		The items you will get as rewards, and how much of it you'll get.
		*/
    items: World.DestinyItemQuantity[];

    /**
		If this reward is redeemed at a Vendor, this is the hash of the Vendor to go to in order
		to redeem the reward.  Use this hash to look up the DestinyVendorDefinition.
		*/
    vendorHash?: number;

    /**
		For us to bother returning this info, we should be able to return some kind of information
		about why these rewards are grouped together.  This is ideally that information.
		Look at how confident I am that this will always remain true.
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		If you want to follow BNet's ordering of these rewards, use this number within a given category
		to order the rewards.  Yeah, I know.  I feel dirty too.
		*/
    order: number;
  }

  /**
	If the Milestone or a component has vendors whose inventories could/should be displayed that are relevant to it,
	this will return the vendor in question.  
	
	It also contains information we need to determine whether that vendor
	is actually relevant at the moment, given the user's current state.
	*/
  export interface DestinyMilestoneVendorDefinition {
    /**
		The hash of the vendor whose wares should be shown as associated with the Milestone.
		*/
    vendorHash: number;
  }

  /**
	The definition for information related to a key/value pair that is relevant for a particular Milestone or
	component within the Milestone.  
	
	This lets us more flexibly pass up information that's useful to someone,
	even if it's not necessarily us.
	*/
  export interface DestinyMilestoneValueDefinition {
    key: string;

    displayProperties: Common.DestinyDisplayPropertiesDefinition;
  }

  export interface DestinyMilestoneChallengeActivityDefinition {
    /**
		The activity for which this challenge is active.
		*/
    activityHash: number;

    challenges: Milestones.DestinyMilestoneChallengeDefinition[];

    /**
		If the activity and its challenge is visible on any of these nodes, it will be returned.
		*/
    activityGraphNodes: Milestones.DestinyMilestoneChallengeActivityGraphNodeEntry[];

    /**
		Phases related to this activity, if there are any.
		
		These will be listed in the order in which they will appear in the actual activity.
		*/
    phases: Milestones.DestinyMilestoneChallengeActivityPhase[];
  }

  export interface DestinyMilestoneChallengeDefinition {
    /**
		The challenge related to this milestone.
		*/
    challengeObjectiveHash: number;
  }

  export interface DestinyMilestoneChallengeActivityGraphNodeEntry {
    activityGraphHash: number;

    activityGraphNodeHash: number;
  }

  export interface DestinyMilestoneChallengeActivityPhase {
    /**
		The hash identifier of the activity's phase.
		*/
    phaseHash: number;
  }
}

export declare namespace Challenges {
  /**
	Represents the status and other related information for a challenge that is - or was - available
	to a player.  
	
	A challenge is a bonus objective, generally tacked onto Quests or Activities, that
	provide additional variations on play.
	*/
  export interface DestinyChallengeStatus {
    /**
		The progress - including completion status - of the active challenge.
		*/
    objective: Quests.DestinyObjectiveProgress;
  }
}

export declare namespace Perks {
  /**
	The list of perks to display in an item tooltip - and whether or not they have been activated.
	
	Perks apply a variety of effects to a character, and are generally either intrinsic to the item
	or provided in activated talent nodes or sockets.
	*/
  export interface DestinyPerkReference {
    /**
		The hash identifier for the perk, which can be used to look up DestinySandboxPerkDefinition if it exists.
		Be warned, perks frequently do not have user-viewable information.  You should examine whether you actually
		found a name/description in the perk's definition before you show it to the user.
		*/
    perkHash: number;

    /**
		The icon for the perk.
		*/
    iconPath: string;

    /**
		Whether this perk is currently active.  (We may return perks that you have not actually activated yet:
		these represent perks that you should show in the item's tooltip, but that the user has not yet
		activated.)
		*/
    isActive: boolean;

    /**
		Some perks provide benefits, but aren't visible in the UI.  This value will let you know if this is
		perk should be shown in your UI.
		*/
    visible: boolean;
  }
}

export declare namespace Character {
  /**
	Raw data about the customization options chosen for a character's face and appearance.
	
	You can look up the relevant class/race/gender combo in DestinyCharacterCustomizationOptionDefinition
	for the character, and then look up these values within the CustomizationOptions found
	to pull some data about their choices.  Warning: not all of that data is meaningful.  Some data has
	useful icons.  Others have nothing, and are only meant for 3D rendering purposes (which we sadly
	do not expose yet)
	*/
  export interface DestinyCharacterCustomization {
    personality: number;

    face: number;

    skinColor: number;

    lipColor: number;

    eyeColor: number;

    hairColors: number[];

    featureColors: number[];

    decalColor: number;

    wearHelmet: boolean;

    hairIndex: number;

    featureIndex: number;

    decalIndex: number;
  }

  /**
	A minimal view of a character's equipped items, for the purpose of rendering a summary
	screen or showing the character in 3D.
	*/
  export interface DestinyCharacterPeerView {
    equipment: Character.DestinyItemPeerView[];
  }

  /**
	Bare minimum summary information for an item, for the sake of 3D rendering the item.
	*/
  export interface DestinyItemPeerView {
    /**
		The hash identifier of the item in question.  Use it to look up the DestinyInventoryItemDefinition of the item
		for static rendering data.
		*/
    itemHash: number;

    /**
		The list of dyes that have been applied to this item.
		*/
    dyes: World.DyeReference[];
  }
}

export declare namespace FireteamFinder {
  export interface DestinyActivityInteractableReference {
    activityInteractableHash: number;

    activityInteractableElementIndex: number;
  }

  export interface DestinyFireteamFinderApplyToListingResponse {
    isApplied: boolean;

    application: FireteamFinder.DestinyFireteamFinderApplication;

    listing: FireteamFinder.DestinyFireteamFinderListing;
  }

  export interface DestinyFireteamFinderApplication {
    applicationId: string;

    revision: number;

    state: Globals.DestinyFireteamFinderApplicationState;

    submitterId: FireteamFinder.DestinyFireteamFinderPlayerId;

    referralToken: string;

    applicantSet: FireteamFinder.DestinyFireteamFinderApplicantSet;

    applicationType: Globals.DestinyFireteamFinderApplicationType;

    listingId: string;

    createdDateTime: string;
  }

  export interface DestinyFireteamFinderPlayerId {
    membershipId: string;

    membershipType: Globals.BungieMembershipType;

    characterId: string;
  }

  export interface DestinyFireteamFinderApplicantSet {
    applicants: FireteamFinder.DestinyFireteamFinderApplicant[];
  }

  export interface DestinyFireteamFinderApplicant {
    playerId: FireteamFinder.DestinyFireteamFinderPlayerId;
  }

  export interface DestinyFireteamFinderListing {
    listingId: string;

    revision: number;

    ownerId: FireteamFinder.DestinyFireteamFinderPlayerId;

    settings: FireteamFinder.DestinyFireteamFinderLobbySettings;

    availableSlots: number;

    lobbyId: string;

    lobbyState: Globals.DestinyFireteamFinderLobbyState;

    createdDateTime: string;
  }

  export interface DestinyFireteamFinderLobbySettings {
    maxPlayerCount: number;

    onlinePlayersOnly: boolean;

    privacyScope: Globals.DestinyFireteamFinderLobbyPrivacyScope;

    scheduledDateTime: string;

    clanId: string;

    listingValues: FireteamFinder.DestinyFireteamFinderListingValue[];

    activityGraphHash: number;

    activityHash: number;
  }

  export interface DestinyFireteamFinderListingValue {
    valueType: number;

    values: number[];
  }

  export interface DestinyFireteamFinderBulkGetListingStatusResponse {
    listingStatus: FireteamFinder.DestinyFireteamFinderListingStatus[];
  }

  export interface DestinyFireteamFinderListingStatus {
    listingId: string;

    listingRevision: number;

    availableSlots: number;
  }

  export interface DestinyFireteamFinderBulkGetListingStatusRequest {
    lobbyListingReferences: FireteamFinder.DestinyFireteamFinderLobbyListingReference[];
  }

  export interface DestinyFireteamFinderLobbyListingReference {
    lobbyId: string;

    listingId: string;
  }

  export interface DestinyFireteamFinderGetApplicationResponse {
    applicationId: string;

    revision: number;

    state: Globals.DestinyFireteamFinderApplicationState;

    submitterId: FireteamFinder.DestinyFireteamFinderPlayerId;

    referralToken: string;

    applicantSet: FireteamFinder.DestinyFireteamFinderApplicantSet;

    applicationType: Globals.DestinyFireteamFinderApplicationType;

    listingId: string;

    createdDateTime: string;
  }

  export interface DestinyFireteamFinderGetListingApplicationsResponse {
    applications: FireteamFinder.DestinyFireteamFinderApplication[];

    pageSize: number;

    nextPageToken: string;
  }

  export interface DestinyFireteamFinderLobbyResponse {
    lobbyId: string;

    revision: number;

    state: Globals.DestinyFireteamFinderLobbyState;

    owner: FireteamFinder.DestinyFireteamFinderPlayerId;

    settings: FireteamFinder.DestinyFireteamFinderLobbySettings;

    players: FireteamFinder.DestinyFireteamFinderLobbyPlayer[];

    listingId: string;

    createdDateTime: string;
  }

  export interface DestinyFireteamFinderLobbyPlayer {
    playerId: FireteamFinder.DestinyFireteamFinderPlayerId;

    referralToken: string;

    state: Globals.DestinyFireteamFinderPlayerReadinessState;

    offerId: string;
  }

  export interface DestinyFireteamFinderGetPlayerLobbiesResponse {
    /**
		All available lobbies that this player has created or is a member of.
		*/
    lobbies: FireteamFinder.DestinyFireteamFinderLobbyResponse[];

    /**
		The number of results requested.
		*/
    pageSize: number;

    /**
		A string token required to get the next page of results. This will be null or empty if there are no more results.
		*/
    nextPageToken: string;
  }

  export interface DestinyFireteamFinderGetPlayerApplicationsResponse {
    /**
		All applications that this player has sent.
		*/
    applications: FireteamFinder.DestinyFireteamFinderApplication[];

    /**
		String token to request next page of results.
		*/
    nextPageToken: string;
  }

  export interface DestinyFireteamFinderGetPlayerOffersResponse {
    /**
		All offers that this player has recieved.
		*/
    offers: FireteamFinder.DestinyFireteamFinderOffer[];
  }

  export interface DestinyFireteamFinderOffer {
    offerId: string;

    lobbyId: string;

    revision: number;

    state: Globals.DestinyFireteamFinderOfferState;

    targetId: FireteamFinder.DestinyFireteamFinderPlayerId;

    applicationId: string;

    createdDateTime: string;
  }

  export interface DestinyFireteamFinderGetCharacterActivityAccessResponse {
    /**
		A map of fireteam finder activity graph hashes to visibility and availability states.
		*/
    fireteamFinderActivityGraphStates: {
      [key: number]: FireteamFinder.DestinyFireteamFinderActivityGraphState;
    };
  }

  export interface DestinyFireteamFinderActivityGraphState {
    /**
		Indicates if this fireteam finder activity graph node is visible for this character.
		*/
    isVisible: boolean;

    /**
		Indicates if this fireteam finder activity graph node is available to select for this character.
		*/
    isAvailable: boolean;
  }

  export interface DestinyFireteamFinderGetLobbyOffersResponse {
    offers: FireteamFinder.DestinyFireteamFinderOffer[];

    pageToken: string;
  }

  export interface DestinyFireteamFinderHostLobbyResponse {
    lobbyId: string;

    listingId: string;

    applicationId: string;

    offerId: string;
  }

  export interface DestinyFireteamFinderHostLobbyRequest {
    maxPlayerCount: number;

    onlinePlayersOnly: boolean;

    privacyScope: Globals.DestinyFireteamFinderLobbyPrivacyScope;

    scheduledDateTime: string;

    clanId: string;

    listingValues: FireteamFinder.DestinyFireteamFinderListingValue[];

    activityGraphHash: number;

    activityHash: number;
  }

  export interface DestinyFireteamFinderJoinLobbyRequest {
    lobbyId: string;

    offerId: string;
  }

  export interface DestinyFireteamFinderKickPlayerRequest {
    targetMembershipType: Globals.BungieMembershipType;

    targetCharacterId: string;
  }

  export interface DestinyFireteamFinderRespondToApplicationResponse {
    applicationId: string;

    applicationRevision: number;
  }

  export interface DestinyFireteamFinderRespondToApplicationRequest {
    accepted: boolean;
  }

  export interface DestinyFireteamFinderRespondToAuthenticationResponse {
    applicationId: string;

    applicationRevision: number;

    offer: FireteamFinder.DestinyFireteamFinderOffer;

    listing: FireteamFinder.DestinyFireteamFinderListing;
  }

  export interface DestinyFireteamFinderRespondToAuthenticationRequest {
    confirmed: boolean;
  }

  export interface DestinyFireteamFinderRespondToOfferResponse {
    offerId: string;

    revision: number;

    state: Globals.DestinyFireteamFinderOfferState;
  }

  export interface DestinyFireteamFinderRespondToOfferRequest {
    accepted: boolean;
  }

  export interface DestinyFireteamFinderSearchListingsByClanResponse {
    listings: FireteamFinder.DestinyFireteamFinderListing[];

    pageToken: string;
  }

  export interface DestinyFireteamFinderSearchListingsByClanRequest {
    pageSize: number;

    pageToken: string;

    lobbyState: Globals.DestinyFireteamFinderLobbyState;
  }

  export interface DestinyFireteamFinderSearchListingsByFiltersResponse {
    listings: FireteamFinder.DestinyFireteamFinderListing[];

    pageToken: string;
  }

  export interface DestinyFireteamFinderSearchListingsByFiltersRequest {
    filters: FireteamFinder.DestinyFireteamFinderListingFilter[];

    pageSize: number;

    pageToken: string;

    lobbyState: Globals.DestinyFireteamFinderLobbyState;
  }

  export interface DestinyFireteamFinderListingFilter {
    listingValue: FireteamFinder.DestinyFireteamFinderListingValue;

    rangeType: Globals.DestinyFireteamFinderListingFilterRangeType;

    matchType: Globals.DestinyFireteamFinderListingFilterMatchType;
  }

  export interface DestinyFireteamFinderUpdateLobbySettingsResponse {
    updatedLobby: FireteamFinder.DestinyFireteamFinderLobbyResponse;

    updatedListing: FireteamFinder.DestinyFireteamFinderListing;
  }

  export interface DestinyFireteamFinderUpdateLobbySettingsRequest {
    updatedSettings: FireteamFinder.DestinyFireteamFinderLobbySettings;
  }
}

export declare namespace Sets {
  export interface DestinyBaseItemComponentSetUInt32 {
    objectives: Components.DictionaryComponentResponseUInt32DestinyItemObjectivesComponent;

    perks: Components.DictionaryComponentResponseUInt32DestinyItemPerksComponent;
  }

  export interface DestinyItemComponentSetInt64 {
    instances: Components.DictionaryComponentResponseInt64DestinyItemInstanceComponent;

    renderData: Components.DictionaryComponentResponseInt64DestinyItemRenderComponent;

    stats: Components.DictionaryComponentResponseInt64DestinyItemStatsComponent;

    sockets: Components.DictionaryComponentResponseInt64DestinyItemSocketsComponent;

    reusablePlugs: Components.DictionaryComponentResponseInt64DestinyItemReusablePlugsComponent;

    plugObjectives: Components.DictionaryComponentResponseInt64DestinyItemPlugObjectivesComponent;

    talentGrids: Components.DictionaryComponentResponseInt64DestinyItemTalentGridComponent;

    plugStates: Components.DictionaryComponentResponseUInt32DestinyItemPlugComponent;

    objectives: Components.DictionaryComponentResponseInt64DestinyItemObjectivesComponent;

    perks: Components.DictionaryComponentResponseInt64DestinyItemPerksComponent;
  }

  export interface DestinyVendorItemComponentSetInt32 {
    itemComponents: Components.DictionaryComponentResponseInt32DestinyItemComponent;

    instances: Components.DictionaryComponentResponseInt32DestinyItemInstanceComponent;

    renderData: Components.DictionaryComponentResponseInt32DestinyItemRenderComponent;

    stats: Components.DictionaryComponentResponseInt32DestinyItemStatsComponent;

    sockets: Components.DictionaryComponentResponseInt32DestinyItemSocketsComponent;

    reusablePlugs: Components.DictionaryComponentResponseInt32DestinyItemReusablePlugsComponent;

    plugObjectives: Components.DictionaryComponentResponseInt32DestinyItemPlugObjectivesComponent;

    talentGrids: Components.DictionaryComponentResponseInt32DestinyItemTalentGridComponent;

    plugStates: Components.DictionaryComponentResponseUInt32DestinyItemPlugComponent;

    objectives: Components.DictionaryComponentResponseInt32DestinyItemObjectivesComponent;

    perks: Components.DictionaryComponentResponseInt32DestinyItemPerksComponent;
  }

  export interface DestinyItemComponentSetUInt32 {
    instances: Components.DictionaryComponentResponseUInt32DestinyItemInstanceComponent;

    renderData: Components.DictionaryComponentResponseUInt32DestinyItemRenderComponent;

    stats: Components.DictionaryComponentResponseUInt32DestinyItemStatsComponent;

    sockets: Components.DictionaryComponentResponseUInt32DestinyItemSocketsComponent;

    reusablePlugs: Components.DictionaryComponentResponseUInt32DestinyItemReusablePlugsComponent;

    plugObjectives: Components.DictionaryComponentResponseUInt32DestinyItemPlugObjectivesComponent;

    talentGrids: Components.DictionaryComponentResponseUInt32DestinyItemTalentGridComponent;

    plugStates: Components.DictionaryComponentResponseUInt32DestinyItemPlugComponent;

    objectives: Components.DictionaryComponentResponseUInt32DestinyItemObjectivesComponent;

    perks: Components.DictionaryComponentResponseUInt32DestinyItemPerksComponent;
  }
}

export declare namespace Craftables {
  export interface DestinyCraftablesComponent {
    /**
		A map of craftable item hashes to craftable item state components.
		*/
    craftables: { [key: number]: Craftables.DestinyCraftableComponent };

    /**
		The hash for the root presentation node definition of craftable item categories.
		*/
    craftingRootNodeHash: number;
  }

  export interface DestinyCraftableComponent {
    visible: boolean;

    /**
		If the requirements are not met for crafting this item, these will index into the list of failure strings.
		*/
    failedRequirementIndexes: number[];

    /**
		Plug item state for the crafting sockets.
		*/
    sockets: Craftables.DestinyCraftableSocketComponent[];
  }

  export interface DestinyCraftableSocketComponent {
    plugSetHash: number;

    /**
		Unlock state for plugs in the socket plug set definition
		*/
    plugs: Craftables.DestinyCraftableSocketPlugComponent[];
  }

  export interface DestinyCraftableSocketPlugComponent {
    plugItemHash: number;

    /**
		Index into the unlock requirements to display failure descriptions
		*/
    failedRequirementIndexes: number[];
  }
}

export declare namespace ClanBanner {
  export interface ClanBannerSource {
    clanBannerDecals: { [key: number]: ClanBanner.ClanBannerDecal };

    clanBannerDecalPrimaryColors: { [key: number]: Utilities.PixelDataARGB };

    clanBannerDecalSecondaryColors: { [key: number]: Utilities.PixelDataARGB };

    clanBannerGonfalons: { [key: number]: string };

    clanBannerGonfalonColors: { [key: number]: Utilities.PixelDataARGB };

    clanBannerGonfalonDetails: { [key: number]: string };

    clanBannerGonfalonDetailColors: { [key: number]: Utilities.PixelDataARGB };

    clanBannerDecalsSquare: { [key: number]: ClanBanner.ClanBannerDecal };

    clanBannerGonfalonDetailsSquare: { [key: number]: string };
  }

  export interface ClanBannerDecal {
    identifier: string;

    foregroundPath: string;

    backgroundPath: string;
  }
}

export declare namespace Utilities {
  export interface PixelDataARGB {
    blue: number;

    green: number;

    red: number;

    alpha: number;
  }
}

export declare namespace Actions {
  /**
	Represents state that changed as a result of claiming a progression.
	
	 For now, this response object has no contents.  As needed and as the feature grows, we can add to this response object.
	*/
  export interface DestinyClaimProgressionRewardResult {}

  export interface DestinyClaimSeasonPassRewardActionRequest {
    /**
		The hash identifier of the Season for the reward being claimed.
		
		 The season must have ended in order for you to claim a reward from its season pass.
		*/
    seasonHash: number;

    /**
		The index into the rewardItems entry under the season's season pass progression that is being claimed.
		*/
    rewardIndex: number;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyPostmasterTransferRequest {
    itemReferenceHash: number;

    stackSize: number;

    itemId: string;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyItemActionRequest {
    /**
		The instance ID of the item for this action request.
		*/
    itemId: string;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyItemSetActionRequest {
    itemIds: string[];

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyLoadoutActionRequest {
    /**
		The index of the loadout for this action request.
		*/
    loadoutIndex: number;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyLoadoutUpdateActionRequest {
    colorHash?: number;

    iconHash?: number;

    nameHash?: number;

    loadoutIndex: number;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyItemStateRequest {
    state: boolean;

    itemId: string;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyInsertPlugsActionRequest {
    /**
		Action token provided by the AwaGetActionToken API call.
		*/
    actionToken: string;

    /**
		The instance ID of the item having a plug inserted.  Only instanced items can have sockets.
		*/
    itemInstanceId: string;

    /**
		The plugs being inserted.
		*/
    plug: Actions.DestinyInsertPlugsRequestEntry;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }

  /**
	Represents all of the data related to a single plug to be inserted.
	
	Note that, while you *can* point to a socket that represents infusion, you will receive an error
	if you attempt to do so.  Come on guys, let's play nice.
	*/
  export interface DestinyInsertPlugsRequestEntry {
    /**
		The index into the socket array, which identifies the specific socket being operated on.
		We also need to know the socketArrayType in order to uniquely identify the socket.
		
		Don't point to or try to insert a plug into an infusion socket.  It won't work.
		*/
    socketIndex: number;

    /**
		This property, combined with the socketIndex, tells us which socket we are referring to (since operations can be
		performed on both Intrinsic and "default" sockets, and they occupy different arrays in the Inventory Item Definition).
		I know, I know.  Don't give me that look.
		*/
    socketArrayType: Globals.DestinySocketArrayType;

    /**
		Plugs are never instanced (except in infusion).  So with the hash alone, we should be able to:
		1) Infer whether the player actually needs to have the item, or if it's a reusable plug
		2) Perform any operation needed to use the Plug, including removing the plug item and running reward sheets.
		*/
    plugItemHash: number;
  }

  export interface DestinyInsertPlugsFreeActionRequest {
    /**
		The plugs being inserted.
		*/
    plug: Actions.DestinyInsertPlugsRequestEntry;

    itemId: string;

    characterId: string;

    membershipType: Globals.BungieMembershipType;
  }
}

export declare namespace HistoricalStats {
  export interface DestinyPostGameCarnageReportData {
    /**
		Date and time for the activity.
		*/
    period: string;

    /**
		If this activity has "phases", this is the phase at which the activity was started.  This value is only
		valid for activities before the Beyond Light expansion shipped. Subsequent activities will not have a valid value here.
		*/
    startingPhaseIndex?: number;

    /**
		True if the activity was started from the beginning, if that information is available and the activity was played post Witch Queen release.
		*/
    activityWasStartedFromBeginning?: boolean;

    /**
		Details about the activity.
		*/
    activityDetails: HistoricalStats.DestinyHistoricalStatsActivity;

    /**
		Collection of players and their data for this activity.
		*/
    entries: HistoricalStats.DestinyPostGameCarnageReportEntry[];

    /**
		Collection of stats for the player in this activity.
		*/
    teams: HistoricalStats.DestinyPostGameCarnageReportTeamEntry[];
  }

  /**
	Summary information about the activity that was played.
	*/
  export interface DestinyHistoricalStatsActivity {
    /**
		The unique hash identifier of the DestinyActivityDefinition that was played.
		If I had this to do over, it'd be named activityHash.  Too late now.
		*/
    referenceId: number;

    /**
		The unique hash identifier of the DestinyActivityDefinition that was played.
		*/
    directorActivityHash: number;

    /**
		The unique identifier for this *specific* match that was played.
		
		This value can be used to get additional data about this activity such as who else was playing
		via the GetPostGameCarnageReport endpoint.
		*/
    instanceId: string;

    /**
		Indicates the most specific game mode of the activity that we could find.
		*/
    mode: Globals.DestinyActivityModeType;

    /**
		The list of all Activity Modes to which this activity applies, including aggregates.
		This will let you see, for example, whether the activity was both Clash and part of the
		Trials of the Nine event.
		*/
    modes: Globals.DestinyActivityModeType[];

    /**
		Whether or not the match was a private match.
		*/
    isPrivate: boolean;

    /**
		The Membership Type indicating the platform on which this match was played.
		*/
    membershipType: Globals.BungieMembershipType;
  }

  export interface DestinyPostGameCarnageReportEntry {
    /**
		Standing of the player
		*/
    standing: number;

    /**
		Score of the player if available
		*/
    score: HistoricalStats.DestinyHistoricalStatsValue;

    /**
		Identity details of the player
		*/
    player: HistoricalStats.DestinyPlayer;

    /**
		ID of the player's character used in the activity.
		*/
    characterId: string;

    /**
		Collection of stats for the player in this activity.
		*/
    values: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };

    /**
		Extended data extracted from the activity blob.
		*/
    extended: HistoricalStats.DestinyPostGameCarnageReportExtendedData;
  }

  export interface DestinyHistoricalStatsValue {
    /**
		Unique ID for this stat
		*/
    statId: string;

    /**
		Basic stat value.
		*/
    basic: HistoricalStats.DestinyHistoricalStatsValuePair;

    /**
		Per game average for the statistic, if applicable
		*/
    pga: HistoricalStats.DestinyHistoricalStatsValuePair;

    /**
		Weighted value of the stat if a weight greater than 1 has been assigned.
		*/
    weighted: HistoricalStats.DestinyHistoricalStatsValuePair;

    /**
		When a stat represents the best, most, longest, fastest or some other personal best, the actual
		activity ID where that personal best was established is available on this property.
		*/
    activityId?: string;
  }

  export interface DestinyHistoricalStatsValuePair {
    /**
		Raw value of the statistic
		*/
    value: number;

    /**
		Localized formated version of the value.
		*/
    displayValue: string;
  }

  export interface DestinyPlayer {
    /**
		Details about the player as they are known in game (platform display name, Destiny emblem)
		*/
    destinyUserInfo: User.UserInfoCard;

    /**
		Class of the character if applicable and available.
		*/
    characterClass: string;

    classHash: number;

    raceHash: number;

    genderHash: number;

    /**
		Level of the character if available. Zero if it is not available.
		*/
    characterLevel: number;

    /**
		Light Level of the character if available. Zero if it is not available.
		*/
    lightLevel: number;

    /**
		Details about the player as they are known on BungieNet.  This will
		be undefined if the player has marked their credential private, or does not have
		a BungieNet account.
		*/
    bungieNetUserInfo: User.UserInfoCard;

    /**
		Current clan name for the player. This value may be null or an empty string if the user does not have a clan.
		*/
    clanName: string;

    /**
		Current clan tag for the player.  This value may be null or an empty string if the user does not have a clan.
		*/
    clanTag: string;

    /**
		If we know the emblem's hash, this can be used to look up the player's emblem at the time of a match when
		receiving PGCR data, or otherwise their currently equipped emblem (if we are able to obtain it).
		*/
    emblemHash: number;
  }

  export interface DestinyPostGameCarnageReportExtendedData {
    /**
		List of weapons and their perspective values.
		*/
    weapons: HistoricalStats.DestinyHistoricalWeaponStats[];

    /**
		Collection of stats for the player in this activity.
		*/
    values: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };
  }

  export interface DestinyHistoricalWeaponStats {
    /**
		The hash ID of the item definition that describes the weapon.
		*/
    referenceId: number;

    /**
		Collection of stats for the period.
		*/
    values: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };
  }

  export interface DestinyPostGameCarnageReportTeamEntry {
    /**
		Integer ID for the team.
		*/
    teamId: number;

    /**
		Team's standing relative to other teams.
		*/
    standing: HistoricalStats.DestinyHistoricalStatsValue;

    /**
		Score earned by the team
		*/
    score: HistoricalStats.DestinyHistoricalStatsValue;

    /**
		Alpha or Bravo
		*/
    teamName: string;
  }

  export interface DestinyLeaderboardResults {
    /**
		Indicate the membership ID of the account that is the focal point of
		the provided leaderboards.
		*/
    focusMembershipId?: string;

    /**
		Indicate the character ID of the character that is the focal point of
		the provided leaderboards. May be null, in which case any character
		from the focus membership can appear in the provided leaderboards.
		*/
    focusCharacterId?: string;

    Comparer: any;

    Count: number;

    Keys: any;

    Values: any;

    Item: { [key: string]: HistoricalStats.DestinyLeaderboard };
  }

  export interface DestinyLeaderboard {
    statId: string;

    entries: HistoricalStats.DestinyLeaderboardEntry[];
  }

  export interface DestinyLeaderboardEntry {
    /**
		Where this player ranks on the leaderboard.  A value of 1 is the top rank.
		*/
    rank: number;

    /**
		Identity details of the player
		*/
    player: HistoricalStats.DestinyPlayer;

    /**
		ID of the player's best character for the reported stat.
		*/
    characterId: string;

    /**
		Value of the stat for this player
		*/
    value: HistoricalStats.DestinyHistoricalStatsValue;
  }

  export interface DestinyClanAggregateStat {
    /**
		The id of the mode of stats (allPvp, allPvE, etc)
		*/
    mode: Globals.DestinyActivityModeType;

    /**
		The id of the stat
		*/
    statId: string;

    /**
		Value of the stat for this player
		*/
    value: HistoricalStats.DestinyHistoricalStatsValue;
  }

  export interface DestinyHistoricalStatsResults {
    Comparer: any;

    Count: number;

    Keys: any;

    Values: any;

    Item: HistoricalStats.DestinyHistoricalStatsByPeriod;
  }

  export interface DestinyHistoricalStatsByPeriod {
    allTime: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };

    allTimeTier1: {
      [key: string]: HistoricalStats.DestinyHistoricalStatsValue;
    };

    allTimeTier2: {
      [key: string]: HistoricalStats.DestinyHistoricalStatsValue;
    };

    allTimeTier3: {
      [key: string]: HistoricalStats.DestinyHistoricalStatsValue;
    };

    daily: HistoricalStats.DestinyHistoricalStatsPeriodGroup[];

    monthly: HistoricalStats.DestinyHistoricalStatsPeriodGroup[];
  }

  export interface DestinyHistoricalStatsPeriodGroup {
    /**
		Period for the group.  If the stat periodType is day, then this will have a specific day. If the type is monthly, then
		this value will be the first day of the applicable month. This value is not set when the periodType is 'all time'.
		*/
    period: string;

    /**
		If the period group is for a specific activity, this property will be set.
		*/
    activityDetails: HistoricalStats.DestinyHistoricalStatsActivity;

    /**
		Collection of stats for the period.
		*/
    values: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };
  }

  export interface DestinyHistoricalStatsAccountResult {
    mergedDeletedCharacters: HistoricalStats.DestinyHistoricalStatsWithMerged;

    mergedAllCharacters: HistoricalStats.DestinyHistoricalStatsWithMerged;

    characters: HistoricalStats.DestinyHistoricalStatsPerCharacter[];
  }

  export interface DestinyHistoricalStatsWithMerged {
    results: HistoricalStats.DestinyHistoricalStatsResults;

    merged: HistoricalStats.DestinyHistoricalStatsByPeriod;
  }

  export interface DestinyHistoricalStatsPerCharacter {
    characterId: string;

    deleted: boolean;

    results: HistoricalStats.DestinyHistoricalStatsResults;

    merged: HistoricalStats.DestinyHistoricalStatsByPeriod;
  }

  export interface DestinyActivityHistoryResults {
    /**
		List of activities, the most recent activity first.
		*/
    activities: HistoricalStats.DestinyHistoricalStatsPeriodGroup[];
  }

  export interface DestinyHistoricalWeaponStatsData {
    /**
		List of weapons and their perspective values.
		*/
    weapons: HistoricalStats.DestinyHistoricalWeaponStats[];
  }

  export interface DestinyAggregateActivityResults {
    /**
		List of all activities the player has participated in.
		*/
    activities: HistoricalStats.DestinyAggregateActivityStats[];
  }

  export interface DestinyAggregateActivityStats {
    /**
		Hash ID that can be looked up in the DestinyActivityTable.
		*/
    activityHash: number;

    /**
		Collection of stats for the player in this activity.
		*/
    values: { [key: string]: HistoricalStats.DestinyHistoricalStatsValue };
  }
}

export declare namespace Explorer {
  export interface DestinyExplorerItems {
    itemHashes: number[];

    totalResults: number;

    hasMore: boolean;

    query: Queries.PagedQuery;

    replacementContinuationToken: string;

    useTotalResults: boolean;
  }
}

export declare namespace Advanced {
  export interface AwaInitializeResponse {
    /**
		ID used to get the token.  Present this ID to the user as it will
		identify this specific request on their device.
		*/
    correlationId: string;

    /**
		True if the PUSH message will only be sent to the device that made this
		request.
		*/
    sentToSelf: boolean;
  }

  export interface AwaPermissionRequested {
    /**
		Type of advanced write action.
		*/
    type: Globals.AwaType;

    /**
		Item instance ID the action shall be applied to. This is optional for all but a new
		AwaType values. Rule of thumb is to provide the item instance ID if one is available.
		*/
    affectedItemId?: string;

    /**
		Destiny membership type of the account to modify.
		*/
    membershipType: Globals.BungieMembershipType;

    /**
		Destiny character ID, if applicable, that will be affected by the action.
		*/
    characterId?: string;
  }

  export interface AwaUserResponse {
    /**
		Indication of the selection the user has made (Approving or rejecting the action)
		*/
    selection: Globals.AwaUserSelection;

    /**
		Correlation ID of the request
		*/
    correlationId: string;

    /**
		Secret nonce received via the PUSH notification.
		*/
    nonce: number[];
  }

  export interface AwaAuthorizationResult {
    /**
		Indication of how the user responded to the request. If the value is "Approved" the actionToken
		will contain the token that can be presented when performing the advanced write action.
		*/
    userSelection: Globals.AwaUserSelection;

    responseReason: Globals.AwaResponseReason;

    /**
		Message to the app developer to help understand the response.
		*/
    developerNote: string;

    /**
		Credential used to prove the user authorized an advanced write action.
		*/
    actionToken: string;

    /**
		This token may be used to perform the requested action this number of times, at a maximum. If this
		value is 0, then there is no limit.
		*/
    maximumNumberOfUses: number;

    /**
		Time, UTC, when token expires.
		*/
    validUntil?: string;

    /**
		Advanced Write Action Type from the permission request.
		*/
    type: Globals.AwaType;

    /**
		MembershipType from the permission request.
		*/
    membershipType: Globals.BungieMembershipType;
  }
}

export declare namespace Trending {
  export interface TrendingCategories {
    categories: Trending.TrendingCategory[];
  }

  export interface TrendingCategory {
    categoryName: string;

    entries: Queries.SearchResultTrendingEntry;

    categoryId: string;
  }

  /**
	The list entry view for trending items.  Returns just enough to show the item on the trending page.
	*/
  export interface TrendingEntry {
    /**
		The weighted score of this trending item.
		*/
    weight: number;

    isFeatured: boolean;

    /**
		We don't know whether the identifier will be a string, a uint, or a long... so we're going to cast it all to a string.
		But either way, we need any trending item created to have a single unique identifier for its type.
		*/
    identifier: string;

    /**
		An enum - unfortunately - dictating all of the possible kinds of trending items that you might get in your result set,
		in case you want to do custom rendering or call to get the details of the item.
		*/
    entityType: Globals.TrendingEntryType;

    /**
		The localized "display name/article title/'primary localized identifier'" of the entity.
		*/
    displayName: string;

    /**
		If the entity has a localized tagline/subtitle/motto/whatever, that is found here.
		*/
    tagline: string;

    image: string;

    startDate?: string;

    endDate?: string;

    link: string;

    /**
		If this is populated, the entry has a related WebM video to show.
		I am 100% certain I am going to regret putting this directly on TrendingEntry,
		but it will work so yolo
		*/
    webmVideo: string;

    /**
		If this is populated, the entry has a related MP4 video to show.
		I am 100% certain I am going to regret putting this directly on TrendingEntry,
		but it will work so yolo
		*/
    mp4Video: string;

    /**
		If isFeatured, this image will be populated with whatever the featured image is.
		Note that this will likely be a very large image, so don't use it all the time.
		*/
    featureImage: string;

    /**
		If the item is of entityType TrendingEntryType.Container, it may have items - also Trending Entries - contained within it.
		This is the ordered list of those to display under the Container's header.
		*/
    items: Trending.TrendingEntry[];

    /**
		If the entry has a date at which it was created, this is that date.
		*/
    creationDate?: string;
  }

  export interface TrendingDetail {
    identifier: string;

    entityType: Globals.TrendingEntryType;

    news: Trending.TrendingEntryNews;

    support: Trending.TrendingEntrySupportArticle;

    destinyItem: Trending.TrendingEntryDestinyItem;

    destinyActivity: Trending.TrendingEntryDestinyActivity;

    destinyRitual: Trending.TrendingEntryDestinyRitual;

    creation: Trending.TrendingEntryCommunityCreation;
  }

  export interface TrendingEntryNews {
    article: Content.ContentItemPublicContract;
  }

  export interface TrendingEntrySupportArticle {
    article: Content.ContentItemPublicContract;
  }

  export interface TrendingEntryDestinyItem {
    itemHash: number;
  }

  export interface TrendingEntryDestinyActivity {
    activityHash: number;

    status: Activities.DestinyPublicActivityStatus;
  }

  export interface TrendingEntryDestinyRitual {
    image: string;

    icon: string;

    title: string;

    subtitle: string;

    dateStart?: string;

    dateEnd?: string;

    /**
		A destiny event does not necessarily have a related Milestone, but if it does the details
		will be returned here.
		*/
    milestoneDetails: Milestones.DestinyPublicMilestone;

    /**
		A destiny event will not necessarily have milestone "custom content", but if it does
		the details will be here.
		*/
    eventContent: Milestones.DestinyMilestoneContent;
  }

  export interface TrendingEntryCommunityCreation {
    media: string;

    title: string;

    author: string;

    authorMembershipId: string;

    postId: string;

    body: string;

    upvotes: number;
  }
}

export declare namespace Fireteam {
  export interface FireteamSummary {
    fireteamId: string;

    groupId: string;

    platform: Globals.FireteamPlatform;

    activityType: number;

    isImmediate: boolean;

    scheduledTime?: string;

    ownerMembershipId: string;

    playerSlotCount: number;

    alternateSlotCount?: number;

    availablePlayerSlotCount: number;

    availableAlternateSlotCount: number;

    title: string;

    dateCreated: string;

    dateModified?: string;

    isPublic: boolean;

    locale: string;

    isValid: boolean;

    datePlayerModified: string;

    titleBeforeModeration: string;

    ownerCurrentGuardianRankSnapshot: number;

    ownerHighestLifetimeGuardianRankSnapshot: number;

    ownerTotalCommendationScoreSnapshot: number;
  }

  export interface FireteamResponse {
    Summary: Fireteam.FireteamSummary;

    Members: Fireteam.FireteamMember[];

    Alternates: Fireteam.FireteamMember[];
  }

  export interface FireteamMember {
    destinyUserInfo: Fireteam.FireteamUserInfoCard;

    bungieNetUserInfo: User.UserInfoCard;

    characterId: string;

    dateJoined: string;

    hasMicrophone: boolean;

    lastPlatformInviteAttemptDate: string;

    lastPlatformInviteAttemptResult: Globals.FireteamPlatformInviteResult;
  }

  export interface FireteamUserInfoCard {
    FireteamDisplayName: string;

    FireteamMembershipType: Globals.BungieMembershipType;

    supplementalDisplayName: string;

    iconPath: string;

    crossSaveOverride: Globals.BungieMembershipType;

    applicableMembershipTypes: Globals.BungieMembershipType[];

    isPublic: boolean;

    membershipType: Globals.BungieMembershipType;

    membershipId: string;

    displayName: string;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }

  export interface FireteamCreationRequest {
    platform: Globals.FireteamPlatform;

    activityType: number;

    scheduledTime?: string;

    playerSlotCount: number;

    alternateSlotCount?: number;

    title: string;

    isPublic: boolean;

    ownerCharacterId: string;

    ownerHasMicrophone: boolean;

    locale: string;

    preferNativePlatform: boolean;
  }

  export interface FireteamEditRequest {
    fireteamId: string;

    groupId: string;

    title: string;

    scheduledTime?: string;

    playerSlotCount?: number;

    alternateSlotCount?: number;
  }
}

export declare namespace Explore {
  /**
	Represents a section with items in Explore Destiny 2.0.
	
	See TrendingCategory and TrendingEntry for what was used in Explore Destiny 1.0.
	I am taking this opportunity to move away from the obsolete "Trending" naming convention, and
	to break from some of the contract choices that I regretted in Trending (such as every type of trending item
	having different categories of details rather than trying to make more generic structures in which they
	all can fit)
	*/
  export interface ExploreSection {
    /**
		Unique and unchanging identifier for this set of Explore data being returned.
		You can use this if you need special logic that refers to a specific section.
		*/
    identifier: string;

    /**
		An enumeration that indicates to the client how this section should be rendered.
		*/
    renderingHint: Globals.ExploreRenderingHint;

    title: string;

    subtitle: string;

    /**
		Some sections, like the "cards" at the top of Explore, can be permanently dismissed if this is true.
		*/
    areItemsDismissable: boolean;

    /**
		The localized string to use if this section has a link to another part of the system.
		If this is null, there is no link.  The link also requires the client to use the identifier
		to understand where the link is going.
		*/
    linkLabel: string;

    /**
		The items contained under the Explore section.
		*/
    entries: Explore.ExploreEntry[];
  }

  export interface ExploreEntry {
    /**
		Indicates the type of entity that we're referring to with this entry.
		*/
    entityType: Globals.ExploreEntityType;

    /**
		The unique identifier for this entity.  In the case of a Destiny entity for example, this would be castable 
		to a uint hash identifier.
		*/
    identifier: string;

    title: string;

    description: string;

    background: string;

    icon: string;

    iconText: string;

    /**
		OPTIONAL - If this item is meant to link to a webpage, this is the link to that page.
		*/
    externalLink: string;

    /**
		OPTIONAL - If we want to show a progress bar, this will be the info to use
		*/
    progression: World.DestinyProgression;

    /**
		OPTIONAL - If the entry is part of a quest that you're on, this is the quests' status including
		any objectives in the current step.
		*/
    questStatus: Quests.DestinyQuestStatus;

    startDate?: string;

    endDate?: string;

    /**
		OPTIONAL - If this exists, then there are "sub-entries" on this particular entry.  For instance, if a single "Card"
		has multiple line items listed that are clickable, each of them will be represented by a single Sub-Entry with its own
		localized text, identifier etc.
		*/
    subEntries: Explore.ExploreEntry[];

    /**
		OPTIONAL - If this exists, then rewards for performing the action should be shown on the card (or however they ultimately
		end up being rendered) represented as items and the optional quantity of that item.
		*/
    rewards: World.DestinyItemQuantity[];

    /**
		OPTIONAL - If this exists, then the entry is one that may mutate over time.  This can be used to determine whether, even
		if the user has dismissed this Entry in the past, they should be shown it again.  (for instance, if the user has new clan
		messages since the last time they dismissed the clan messages card, or Xur has reappeared)
		*/
    checksum?: string;

    /**
		The localized string to use if this section has a link to another part of the system.
		If this is null, don't put a link prompt text on the entry.  The link also requires the client to use the identifier
		to understand where the link is going.
		*/
    linkLabel: string;
  }
}

export declare namespace Renderable {
  export interface ContentItemRenderable {
    Content: Content.ContentItemPublicContract;

    RenderedPropertyMacros: Renderable.ContentMacroMetadata[];

    DependentContentProperties: {
      [key: string]: Renderable.ContentItemRenderable[];
    };
  }

  export interface ContentMacroMetadata {
    SourcePropertyName: string;

    MacroString: string;

    ReferencedContent: Renderable.ContentItemRenderable;

    TemplateType: string;

    Attributes: { [key: string]: string };

    Content: Content.ContentItemPublicContract;
  }
}

export declare namespace Renderer {
  export interface ServerLogRequest {
    Url: string;

    Message: string;

    Stack: string;

    LogLevel: Globals.RendererLogLevel;

    SpamReductionLevel: Globals.SpamReductionLevel;
  }

  export interface CrossSaveUserDataDefined {
    data: Renderer.CrossSaveUserData;

    definitions: Renderer.DefinitionSetCrossSaveUserData;
  }

  export interface CrossSaveUserData {
    profileResponses: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: Responses.DestinyProfileResponse;
    };

    linkedDestinyProfiles: Responses.DestinyLinkedProfilesResponse;

    entitlements: Responses.DestinyEntitlementsResponse;
  }

  export interface DefinitionSetCrossSaveUserData {
    objectives: { [key: number]: Definitions.DestinyObjectiveDefinition };

    unlockValues: { [key: number]: Definitions.DestinyUnlockValueDefinition };

    locations: { [key: number]: Definitions.DestinyLocationDefinition };

    unlocks: { [key: number]: Definitions.DestinyUnlockDefinition };

    unlockMappings: {
      [key: number]: Unlocks.DestinyUnlockExpressionMappingDefinition;
    };

    perks: { [key: number]: Definitions.DestinySandboxPerkDefinition };

    damageTypes: { [key: number]: Definitions.DestinyDamageTypeDefinition };

    stats: { [key: number]: Definitions.DestinyStatDefinition };

    equipmentSlots: {
      [key: number]: Definitions.DestinyEquipmentSlotDefinition;
    };

    buckets: { [key: number]: Definitions.DestinyInventoryBucketDefinition };

    vendors: { [key: number]: Definitions.DestinyVendorDefinition };

    destinations: { [key: number]: Definitions.DestinyDestinationDefinition };

    activities: { [key: number]: Definitions.DestinyActivityDefinition };

    places: { [key: number]: Definitions.DestinyPlaceDefinition };

    activityGraphs: { [key: number]: Director.DestinyActivityGraphDefinition };

    activityTypes: { [key: number]: Definitions.DestinyActivityTypeDefinition };

    activityModes: { [key: number]: Definitions.DestinyActivityModeDefinition };

    items: { [key: number]: Definitions.DestinyInventoryItemDefinition };

    unlockExpressions: {
      [key: number]: Definitions.DestinyUnlockExpressionDefinition;
    };

    collectibles: { [key: number]: Collectibles.DestinyCollectibleDefinition };

    lore: { [key: number]: Lore.DestinyLoreDefinition };

    itemCategories: {
      [key: number]: Definitions.DestinyItemCategoryDefinition;
    };

    breakerTypes: { [key: number]: BreakerTypes.DestinyBreakerTypeDefinition };

    seasons: { [key: number]: Seasons.DestinySeasonDefinition };

    progressionMappings: {
      [key: number]: Definitions.DestinyProgressionMappingDefinition;
    };

    socketTypes: { [key: number]: Sockets.DestinySocketTypeDefinition };

    materialRequirementSets: {
      [key: number]: Definitions.DestinyMaterialRequirementSetDefinition;
    };

    socketCategories: {
      [key: number]: Sockets.DestinySocketCategoryDefinition;
    };

    itemTierTypes: { [key: number]: Items.DestinyItemTierTypeDefinition };

    statGroups: { [key: number]: Definitions.DestinyStatGroupDefinition };

    sandboxPatterns: {
      [key: number]: Definitions.DestinySandboxPatternDefinition;
    };

    classes: { [key: number]: Definitions.DestinyClassDefinition };

    genders: { [key: number]: Definitions.DestinyGenderDefinition };

    factions: { [key: number]: Definitions.DestinyFactionDefinition };

    progressions: { [key: number]: Definitions.DestinyProgressionDefinition };

    vendorGroups: { [key: number]: Definitions.DestinyVendorGroupDefinition };

    artifacts: { [key: number]: Artifacts.DestinyArtifactDefinition };

    progressionLevelRequirements: {
      [key: number]: Progression.DestinyProgressionLevelRequirementDefinition;
    };

    powerCaps: { [key: number]: PowerCaps.DestinyPowerCapDefinition };

    sources: { [key: number]: Definitions.DestinyRewardSourceDefinition };

    presentationNodes: {
      [key: number]: Presentation.DestinyPresentationNodeDefinition;
    };

    records: { [key: number]: Records.DestinyRecordDefinition };

    traits: { [key: number]: Traits.DestinyTraitDefinition };

    metrics: { [key: number]: Metrics.DestinyMetricDefinition };

    energyTypes: { [key: number]: EnergyTypes.DestinyEnergyTypeDefinition };

    plugSets: { [key: number]: Sockets.DestinyPlugSetDefinition };

    talentGrids: { [key: number]: Definitions.DestinyTalentGridDefinition };

    seasonPasses: { [key: number]: Seasons.DestinySeasonPassDefinition };

    activityModifiers: {
      [key: number]: ActivityModifiers.DestinyActivityModifierDefinition;
    };

    eventCards: { [key: number]: Seasons.DestinyEventCardDefinition };

    checklists: { [key: number]: Checklists.DestinyChecklistDefinition };

    races: { [key: number]: Definitions.DestinyRaceDefinition };

    milestones: { [key: number]: Milestones.DestinyMilestoneDefinition };

    unlockEvents: { [key: number]: Definitions.DestinyUnlockEventDefinition };
  }

  export interface SeasonsUserDataDefined {
    data: Renderer.SeasonsUserData;

    definitions: Renderer.DefinitionSetSeasonsUserData;
  }

  export interface SeasonsUserData {
    profileResponses: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: Responses.DestinyProfileResponse;
    };

    linkedDestinyProfiles: Responses.DestinyLinkedProfilesResponse;
  }

  export interface DefinitionSetSeasonsUserData {
    objectives: { [key: number]: Definitions.DestinyObjectiveDefinition };

    unlockValues: { [key: number]: Definitions.DestinyUnlockValueDefinition };

    locations: { [key: number]: Definitions.DestinyLocationDefinition };

    unlocks: { [key: number]: Definitions.DestinyUnlockDefinition };

    unlockMappings: {
      [key: number]: Unlocks.DestinyUnlockExpressionMappingDefinition;
    };

    perks: { [key: number]: Definitions.DestinySandboxPerkDefinition };

    damageTypes: { [key: number]: Definitions.DestinyDamageTypeDefinition };

    stats: { [key: number]: Definitions.DestinyStatDefinition };

    equipmentSlots: {
      [key: number]: Definitions.DestinyEquipmentSlotDefinition;
    };

    buckets: { [key: number]: Definitions.DestinyInventoryBucketDefinition };

    vendors: { [key: number]: Definitions.DestinyVendorDefinition };

    destinations: { [key: number]: Definitions.DestinyDestinationDefinition };

    activities: { [key: number]: Definitions.DestinyActivityDefinition };

    places: { [key: number]: Definitions.DestinyPlaceDefinition };

    activityGraphs: { [key: number]: Director.DestinyActivityGraphDefinition };

    activityTypes: { [key: number]: Definitions.DestinyActivityTypeDefinition };

    activityModes: { [key: number]: Definitions.DestinyActivityModeDefinition };

    items: { [key: number]: Definitions.DestinyInventoryItemDefinition };

    unlockExpressions: {
      [key: number]: Definitions.DestinyUnlockExpressionDefinition;
    };

    collectibles: { [key: number]: Collectibles.DestinyCollectibleDefinition };

    lore: { [key: number]: Lore.DestinyLoreDefinition };

    itemCategories: {
      [key: number]: Definitions.DestinyItemCategoryDefinition;
    };

    breakerTypes: { [key: number]: BreakerTypes.DestinyBreakerTypeDefinition };

    seasons: { [key: number]: Seasons.DestinySeasonDefinition };

    progressionMappings: {
      [key: number]: Definitions.DestinyProgressionMappingDefinition;
    };

    socketTypes: { [key: number]: Sockets.DestinySocketTypeDefinition };

    materialRequirementSets: {
      [key: number]: Definitions.DestinyMaterialRequirementSetDefinition;
    };

    socketCategories: {
      [key: number]: Sockets.DestinySocketCategoryDefinition;
    };

    itemTierTypes: { [key: number]: Items.DestinyItemTierTypeDefinition };

    statGroups: { [key: number]: Definitions.DestinyStatGroupDefinition };

    sandboxPatterns: {
      [key: number]: Definitions.DestinySandboxPatternDefinition;
    };

    classes: { [key: number]: Definitions.DestinyClassDefinition };

    genders: { [key: number]: Definitions.DestinyGenderDefinition };

    factions: { [key: number]: Definitions.DestinyFactionDefinition };

    progressions: { [key: number]: Definitions.DestinyProgressionDefinition };

    vendorGroups: { [key: number]: Definitions.DestinyVendorGroupDefinition };

    artifacts: { [key: number]: Artifacts.DestinyArtifactDefinition };

    progressionLevelRequirements: {
      [key: number]: Progression.DestinyProgressionLevelRequirementDefinition;
    };

    powerCaps: { [key: number]: PowerCaps.DestinyPowerCapDefinition };

    sources: { [key: number]: Definitions.DestinyRewardSourceDefinition };

    presentationNodes: {
      [key: number]: Presentation.DestinyPresentationNodeDefinition;
    };

    records: { [key: number]: Records.DestinyRecordDefinition };

    traits: { [key: number]: Traits.DestinyTraitDefinition };

    metrics: { [key: number]: Metrics.DestinyMetricDefinition };

    energyTypes: { [key: number]: EnergyTypes.DestinyEnergyTypeDefinition };

    plugSets: { [key: number]: Sockets.DestinyPlugSetDefinition };

    talentGrids: { [key: number]: Definitions.DestinyTalentGridDefinition };

    seasonPasses: { [key: number]: Seasons.DestinySeasonPassDefinition };

    activityModifiers: {
      [key: number]: ActivityModifiers.DestinyActivityModifierDefinition;
    };

    eventCards: { [key: number]: Seasons.DestinyEventCardDefinition };

    checklists: { [key: number]: Checklists.DestinyChecklistDefinition };

    races: { [key: number]: Definitions.DestinyRaceDefinition };

    milestones: { [key: number]: Milestones.DestinyMilestoneDefinition };

    unlockEvents: { [key: number]: Definitions.DestinyUnlockEventDefinition };
  }

  export interface Destiny2Entitlements {
    Entitlements: Responses.DestinyEntitlementsResponse;
  }
}

export declare namespace Seasons {
  export interface DestinySeasonEntitlements {
    /**
		The last date in which it appears we were able to obtain Season ownership data.
		If null, we have never been able to get it for this Profile.
		*/
    dateRefreshed?: string;

    /**
		Season ownership data, if it is not outright purchased, may appear differently based on
		what platform the Profile played on last.  This will return the last platform on which
		the user played/had ownership information updated, so that you can show the user any caveat messages
		you desire about season ownership if they played on a platform other than one you expected.
		*/
    lastPlatformRefreshed: Globals.BungieMembershipType;

    /**
		An in-order list (ascending by the start date of the season) of every season that the user can access.
		
		 Note that a user may have some special way of accessing the season that didn't require them to buy it -
		 in this situation, they will have an entry but it won't be flagged as "purchased" and will be limited
		 to the platform they last played on.
		*/
    seasons: Seasons.DestinySeasonEntitlement[];
  }

  export interface DestinySeasonEntitlement {
    /**
		The season that is accessible to the user.
		*/
    seasonHash: number;

    /**
		If true, then this season has actually been purchased, and thus is available on all platforms
		on which this Profile plays.
		*/
    purchased: boolean;

    /**
		The platforms on which this Season can be played.  If you have one or more Subscriptions,
		for example, you may have access to this season but only conditionally.
		*/
    usableOnPlatforms: Globals.BungieMembershipType[];

    /**
		If you are getting this season due to a subscription, this is the set of subscriptions
		 granting you the season.
		
		 If "None", then you have purchased the season, and are not subject to the limited availability
		 provided by subscriptions.
		*/
    grantedBySubscriptions: Globals.DestinySubscriptions;
  }

  /**
	Defines a canonical "Season" of Destiny: a range of a few months where the game highlights
	certain challenges, provides new loot, has new Clan-related rewards and celebrates various
	seasonal events.
	*/
  export interface DestinySeasonDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    backgroundImagePath: string;

    seasonNumber: number;

    startDate?: string;

    endDate?: string;

    seasonPassHash?: number;

    seasonPassProgressionHash?: number;

    artifactItemHash?: number;

    sealPresentationNodeHash?: number;

    /**
		A list of Acts for the Episode
		*/
    acts: Seasons.DestinySeasonActDefinition[];

    seasonalChallengesPresentationNodeHash?: number;

    /**
		Optional - Defines the promotional text, images, and links to preview this season.
		*/
    preview: Seasons.DestinySeasonPreviewDefinition;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Defines the name, start time and ranks included in an Act of an Episode.
	*/
  export interface DestinySeasonActDefinition {
    /**
		The name of the Act.
		*/
    displayName: string;

    /**
		The start time of the Act.
		*/
    startTime: string;

    /**
		The number of ranks included in the Act.
		*/
    rankCount: number;
  }

  /**
	Defines the promotional text, images, and links to preview this season.
	*/
  export interface DestinySeasonPreviewDefinition {
    /**
		A localized description of the season.
		*/
    description: string;

    /**
		A relative path to learn more about the season. Web browsers should be automatically redirected to the user's Bungie.net locale.
		For example: "/SeasonOfTheChosen" will redirect to "/7/en/Seasons/SeasonOfTheChosen" for English users.
		*/
    linkPath: string;

    /**
		An optional link to a localized video, probably YouTube.
		*/
    videoLink: string;

    /**
		A list of images to preview the seasonal content. Should have at least three to show.
		*/
    images: Seasons.DestinySeasonPreviewImageDefinition[];
  }

  /**
	Defines the thumbnail icon, high-res image, and video link for promotional images
	*/
  export interface DestinySeasonPreviewImageDefinition {
    /**
		A thumbnail icon path to preview seasonal content, probably 480x270.
		*/
    thumbnailImage: string;

    /**
		An optional path to a high-resolution image, probably 1920x1080.
		*/
    highResImage: string;
  }

  export interface DestinySeasonPassDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		This is the progression definition related to the progression for the initial levels 1-100
		that provide item rewards for the Season pass.  Further experience after you reach the limit
		is provided in the "Prestige" progression referred to by prestigeProgressionHash.
		*/
    rewardProgressionHash: number;

    /**
		I know what you're thinking, but I promise we're not going to duplicate and drown you.  Instead,
		 we're giving you sweet, sweet power bonuses.
		
		 Prestige progression is further progression that you can make on the Season pass after you gain
		 max ranks, that will ultimately increase your power/light level over the theoretical limit.
		*/
    prestigeProgressionHash: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	Defines the properties of an 'Event Card' in Destiny 2,
	to coincide with a seasonal event for additional challenges, premium rewards, a new seal, and a special title.
	For example: Solstice of Heroes 2022.
	*/
  export interface DestinyEventCardDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    linkRedirectPath: string;

    color: Misc.DestinyColor;

    images: Seasons.DestinyEventCardImages;

    triumphsPresentationNodeHash: number;

    sealPresentationNodeHash: number;

    eventCardCurrencyList: number[];

    ticketCurrencyItemHash: number;

    ticketVendorHash: number;

    ticketVendorCategoryHash: number;

    endTime: string;

    rewardProgressionHash?: number;

    weeklyChallengesPresentationNodeHash?: number;

    hash: number;

    index: number;

    redacted: boolean;
  }

  export interface DestinyEventCardImages {
    unownedCardSleeveImagePath: string;

    unownedCardSleeveWrapImagePath: string;

    cardIncompleteImagePath: string;

    cardCompleteImagePath: string;

    cardCompleteWrapImagePath: string;

    progressIconImagePath: string;

    themeBackgroundImagePath: string;
  }
}

export declare namespace Unlocks {
  /**
	Represents a reusable Unlock Expression Definition.  Unlock expressions - including those defined in a mapping - can
	reference other mappings, which should be executed in entirety to find the final result.
	*/
  export interface DestinyUnlockExpressionMappingDefinition {
    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace Constants {
  export interface DestinyEnvironmentLocationMapping {
    /**
		The location that is revealed on the director by this mapping.
		*/
    locationHash: number;

    /**
		A hint that the UI uses to figure out how this location is activated by the player.
		*/
    activationSource: string;

    /**
		If this is populated, it is the item that you must possess for this location to be active
		because of this mapping.  (theoretically, a location can have multiple mappings, and some might require an
		item while others don't)
		*/
    itemHash?: number;

    /**
		If this is populated, this is an objective related to the location.
		*/
    objectiveHash?: number;

    /**
		If this is populated, this is the activity you have to be playing in order to see this location
		appear because of this mapping. (theoretically, a location can have multiple mappings, and some might
		require you to be in a specific activity when others don't)
		*/
    activityHash?: number;
  }
}

export declare namespace Director {
  /**
	Represents a Map View in the director: be them overview views, destination views, or other.
	
	They have nodes which map to activities, and other various visual elements that we (or others) may
	or may not be able to use.
	
	Activity graphs, most importantly, have nodes which can have activities in various states of
	playability.
	
	Unfortunately, activity graphs are combined at runtime with Game UI-only assets such as fragments of
	map images, various in-game special effects, decals etc... that we don't get in these definitions.
	
	If we end up having time, we may end up trying to manually populate those here: but the last time we tried that,
	before the lead-up to D1, it proved to be unmaintainable as the game's content changed.  So don't bet the farm
	on us providing that content in this definition.
	*/
  export interface DestinyActivityGraphDefinition {
    /**
		These represent the visual "nodes" on the map's view.  These are the activities you
		can click on in the map.
		*/
    nodes: Director.DestinyActivityGraphNodeDefinition[];

    /**
		Represents one-off/special UI elements that appear on the map.
		*/
    artElements: Director.DestinyActivityGraphArtElementDefinition[];

    /**
		Represents connections between graph nodes.  However, it lacks context that we'd need to make good use of it.
		*/
    connections: Director.DestinyActivityGraphConnectionDefinition[];

    /**
		Objectives can display on maps, and this is supposedly metadata for that.  I have not had the time to
		analyze the details of what is useful within however: we could be missing important data to make this work.
		Expect this property to be expanded on later if possible.
		*/
    displayObjectives: Director.DestinyActivityGraphDisplayObjectiveDefinition[];

    /**
		Progressions can also display on maps, but similarly to displayObjectives we appear to lack some required
		information and context right now.  We will have to look into it later and add more data if possible.
		*/
    displayProgressions: Director.DestinyActivityGraphDisplayProgressionDefinition[];

    /**
		Represents links between this Activity Graph and other ones.
		*/
    linkedGraphs: Director.DestinyLinkedGraphDefinition[];

    hash: number;

    index: number;

    redacted: boolean;
  }

  /**
	This is the position and other data related to nodes in the activity graph that you can click
	to launch activities.  An Activity Graph node will only have one active Activity at a time,
	which will determine the activity to be launched (and, unless overrideDisplay information is provided,
	will also determine the tooltip and other UI related to the node)
	*/
  export interface DestinyActivityGraphNodeDefinition {
    /**
		An identifier for the Activity Graph Node, only guaranteed to be unique within its parent Activity Graph.
		*/
    nodeId: number;

    /**
		The node *may* have display properties that override the active Activity's display properties.
		*/
    overrideDisplay: Common.DestinyDisplayPropertiesDefinition;

    /**
		The position on the map for this node.
		*/
    position: Common.DestinyPositionDefinition;

    /**
		The node may have various visual accents placed on it, or styles applied.  These are the list of possible styles
		that the Node can have.  The game iterates through each, looking for the first one that passes a check of the required
		game/character/account state in order to show that style, and then renders the node in that style.
		*/
    featuringStates: Director.DestinyActivityGraphNodeFeaturingStateDefinition[];

    /**
		The node may have various possible activities that could be active for it, however only one may be active
		at a time.  See the DestinyActivityGraphNodeActivityDefinition for details.
		*/
    activities: Director.DestinyActivityGraphNodeActivityDefinition[];

    /**
		Represents possible states that the graph node can be in.  These are combined with some checking that happens
		in the game client and server to determine which state is actually active at any given time.
		*/
    states: Director.DestinyActivityGraphNodeStateEntry[];
  }

  /**
	Nodes can have different visual states.  This object represents a single visual state ("highlight type")
	that a node can be in, and the unlock expression condition to determine whether it should be set.
	*/
  export interface DestinyActivityGraphNodeFeaturingStateDefinition {
    /**
		The node can be highlighted in a variety of ways - the game iterates through these and finds
		the first FeaturingState that is valid at the present moment given the Game, Account, and Character
		state, and renders the node in that state.  See the ActivityGraphNodeHighlightType enum for possible
		values.
		*/
    highlightType: Globals.ActivityGraphNodeHighlightType;
  }

  /**
	The actual activity to be redirected to when you click on the node.
	Note that a node can have many Activities attached to it: but only one will be active at any
	given time.  The list of Node Activities will be traversed, and the first one found to be active
	will be displayed.  This way, a node can layer multiple variants of an activity on top of each other.
	For instance, one node can control the weekly Crucible Playlist.  There are multiple possible playlists,
	but only one is active for the week.
	*/
  export interface DestinyActivityGraphNodeActivityDefinition {
    /**
		An identifier for this node activity.  It is only guaranteed to be unique within the Activity Graph.
		*/
    nodeActivityId: number;

    /**
		The activity that will be activated if the user clicks on this node.  Controls all activity-related
		information displayed on the node if it is active (the text shown in the tooltip etc)
		*/
    activityHash: number;
  }

  /**
	Represents a single state that a graph node might end up in.  Depending on what's going on in the game,
	graph nodes could be shown in different ways or even excluded from view entirely.
	*/
  export interface DestinyActivityGraphNodeStateEntry {
    state: Globals.DestinyGraphNodeState;
  }

  /**
	These Art Elements are meant to represent one-off visual effects overlaid on the map.
	Currently, we do not have a pipeline to import the assets for these overlays, so this info
	exists as a placeholder for when such a pipeline exists (if it ever will)
	*/
  export interface DestinyActivityGraphArtElementDefinition {
    /**
		The position on the map of the art element.
		*/
    position: Common.DestinyPositionDefinition;
  }

  /**
	Nodes on a graph can be visually connected: this appears to be the information about which nodes to link.
	It appears to lack more detailed information, such as the path for that linking.
	*/
  export interface DestinyActivityGraphConnectionDefinition {
    sourceNodeHash: number;

    destNodeHash: number;
  }

  /**
	When a Graph needs to show active Objectives, this defines those objectives as well as an identifier.
	*/
  export interface DestinyActivityGraphDisplayObjectiveDefinition {
    /**
		$NOTE $amola 2017-01-19 This field is apparently something that CUI uses to manually wire up objectives
		to display info.  I am unsure how it works.
		*/
    id: number;

    /**
		The objective being shown on the map.
		*/
    objectiveHash: number;
  }

  /**
	When a Graph needs to show active Progressions, this defines those objectives as well as an identifier.
	*/
  export interface DestinyActivityGraphDisplayProgressionDefinition {
    id: number;

    progressionHash: number;
  }

  /**
	This describes links between the current graph and others, as well as when that link is relevant.
	*/
  export interface DestinyLinkedGraphDefinition {
    description: string;

    name: string;

    unlockExpression: Definitions.DestinyUnlockExpressionDefinition;

    linkedGraphId: number;

    linkedGraphs: Director.DestinyLinkedGraphEntryDefinition[];

    overview: string;
  }

  export interface DestinyLinkedGraphEntryDefinition {
    activityGraphHash: number;
  }

  /**
	Some graphs have text with timers that are shown.  This has that data.
	*/
  export interface DestinyTimerElementDefinition {}
}

export declare namespace Lore {
  /**
	These are definitions for in-game "Lore," meant to be narrative enhancements of the game experience.
	
	DestinyInventoryItemDefinitions for interesting items point to these definitions, but nothing's stopping
	you from scraping all of these and doing something cool with them.  If they end up having cool data.
	*/
  export interface DestinyLoreDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    subtitle: string;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace BreakerTypes {
  export interface DestinyBreakerTypeDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		We have an enumeration for Breaker types for quick reference.  This is the current definition's breaker type enum value.
		*/
    enumValue: Globals.DestinyBreakerType;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace Interpolation {
  export interface InterpolationPoint {
    value: number;

    weight: number;
  }

  export interface InterpolationPointFloat {
    value: number;

    weight: number;
  }
}

export declare namespace PowerCaps {
  /**
	Defines a 'power cap' (limit) for gear items, based on the rarity tier and season of release.
	*/
  export interface DestinyPowerCapDefinition {
    /**
		The raw value for a power cap.
		*/
    powerCap: number;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace Traits {
  export interface DestinyTraitDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		An identifier for how this trait can be displayed.
		For example: a 'keyword' hint to show an explanation for certain related terms.
		*/
    displayHint: string;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace EnergyTypes {
  /**
	Represents types of Energy that can be used for costs and payments related to Armor 2.0 mods.
	*/
  export interface DestinyEnergyTypeDefinition {
    /**
		The description of the energy type, icon etc...
		*/
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    /**
		A variant of the icon that is transparent and colorless.
		*/
    transparentIconPath: string;

    /**
		If TRUE, the game shows this Energy type's icon.  Otherwise, it doesn't.  Whether you show it or not is up to you.
		*/
    showIcon: boolean;

    /**
		We have an enumeration for Energy types for quick reference.  This is the current definition's Energy type enum value.
		*/
    enumValue: Globals.DestinyEnergyType;

    /**
		If this Energy Type can be used for determining the Type of Energy that an item can consume, this is the hash for the
		DestinyInvestmentStatDefinition that represents the stat which holds the Capacity for that energy type.
		(Note that this is optional because "Any" is a valid cost, but not valid for Capacity - an Armor must have a specific
		Energy Type for determining the energy type that the Armor is restricted to use)
		*/
    capacityStatHash?: number;

    /**
		If this Energy Type can be used as a cost to pay for socketing Armor 2.0 items, this is the hash for the
		DestinyInvestmentStatDefinition that stores the plug's raw cost.
		*/
    costStatHash: number;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace ActivityModifiers {
  /**
	Modifiers - in Destiny 1, these were referred to as "Skulls" - are changes that can be applied
	to an Activity.
	*/
  export interface DestinyActivityModifierDefinition {
    displayProperties: Common.DestinyDisplayPropertiesDefinition;

    displayInNavMode: boolean;

    displayInActivitySelection: boolean;

    hash: number;

    index: number;

    redacted: boolean;
  }
}

export declare namespace TalentGrids {
  /**
	The true step definitions as they exist in Investment content.  These should never be exposed
	externally, and should only be used internally for places where BNet needs to simulate Investment
	logic, such as instantiating talent grids for Vendors.
	*/
  export interface DestinyRealStepDefinition {
    activateProvides: TalentGrids.DestinyRealStepProvidesEntry[];

    activateRequires: TalentGrids.DestinyRealStepRequiresEntry;

    binarySwapRequires: TalentGrids.DestinyRealStepSwapRequiresEntry;

    activateResponse: TalentGrids.DestinyRealStepActivateResponseEntry;

    visiblity: TalentGrids.DestinyRealStepVisibilityEntry;
  }

  export interface DestinyRealStepProvidesEntry {
    abilityList: TalentGrids.DestinyRealStepAbilityEntry[];

    statList: TalentGrids.DestinyRealStepStatEntry[];

    perkList: number[];

    qualityBonus: number;

    propertiesSettings: Globals.TalentNodeStepPropertiesTypes;

    intrinsicUnlockValues: TalentGrids.DestinyRealStepUnlockValueEntry[];

    intrinsicUnlocks: TalentGrids.DestinyRealStepUnlockEntry[];
  }

  export interface DestinyRealStepAbilityEntry {
    providedAbilityModHash: number;

    requiredAbilityHash: number;

    overrideNodeIndex: number;

    overrideStepIndex: number;

    overrideEffectIndex: number;

    abilityHash: number;
  }

  export interface DestinyRealStepStatEntry {
    statValue: number;

    statScalarMin: number;

    statScalarMax: number;

    statTypeHash: number;

    randomValueIndex: number;
  }

  export interface DestinyRealStepUnlockValueEntry {
    unlockValueHash: number;

    expression: Definitions.DestinyUnlockExpressionDefinition;
  }

  export interface DestinyRealStepUnlockEntry {
    unlockHash: number;
  }

  export interface DestinyRealStepRequiresEntry {
    unlockExpressions: Definitions.DestinyUnlockExpressionDefinition[];

    materialRequirementHashes: number[];

    exclusiveSetHash: number;

    gridLevel: number;

    requiresInfusion: boolean;
  }

  export interface DestinyRealStepSwapRequiresEntry {
    unactivatedExclusiveSetHash: number;

    materialRequirementHash: number;

    prerequisiteNodeList: number[];
  }

  export interface DestinyRealStepActivateResponseEntry {
    rerollRandomValues: TalentGrids.DestinyRealStepRandomValueIndex[];

    rewardSheetHash: number;

    rewardItemHash: number;

    setItemLevel: number;

    setItemQuality: number;

    socketResponse: TalentGrids.DestinyRealStepSocketResponseEntry;

    deleteItem: boolean;
  }

  export interface DestinyRealStepRandomValueIndex {
    randomValueIndex: number;
  }

  export interface DestinyRealStepSocketResponseEntry {
    replaceResponses: TalentGrids.DestinyRealStepSocketReplaceResponse[];
  }

  export interface DestinyRealStepSocketReplaceResponse {
    socketTypeHash: number;

    plugItemHash: number;
  }

  export interface DestinyRealStepVisibilityEntry {
    unlockExpressions: Definitions.DestinyUnlockExpressionDefinition[];

    minLevel?: number;

    maxLevel?: number;
  }
}

export declare namespace Resets {
  /**
	INTERNAL USE ONLY: Reset Entries can have repeatable time periods when they reset.
	This is the raw data that can be used to calculate when those resets occur.
	*/
  export interface DestinyResetFrequencyEntry {}
}

export declare namespace UnlockEvents {
  /**
	INTERNAL ONLY: This is a definition of the raw data used to determine the frequency of an event.
	Examine how it is used elsewhere in the codebase.
	*/
  export interface DestinyEventFrequencyDataEntry {}
}

export declare namespace CrossSave {
  export interface CrossSavePairingStatus {
    /**
		If populated, this is the primary membership ID for Destiny 2 cross save.
		*/
    primaryMembershipId?: string;

    /**
		If populated, this is the primary D2 cross save profiles' original Membership Type.
		(the platform for which it was created)
		*/
    primaryMembershipType?: Globals.BungieMembershipType;

    /**
		The list of all profiles that have been overridden by the Primary cross save profile, if any.
		*/
    overriddenProfiles: CrossSave.CrossSaveOverriddenProfile[];

    /**
		For each valid Platform for Cross Save, along with Destiny Profile information
		and membership information if it exists yet.
		*/
    profiles: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: Platforms.BungiePlatformMembership;
    };

    /**
		This is a list of all membership ids (keyed by type) that are not overridden.
		*/
    membershipsMissingOverrides: {
      [K in EnumStrings<typeof Globals.BungieMembershipType>]?: string;
    };
  }

  export interface CrossSaveOverriddenProfile {
    /**
		The Membership Type being overridden by the primary cross save profile.
		*/
    membershipTypeOverridden: Globals.BungieMembershipType;

    /**
		The membership ID being hidden by the primary cross save profile.
		*/
    membershipIdOverridden: string;
  }

  /**
	Information about how a particular membership type can be used in cross save.
	*/
  export interface CrossSavePairabilityStatus {
    /**
		If true, this pairing can be primary.  Otherwise, it can only be secondary.
		*/
    canBePrimary: boolean;

    /**
		If true, you can play Destiny 2 playable on this platform.  If false, it's not playable yet!
		*/
    isDestiny2Playable: boolean;

    /**
		If true, this membership can participate in Cross Save.
		*/
    canCrossSave: boolean;
  }

  /**
	The set of all errors that we know in advance will be encountered when doing Cross Save pairing.
	*/
  export interface CrossSaveValidationResponse {
    /**
		All errors for each linked Membership Type that are true no matter what
		it tries to pair/unpair with.
		*/
    profileSpecificErrors: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: CrossSave.CrossSaveValidationError[];
    };

    /**
		Returns information about whether a given platform has been successfully authenticated
		recently, and at what time it will be considered no longer valid for Cross Save purposes.
		*/
    authStatuses: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: CrossSave.CrossSaveCredentialAuthenticationStatus;
    };

    /**
		If true, this account must be migrated to PC before any cross save can occur.
		*/
    requiresPCMigration: boolean;

    settings: CrossSave.CrossSaveSettingValues;

    /**
		This is the set of Membership Types that this user can potentially use in Cross Save, and other
		 information that might be useful about this particular membership type.
		
		 Existence in this dictionary implies that the membership type should be shown in cross save UI, even
		 if it can't be primary or isn't playable yet.
		 they are
		*/
    pairableMembershipTypes: {
      [K in EnumStrings<
        typeof Globals.BungieMembershipType
      >]?: CrossSave.CrossSavePairabilityStatus;
    };
  }

  /**
	The details about a specific error that can exist in pairing or unpairing.
	*/
  export interface CrossSaveValidationError {
    /**
		The membership type for whom this validation error applies.
		*/
    membershipType: Globals.BungieMembershipType;

    errorCode: Globals.PlatformErrorCodes;

    message: string;

    onPairing: boolean;

    onUnpairing: boolean;

    dateExpires?: string;
  }

  /**
	Information about a given platform's login status.  All accounts attempting cross save
	must be authenticated within a configured period of time - or be your currently logged-in
	credential - for Cross Save pairing/unpairing to succeed.
	*/
  export interface CrossSaveCredentialAuthenticationStatus {
    /**
		The membership type to whom this authentication status applies.
		*/
    membershipType: Globals.BungieMembershipType;

    /**
		If true, then we consider the credential for this membership type to be Authenticated
		for Cross Save purposes.
		*/
    isAuthenticated: boolean;

    /**
		If the credential is authenticated, this is the date/time at which we will no longer
		consider it to be "fresh" enough of a login for Cross Save purposes.
		*/
    expirationDate?: string;

    /**
		True if this membership is a legacy cross save and can no longer be created (will always show as authenticated = true)
		*/
    IsLegacy: boolean;
  }

  /**
	Settings for Cross Save.
	*/
  export interface CrossSaveSettingValues {
    /**
		A localized string containing the amount of time that the 're-pair' a previously paired membership.
		*/
    repairThrottleDurationFragment: string;
  }

  export interface CrossSavePairingResponse {
    /**
		The results of each "leg" of the pairing attempt, be it
		success or failure.
		*/
    entries: CrossSave.CrossSavePairingResponseEntry[];

    /**
		The original Membership Type of the Destiny Profile that is being promoted
		to the "Primary" profile.
		*/
    membershipTypePrimary: Globals.BungieMembershipType;

    membershipIdPrimary: string;
  }

  export interface CrossSavePairingResponseEntry {
    /**
		The membership type of the Destiny Profile that was being overridden
		for which this result applies.
		*/
    membershipTypeOverridden: Globals.BungieMembershipType;

    membershipIdOverridden: string;

    /**
		The membership type of the Destiny Profile for whom the failure occurred,
		 as the failure could occur for either the primary or the overridden membership.
		 If any.
		
		 If it succeeded, then there was no failed membership type.
		*/
    membershipTypeFailed?: Globals.BungieMembershipType;

    errorCode: Globals.PlatformErrorCodes;

    message: string;
  }

  export interface CrossSavePairingRequest {
    primaryMembershipType: Globals.BungieMembershipType;

    overriddenMembershipTypes: Globals.BungieMembershipType[];
  }

  export interface CrossSaveClearPairingsResponse {
    entries: CrossSave.CrossSavePairingResponseEntry[];
  }
}

export declare namespace Platforms {
  /**
	Represents a platform for which you have a linked account, and information about the membership ID
	linked to that platform, if any.
	*/
  export interface BungiePlatformMembership {
    /**
		The display name for this platform.
		*/
    platformDisplayName: string;

    /**
		If this account has actually created a membership for this platform, this is their membership ID.
		*/
    membershipId?: string;

    /**
		The credential type for this platform, if any.
		*/
    linkedCredentialType: Globals.BungieCredentialType;

    /**
		The membership type for this platform.
		*/
    platformMembershipType: Globals.BungieMembershipType;

    /**
		The roles that this platform can play (games for which it can have data, whether it can have Bungie.net information etc)
		*/
    roleMappings: Globals.BungieMembershipRoleMappings;

    /**
		Information about whether this platform can be cross saved, and if so whether it can be primary.
		*/
    pairabilityStatus: CrossSave.CrossSavePairabilityStatus;
  }
}

export declare namespace Recaptcha {
  export interface RecaptchaResponse {
    Success: boolean;
  }

  export interface RecaptchaRequest {
    Token: string;
  }
}

export declare namespace Friends {
  export interface BungieFriendListResponse {
    friends: Friends.BungieFriend[];
  }

  export interface BungieFriend {
    lastSeenAsMembershipId: string;

    lastSeenAsBungieMembershipType: Globals.BungieMembershipType;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;

    onlineStatus: Globals.PresenceStatus;

    onlineTitle: Globals.PresenceOnlineStateFlags;

    relationship: Globals.FriendRelationshipState;

    bungieNetUser: User.GeneralUser;
  }

  export interface BungieFriendRequestListResponse {
    incomingRequests: Friends.BungieFriend[];

    outgoingRequests: Friends.BungieFriend[];
  }

  export interface PlatformFriendResponse {
    itemsPerPage: number;

    currentPage: number;

    hasMore: boolean;

    platformFriends: Friends.PlatformFriend[];
  }

  export interface PlatformFriend {
    platformDisplayName: string;

    friendPlatform: Globals.PlatformFriendType;

    destinyMembershipId?: string;

    destinyMembershipType?: Globals.BungieMembershipType;

    bungieNetMembershipId?: string;

    bungieGlobalDisplayName: string;

    bungieGlobalDisplayNameCode?: number;
  }
}

export declare namespace PnP {
  /**
	Contract representing a request to update permissions for a child account under PnP.
	*/
  export interface BulkUpdatePermissionsForChildRequest {
    /**
		The permissions to update for the child.
		*/
    permissionsToUpdate: PnP.ChildPermission[];
  }

  /**
	Contract representing a child permission in PnP.
	*/
  export interface ChildPermission {
    /**
		The identifier for the type of permission.
		*/
    type: Globals.ChildPermissionEnum;

    /**
		The value of the permission.
		*/
    value: boolean;

    /**
		Whether the permission was last set by a parent or guardian.
		*/
    isSetByParentOrGuardian: boolean;
  }

  /**
	Contract representing a request to update preferences for a child account under PnP.
	*/
  export interface BulkUpdatePreferencesForChildRequest {
    /**
		The preferences to update for the child.
		*/
    preferencesToUpdate: PnP.ChildPreference[];
  }

  /**
	Contract representing a child preference in PnP.
	*/
  export interface ChildPreference {
    /**
		The identifier for the type of preference.
		*/
    type: Globals.ChildPreferenceEnum;

    /**
		The value of the preference.
		*/
    value: boolean;
  }

  /**
	Contract representing a response for the current player's context details in PnP.
	*/
  export interface GetPlayerContextResponse {
    /**
		The response status.
		*/
    responseStatus: Globals.ResponseStatusEnum;

    /**
		The player context data for the calling user.
		*/
    playerContext: PnP.PlayerContextData;

    /**
		The list of children this player is assigned to if they are a parent or guardian.
		Note: Only applies to players who are assigned parent or guardians. Will be an empty list otherwise.
		*/
    assignedChildren: PnP.PlayerContextData[];
  }

  /**
	Contract representing a response for the current player's context details in PnP.
	*/
  export interface PlayerContextData {
    /**
		The player's bungie membership id.
		*/
    membershipId: string;

    /**
		The display name of the calling player.
		Note: Exposed for encoded membership Id requests.
		*/
    displayName: string;

    /**
		The path to the player's profile picture.
		Note: Exposed for encoded membership Id requests.
		*/
    profilePicturePath: string;

    /**
		The membership Id of the calling player's parent or guardian.
		Note: Only applies to child accounts with an assigned parent or guardian.
		*/
    parentOrGuardianMembershipId: string;

    /**
		The display name of the calling player's parent or guardian.
		Note: Only applies to child accounts with an assigned parent or guardian.
		*/
    parentOrGuardianDisplayName: string;

    /**
		The path to the parent or guardian's profile picture.
		Note: Only applies to child accounts with an assigned parent or guardian.
		*/
    parentOrGuardianProfilePicturePath: string;

    /**
		The player's date of birth.
		*/
    dateOfBirth?: string;

    /**
		Whether the player has verified their email address.
		*/
    isEmailVerified: boolean;

    /**
		The age category this player belongs to.
		*/
    ageCategory: Globals.AgeCategoriesEnum;

    /**
		The parent or guardian assignment status for this user.
		Note: Applies to both parents/guardians and children.
		*/
    parentOrGuardianAssignmentStatus: Globals.ParentOrGuardianAssignmentStatusEnum;

    /**
		The child data for this user, if they are a child with an assigned parent or guardian.
		Note: Only applies to players who have an assigned parent or guardian. Will have empty fields otherwise.
		*/
    childData: PnP.PlayerContextChildData;
  }

  /**
	Contract representing child data in a player context response object.
	*/
  export interface PlayerContextChildData {
    /**
		The preferences values for this player.
		Note: Only applies to players who have an assigned parent or guardian.
		*/
    preferences: PnP.ChildPreference[];

    /**
		The permission values for this player.
		Note: Only applies to players who have an assigned parent or guardian.
		*/
    permissions: PnP.ChildPermission[];
  }

  /**
	Response contract for retrieving a unique PnP assignment invite Url that a child can send to a parent or guardian.
	*/
  export interface GetEncodedInviteUrlSequenceResponse {
    /**
		The response status.
		*/
    responseStatus: Globals.ResponseStatusEnum;

    /**
		The generated assignment invitation url sequence.
		Note: This is a base 62 encoded sequence of characters representing the membership Id of the calling user.
		*/
    encodedSequence: string;
  }

  /**
	Contract representing the request body from a KWS webhook hit.
	*/
  export interface KwsWebhookBody {
    /**
		The name of the member who verified.
		*/
    name: string;

    /**
		The timestamp of verification, i.e., "ISO8601 timestamp"
		*/
    time: string;

    /**
		The KWS organization uuid.
		*/
    orgId: string;

    /**
		The KWS product uuid.
		*/
    productId: string;

    /**
		The KWS environment uuid.
		*/
    environmentId: string;

    /**
		The verification payload that was given to KWS.
		*/
    payload: PnP.KwsWebhookPayload;
  }

  /**
	The payload object being trasferred by KWS.
	*/
  export interface KwsWebhookPayload {
    /**
		The parent or guardian's email.
		*/
    parentEmail: string;

    /**
		The payload value.
		*/
    externalPayload: string;

    /**
		The verification status object.
		*/
    status: PnP.KwsWebhookPayloadStatus;
  }

  /**
	The KWS verification status object.
	*/
  export interface KwsWebhookPayloadStatus {
    /**
		Whether or not the user verified as an adult successfully.
		*/
    verified: boolean;

    /**
		The transaction Id.
		*/
    transactionId: string;
  }
}

class JsonpServiceInternal {
  /**
   * Gets the signed-in user.
   * @param callback The callback function name.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentUser = (
    callback: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser> =>
    ApiIntermediary.doGetRequest(
      `/JSONP/GetBungieNetUser/`,
      [["callback", callback]],
      optionalQueryAppend,
      "JSONP",
      "GetCurrentUser",
      undefined,
      clientState
    );
}

class ApplicationServiceInternal {
  /**
   * Internal method for collecting info on Applications for Cloud burst tech.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AppCloudDump = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number[]> =>
    ApiIntermediary.doGetRequest(
      `/App/AppCloudDump/`,
      [],
      optionalQueryAppend,
      "App",
      "AppCloudDump",
      undefined,
      clientState
    );

  /**
   * Trades an authorization code for access and refresh tokens.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAccessTokensFromCode = (
    input: Applications.RequestWithCode,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.ApplicationCredentials> =>
    ApiIntermediary.doPostRequest(
      `/App/GetAccessTokensFromCode/`,
      [],
      optionalQueryAppend,
      "App",
      "GetAccessTokensFromCode",
      input,
      clientState
    );

  /**
   * Trades an authorization refresh token for a fresh access and refresh token.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAccessTokensFromRefreshToken = (
    input: Applications.RequestWithRefreshToken,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.ApplicationCredentials> =>
    ApiIntermediary.doPostRequest(
      `/App/GetAccessTokensFromRefreshToken/`,
      [],
      optionalQueryAppend,
      "App",
      "GetAccessTokensFromRefreshToken",
      input,
      clientState
    );

  /**
   * Creates a new application.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateApplication = (
    input: Applications.CreateApplicationAction,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/App/CreateApplication/`,
      [],
      optionalQueryAppend,
      "App",
      "CreateApplication",
      input,
      clientState
    );

  /**
   * Returns information about the supplied application.
   * @param applicationId Identity of the application to lookup.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplication = (
    applicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.Application> =>
    ApiIntermediary.doGetRequest(
      `/App/Application/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "GetApplication",
      undefined,
      clientState
    );

  /**
   * Edit an existing application.  You must have suitable permissions in the group to perform this operation.  This only edit the fields you pass in - pass null for properties you want to leave unaltered.
   * @param applicationId ID of the application to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditApplication = (
    input: Applications.EditApplicationAction,
    applicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/App/EditApplication/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "EditApplication",
      input,
      clientState
    );

  /**
   * Returns API keys for the supplied application if the current user has permission to read those keys.
   * @param applicationId Identity of the application to lookup.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplicationApiKeys = (
    applicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.ApplicationApiKey[]> =>
    ApiIntermediary.doGetRequest(
      `/App/ApplicationApiKeys/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "GetApplicationApiKeys",
      undefined,
      clientState
    );

  /**
   * Enable, Disable, or Delete an API key.
   * @param apiKeyId ID of the API key whose state should change.
   * @param newStatus New status of the API key.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ChangeApiKeyStatus = (
    apiKeyId: number,
    newStatus: Globals.ApiKeyStatus,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/App/ChangeApiKeyState/${e(apiKeyId)}/${e(newStatus)}/`,
      [],
      optionalQueryAppend,
      "App",
      "ChangeApiKeyStatus",
      undefined,
      clientState
    );

  /**
   * Create a new API for an application.
   * @param applicationId ID of the application for which to create a new key.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateApiKey = (
    applicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.ApplicationApiKey> =>
    ApiIntermediary.doPostRequest(
      `/App/CreateApiKey/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "CreateApiKey",
      undefined,
      clientState
    );

  /**
   * Get API usage by application for time frame specified.  You can go as far back as 30 days ago, and can ask for up to a 48 hour window of time in a single request.  You must be authenticated with at least the ReadUserData permission to access this endpoint.
   * @param applicationId ID of the application to get usage statistics.
   * @param start Start time for query. Goes to 24 hours ago if not specified.
   * @param end End time for query. Goes to now if not specified.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplicationApiUsage = (
    applicationId: number,
    start: string,
    end: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.ApiUsage> =>
    ApiIntermediary.doGetRequest(
      `/App/ApiUsage/${e(applicationId)}/`,
      [
        ["start", start],
        ["end", end],
      ],
      optionalQueryAppend,
      "App",
      "GetApplicationApiUsage",
      undefined,
      clientState
    );

  /**
   * Get a paged list of authorizations linked to the supplied Bungie.net membership ID.
   * @param membershipId Membership ID whose authorizations should be fetched.
   * @param currentPage Page number (starting with 0). Each page has a fixed size of 50 items per page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAuthorizations = (
    membershipId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultAuthorization> =>
    ApiIntermediary.doGetRequest(
      `/App/Authorizations/${e(membershipId)}/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "App",
      "GetAuthorizations",
      undefined,
      clientState
    );

  /**
   * Gets a record if the specific user has ever authorized the application ID.
   * @param membershipId Membership ID whose authorizations should be fetched.
   * @param applicationId ID of the application to check.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAuthorizationForUserAndApplication = (
    membershipId: string,
    applicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.Authorization> =>
    ApiIntermediary.doGetRequest(
      `/App/Authorization/${e(membershipId)}/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "GetAuthorizationForUserAndApplication",
      undefined,
      clientState
    );

  /**
   * Revoke a previously authorized application so that the refresh token it was issued will no longer function.
   * @param membershipId Membership ID of the user whose authorizations should be revoked.
   * @param applicationId ID of the application to revoke.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RevokeAuthorization = (
    membershipId: string,
    applicationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/App/RevokeAuthorization/${e(membershipId)}/${e(applicationId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "RevokeAuthorization",
      undefined,
      clientState
    );

  /**
   * Get list of applications created by Bungie.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieApplications = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.Application[]> =>
    ApiIntermediary.doGetRequest(
      `/App/FirstParty/`,
      [],
      optionalQueryAppend,
      "App",
      "GetBungieApplications",
      undefined,
      clientState
    );

  /**
   * Search for public applications.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApplicationSearch = (
    input: Applications.ApplicationQuery,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultApplication> =>
    ApiIntermediary.doPostRequest(
      `/App/Search/`,
      [],
      optionalQueryAppend,
      "App",
      "ApplicationSearch",
      input,
      clientState
    );

  /**
   * Search for applications owned by particular members, including those marked private.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static PrivateApplicationSearch = (
    input: Applications.ApplicationQuery,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultApplication> =>
    ApiIntermediary.doPostRequest(
      `/App/PrivateSearch/`,
      [],
      optionalQueryAppend,
      "App",
      "PrivateApplicationSearch",
      input,
      clientState
    );

  /**
   * Endpoint provides tokens based on OAuth 2.0 specification
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetOAuthTokens = (
    input: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.OAuthTokenResponse> =>
    ApiIntermediary.doPostRequest(
      `/App/oauth/token/`,
      [],
      optionalQueryAppend,
      "App",
      "GetOAuthTokens",
      input,
      clientState
    );

  /**
   * Endpoint provides client_credential grant tokens for the purposes of service accounts.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetOAuthClientCredentialToken = (
    input: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.OAuthClientCredentialTokenResponse> =>
    ApiIntermediary.doPostRequest(
      `/App/oauth/service/token/`,
      [],
      optionalQueryAppend,
      "App",
      "GetOAuthClientCredentialToken",
      input,
      clientState
    );

  /**
   * Endpoint provides a device type value for applications where applicable.
   * @param apiKey An api key.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplicationDeviceTypeByApiKey = (
    apiKey: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ClientDeviceType> =>
    ApiIntermediary.doGetRequest(
      `/App/GetApplicationDeviceTypeByApiKey/${e(apiKey)}/`,
      [],
      optionalQueryAppend,
      "App",
      "GetApplicationDeviceTypeByApiKey",
      undefined,
      clientState
    );

  /**
   * Endpoint returns an application based on the api key id.
   * @param apiKeyId An api key id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplicationByApiKeyId = (
    apiKeyId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Applications.Application> =>
    ApiIntermediary.doGetRequest(
      `/App/GetApplicationByApiKeyId/${e(apiKeyId)}/`,
      [],
      optionalQueryAppend,
      "App",
      "GetApplicationByApiKeyId",
      undefined,
      clientState
    );
}

class UserServiceInternal {
  /**
   * Returns the current user's auth context state information for this session.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentUserAuthContextState = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserAuthContextResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/CurrentAuthContextSessionState/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCurrentUserAuthContextState",
      undefined,
      clientState
    );

  /**
   * Creates a new user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateUser = (
    input: Contract.CreateBungieProfileRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.UserDetail> =>
    ApiIntermediary.doPostRequest(
      `/User/CreateUser/`,
      [],
      optionalQueryAppend,
      "User",
      "CreateUser",
      input,
      clientState
    );

  /**
   * Creates an email only new user - they can't sign in, but they are signed up for basic emails.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateEmailUser = (
    input: Contract.CreateEmailUserRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/CreateEmailUser/`,
      [],
      optionalQueryAppend,
      "User",
      "CreateEmailUser",
      input,
      clientState
    );

  /**
   * Generates and returns a url that that caller can redirect to help.bungie.net as an authenticated user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ZendeskHelpAuthenticate = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doGetRequest(
      `/User/ZendeskHelpAuthenticate/`,
      [],
      optionalQueryAppend,
      "User",
      "ZendeskHelpAuthenticate",
      undefined,
      clientState
    );

  /**
   * Returns an array of valid friend invite URLs for the authenticated user based on their cohort ACL.
   * @param cohortIdentifier Cohort enum string or token
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMarathonFriendInviteUrls = (
    cohortIdentifier: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetMarathonFriendInviteUrls/${e(cohortIdentifier)}`,
      [],
      optionalQueryAppend,
      "User",
      "GetMarathonFriendInviteUrls",
      undefined,
      clientState
    );

  /**
   * Decodes a Marathon invite token and returns invite details.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static DecodeInviteToken = (
    input: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.MarathonInviteTokenResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/DecodeInviteToken`,
      [],
      optionalQueryAppend,
      "User",
      "DecodeInviteToken",
      input,
      clientState
    );

  /**
   * Updates a user based on the current logged in user info.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateUser = (
    input: Contract.UserEditRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/UpdateUser/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateUser",
      input,
      clientState
    );

  /**
   * Returns the number of name changes available to the signed in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static NameChangesAvailable = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/User/NameChangesAvailable/`,
      [],
      optionalQueryAppend,
      "User",
      "NameChangesAvailable",
      undefined,
      clientState
    );

  /**
   * Given a bungie name, does every validation step for changing the name, including having available name changes, but doesn't actually commit the change.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ValidateBungieName = (
    input: User.UserNameEditRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/ValidateBungieName/`,
      [],
      optionalQueryAppend,
      "User",
      "ValidateBungieName",
      input,
      clientState
    );

  /**
   * Changes the signed in user's bungie name assuming it passes validation, including the user having available name changes. Duplicates identical functionality in UpdateUser.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ChangeBungieName = (
    input: User.UserNameEditRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserNameEditResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ChangeBungieName/`,
      [],
      optionalQueryAppend,
      "User",
      "ChangeBungieName",
      input,
      clientState
    );

  /**
   * Validates a users email.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ValidateEmail = (
    input: User.UserEmailVerificationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserEmailVerificationResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ValidateEmail/`,
      [],
      optionalQueryAppend,
      "User",
      "ValidateEmail",
      input,
      clientState
    );

  /**
   * Unsubscribes a users email.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnsubscribeEmail = (
    input: User.UserEmailVerificationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserEmailVerificationResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/UnsubscribeEmail/`,
      [],
      optionalQueryAppend,
      "User",
      "UnsubscribeEmail",
      input,
      clientState
    );

  /**
   * Requests another validation email be sent if the current user's email is not validated.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RevalidateEmail = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserEmailVerificationResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/RevalidateEmail/`,
      [],
      optionalQueryAppend,
      "User",
      "RevalidateEmail",
      undefined,
      clientState
    );

  /**
   * Updates the user's destiny emblem selection, or clears it if the values are zero'd out.  Returns new avatar relative url.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateDestinyEmblemAvatar = (
    input: User.DestinyEmblemSourceRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/User/UpdateDestinyEmblemAvatar/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateDestinyEmblemAvatar",
      input,
      clientState
    );

  /**
   * Updates a user based on parameter, requires an admin.
   * @param membershipId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateUserAdmin = (
    input: Contract.UserEditRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/UpdateUserAdmin/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateUserAdmin",
      input,
      clientState
    );

  /**
   * Updates a notification setting for the current user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateNotificationSetting = (
    input: Notifications.NotificationUpdateRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/Notification/Update/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateNotificationSetting",
      input,
      clientState
    );

  /**
   * Updates message flags for the 'success' category of UI messages for a user.
   * @param flags The new flags value for this user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditSuccessMessageFlags = (
    flags: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/MessageFlags/Success/Update/${e(flags)}/`,
      [],
      optionalQueryAppend,
      "User",
      "EditSuccessMessageFlags",
      undefined,
      clientState
    );

  /**
   * Retrieves a user's birthdate or native country used for age gating. Requires an admin.
   * @param membershipId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserBirthdayAndCountryAdmin = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.UserBirthdayAndCountryResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/GetUserBirthdayAndCountryAdmin/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetUserBirthdayAndCountryAdmin",
      undefined,
      clientState
    );

  /**
   * Edits a user's birthdate or native country used for age gating. Requires an admin.
   * @param membershipId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditBirthdayOrCountryAdmin = (
    input: Contract.UserBirthdayOrCountryEditRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/EditBirthdayOrCountry/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "EditBirthdayOrCountryAdmin",
      input,
      clientState
    );

  /**
   * Edits a user's birthdate and native country used for age gating.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditBirthdayAndCountry = (
    input: Contract.UserBirthdayOrCountryEditRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/EditBirthdayAndCountry/`,
      [],
      optionalQueryAppend,
      "User",
      "EditBirthdayAndCountry",
      input,
      clientState
    );

  /**
   * Removes a user's birthdate and native country from their user details. Requires an admin.
   * @param membershipId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RemoveBirthdayAndCountryAdmin = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/User/RemoveBirthdayAndCountry/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "RemoveBirthdayAndCountryAdmin",
      undefined,
      clientState
    );

  /**
   * Gets user details of signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.UserDetail> =>
    ApiIntermediary.doGetRequest(
      `/User/GetBungieNetUser/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCurrentUser",
      undefined,
      clientState
    );

  /**
   * Gets relevant counts for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCountsForCurrentUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.UserCounts> =>
    ApiIntermediary.doGetRequest(
      `/User/GetCounts/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCountsForCurrentUser",
      undefined,
      clientState
    );

  /**
   * Gets basic profile information for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentBungieNetUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser> =>
    ApiIntermediary.doGetRequest(
      `/User/GetCurrentBungieNetUser/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCurrentBungieNetUser",
      undefined,
      clientState
    );

  /**
   * Loads a bungienet user by membership id.
   * @param id The requested Bungie.net membership id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieNetUserById = (
    id: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser> =>
    ApiIntermediary.doGetRequest(
      `/User/GetBungieNetUserById/${e(id)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetBungieNetUserById",
      undefined,
      clientState
    );

  /**
   * Gets user information for the signed-in user specifically for the forum.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetForumUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ForumUser> =>
    ApiIntermediary.doGetRequest(
      `/User/GetForumUser/`,
      [],
      optionalQueryAppend,
      "User",
      "GetForumUser",
      undefined,
      clientState
    );

  /**
   * Gets a list of all display names linked to this membership id but sanitized (profanity filtered). Obeys all visibility rules of calling user and is heavily cached.
   * @param membershipId The requested membership id to load.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetSanitizedPlatformDisplayNames = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/User/GetSanitizedPlatformDisplayNames/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetSanitizedPlatformDisplayNames",
      undefined,
      clientState
    );

  /**
   * Obsolete User Search function - no longer returns results.
   * @param q The search string.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchUsers = (
    q: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser[]> =>
    ApiIntermediary.doGetRequest(
      `/User/SearchUsers/`,
      [["q", q]],
      optionalQueryAppend,
      "User",
      "SearchUsers",
      undefined,
      clientState
    );

  /**
   * Obsolete - This user search function is no longer supported.
   * @param searchString The search string.
   * @param currentPage
   * @param itemsPerPage The number of users per page to return (capped at 50) DEPRECATED - we'll give you what we've configured to be a reasonable # of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchUsersPagedV2 = (
    searchString: string,
    currentPage: number,
    itemsPerPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGeneralUser> =>
    ApiIntermediary.doGetRequest(
      `/User/SearchUsersPaged/${e(searchString)}/${e(currentPage)}/${e(
        itemsPerPage
      )}/`,
      [],
      optionalQueryAppend,
      "User",
      "SearchUsersPagedV2",
      undefined,
      clientState
    );

  /**
   * Returns this users notification settings.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetNotificationSettings = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.NotificationSetting[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetNotificationSettings/`,
      [],
      optionalQueryAppend,
      "User",
      "GetNotificationSettings",
      undefined,
      clientState
    );

  /**
   * Returns a list of credential types attached to the caller's account
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCredentialTypesForAccount = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.GetCredentialTypesForAccountResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetCredentialTypesForAccount/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCredentialTypesForAccount",
      undefined,
      clientState
    );

  /**
   * Returns a list of credential types attached to the requested account
   * @param membershipId The user's membership id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCredentialTypesForTargetAccount = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.GetCredentialTypesForAccountResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetCredentialTypesForTargetAccount/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetCredentialTypesForTargetAccount",
      undefined,
      clientState
    );

  /**
   * Returns a list of all available avatars for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableAvatars = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: number]: string }> =>
    ApiIntermediary.doGetRequest(
      `/User/GetAvailableAvatars/`,
      [],
      optionalQueryAppend,
      "User",
      "GetAvailableAvatars",
      undefined,
      clientState
    );

  /**
   * Returns a list of all available avatars for a specific user, but includes admin avatars.  Signed in user must have edit all users acl.
   * @param membershipId BungieNet membership ID of the user to lookup.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableAvatarsAdmin = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: number]: string }> =>
    ApiIntermediary.doGetRequest(
      `/User/GetAvailableAvatarsAdmin/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetAvailableAvatarsAdmin",
      undefined,
      clientState
    );

  /**
   * Returns a list of all available user themes.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableThemes = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Config.UserTheme[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetAvailableThemes/`,
      [],
      optionalQueryAppend,
      "User",
      "GetAvailableThemes",
      undefined,
      clientState
    );

  /**
   * Allows a user to pair a mobile app to their account.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RegisterMobileAppPair = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/RegisterMobileAppPair/`,
      [],
      optionalQueryAppend,
      "User",
      "RegisterMobileAppPair",
      undefined,
      clientState
    );

  /**
   * Allows a user to unregister a mobile app from their account, given the appType and a specific pairId.
   * @param appType The mobile app type the user wishes to deauthorize.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnregisterMobileAppPair = (
    input: string,
    appType: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/UnregisterMobileAppPair/${e(appType)}/`,
      [],
      optionalQueryAppend,
      "User",
      "UnregisterMobileAppPair",
      input,
      clientState
    );

  /**
   * Allows a user to unregister from every Bungie.Net Mobile Companion App session and push notification pairing, useful for when you've lost your device or if it has been stolen.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CloseAllCompanionSessions = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/Companion/CloseAllSessions/`,
      [],
      optionalQueryAppend,
      "User",
      "CloseAllCompanionSessions",
      undefined,
      clientState
    );

  /**
   * Allows a user to pair a mobile app to their account.
   * @param pairwithinput If true, execute the mobile pairing using the MobileAppPairing data, and not cookie information.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateStateInfoForMobileAppPair = (
    input: User.MobileAppPairing,
    pairwithinput: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/UpdateStateInfoForMobileAppPair/`,
      [["pairwithinput", pairwithinput]],
      optionalQueryAppend,
      "User",
      "UpdateStateInfoForMobileAppPair",
      input,
      clientState
    );

  /**
   * Gets a user's mobile app pairing states without using the cache.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMobileAppPairingsUncached = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.MobileAppPairing[]> =>
    ApiIntermediary.doGetRequest(
      `/User/GetMobileAppPairingsUncached/`,
      [],
      optionalQueryAppend,
      "User",
      "GetMobileAppPairingsUncached",
      undefined,
      clientState
    );

  /**
   * Links a credential to the current user's profile, overriding any existing link.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LinkOverride = (
    input: Contract.LinkOverrideInput,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/LinkOverride/`,
      [],
      optionalQueryAppend,
      "User",
      "LinkOverride",
      input,
      clientState
    );

  /**
   * Returns a list of accounts associated with the supplied membership ID and membership type. This will include all linked accounts (even when hidden) if supplied credentials permit it.
   * @param membershipId The membership ID of the target user.
   * @param membershipType Type of the supplied membership ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMembershipDataById = (
    membershipId: string,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserMembershipData> =>
    ApiIntermediary.doGetRequest(
      `/User/GetMembershipsById/${e(membershipId)}/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetMembershipDataById",
      undefined,
      clientState
    );

  /**
   * Returns a list of accounts associated with signed in user. This is useful for OAuth implementations that do not give you access to the token response.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMembershipDataForCurrentUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserMembershipData> =>
    ApiIntermediary.doGetRequest(
      `/User/GetMembershipsForCurrentUser/`,
      [],
      optionalQueryAppend,
      "User",
      "GetMembershipDataForCurrentUser",
      undefined,
      clientState
    );

  /**
   * Notes an item as acknowledged by the user.
   * @param ackId Acknowledgement Id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetAcknowledged = (
    ackId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/Acknowledged/${e(ackId)}/`,
      [],
      optionalQueryAppend,
      "User",
      "SetAcknowledged",
      undefined,
      clientState
    );

  /**
   * Returns whether the current user has subscribed to an email subscription or not.
   * @param subscription The subscription for this user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetSubscriptionStatusForCurrentUser = (
    subscription: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/User/Subscriptions/${e(subscription)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetSubscriptionStatusForCurrentUser",
      undefined,
      clientState
    );

  /**
   * Inititates the migration process for an authenticated account that has linked credentials meeting the proper criteria.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static InitiateBlizzardToSteamDestinyMigration = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.BlizzardToSteamMigrationStatusResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/InitiateBlizzardToSteamDestinyMigration/`,
      [],
      optionalQueryAppend,
      "User",
      "InitiateBlizzardToSteamDestinyMigration",
      undefined,
      clientState
    );

  /**
   * Gets the current status of the migration process for the currently authenticated account, based on either the blizzard or steam credential.
   * @param basis The credential to basis the migration history off of.  Either BattleNetId or SteamId.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBlizzardToSteamDestinyMigrationStatus = (
    basis: Globals.BungieCredentialType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.BlizzardToSteamMigrationStatusResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/GetBlizzardToSteamDestinyMigrationStatus/${e(basis)}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetBlizzardToSteamDestinyMigrationStatus",
      undefined,
      clientState
    );

  /**
   * Gets any hard linked membership given a credential.  Only works for credentials that are public (just SteamID64 right now). Cross Save aware.
   * @param crType The credential type. 'SteamId' is the only valid value at present.
   * @param credential The credential to look up. Must be a valid SteamID64.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMembershipFromHardLinkedCredential = (
    crType: Globals.BungieCredentialType,
    credential: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.HardLinkedUserMembership> =>
    ApiIntermediary.doGetRequest(
      `/User/GetMembershipFromHardLinkedCredential/${e(crType)}/${e(
        credential
      )}/`,
      [],
      optionalQueryAppend,
      "User",
      "GetMembershipFromHardLinkedCredential",
      undefined,
      clientState
    );

  /**
   * Adds a given phone number to the user database
   * @param phoneNumber Phone number, unformatted, including country code (without plus sign).
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AddPhoneNumber = (
    phoneNumber: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserPhoneResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/AddPhoneNumber/${e(phoneNumber)}/`,
      [],
      optionalQueryAppend,
      "User",
      "AddPhoneNumber",
      undefined,
      clientState
    );

  /**
   * Inititates the sending of a one time code by SMS to a given phone number for verification purposes.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SendPhoneVerificationMessage = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserPhoneResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/SendPhoneVerificationMessage/`,
      [],
      optionalQueryAppend,
      "User",
      "SendPhoneVerificationMessage",
      undefined,
      clientState
    );

  /**
   * Inititates the process of validating a phone number and linking it to a bungie.net account.
   * @param oneTimeCode 6-digit numeric code sent to phone.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CheckPhoneValidation = (
    oneTimeCode: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserPhoneResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/CheckPhoneValidation/${e(oneTimeCode)}/`,
      [],
      optionalQueryAppend,
      "User",
      "CheckPhoneValidation",
      undefined,
      clientState
    );

  /**
   * Removes a connected phone number from a bungie.net id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RemovePhoneNumber = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/RemovePhoneNumber/`,
      [],
      optionalQueryAppend,
      "User",
      "RemovePhoneNumber",
      undefined,
      clientState
    );

  /**
   * Returns SMS validation status for a given account
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetSmsValidationStatus = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserPhoneResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/GetSmsValidationStatus/`,
      [],
      optionalQueryAppend,
      "User",
      "GetSmsValidationStatus",
      undefined,
      clientState
    );

  /**
   * [OBSOLETE] Do not use this to search users, use SearchByGlobalNamePost instead.
   * @param displayNamePrefix The display name prefix you're looking for.
   * @param page The zero-based page of results you desire.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchByGlobalNamePrefix = (
    displayNamePrefix: string,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/Search/Prefix/${e(displayNamePrefix)}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "User",
      "SearchByGlobalNamePrefix",
      undefined,
      clientState
    );

  /**
   * Given the prefix of a global display name, returns all users who share that name.
   * @param page The zero-based page of results you desire.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchByGlobalNamePost = (
    input: User.UserSearchPrefixRequest,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserSearchResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/Search/GlobalName/${e(page)}/`,
      [],
      optionalQueryAppend,
      "User",
      "SearchByGlobalNamePost",
      input,
      clientState
    );

  /**
   * Sets the parental control attribute flags for the authenticated user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetParentalControlFlags = (
    input: User.SetParentalControlFlagsRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/SetFlags/`,
      [],
      optionalQueryAppend,
      "User",
      "SetParentalControlFlags",
      input,
      clientState
    );

  /**
   * Returns the bungie id of a designated membership id for parental controls. Requires valid service auth context and User Pii Read scope.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieIdFromMembershipIdForParentalControls = (
    input: User.ParentalControlsIdRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/GetBungieId/`,
      [],
      optionalQueryAppend,
      "User",
      "GetBungieIdFromMembershipIdForParentalControls",
      input,
      clientState
    );

  /**
   * Returns the list of all membership ids of a designated bungie id for parental controls.  Also returns Cross Save Information. Requires valid service auth context and User Pii Read scope.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMembershipIdMappingFromBungieIdForParentalControls = (
    input: User.ParentalControlsIdRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserInfoCard[]> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/GetMembershipIdMappingFromBungieId/`,
      [],
      optionalQueryAppend,
      "User",
      "GetMembershipIdMappingFromBungieIdForParentalControls",
      input,
      clientState
    );

  /**
   * Links the calling account as the guardian of the requested child.
   * @param childMembershipId The membership Id of the child to link.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LinkParentalControlGuardian = (
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsLinkGuardianResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/${e(childMembershipId)}/LinkGuardian/`,
      [],
      optionalQueryAppend,
      "User",
      "LinkParentalControlGuardian",
      undefined,
      clientState
    );

  /**
   * Revokes the parental control guardian status of the calling account.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnlinkParentalControlGuardian = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsUnlinkGuardianResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/UnlinkGuardian/`,
      [],
      optionalQueryAppend,
      "User",
      "UnlinkParentalControlGuardian",
      undefined,
      clientState
    );

  /**
   * Returns a child account in the context of parental controls
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerContextForParentalControls = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsGetPlayerContextResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/ParentalControls/Player/`,
      [],
      optionalQueryAppend,
      "User",
      "GetPlayerContextForParentalControls",
      undefined,
      clientState
    );

  /**
   * Updates child permissions in the context of parental controls.
   * @param childMembershipId The membership Id of the child to update permissions for.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateParentalControlPermissionsForChild = (
    input: ParentalControls.ParentalControlsUpdatePermissionsForChildRequest,
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    ParentalControls.ParentalControlsUpdatePermissionsForChildResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/${e(childMembershipId)}/Permissions/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateParentalControlPermissionsForChild",
      input,
      clientState
    );

  /**
   * Retrieves the requested child's preferences.
   * @param childMembershipId The membership Id of the child to get preferences for.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetParentalControlPreferencesForChild = (
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsGetPreferencesForChildResponse> =>
    ApiIntermediary.doGetRequest(
      `/User/ParentalControls/${e(childMembershipId)}/Preferences/`,
      [],
      optionalQueryAppend,
      "User",
      "GetParentalControlPreferencesForChild",
      undefined,
      clientState
    );

  /**
   * Updates, or creates if they do not exist, preferences for the requested child.
   * @param childMembershipId The membership Id of the child to update preferences for.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateParentalControlPreferencesForChild = (
    input: ParentalControls.ParentalControlsUpdatePreferencesForChildRequest,
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    ParentalControls.ParentalControlsUpdatePreferencesForChildResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/${e(childMembershipId)}/Preferences/`,
      [],
      optionalQueryAppend,
      "User",
      "UpdateParentalControlPreferencesForChild",
      input,
      clientState
    );

  /**
   * Parental controls webhook for Kids Web Services (KWS).
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ParentalControlKWSWebhook = (
    input: ParentalControls.ParentalControlsKWSWebhookRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsKWSWebhookResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/KWSWebhook/`,
      [],
      optionalQueryAppend,
      "User",
      "ParentalControlKWSWebhook",
      input,
      clientState
    );

  /**
   * Retrieves a temporary BungieNet token from BNet for parental controls.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieNetTokenForParentalControls = (
    input: ParentalControls.ParentalControlsTokenRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsTokenResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/BungieNetToken/`,
      [],
      optionalQueryAppend,
      "User",
      "GetBungieNetTokenForParentalControls",
      input,
      clientState
    );

  /**
   * Retrieves a temporary refresh token from BNet for parental controls.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieRefreshTokenForParentalControls = (
    input: ParentalControls.ParentalControlsTokenRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ParentalControls.ParentalControlsTokenResponse> =>
    ApiIntermediary.doPostRequest(
      `/User/ParentalControls/BungieRefreshToken/`,
      [],
      optionalQueryAppend,
      "User",
      "GetBungieRefreshTokenForParentalControls",
      input,
      clientState
    );
}

class MessageServiceInternal {
  /**
   * Returns a conversation sent to the current logged in user.
   * @param conversationId
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationByIdV2 = (
    conversationId: string,
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageConversationResponse> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationByIdV2/${e(conversationId)}/`,
      [["format", format]],
      optionalQueryAppend,
      "Message",
      "GetConversationByIdV2",
      undefined,
      clientState
    );

  /**
   * Returns a conversation sent to the current logged in user and another member.
   * @param membershipId
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationWithMemberIdV2 = (
    membershipId: string,
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageConversationResponse> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationWithMemberV2/${e(membershipId)}/`,
      [["format", format]],
      optionalQueryAppend,
      "Message",
      "GetConversationWithMemberIdV2",
      undefined,
      clientState
    );

  /**
   * Returns the thread between all current users in the conversation.
   * @param conversationId ID of the conversation whose messages are needed.
   * @param page Page of the returned messages. Page 1 has the most recent messages.
   * @param format Unused
   * @param before Only return messages for this conversation whose ID is lower than supplied value. Omit, or use long.MaxValue to get all messages.
   * @param after Only return messages for this conversation whose ID is larger supplied value. Omit, or use 0 to get all messages.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationThreadV3 = (
    conversationId: string,
    page: number,
    format: Globals.TemplateFormat,
    before: string,
    after: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageSearchResult> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationThreadV3/${e(conversationId)}/${e(page)}/`,
      [
        ["format", format],
        ["before", before],
        ["after", after],
      ],
      optionalQueryAppend,
      "Message",
      "GetConversationThreadV3",
      undefined,
      clientState
    );

  /**
   * Creates a message based on the current logged in user info.  Use SaveMessageV3 for saving a message to a known conversation, and CreateConversation for making a new conversation.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SaveMessageV3 = (
    input: Requests.SaveMessageForConversationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/Message/SaveMessageV3/`,
      [],
      optionalQueryAppend,
      "Message",
      "SaveMessageV3",
      input,
      clientState
    );

  /**
   * Creates a message based on the current logged in user info.  Use SaveMessageV4 for saving a message to a known conversation, and CreateConversation for making a new conversation.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SaveMessageV4 = (
    input: Requests.SaveMessageForConversationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.SaveMessageResult> =>
    ApiIntermediary.doPostRequest(
      `/Message/SaveMessageV4/`,
      [],
      optionalQueryAppend,
      "Message",
      "SaveMessageV4",
      input,
      clientState
    );

  /**
   * Indicates the user is typing in an indicated conversation window.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UserIsTyping = (
    input: Requests.UserIsTypingRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/Message/UserIsTyping/`,
      [],
      optionalQueryAppend,
      "Message",
      "UserIsTyping",
      input,
      clientState
    );

  /**
   * Creates a message based on the current logged in user info, and the people to whom the message should be sent.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateConversation = (
    input: Requests.CreateConversationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/Message/CreateConversation/`,
      [],
      optionalQueryAppend,
      "Message",
      "CreateConversation",
      input,
      clientState
    );

  /**
   * Creates a message based on the current logged in user info, and the people to whom the message should be sent. Returns both new message ID and conversation ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateConversationV2 = (
    input: Requests.CreateConversationRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.SaveMessageResult> =>
    ApiIntermediary.doPostRequest(
      `/Message/CreateConversationV2/`,
      [],
      optionalQueryAppend,
      "Message",
      "CreateConversationV2",
      input,
      clientState
    );

  /**
   * Returns conversations sent to the current logged in user.  No longer returns External Conversations.
   * @param page Page 1 is the first page of results
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationsV5 = (
    page: number,
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageConversationSearchResult> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationsV5/${e(page)}/`,
      [["format", format]],
      optionalQueryAppend,
      "Message",
      "GetConversationsV5",
      undefined,
      clientState
    );

  /**
   * Returns group conversations sent to the current logged in user.
   * @param page
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupConversations = (
    page: number,
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageConversationSearchResult> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetGroupConversations/${e(page)}/`,
      [["format", format]],
      optionalQueryAppend,
      "Message",
      "GetGroupConversations",
      undefined,
      clientState
    );

  /**
   * Returns group conversations sent to the current logged in user.
   * @param groupType The type of group to access.
   * @param page The one-based page to retrieve
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupConversationsV2 = (
    groupType: Globals.GroupType,
    page: number,
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.MessageConversationSearchResult> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetGroupConversationsV2/${e(groupType)}/${e(page)}/`,
      [["format", format]],
      optionalQueryAppend,
      "Message",
      "GetGroupConversationsV2",
      undefined,
      clientState
    );

  /**
   * Returns the unread count for the current user, including unread external conversations. Basically does what GetUnreadConversationCountV3 did, but with a less confusing name.  I know, don't judge me.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTotalConversationCount = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetTotalConversationCount/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetTotalConversationCount",
      undefined,
      clientState
    );

  /**
   * Returns the unread count for the current user, excluding unread external conversations.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUnreadConversationCountV4 = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetUnreadConversationCountV4/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetUnreadConversationCountV4",
      undefined,
      clientState
    );

  /**
   * Returns the unread count for the current user's group conversations.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUnreadGroupConversationCount = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetUnreadGroupConversationCount/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetUnreadGroupConversationCount",
      undefined,
      clientState
    );

  /**
   * Returns the unread count and conversation ids that have unread messages for the current user's group conversations of a particular group type.
   * @param groupType The type of group conversations to access.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CheckGroupConversationReadState = (
    groupType: Globals.GroupType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.UnreadConversationCountResult> =>
    ApiIntermediary.doGetRequest(
      `/Message/CheckGroupConversationReadState/${e(groupType)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "CheckGroupConversationReadState",
      undefined,
      clientState
    );

  /**
   * Removes the logged in user from the conversation.
   * @param conversationId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LeaveConversation = (
    conversationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Message/LeaveConversation/${e(conversationId)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "LeaveConversation",
      undefined,
      clientState
    );

  /**
   * Reviews a list of request invitations, checking whether you have the requisite permission to do so.
   * @param responseState
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReviewInvitations = (
    input: Entities.EntityList,
    responseState: Globals.InvitationResponseState,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/Message/Invitations/ReviewListDirect/${e(responseState)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "ReviewInvitations",
      input,
      clientState
    );

  /**
   * Reviews a list of request invitations, checking whether you have the requisite permission to do so.
   * @param invitationType
   * @param responseState
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReviewAllInvitations = (
    invitationType: Globals.InvitationType,
    responseState: Globals.InvitationResponseState,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/Message/Invitations/ReviewAllDirect/${e(invitationType)}/${e(
        responseState
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "ReviewAllInvitations",
      undefined,
      clientState
    );

  /**
   * Reviews the given Invitation, checking whether you have the requisite permission to do so.
   * @param invitationId
   * @param responseState
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReviewInvitationDirect = (
    invitationId: string,
    responseState: Globals.InvitationResponseState,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Invitations.Invitation> =>
    ApiIntermediary.doPostRequest(
      `/Message/Invitations/ReviewDirect/${e(invitationId)}/${e(
        responseState
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "ReviewInvitationDirect",
      undefined,
      clientState
    );

  /**
   * Reviews the given Invitation.
   * @param invitationId
   * @param responseCode
   * @param responseState
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReviewInvitation = (
    invitationId: string,
    responseCode: string,
    responseState: Globals.InvitationResponseState,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Invitations.Invitation> =>
    ApiIntermediary.doPostRequest(
      `/Message/Invitations/${e(invitationId)}/${e(responseCode)}/${e(
        responseState
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "ReviewInvitation",
      undefined,
      clientState
    );

  /**
   * Returns pending requests from other groups to join your Group's Alliance.
   * @param groupId
   * @param page
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAllianceJoinInvitations = (
    groupId: string,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.GroupInvitationSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Message/AllianceInvitations/RequestsToJoinYourGroup/${e(groupId)}/${e(
        page
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetAllianceJoinInvitations",
      undefined,
      clientState
    );

  /**
   * Returns pending invitations to join another Group's Alliance.
   * @param groupId
   * @param page
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAllianceInvitedToJoinInvitations = (
    groupId: string,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.GroupInvitationSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Message/AllianceInvitations/InvitationsToJoinAnotherGroup/${e(
        groupId
      )}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetAllianceInvitedToJoinInvitations",
      undefined,
      clientState
    );

  /**
   * Get your response code for an invitation, if you have one.  If you don't, go away please.  K thanks.
   * @param invitationId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetInvitationDetails = (
    invitationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Invitations.InvitationResponseCodeDetail> =>
    ApiIntermediary.doGetRequest(
      `/Message/Invitations/${e(invitationId)}/Details/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetInvitationDetails",
      undefined,
      clientState
    );

  /**
   * Marks all private and group conversations as being seen, reducing their unread counter to zero without marking them as being read.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateConversationLastViewedTimestamp = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Message/Conversations/UpdateLastViewedTimestamp/`,
      [],
      optionalQueryAppend,
      "Message",
      "UpdateConversationLastViewedTimestamp",
      undefined,
      clientState
    );

  /**
   * Allows a group admin to delete a message posted to the group wall.
   * @param groupId The group id of the wall being moderated.
   * @param messageId The id of the message to delete.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ModerateGroupWall = (
    groupId: string,
    messageId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Message/ModerateGroupWall/${e(groupId)}/${e(messageId)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "ModerateGroupWall",
      undefined,
      clientState
    );

  /**
   * For group conversations, sets the notification preference for the user.
   * @param conversationId The conversation id of the group conversation having its notification setting changed.
   * @param enableNotify The new state of the user's notification preference for this conversation.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetUserNotifyPreferenceForConversation = (
    conversationId: string,
    enableNotify: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Message/SetUserNotifyPreferenceForConversation/${e(conversationId)}/${e(
        enableNotify
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "SetUserNotifyPreferenceForConversation",
      undefined,
      clientState
    );

  /**
   * Returns the unread count for the current user
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUnreadConversationCountV2 = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetUnreadPrivateConversationCount/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetUnreadConversationCountV2",
      undefined,
      clientState
    );

  /**
   * Returns a conversation sent to the current logged in user.
   * @param conversationId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationById = (
    conversationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Legacy.LegacyConversationV2> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationById/${e(conversationId)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetConversationById",
      undefined,
      clientState
    );

  /**
   * Returns a conversation sent to the current logged in user and another member.
   * @param membershipId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationWithMemberId = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Legacy.LegacyConversationV2> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationWithMember/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetConversationWithMemberId",
      undefined,
      clientState
    );

  /**
   * Creates a message based on the current logged in user info.  More explicit APIs have replaced this one: use those instead. (SaveMessageV3 for saving a message to a known conversation, and CreateConversation for making a new conversation.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SaveMessageV2 = (
    input: Legacy.LegacySaveMessageRequestV2,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/Message/SaveMessageV2/`,
      [],
      optionalQueryAppend,
      "Message",
      "SaveMessageV2",
      input,
      clientState
    );

  /**
   * Returns conversations sent to the current logged in user.  Use V4 instead for an integrated chat with groups and private conversations.
   * @param page
   * @param pagesize
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationsV2 = (
    page: number,
    pagesize: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Legacy.LegacyConversationV2[]> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationsV2/${e(page)}/${e(pagesize)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetConversationsV2",
      undefined,
      clientState
    );

  /**
   * Returns conversations sent to the current logged in user.  Includes the count of new messages.  Use V4 for a more compact and useful result object.
   * @param page
   * @param pagesize
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationsV3 = (
    page: number,
    pagesize: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Legacy.LegacyConversationResponse> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationsV3/${e(page)}/${e(pagesize)}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetConversationsV3",
      undefined,
      clientState
    );

  /**
   * Returns the thread between all current users in the conversation.  Rendered obsolete by GetConversationThreadV3, which has a more compact result format.
   * @param conversationId ID of the conversation whose message data you are fetching
   * @param page Page number to fetch.
   * @param pagesize Number of messages per page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetConversationThreadV2 = (
    conversationId: string,
    page: number,
    pagesize: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Legacy.LegacyConversationMessageV2[]> =>
    ApiIntermediary.doGetRequest(
      `/Message/GetConversationThreadV2/${e(conversationId)}/${e(page)}/${e(
        pagesize
      )}/`,
      [],
      optionalQueryAppend,
      "Message",
      "GetConversationThreadV2",
      undefined,
      clientState
    );
}

class NotificationServiceInternal {
  /**
   * Gets the recent notifications for the signed in user.
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRecentNotifications = (
    format: Globals.TemplateFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Notifications.NotificationResponse> =>
    ApiIntermediary.doGetRequest(
      `/Notification/GetRecent/`,
      [["format", format]],
      optionalQueryAppend,
      "Notification",
      "GetRecentNotifications",
      undefined,
      clientState
    );

  /**
   * Gets the number of new notifications for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRecentNotificationCount = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Notification/GetCount/`,
      [],
      optionalQueryAppend,
      "Notification",
      "GetRecentNotificationCount",
      undefined,
      clientState
    );

  /**
   * Resets the notification list for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ResetNotification = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Notification/Reset/`,
      [],
      optionalQueryAppend,
      "Notification",
      "ResetNotification",
      undefined,
      clientState
    );

  /**
   * Creates a long held pending GET response.
   * @param ack Value of the last sequence number seen in a response from the server
   * @param tab ID of the tab making the request.
   * @param timeout The amount of time before a timeout.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRealTimeEvents = (
    ack: number,
    tab: number,
    timeout: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<RealTimeEventing.EventChannelResponse> =>
    ApiIntermediary.doGetRequest(
      `/Notification/Events/${e(ack)}/${e(tab)}/`,
      [["timeout", timeout]],
      optionalQueryAppend,
      "Notification",
      "GetRealTimeEvents",
      undefined,
      clientState
    );

  /**
   * Send a push notification to the current device, or all linked devices.
   * @param allDevices If true, send a push notification to all linked to devices, not just the current device.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SendTestPushNotification = (
    allDevices: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Notification/SendTestPushNotification/`,
      [["allDevices", allDevices]],
      optionalQueryAppend,
      "Notification",
      "SendTestPushNotification",
      undefined,
      clientState
    );
}

class ContentServiceInternal {
  /**
   * Gets an object describing a particular variant of content.
   * @param type
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetContentType = (
    type: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.ContentTypeDescription> =>
    ApiIntermediary.doGetRequest(
      `/Content/GetContentType/${e(type)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetContentType",
      undefined,
      clientState
    );

  /**
   * Returns a content item referenced by id
   * @param id
   * @param locale
   * @param head false
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetContentById = (
    id: string,
    locale: string,
    head: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/GetContentById/${e(id)}/${e(locale)}/`,
      [["head", head]],
      optionalQueryAppend,
      "Content",
      "GetContentById",
      undefined,
      clientState
    );

  /**
   * Returns the newest item that matches a given tag and Content Type.
   * @param tag
   * @param type
   * @param locale
   * @param head Not used.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetContentByTagAndType = (
    tag: string,
    type: string,
    locale: string,
    head: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/GetContentByTagAndType/${e(tag)}/${e(type)}/${e(locale)}/`,
      [["head", head]],
      optionalQueryAppend,
      "Content",
      "GetContentByTagAndType",
      undefined,
      clientState
    );

  /**
   * Gets content based on querystring information passed in.  Provides additional search capabilities through POSTed JSON data.
   * @param locale
   * @param head Not used.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchContentEx = (
    input: Models.ContentQueryPublic,
    locale: string,
    head: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultContentItemPublicContract> =>
    ApiIntermediary.doPostRequest(
      `/Content/SearchEx/${e(locale)}/`,
      [["head", head]],
      optionalQueryAppend,
      "Content",
      "SearchContentEx",
      input,
      clientState
    );

  /**
   * Gets content based on querystring information passed in.  Provides basic search and text search capabilities.
   * @param locale
   * @param head Not used.
   * @param ctype Content type tag: Help, News, etc. Supply multiple ctypes separated by space.
   * @param tag Tag used on the content to be searched.
   * @param currentpage Page number for the search results, starting with page 1.
   * @param searchtext Word or phrase for the search.
   * @param source For analytics, hint at the part of the app that triggered the search. Optional.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchContentWithText = (
    locale: string,
    head: boolean,
    ctype: string,
    tag: string,
    currentpage: number,
    searchtext: string,
    source: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/Search/${e(locale)}/`,
      [
        ["head", head],
        ["ctype", ctype],
        ["tag", tag],
        ["currentpage", currentpage],
        ["searchtext", searchtext],
        ["source", source],
      ],
      optionalQueryAppend,
      "Content",
      "SearchContentWithText",
      undefined,
      clientState
    );

  /**
   * Searches for Content Items that match the given Tag and Content Type.
   * @param tag
   * @param type
   * @param locale
   * @param head Not used.
   * @param currentpage Page number for the search results starting with page 1.
   * @param itemsperpage Not used.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchContentByTagAndType = (
    tag: string,
    type: string,
    locale: string,
    head: boolean,
    currentpage: number,
    itemsperpage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/SearchContentByTagAndType/${e(tag)}/${e(type)}/${e(locale)}/`,
      [
        ["head", head],
        ["currentpage", currentpage],
        ["itemsperpage", itemsperpage],
      ],
      optionalQueryAppend,
      "Content",
      "SearchContentByTagAndType",
      undefined,
      clientState
    );

  /**
   * Gets content relevant to the homepage.  Relevant as of 2018-07-10.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetHomepageContentV3 = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.FrontPageContentResponseV3> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Homepage/V3/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetHomepageContentV3",
      undefined,
      clientState
    );

  /**
   * Gets all Publication data.
   * @param locale
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPublications = (
    locale: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Publications/${e(locale)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetPublications",
      undefined,
      clientState
    );

  /**
   * Gets all News data.
   * @param newsType
   * @param locale
   * @param itemsperpage 10
   * @param currentpage 1
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetNews = (
    newsType: string,
    locale: string,
    itemsperpage: number,
    currentpage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/News/${e(newsType)}/${e(locale)}/`,
      [
        ["itemsperpage", itemsperpage],
        ["currentpage", currentpage],
      ],
      optionalQueryAppend,
      "Content",
      "GetNews",
      undefined,
      clientState
    );

  /**
   * Gets content relevant to the Destiny page.
   * @param locale
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyContent = (
    locale: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.DestinyContentResponse> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Destiny/${e(locale)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetDestinyContent",
      undefined,
      clientState
    );

  /**
   * Gets content relevant to the Destiny page.
   * @param locale
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyContentV2 = (
    locale: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.DestinyContentResponseV2> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Destiny/V2/${e(locale)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetDestinyContentV2",
      undefined,
      clientState
    );

  /**
   * Gets promotional widget content.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPromoWidget = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Destiny/Promo/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetPromoWidget",
      undefined,
      clientState
    );

  /**
   * Gets the current featured article on the site.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFeaturedArticle = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Featured/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetFeaturedArticle",
      undefined,
      clientState
    );

  /**
   * Gets the current pinned articles on the site's frontpage, in the order that they should be rendered.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPinnedArticles = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract[]> =>
    ApiIntermediary.doGetRequest(
      `/Content/Site/Pinned/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetPinnedArticles",
      undefined,
      clientState
    );

  /**
   * Gets a summary of careers currently available.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCareers = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Careers.CareerSetResponse> =>
    ApiIntermediary.doGetRequest(
      `/Content/Careers/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetCareers",
      undefined,
      clientState
    );

  /**
   * Gets the specific career referred to by this careerId.
   * @param careerId The ID of the Career.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCareer = (
    careerId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Careers.CareerResponse> =>
    ApiIntermediary.doGetRequest(
      `/Content/Careers/${e(careerId)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "GetCareer",
      undefined,
      clientState
    );

  /**
   * Search for careers.
   * @param searchtext The text to be searched for, URL encoded.  Both the Body and Title of the Job will be searched.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchCareers = (
    searchtext: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Careers.CareerSummary[]> =>
    ApiIntermediary.doGetRequest(
      `/Content/Careers/Search/`,
      [["searchtext", searchtext]],
      optionalQueryAppend,
      "Content",
      "SearchCareers",
      undefined,
      clientState
    );

  /**
   * Search for Help Articles.
   * @param searchtext
   * @param size
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchHelpArticles = (
    searchtext: string,
    size: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/Content/SearchHelpArticles/${e(searchtext)}/${e(size)}/`,
      [],
      optionalQueryAppend,
      "Content",
      "SearchHelpArticles",
      undefined,
      clientState
    );

  /**
   * Returns a JSON string response that is the RSS feed for news articles.
   * @param pageToken Zero-based pagination token for paging through result sets.
   * @param includebody Optionally include full content body for each news item.
   * @param categoryfilter Optionally filter response to only include news items in a certain category.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RssNewsArticles = (
    pageToken: string,
    includebody: boolean,
    categoryfilter: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.NewsArticleRssResponse> =>
    ApiIntermediary.doGetRequest(
      `/Content/Rss/NewsArticles/${e(pageToken)}/`,
      [
        ["includebody", includebody],
        ["categoryfilter", categoryfilter],
      ],
      optionalQueryAppend,
      "Content",
      "RssNewsArticles",
      undefined,
      clientState
    );
}

class ExternalSocialServiceInternal {
  /**
   * Loads the latest Bungie feed from a set of social services limited by item number (limit).
   * @param limit
   * @param types
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAggregatedSocialFeed = (
    limit: number,
    types: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ExternalMessage[]> =>
    ApiIntermediary.doGetRequest(
      `/ExternalSocial/GetAggregatedSocialFeed/${e(limit)}/`,
      [["types", types]],
      optionalQueryAppend,
      "ExternalSocial",
      "GetAggregatedSocialFeed",
      undefined,
      clientState
    );
}

class ForumServiceInternal {
  /**
   * Checks if the current user is able to post in the proposed location. Returns true if the posting is permitted, otherwise returns an error indicating what the restriction is.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static VerifyCreatePostAvailability = (
    input: Contract.PostLocation,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Forum/VerifyCreatePostAvailability/`,
      [],
      optionalQueryAppend,
      "Forum",
      "VerifyCreatePostAvailability",
      input,
      clientState
    );

  /**
   * Allows a user to create a new forum post or reply to an existing post.  Returns the post.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreatePost = (
    input: Contract.CreatePostRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostResponse> =>
    ApiIntermediary.doPostRequest(
      `/Forum/CreatePost/`,
      [],
      optionalQueryAppend,
      "Forum",
      "CreatePost",
      input,
      clientState
    );

  /**
   * Allows a user to create a top level reply comment to content in the Content Management System.  Returns the post created by this action.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateContentComment = (
    input: Contract.CreateContentCommentRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostResponse> =>
    ApiIntermediary.doPostRequest(
      `/Forum/CreateContentComment/`,
      [],
      optionalQueryAppend,
      "Forum",
      "CreateContentComment",
      input,
      clientState
    );

  /**
   * Allows a user to edit a forum post.  Returns the updated post.
   * @param postid ID of the post to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditPost = (
    input: Contract.EditPostRequest,
    postid: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostResponse> =>
    ApiIntermediary.doPostRequest(
      `/Forum/EditPost/${e(postid)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "EditPost",
      input,
      clientState
    );

  /**
   * Allows deletion of a topic and its posts by a user of an appropriate security level.
   * @param postId ID of the post to delete.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static DeletePost = (
    postId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Forum/DeletePost/${e(postId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "DeletePost",
      undefined,
      clientState
    );

  /**
   * Allows a user to rate a post from 0 to 100, overwriting any existing rating.  You must pass 0 (dislike) or 100(like).  Returns the updated rating score.
   * @param postId
   * @param rating
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RatePost = (
    postId: string,
    rating: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/RatePost/${e(postId)}/${e(rating)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "RatePost",
      undefined,
      clientState
    );

  /**
   * Moderate a post.  Only accessible to authorized users.
   * @param postId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ModeratePost = (
    input: Contracts.ModerationRequest,
    postId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Post/${e(postId)}/Moderate/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ModeratePost",
      input,
      clientState
    );

  /**
   * Moderate a Tag.  Only accessible to authorized users.
   * @param tagText A forum tag.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ModerateTag = (
    input: Contracts.ModerationRequest,
    tagText: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Tags/${e(tagText)}/Moderate/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ModerateTag",
      input,
      clientState
    );

  /**
   * Moderate a group post.  Only accessible to admins and founders of that group.
   * @param postId The post to moderate
   * @param groupId The id of the group that the post is in.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ModerateGroupPost = (
    input: Contracts.ModerationRequest,
    postId: string,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Post/${e(postId)}/GroupModerate/${e(groupId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ModerateGroupPost",
      input,
      clientState
    );

  /**
   * Get topics from any forum.
   * @param page Zero paged page number
   * @param pageSize Unused
   * @param group The group, if any.
   * @param sort The sort mode.
   * @param quickDate A date filter.
   * @param categoryFilter A category filter
   * @param tagstring The tags to search, if any.
   * @param locales Comma seperated list of locales posts must match to return in the result list. Default 'en'
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTopicsPaged = (
    page: number,
    pageSize: number,
    group: string,
    sort: Globals.ForumTopicsSortEnum,
    quickDate: Globals.ForumTopicsQuickDateEnum,
    categoryFilter: Globals.ForumTopicsCategoryFiltersEnum,
    tagstring: string,
    locales: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetTopicsPaged/${e(page)}/${e(pageSize)}/${e(group)}/${e(
        sort
      )}/${e(quickDate)}/${e(categoryFilter)}/`,
      [
        ["tagstring", tagstring],
        ["locales", locales],
      ],
      optionalQueryAppend,
      "Forum",
      "GetTopicsPaged",
      undefined,
      clientState
    );

  /**
   * Gets a listing of all topics marked as part of the core group.
   * @param page Zero base page
   * @param sort The sort mode.
   * @param quickDate The date filter.
   * @param categoryFilter The category filter.
   * @param locales Comma seperated list of locales posts must match to return in the result list. Default 'en'
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCoreTopicsPaged = (
    page: number,
    sort: Globals.ForumTopicsSortEnum,
    quickDate: Globals.ForumTopicsQuickDateEnum,
    categoryFilter: Globals.ForumTopicsCategoryFiltersEnum,
    locales: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetCoreTopicsPaged/${e(page)}/${e(sort)}/${e(quickDate)}/${e(
        categoryFilter
      )}/`,
      [["locales", locales]],
      optionalQueryAppend,
      "Forum",
      "GetCoreTopicsPaged",
      undefined,
      clientState
    );

  /**
   * Returns a thread of posts at the given parent, optionally returning replies to those posts as well as the original parent.
   * @param parentPostId
   * @param page
   * @param pageSize
   * @param replySize
   * @param getParentPost
   * @param rootThreadMode
   * @param sortMode
   * @param showbanned If this value is not null or empty, banned posts are requested to be returned
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostsThreadedPaged = (
    parentPostId: string,
    page: number,
    pageSize: number,
    replySize: number,
    getParentPost: boolean,
    rootThreadMode: boolean,
    sortMode: Globals.ForumPostSortEnum,
    showbanned: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetPostsThreadedPaged/${e(parentPostId)}/${e(page)}/${e(
        pageSize
      )}/${e(replySize)}/${e(getParentPost)}/${e(rootThreadMode)}/${e(
        sortMode
      )}/`,
      [["showbanned", showbanned]],
      optionalQueryAppend,
      "Forum",
      "GetPostsThreadedPaged",
      undefined,
      clientState
    );

  /**
   * Returns a thread of posts starting at the topicId of the input childPostId, optionally returning replies to those posts as well as the original parent.
   * @param childPostId
   * @param page
   * @param pageSize
   * @param replySize
   * @param rootThreadMode
   * @param sortMode
   * @param showbanned If this value is not null or empty, banned posts are requested to be returned
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostsThreadedPagedFromChild = (
    childPostId: string,
    page: number,
    pageSize: number,
    replySize: number,
    rootThreadMode: boolean,
    sortMode: Globals.ForumPostSortEnum,
    showbanned: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetPostsThreadedPagedFromChild/${e(childPostId)}/${e(page)}/${e(
        pageSize
      )}/${e(replySize)}/${e(rootThreadMode)}/${e(sortMode)}/`,
      [["showbanned", showbanned]],
      optionalQueryAppend,
      "Forum",
      "GetPostsThreadedPagedFromChild",
      undefined,
      clientState
    );

  /**
   * Returns the post specified and its immediate parent.
   * @param childPostId
   * @param showbanned If this value is not null or empty, banned posts are requested to be returned
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostAndParent = (
    childPostId: string,
    showbanned: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetPostAndParent/${e(childPostId)}/`,
      [["showbanned", showbanned]],
      optionalQueryAppend,
      "Forum",
      "GetPostAndParent",
      undefined,
      clientState
    );

  /**
   * Returns the post specified and its immediate parent of posts that are awaiting approval.
   * @param childPostId
   * @param showbanned If this value is not null or empty, banned posts are requested to be returned
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostAndParentAwaitingApproval = (
    childPostId: string,
    showbanned: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetPostAndParentAwaitingApproval/${e(childPostId)}/`,
      [["showbanned", showbanned]],
      optionalQueryAppend,
      "Forum",
      "GetPostAndParentAwaitingApproval",
      undefined,
      clientState
    );

  /**
   * Gets the popular tags in the forum using our estimated counts.
   * @param quantity
   * @param tagsSinceDate
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPopularTags = (
    quantity: number,
    tagsSinceDate: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.TagResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetPopularTags/`,
      [
        ["quantity", quantity],
        ["tagsSinceDate", tagsSinceDate],
      ],
      optionalQueryAppend,
      "Forum",
      "GetPopularTags",
      undefined,
      clientState
    );

  /**
   * Given a tag, return the current forum usage count estimate.
   * @param tagText A forum tag.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetForumTagCountEstimate = (
    tagText: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetForumTagCountEstimate/${e(tagText)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "GetForumTagCountEstimate",
      undefined,
      clientState
    );

  /**
   * Gets the post Id for the given content item's comments, if it exists.
   * @param contentId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTopicForContent = (
    contentId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetTopicForContent/${e(contentId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "GetTopicForContent",
      undefined,
      clientState
    );

  /**
   * Gets tag suggestions based on partial text entry, matching them with other tags previously used in the forums.
   * @param partialtag The partial tag input to generate suggestions from.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetForumTagSuggestions = (
    partialtag: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.TagResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Forum/GetForumTagSuggestions/`,
      [["partialtag", partialtag]],
      optionalQueryAppend,
      "Forum",
      "GetForumTagSuggestions",
      undefined,
      clientState
    );

  /**
   * Marks a 1st level reply as an answer to a topic marked as a question, clearing any existing posts marked as answers.
   * @param answerPostId The post id of the answer.
   * @param topicPostId The post id of the question/topic.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static MarkReplyAsAnswer = (
    answerPostId: string,
    topicPostId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Forum/MarkReplyAsAnswer/${e(answerPostId)}/${e(topicPostId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "MarkReplyAsAnswer",
      undefined,
      clientState
    );

  /**
   * Unmarks a 1st level reply as an answer to a topic marked as a question. The topic reverts to an unanswered question.
   * @param topicPostId The post id of the question/topic.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnmarkReplyAsAnswer = (
    topicPostId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Forum/UnmarkReplyAsAnswer/${e(topicPostId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "UnmarkReplyAsAnswer",
      undefined,
      clientState
    );

  /**
   * Votes in the specified forum poll, returns the updated vote count for that poll answer.
   * @param topicId The post id of the topic that has the poll.
   * @param answerSlot The zero-based slot number of the poll answer you are voting for.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static PollVote = (
    topicId: string,
    answerSlot: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Poll/Vote/${e(topicId)}/${e(answerSlot)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "PollVote",
      undefined,
      clientState
    );

  /**
   * Gets the specified forum poll.
   * @param topicId The post id of the topic that has the poll.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPoll = (
    topicId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Forum/Poll/${e(topicId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "GetPoll",
      undefined,
      clientState
    );

  /**
   * Allows admins to pin or unpin topics.
   * @param topicId The post id of the topic to change the pin state.
   * @param newPinState The new pin state of the topic, 0 is unpinned, > 0 is pinned.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ChangePinState = (
    topicId: string,
    newPinState: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Forum/ChangePinState/${e(topicId)}/${e(newPinState)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ChangePinState",
      undefined,
      clientState
    );

  /**
   * Allows admins to lock or unlock topics.
   * @param topicId The post id of the topic to change the lock state.
   * @param newLockState The new lock state of the topic, 0 is unlocked, anything else is locked.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ChangeLockState = (
    topicId: string,
    newLockState: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Forum/ChangeLockState/${e(topicId)}/${e(newLockState)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ChangeLockState",
      undefined,
      clientState
    );

  /**
   * Allows a user to slot themselves into a recruitment thread fireteam slot. Returns the new state of the fireteam.
   * @param topicId The post id of the recruitment topic you wish to join.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static JoinFireteamThread = (
    topicId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ForumRecruitmentDetail> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Recruit/Join/${e(topicId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "JoinFireteamThread",
      undefined,
      clientState
    );

  /**
   * Allows a user to remove themselves from a recruitment thread fireteam slot. Returns the new state of the fireteam.
   * @param topicId The post id of the recruitment topic you wish to leave.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LeaveFireteamThread = (
    topicId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ForumRecruitmentDetail> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Recruit/Leave/${e(topicId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "LeaveFireteamThread",
      undefined,
      clientState
    );

  /**
   * Allows a recruitment thread owner to kick a join user from the fireteam. Returns the new state of the fireteam.
   * @param topicId The post id of the recruitment topic you wish to join.
   * @param targetMembershipId The id of the user you wish to kick.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static KickBanFireteamApplicant = (
    topicId: string,
    targetMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ForumRecruitmentDetail> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Recruit/KickBan/${e(topicId)}/${e(targetMembershipId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "KickBanFireteamApplicant",
      undefined,
      clientState
    );

  /**
   * Allows the owner of a fireteam thread to approve all joined members and start a private message conversation with them.
   * @param topicId The post id of the recruitment topic to approve.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApproveFireteamThread = (
    topicId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.SaveMessageResult> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Recruit/Approve/${e(topicId)}/`,
      [],
      optionalQueryAppend,
      "Forum",
      "ApproveFireteamThread",
      undefined,
      clientState
    );

  /**
   * Allows the caller to get a list of to 25 recruitment thread summary information objects.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRecruitmentThreadSummaries = (
    input: string[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.ForumRecruitmentDetail[]> =>
    ApiIntermediary.doPostRequest(
      `/Forum/Recruit/Summaries/`,
      [],
      optionalQueryAppend,
      "Forum",
      "GetRecruitmentThreadSummaries",
      input,
      clientState
    );
}

class ActivityServiceInternal {
  /**
   * Get the list of entities that you follow, as determined by the passed in entityType.
   * @param entityType The current page (one-based, in line with other paged activity services)
   * @param currentPage The current page (one-based, in line with other paged activity services)
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetEntitiesFollowedByCurrentUserV2 = (
    entityType: Globals.EntityType,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultLegacyFollowingResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/Following/V2/${e(entityType)}/${e(currentPage)}/`,
      [],
      optionalQueryAppend,
      "Activity",
      "GetEntitiesFollowedByCurrentUserV2",
      undefined,
      clientState
    );

  /**
   * Get the list of entities that the given user follows.
   * @param membershipId The Bungie.Net membership ID of the user.
   * @param entityType The current page (one-based, in line with other paged activity services)
   * @param currentPage The current page (one-based, in line with other paged activity services)
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetEntitiesFollowedByUserV2 = (
    membershipId: string,
    entityType: Globals.EntityType,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultLegacyFollowingResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(membershipId)}/Following/V2/${e(entityType)}/${e(
        currentPage
      )}/`,
      [],
      optionalQueryAppend,
      "Activity",
      "GetEntitiesFollowedByUserV2",
      undefined,
      clientState
    );

  /**
   * Get the list of users that you follow, along with their GeneralUser information.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUsersFollowedByCurrentUser = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFollowerResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/Following/Users/`,
      [],
      optionalQueryAppend,
      "Activity",
      "GetUsersFollowedByCurrentUser",
      undefined,
      clientState
    );

  /**
   * Get the list of users that follow the given user.
   * @param id Bungie.net Membership ID of the user.
   * @param itemsperpage Number of followers to return per page.
   * @param currentpage Page number to fetch where page 1 is the first page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFollowersOfUser = (
    id: string,
    itemsperpage: number,
    currentpage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFollowerResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Followers/`,
      [
        ["itemsperpage", itemsperpage],
        ["currentpage", currentpage],
      ],
      optionalQueryAppend,
      "Activity",
      "GetFollowersOfUser",
      undefined,
      clientState
    );

  /**
   * Follow the user with the given Membership Id.
   * @param id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static FollowUser = (
    id: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser> =>
    ApiIntermediary.doPostRequest(
      `/Activity/User/${e(id)}/Follow/`,
      [],
      optionalQueryAppend,
      "Activity",
      "FollowUser",
      undefined,
      clientState
    );

  /**
   * Unfollow the user with the given Membership Id.
   * @param id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnfollowUser = (
    id: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser> =>
    ApiIntermediary.doPostRequest(
      `/Activity/User/${e(id)}/Unfollow/`,
      [],
      optionalQueryAppend,
      "Activity",
      "UnfollowUser",
      undefined,
      clientState
    );

  /**
   * Get the recent Like and Share activities for another user.
   * @param id
   * @param itemsperpage
   * @param currentpage
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLikeAndShareActivityForUser = (
    id: string,
    itemsperpage: number,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Activities/LikesAndShares/`,
      [
        ["itemsperpage", itemsperpage],
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetLikeAndShareActivityForUser",
      undefined,
      clientState
    );

  /**
   * Get the recent Like and Share activities for another user.
   * @param id
   * @param currentpage
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLikeAndShareActivityForUserV2 = (
    id: string,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Activities/LikesAndSharesV2/`,
      [
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetLikeAndShareActivityForUserV2",
      undefined,
      clientState
    );

  /**
   * Get the recent Forum activities for another user.
   * @param id
   * @param itemsperpage
   * @param currentpage
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetForumActivityForUser = (
    id: string,
    itemsperpage: number,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Activities/Forums/`,
      [
        ["itemsperpage", itemsperpage],
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetForumActivityForUser",
      undefined,
      clientState
    );

  /**
   * Get the recent Forum activities for another user.
   * @param id
   * @param currentpage
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetForumActivityForUserV2 = (
    id: string,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Activities/ForumsV2/`,
      [
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetForumActivityForUserV2",
      undefined,
      clientState
    );

  /**
   * Get the recent Like, Share, and Forum activities for another user.
   * @param id
   * @param currentpage
   * @param format
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLikeShareAndForumActivityForUser = (
    id: string,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(id)}/Activities/LikeShareAndForum/`,
      [
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetLikeShareAndForumActivityForUser",
      undefined,
      clientState
    );

  /**
   * Get the recent Like, Share, and Forum activities for another user.
   * @param membershipId ID of the user whose activities should be returned.
   * @param applicationId ID of the application whose activities should be returned.
   * @param currentpage Page number of the activity where page 1 is the most recent page of activities.
   * @param format Format of output
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplicationActivityForUser = (
    membershipId: string,
    applicationId: string,
    currentpage: number,
    format: Globals.ActivityOutputFormat,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ActivityMessageSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(membershipId)}/Activities/Application/${e(
        applicationId
      )}/`,
      [
        ["currentpage", currentpage],
        ["format", format],
      ],
      optionalQueryAppend,
      "Activity",
      "GetApplicationActivityForUser",
      undefined,
      clientState
    );

  /**
   * Get activities related to actions on inventory and other items in Destiny
   * @param membershipType The type of the supplied membership ID whose data is to be fetched.
   * @param membershipId The membership ID whose data is to be fetched.
   * @param continuationToken Optional token used to indicate the next page of data. Returned by the previous response.
   * @param applicationId Optional applicationId to filter the response.
   * @param correlationId Optional correlation ID to filter the response.
   * @param daysInPast Optional number of days in the past to start fetching data. Acceptable values are 30, 60, and 90 days. Larger values are rounded down.
   * @param activityType Optional specific activity type to include in the results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyItemActivities = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    continuationToken: string,
    applicationId: number,
    correlationId: string,
    daysInPast: number,
    activityType: Globals.ActivityType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultDestinyItemActivityRecord> =>
    ApiIntermediary.doGetRequest(
      `/Activity/User/${e(membershipType)}/${e(
        membershipId
      )}/Activities/DestinyItem/`,
      [
        ["continuationToken", continuationToken],
        ["applicationId", applicationId],
        ["correlationId", correlationId],
        ["daysInPast", daysInPast],
        ["activityType", activityType],
      ],
      optionalQueryAppend,
      "Activity",
      "GetDestinyItemActivities",
      undefined,
      clientState
    );

  /**
   * Get the list of users that follow the given Tag.
   * @param tag
   * @param itemsperpage
   * @param currentpage
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFollowersOfTag = (
    tag: string,
    itemsperpage: number,
    currentpage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFollowerResponse> =>
    ApiIntermediary.doGetRequest(
      `/Activity/Tag/Followers/`,
      [
        ["tag", tag],
        ["itemsperpage", itemsperpage],
        ["currentpage", currentpage],
      ],
      optionalQueryAppend,
      "Activity",
      "GetFollowersOfTag",
      undefined,
      clientState
    );

  /**
   * Follow the Tag with the given Tag.
   * @param tag
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static FollowTag = (
    tag: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.TagResponse> =>
    ApiIntermediary.doPostRequest(
      `/Activity/Tag/Follow/`,
      [["tag", tag]],
      optionalQueryAppend,
      "Activity",
      "FollowTag",
      undefined,
      clientState
    );

  /**
   * Unfollow the Tag with the given Tag.
   * @param tag
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnfollowTag = (
    tag: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.TagResponse> =>
    ApiIntermediary.doPostRequest(
      `/Activity/Tag/Unfollow/`,
      [["tag", tag]],
      optionalQueryAppend,
      "Activity",
      "UnfollowTag",
      undefined,
      clientState
    );

  /**
   * Logs activities.
   * @param product The 'key' of the product being purchased as dictated by SkuDestinationsConfig.
   * @param store The 'key' of the store for the product being purchased as dictated by SkuDestinationsConfig (not a BungieMembershipType enum value)
   * @param region The 'key' of the region of product being purchased, as dictated by SkuDestinationsConfig.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LogProductBuyButtonActivity = (
    product: string,
    store: string,
    region: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Activity/Log/SkuBuyButton/`,
      [
        ["product", product],
        ["store", store],
        ["region", region],
      ],
      optionalQueryAppend,
      "Activity",
      "LogProductBuyButtonActivity",
      undefined,
      clientState
    );

  /**
   * Capture activity events.
   * @param challengeKey The name of the key used to encrypt the challenge field in the request body.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CaptureActivity = (
    input: Activities.CapturedActivityRequest,
    challengeKey: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Activity/Capture/Activity/${e(challengeKey)}/`,
      [],
      optionalQueryAppend,
      "Activity",
      "CaptureActivity",
      input,
      clientState
    );
}

class GroupV2ServiceInternal {
  /**
   * Returns a list of all available group avatars for the signed-in user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableAvatars = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: number]: string }> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/GetAvailableAvatars/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetAvailableAvatars",
      undefined,
      clientState
    );

  /**
   * Returns a list of all available group themes.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableThemes = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Config.GroupTheme[]> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/GetAvailableThemes/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetAvailableThemes",
      undefined,
      clientState
    );

  /**
   * Gets the state of the user's clan invite preferences for a particular membership type - true if they wish to be invited to clans, false otherwise.
   * @param mType The Destiny membership type of the account we wish to access settings.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserClanInviteSetting = (
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/GetUserClanInviteSetting/${e(mType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetUserClanInviteSetting",
      undefined,
      clientState
    );

  /**
   * Sets the state of the user's clan invite preferences - true if they wish to be invited to clans, false otherwise.
   * @param mType The Destiny membership type of linked account we are manipulating.
   * @param allowInvites True to allow invites of this user to clans, false otherwise.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetUserClanInviteSetting = (
    mType: Globals.BungieMembershipType,
    allowInvites: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/SetUserClanInviteSetting/${e(mType)}/${e(allowInvites)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "SetUserClanInviteSetting",
      undefined,
      clientState
    );

  /**
   * Gets groups recommended for you based on the groups to whom those you follow belong.
   * @param groupType Type of groups requested
   * @param createDateRange Requested range in which to pull recommended groups
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRecommendedGroups = (
    groupType: Globals.GroupType,
    createDateRange: Globals.GroupDateRange,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupV2Card[]> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/Recommended/${e(groupType)}/${e(createDateRange)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetRecommendedGroups",
      undefined,
      clientState
    );

  /**
   * Search for Groups.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GroupSearch = (
    input: GroupsV2.GroupQuery,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupSearchResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/Search/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GroupSearch",
      input,
      clientState
    );

  /**
   * Get information about a specific group of the given ID.
   * @param groupId Requested group's id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroup = (
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupResponse> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetGroup",
      undefined,
      clientState
    );

  /**
   * Get information about a specific group with the given name and type.
   * @param groupName Exact name of the group to find.
   * @param groupType Type of group to find.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupByName = (
    groupName: string,
    groupType: Globals.GroupType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupResponse> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/Name/${e(groupName)}/${e(groupType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetGroupByName",
      undefined,
      clientState
    );

  /**
   * Get information about a specific group with the given name and type.  The POST version.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupByNameV2 = (
    input: GroupsV2.GroupNameSearchRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/NameV2/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetGroupByNameV2",
      input,
      clientState
    );

  /**
   * Gets a list of available optional conversation channels and their settings.
   * @param groupId Requested group's id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupOptionalConversations = (
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupOptionalConversation[]> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/OptionalConversations/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetGroupOptionalConversations",
      undefined,
      clientState
    );

  /**
   * Create a new group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateGroup = (
    input: GroupsV2.GroupAction,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupCreationResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/Create/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "CreateGroup",
      input,
      clientState
    );

  /**
   * Edit an existing group.  You must have suitable permissions in the group to perform this operation.  This latest revision will only edit the fields you pass in - pass null for properties you want to leave unaltered.
   * @param groupId Group ID of the group to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditGroup = (
    input: GroupsV2.GroupEditAction,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Edit/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "EditGroup",
      input,
      clientState
    );

  /**
   * Edit an existing group's clan banner.  You must have suitable permissions in the group to perform this operation. All fields are required.
   * @param groupId Group ID of the group to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditClanBanner = (
    input: GroupsV2.ClanBanner,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/EditClanBanner/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "EditClanBanner",
      input,
      clientState
    );

  /**
   * Edit group options only available to a founder.  You must have suitable permissions in the group to perform this operation.
   * @param groupId Group ID of the group to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditFounderOptions = (
    input: GroupsV2.GroupOptionsEditAction,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/EditFounderOptions/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "EditFounderOptions",
      input,
      clientState
    );

  /**
   * Add a new optional conversation/chat channel. Requires admin permissions to the group.
   * @param groupId Group ID of the group to edit.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AddOptionalConversation = (
    input: GroupsV2.GroupOptionalConversationAddRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/OptionalConversations/Add/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "AddOptionalConversation",
      input,
      clientState
    );

  /**
   * Edit the settings of an optional conversation/chat channel. Requires admin permissions to the group.
   * @param groupId Group ID of the group to edit.
   * @param conversationId Conversation Id of the channel being edited.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditOptionalConversation = (
    input: GroupsV2.GroupOptionalConversationEditRequest,
    groupId: string,
    conversationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/OptionalConversations/Edit/${e(conversationId)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "EditOptionalConversation",
      input,
      clientState
    );

  /**
   * Get the list of members in a given group.
   * @param groupId The ID of the group.
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 items per page.
   * @param memberType Filter out other member types.  Use None for all members.
   * @param nameSearch The name fragment upon which a search should be executed for members with matching display or unique names.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMembersOfGroup = (
    groupId: string,
    currentPage: number,
    memberType: Globals.RuntimeGroupMemberType,
    nameSearch: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupMember> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/Members/`,
      [
        ["currentPage", currentPage],
        ["memberType", memberType],
        ["nameSearch", nameSearch],
      ],
      optionalQueryAppend,
      "GroupV2",
      "GetMembersOfGroup",
      undefined,
      clientState
    );

  /**
   * Get the list of members in a given group who are of admin level or higher.
   * @param groupId The ID of the group.
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 items per page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAdminsAndFounderOfGroup = (
    groupId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupMember> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/AdminsAndFounder/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "GroupV2",
      "GetAdminsAndFounderOfGroup",
      undefined,
      clientState
    );

  /**
   * Edit the membership type of a given member.  You must have suitable permissions in the group to perform this operation.
   * @param groupId ID of the group to which the member belongs.
   * @param membershipType Membership type of the provide membership ID.
   * @param membershipId Membership ID to modify.
   * @param memberType New membertype for the specified member.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditGroupMembership = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    memberType: Globals.RuntimeGroupMemberType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/${e(membershipType)}/${e(
        membershipId
      )}/SetMembershipType/${e(memberType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "EditGroupMembership",
      undefined,
      clientState
    );

  /**
   * Kick a member from the given group, forcing them to reapply if they wish to re-join the group.  You must have suitable permissions in the group to perform this operation.
   * @param groupId Group ID to kick the user from.
   * @param membershipType Membership type of the provided membership ID.
   * @param membershipId Membership ID to kick.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static KickMember = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupMemberLeaveResult> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/${e(membershipType)}/${e(
        membershipId
      )}/Kick/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "KickMember",
      undefined,
      clientState
    );

  /**
   * Bans the requested member from the requested group for the specified period of time.
   * @param groupId Group ID that has the member to ban.
   * @param membershipType Membership type of the provided membership ID.
   * @param membershipId Membership ID of the member to ban from the group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BanMember = (
    input: GroupsV2.GroupBanRequest,
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/${e(membershipType)}/${e(
        membershipId
      )}/Ban/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "BanMember",
      input,
      clientState
    );

  /**
   * Unbans the requested member, allowing them to re-apply for membership.
   * @param groupId
   * @param membershipType Membership type of the provided membership ID.
   * @param membershipId Membership ID of the member to unban from the group
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnbanMember = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/${e(membershipType)}/${e(
        membershipId
      )}/Unban/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "UnbanMember",
      undefined,
      clientState
    );

  /**
   * Get the list of banned members in a given group.  Only accessible to group Admins and above. Not applicable to all groups.  Check group features.
   * @param groupId Group ID whose banned members you are fetching
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 entries.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBannedMembersOfGroup = (
    groupId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupBan> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/Banned/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "GroupV2",
      "GetBannedMembersOfGroup",
      undefined,
      clientState
    );

  /**
   * Get the list of edits made to a given group.  Only accessible to group Admins and above.
   * @param groupId Group ID whose edit history you are fetching
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 entries.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupEditHistory = (
    groupId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupEditHistory> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/EditHistory/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "GroupV2",
      "GetGroupEditHistory",
      undefined,
      clientState
    );

  /**
   * An administrative method to allow the founder of a group or clan to give up their position to another admin permanently.
   * @param groupId The target group id.
   * @param membershipType Membership type of the provided founderIdNew.
   * @param founderIdNew The new founder for this group.  Must already be a group admin.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AbdicateFoundership = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    founderIdNew: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Admin/AbdicateFoundership/${e(
        membershipType
      )}/${e(founderIdNew)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "AbdicateFoundership",
      undefined,
      clientState
    );

  /**
   * Request permission to join the given group.
   * @param groupId ID of the group you would like to join.
   * @param membershipType MembershipType of the account to use when joining.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RequestGroupMembership = (
    input: GroupsV2.GroupApplicationRequest,
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupApplicationResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/Apply/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "RequestGroupMembership",
      input,
      clientState
    );

  /**
   * Get the list of users who are awaiting a decision on their application to join a given group.  Modified to include application info.
   * @param groupId ID of the group.
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 items per page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPendingMemberships = (
    groupId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupMemberApplication> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/Members/Pending/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "GroupV2",
      "GetPendingMemberships",
      undefined,
      clientState
    );

  /**
   * Get the list of users who have been invited into the group.
   * @param groupId ID of the group.
   * @param currentPage Page number (starting with 1). Each page has a fixed size of 50 items per page.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetInvitedIndividuals = (
    groupId: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultGroupMemberApplication> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/${e(groupId)}/Members/InvitedIndividuals/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "GroupV2",
      "GetInvitedIndividuals",
      undefined,
      clientState
    );

  /**
   * Rescind your application to join the given group or leave the group if you are already a member..
   * @param groupId ID of the group.
   * @param membershipType MembershipType of the account to leave.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RescindGroupMembership = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupMemberLeaveResult> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/Rescind/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "RescindGroupMembership",
      undefined,
      clientState
    );

  /**
   * Approve all of the pending users for the given group.
   * @param groupId ID of the group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApproveAllPending = (
    input: GroupsV2.GroupApplicationRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/ApproveAll/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "ApproveAllPending",
      input,
      clientState
    );

  /**
   * Deny all of the pending users for the given group.
   * @param groupId ID of the group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static DenyAllPending = (
    input: GroupsV2.GroupApplicationRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/DenyAll/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "DenyAllPending",
      input,
      clientState
    );

  /**
   * Approve all of the pending users for the given group.
   * @param groupId ID of the group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApprovePendingForList = (
    input: GroupsV2.GroupApplicationListRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/ApproveList/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "ApprovePendingForList",
      input,
      clientState
    );

  /**
   * Approve the given membershipId to join the group/clan as long as they have applied.
   * @param groupId ID of the group.
   * @param membershipType Membership type of the supplied membership ID.
   * @param membershipId The membership id being approved.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApprovePending = (
    input: GroupsV2.GroupApplicationRequest,
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/Approve/${e(membershipType)}/${e(
        membershipId
      )}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "ApprovePending",
      input,
      clientState
    );

  /**
   * Deny all of the pending users for the given group that match the passed-in .
   * @param groupId ID of the group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static DenyPendingForList = (
    input: GroupsV2.GroupApplicationListRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Entities.EntityActionResult[]> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/DenyList/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "DenyPendingForList",
      input,
      clientState
    );

  /**
   * Get information about the groups that a given member has joined.
   * @param membershipType Membership type of the supplied membership ID.
   * @param membershipId Membership ID to for which to find founded groups.
   * @param filter Filter apply to list of joined groups.
   * @param groupType Type of group the supplied member founded.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupsForMember = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    filter: Globals.GroupsForMemberFilter,
    groupType: Globals.GroupType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GetGroupsForMemberResponse> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/User/${e(membershipType)}/${e(membershipId)}/${e(filter)}/${e(
        groupType
      )}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetGroupsForMember",
      undefined,
      clientState
    );

  /**
   * Allows a founder to manually recover a group they can see in game but not on bungie.net
   * @param membershipType Membership type of the supplied membership ID.
   * @param membershipId Membership ID to for which to find founded groups.
   * @param groupType Type of group the supplied member founded.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RecoverGroupForFounder = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    groupType: Globals.GroupType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupMembershipSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/Recover/${e(membershipType)}/${e(membershipId)}/${e(
        groupType
      )}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "RecoverGroupForFounder",
      undefined,
      clientState
    );

  /**
   * Get information about the groups that a given member has applied to or been invited to.
   * @param membershipType Membership type of the supplied membership ID.
   * @param membershipId Membership ID to for which to find applied groups.
   * @param filter Filter apply to list of potential joined groups.
   * @param groupType Type of group the supplied member applied.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPotentialGroupsForMember = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    filter: Globals.GroupPotentialMemberStatus,
    groupType: Globals.GroupType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupPotentialMembershipSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/GroupV2/User/Potential/${e(membershipType)}/${e(membershipId)}/${e(
        filter
      )}/${e(groupType)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "GetPotentialGroupsForMember",
      undefined,
      clientState
    );

  /**
   * Invite a user to join this group.
   * @param groupId ID of the group you would like to join.
   * @param membershipType MembershipType of the account being invited.
   * @param membershipId Membership id of the account being invited.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static IndividualGroupInvite = (
    input: GroupsV2.GroupApplicationRequest,
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupApplicationResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/IndividualInvite/${e(membershipType)}/${e(
        membershipId
      )}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "IndividualGroupInvite",
      input,
      clientState
    );

  /**
   * Cancels a pending invitation to join a group.
   * @param groupId ID of the group you would like to join.
   * @param membershipType MembershipType of the account being cancelled.
   * @param membershipId Membership id of the account being cancelled.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static IndividualGroupInviteCancel = (
    groupId: string,
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<GroupsV2.GroupApplicationResponse> =>
    ApiIntermediary.doPostRequest(
      `/GroupV2/${e(groupId)}/Members/IndividualInviteCancel/${e(
        membershipType
      )}/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "GroupV2",
      "IndividualGroupInviteCancel",
      undefined,
      clientState
    );
}

class IgnoreServiceInternal {
  /**
   * Search for Group Ignores.
   * @param postId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetIgnoreStatusForPost = (
    postId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.IgnoreStatus> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/MyIgnores/Posts/${e(postId)}/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "GetIgnoreStatusForPost",
      undefined,
      clientState
    );

  /**
   * Search for Group Ignores.
   * @param membershipId
   * @param globalignore Optional - if false, will not check for global ignore status on bnet membership ids, increasing call efficiency
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetIgnoreStatusForUser = (
    membershipId: string,
    globalignore: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.IgnoreStatus> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/MyIgnores/Users/${e(membershipId)}/`,
      [["globalignore", globalignore]],
      optionalQueryAppend,
      "Ignore",
      "GetIgnoreStatusForUser",
      undefined,
      clientState
    );

  /**
   * Search for non-user ignores made by caller (tags, posts, groups). Cannot be used to return ignored users.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetIgnoresForUser = (
    input: Models.IgnoreQuery,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.IgnoreSearchResult> =>
    ApiIntermediary.doPostRequest(
      `/Ignore/MyIgnores/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "GetIgnoresForUser",
      input,
      clientState
    );

  /**
   * Returns information about the users currently being ignored by the passed in membership id.  Will not return all available memberships of a blocked user, just one of them.
   * @param membershipId The owner of the ignore list to load.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ManageIgnoresForUser = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Ignores.IgnoredPlayer[]> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/MyIgnores/Users/Manage/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "ManageIgnoresForUser",
      undefined,
      clientState
    );

  /**
   * Imports old-style bungie.net profile ignores into the new global ignore system within the limits of that system.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ImportToGlobal = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Ignore/MyIgnores/ImportToGlobal/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "ImportToGlobal",
      undefined,
      clientState
    );

  /**
   * Returns a count of the the number of global ignores available for import.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GlobalIgnoreImportsAvailable = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/MyIgnores/GlobalIgnoreImportsAvailable/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "GlobalIgnoreImportsAvailable",
      undefined,
      clientState
    );

  /**
   * Ignore an item.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static IgnoreItem = (
    input: Contracts.IgnoreItemRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.IgnoreDetailResponse> =>
    ApiIntermediary.doPostRequest(
      `/Ignore/Ignore/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "IgnoreItem",
      input,
      clientState
    );

  /**
   * Unignore an item.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnignoreItem = (
    input: Contracts.UnignoreItemRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.IgnoreDetailResponse> =>
    ApiIntermediary.doPostRequest(
      `/Ignore/Unignore/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "UnignoreItem",
      input,
      clientState
    );

  /**
   * Gets the last report for the logged in user, if any.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static MyLastReport = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.LastReportedItemResponse> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/MyLastReport/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "MyLastReport",
      undefined,
      clientState
    );

  /**
   * Flags an item for review by the moderators, used for things that you don't ignore but still want to report, like offensive group names.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static FlagItem = (
    input: Contracts.IgnoreItemRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.IgnoreDetailResponse> =>
    ApiIntermediary.doPostRequest(
      `/Ignore/Flag/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "FlagItem",
      input,
      clientState
    );

  /**
   * Given a report id, will return a summary of the content that was reported. Must be the author of that content or a moderator.
   * @param reportId The id of the report to get the context
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetReportContext = (
    reportId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Ignores.ReportContextResponse> =>
    ApiIntermediary.doGetRequest(
      `/Ignore/ReportContext/${e(reportId)}/`,
      [],
      optionalQueryAppend,
      "Ignore",
      "GetReportContext",
      undefined,
      clientState
    );
}

class AdminServiceInternal {
  /**
   * Get your assigned reports, or have new ones generated if you don't have a full queue.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAssignedReports = (
    input: Contracts.ReportAssignmentFilter,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ReportedItemResponse[]> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Assigned/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetAssignedReports",
      input,
      clientState
    );

  /**
   * Get the number of your assigned reports in your queue.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPendingReportCount = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Assigned/Count/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetPendingReportCount",
      undefined,
      clientState
    );

  /**
   * Gets a specific report from ID
   * @param reportId The Id of the target report.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetReportFromId = (
    reportId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ReportedItemResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Report/${e(reportId)}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetReportFromId",
      undefined,
      clientState
    );

  /**
   * Gets a specific report Trigger from autoTrigger ID
   * @param autoTriggerId The Id of the target report Trigger.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAutoTriggerFromId = (
    autoTriggerId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Config.ReportTrigger> =>
    ApiIntermediary.doGetRequest(
      `/Admin/ReportTrigger/${e(autoTriggerId)}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetAutoTriggerFromId",
      undefined,
      clientState
    );

  /**
   * Return your assigned reports to the hopper for re-assignment.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReturnAssignedReports = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Assigned/ReturnAll/`,
      [],
      optionalQueryAppend,
      "Admin",
      "ReturnAssignedReports",
      undefined,
      clientState
    );

  /**
   * Resolve a report that's been assigned to you.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ResolveReport = (
    input: Contracts.ReportResolution,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Assigned/Resolve/`,
      [],
      optionalQueryAppend,
      "Admin",
      "ResolveReport",
      input,
      clientState
    );

  /**
   * Overturn the results of a report, given sufficient credentials.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverturnReport = (
    input: Contracts.ReportResolution,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Reports/Overturn/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverturnReport",
      input,
      clientState
    );

  /**
   * Get a paginated list of all of the the reports that resulted in discipline against a given Member.
   * @param membershipId The membershipId of the target user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDisciplinedReportsForMember = (
    input: Queries.PagedQuery,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultReportedItemResponse> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Member/${e(membershipId)}/Reports/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetDisciplinedReportsForMember",
      input,
      clientState
    );

  /**
   * Get a list of all of the the reports that resulted in discipline against a given Member, including reports resulting from flagging.  Not paged.
   * @param membershipId The membershipId of the target user.
   * @param itemsToReturn The maximum number of items to return.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRecentDisciplineAndFlagHistoryForMember = (
    membershipId: string,
    itemsToReturn: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultReportedItemResponse> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Member/${e(membershipId)}/RecentIncludingFlags/${e(
        itemsToReturn
      )}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetRecentDisciplineAndFlagHistoryForMember",
      undefined,
      clientState
    );

  /**
   * Get a paginated set of all reports that have been resolved.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetResolvedReports = (
    input: Queries.PagedQuery,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultReportedItemResponse> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Reports/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetResolvedReports",
      input,
      clientState
    );

  /**
   * Globally ignore an item, given sufficient credentials.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GloballyIgnoreItem = (
    input: Contracts.IgnoreItemRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Ignores/GloballyIgnore/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GloballyIgnoreItem",
      input,
      clientState
    );

  /**
   * Manually set the date for which a user should be forum banned.
   * @param membershipId The membershipId of the user to forum ban.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverrideBanOnUser = (
    input: Contract.UserBanRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Member/${e(membershipId)}/SetBan/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverrideBanOnUser",
      input,
      clientState
    );

  /**
   * Manually set the date for which a user should be message banned.
   * @param membershipId The membershipId of the user to message ban.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverrideMsgBanOnUser = (
    input: Contract.UserBanRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Member/${e(membershipId)}/SetMsgBan/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverrideMsgBanOnUser",
      input,
      clientState
    );

  /**
   * Manually set the date for which a user should be group wall banned.
   * @param membershipId The membershipId of the user to group wall ban.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverrideGroupWallBanOnUser = (
    input: Contract.UserBanRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Member/${e(membershipId)}/SetGroupWallBan/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverrideGroupWallBanOnUser",
      input,
      clientState
    );

  /**
   * Manually set the date for which a user should be fireteam banned for all linked accounts
   * @param membershipId The bnet membershipId of the user to fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverrideFireteamBanOnUser = (
    input: Contract.UserBanRequest,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Member/${e(membershipId)}/SetFireteamBan/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverrideFireteamBanOnUser",
      input,
      clientState
    );

  /**
   * Manually set the date for which an item should be globally ignored.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static OverrideGlobalIgnore = (
    input: Contracts.IgnoreItemOverrideRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Ignores/OverrideGlobalIgnore/`,
      [],
      optionalQueryAppend,
      "Admin",
      "OverrideGlobalIgnore",
      input,
      clientState
    );

  /**
   * Returns a list of possible users based on the search string.  Uncached for purposes of the admin interface, with additional admin-only information.
   * @param q
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AdminUserSearch = (
    q: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.GeneralUser[]> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Member/Search/`,
      [["q", q]],
      optionalQueryAppend,
      "Admin",
      "AdminUserSearch",
      undefined,
      clientState
    );

  /**
   * Returns the ban state of the user, including the specific expiration dates of each component.
   * @param membershipId The target membership id to look up.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserBanState = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserBanState> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Member/${e(membershipId)}/GetBanState/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetUserBanState",
      undefined,
      clientState
    );

  /**
   * Retrieves recently used client ip history for a particular profile.
   * @param membershipId The target membership id to look up.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserWebClientIpHistory = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Core.StringDatePackage[]> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Member/${e(membershipId)}/GetWebClientIpHistory/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetUserWebClientIpHistory",
      undefined,
      clientState
    );

  /**
   * Gets a paged listing of the user's posts, most recent first.
   * @param membershipId The target membership id.
   * @param page Zero-based page of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserPostHistory = (
    membershipId: string,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Member/${e(membershipId)}/PostHistory/${e(page)}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetUserPostHistory",
      undefined,
      clientState
    );

  /**
   * Gets the revision history of a post.
   * @param postId The target forum Post ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostRevisionHistory = (
    postId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Forums.PostRevisionHistoryResponse> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Forum/${e(postId)}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GetPostRevisionHistory",
      undefined,
      clientState
    );

  /**
   * Retrieves a paged & filtered list of all admin actions.
   * @param membershipFlags Filters entries by type of admin.
   * @param page Zero based page of results to get.
   * @param membershipFilter Optional filter to a specific admin's history.
   * @param startdate The start date of events to retrieve. Must be within 60 days of end date.
   * @param enddate The end date of the events to retrieve. Must be within 60 days of the start date.
   * @param groupIdFilter Optional filter to a specific group.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAdminHistory = (
    membershipFlags: Globals.AdminHistoryMembershipFlags,
    page: number,
    membershipFilter: string,
    startdate: string,
    enddate: string,
    groupIdFilter: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.AdminHistoryEntry[]> =>
    ApiIntermediary.doGetRequest(
      `/Admin/GlobalHistory/${e(membershipFlags)}/${e(page)}/`,
      [
        ["membershipFilter", membershipFilter],
        ["startdate", startdate],
        ["enddate", enddate],
        ["groupIdFilter", groupIdFilter],
      ],
      optionalQueryAppend,
      "Admin",
      "GetAdminHistory",
      undefined,
      clientState
    );

  /**
   * Allows an admin user to edit a forum post. Returns count of number of successful updates. Requires either edit any post permissions, plus any perms needed to edit a particular post.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BulkEditPost = (
    input: Contract.BulkEditPostRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/BulkEditPost/`,
      [],
      optionalQueryAppend,
      "Admin",
      "BulkEditPost",
      input,
      clientState
    );

  /**
   * Allows support staff to see the current status of a token.
   * @param tokenCode A Token code whose status needs to be checked.
   * @param currentPage The zero-based page of claims to return.  Generally tokens only have one use, so page 0 is a good default.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTokenDetails = (
    tokenCode: string,
    currentPage: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.TokenSupportDetails> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Tokens/${e(tokenCode)}/`,
      [["currentPage", currentPage]],
      optionalQueryAppend,
      "Admin",
      "GetTokenDetails",
      undefined,
      clientState
    );

  /**
   * Allows support staff to see the status of a user's Twitch Gift Subscription bounties, optionally filtered by broadcaster.
   * @param membershipId The BungieNet Membership ID of the user for whom we want giftsub history.
   * @param broadcasterTwitchName (optional) if provided, this is the name of the broadcaster for whom results should be filtered, and whose actual current gift subscriptions should be examined.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGiftSubscriptionBountyHistory = (
    membershipId: string,
    broadcasterTwitchName: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Admin.GiftSubscriptionBountyHistoryResponse> =>
    ApiIntermediary.doGetRequest(
      `/Admin/Twitch/GiftSubscriptions/${e(membershipId)}/`,
      [["broadcasterTwitchName", broadcasterTwitchName]],
      optionalQueryAppend,
      "Admin",
      "GetGiftSubscriptionBountyHistory",
      undefined,
      clientState
    );

  /**
   * Grants a gift subscription reward to a user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GrantGiftSubscription = (
    input: Admin.GiftSubscriptionGrantRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Admin.GiftSubscriptionGrantResponse> =>
    ApiIntermediary.doPostRequest(
      `/Admin/Twitch/GiftSubscriptions/Grant/`,
      [],
      optionalQueryAppend,
      "Admin",
      "GrantGiftSubscription",
      input,
      clientState
    );

  /**
   * Sends a Report Email to Employees
   * @param reportId The report id
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SendReportEmail = (
    reportId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Admin/SendEmail/${e(reportId)}/`,
      [],
      optionalQueryAppend,
      "Admin",
      "SendReportEmail",
      undefined,
      clientState
    );
}

class TokensServiceInternal {
  /**
   * Given a token, claims and applies it to the user.  If the platform selection is unknown, then only just returns info on the offer, but does not claim or error.
   * @param platformSelection The MembershipType of platform to apply the offer attached to the token to, or None if we're not sure yet.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClaimAndApplyOnToken = (
    input: string,
    platformSelection: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.OfferHistoryResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/ClaimAndApplyToken/${e(platformSelection)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ClaimAndApplyOnToken",
      input,
      clientState
    );

  /**
   * Get the combined list of offers assigned to this bungie Id and their current metadata.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentUserOfferHistory = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.OfferHistoryResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/OfferHistory/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetCurrentUserOfferHistory",
      undefined,
      clientState
    );

  /**
   * Get the combined list of offers assigned to a target bungie membershipId Id and their current metadata.
   * @param membershipId One of the linked account ids of the target user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserOfferHistory = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.OfferHistoryResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/OfferHistory/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetUserOfferHistory",
      undefined,
      clientState
    );

  /**
   * A simple test that returns the user's throttle state, which includes a boolean about their current state, among other things.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCurrentUserThrottleState = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.TokenThrottleStateResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/ThrottleState/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetCurrentUserThrottleState",
      undefined,
      clientState
    );

  /**
   * Applies a charge of the offer that is already on the user's bnet membership to the commericialization system on their linked destiny membership of the given type.
   * @param membershipType The membership type to apply the offer to, must be linked to the user.
   * @param offer The offer name to spend.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApplyOfferToCurrentDestinyMembership = (
    membershipType: Globals.BungieMembershipType,
    offer: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.OfferHistoryResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/ApplyOfferToCurrentDestinyMembership/${e(membershipType)}/${e(
        offer
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ApplyOfferToCurrentDestinyMembership",
      undefined,
      clientState
    );

  /**
   * Record that the user has verified their age. Return value should be ignored, use the ErrorCode of the response to determine result.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static VerifyAge = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/VerifyAge/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "VerifyAge",
      undefined,
      clientState
    );

  /**
   * Obsolete
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClaimToken = (
    input: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.ClaimResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/Claim/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ClaimToken",
      input,
      clientState
    );

  /**
   * Consume an offer the user has purchased to get an offer that returns a platform-specific marketplace code, assuming that offer is for such a thing - most are not.
   * @param deviceType The desired platform for the marketplace code.
   * @param offerRegion The desired region for the marketplace code.
   * @param offerKey The name of the offer.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ConsumeMarketplacePlatformCodeOffer = (
    deviceType: Globals.ClientDeviceType,
    offerRegion: Globals.MarketplaceCodeRegion,
    offerKey: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.PlatformMarketplaceCodeResponse[]> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/ConsumeMarketplacePlatformCodeOffer/${e(deviceType)}/${e(
        offerRegion
      )}/${e(offerKey)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ConsumeMarketplacePlatformCodeOffer",
      undefined,
      clientState
    );

  /**
   * Returns all marketplace platform codes the logged in user has redeemed.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static MarketplacePlatformCodeOfferHistory = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contracts.PlatformMarketplaceCodeResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/MarketplacePlatformCodeOfferHistory/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "MarketplacePlatformCodeOfferHistory",
      undefined,
      clientState
    );

  /**
   * Returns a history of Eververse-related item transactions.
   * @param membershipId One of the linked account ids of the target user.
   * @param platform The Destiny platform to load history for; target user must have a linked platform account of this type to see any results.
   * @param page The zero based page of results to return.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EververseChangePurchaseHistory = (
    membershipId: string,
    platform: Globals.BungieMembershipType,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultEververseChangeEvent> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/EververseChangePurchaseHistory/${e(membershipId)}/${e(
        platform
      )}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EververseChangePurchaseHistory",
      undefined,
      clientState
    );

  /**
   * Returns a history of Eververse-related vendor transactions.
   * @param membershipId One of the linked account ids of the target user.
   * @param platform The Destiny platform to load history for; target user must have a linked platform account of this type to see any results.
   * @param page The zero based page of results to return.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EververseVendorPurchaseHistory = (
    membershipId: string,
    platform: Globals.BungieMembershipType,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultEververseVendorPurchaseEvent> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/EververseVendorPurchaseHistory/${e(membershipId)}/${e(
        platform
      )}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EververseVendorPurchaseHistory",
      undefined,
      clientState
    );

  /**
   * Returns the current Destiny 2 Silver balance, requires logging into the game to ensure value is up to date with latest purchases from platform marketplace. Can return null balance if profile does not have currency information.
   * @param membershipId One of the linked account ids of the target user.
   * @param platform The Destiny platform to load balance for; target user must have a linked platform account of this type to see any result.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EververseSilverBalance = (
    membershipId: string,
    platform: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.EververseSilverBalanceResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/EververseSilverBalance/${e(membershipId)}/${e(platform)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EververseSilverBalance",
      undefined,
      clientState
    );

  /**
   * Returns the current Destiny 2 Silver cashout information for customer service.
   * @param membershipId One of the linked account ids of the target user.
   * @param platform The Destiny platform to load balance for; target user must have a linked platform account of this type to see any result.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EververseCashoutInfo = (
    membershipId: string,
    platform: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.EververseCashout> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/EververseCashoutInfo/${e(membershipId)}/${e(platform)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EververseCashoutInfo",
      undefined,
      clientState
    );

  /**
   * Triggers sending an email to the authenticated user that will grant a Bungie Reward if the requirements are satisfied.
   * @param rewardId The GUID identifier of the reward.
   * @param membershipType The target Destiny membership to use to determine if requirements are being met.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EmailBungieReward = (
    rewardId: string,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/EmailBungieReward/${e(rewardId)}/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EmailBungieReward",
      undefined,
      clientState
    );

  /**
   * Generates a referral code to give to your friends to join you in Destiny 2.
   * @param titleId The RAF enabled product being targeted.
   * @param deviceType The desired platform for the referral code.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RAFGenerateReferralCode = (
    titleId: Globals.RAFTitleId,
    deviceType: Globals.ClientDeviceType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/RAF/GenerateReferralCode/${e(titleId)}/${e(deviceType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "RAFGenerateReferralCode",
      undefined,
      clientState
    );

  /**
   * Claim an RAF code as a new player.
   * @param titleId The RAF enabled product being targeted.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RAFClaimAsNewPlayer = (
    input: string,
    titleId: Globals.RAFTitleId,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.RAFBondState> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/RAF/ClaimAsNewPlayer/${e(titleId)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "RAFClaimAsNewPlayer",
      input,
      clientState
    );

  /**
   * Gets the current status of all a user's veteran RAF bonds in any state other than removed.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RAFGetVeteranBondDetails = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFBondDetailResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/RAF/GetVeteranBondDetails/${e(titleId)}/${e(mType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "RAFGetVeteranBondDetails",
      undefined,
      clientState
    );

  /**
   * Gets the current status of all a user's new player RAF bonds for their bungie.net membership as well as their destiny 2 account in any state other than removed.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RAFGetNewPlayerBondDetails = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFBondDetailResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/RAF/GetNewPlayerBondDetails/${e(titleId)}/${e(mType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "RAFGetNewPlayerBondDetails",
      undefined,
      clientState
    );

  /**
   * Break an existing bond where you are the veteran.
   * @param titleId The RAF enabled product being targeted.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BreakBond = (
    input: string,
    titleId: Globals.RAFTitleId,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.RAFBondState> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/RAF/BreakBond/${e(titleId)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "BreakBond",
      input,
      clientState
    );

  /**
   * Gets the RAF eligibility status of the current user for all linked platforms, unless there are no linked platforms, then we return unknown for all.
   * @param titleId The RAF enabled product being targeted.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRAFEligibility = (
    titleId: Globals.RAFTitleId,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFEligibilityResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/RAF/GetEligibility/${e(titleId)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetRAFEligibility",
      undefined,
      clientState
    );

  /**
   * Scans and updates a new player's bond with new state information based on latest player state.  Returns the new bond state. Caller must own the specified bond.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param rafId The id of the Refer-A-Friend bond to update.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateNewPlayerBondState = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    rafId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFBondDetailResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/RAF/UpdateNewPlayerBondState/${e(titleId)}/${e(mType)}/${e(
        rafId
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "UpdateNewPlayerBondState",
      undefined,
      clientState
    );

  /**
   * Gets the RAF veteran reward status for the current user.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetVeteranRewardStatus = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFVeteranRewardStatusResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/RAF/GetVeteranRewardStatus/${e(titleId)}/${e(mType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetVeteranRewardStatus",
      undefined,
      clientState
    );

  /**
   * Gets the RAF quest progress for the targeted user.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param membershipId The target Destiny 2 membership id to get quest progress for.
   * @param isVeteran Set to true if checking as a veteran, false if as a new player (the quests are different).
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetRAFQuestProgress = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    membershipId: string,
    isVeteran: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFQuestProgressResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/RAF/GetQuestProgress/${e(titleId)}/${e(mType)}/${e(
        membershipId
      )}/${e(isVeteran)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetRAFQuestProgress",
      undefined,
      clientState
    );

  /**
   * If the current user has any veteran rewards earned but not applied to the game, this will attempt to apply them to the game.
   * @param titleId The RAF enabled product being targeted.
   * @param mType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApplyVeteranRewards = (
    titleId: Globals.RAFTitleId,
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.RAFVeteranRewardStatusResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/RAF/ApplyVeteranRewards/${e(titleId)}/${e(mType)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ApplyVeteranRewards",
      undefined,
      clientState
    );

  /**
   * Twitch Drops self-repair function - scans twitch for drops not marked as fulfilled and resyncs them.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ForceDropsRepair = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/Partner/ForceDropsRepair/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ForceDropsRepair",
      undefined,
      clientState
    );

  /**
   * Claim a partner offer as the authenticated user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClaimPartnerOffer = (
    input: Tokens.PartnerOfferClaimRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/Partner/ClaimOffer/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ClaimPartnerOffer",
      input,
      clientState
    );

  /**
   * Apply a partner offer to the targeted user.  This endpoint does not claim a new offer, but any already claimed offers will be applied to the game if not already.
   * @param partnerApplicationId The partner application identifier.
   * @param targetBnetMembershipId The bungie.net user to apply missing offers to. If not self, elevated permissions are required.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApplyMissingPartnerOffersWithoutClaim = (
    partnerApplicationId: number,
    targetBnetMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/Partner/ApplyMissingOffers/${e(partnerApplicationId)}/${e(
        targetBnetMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ApplyMissingPartnerOffersWithoutClaim",
      undefined,
      clientState
    );

  /**
   * Returns the partner sku and offer history of the targeted user.  Elevated permissions are required to see users that are not yourself.
   * @param partnerApplicationId The partner application identifier.
   * @param targetBnetMembershipId The bungie.net user to apply missing offers to. If not self, elevated permissions are required.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPartnerOfferSkuHistory = (
    partnerApplicationId: number,
    targetBnetMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.PartnerOfferSkuHistoryResponse[]> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/Partner/History/${e(partnerApplicationId)}/${e(
        targetBnetMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetPartnerOfferSkuHistory",
      undefined,
      clientState
    );

  /**
   * Returns the partner rewards history of the targeted user, both partner offers and Twitch drops.
   * @param targetBnetMembershipId The bungie.net user to return reward history for.
   * @param partnerApplicationId The partner application identifier.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPartnerRewardHistory = (
    targetBnetMembershipId: string,
    partnerApplicationId: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.PartnerRewardHistoryResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/Partner/History/${e(targetBnetMembershipId)}/Application/${e(
        partnerApplicationId
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetPartnerRewardHistory",
      undefined,
      clientState
    );

  /**
   * Returns the bungie rewards for the targeted user.
   * @param membershipId bungie.net user membershipId for requested user rewards. If not self, elevated permissions are required.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieRewardsForUser = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: string]: Tokens.BungieRewardDisplay }> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/Rewards/GetRewardsForUser/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetBungieRewardsForUser",
      undefined,
      clientState
    );

  /**
   * Returns the bungie rewards for the targeted user when a platform membership Id and Type are used.
   * @param membershipId users platform membershipId for requested user rewards. If not self, elevated permissions are required.
   * @param membershipType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieRewardsForPlatformUser = (
    membershipId: string,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: string]: Tokens.BungieRewardDisplay }> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/Rewards/GetRewardsForPlatformUser/${e(membershipId)}/${e(
        membershipType
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetBungieRewardsForPlatformUser",
      undefined,
      clientState
    );

  /**
   * Returns a list of the current bungie rewards
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBungieRewardsList = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: string]: Tokens.BungieRewardDisplay }> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/Rewards/BungieRewards/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetBungieRewardsList",
      undefined,
      clientState
    );

  /**
   * Claim a digital bungie reward.
   * @param targetRewardId The id of the reward user is claiming.
   * @param mType The target Destiny 2 membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClaimDigitalBungieReward = (
    targetRewardId: string,
    mType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.BungieRewardClaimResponse> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/Rewards/ClaimDigitalBungieReward/${e(targetRewardId)}/${e(
        mType
      )}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "ClaimDigitalBungieReward",
      undefined,
      clientState
    );

  /**
   * Encrypt custom variables for Survey Monkey.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EncryptSurveyVariables = (
    input: Models.SurveyVariablesRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.SurveyEncryptedVariables> =>
    ApiIntermediary.doPostRequest(
      `/Tokens/EncryptSurveyVariables/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "EncryptSurveyVariables",
      input,
      clientState
    );

  /**
   * Returns the configuration for a cohort based on a JWT.
   * @param token The JWT identifying the cohort.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCohortConfig = (
    token: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Tokens.CohortConfigResponse> =>
    ApiIntermediary.doGetRequest(
      `/Tokens/GetCohortConfig/${e(token)}/`,
      [],
      optionalQueryAppend,
      "Tokens",
      "GetCohortConfig",
      undefined,
      clientState
    );
}

class Destiny2ServiceInternal {
  /**
   * Summer lovin, having a blast.  Summer lovin, happened so fast.  For the love of God, don't build anything permanent hitting this service, it's not long for this world as you hopefully guessed from the name.
   * @param membershipType A valid non-BungieNet membership type.
   * @param membershipId The ID of the membership whose linked Destiny accounts you want returned.  Make sure your membership ID matches its Membership Type: don't pass us a PSN membership ID and the XBox membership type, it's not going to work!
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTriumphsThrowaway = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Triumphs.DestinyTriumphsResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Triumphs/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetTriumphsThrowaway",
      undefined,
      clientState
    );

  /**
   * Did you have a summah?  If you did, call this endpoint to get your reward.
   * @param membershipType A valid non-BungieNet membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTriumphsDiscountThrowaway = (
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Triumphs.DestinyTriumphsDiscountReward> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/${e(membershipType)}/Triumphs/Reward/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetTriumphsDiscountThrowaway",
      undefined,
      clientState
    );

  /**
   * 7th Column Copy character function (use at own risk), will not function outside of 7th column.
   * @param membershipType A valid Destiny membership type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CopyCharactersInPreview = (
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/7thColumnPreview/CopyCharacters/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "CopyCharactersInPreview",
      undefined,
      clientState
    );

  /**
   * Returns the current version of the manifest as a json object.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyManifest = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Config.DestinyManifest> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Manifest/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetDestinyManifest",
      undefined,
      clientState
    );

  /**
   * Returns the static definition of an entity of the given Type and hash identifier.  Examine the API Documentation for the Type Names of entities that have their own definitions.  Note that the return type will always *inherit from* DestinyDefinition, but the specific type returned will be the requested entity type if it can be found.  Please don't use this as a chatty alternative to the Manifest database if you require large sets of data, but for simple and one-off accesses this should be handy.
   * @param entityType The type of entity for whom you would like results.  These correspond to the entity's definition contract name.  For instance, if you are looking for items, this property should be 'DestinyInventoryItemDefinition'.  PREVIEW: This endpoint is still in beta, and may experience rough edges.  The schema is tentatively in final form, but there may be bugs that prevent desirable operation.
   * @param hashIdentifier The hash identifier for the specific Entity you want returned.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyEntityDefinition = (
    entityType: string,
    hashIdentifier: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Definitions.DestinyDefinition> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Manifest/${e(entityType)}/${e(hashIdentifier)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetDestinyEntityDefinition",
      undefined,
      clientState
    );

  /**
   * Returns the set of live tile Content Items that are relevant for Destiny.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyLiveTileContentItems = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Content.ContentItemPublicContract[]> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/LiveTiles/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetDestinyLiveTileContentItems",
      undefined,
      clientState
    );

  /**
   * [OBSOLETE] Do not use this method to search players, use SearchDestinyPlayerByBungieName instead.
   * @param membershipType A valid non-BungieNet membership type, or All. Indicates which memberships to return.  You probably want this set to All.
   * @param displayName The full bungie global display name to look up, include the # and the code at the end. This is an exact match lookup.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchDestinyPlayer = (
    membershipType: Globals.BungieMembershipType,
    displayName: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserInfoCard[]> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/SearchDestinyPlayer/${e(membershipType)}/${e(displayName)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "SearchDestinyPlayer",
      undefined,
      clientState
    );

  /**
   * Returns a list of Destiny memberships given a global Bungie Display Name. This method will hide overridden memberships due to cross save.
   * @param membershipType A valid non-BungieNet membership type, or All. Indicates which memberships to return.  You probably want this set to All.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchDestinyPlayerByBungieName = (
    input: User.ExactSearchRequest,
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<User.UserInfoCard[]> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/SearchDestinyPlayerByBungieName/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "SearchDestinyPlayerByBungieName",
      input,
      clientState
    );

  /**
   * Returns a summary information about all profiles linked to the requesting membership type/membership ID that have valid Destiny information.  The passed-in Membership Type/Membership ID may be a Bungie.Net membership or a Destiny membership.  It only returns the minimal amount of data to begin making more substantive requests, but will hopefully serve as a useful alternative to UserServices for people who just care about Destiny data.  Note that it will only return linked accounts whose linkages you are allowed to view.
   * @param membershipType The type for the membership whose linked Destiny accounts you want returned.
   * @param membershipId The ID of the membership whose linked Destiny accounts you want returned.  Make sure your membership ID matches its Membership Type: don't pass us a PSN membership ID and the XBox membership type, it's not going to work!
   * @param getAllMemberships (optional) if set to 'true', all memberships regardless of whether they're obscured by overrides will be returned.  Normal privacy restrictions on account linking will still apply no matter what.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLinkedProfiles = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    getAllMemberships: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyLinkedProfilesResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        membershipId
      )}/LinkedProfiles/`,
      [["getAllMemberships", getAllMemberships]],
      optionalQueryAppend,
      "Destiny2",
      "GetLinkedProfiles",
      undefined,
      clientState
    );

  /**
   * Given a membership type, this returns summary info about the current user's *original* Destiny Profile attached to that platform, along with other associated information.
   * @param membershipType The Membership Type for whom we want to return the user's original destiny profile information'.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetOriginalProfileSummaryForMembershipType = (
    membershipType: Globals.BungieMembershipType,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyProfileSummaryResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/OriginalProfileSummary/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetOriginalProfileSummaryForMembershipType",
      undefined,
      clientState
    );

  /**
   * Returns Destiny Profile information for the supplied membership.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetProfile = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyProfileResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(destinyMembershipId)}/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetProfile",
      undefined,
      clientState
    );

  /**
   * Returns character information for the supplied character.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID.
   * @param characterId ID of the character.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCharacter = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyCharacterResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetCharacter",
      undefined,
      clientState
    );

  /**
   * Given a json of unlock flag/value hashes as input, returns the current state of each flag/value.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static QueryUnlocks = (
    input: Requests.DestinyQueryUnlocksRequest,
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyQueryUnlocksResponse> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Unlocks/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "QueryUnlocks",
      input,
      clientState
    );

  /**
   * Returns information on the weekly clan rewards and if the clan has earned them or not. Note that this will always report rewards as not redeemed.
   * @param groupId A valid group id of clan.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetClanWeeklyRewardState = (
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Milestones.DestinyMilestone> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Clan/${e(groupId)}/WeeklyRewardState/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetClanWeeklyRewardState",
      undefined,
      clientState
    );

  /**
   * Returns the dictionary of values for the Clan Banner
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetClanBannerSource = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<ClanBanner.ClanBannerSource> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Clan/ClanBannerDictionary/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetClanBannerSource",
      undefined,
      clientState
    );

  /**
   * Retrieve the details of an instanced Destiny Item.  An instanced Destiny item is one with an ItemInstanceId.  Non-instanced items, such as materials, have no useful instance-specific details and thus are not queryable here.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The membership ID of the destiny profile.
   * @param itemInstanceId The Instance ID of the destiny item.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetItem = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    itemInstanceId: string,
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyItemResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Item/${e(itemInstanceId)}/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetItem",
      undefined,
      clientState
    );

  /**
   * Get currently available vendors from the list of vendors that can possibly have rotating inventory.  Note that this does not include things like preview vendors and vendors-as-kiosks, neither of whom have rotating/dynamic inventories.  Use their definitions as-is for those.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID of another user. You may be denied.
   * @param characterId The Destiny Character ID of the character for whom we're getting vendor info.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param filter The filter of what vendors and items to return, if any.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetVendors = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    components: Globals.DestinyComponentType[],
    filter: Globals.DestinyVendorFilter,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyVendorsResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Vendors/`,
      [
        ["components", components],
        ["filter", filter],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetVendors",
      undefined,
      clientState
    );

  /**
   * Get the details of a specific Vendor.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID of another user. You may be denied.
   * @param characterId The Destiny Character ID of the character for whom we're getting vendor info.
   * @param vendorHash The Hash identifier of the Vendor to be returned.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetVendor = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    vendorHash: number,
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyVendorResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Vendors/${e(vendorHash)}/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetVendor",
      undefined,
      clientState
    );

  /**
   * Get items available from vendors where the vendors have items for sale that are common for everyone.  If any portion of the Vendor's available inventory is character or account specific, we will be unable to return their data from this endpoint due to the way that available inventory is computed.  As I am often guilty of saying: 'It's a long story...'
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPublicVendors = (
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyPublicVendorsResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Vendors/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetPublicVendors",
      undefined,
      clientState
    );

  /**
   * Given a Presentation Node that has Collectibles as direct descendants, this will return item details about those descendants in the context of the requesting character.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID of another user. You may be denied.
   * @param characterId The Destiny Character ID of the character for whom we're getting collectible detail info.
   * @param collectiblePresentationNodeHash The hash identifier of the Presentation Node for whom we should return collectible details.  Details will only be returned for collectibles that are direct descendants of this node.
   * @param components A comma separated list of components to return (as strings or numeric values).  See the DestinyComponentType enum for valid components to request.  You must request at least one component to receive results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCollectibleNodeDetails = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    collectiblePresentationNodeHash: number,
    components: Globals.DestinyComponentType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyCollectibleNodeDetailResponse> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Profile/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Collectibles/${e(
        collectiblePresentationNodeHash
      )}/`,
      [["components", components]],
      optionalQueryAppend,
      "Destiny2",
      "GetCollectibleNodeDetails",
      undefined,
      clientState
    );

  /**
   * Transfer an item to/from your vault.  You must have a valid Destiny account.  You must also pass BOTH a reference AND an instance ID if it's an instanced item.  itshappening.gif
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static TransferItem = (
    input: Requests.DestinyItemTransferRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/TransferItem/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "TransferItem",
      input,
      clientState
    );

  /**
   * Allows you to claim Season Pass rewards from seasons that have ended.  You must have a valid Destiny account.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClaimSeasonPassReward = (
    input: Actions.DestinyClaimSeasonPassRewardActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Actions.DestinyClaimProgressionRewardResult> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Seasons/ClaimReward/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "ClaimSeasonPassReward",
      input,
      clientState
    );

  /**
   * Extract an item from the Postmaster, with whatever implications that may entail.  You must have a valid Destiny account.  You must also pass BOTH a reference AND an instance ID if it's an instanced item.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static PullFromPostmaster = (
    input: Actions.DestinyPostmasterTransferRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/PullFromPostmaster/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "PullFromPostmaster",
      input,
      clientState
    );

  /**
   * Equip an item.  You must have a valid Destiny Account, and either be in a social space, in orbit, or offline.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EquipItem = (
    input: Actions.DestinyItemActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/EquipItem/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "EquipItem",
      input,
      clientState
    );

  /**
   * Equip a list of items by itemInstanceIds.  You must have a valid Destiny Account, and either be in a social space, in orbit, or offline.  Any items not found on your character will be ignored.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EquipItems = (
    input: Actions.DestinyItemSetActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<World.DestinyEquipItemResults> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/EquipItems/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "EquipItems",
      input,
      clientState
    );

  /**
   * Equip a loadout. You must have a valid Destiny Account, and either be in a social space, in orbit, or offline.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EquipLoadout = (
    input: Actions.DestinyLoadoutActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Loadouts/EquipLoadout/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "EquipLoadout",
      input,
      clientState
    );

  /**
   * Snapshot a loadout with the currently equipped items.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SnapshotLoadout = (
    input: Actions.DestinyLoadoutUpdateActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Loadouts/SnapshotLoadout/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "SnapshotLoadout",
      input,
      clientState
    );

  /**
   * Update the color, icon, and name of a loadout.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateLoadoutIdentifiers = (
    input: Actions.DestinyLoadoutUpdateActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Loadouts/UpdateLoadoutIdentifiers/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "UpdateLoadoutIdentifiers",
      input,
      clientState
    );

  /**
   * Clear the identifiers and items of a loadout.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClearLoadout = (
    input: Actions.DestinyLoadoutActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Loadouts/ClearLoadout/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "ClearLoadout",
      input,
      clientState
    );

  /**
   * Set the Lock State for an instanced item.  You must have a valid Destiny Account.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetItemLockState = (
    input: Actions.DestinyItemStateRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/SetLockState/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "SetItemLockState",
      input,
      clientState
    );

  /**
   * Set the Tracking State for an instanced item, if that item is a Quest or Bounty.  You must have a valid Destiny Account.  Yeah, it's an item.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetQuestTrackedState = (
    input: Actions.DestinyItemStateRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/SetTrackedState/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "SetQuestTrackedState",
      input,
      clientState
    );

  /**
   * Insert a plug into a socketed item.  I know how it sounds, but I assure you it's much more G-rated than you might be guessing.  We haven't decided yet whether this will be able to insert plugs that have side effects, but if we do it will require special scope permission for an application attempting to do so.  You must have a valid Destiny Account, and either be in a social space, in orbit, or offline.  Request must include proof of permission for 'InsertPlugs' from the account owner.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static InsertSocketPlug = (
    input: Actions.DestinyInsertPlugsActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyItemChangeResponse> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/InsertSocketPlug/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "InsertSocketPlug",
      input,
      clientState
    );

  /**
   * Insert a 'free' plug into an item's socket.  This does not require 'Advanced Write Action' authorization and is available to 3rd-party apps, but will only work on 'free and reversible' socket actions (Perks, Armor Mods, Shaders, Ornaments, etc.). You must have a valid Destiny Account, and the character must either be in a social space, in orbit, or offline.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static InsertSocketPlugFree = (
    input: Actions.DestinyInsertPlugsFreeActionRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Responses.DestinyItemChangeResponse> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Actions/Items/InsertSocketPlugFree/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "InsertSocketPlugFree",
      input,
      clientState
    );

  /**
   * Gets the available post game carnage report for the activity ID.
   * @param activityId The ID of the activity whose PGCR is requested.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPostGameCarnageReport = (
    activityId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyPostGameCarnageReportData> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/PostGameCarnageReport/${e(activityId)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetPostGameCarnageReport",
      undefined,
      clientState
    );

  /**
   * Report a player that you met in an activity that was engaging in ToS-violating activities.  Both you and the offending player must have played in the activityId passed in.  Please use this judiciously and only when you have strong suspicions of violation, pretty please.
   * @param activityId The ID of the activity where you ran into the brigand that you're reporting.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReportOffensivePostGameCarnageReportPlayer = (
    input: Requests.DestinyReportOffensePgcrRequest,
    activityId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Stats/PostGameCarnageReport/${e(activityId)}/Report/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "ReportOffensivePostGameCarnageReportPlayer",
      input,
      clientState
    );

  /**
   * Gets historical stats definitions.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetHistoricalStatsDefinition = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/Definition/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetHistoricalStatsDefinition",
      undefined,
      clientState
    );

  /**
   * Gets the available blob for the activity ID.
   * @param activityId The ID of the activity whose blob is requested.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetActivityBlob = (
    activityId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number[]> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/ActivityBlob/${e(activityId)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetActivityBlob",
      undefined,
      clientState
    );

  /**
   * Gets leaderboards with the signed in user's friends and the supplied destinyMembershipId as the focus.  PREVIEW: This endpoint is still in beta, and may experience rough edges.  The schema is in final form, but there may be bugs that prevent desirable operation.
   * @param groupId Group ID of the clan whose leaderboards you wish to fetch.
   * @param modes List of game modes for which to get leaderboards. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param statid ID of stat to return rather than returning all Leaderboard stats.
   * @param maxtop Maximum number of top players to return. Use a large number to get entire leaderboard.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetClanLeaderboards = (
    groupId: string,
    modes: string,
    statid: string,
    maxtop: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyLeaderboardResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/Leaderboards/Clans/${e(groupId)}/`,
      [
        ["modes", modes],
        ["statid", statid],
        ["maxtop", maxtop],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetClanLeaderboards",
      undefined,
      clientState
    );

  /**
   * Gets aggregated stats for a clan using the same categories as the clan leaderboards.  PREVIEW: This endpoint is still in beta, and may experience rough edges.  The schema is in final form, but there may be bugs that prevent desirable operation.
   * @param groupId Group ID of the clan whose leaderboards you wish to fetch.
   * @param modes List of game modes for which to get leaderboards. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetClanAggregateStats = (
    groupId: string,
    modes: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyClanAggregateStat[]> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/AggregateClanStats/${e(groupId)}/`,
      [["modes", modes]],
      optionalQueryAppend,
      "Destiny2",
      "GetClanAggregateStats",
      undefined,
      clientState
    );

  /**
   * Gets leaderboards for a PSN authenticated user.
   * @param modes List of game modes for which to get leaderboards. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param code Auth Code provided by PSN.  This is optional if a valid PSN cookie is present.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLeaderboardsForPsn = (
    modes: string,
    code: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyLeaderboardResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/Leaderboards/Psn/`,
      [
        ["modes", modes],
        ["code", code],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetLeaderboardsForPsn",
      undefined,
      clientState
    );

  /**
   * Gets leaderboards with the signed in user's friends and the supplied destinyMembershipId as the focus.  PREVIEW: This endpoint has not yet been implemented.  It is being returned for a preview of future functionality, and for public comment/suggestion/preparation.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param modes List of game modes for which to get leaderboards. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param statid ID of stat to return rather than returning all Leaderboard stats.
   * @param maxtop Maximum number of top players to return. Use a large number to get entire leaderboard.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLeaderboards = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    modes: string,
    statid: string,
    maxtop: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyLeaderboardResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(
        destinyMembershipId
      )}/Stats/Leaderboards/`,
      [
        ["modes", modes],
        ["statid", statid],
        ["maxtop", maxtop],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetLeaderboards",
      undefined,
      clientState
    );

  /**
   * Gets leaderboards with the signed in user's friends and the supplied destinyMembershipId as the focus.  PREVIEW: This endpoint is still in beta, and may experience rough edges.  The schema is in final form, but there may be bugs that prevent desirable operation.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param characterId The specific character to build the leaderboard around for the provided Destiny Membership.
   * @param modes List of game modes for which to get leaderboards. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param statid ID of stat to return rather than returning all Leaderboard stats.
   * @param maxtop Maximum number of top players to return. Use a large number to get entire leaderboard.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLeaderboardsForCharacter = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    modes: string,
    statid: string,
    maxtop: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyLeaderboardResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Stats/Leaderboards/${e(membershipType)}/${e(
        destinyMembershipId
      )}/${e(characterId)}/`,
      [
        ["modes", modes],
        ["statid", statid],
        ["maxtop", maxtop],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetLeaderboardsForCharacter",
      undefined,
      clientState
    );

  /**
   * Gets a page list of Destiny items.
   * @param page Page number to return, starting with 0.
   * @param count Number of rows to return. Use 10, 25, 50, 100, or 500.
   * @param name Name of items to return (partial match, no case). Omit for all items.
   * @param order Item property used for sorting. Use Name, ItemType, Rarity, ItemTypeName, ItemStatHash, MinimumRequiredLevel, MaximumRequiredLevel.
   * @param orderstathash This value is used when the order parameter is set to ItemStatHash.  The item stat for the provided hash value will be used in the sort.
   * @param direction Order to sort items: Ascending or Descending
   * @param rarity Rarity of items to return: Currency, Basic, Common, Rare, Superior, Exotic. Omit for all items.
   * @param step Hash ID of the talent node step that an item must have in order to be returned.
   * @param categories Category identifiers.  Only items that are in all of the passed-in categories will be returned.
   * @param weaponPerformance Items must have node steps in one of these categories, omit for all items. RateOfFire, Damage, Accuracy, Range, Zoom, Recoil, Ready, Reload, HairTrigger, AmmoAndMagazine, TrackingAndDetonation, ShotgunSpread, ChargeTime
   * @param impactEffects Items must have node steps in one of these categories, omit for all items. ArmorPiercing, Ricochet, Flinch, CollateralDamage, Disorient, HighlightTarget
   * @param guardianAttributes Items must have node steps in one of these categories, omit for all items. Stats, Shields, Health, Revive, AimUnderFire, Radar, Invisibility, Reputations
   * @param lightAbilities Items must have node steps in one of these categories, omit for all items. Grenades, Melee, MovementModes, Orbs, SuperEnergy, SuperMods
   * @param damageTypes Items must have node steps in one of these categories, omit for all items. Kinetic, Arc, Solar, Void
   * @param matchrandomsteps True if the supplied groups/step hash filters should match random node steps. False indicates the item can always get the step before it is considered a match.
   * @param sourcecat Items must drop from the specified source category, omit for all items. Use Vendor or Activity.
   * @param sourcehash Items must drop from the specified source, omit for all items. Overrides sourcecat.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetArmoryItems = (
    page: number,
    count: number,
    name: string,
    order: Globals.DestinyExplorerOrderBy,
    orderstathash: number,
    direction: Globals.DestinyExplorerOrderDirection,
    rarity: Globals.TierType,
    step: number,
    categories: number[],
    weaponPerformance: Globals.DestinyTalentNodeStepWeaponPerformances,
    impactEffects: Globals.DestinyTalentNodeStepImpactEffects,
    guardianAttributes: Globals.DestinyTalentNodeStepGuardianAttributes,
    lightAbilities: Globals.DestinyTalentNodeStepLightAbilities,
    damageTypes: Globals.DestinyTalentNodeStepDamageTypes,
    matchrandomsteps: boolean,
    sourcecat: Globals.DestinyRewardSourceCategory,
    sourcehash: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Explorer.DestinyExplorerItems> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Armory/Items/`,
      [
        ["page", page],
        ["count", count],
        ["name", name],
        ["order", order],
        ["orderstathash", orderstathash],
        ["direction", direction],
        ["rarity", rarity],
        ["step", step],
        ["categories", categories],
        ["weaponPerformance", weaponPerformance],
        ["impactEffects", impactEffects],
        ["guardianAttributes", guardianAttributes],
        ["lightAbilities", lightAbilities],
        ["damageTypes", damageTypes],
        ["matchrandomsteps", matchrandomsteps],
        ["sourcecat", sourcecat],
        ["sourcehash", sourcehash],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetArmoryItems",
      undefined,
      clientState
    );

  /**
   * Gets a page list of Destiny items.
   * @param type The type of entity for whom you would like results.  These correspond to the entity's definition contract name.  For instance, if you are looking for items, this property should be 'DestinyInventoryItemDefinition'.
   * @param searchTerm The string to use when searching for Destiny entities.
   * @param page Page number to return, starting with 0.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchDestinyEntities = (
    type: string,
    searchTerm: string,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Definitions.DestinyEntitySearchResult> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Armory/Search/${e(type)}/${e(searchTerm)}/`,
      [["page", page]],
      optionalQueryAppend,
      "Destiny2",
      "SearchDestinyEntities",
      undefined,
      clientState
    );

  /**
   * Gets historical stats for indicated character.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param characterId The id of the character to retrieve. You can omit this character ID or set it to 0 to get aggregate stats across all characters.
   * @param periodType Indicates a specific period type to return. Optional. May be: Daily, AllTime, or Activity
   * @param modes Game modes to return. See the documentation for DestinyActivityModeType for valid values, and pass in string representation, comma delimited.
   * @param groups Group of stats to include, otherwise only general stats are returned. Comma separated list is allowed. Values: General, Weapons, Medals
   * @param daystart First day to return when daily stats are requested. Use the format YYYY-MM-DD.  Currently, we cannot allow more than 31 days of daily data to be requested in a single request.
   * @param dayend Last day to return when daily stats are requested.  Use the format YYYY-MM-DD.  Currently, we cannot allow more than 31 days of daily data to be requested in a single request.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetHistoricalStats = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    periodType: Globals.PeriodType,
    modes: Globals.DestinyActivityModeType[],
    groups: Globals.DestinyStatsGroupType[],
    daystart: string,
    dayend: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyHistoricalStatsResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Stats/`,
      [
        ["periodType", periodType],
        ["modes", modes],
        ["groups", groups],
        ["daystart", daystart],
        ["dayend", dayend],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetHistoricalStats",
      undefined,
      clientState
    );

  /**
   * Gets aggregate historical stats organized around each character for a given account.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param groups Groups of stats to include, otherwise only general stats are returned.  Comma separated list is allowed. Values: General, Weapons, Medals.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetHistoricalStatsForAccount = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    groups: Globals.DestinyStatsGroupType[],
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyHistoricalStatsAccountResult> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(destinyMembershipId)}/Stats/`,
      [["groups", groups]],
      optionalQueryAppend,
      "Destiny2",
      "GetHistoricalStatsForAccount",
      undefined,
      clientState
    );

  /**
   * Gets activity history stats for indicated character.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param characterId The id of the character to retrieve.
   * @param mode A filter for the activity mode to be returned. None returns all activities. See the documentation for DestinyActivityModeType for valid values, and pass in string representation.
   * @param count Number of rows to return
   * @param page Page number to return, starting with 0.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetActivityHistory = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    mode: Globals.DestinyActivityModeType,
    count: number,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyActivityHistoryResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Stats/Activities/`,
      [
        ["mode", mode],
        ["count", count],
        ["page", page],
      ],
      optionalQueryAppend,
      "Destiny2",
      "GetActivityHistory",
      undefined,
      clientState
    );

  /**
   * Gets details about unique weapon usage, including all exotic weapons.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param characterId The id of the character to retrieve.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUniqueWeaponHistory = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyHistoricalWeaponStatsData> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Stats/UniqueWeapons/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetUniqueWeaponHistory",
      undefined,
      clientState
    );

  /**
   * Gets all activities the character has participated in together with aggregate statistics for those activities.
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId The Destiny membershipId of the user to retrieve.
   * @param characterId The specific character whose activities should be returned.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDestinyAggregateActivityStats = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    characterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<HistoricalStats.DestinyAggregateActivityResults> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/Account/${e(
        destinyMembershipId
      )}/Character/${e(characterId)}/Stats/AggregateActivityStats/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetDestinyAggregateActivityStats",
      undefined,
      clientState
    );

  /**
   * Gets custom localized content for the milestone of the given hash, if it exists.
   * @param milestoneHash The identifier for the milestone to be returned.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPublicMilestoneContent = (
    milestoneHash: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Milestones.DestinyMilestoneContent> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Milestones/${e(milestoneHash)}/Content/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetPublicMilestoneContent",
      undefined,
      clientState
    );

  /**
   * Gets public information about currently available Milestones.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPublicMilestones = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: number]: Milestones.DestinyPublicMilestone }> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Milestones/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetPublicMilestones",
      undefined,
      clientState
    );

  /**
   * Initialize a request to perform an advanced write action.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AwaInitializeRequest = (
    input: Advanced.AwaPermissionRequested,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Advanced.AwaInitializeResponse> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Awa/Initialize/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "AwaInitializeRequest",
      input,
      clientState
    );

  /**
   * Provide the result of the user interaction. Called by the Bungie Destiny App to approve or reject a request.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AwaProvideAuthorizationResult = (
    input: Advanced.AwaUserResponse,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doPostRequest(
      `/Destiny2/Awa/AwaProvideAuthorizationResult/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "AwaProvideAuthorizationResult",
      input,
      clientState
    );

  /**
   * Returns the action token if user approves the request.
   * @param correlationId The identifier for the advanced write action request.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AwaGetActionToken = (
    correlationId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Advanced.AwaAuthorizationResult> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/Awa/GetActionToken/${e(correlationId)}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "AwaGetActionToken",
      undefined,
      clientState
    );

  /**
   * Returns Destiny Profile information for the supplied membership.  Internal implementation for our own uses.  Please don't try to hit it, thank you please pull through to the next window
   * @param membershipType A valid non-BungieNet membership type.
   * @param destinyMembershipId Destiny membership ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetProfileInternal = (
    membershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/Destiny2/${e(membershipType)}/ProfileInternal/${e(
        destinyMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "Destiny2",
      "GetProfileInternal",
      undefined,
      clientState
    );
}

class CommunitycontentServiceInternal {
  /**
   * Returns community content.
   * @param sort The sort mode.
   * @param mediaFilter The type of media to get
   * @param page Zero based page
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCommunityContent = (
    sort: Globals.CommunityContentSortMode,
    mediaFilter: Globals.ForumTopicsCategoryFiltersEnum,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/CommunityContent/Get/${e(sort)}/${e(mediaFilter)}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "CommunityContent",
      "GetCommunityContent",
      undefined,
      clientState
    );

  /**
   * Returns community content approval queue
   * @param sort The sort mode.
   * @param mediaFilter The type of media to get
   * @param page Zero based page
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApprovalQueue = (
    sort: Globals.CommunityContentSortMode,
    mediaFilter: Globals.ForumTopicsCategoryFiltersEnum,
    page: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostSearchResponse> =>
    ApiIntermediary.doGetRequest(
      `/CommunityContent/Queue/${e(sort)}/${e(mediaFilter)}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "CommunityContent",
      "GetApprovalQueue",
      undefined,
      clientState
    );

  /**
   * Submits a new community content item.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SubmitContent = (
    input: Contract.CommunityContentSubmission,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/CommunityContent/Submit/`,
      [],
      optionalQueryAppend,
      "CommunityContent",
      "SubmitContent",
      input,
      clientState
    );

  /**
   * Edits a community content item.
   * @param postId The id of the item to edit
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditContent = (
    input: Contract.CommunityContentSubmission,
    postId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Contract.PostResponse> =>
    ApiIntermediary.doPostRequest(
      `/CommunityContent/Edit/${e(postId)}/`,
      [],
      optionalQueryAppend,
      "CommunityContent",
      "EditContent",
      input,
      clientState
    );

  /**
   * Approves or rejects an item in the queue
   * @param approve True if these items are to be approved, false if rejected
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AlterApprovalState = (
    input: string[],
    approve: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/CommunityContent/AlterApprovalState/${e(approve)}/`,
      [],
      optionalQueryAppend,
      "CommunityContent",
      "AlterApprovalState",
      input,
      clientState
    );
}

class TrendingServiceInternal {
  /**
   * Returns trending items for Bungie.net, collapsed into the first page of items per category.  For pagination within a category, call GetTrendingCategory.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTrendingCategories = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Trending.TrendingCategories> =>
    ApiIntermediary.doGetRequest(
      `/Trending/Categories/`,
      [],
      optionalQueryAppend,
      "Trending",
      "GetTrendingCategories",
      undefined,
      clientState
    );

  /**
   * Returns paginated lists of trending items for a category.
   * @param categoryId The ID of the category for whom you want additional results.
   * @param pageNumber The page # of results to return.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTrendingCategory = (
    categoryId: string,
    pageNumber: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultTrendingEntry> =>
    ApiIntermediary.doGetRequest(
      `/Trending/Categories/${e(categoryId)}/${e(pageNumber)}/`,
      [],
      optionalQueryAppend,
      "Trending",
      "GetTrendingCategory",
      undefined,
      clientState
    );

  /**
   * Returns the detailed results for a specific trending entry.  Note that trending entries are uniquely identified by a combination of *both* the TrendingEntryType *and* the identifier: the identifier alone is not guaranteed to be globally unique.
   * @param trendingEntryType The type of entity to be returned.
   * @param identifier The identifier for the entity to be returned.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetTrendingEntryDetail = (
    trendingEntryType: Globals.TrendingEntryType,
    identifier: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Trending.TrendingDetail> =>
    ApiIntermediary.doGetRequest(
      `/Trending/Details/${e(trendingEntryType)}/${e(identifier)}/`,
      [],
      optionalQueryAppend,
      "Trending",
      "GetTrendingEntryDetail",
      undefined,
      clientState
    );
}

class FireteamServiceInternal {
  /**
   * Gets a count of all active non-public fireteams for the specified clan.  Maximum value returned is 25.
   * @param groupId The group id of the clan.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetActivePrivateClanFireteamCount = (
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<number> =>
    ApiIntermediary.doGetRequest(
      `/Fireteam/Clan/${e(groupId)}/ActiveCount/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "GetActivePrivateClanFireteamCount",
      undefined,
      clientState
    );

  /**
   * Gets a listing of all of this clan's fireteams that are have available slots. Caller is not checked for join criteria so caching is maximized.
   * @param groupId The group id of the clan.
   * @param platform The platform filter.
   * @param activityType The activity type to filter by.
   * @param dateRange The date range to grab available fireteams.
   * @param slotFilter Filters based on available slots
   * @param publicOnly Determines public/private filtering.
   * @param page Zero based page
   * @param langFilter An optional language filter.
   * @param excludeImmediate If you wish the result to exclude immediate fireteams, set this to true.  Immediate-only can be forced using the dateRange enum.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableClanFireteams = (
    groupId: string,
    platform: Globals.FireteamPlatform,
    activityType: number,
    dateRange: Globals.FireteamDateRange,
    slotFilter: Globals.FireteamSlotSearch,
    publicOnly: Globals.FireteamPublicSearchOption,
    page: number,
    langFilter: string,
    excludeImmediate: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFireteamSummary> =>
    ApiIntermediary.doGetRequest(
      `/Fireteam/Clan/${e(groupId)}/Available/${e(platform)}/${e(
        activityType
      )}/${e(dateRange)}/${e(slotFilter)}/${e(publicOnly)}/${e(page)}/`,
      [
        ["langFilter", langFilter],
        ["excludeImmediate", excludeImmediate],
      ],
      optionalQueryAppend,
      "Fireteam",
      "GetAvailableClanFireteams",
      undefined,
      clientState
    );

  /**
   * Gets a listing of all public fireteams starting now with open slots. Caller is not checked for join criteria so caching is maximized.
   * @param platform The platform filter.
   * @param activityType The activity type to filter by.
   * @param dateRange The date range to grab available fireteams.
   * @param slotFilter Filters based on available slots
   * @param page Zero based page
   * @param langFilter An optional language filter.
   * @param excludeImmediate If you wish the result to exclude immediate fireteams, set this to true.  Immediate-only can be forced using the dateRange enum.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchPublicAvailableClanFireteams = (
    platform: Globals.FireteamPlatform,
    activityType: number,
    dateRange: Globals.FireteamDateRange,
    slotFilter: Globals.FireteamSlotSearch,
    page: number,
    langFilter: string,
    excludeImmediate: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFireteamSummary> =>
    ApiIntermediary.doGetRequest(
      `/Fireteam/Search/Available/${e(platform)}/${e(activityType)}/${e(
        dateRange
      )}/${e(slotFilter)}/${e(page)}/`,
      [
        ["langFilter", langFilter],
        ["excludeImmediate", excludeImmediate],
      ],
      optionalQueryAppend,
      "Fireteam",
      "SearchPublicAvailableClanFireteams",
      undefined,
      clientState
    );

  /**
   * Gets a listing of all fireteams that caller is an applicant, a member, or an alternate of.
   * @param groupId The group id of the clan.  (This parameter is ignored unless the optional query parameter groupFilter is true).
   * @param platform The platform filter.
   * @param includeClosed If true, return fireteams that have been closed.
   * @param page Deprecated parameter, ignored.
   * @param groupFilter If true, filter by clan.  Otherwise, ignore the clan and show all of the user's fireteams.
   * @param langFilter An optional language filter.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetMyClanFireteams = (
    groupId: string,
    platform: Globals.FireteamPlatform,
    includeClosed: boolean,
    page: number,
    groupFilter: boolean,
    langFilter: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Queries.SearchResultFireteamResponse> =>
    ApiIntermediary.doGetRequest(
      `/Fireteam/Clan/${e(groupId)}/My/${e(platform)}/${e(includeClosed)}/${e(
        page
      )}/`,
      [
        ["groupFilter", groupFilter],
        ["langFilter", langFilter],
      ],
      optionalQueryAppend,
      "Fireteam",
      "GetMyClanFireteams",
      undefined,
      clientState
    );

  /**
   * Gets a specific fireteam.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetClanFireteam = (
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Fireteam.FireteamResponse> =>
    ApiIntermediary.doGetRequest(
      `/Fireteam/Clan/${e(groupId)}/Summary/${e(fireteamId)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "GetClanFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a user to create a new fireteam. Note that any scheduled datetimes are considered to be UTC.
   * @param groupId The group id of the clan.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CreateClanFireteam = (
    input: Fireteam.FireteamCreationRequest,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Fireteam.FireteamResponse> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Create/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "CreateClanFireteam",
      input,
      clientState
    );

  /**
   * Allows a fireteam owner to edit an existing fireteam. Note that any scheduled datetimes are considered to be UTC.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static EditClanFireteam = (
    input: Fireteam.FireteamEditRequest,
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Fireteam.FireteamResponse> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Edit/${e(fireteamId)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "EditClanFireteam",
      input,
      clientState
    );

  /**
   * Allows a fireteam owner to close an existing fireteam, cancelling it and closing its conversation.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CloseFireteam = (
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Close/${e(fireteamId)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "CloseFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a fireteam owner to open an existing fireteam that was previously closed manually or one that timed out.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ReopenFireteam = (
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Open/${e(fireteamId)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "ReopenFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a user with an appropriate platform membership join the fireteam.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param characterId The unique id of the preferred character to use for display.
   * @param hasMicrophone Indicates whether or not the user has a microphone.
   * @param joiningAsPlatform An optional account selector when joiner is not cross saved or has more than one membership
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static JoinClanFireteam = (
    groupId: string,
    fireteamId: string,
    characterId: string,
    hasMicrophone: boolean,
    joiningAsPlatform: Globals.FireteamPlatform,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Join/${e(fireteamId)}/Character/${e(
        characterId
      )}/${e(hasMicrophone)}/`,
      [["joiningAsPlatform", joiningAsPlatform]],
      optionalQueryAppend,
      "Fireteam",
      "JoinClanFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a user with an appropriate platform membership join the fireteam.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param characterId The unique id of the preferred character to use for display.
   * @param hasMicrophone Indicates whether or not the user has a microphone.
   * @param joiningAsPlatform An optional account selector when joiner is not cross saved or has more than one membership
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static JoinClanFireteamAsAlternate = (
    groupId: string,
    fireteamId: string,
    characterId: string,
    hasMicrophone: boolean,
    joiningAsPlatform: Globals.FireteamPlatform,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/JoinAlternate/${e(
        fireteamId
      )}/Character/${e(characterId)}/${e(hasMicrophone)}/`,
      [["joiningAsPlatform", joiningAsPlatform]],
      optionalQueryAppend,
      "Fireteam",
      "JoinClanFireteamAsAlternate",
      undefined,
      clientState
    );

  /**
   * Allows user to leave a fireteam they are part of.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LeaveClanFireteam = (
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Leave/${e(fireteamId)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "LeaveClanFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a fireteam owner to kick a user from the fireteam, and optionally prevent them from ever rejoining this particular fireteam again.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param membershipId The destiny membership id of the user to be kicked.
   * @param isPermanent If true, the kick is permanent, the player is not permitted to rejoin this fireteam.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static KickFromClanFireteam = (
    groupId: string,
    fireteamId: string,
    membershipId: string,
    isPermanent: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Kick/${e(fireteamId)}/${e(
        membershipId
      )}/${e(isPermanent)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "KickFromClanFireteam",
      undefined,
      clientState
    );

  /**
   * Allows a fireteam leader to issue game invites to all fireteam invitees if they are in Orbit ready to go and the fireteam is ready.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param alternates If true, invite alternates, if false, only invite non-alternates.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static InviteToDestiny2Fireteam = (
    groupId: string,
    fireteamId: string,
    alternates: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: string]: Globals.FireteamPlatformInviteResult }> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Invite/${e(fireteamId)}/${e(alternates)}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "InviteToDestiny2Fireteam",
      undefined,
      clientState
    );

  /**
   * Allows a fireteam leader to issue game invites to a specific fireteam member invitees if they are in Orbit ready to go and the fireteam is ready.
   * @param groupId The group id of the clan.
   * @param fireteamId The unique id of the fireteam.
   * @param membershipId The member to issue a platform invite to.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static IndividualInviteToDestiny2Fireteam = (
    groupId: string,
    fireteamId: string,
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.FireteamPlatformInviteResult> =>
    ApiIntermediary.doPostRequest(
      `/Fireteam/Clan/${e(groupId)}/Invite/${e(fireteamId)}/User/${e(
        membershipId
      )}/`,
      [],
      optionalQueryAppend,
      "Fireteam",
      "IndividualInviteToDestiny2Fireteam",
      undefined,
      clientState
    );
}

class FireteamfinderServiceInternal {
  /**
   * Activates a lobby and initializes it as an active Fireteam.
   * @param lobbyId The ID of the lobby to activate.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param forceActivation Optional boolean to forcibly activate the lobby, kicking pending applicants.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ActivateLobby = (
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    forceActivation: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/Activate/${e(lobbyId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [["forceActivation", forceActivation]],
      optionalQueryAppend,
      "FireteamFinder",
      "ActivateLobby",
      undefined,
      clientState
    );

  /**
   * Activates a lobby and initializes it as an active Fireteam, returning the updated Listing ID.
   * @param lobbyId The ID of the lobby to activate.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param forceActivation Optional boolean to forcibly activate the lobby, kicking pending applicants.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ActivateLobbyForNewListingId = (
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    forceActivation: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/ActivateForNewListingId/${e(lobbyId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [["forceActivation", forceActivation]],
      optionalQueryAppend,
      "FireteamFinder",
      "ActivateLobbyForNewListingId",
      undefined,
      clientState
    );

  /**
   * Applies to have a character join a fireteam.
   * @param listingId The id of the listing to apply to
   * @param applicationType The type of application to apply
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ApplyToListing = (
    listingId: string,
    applicationType: Globals.DestinyFireteamFinderApplicationType,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderApplyToListingResponse> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Listing/${e(listingId)}/Apply/${e(applicationType)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "ApplyToListing",
      undefined,
      clientState
    );

  /**
   * Retrieves Fireteam listing statuses in bulk.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BulkGetListingStatus = (
    input: FireteamFinder.DestinyFireteamFinderBulkGetListingStatusRequest,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderBulkGetListingStatusResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Listing/BulkStatus/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "BulkGetListingStatus",
      input,
      clientState
    );

  /**
   * Retrieves a Fireteam application.
   * @param applicationId
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetApplication = (
    applicationId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderGetApplicationResponse> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Application/${e(applicationId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "GetApplication",
      undefined,
      clientState
    );

  /**
   * Retrieves a Fireteam listing.
   * @param listingId The ID of the listing to retrieve.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetListing = (
    listingId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderListing> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Listing/${e(listingId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "GetListing",
      undefined,
      clientState
    );

  /**
   * Retrieves all applications to a Fireteam Finder listing.
   * @param listingId The ID of the listing whose applications to retrieve.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param pageSize The maximum number of results to be returned with this page.
   * @param nextPageToken An optional token from a previous response to fetch the next page of results.
   * @param flags Optional flag representing a filter on the state of the application.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetListingApplications = (
    listingId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    pageSize: number,
    nextPageToken: string,
    flags: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderGetListingApplicationsResponse
  > =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Listing/${e(listingId)}/Applications/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [
        ["pageSize", pageSize],
        ["nextPageToken", nextPageToken],
        ["flags", flags],
      ],
      optionalQueryAppend,
      "FireteamFinder",
      "GetListingApplications",
      undefined,
      clientState
    );

  /**
   * Retrieves the information for a Fireteam lobby.
   * @param lobbyId The ID of the lobby to retrieve.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLobby = (
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderLobbyResponse> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Lobby/${e(lobbyId)}/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "GetLobby",
      undefined,
      clientState
    );

  /**
   * Retrieves the information for a Fireteam lobby.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param pageSize The maximum number of results to be returned with this page.
   * @param nextPageToken An optional token from a previous response to fetch the next page of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerLobbies = (
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    pageSize: number,
    nextPageToken: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderGetPlayerLobbiesResponse> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/PlayerLobbies/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [
        ["pageSize", pageSize],
        ["nextPageToken", nextPageToken],
      ],
      optionalQueryAppend,
      "FireteamFinder",
      "GetPlayerLobbies",
      undefined,
      clientState
    );

  /**
   * Retrieves Fireteam applications that this player has sent or recieved.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param pageSize The maximum number of results to be returned with this page.
   * @param nextPageToken An optional token from a previous response to fetch the next page of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerApplications = (
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    pageSize: number,
    nextPageToken: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderGetPlayerApplicationsResponse
  > =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/PlayerApplications/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [
        ["pageSize", pageSize],
        ["nextPageToken", nextPageToken],
      ],
      optionalQueryAppend,
      "FireteamFinder",
      "GetPlayerApplications",
      undefined,
      clientState
    );

  /**
   * Retrieves Fireteam offers that this player has recieved.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param pageSize The maximum number of results to be returned with this page.
   * @param nextPageToken An optional token from a previous response to fetch the next page of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerOffers = (
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    pageSize: number,
    nextPageToken: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderGetPlayerOffersResponse> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/PlayerOffers/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [
        ["pageSize", pageSize],
        ["nextPageToken", nextPageToken],
      ],
      optionalQueryAppend,
      "FireteamFinder",
      "GetPlayerOffers",
      undefined,
      clientState
    );

  /**
   * Retrieves the information for a Fireteam lobby.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCharacterActivityAccess = (
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderGetCharacterActivityAccessResponse
  > =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/CharacterActivityAccess/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "GetCharacterActivityAccess",
      undefined,
      clientState
    );

  /**
   * Retrieves an offer to a Fireteam lobby.
   * @param offerId The unique ID of the offer.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetOffer = (
    offerId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderOffer> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Offer/${e(offerId)}/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "GetOffer",
      undefined,
      clientState
    );

  /**
   * Retrieves all offers relevant to a Fireteam lobby.
   * @param lobbyId The unique ID of the lobby.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param pageSize The maximum number of results to be returned with this page.
   * @param nextPageToken An optional token from a previous response to fetch the next page of results.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetLobbyOffers = (
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    pageSize: number,
    nextPageToken: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderGetLobbyOffersResponse> =>
    ApiIntermediary.doGetRequest(
      `/FireteamFinder/Lobby/${e(lobbyId)}/Offers/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [
        ["pageSize", pageSize],
        ["nextPageToken", nextPageToken],
      ],
      optionalQueryAppend,
      "FireteamFinder",
      "GetLobbyOffers",
      undefined,
      clientState
    );

  /**
   * Creates a new Fireteam lobby and Fireteam Finder listing.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static HostLobby = (
    input: FireteamFinder.DestinyFireteamFinderHostLobbyRequest,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderHostLobbyResponse> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/Host/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "HostLobby",
      input,
      clientState
    );

  /**
   * Sends a request to join an available Fireteam lobby.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static JoinLobby = (
    input: FireteamFinder.DestinyFireteamFinderJoinLobbyRequest,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderLobbyResponse> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/Join/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "JoinLobby",
      input,
      clientState
    );

  /**
   * Sends a request to invite a target player directly to the fireteam.
   * @param lobbyId The Lobby Id of the Lobby the caller is the owner of, and the target is a member of.
   * @param ownerDestinyMembershipType A valid Destiny membership type for the owner.
   * @param ownerDestinyCharacterId A valid Destiny character ID for the owner.
   * @param targetDestinyMembershipType A valid Destiny membership type for the target.
   * @param targetDestinyMembershipId A valid Destiny membership ID for the target.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static FireteamFinderNetworkSessionInvite = (
    lobbyId: string,
    ownerDestinyMembershipType: Globals.BungieMembershipType,
    ownerDestinyCharacterId: string,
    targetDestinyMembershipType: Globals.BungieMembershipType,
    targetDestinyMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Invite/${e(lobbyId)}/${e(
        ownerDestinyMembershipType
      )}/${e(ownerDestinyCharacterId)}/${e(targetDestinyMembershipType)}/${e(
        targetDestinyMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "FireteamFinderNetworkSessionInvite",
      undefined,
      clientState
    );

  /**
   * Kicks a player from a Fireteam Finder lobby.
   * @param lobbyId The ID of the lobby to kick the player from.
   * @param targetMembershipId A valid Destiny membership ID of the player to kick.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static KickPlayer = (
    input: FireteamFinder.DestinyFireteamFinderKickPlayerRequest,
    lobbyId: string,
    targetMembershipId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/${e(lobbyId)}/KickPlayer/${e(
        targetMembershipId
      )}/${e(destinyMembershipType)}/${e(destinyMembershipId)}/${e(
        destinyCharacterId
      )}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "KickPlayer",
      input,
      clientState
    );

  /**
   * Sends a request to leave a Fireteam listing application.
   * @param applicationId The ID of the application to leave.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LeaveApplication = (
    applicationId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Application/Leave/${e(applicationId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "LeaveApplication",
      undefined,
      clientState
    );

  /**
   * Sends a request to leave a Fireteam lobby.
   * @param lobbyId The ID of the lobby to leave.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static LeaveLobby = (
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/Leave/${e(lobbyId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "LeaveLobby",
      undefined,
      clientState
    );

  /**
   * Responds to an application sent to a Fireteam lobby.
   * @param applicationId The application ID to respond to.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RespondToApplication = (
    input: FireteamFinder.DestinyFireteamFinderRespondToApplicationRequest,
    applicationId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderRespondToApplicationResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Application/Respond/${e(applicationId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "RespondToApplication",
      input,
      clientState
    );

  /**
   * Responds to an authentication request for a Fireteam.
   * @param applicationId The ID of the application whose authentication to confirm.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RespondToAuthentication = (
    input: FireteamFinder.DestinyFireteamFinderRespondToAuthenticationRequest,
    applicationId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderRespondToAuthenticationResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Authentication/Respond/${e(applicationId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "RespondToAuthentication",
      input,
      clientState
    );

  /**
   * Responds to a Fireteam lobby offer.
   * @param offerId The unique ID of the offer.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RespondToOffer = (
    input: FireteamFinder.DestinyFireteamFinderRespondToOfferRequest,
    offerId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderRespondToOfferResponse> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Offer/Respond/${e(offerId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "RespondToOffer",
      input,
      clientState
    );

  /**
   * Returns search results for available Fireteams provided a clan.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchListingsByClan = (
    input: FireteamFinder.DestinyFireteamFinderSearchListingsByClanRequest,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderSearchListingsByClanResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Search/Clan/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "SearchListingsByClan",
      input,
      clientState
    );

  /**
   * Returns search results for available Fireteams provided search filters.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param overrideOfflineFilter Optional boolean to bypass the offline-only check, so the client can pull fireteam from the game.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SearchListingsByFilters = (
    input: FireteamFinder.DestinyFireteamFinderSearchListingsByFiltersRequest,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    overrideOfflineFilter: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<
    FireteamFinder.DestinyFireteamFinderSearchListingsByFiltersResponse
  > =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Search/${e(destinyMembershipType)}/${e(
        destinyMembershipId
      )}/${e(destinyCharacterId)}/`,
      [["overrideOfflineFilter", overrideOfflineFilter]],
      optionalQueryAppend,
      "FireteamFinder",
      "SearchListingsByFilters",
      input,
      clientState
    );

  /**
   * Updates the settings for a Fireteam lobby.
   * @param lobbyId The ID of the lobby to update.
   * @param destinyMembershipType A valid Destiny membership type.
   * @param destinyMembershipId A valid Destiny membership ID.
   * @param destinyCharacterId A valid Destiny character ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UpdateLobbySettings = (
    input: FireteamFinder.DestinyFireteamFinderUpdateLobbySettingsRequest,
    lobbyId: string,
    destinyMembershipType: Globals.BungieMembershipType,
    destinyMembershipId: string,
    destinyCharacterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<FireteamFinder.DestinyFireteamFinderUpdateLobbySettingsResponse> =>
    ApiIntermediary.doPostRequest(
      `/FireteamFinder/Lobby/UpdateSettings/${e(lobbyId)}/${e(
        destinyMembershipType
      )}/${e(destinyMembershipId)}/${e(destinyCharacterId)}/`,
      [],
      optionalQueryAppend,
      "FireteamFinder",
      "UpdateLobbySettings",
      input,
      clientState
    );
}

class ExploreServiceInternal {
  /**
   * Retrieves the 'calls to action' that constitute the Explore features of our Companion apps.  Probably not really useful for anyone else.
   * @param membershipType A valid non-BungieNet membership type.
   * @param membershipId A valid Destiny 2 membership ID.
   * @param characterId A valid Destiny 2 character ID, owned by the given membership ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetExploreSections = (
    membershipType: Globals.BungieMembershipType,
    membershipId: string,
    characterId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Explore.ExploreSection[]> =>
    ApiIntermediary.doGetRequest(
      `/Explore/${e(membershipType)}/Profile/${e(membershipId)}/Character/${e(
        characterId
      )}/`,
      [],
      optionalQueryAppend,
      "Explore",
      "GetExploreSections",
      undefined,
      clientState
    );
}

class CompanionpermissionServiceInternal {
  /**
   * Determines if the signed in user has the specified permission.
   * @param cPermission The permission being checked
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPermission = (
    cPermission: Globals.CompanionPermission,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/CompanionPermission/${e(cPermission)}/`,
      [],
      optionalQueryAppend,
      "CompanionPermission",
      "GetPermission",
      undefined,
      clientState
    );

  /**
   * Determines if the signed in user has the specified permission using a group/clan as the object context.
   * @param cPermission The permission being checked
   * @param groupId The group or clan used as the permission context
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGroupPermission = (
    cPermission: Globals.CompanionPermission,
    groupId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/CompanionPermission/${e(cPermission)}/Group/${e(groupId)}/`,
      [],
      optionalQueryAppend,
      "CompanionPermission",
      "GetGroupPermission",
      undefined,
      clientState
    );

  /**
   * Determines if the signed in user has the specified permission using a fireteam as the object context.
   * @param cPermission The permission being checked
   * @param groupId The group id the fireteam is a part of, 0 if it is not part of a fireteam.
   * @param fireteamId The group or clan used as the permission context
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFireteamPermission = (
    cPermission: Globals.CompanionPermission,
    groupId: string,
    fireteamId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/CompanionPermission/${e(cPermission)}/Group/${e(groupId)}/Fireteam/${e(
        fireteamId
      )}/`,
      [],
      optionalQueryAppend,
      "CompanionPermission",
      "GetFireteamPermission",
      undefined,
      clientState
    );

  /**
   * Returns a list of acls on the given membership id. Generally used to for non-bungie.net membership types.
   * @param membershipType The target membership type to load Acls for in integer form.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetDirectAcls = (
    membershipType: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string[]> =>
    ApiIntermediary.doGetRequest(
      `/CompanionPermission/DirectAcls/${e(membershipType)}/`,
      [],
      optionalQueryAppend,
      "CompanionPermission",
      "GetDirectAcls",
      undefined,
      clientState
    );
}

class RendererServiceInternal {
  /**
   * Returns a server-rendered content item given an ID
   * @param id The content ID.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ContentItemRenderableById = (
    id: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Renderable.ContentItemRenderable> =>
    ApiIntermediary.doGetRequest(
      `/Renderer/ContentItemRenderableById/${e(id)}/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "ContentItemRenderableById",
      undefined,
      clientState
    );

  /**
   * Returns a server-rendered content item given a tag and type
   * @param tag The content tag.
   * @param type The content type.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ContentItemRenderableByTagAndType = (
    tag: string,
    type: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Renderable.ContentItemRenderable> =>
    ApiIntermediary.doGetRequest(
      `/Renderer/ContentItemRenderableByTagAndType/${e(tag)}/${e(type)}/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "ContentItemRenderableByTagAndType",
      undefined,
      clientState
    );

  /**
   * Logs client messages to the server.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ServerLog = (
    input: Renderer.ServerLogRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Renderer/ServerLog/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "ServerLog",
      input,
      clientState
    );

  /**
   * Returns data relevant to the CrossSave page
   * @param membershipId The membership ID for the Bungie.net user.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static CrossSaveUserData = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Renderer.CrossSaveUserDataDefined> =>
    ApiIntermediary.doGetRequest(
      `/Renderer/CrossSaveUserData/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "CrossSaveUserData",
      undefined,
      clientState
    );

  /**
   * Returns data about a user's Season stats
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SeasonsUserData = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Renderer.SeasonsUserDataDefined> =>
    ApiIntermediary.doGetRequest(
      `/Renderer/SeasonsUserData/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "SeasonsUserData",
      undefined,
      clientState
    );

  /**
   * Returns Destiny 2 entitlements
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static Destiny2Entitlements = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Renderer.Destiny2Entitlements> =>
    ApiIntermediary.doGetRequest(
      `/Renderer/Destiny2Entitlements/`,
      [],
      optionalQueryAppend,
      "Renderer",
      "Destiny2Entitlements",
      undefined,
      clientState
    );
}

class AlexaServiceInternal {}

class CrosssaveServiceInternal {
  /**
   * Returns your current cross save pairing information.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCrossSavePairingStatus = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<CrossSave.CrossSavePairingStatus> =>
    ApiIntermediary.doGetRequest(
      `/CrossSave/`,
      [],
      optionalQueryAppend,
      "CrossSave",
      "GetCrossSavePairingStatus",
      undefined,
      clientState
    );

  /**
   * Returns Cross Save validation error messages for any Destiny Profiles on your account in the context of pairing.
   * @param stateIdentifier A numeric value indicating your current Cross Save session.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCrossSavePairValidationStatus = (
    stateIdentifier: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<CrossSave.CrossSaveValidationResponse> =>
    ApiIntermediary.doGetRequest(
      `/CrossSave/Validation/Pairing/`,
      [["stateIdentifier", stateIdentifier]],
      optionalQueryAppend,
      "CrossSave",
      "GetCrossSavePairValidationStatus",
      undefined,
      clientState
    );

  /**
   * Returns Cross Save validation error messages for any Destiny Profiles on your account in the context of unpairing.
   * @param stateIdentifier A numeric value indicating your current Cross Save session.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCrossSaveUnpairValidationStatus = (
    stateIdentifier: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<CrossSave.CrossSaveValidationResponse> =>
    ApiIntermediary.doGetRequest(
      `/CrossSave/Validation/Unpairing/`,
      [["stateIdentifier", stateIdentifier]],
      optionalQueryAppend,
      "CrossSave",
      "GetCrossSaveUnpairValidationStatus",
      undefined,
      clientState
    );

  /**
   * Sets your cross-save pairing.  Note that there is a significant throttle applied after un-pairing before you can pair again.
   * @param stateIdentifier A numeric value indicating your current Cross Save session.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetCrossSavePairing = (
    input: CrossSave.CrossSavePairingRequest,
    stateIdentifier: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<CrossSave.CrossSavePairingResponse> =>
    ApiIntermediary.doPostRequest(
      `/CrossSave/Set/`,
      [["stateIdentifier", stateIdentifier]],
      optionalQueryAppend,
      "CrossSave",
      "SetCrossSavePairing",
      input,
      clientState
    );

  /**
   * Clears your cross-save pairing.  Note that there is a significant throttle applied after un-pairing before you can pair again.
   * @param stateIdentifier A numeric value indicating your current Cross Save session.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static ClearCrossSavePairing = (
    stateIdentifier: number,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<CrossSave.CrossSaveClearPairingsResponse> =>
    ApiIntermediary.doPostRequest(
      `/CrossSave/Clear/`,
      [["stateIdentifier", stateIdentifier]],
      optionalQueryAppend,
      "CrossSave",
      "ClearCrossSavePairing",
      undefined,
      clientState
    );
}

class RecaptchaServiceInternal {
  /**
   * Uses secret key and token to validate captcha response
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static Verify = (
    input: Recaptcha.RecaptchaRequest,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Recaptcha.RecaptchaResponse> =>
    ApiIntermediary.doPostRequest(
      `/Recaptcha/Verify/`,
      [],
      optionalQueryAppend,
      "Recaptcha",
      "Verify",
      input,
      clientState
    );
}

class SocialServiceInternal {
  /**
   * Returns your Bungie Friend list
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFriendList = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Friends.BungieFriendListResponse> =>
    ApiIntermediary.doGetRequest(
      `/Social/Friends/`,
      [],
      optionalQueryAppend,
      "Social",
      "GetFriendList",
      undefined,
      clientState
    );

  /**
   * Returns your friend request queue.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetFriendRequestList = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Friends.BungieFriendRequestListResponse> =>
    ApiIntermediary.doGetRequest(
      `/Social/Friends/Requests/`,
      [],
      optionalQueryAppend,
      "Social",
      "GetFriendRequestList",
      undefined,
      clientState
    );

  /**
   * Requests a friend relationship with the target user. Any of the target user's linked membership ids are valid inputs.
   * @param membershipId The membership id of the user you wish to add.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static IssueFriendRequest = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Social/Friends/Add/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "IssueFriendRequest",
      undefined,
      clientState
    );

  /**
   * Accepts a friend relationship with the target user. The user must be on your incoming friend request list, though no error will occur if they are not.
   * @param membershipId The membership id of the user you wish to accept.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static AcceptFriendRequest = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Social/Friends/Requests/Accept/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "AcceptFriendRequest",
      undefined,
      clientState
    );

  /**
   * Declines a friend relationship with the target user. The user must be on your incoming friend request list, though no error will occur if they are not.
   * @param membershipId The membership id of the user you wish to decline.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static DeclineFriendRequest = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Social/Friends/Requests/Decline/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "DeclineFriendRequest",
      undefined,
      clientState
    );

  /**
   * Remove a friend relationship with the target user. The user must be on your friend list, though no error will occur if they are not.
   * @param membershipId The membership id of the user you wish to remove.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RemoveFriend = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Social/Friends/Remove/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "RemoveFriend",
      undefined,
      clientState
    );

  /**
   * Remove a friend relationship with the target user. The user must be on your outgoing request friend list, though no error will occur if they are not.
   * @param membershipId The membership id of the user you wish to remove.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static RemoveFriendRequest = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doPostRequest(
      `/Social/Friends/Requests/Remove/${e(membershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "RemoveFriendRequest",
      undefined,
      clientState
    );

  /**
   * Gets the platform friend of the requested type, with additional information if they have Bungie accounts. Must have a recent login session with said platform.
   * @param friendPlatform The platform friend type.
   * @param page The zero based page to return. Page size is 100.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlatformFriendList = (
    friendPlatform: Globals.PlatformFriendType,
    page: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Friends.PlatformFriendResponse> =>
    ApiIntermediary.doGetRequest(
      `/Social/PlatformFriends/${e(friendPlatform)}/${e(page)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "GetPlatformFriendList",
      undefined,
      clientState
    );

  /**
   * Sends a request to invite a target player directly to the fireteam.
   * @param inviterDestinyMembershipType A valid Destiny membership type for the inviter.
   * @param targetDestinyMembershipType A valid Destiny membership type for the target.
   * @param targetDestinyMembershipId A valid Destiny membership ID for the target.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BungieFriendNetworkSessionInvite = (
    inviterDestinyMembershipType: Globals.BungieMembershipType,
    targetDestinyMembershipType: Globals.BungieMembershipType,
    targetDestinyMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<boolean> =>
    ApiIntermediary.doGetRequest(
      `/Social/Friends/Invite/${e(inviterDestinyMembershipType)}/${e(
        targetDestinyMembershipType
      )}/${e(targetDestinyMembershipId)}/`,
      [],
      optionalQueryAppend,
      "Social",
      "BungieFriendNetworkSessionInvite",
      undefined,
      clientState
    );
}

class PnpServiceInternal {
  /**
   * Sets a parent or guardian account and child account into a pending assignment state.
   * @param encodedChildMembershipId The encoded child's membership Id.
   * @param parentOrGuardianMembershipId The parent or guardian's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SetParentOrGuardianAsPendingForChild = (
    encodedChildMembershipId: string,
    parentOrGuardianMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/Pending/${e(encodedChildMembershipId)}/${e(
        parentOrGuardianMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "PnP",
      "SetParentOrGuardianAsPendingForChild",
      undefined,
      clientState
    );

  /**
   * Unassigns a parent or guardian account from a child account.
   * @param childMembershipId The child's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static UnassignParentOrGuardianFromChild = (
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/Unassign/${e(childMembershipId)}/`,
      [],
      optionalQueryAppend,
      "PnP",
      "UnassignParentOrGuardianFromChild",
      undefined,
      clientState
    );

  /**
   * Updates permissions in bulk for an assigned child account.
   * @param childMembershipId The child's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BulkUpdatePermissionsForChild = (
    input: PnP.BulkUpdatePermissionsForChildRequest,
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/Permissions/${e(childMembershipId)}/Update/`,
      [],
      optionalQueryAppend,
      "PnP",
      "BulkUpdatePermissionsForChild",
      input,
      clientState
    );

  /**
   * Updates preferences in bulk for an assigned child account.
   * @param childMembershipId The child's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static BulkUpdatePreferencesForChild = (
    input: PnP.BulkUpdatePreferencesForChildRequest,
    childMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/Preferences/${e(childMembershipId)}/Update/`,
      [],
      optionalQueryAppend,
      "PnP",
      "BulkUpdatePreferencesForChild",
      input,
      clientState
    );

  /**
   * Retrieves an account's player context (permissions, preferences, guardians, etc.) in relation to the PnP system.
   * @param membershipId The player's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerContext = (
    membershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<PnP.GetPlayerContextResponse> =>
    ApiIntermediary.doGetRequest(
      `/PnP/PlayerContext/${e(membershipId)}`,
      [],
      optionalQueryAppend,
      "PnP",
      "GetPlayerContext",
      undefined,
      clientState
    );

  /**
   * Retrieves a distilled version of an account's player context data, provided an encoded membership Id.
   * @param encodedMembershipId The player's encoded membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetPlayerContextWithEncodedMembershipId = (
    encodedMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<PnP.GetPlayerContextResponse> =>
    ApiIntermediary.doGetRequest(
      `/PnP/PlayerContextEncoded/${e(encodedMembershipId)}`,
      [],
      optionalQueryAppend,
      "PnP",
      "GetPlayerContextWithEncodedMembershipId",
      undefined,
      clientState
    );

  /**
   * Retrieves a unique assignment invite URL sequence for the acting child account to send to a parent or guardian.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetEncodedInviteUrlSequence = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<PnP.GetEncodedInviteUrlSequenceResponse> =>
    ApiIntermediary.doGetRequest(
      `/PnP/Invite/Encode/`,
      [],
      optionalQueryAppend,
      "PnP",
      "GetEncodedInviteUrlSequence",
      undefined,
      clientState
    );

  /**
   * Sends an email to the acting parent or guardian account to verify themselves as an adult through KWS (Kids Web Services) for their pending child account.
   * @param parentOrGuardianMembershipId The parent or guardian's membership Id.
   * @param encodedChildMembershipId The encoded child's membership Id.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static SendVerificationEmail = (
    parentOrGuardianMembershipId: string,
    encodedChildMembershipId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/KWS/Email/${e(parentOrGuardianMembershipId)}/For/${e(
        encodedChildMembershipId
      )}/`,
      [],
      optionalQueryAppend,
      "PnP",
      "SendVerificationEmail",
      undefined,
      clientState
    );

  /**
   * The returning webhook for KWS (Kids Web Services) to alert the PnP system of a verification update or expiration.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static KwsWebhook = (
    input: PnP.KwsWebhookBody,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Globals.ResponseStatusEnum> =>
    ApiIntermediary.doPostRequest(
      `/PnP/KWS/Webhook/`,
      [],
      optionalQueryAppend,
      "PnP",
      "KwsWebhook",
      input,
      clientState
    );
}

class CoreServiceInternal {
  /**
   * Smoketest function
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static HelloWorld = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doGetRequest(
      `/HelloWorld/`,
      [],
      optionalQueryAppend,
      "",
      "HelloWorld",
      undefined,
      clientState
    );

  /**
   * Bungie.net version
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetVersion = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Core.BungieNetVersionInfo> =>
    ApiIntermediary.doGetRequest(
      `/GetVersion/`,
      [],
      optionalQueryAppend,
      "",
      "GetVersion",
      undefined,
      clientState
    );

  /**
   * List of available localization cultures
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetAvailableLocales = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/GetAvailableLocales/`,
      [],
      optionalQueryAppend,
      "",
      "GetAvailableLocales",
      undefined,
      clientState
    );

  /**
   * Get the common settings used by the Bungie.Net environment.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCommonSettings = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.CoreSettingsConfiguration> =>
    ApiIntermediary.doGetRequest(
      `/Settings/`,
      [],
      optionalQueryAppend,
      "",
      "GetCommonSettings",
      undefined,
      clientState
    );

  /**
   * Get the user-specific system overrides that should be respected alongside common systems.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetUserSystemOverrides = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<{ [key: string]: Models.CoreSystem }> =>
    ApiIntermediary.doGetRequest(
      `/UserSystemOverrides/`,
      [],
      optionalQueryAppend,
      "",
      "GetUserSystemOverrides",
      undefined,
      clientState
    );

  /**
   * Get the minimum common settings used by the Bungie.Net environment.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetEssentialCommonSettings = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Models.CoreSettingsConfiguration> =>
    ApiIntermediary.doGetRequest(
      `/EssentialSettings/`,
      [],
      optionalQueryAppend,
      "",
      "GetEssentialCommonSettings",
      undefined,
      clientState
    );

  /**
   * Check Status
   * @param statusId
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetSystemStatus = (
    statusId: string,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<string> =>
    ApiIntermediary.doGetRequest(
      `/Status/${e(statusId)}/`,
      [],
      optionalQueryAppend,
      "",
      "GetSystemStatus",
      undefined,
      clientState
    );

  /**
   * Gets any active global alert for display in the forum banners, help pages, etc.  Usually used for DOC alerts.
   * @param includestreaming Determines whether Streaming Alerts are included in results
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetGlobalAlerts = (
    includestreaming: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Core.GlobalAlert[]> =>
    ApiIntermediary.doGetRequest(
      `/GlobalAlerts/`,
      [["includestreaming", includestreaming]],
      optionalQueryAppend,
      "",
      "GetGlobalAlerts",
      undefined,
      clientState
    );

  /**
   * Gets any active scheduled notifications for mobile devices. Will always return an empty list for non-authenticated users.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetBroadcastNotifications = (
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<Core.ScheduledBroadcastNotification[]> =>
    ApiIntermediary.doGetRequest(
      `/BroadcastNotifications/`,
      [],
      optionalQueryAppend,
      "",
      "GetBroadcastNotifications",
      undefined,
      clientState
    );

  /**
   * Gets a dictionary of country codes and their display names in the calling locale, optionally filtered to only show age-gated countries.
   * @param htmlstrings Determines if country names should be html encoded.
   * @param agegated Determines if country list is only the age gated countries or just whatever is localized.
   * @param optionalQueryAppend Segment to append to query string. May be null.
   * @param clientState Object returned to the provided success and error callbacks.
   */
  public static GetCountryDisplayNames = (
    htmlstrings: boolean,
    agegated: boolean,
    optionalQueryAppend?: string,
    clientState?: any
  ): Promise<any> =>
    ApiIntermediary.doGetRequest(
      `/CountryDisplayNames/${e(htmlstrings)}/${e(agegated)}/`,
      [],
      optionalQueryAppend,
      "",
      "GetCountryDisplayNames",
      undefined,
      clientState
    );
}

export class Platform {
  public static Globals = Globals;
  public static JsonpService = JsonpServiceInternal;
  public static ApplicationService = ApplicationServiceInternal;
  public static UserService = UserServiceInternal;
  public static MessageService = MessageServiceInternal;
  public static NotificationService = NotificationServiceInternal;
  public static ContentService = ContentServiceInternal;
  public static ExternalSocialService = ExternalSocialServiceInternal;
  public static ForumService = ForumServiceInternal;
  public static ActivityService = ActivityServiceInternal;
  public static GroupV2Service = GroupV2ServiceInternal;
  public static IgnoreService = IgnoreServiceInternal;
  public static AdminService = AdminServiceInternal;
  public static TokensService = TokensServiceInternal;
  public static Destiny2Service = Destiny2ServiceInternal;
  public static CommunitycontentService = CommunitycontentServiceInternal;
  public static TrendingService = TrendingServiceInternal;
  public static FireteamService = FireteamServiceInternal;
  public static FireteamfinderService = FireteamfinderServiceInternal;
  public static ExploreService = ExploreServiceInternal;
  public static CompanionpermissionService = CompanionpermissionServiceInternal;
  public static RendererService = RendererServiceInternal;
  public static AlexaService = AlexaServiceInternal;
  public static CrosssaveService = CrosssaveServiceInternal;
  public static RecaptchaService = RecaptchaServiceInternal;
  public static SocialService = SocialServiceInternal;
  public static PnpService = PnpServiceInternal;
  public static CoreService = CoreServiceInternal;
  platformSettings: any;
}

// @ts-ignore
window["BungieGCPCaptureActivity"] = function (
  input,
  challengeKey,
  onSuccess,
  onFailure
) {
  ActivityServiceInternal.CaptureActivity(input, challengeKey)
    .then(onSuccess)
    .catch(onFailure);
};
