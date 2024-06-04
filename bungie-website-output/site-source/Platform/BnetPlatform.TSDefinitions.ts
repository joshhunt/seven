import * as Globals from "@Enum";

export declare namespace DestinyDefinitions {
  enum DestinyActivityModeType {
    None = 0,
    Story = 2,
    Strike = 3,
    Raid = 4,
    AllPvP = 5,
    Patrol = 6,
    AllPvE = 7,
    Reserved9 = 9,
    Control = 10,
    Reserved11 = 11,
    Clash = 12,
    Reserved13 = 13,
    CrimsonDoubles = 15,
    Nightfall = 16,
    HeroicNightfall = 17,
    AllStrikes = 18,
    IronBanner = 19,
    Reserved20 = 20,
    Reserved21 = 21,
    Reserved22 = 22,
    Reserved24 = 24,
    AllMayhem = 25,
    Reserved26 = 26,
    Reserved27 = 27,
    Reserved28 = 28,
    Reserved29 = 29,
    Reserved30 = 30,
    Supremacy = 31,
    PrivateMatchesAll = 32,
    Survival = 37,
    Countdown = 38,
    TrialsOfTheNine = 39,
    Social = 40,
    TrialsCountdown = 41,
    TrialsSurvival = 42,
    IronBannerControl = 43,
    IronBannerClash = 44,
    IronBannerSupremacy = 45,
    ScoredNightfall = 46,
    ScoredHeroicNightfall = 47,
    Rumble = 48,
    AllDoubles = 49,
    Doubles = 50,
    PrivateMatchesClash = 51,
    PrivateMatchesControl = 52,
    PrivateMatchesSupremacy = 53,
    PrivateMatchesCountdown = 54,
    PrivateMatchesSurvival = 55,
    PrivateMatchesMayhem = 56,
    PrivateMatchesRumble = 57,
    HeroicAdventure = 58,
    Showdown = 59,
    Lockdown = 60,
    Scorched = 61,
    ScorchedTeam = 62,
    Gambit = 63,
    AllPvECompetitive = 64,
    Breakthrough = 65,
    BlackArmoryRun = 66,
    Salvage = 67,
    IronBannerSalvage = 68,
    PvPCompetitive = 69,
    PvPQuickplay = 70,
    ClashQuickplay = 71,
    ClashCompetitive = 72,
    ControlQuickplay = 73,
    ControlCompetitive = 74,
    GambitPrime = 75,
    Reckoning = 76,
    Menagerie = 77,
    VexOffensive = 78,
    NightmareHunt = 79,
    Elimination = 80,
    Momentum = 81,
    Dungeon = 82,
    Sundial = 83,
    TrialsOfOsiris = 84,
    Dares = 85,
    Offensive = 86,
    LostSector = 87,
    Rift = 88,
    ZoneControl = 89,
    IronBannerRift = 90,
    IronBannerZoneControl = 91,
    Relic = 92,
  }

  enum DestinyRewardSourceCategory {
    None = 0,
    Activity = 1,
    Vendor = 2,
    Aggregate = 3,
  }

  enum DestinyTalentNodeStepWeaponPerformances {
    None = 0,
    RateOfFire = 1,
    Damage = 2,
    Accuracy = 4,
    Range = 8,
    Zoom = 16,
    Recoil = 32,
    Ready = 64,
    Reload = 128,
    HairTrigger = 256,
    AmmoAndMagazine = 512,
    TrackingAndDetonation = 1024,
    ShotgunSpread = 2048,
    ChargeTime = 4096,
    All = 8191,
  }

  enum DestinyTalentNodeStepImpactEffects {
    None = 0,
    ArmorPiercing = 1,
    Ricochet = 2,
    Flinch = 4,
    CollateralDamage = 8,
    Disorient = 16,
    HighlightTarget = 32,
    All = 63,
  }

  enum DestinyTalentNodeStepGuardianAttributes {
    None = 0,
    Stats = 1,
    Shields = 2,
    Health = 4,
    Revive = 8,
    AimUnderFire = 16,
    Radar = 32,
    Invisibility = 64,
    Reputations = 128,
    All = 255,
  }

  enum DestinyTalentNodeStepLightAbilities {
    None = 0,
    Grenades = 1,
    Melee = 2,
    MovementModes = 4,
    Orbs = 8,
    SuperEnergy = 16,
    SuperMods = 32,
    All = 63,
  }

  enum DestinyTalentNodeStepDamageTypes {
    None = 0,
    Kinetic = 1,
    Arc = 2,
    Solar = 4,
    Void = 8,
    All = 15,
  }

  enum DestinyUnlockEventPeriodType {
    ExplicitDuration = 0,
    Weekly = 1,
    Daily = 2,
  }

  enum DestinyUnlockOperator {
    Invalid = 0,
    Flag = 1,
    Not = 2,
    Or = 3,
    And = 4,
    Nor = 5,
    Xor = 6,
    Nand = 7,
    Equal = 8,
    NotEqual = 9,
    UnlockValue = 10,
    Constant = 11,
    ExpressionMapping = 12,
    GreaterThan = 13,
    GreaterThanOrEqual = 14,
    LessThan = 15,
    LessThanOrEqual = 16,
    Add = 17,
    Subtract = 18,
    Multiply = 19,
    Divide = 20,
    Modulus = 21,
    Negate = 22,
    HashStart = 23,
    HashExtend = 24,
    BitwiseAnd = 25,
    BitwiseOr = 26,
    BitwiseXor = 27,
    BitwiseNot = 28,
    FunctionIf = 29,
    FunctionMax = 30,
    FunctionMin = 31,
    FunctionClamp = 32,
    FunctionExp = 33,
    FunctionAbs = 34,
  }

  enum DestinyGatingScope {
    None = 0,
    Global = 1,
    Clan = 2,
    Profile = 3,
    Character = 4,
    Item = 5,
    AssumedWorstCase = 6,
  }

  enum DestinyItemSubType {
    None = 0,
    Crucible = 1,
    Vanguard = 2,
    Exotic = 5,
    AutoRifle = 6,
    Shotgun = 7,
    Machinegun = 8,
    HandCannon = 9,
    RocketLauncher = 10,
    FusionRifle = 11,
    SniperRifle = 12,
    PulseRifle = 13,
    ScoutRifle = 14,
    Crm = 16,
    Sidearm = 17,
    Sword = 18,
    Mask = 19,
    Shader = 20,
    Ornament = 21,
    FusionRifleLine = 22,
    GrenadeLauncher = 23,
    SubmachineGun = 24,
    TraceRifle = 25,
    HelmetArmor = 26,
    GauntletsArmor = 27,
    ChestArmor = 28,
    LegArmor = 29,
    ClassArmor = 30,
    Bow = 31,
    DummyRepeatableBounty = 32,
    Glaive = 33,
  }

  enum DestinyUnlockState {
    Clear = 0,
    False = 1,
    True = 2,
  }

  enum DestinyActivityModeCategory {
    None = 0,
    PvE = 1,
    PvP = 2,
    PvECompetitive = 3,
  }

  enum DestinyClass {
    Titan = 0,
    Hunter = 1,
    Warlock = 2,
    Unknown = 3,
  }

  enum DestinyGender {
    Male = 0,
    Female = 1,
    Unknown = 2,
  }

  enum DestinyRace {
    Human = 0,
    Awoken = 1,
    Exo = 2,
    Unknown = 3,
  }

  enum DamageType {
    None = 0,
    Kinetic = 1,
    Arc = 2,
    Thermal = 3,
    Void = 4,
    Raid = 5,
    Stasis = 6,
    Strand = 7,
  }

  enum BucketScope {
    Character = 0,
    Account = 1,
  }

  enum BucketCategory {
    Invisible = 0,
    Item = 1,
    Currency = 2,
    Equippable = 3,
    Ignored = 4,
  }

  enum ItemLocation {
    Unknown = 0,
    Inventory = 1,
    Vault = 2,
    Vendor = 3,
    Postmaster = 4,
  }

  enum TierType {
    Unknown = 0,
    Currency = 1,
    Basic = 2,
    Common = 3,
    Rare = 4,
    Superior = 5,
    Exotic = 6,
  }

  enum EquippingItemBlockAttributes {
    None = 0,
    EquipOnAcquire = 1,
  }

  enum DestinyAmmunitionType {
    None = 0,
    Primary = 1,
    Special = 2,
    Heavy = 3,
    Unknown = 4,
  }

  enum RewardMappingEntryType {
    None = 0,
    ActivityComplete = 1,
    ActivityActivate = 2,
    Kill = 3,
    Incident = 4,
    Item = 5,
    Vendor = 6,
    ItemTrigger = 7,
  }

  enum PlugUiStyles {
    None = 0,
    Masterwork = 1,
  }

  enum PlugAvailabilityMode {
    Normal = 0,
    UnavailableIfSocketContainsMatchingPlugCategory = 1,
    AvailableIfSocketContainsMatchingPlugCategory = 2,
  }

  enum DestinyEnergyType {
    Any = 0,
    Arc = 1,
    Thermal = 2,
    Void = 3,
    Ghost = 4,
    Subclass = 5,
    Stasis = 6,
  }

  enum SocketPlugSources {
    None = 0,
    InventorySourced = 1,
    ReusablePlugItems = 2,
    ProfilePlugSet = 4,
    CharacterPlugSet = 8,
  }

  enum ItemPerkVisibility {
    Visible = 0,
    Disabled = 1,
    Hidden = 2,
  }

  enum SpecialItemType {
    None = 0,
    SpecialCurrency = 1,
    Armor = 8,
    Weapon = 9,
    Engram = 23,
    Consumable = 24,
    ExchangeMaterial = 25,
    MissionReward = 27,
    Currency = 29,
  }

  enum DestinyItemType {
    None = 0,
    Currency = 1,
    Armor = 2,
    Weapon = 3,
    Message = 7,
    Engram = 8,
    Consumable = 9,
    ExchangeMaterial = 10,
    MissionReward = 11,
    QuestStep = 12,
    QuestStepComplete = 13,
    Emblem = 14,
    Quest = 15,
    Subclass = 16,
    ClanBanner = 17,
    Aura = 18,
    Mod = 19,
    Dummy = 20,
    Ship = 21,
    Vehicle = 22,
    Emote = 23,
    Ghost = 24,
    Package = 25,
    Bounty = 26,
    Wrapper = 27,
    SeasonalArtifact = 28,
    Finisher = 29,
    Pattern = 30,
  }

  enum DestinyBreakerType {
    None = 0,
    ShieldPiercing = 1,
    Disruption = 2,
    Stagger = 3,
  }

  enum DestinyActivityNavPointType {
    Inactive = 0,
    PrimaryObjective = 1,
    SecondaryObjective = 2,
    TravelObjective = 3,
    PublicEventObjective = 4,
    AmmoCache = 5,
    PointTypeFlag = 6,
    CapturePoint = 7,
    DefensiveEncounter = 8,
    GhostInteraction = 9,
    KillAi = 10,
    QuestItem = 11,
    PatrolMission = 12,
    Incoming = 13,
    ArenaObjective = 14,
    AutomationHint = 15,
    TrackedQuest = 16,
  }

  enum DestinyUnlockValueUIStyle {
    Automatic = 0,
    Fraction = 1,
    Checkbox = 2,
    Percentage = 3,
    DateTime = 4,
    FractionFloat = 5,
    Integer = 6,
    TimeDuration = 7,
    Hidden = 8,
    Multiplier = 9,
    GreenPips = 10,
    RedPips = 11,
    ExplicitPercentage = 12,
    RawFloat = 13,
    LevelAndReward = 14,
  }

  enum DestinyObjectiveGrantStyle {
    WhenIncomplete = 0,
    WhenComplete = 1,
    Always = 2,
  }

  enum DestinyObjectiveUiStyle {
    None = 0,
    Highlighted = 1,
    CraftingWeaponLevel = 2,
    CraftingWeaponLevelProgress = 3,
    CraftingWeaponTimestamp = 4,
    CraftingMementos = 5,
    CraftingMementoTitle = 6,
  }

  enum DestinyProgressionScope {
    Account = 0,
    Character = 1,
    Clan = 2,
    Item = 3,
    ImplicitFromEquipment = 4,
    Mapped = 5,
    MappedAggregate = 6,
    MappedStat = 7,
    MappedUnlockValue = 8,
  }

  enum DestinyProgressionStepDisplayEffect {
    None = 0,
    Character = 1,
    Item = 2,
  }

  enum DestinyProgressionAggregationType {
    Maximum = 0,
  }

  enum DestinyProgressionConditionAggregationType {
    Any = 0,
    All = 1,
  }

  enum DestinyProgressionRewardItemAcquisitionBehavior {
    Instant = 0,
    PlayerClaimRequired = 1,
  }

  enum DestinyStatAggregationType {
    CharacterAverage = 0,
    Character = 1,
    Item = 2,
  }

  enum DestinyStatCategory {
    Gameplay = 0,
    Weapon = 1,
    Defense = 2,
    Primary = 3,
  }

  enum TalentNodeTypes {
    None = 0,
    AutomaticallyUnlocks = 1,
    AutomaticallyUnlocksForFree = 2,
    AutomaticallyUnlocksOnCreation = 4,
    LastStepRepeats = 8,
    Repurchasable = 16,
    AutomaticallySwapsOnPrerequisitesSatisfied = 32,
  }

  enum TalentNodeStepPropertiesTypes {
    None = 0,
    ProvideBenefitsWhileHidden = 1,
  }

  enum DestinyUnlockType {
    None = 0,
    GamePurchased = 1,
    LatestExpansionPurchased = 2,
  }

  enum UnlockScope {
    None = 0,
    Account = 1,
    AccountOffer = 2,
    Character = 3,
    Clan = 4,
    ItemOnly = 5,
    CharacterClass = 6,
  }

  enum UnlockValueAggregationType {
    SingleValue = 0,
    MinimumValue = 1,
    MaximumValue = 2,
    SumOfValues = 3,
    None = 4,
    ItemScopeOnlySumOfValues = 5,
  }

  enum UnlockValueScope {
    Global = 0,
    Account = 1,
    Character = 2,
    Clan = 3,
    Item = 4,
    CharacterClass = 5,
    None = 6,
  }

  enum DestinyVendorProgressionType {
    Default = 0,
    Ritual = 1,
    NoSeasonalRefresh = 2,
  }

  enum VendorDisplayCategorySortOrder {
    Default = 0,
    SortByTier = 1,
  }

  enum DestinyVendorInteractionRewardSelection {
    None = 0,
    One = 1,
    All = 2,
  }

  enum DestinyVendorReplyType {
    Accept = 0,
    Decline = 1,
    Complete = 2,
  }

  enum VendorInteractionType {
    Unknown = 0,
    Undefined = 1,
    QuestComplete = 2,
    QuestContinue = 3,
    ReputationPreview = 4,
    RankUpReward = 5,
    TokenTurnIn = 6,
    QuestAccept = 7,
    ProgressTab = 8,
    End = 9,
    Start = 10,
  }

  enum DestinyItemSortType {
    ItemId = 0,
    Timestamp = 1,
    StackSize = 2,
  }

  enum DestinyVendorItemRefundPolicy {
    NotRefundable = 0,
    DeletesItem = 1,
    RevokesLicense = 2,
  }

  enum DestinyVendorItemState {
    None = 0,
    Incomplete = 1,
    RewardAvailable = 2,
    Complete = 4,
    New = 8,
    Featured = 16,
    Ending = 32,
    OnSale = 64,
    Owned = 128,
    WideView = 256,
    NexusAttention = 512,
    SetDiscount = 1024,
    PriceDrop = 2048,
    DailyOffer = 4096,
    Charity = 8192,
    SeasonalRewardExpiration = 16384,
    BestDeal = 32768,
    Popular = 65536,
    Free = 131072,
    Locked = 262144,
    Paracausal = 524288,
    Cryptarch = 1048576,
    ArtifactPerkOwned = 2097152,
    Savings = 4194304,
    Ineligible = 8388608,
  }

  enum DestinySocketCategoryStyle {
    Unknown = 0,
    Reusable = 1,
    Consumable = 2,
    Unlockable = 3,
    Intrinsic = 4,
    EnergyMeter = 5,
    LargePerk = 6,
    Abilities = 7,
    Supers = 8,
  }

  enum SocketTypeActionType {
    InsertPlug = 0,
    InfuseItem = 1,
    ReinitializeSocket = 2,
  }

  enum DestinySocketVisibility {
    Visible = 0,
    Hidden = 1,
    HiddenWhenEmpty = 2,
    HiddenIfNoPlugsAvailable = 3,
  }

  enum DestinyRewardAdjusterType {
    None = 0,
    Blueprint = 1,
    ProgressionMap = 2,
    Delta = 3,
  }

  enum DestinyScope {
    Profile = 0,
    Character = 1,
  }

  enum DestinyPresentationNodeType {
    Default = 0,
    Category = 1,
    Collectibles = 2,
    Records = 3,
    Metric = 4,
    Craftable = 5,
  }

  enum DestinyPresentationDisplayStyle {
    Category = 0,
    Badge = 1,
    Medals = 2,
    Collectible = 3,
    Record = 4,
    SeasonalTriumph = 5,
    GuardianRank = 6,
    CategoryCollectibles = 7,
    CategoryCurrencies = 8,
    CategoryEmblems = 9,
    CategoryEmotes = 10,
    CategoryEngrams = 11,
    CategoryFinishers = 12,
    CategoryGhosts = 13,
    CategoryMisc = 14,
    CategoryMods = 15,
    CategoryOrnaments = 16,
    CategoryShaders = 17,
    CategoryShips = 18,
    CategorySpawnfx = 19,
    CategoryUpgradeMaterials = 20,
  }

  enum DestinyRecordValueStyle {
    Integer = 0,
    Percentage = 1,
    Milliseconds = 2,
    Boolean = 3,
    Decimal = 4,
  }

  enum DestinyRecordToastStyle {
    None = 0,
    Record = 1,
    Lore = 2,
    Badge = 3,
    MetaRecord = 4,
    MedalComplete = 5,
    SeasonChallengeComplete = 6,
    GildedTitleComplete = 7,
    CraftingRecipeUnlocked = 8,
    ToastGuardianRankDetails = 9,
    PathfinderObjectiveCompleteRituals = 10,
    PathfinderObjectiveCompleteSchism = 11,
  }

  enum DestinyPresentationScreenStyle {
    Default = 0,
    CategorySets = 1,
    Badge = 2,
  }

  enum FireteamFinderLabelFieldType {
    Title = 0,
    Label = 1,
  }

  enum FireteamFinderCodeOptionType {
    None = 0,
    ApplicationOnly = 1,
    OnlineOnly = 2,
    PlayerCount = 3,
    Title = 4,
    Tags = 5,
    FinderActivityGraph = 6,
    MicrophoneRequired = 7,
  }

  enum FireteamFinderOptionAvailability {
    None = 0,
    CreateListingBuilder = 1,
    SearchListingBuilder = 2,
    ListingViewer = 4,
    LobbyViewer = 8,
  }

  enum FireteamFinderOptionVisibility {
    Always = 0,
    ShowWhenChangedFromDefault = 1,
  }

  enum FireteamFinderOptionControlType {
    None = 0,
    ValueCollection = 1,
    RadioButton = 2,
  }

  enum FireteamFinderOptionSearchFilterType {
    None = 0,
    All = 1,
    Any = 2,
    InRangeInclusive = 3,
    InRangeExclusive = 4,
    GreaterThan = 5,
    GreaterThanOrEqualTo = 6,
    LessThan = 7,
    LessThanOrEqualTo = 8,
  }

  enum FireteamFinderOptionDisplayFormat {
    Text = 0,
    Integer = 1,
    Bool = 2,
    FormatString = 3,
  }

  enum FireteamFinderOptionValueProviderType {
    None = 0,
    Values = 1,
    PlayerCount = 2,
    FireteamFinderLabels = 3,
    FireteamFinderActivityGraph = 4,
  }

  enum FireteamFinderOptionValueFlags {
    None = 0,
    CreateListingDefaultValue = 1,
    SearchFilterDefaultValue = 2,
  }

  enum ActivityGraphNodeHighlightType {
    None = 0,
    Normal = 1,
    Hyper = 2,
    Comet = 3,
    RiseOfIron = 4,
  }

  enum DestinyGraphNodeState {
    Hidden = 0,
    Visible = 1,
    Teaser = 2,
    Incomplete = 3,
    Completed = 4,
  }

  enum DestinyHelmetPreferenceType {
    RemoveWhenSafe = 0,
    AlwaysWear = 1,
  }

  enum BungieMembershipType {
    None = 0,
    TigerXbox = 1,
    TigerPsn = 2,
    TigerSteam = 3,
    TigerBlizzard = 4,
    TigerStadia = 5,
    TigerEgs = 6,
    TigerDemon = 10,
    BungieNext = 254,
    All = -1,
  }

  enum DestinyMilestoneDisplayPreference {
    MilestoneDefinition = 0,
    CurrentQuestSteps = 1,
    CurrentActivityChallenges = 2,
  }

  enum DestinyMilestoneType {
    Unknown = 0,
    Tutorial = 1,
    OneTime = 2,
    Weekly = 3,
    Daily = 4,
    Special = 5,
  }

  export interface DestinyActivityDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    originalDisplayProperties: DestinyDisplayPropertiesDefinition;

    selectionScreenDisplayProperties: DestinyDisplayPropertiesDefinition;

    releaseIcon: string;

    releaseTime: number;

    completionUnlockHash: number;

    activityLightLevel: number;

    activeRanges: DateRange[];

    destinationHash: number;

    placeHash: number;

    activityTypeHash: number;

    tier: number;

    pgcrImage: string;

    rewards: DestinyActivityRewardDefinition[];

    modifiers: DestinyActivityModifierReferenceDefinition[];

    isPlaylist: boolean;

    grognokActivityName: string;

    activityGroupingIdentifier: string;

    challenges: DestinyActivityChallengeDefinition[];

    optionalUnlockStrings: DestinyActivityUnlockStringDefinition[];

    inheritFromFreeRoam: boolean;

    suppressOtherRewards: boolean;

    rewardMappingReferences: DestinyRewardMappingGatedReference[];

    activityOptions: DestinyActivityOptionSet[];

    visibilityUnlocks: DestinyUnlockExpressionDefinition[];

    activityRequirementLabelHashes: number[];

    requirements: DestinyActivityRequirementsBlock;

    playlistItems: DestinyActivityPlaylistItemDefinition[];

    activityGraphList: DestinyActivityGraphListEntryDefinition[];

    matchmaking: DestinyActivityMatchmakingBlockDefinition;

    guidedGame: DestinyActivityGuidedBlockDefinition;

    directActivityModeHash?: number;

    directActivityModeType?: DestinyActivityModeType;

    loadouts: DestinyActivityLoadoutRequirementSet[];

    activityModeHashes: number[];

    activityModeTypes: DestinyActivityModeType[];

    activityModeIdentifier: string;

    isPvP: boolean;

    insertionPoints: DestinyActivityInsertionPointDefinition[];

    intrinsicUnlocks: DestinyActivityIntrinsicUnlockDefinition[];

    activityLocationMappings: DestinyEnvironmentLocationMapping[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityRewardDefinition {
    rewardText: string;

    rewardItems: DestinyItemQuantity[];

    rewardUnlock: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyUnlockExpressionDefinition {
    steps: DestinyUnlockExpressionStepDefinition[];

    scope: DestinyGatingScope;

    checksCrm?: boolean;

    checksOffer?: boolean;
  }

  export interface DestinyUnlockExpressionStepDefinition {
    stepOperator: DestinyUnlockOperator;

    unlockHash?: number;

    valueHash?: number;

    mappingHash?: number;

    sourceMappingHash?: number;

    value: number;
  }

  export interface DestinyActivityModifierReferenceDefinition {
    activityModifierHash: number;

    unlocks: DestinyUnlockExpressionDefinition;

    internalDisplayName: string;
  }

  export interface DestinyActivityChallengeDefinition {
    available: DestinyUnlockExpressionDefinition;

    rewardSiteHash: number;

    inhibitRewardsUnlockHash: number;

    objectiveHash: number;

    dummyRewards: DestinyItemQuantity[];
  }

  export interface DestinyActivityUnlockStringDefinition {
    expression: DestinyUnlockExpressionDefinition;

    displayString: string;
  }

  export interface DestinyActivityOptionSet {
    unlockExpression: DestinyUnlockExpressionDefinition;

    entityArrayProperties: {
      [key: string]: DestinyActivityOptionEntityMappingArray;
    };

    entityValueProperties: {
      [key: string]: DestinyActivityOptionEntityMappingValue;
    };

    booleanProperties: { [key: string]: DestinyActivityBooleanOption };

    floatProperties: { [key: string]: DestinyActivityFloatOption };

    integerProperties: { [key: string]: DestinyActivityIntegerOption };

    unknownProperties: { [key: string]: DestinyActivityOption };
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

  export interface DestinyActivityOption {
    optionName: string;

    optionHash: number;

    optionType: string;
  }

  export interface DestinyActivityRequirementsBlock {
    leaderRequirementLabels: DestinyActivityRequirementLabel[];

    fireteamRequirementLabels: DestinyActivityRequirementLabel[];

    fireteamWarningLabels: DestinyActivityRequirementLabel[];
  }

  export interface DestinyActivityRequirementLabel {
    requirementUnlockExpression: DestinyUnlockExpressionDefinition;

    displayString: string;
  }

  export interface DestinyActivityPlaylistItemDefinition {
    activityHash: number;

    directActivityModeHash?: number;

    directActivityModeType?: DestinyActivityModeType;

    activityModeHashes: number[];

    activityModeTypes: DestinyActivityModeType[];

    weight: number;

    requiredExpression: DestinyUnlockExpressionDefinition;

    activityModeIdentifier: string;
  }

  export interface DestinyActivityGraphListEntryDefinition {
    activityGraphHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyActivityMatchmakingBlockDefinition {
    isMatchmade: boolean;

    minParty: number;

    maxParty: number;

    maxPlayers: number;

    requiresGuardianOath: boolean;
  }

  export interface DestinyActivityGuidedBlockDefinition {
    guidedMaxLobbySize: number;

    guidedMinLobbySize: number;

    guidedDisbandCount: number;
  }

  export interface DestinyActivityLoadoutRequirementSet {
    unlockExpression: DestinyUnlockExpressionDefinition;

    requirements: DestinyActivityLoadoutRequirement[];
  }

  export interface DestinyActivityLoadoutRequirement {
    equipmentSlotHash: number;

    allowedEquippedItemHashes: number[];

    allowedWeaponSubTypes: DestinyItemSubType[];

    allowedWeaponTypeRawHashes: number[];
  }

  export interface DestinyActivityInsertionPointDefinition {
    phaseName: string;

    phaseHash: number;

    unlockHash: number;

    phaseBubbleUnlockHash?: number;
  }

  export interface DestinyActivityIntrinsicUnlockDefinition {
    unlockHash: number;

    value: DestinyUnlockState;
  }

  export interface DestinyActivityModeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    pgcrImage: string;

    modeType: DestinyActivityModeType;

    activityModeCategory: DestinyActivityModeCategory;

    activityModeIdentifiers: string[];

    isTeamBased: boolean;

    tier: number;

    isAggregateMode: boolean;

    parentHashes: number[];

    friendlyName: string;

    supportsFeedFiltering: boolean;

    activityModeMappings: { [key: number]: DestinyActivityModeType };

    sourceActivityModeMappings: { [key: string]: DestinyActivityModeType };

    descendantHashes: number[];

    ascendantHashes: number[];

    display: boolean;

    order: number;

    sourceActivityCategories: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyBondDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    questItemHashes: number[];

    providedUnlockHash: number;

    providedUnlockValueHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyClassDefinition {
    classType: DestinyClass;

    displayProperties: DestinyDisplayPropertiesDefinition;

    genderedClassNames: { [key: string]: string };

    genderedClassNamesByGenderHash: { [key: number]: string };

    mentorVendorHash?: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyGenderDefinition {
    genderType: DestinyGender;

    displayProperties: DestinyDisplayPropertiesDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRaceDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    raceType: DestinyRace;

    genderedRaceNames: { [key: string]: string };

    genderedRaceNamesByGenderHash: { [key: number]: string };

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyDamageTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    transparentIconPath: string;

    showIcon: boolean;

    enumValue: DamageType;

    color: DestinyColor;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyDefinition {
    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyEquipmentSlotDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    equipmentCategoryHash: number;

    bucketTypeHash: number;

    applyCustomArtDyes: boolean;

    artDyeChannels: DestinyArtDyeReference[];

    unlockedExpression: DestinyUnlockExpressionDefinition;

    modificationExpression: DestinyUnlockExpressionDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArtDyeReference {
    artDyeChannelHash: number;
  }

  export interface DestinySlotAllocationDefinition {
    roundUp: boolean;

    slotHash: number;

    weight: number;
  }

  export interface DestinyFactionDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    progressionHash: number;

    tokenValues: { [key: number]: number };

    rewardItemHash: number;

    rewardVendorHash: number;

    vendors: DestinyFactionVendorDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFactionVendorDefinition {
    vendorHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;

    destinationHash: number;

    backgroundImagePath: string;
  }

  export interface DestinyInventoryBucketDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    scope: BucketScope;

    category: BucketCategory;

    bucketOrder: number;

    itemCount: number;

    location: ItemLocation;

    hasTransferDestination: boolean;

    enabled: boolean;

    fifo: boolean;

    equipUnlockHash?: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyPlatformBucketMappingDefinition {
    membershipType: BungieMembershipType;

    bucketHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyInventoryItemDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    tooltipNotifications: DestinyItemTooltipNotification[];

    collectibleHash?: number;

    iconWatermark: string;

    iconWatermarkShelved: string;

    secondaryIcon: string;

    secondaryOverlay: string;

    secondarySpecial: string;

    backgroundColor: DestinyColor;

    screenshot: string;

    itemTypeName: string;

    itemTypeDisplayName: string;

    flavorText: string;

    uiItemDisplayStyle: string;

    itemTypeAndTierDisplayName: string;

    displaySource: string;

    tooltipStyle: string;

    action: DestinyItemActionBlockDefinition;

    crafting: DestinyItemCraftingBlockDefinition;

    inventory: DestinyItemInventoryBlockDefinition;

    setData: DestinyItemSetBlockDefinition;

    stats: DestinyItemStatBlockDefinition;

    statsEnabledUnlockExpression: DestinyUnlockExpressionDefinition;

    emblemObjectiveHash?: number;

    equippingBlock: DestinyEquippingBlockDefinition;

    translationBlock: DestinyItemTranslationBlockDefinition;

    preview: DestinyItemPreviewBlockDefinition;

    quality: DestinyItemQualityBlockDefinition;

    value: DestinyItemValueBlockDefinition;

    sourceData: DestinyItemSourceBlockDefinition;

    objectives: DestinyItemObjectiveBlockDefinition;

    metrics: DestinyItemMetricBlockDefinition;

    plug: DestinyItemPlugDefinition;

    acquireRewardSiteHash: number;

    acquireUnlockHash: number;

    acquireTimestampUnlockValueHash?: number;

    gearset: DestinyItemGearsetBlockDefinition;

    sack: DestinyItemSackBlockDefinition;

    sockets: DestinyItemSocketBlockDefinition;

    summary: DestinyItemSummaryBlockDefinition;

    talentGrid: DestinyItemTalentGridBlockDefinition;

    investmentStats: DestinyItemInvestmentStatDefinition[];

    perks: DestinyItemPerkEntryDefinition[];

    loreHash?: number;

    summaryItemHash?: number;

    unlocks: DestinyItemUnlockBlockDefinition;

    animations: DestinyAnimationReference[];

    allowActions: boolean;

    links: HyperlinkReference[];

    doesPostmasterPullHaveSideEffects: boolean;

    nonTransferrable: boolean;

    itemCategoryHashes: number[];

    specialItemType: SpecialItemType;

    itemType: DestinyItemType;

    itemSubType: DestinyItemSubType;

    classType: DestinyClass;

    breakerType: DestinyBreakerType;

    breakerTypeHash?: number;

    equippable: boolean;

    damageTypeHashes: number[];

    damageTypes: DamageType[];

    defaultDamageType: DamageType;

    defaultDamageTypeHash?: number;

    seasonHash?: number;

    isWrapper: boolean;

    traitIds: string[];

    traitHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyItemTooltipNotification {
    visibilityUnlockExpression: DestinyUnlockExpressionDefinition;

    displayString: string;

    displayStyle: string;
  }

  export interface DestinyItemActionBlockDefinition {
    verbName: string;

    verbDescription: string;

    isPositive: boolean;

    overlayScreenName: string;

    overlayIcon: string;

    requiredCooldownSeconds: number;

    requiredUnlockExpressions: DestinyUnlockExpressionDefinition[];

    requiredItems: DestinyItemActionRequiredItemDefinition[];

    progressionRewards: DestinyProgressionRewardDefinition[];

    actionTypeLabel: string;

    requiredLocation: string;

    rewardSheetHash: number;

    rewardItemHash: number;

    rewardSiteHash: number;

    requiredCooldownHash: number;

    deleteOnAction: boolean;

    consumeEntireStack: boolean;

    useOnAcquire: boolean;
  }

  export interface DestinyItemActionRequiredItemDefinition {
    count: number;

    itemHash: number;

    deleteOnAction: boolean;
  }

  export interface DestinyProgressionRewardDefinition {
    progressionMappingHash: number;

    amount: number;

    applyThrottles: boolean;
  }

  export interface DestinyItemCraftingBlockDefinition {
    descriptions: string[];

    outputItemHash: number;

    craftingRewardSiteHash?: number;

    recipeAlwaysVisibleUnlockExpression: DestinyUnlockExpressionDefinition;

    requiredSocketTypeHashes: number[];

    generalRequiredUnlockExpressions: DestinyUnlockExpressionDefinition[];

    failedRequirementStrings: string[];

    reforgeRequiredUnlockExpression: DestinyUnlockExpressionDefinition;

    baseMaterialRequirements?: number;

    freeCraftUnlockExpression: DestinyUnlockExpressionDefinition;

    bonusPlugs: DestinyItemCraftingBlockBonusPlugDefinition[];
  }

  export interface DestinyItemCraftingBlockBonusPlugDefinition {
    requiredUnlockExpression: DestinyUnlockExpressionDefinition;

    socketTypeHash: number;

    plugItemHash: number;
  }

  export interface DestinyItemInventoryBlockDefinition {
    stackUniqueLabel: string;

    maxStackSize: number;

    bucketTypeHash: number;

    recoveryBucketTypeHash: number;

    tierTypeHash: number;

    isInstanceItem: boolean;

    nonTransferrableOriginal: boolean;

    tierTypeName: string;

    tierType: TierType;

    expirationTooltip: string;

    expiredInActivityMessage: string;

    expiredInOrbitMessage: string;

    expirationLifespanUnlockExpression: DestinyUnlockExpressionDefinition;

    expirationUnlockValueHash?: number;

    suppressExpirationWhenObjectivesComplete: boolean;

    recipeItemHash?: number;
  }

  export interface DestinyItemSetBlockDefinition {
    itemList: DestinyItemSetBlockEntryDefinition[];

    trackingUnlockValueHash: number;

    abandonmentUnlockHash: number;

    requireOrderedSetItemAdd: boolean;

    setIsFeatured: boolean;

    setType: string;

    questLineName: string;

    questLineDescription: string;

    questStepSummary: string;
  }

  export interface DestinyItemSetBlockEntryDefinition {
    trackingValue: number;

    itemHash: number;
  }

  export interface DestinyItemStatBlockDefinition {
    disablePrimaryStatDisplay: boolean;

    statGroupHash?: number;

    stats: { [key: number]: DestinyInventoryItemStatDefinition };

    hasDisplayableStats: boolean;

    baseStats: { [key: number]: number };

    primaryBaseStatHash: number;
  }

  export interface DestinyInventoryItemStatDefinition {
    statHash: number;

    value: number;

    minimum: number;

    maximum: number;

    displayMaximum?: number;
  }

  export interface DestinyEquippingBlockDefinition {
    gearsetItemHash?: number;

    uniqueLabel: string;

    uniqueLabelHash: number;

    equipmentSlotTypeHash: number;

    requiredUnlockExpressions: DestinyUnlockExpressionDefinition[];

    attributes: EquippingItemBlockAttributes;

    equippingSoundHash: number;

    hornSoundHash: number;

    ammoType: DestinyAmmunitionType;

    displayStrings: string[];
  }

  export interface DestinyItemTranslationBlockDefinition {
    weaponPatternIdentifier: string;

    weaponPatternHash: number;

    defaultDyes: DyeReference[];

    lockedDyes: DyeReference[];

    customDyes: DyeReference[];

    arrangements: DestinyGearArtArrangementReference[];

    hasGeometry: boolean;
  }

  export interface DestinyGearArtArrangementReference {
    classHash: number;

    artArrangementHash: number;
  }

  export interface DestinyItemPreviewBlockDefinition {
    screenStyle: string;

    previewVendorHash: number;

    artifactHash?: number;

    previewActionString: string;

    derivedItemCategories: DestinyDerivedItemCategoryDefinition[];
  }

  export interface DestinyItemQualityBlockDefinition {
    itemLevels: number[];

    qualityLevel: number;

    infusionCategoryName: string;

    infusionCategoryHash: number;

    infusionCategoryHashes: number[];

    progressionLevelRequirementHash: number;

    currentVersion: number;

    versions: DestinyItemVersionDefinition[];

    displayVersionWatermarkIcons: string[];
  }

  export interface DestinyItemVersionDefinition {
    powerCapHash: number;
  }

  export interface DestinyItemValueBlockDefinition {
    itemValue: DestinyItemQuantity[];

    valueDescription: string;

    itemValueHasConditionalVisibility?: boolean;
  }

  export interface DestinyItemSourceBlockDefinition {
    rewardReferences: RewardItemReferenceSet;

    sourceHashes: number[];

    sources: DestinyItemSourceDefinition[];

    exclusive: BungieMembershipType;

    vendorSources: DestinyItemVendorSourceReference[];
  }

  export interface DestinyItemVendorSourceReference {
    vendorHash: number;

    vendorItemIndexes: number[];
  }

  export interface DestinyItemObjectiveBlockDefinition {
    objectiveHashes: number[];

    displayActivityHashes: number[];

    requireFullObjectiveCompletion: boolean;

    questlineItemHash: number;

    narrative: string;

    objectiveVerbName: string;

    questTypeIdentifier: string;

    questTypeHash: number;

    completionRewardSiteHash: number;

    nextQuestStepRewardSiteHash: number;

    timestampUnlockValueHash: number;

    isGlobalObjectiveItem: boolean;

    useOnObjectiveCompletion: boolean;

    inhibitCompletionUnlockValueHash: number;

    completionTimestampUnlockValueHash?: number;

    perObjectiveDisplayProperties: DestinyObjectiveDisplayProperties[];

    displayAsStatTracker: boolean;
  }

  export interface DestinyObjectiveDisplayProperties {
    activityHash?: number;

    displayOnItemPreviewScreen: boolean;
  }

  export interface DestinyItemMetricBlockDefinition {
    availableMetricCategoryNodeHashes: number[];
  }

  export interface DestinyItemGearsetBlockDefinition {
    trackingValueMax: number;

    itemList: number[];

    unlockExpression: DestinyUnlockExpressionDefinition;

    enabledExpressions: DestinyUnlockExpressionDefinition[];
  }

  export interface DestinyItemSackBlockDefinition {
    detailAction: string;

    openAction: string;

    seedUnlockValueHash: number;

    resolvedBitVectorUnlockValueHash: number;

    resolvedItemCountUnlockValueHash: number;

    selectItemCount: number;

    rollStateUnlockValueHash: number;

    rewardItemListHash: number;

    vendorSackType: string;

    openOnAcquire: boolean;

    categoryList: DestinyItemSackRewardCategory[];
  }

  export interface DestinyItemSackRewardCategory {
    categoryId: number;

    rewardItemCount: number;

    rewardSelectorHash: number;
  }

  export interface DestinyItemSocketBlockDefinition {
    detail: string;

    socketEntries: DestinyItemSocketEntryDefinition[];

    intrinsicSockets: DestinyItemIntrinsicSocketEntryDefinition[];

    socketCategories: DestinyItemSocketCategoryDefinition[];

    constantOverrideStyleItemHash?: number;
  }

  export interface DestinyItemSocketEntryDefinition {
    socketTypeHash: number;

    singleInitialItemHash: number;

    singleInitialRewardItemListHash?: number;

    reusablePlugItems: DestinyItemSocketEntryPlugItemDefinition[];

    preventInitializationOnVendorPurchase: boolean;

    preventInitializationWhenVersioning: boolean;

    hidePerksInItemTooltip: boolean;

    plugSources: SocketPlugSources;

    reusablePlugSetHash?: number;

    randomizedPlugSetHash?: number;

    overridesUiAppearance: boolean;

    defaultVisible: boolean;
  }

  export interface DestinyItemSocketEntryPlugItemDefinition {
    plugItemHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyItemIntrinsicSocketEntryDefinition {
    plugItemHash: number;

    socketTypeHash: number;

    defaultVisible: boolean;
  }

  export interface DestinyItemSocketCategoryDefinition {
    socketCategoryHash: number;

    socketIndexes: number[];
  }

  export interface DestinyItemSummaryBlockDefinition {
    sortPriority: number;
  }

  export interface DestinyItemTalentGridBlockDefinition {
    talentGridHash: number;

    itemDetailString: string;

    buildName: string;

    hudDamageType: DamageType;

    hudIcon: string;
  }

  export interface DestinyItemInvestmentStatDefinition {
    statTypeHash: number;

    value: number;

    isConditionallyActive: boolean;

    requirementUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyItemPerkEntryDefinition {
    requirementDisplayString: string;

    perkHash: number;

    perkVisibility: ItemPerkVisibility;

    unlockExpression: DestinyUnlockExpressionDefinition;

    visibilityUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyItemUnlockBlockDefinition {
    intrinsicUnlockHashes: number[];

    storedUnlockValues: DestinyItemUnlockStoredValueDefinition[];

    intrinsicUnlockValues: DestinyIntrinsicUnlockValueDefinition[];
  }

  export interface DestinyItemUnlockStoredValueDefinition {
    unlockValueHash: number;

    defaultValue: number;
  }

  export interface DestinyIntrinsicUnlockValueDefinition {
    unlockValueHash: number;

    value: number;
  }

  export interface DestinyItemSocketEntryPlugItemRandomizedDefinition {
    craftingRequirements: DestinyPlugItemCraftingRequirements;

    weight: number;

    alternateWeight: number;

    currentlyCanRoll: boolean;

    plugItemHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyPlugItemCraftingRequirements {
    unlockRequirements: DestinyPlugItemCraftingUnlockRequirement[];

    requiredLevel?: number;

    materialRequirementHashes: number[];
  }

  export interface DestinyPlugItemCraftingUnlockRequirement {
    unlockExpression: DestinyUnlockExpressionDefinition;

    failureDescription: string;
  }

  export interface DestinyItemCategoryDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    visible: boolean;

    deprecated: boolean;

    shortTitle: string;

    itemTypeRegex: string;

    intrinsicUnlock: string;

    grantDestinyBreakerType: DestinyBreakerType;

    itemNameRegex: string;

    plugCategoryIdentifier: string;

    itemTypeRegexNot: string;

    originBucketIdentifier: string;

    requiredUnlockRegex: string;

    grantDestinyItemType: DestinyItemType;

    grantDestinySubType: DestinyItemSubType;

    grantDestinyClass: DestinyClass;

    traitId: string;

    groupedCategoryHashes: number[];

    isPlug: boolean;

    isWrapper?: boolean;

    parentCategoryHashes: number[];

    groupCategoryOnly: boolean;

    requiresNonNullPropertyNamed: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyDestinationDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    placeHash: number;

    defaultFreeroamActivityHash: number;

    intrinsics: DestinyIntrinsicUnlockDefinition[];

    activityGraphEntries: DestinyActivityGraphListEntryDefinition[];

    bubbleSettings: DestinyDestinationBubbleSettingDefinition[];

    bubbles: DestinyBubbleDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyDestinationBubbleSettingDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;
  }

  export interface DestinyBubbleDefinition {
    hash: number;

    identifier: string;

    intrinsics: DestinyIntrinsicUnlockDefinition[];

    displayProperties: DestinyDisplayPropertiesDefinition;
  }

  export interface DestinyLocationDefinition {
    uiLocationType: string;

    vendorHash: number;

    locationReleases: DestinyLocationReleaseDefinition[];

    triggeredUnlockExpression: DestinyUnlockExpressionDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLocationReleaseDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    smallTransparentIcon: string;

    mapIcon: string;

    largeTransparentIcon: string;

    spawnPoint: number;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    destinationHash: number;

    activityHash: number;

    activityGraphHash: number;

    activityGraphNodeHash: number;

    activityBubbleName: number;

    activityPathBundle: number;

    activityPathDestination: number;

    navPointType: DestinyActivityNavPointType;

    worldPosition: number[];
  }

  export interface DestinyPlaceDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyMaterialRequirementSetDefinition {
    materials: DestinyMaterialRequirement[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyMaterialRequirement {
    itemHash: number;

    deleteOnAction: boolean;

    count: number;

    countIsConstant: boolean;

    countExpression: DestinyUnlockExpressionDefinition;

    omitFromRequirements: boolean;

    virtualMaterialUnlockValueHash?: number;
  }

  export interface DestinyMedalTierDefinition {
    tierName: string;

    order: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyObjectiveDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    unlockValueHash: number;

    progressUnlockExpression: DestinyUnlockExpressionDefinition;

    completionValue: number;

    reductionExpression: DestinyUnlockExpressionDefinition;

    scope: DestinyGatingScope;

    locationHash: number;

    allowNegativeValue: boolean;

    allowValueChangeWhenCompleted: boolean;

    isCountingDownward: boolean;

    valueStyle: DestinyUnlockValueUIStyle;

    progressDescription: string;

    intrinsicUnlockHashes: number[];

    perks: DestinyObjectivePerkEntryDefinition;

    stats: DestinyObjectiveStatEntryDefinition;

    minimumVisibilityThreshold: number;

    visibilityUnlockExpression: DestinyUnlockExpressionDefinition;

    allowOvercompletion: boolean;

    showValueOnComplete: boolean;

    displayOnlyValueOverride: DestinyUnlockExpressionDefinition;

    isDisplayOnlyObjective: boolean;

    completedValueStyle: DestinyUnlockValueUIStyle;

    inProgressValueStyle: DestinyUnlockValueUIStyle;

    uiLabel: string;

    uiStyle: DestinyObjectiveUiStyle;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyObjectivePerkEntryDefinition {
    perkHash: number;

    style: DestinyObjectiveGrantStyle;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyObjectiveStatEntryDefinition {
    stat: DestinyItemInvestmentStatDefinition;

    style: DestinyObjectiveGrantStyle;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinySandboxPerkDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    perkIdentifier: string;

    isDisplayable: boolean;

    damageType: DamageType;

    damageTypeHash?: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyProgressionDefinition {
    displayProperties: DestinyProgressionDisplayPropertiesDefinition;

    scope: DestinyProgressionScope;

    stepCapUnlockValueHash?: number;

    currentProgressUnlockValueHash?: number;

    repeatLastStep: boolean;

    source: string;

    steps: DestinyProgressionStepDefinition[];

    visible: boolean;

    factionHash?: number;

    correlatedLevelUnlockValueHash?: number;

    progressToNextStepUnlockValueHash?: number;

    progressToNextStepScaling: number;

    storageMappingIndex: number;

    mappedDefinitionPointer: DestinyProgressionMappedDefinitionPointer;

    modifiers: DestinyProgressionModifier[];

    overrideGlobalScaling?: number;

    color: DestinyColor;

    rankIcon: string;

    currentResetCountUnlockValueHash: number;

    seasonResetCounts: LocalProgressionResetCountEntry[];

    rewardItems: DestinyProgressionRewardItemQuantity[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyProgressionDisplayPropertiesDefinition {
    displayUnitsName: string;

    description: string;

    name: string;

    icon: string;

    iconSequences: DestinyIconSequenceDefinition[];

    highResIcon: string;

    hasIcon: boolean;
  }

  export interface DestinyProgressionStepDefinition {
    stepName: string;

    displayEffectType: DestinyProgressionStepDisplayEffect;

    progressTotal: number;

    rewardItems: DestinyItemQuantity[];

    icon: string;

    unlockHash?: number;
  }

  export interface DestinyProgressionMappedDefinitionPointer {
    aggregateProgressionHashes: number[];

    aggregationType: DestinyProgressionAggregationType;

    mappedProgressionHash?: number;

    statTypeHash?: number;

    unlockValueHash?: number;

    mappingTable: DestinyProgressionMappingTableEntry[];
  }

  export interface DestinyProgressionMappingTableEntry {
    value: number;

    weight: number;
  }

  export interface DestinyProgressionModifier {
    conditionAggregationType: DestinyProgressionConditionAggregationType;

    weeklyLimit: number;

    stepCap: number;

    scalePercentage: number;

    dailyLimit: number;

    equippedAndUsable: boolean;

    highestCharacterInProgression: boolean;

    incidentInvolved: boolean;

    minStepIndex: number;

    maxStepIndex: number;

    maxStepsBelowCap: number;

    minStepsBelowCap: number;

    notEquippedAndUsable: boolean;

    notHighestCharacterInProgression: boolean;

    notIncidentInvolved: boolean;

    talentGridCapped: boolean;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface LocalProgressionResetCountEntry {
    season: number;

    resetCountUnlockValueHash: number;
  }

  export interface DestinyProgressionRewardItemQuantity {
    rewardedAtProgressionLevel: number;

    acquisitionBehavior: DestinyProgressionRewardItemAcquisitionBehavior;

    itemClaimedUnlockHash: number;

    claimUnlockExpressions: DestinyUnlockExpressionDefinition[];

    uiDisplayStyle: string;

    visibleUnlockExpression: DestinyUnlockExpressionDefinition;

    claimUnlockDisplayStrings: string[];

    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;

    uiOnlyGatingUnlockExpressionMappingHash?: number;

    uiOnlyGatingUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyProgressionMappingDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    displayUnits: string;

    progressionHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArtDyeChannelDefinition {
    channelHash: number;

    index: number;

    channelName: string;

    boundToRelease: string;

    hash: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArtDyeReferenceDefinition {
    artDyeHash: number;

    artDyeName: string;

    index: number;

    dyeManifestHash: number;

    dyeManifestName: string;

    boundToRelease: string;

    hash: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyGearAnimationAssetDefinition {
    Animation: string;

    Skeleton: string;
  }

  export interface DestinyGearAssetsDefinition {
    GearAssets: any;

    content: DestinyGearPlatformContent[];
  }

  export interface DestinyGearPlatformContent {
    platform: string;

    GeometryAssets: string[];

    TextureAssets: string[];

    Shaders: string[];

    PlateRegions: string[];

    MaleIndexSet: DestinyGearAssetsIndexSet;

    DyeIndexSet: DestinyGearAssetsIndexSet;

    FemaleIndexSet: DestinyGearAssetsIndexSet;

    RegionIndexSets: { [key: number]: DestinyGearAssetsIndexSet[] };
  }

  export interface DestinyGearAssetsIndexSet {
    textures: number[];

    geometry: number[];

    plate_regions: number[];

    shaders: number[];
  }

  export interface DestinySandboxPatternDefinition {
    patternHash: number;

    patternName: string;

    patternGlobalTagIdHash: number;

    weaponContentGroupHash: number;

    weaponTranslationGroupHash: number;

    weaponTypeHash?: number;

    weaponType: DestinyItemSubType;

    filters: DestinyArrangementRegionFilterDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArrangementRegionFilterDefinition {
    artArrangementRegionHash: number;

    artArrangementRegionIndex: number;

    statHash: number;

    arrangementIndexByStatValue: { [key: number]: number };

    entries: DestinyArrangementRegionFilterEntry[];
  }

  export interface DestinyArrangementRegionFilterEntry {
    statValue: number;

    arrangementRegionIndex: number;
  }

  export interface DestinyRewardItemListDefinition {
    items: DestinyRewardItemDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRewardItemDefinition {
    itemHash: number;

    weight: number;

    alternateWeight: number;

    overrideBucketHash: number;

    quantity: number;

    unlock: DestinyUnlockExpressionDefinition;

    redirectItemListHash?: number;

    itemLevels: DestinyItemLevel[];

    activityLevelRange: DestinyActivityLevelRange;

    progressionLevelRange: DestinyProgressionLevelRange;

    statLevelRange: DestinyStatLevelRange;

    balancedRewardSelectorLabel?: number;
  }

  export interface DestinyItemLevel {
    level: number;
  }

  export interface DestinyActivityLevelRange {
    expansionLevelHash: number;

    minimumLevel: number;

    maximumLevel: number;
  }

  export interface DestinyProgressionLevelRange {
    progressionHash: number;

    minimumLevel: number;

    maximumLevel: number;
  }

  export interface DestinyStatLevelRange {
    statHash: number;

    minimumLevel: number;

    maximumLevel: number;
  }

  export interface DestinyRewardMappingDefinition {
    mappingHash: number;

    internalName: string;

    mappingIndex: number;

    isGlobal: boolean;

    incidentHashes: number[];

    combatantHashes: number[];

    rewardSheetHashes: number[];

    combatantSheets: RewardSheetEntityReference[];

    incidentSheets: RewardSheetEntityReference[];

    completionSheets: RewardSheetEntityReference[];

    activationSheets: RewardSheetEntityReference[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface RewardSheetEntityReference {
    entityId: number;

    sheetHash: number;

    incidentName: string;
  }

  export interface DestinyRewardSheetDefinition {
    sheetHash: number;

    sheetIndex: number;

    internalName: string;

    entries: DestinyRewardSheetEntryDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRewardSheetEntryDefinition {
    sheetItemLists: DestinyRewardSheetItemListDefinition[];

    unlocks: DestinyUnlockExpressionDefinition;

    adjustorHash: number;
  }

  export interface DestinyRewardSheetItemListDefinition {
    adjustorHash: number;

    itemListHash: number;

    weight: number;
  }

  export interface DestinyRewardSourceDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    category: DestinyRewardSourceCategory;

    linkedRewardMappings: { [key: number]: DestinyRewardSourceMappingEntry };

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRewardSourceMappingEntry {
    mappingHash: number;

    trustIncidents: boolean;
  }

  export interface DestinyStatDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    aggregationType: DestinyStatAggregationType;

    hasComputedBlock: boolean;

    statCategory: DestinyStatCategory;

    interpolationPoints: InterpolationPoint[];

    qualityToValuePoints: InterpolationPoint[];

    slotAllocations: DestinySlotAllocationDefinition[];

    interpolate: boolean;

    conditionalStatModifiers: SchemaConditionalStatModifier[];

    statCaps: SchemaStatCap[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface SchemaConditionalStatModifier {
    modifierValue: number;

    conditions: DestinyUnlockExpressionDefinition;

    equipmentSlotHash?: number;
  }

  export interface SchemaStatCap {
    conditions: DestinyUnlockExpressionDefinition;

    maximumValue: number;
  }

  export interface DestinyStatDisplayDefinition {
    statHash: number;

    maximumValue: number;

    displayAsNumeric: boolean;

    displayInterpolation: InterpolationPoint[];
  }

  export interface DestinyStatGroupDefinition {
    maximumValue: number;

    uiPosition: number;

    scaledStats: DestinyStatDisplayDefinition[];

    overrides: { [key: number]: DestinyStatOverrideDefinition };

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyStatOverrideDefinition {
    statHash: number;

    displayProperties: DestinyDisplayPropertiesDefinition;
  }

  export interface DestinyNodeStepDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    stepIndex: number;

    nodeStepHash: number;

    interactionDescription: string;

    damageType: DamageType;

    damageTypeHash?: number;

    activationRequirement: DestinyNodeActivationRequirement;

    canActivateNextStep: boolean;

    nextStepIndex: number;

    isNextStepRandom: boolean;

    perkHashes: number[];

    startProgressionBarAtProgress: number;

    statHashes: number[];

    affectsQuality: boolean;

    stepGroups: DestinyTalentNodeStepGroups;

    trueStepIndex: number;

    truePropertyIndex: number;

    affectsLevel: boolean;

    socketReplacements: DestinyNodeSocketReplaceResponse[];

    visibility: DestinyNodeVisibilityDefinition;
  }

  export interface DestinyNodeActivationRequirement {
    gridLevel: number;

    materialRequirementHashes: number[];

    unlockExpressions: DestinyUnlockExpressionDefinition[];

    exclusiveSetRequiredHash: number;
  }

  export interface DestinyTalentNodeStepGroups {
    weaponPerformance: DestinyTalentNodeStepWeaponPerformances;

    impactEffects: DestinyTalentNodeStepImpactEffects;

    guardianAttributes: DestinyTalentNodeStepGuardianAttributes;

    lightAbilities: DestinyTalentNodeStepLightAbilities;

    damageTypes: DestinyTalentNodeStepDamageTypes;
  }

  export interface DestinyNodeSocketReplaceResponse {
    socketTypeHash: number;

    plugItemHash: number;
  }

  export interface DestinyNodeVisibilityDefinition {
    minLevel: number;

    maxLevel: number;

    transient: boolean;

    unlocks: DestinyUnlockExpressionDefinition[];
  }

  export interface DestinyNodeStepSummaryDefinition {
    nodeStepHash: number;

    displayProperties: DestinyDisplayPropertiesDefinition;

    perkHashes: number[];

    statHashes: number[];

    affectsQuality: boolean;

    stepGroups: DestinyTalentNodeStepGroups;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyTalentGridDefinition {
    maxGridLevel: number;

    gridLevelPerColumn: number;

    progressionHash: number;

    nodes: DestinyTalentNodeDefinition[];

    calcMaxGridLevel: number;

    calcProgressToMaxLevel: number;

    exclusiveSets: DestinyTalentNodeExclusiveSetDefinition[];

    independentNodeIndexes: number[];

    maximumRandomMaterialRequirements: number;

    randomValues: DestinyTalentRandomValue[];

    exclusiveGroupScopes: number[][];

    groups: { [key: number]: DestinyTalentExclusiveGroup };

    nodeCategories: DestinyTalentNodeCategory[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyTalentNodeDefinition {
    nodeIndex: number;

    nodeHash: number;

    row: number;

    column: number;

    prerequisiteNodeIndexes: number[];

    binaryPairNodeIndex: number;

    autoUnlocks: boolean;

    lastStepRepeats: boolean;

    isRandom: boolean;

    randomActivationRequirement: DestinyNodeActivationRequirement;

    isRandomRepurchasable: boolean;

    steps: DestinyNodeStepDefinition[];

    exclusiveWithNodeHashes: number[];

    randomStartProgressionBarAtProgression: number;

    layoutIdentifier: string;

    groupHash?: number;

    loreHash?: number;

    groupName: string;

    groupScopeIndex: number;

    nodeStyleIdentifier: string;

    ignoreForCompletion: boolean;

    originalNodeHash: number;

    talentNodeTypes: TalentNodeTypes;

    exclusiveSetHash: number;

    exclusiveSetIdentifier: string;

    randomValueIndexPointer?: number;

    realSteps: DestinyRealStepDefinition[];

    isRealStepSelectionRandom: boolean;
  }

  export interface DestinyTalentNodeExclusiveSetDefinition {
    nodeIndexes: number[];
  }

  export interface DestinyTalentRandomValue {
    randomHash: number;

    randomId: string;

    maxValue: number;

    rollOnRepurchase: boolean;
  }

  export interface DestinyTalentExclusiveGroup {
    groupHash: number;

    loreHash?: number;

    nodeHashes: number[];

    opposingGroupHashes: number[];

    opposingNodeHashes: number[];

    groupName: string;
  }

  export interface DestinyTalentNodeCategory {
    identifier: string;

    isLoreDriven: boolean;

    displayProperties: DestinyDisplayPropertiesDefinition;

    nodeHashes: number[];
  }

  export interface DestinyUnlockEventDefinition {
    frequencyData: DestinyEventFrequencyDataEntry;

    sequenceLastUpdatedUnlockValueHash: number;

    sequenceUnlockValueHash: number;

    newSequenceRewardSiteHash: number;

    unlockEntries: DestinyUnlockEventEntry[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyUnlockEventEntry {
    unlockHash: number;

    selectedValue: DestinyUnlockState;

    clearedValue: DestinyUnlockState;

    unlockValueHash: number;
  }

  export interface DestinyCalendarEventDefinition {
    eventDate: string;

    unlockState: DestinyUnlockState;
  }

  export interface DestinyUnlockDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    calendarEvents: DestinyCalendarEventDefinition[];

    dateRanges: DateRange[];

    isOffer?: boolean;

    isCrm?: boolean;

    unlockType: DestinyUnlockType;

    scope: UnlockScope;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyUnlockValueDefinition {
    aggregationType: UnlockValueAggregationType;

    scope: UnlockValueScope;

    mappingIndex: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyVendorAcceptedItemDefinition {
    acceptedInventoryBucketHash: number;

    destinationInventoryBucketHash: number;
  }

  export interface DestinyVendorDefinition {
    displayProperties: DestinyVendorDisplayPropertiesDefinition;

    vendorProgressionType: DestinyVendorProgressionType;

    buyString: string;

    sellString: string;

    vendorContentsId: string;

    displayItemHash: number;

    inhibitBuying: boolean;

    inhibitSelling: boolean;

    factionHash: number;

    resetIntervalMinutes: number;

    resetOffsetMinutes: number;

    failureStrings: string[];

    unlockRanges: DateRange[];

    unlockHashes: number[];

    vendorIdentifier: string;

    vendorPortrait: string;

    vendorBanner: string;

    enabled: boolean;

    visible: boolean;

    vendorSubcategoryIdentifier: string;

    consolidateCategories: boolean;

    unlockValueHash: number;

    actions: DestinyVendorActionDefinition[];

    categories: DestinyVendorCategoryEntryDefinition[];

    originalCategories: DestinyVendorCategoryEntryDefinition[];

    displayCategories: DestinyDisplayCategoryDefinition[];

    interactions: DestinyVendorInteractionDefinition[];

    inventoryFlyouts: DestinyVendorInventoryFlyoutDefinition[];

    itemList: DestinyVendorItemDefinition[];

    services: DestinyVendorServiceDefinition[];

    acceptedItems: DestinyVendorAcceptedItemDefinition[];

    returnWithVendorRequest: boolean;

    locations: DestinyVendorLocationDefinition[];

    groups: DestinyVendorGroupReference[];

    seasonalRankUnlockExpression: DestinyUnlockExpressionDefinition;

    ignoreSaleItemHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyVendorDisplayPropertiesDefinition {
    largeIcon: string;

    subtitle: string;

    originalIcon: string;

    requirementsDisplay: DestinyVendorRequirementDisplayEntryDefinition[];

    smallTransparentIcon: string;

    mapIcon: string;

    largeTransparentIcon: string;

    description: string;

    name: string;

    icon: string;

    iconSequences: DestinyIconSequenceDefinition[];

    highResIcon: string;

    hasIcon: boolean;
  }

  export interface DestinyVendorRequirementDisplayEntryDefinition {
    icon: string;

    name: string;

    source: string;

    type: string;
  }

  export interface DestinyVendorActionDefinition {
    description: string;

    executeSeconds: number;

    icon: string;

    name: string;

    verb: string;

    isPositive: boolean;

    actionId: string;

    actionHash: number;

    requirements: DestinyVendorActionRequirementDefinition[];

    autoPerformAction: boolean;
  }

  export interface DestinyVendorActionRequirementDefinition {
    requirementUnlockExpression: DestinyUnlockExpressionDefinition;

    materialRequirementHash?: number;
  }

  export interface DestinyVendorCategoryEntryDefinition {
    categoryIndex: number;

    categoryId: string;

    sortValue: number;

    categoryHash: number;

    quantityAvailable: number;

    showUnavailableItems: boolean;

    hideIfNoCurrency: boolean;

    hideFromRegularPurchase: boolean;

    buyStringOverride: string;

    disabledDescription: string;

    displayTitle: string;

    overlay: DestinyVendorCategoryOverlayDefinition;

    vendorItemIndexes: number[];

    isPreview: boolean;

    isDisplayOnly: boolean;

    resetIntervalMinutesOverride: number;

    resetOffsetMinutesOverride: number;
  }

  export interface DestinyVendorCategoryOverlayDefinition {
    choiceDescription: string;

    description: string;

    icon: string;

    title: string;

    currencyItemHash?: number;
  }

  export interface DestinyDisplayCategoryDefinition {
    index: number;

    identifier: string;

    displayCategoryHash: number;

    displayProperties: DestinyDisplayPropertiesDefinition;

    displayInBanner: boolean;

    progressionHash?: number;

    sortOrder: VendorDisplayCategorySortOrder;

    displayStyleHash?: number;

    displayStyleIdentifier: string;
  }

  export interface DestinyVendorInteractionDefinition {
    interactionIndex: number;

    requiredUnlockExpression: DestinyUnlockExpressionDefinition;

    replies: DestinyVendorInteractionReplyDefinition[];

    vendorCategoryIndex: number;

    questlineItemHash: number;

    sackInteractionList: DestinyVendorInteractionSackEntryDefinition[];

    uiInteractionType: number;

    interactionType: VendorInteractionType;

    rewardBlockLabel: string;

    rewardVendorCategoryIndex: number;

    flavorLineOne: string;

    flavorLineTwo: string;

    headerDisplayProperties: DestinyDisplayPropertiesDefinition;

    instructions: string;
  }

  export interface DestinyVendorInteractionReplyDefinition {
    requiredUnlockExpression: DestinyUnlockExpressionDefinition;

    itemRewardsSelection: DestinyVendorInteractionRewardSelection;

    rewardSiteHash: number;

    reply: string;

    replyType: DestinyVendorReplyType;
  }

  export interface DestinyVendorInteractionSackEntryDefinition {
    sackType: number;
  }

  export interface DestinyVendorInventoryFlyoutDefinition {
    lockedDescription: string;

    displayProperties: DestinyDisplayPropertiesDefinition;

    buckets: DestinyVendorInventoryFlyoutBucketDefinition[];

    flyoutId: number;

    suppressNewness: boolean;

    unlockExpression: DestinyUnlockExpressionDefinition;

    equipmentSlotHash?: number;
  }

  export interface DestinyVendorInventoryFlyoutBucketDefinition {
    collapsible: boolean;

    inventoryBucketHash: number;

    sortItemsBy: DestinyItemSortType;
  }

  export interface DestinyVendorItemDefinition {
    vendorItemIndex: number;

    itemHash: number;

    quantity: number;

    failureIndexes: number[];

    priceOverrideEnabled: boolean;

    priceOverrideList: DestinyVendorItemQuantity[];

    currencies: DestinyVendorItemQuantity[];

    purchaseUnlockExpressions: DestinyUnlockExpressionDefinition[];

    refundPolicy: DestinyVendorItemRefundPolicy;

    refundTimeLimit: number;

    rewardAdjustorPointerHash: number;

    creationLevels: DestinyItemCreationEntryLevelDefinition[];

    displayCategoryIndex: number;

    seedOverride: number;

    categoryIndex: number;

    originalCategoryIndex: number;

    weight: number;

    minimumLevel: number;

    maximumLevel: number;

    visibleRequiredUnlockExpressions: DestinyUnlockExpressionDefinition[];

    licenseUnlockHash: number;

    action: DestinyVendorSaleItemActionBlockDefinition;

    displayCategory: string;

    inventoryBucketHash: number;

    visibilityScope: DestinyGatingScope;

    purchasableScope: DestinyGatingScope;

    exclusivity: BungieMembershipType;

    isOffer?: boolean;

    isCrm?: boolean;

    purchaseUnlockExpressionDisplayStrings: string[];

    itemAugments: DestinyVendorItemAugmentDefinition[];

    sortValue: number;

    expirationTooltip: string;

    redirectToSaleIndexes: number[];

    rewardSiteHash?: number;

    socketOverrides: DestinyVendorItemSocketOverride[];

    unpurchasable?: boolean;
  }

  export interface DestinyVendorItemQuantity {
    overridePriceUnlockExpression: DestinyUnlockExpressionDefinition;

    scalarDenominator: number;

    scalarValueUnlockExpression: DestinyUnlockExpressionDefinition;

    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;

    uiOnlyGatingUnlockExpressionMappingHash?: number;

    uiOnlyGatingUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyItemCreationEntryLevelDefinition {
    level: number;
  }

  export interface DestinyVendorSaleItemActionBlockDefinition {
    executeSeconds: number;

    isPositive: boolean;
  }

  export interface DestinyVendorItemAugmentDefinition {
    uiItemAugmentStyleName: string;

    uiItemAugmentStyle: DestinyVendorItemState;

    uiItemAugmentStyleHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyVendorItemSocketOverride {
    singleItemHash?: number;

    randomizedOptionsCount: number;

    socketTypeHash: number;

    rewardSiteHash?: number;

    rewardItemListHash?: number;
  }

  export interface DestinyVendorServiceDefinition {
    name: string;

    requiredUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyVendorGroupReference {
    vendorGroupHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;

    forceToTopUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyVendorGroupDefinition {
    order: number;

    categoryName: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyDisplayPropertiesDefinition {
    description: string;

    name: string;

    icon: string;

    iconSequences: DestinyIconSequenceDefinition[];

    highResIcon: string;

    hasIcon: boolean;

    MissingIconPath: string;
  }

  export interface DestinyIconSequenceDefinition {
    frames: string[];
  }

  export interface DestinyRewardMappingGatedReference {
    rewardMappingHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyIntrinsicUnlockDefinition {
    unlockHash: number;

    value: DestinyUnlockState;
  }

  export interface DestinyBitVector {
    bits: DestinyBitVectorEntry[];
  }

  export interface DestinyBitVectorEntry {
    element: number;
  }

  export interface DestinyPositionDefinition {
    x: number;

    y: number;

    z: number;
  }

  export interface DateRange {
    start: string;

    end: string;
  }

  export interface DestinyItemQuantity {
    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;

    uiOnlyGatingUnlockExpressionMappingHash?: number;

    uiOnlyGatingUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DyeReference {
    channelHash: number;

    dyeHash: number;
  }

  export interface DestinyEnvironmentLocationMapping {
    locationHash: number;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    activationSource: string;

    itemHash?: number;

    objectiveHash?: number;

    activityHash?: number;
  }

  export interface DestinyColor {
    red: number;

    green: number;

    blue: number;

    alpha: number;
  }

  export interface DestinyDerivedItemCategoryDefinition {
    categoryDescription: string;

    items: DestinyDerivedItemDefinition[];

    categoryIndex: number;
  }

  export interface DestinyDerivedItemDefinition {
    itemHash?: number;

    itemName: string;

    itemDetail: string;

    itemDescription: string;

    iconPath: string;

    vendorItemIndex: number;
  }

  export interface ItemSpawnAttribute {
    statSetIndex: number;

    levelRequired: number;
  }

  export interface ItemSpawnStatSet {
    itemLevel: number;

    quality: number;

    stats: { [key: number]: DestinyInventoryItemStatDefinition };

    minQuality: number;

    maxQuality: number;

    minItemLevel: number;

    maxItemLevel: number;
  }

  export interface DestinyItemPlugDefinition {
    insertionRules: DestinyPlugRuleDefinition[];

    plugCategoryIdentifier: string;

    plugCategoryHash: number;

    onActionRecreateSelf: boolean;

    actionRewardSiteHash: number;

    actionRewardItemOverrideHash: number;

    insertionMaterialRequirementHash: number;

    previewItemOverrideHash: number;

    enabledMaterialRequirementHash: number;

    enabledRules: DestinyPlugRuleDefinition[];

    uiPlugLabel: string;

    plugStyle: PlugUiStyles;

    plugAvailability: PlugAvailabilityMode;

    alternateUiPlugLabel: string;

    alternatePlugStyle: PlugUiStyles;

    alternateUiLabelExpression: DestinyUnlockExpressionDefinition;

    isDummyPlug: boolean;

    parentItemOverride: DestinyParentItemOverride;

    energyCapacity: DestinyEnergyCapacityEntry;

    energyCost: DestinyEnergyCostEntry;

    applyStatsToSocketOwnerItem: boolean;
  }

  export interface DestinyPlugRuleDefinition {
    failureMessage: string;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyParentItemOverride {
    additionalEquipRequirementsDisplayStrings: string[];

    pipIcon: string;

    overrideAcquireUnlockHash?: number;

    overrideAcquireEnabledExpression: DestinyUnlockExpressionDefinition;

    additionalEquipRequirementsExpressions: DestinyUnlockExpressionDefinition[];
  }

  export interface DestinyEnergyCapacityEntry {
    capacityValue: number;

    energyTypeHash: number;

    energyType: DestinyEnergyType;
  }

  export interface DestinyEnergyCostEntry {
    energyCost: number;

    energyTypeHash: number;

    energyType: DestinyEnergyType;
  }

  export interface DestinyInventoryItemLiteDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    tooltipNotifications: DestinyItemTooltipNotification[];

    collectibleHash?: number;

    secondaryIcon: string;

    secondaryOverlay: string;

    secondarySpecial: string;

    backgroundColor: DestinyColor;

    itemTypeName: string;

    itemTypeDisplayName: string;

    uiItemDisplayStyle: string;

    itemTypeAndTierDisplayName: string;

    displaySource: string;

    setData: DestinyItemSetBlockDefinition;

    inventory: DestinyItemInventoryBlockDefinition;

    emblemObjectiveHash?: number;

    equippingBlock: DestinyEquippingBlockDefinition;

    quality: DestinyItemQualityBlockDefinition;

    value: DestinyItemValueBlockDefinition;

    acquireRewardSiteHash: number;

    acquireUnlockHash: number;

    acquireTimestampUnlockValueHash?: number;

    summary: DestinyItemSummaryBlockDefinition;

    talentGrid: DestinyItemTalentGridBlockDefinition;

    perks: DestinyItemPerkEntryDefinition[];

    loreHash?: number;

    summaryItemHash?: number;

    unlocks: DestinyItemUnlockBlockDefinition;

    iconWatermark: string;

    animations: DestinyAnimationReference[];

    allowActions: boolean;

    links: HyperlinkReference[];

    doesPostmasterPullHaveSideEffects: boolean;

    nonTransferrable: boolean;

    itemCategoryHashes: number[];

    specialItemType: SpecialItemType;

    itemType: DestinyItemType;

    itemSubType: DestinyItemSubType;

    classType: DestinyClass;

    breakerType: DestinyBreakerType;

    breakerTypeHash?: number;

    equippable: boolean;

    damageTypeHashes: number[];

    damageTypes: DamageType[];

    defaultDamageType: DamageType;

    defaultDamageTypeHash?: number;

    seasonHash?: number;

    isWrapper: boolean;
  }

  export interface DestinyItemTierTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    infusionProcess: DestinyItemTierTypeInfusionBlock;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyItemTierTypeInfusionBlock {
    baseQualityTransferRatio: number;

    minimumQualityIncrement: number;
  }

  export interface RewardItemReferenceSet {
    sheets: RewardItemSheetReference[];

    maps: RewardItemMappedReference[];

    activities: RewardItemActivityReference[];

    activityItems: RewardItemActivityReference[];

    incidents: RewardItemIncidentReference[];

    actions: RewardItemActionReference[];

    talentNodeActivations: RewardTalentNodeActivationReference[];

    vendors: RewardItemVendorReference[];

    overrideSource: RewardItemOverrideReference;

    spawnAttributes: ItemSpawnAttribute[];

    statSets: ItemSpawnStatSet[];

    aggregates: RewardItemAggregateReference[];

    quests: RewardQuestVendorItemReference[];

    sites: RewardItemSiteReference[];

    resetEntries: RewardItemResetEntryReference[];

    sacks: RewardItemSackEntryReference[];

    begottenItemHashes: number[];
  }

  export interface RewardItemSheetReference {
    sheetHash: number;

    sheetEntryIndex: number;

    itemListHash: number;

    valueIndex: number;

    adjustorHash: number;

    exclusivity: BungieMembershipType;
  }

  export interface RewardItemMappedReference {
    mappingHash: number;

    sheetReferenceIndex: number;

    sourceData: RewardSourceData;

    entryType: RewardMappingEntryType;
  }

  export interface RewardSourceData {
    spawnIndexes: number[];

    isVisible: boolean;

    sourceHashes: number[];
  }

  export interface RewardItemActivityReference {
    activityHash: number;

    mapReferenceIndex: number;

    sourceData: RewardSourceData;
  }

  export interface RewardItemIncidentReference {
    incidentHash: number;

    mapReferenceIndex: number;

    sourceData: RewardSourceData;
  }

  export interface RewardItemActionReference {
    sourceItemHash: number;

    specific: boolean;

    sheetReferenceIndex: number;

    siteReferenceIndex?: number;

    sourceData: RewardSourceData;
  }

  export interface RewardTalentNodeActivationReference {
    talentGridHash: number;

    nodeHash: number;

    stepIndex: number;

    specific: boolean;

    sheetReferenceIndex: number;

    sourceData: RewardSourceData;
  }

  export interface RewardItemVendorReference {
    vendorHash: number;

    vendorItemIndex: number;

    sourceData: RewardSourceData;
  }

  export interface RewardItemOverrideReference {
    sourceData: RewardSourceData;
  }

  export interface RewardItemAggregateReference {
    sourceHash: number;
  }

  export interface RewardQuestVendorItemReference {
    objectiveHash: number;

    interactionIndex: number;

    rewardVendorReferenceIndex: number;
  }

  export interface RewardItemSiteReference {
    rootSiteHash: number;

    siteHash: number;

    sheetReferenceIndex?: number;

    sourceData: RewardSourceData;

    explicitItemHash?: number;
  }

  export interface RewardItemResetEntryReference {
    resetEntryHash: number;

    siteHash: number;

    sourceData: RewardSourceData;
  }

  export interface RewardItemSackEntryReference {
    sackHash: number;

    adjustorHash: number;

    sourceData: RewardSourceData;
  }

  export interface DestinyItemSourceDefinition {
    level: number;

    minQuality: number;

    maxQuality: number;

    minLevelRequired: number;

    maxLevelRequired: number;

    exclusivity: BungieMembershipType;

    computedStats: { [key: number]: DestinyInventoryItemStatDefinition };

    sourceHashes: number[];

    spawnIndexes: any;
  }

  export interface DestinyAnimationReference {
    animName: string;

    animIdentifier: string;

    path: string;
  }

  export interface HyperlinkReference {
    title: string;

    url: string;
  }

  export interface InterpolationPoint {
    value: number;

    weight: number;
  }

  export interface InterpolationPointFloat {
    value: number;

    weight: number;
  }

  export interface DestinyRealStepDefinition {
    activateProvides: DestinyRealStepProvidesEntry[];

    activateRequires: DestinyRealStepRequiresEntry;

    binarySwapRequires: DestinyRealStepSwapRequiresEntry;

    activateResponse: DestinyRealStepActivateResponseEntry;

    visiblity: DestinyRealStepVisibilityEntry;
  }

  export interface DestinyRealStepProvidesEntry {
    abilityList: DestinyRealStepAbilityEntry[];

    statList: DestinyRealStepStatEntry[];

    perkList: number[];

    qualityBonus: number;

    propertiesSettings: TalentNodeStepPropertiesTypes;

    intrinsicUnlockValues: DestinyRealStepUnlockValueEntry[];

    intrinsicUnlocks: DestinyRealStepUnlockEntry[];
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

    expression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyRealStepUnlockEntry {
    unlockHash: number;
  }

  export interface DestinyRealStepRequiresEntry {
    unlockExpressions: DestinyUnlockExpressionDefinition[];

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
    rerollRandomValues: DestinyRealStepRandomValueIndex[];

    rewardSheetHash: number;

    rewardItemHash: number;

    setItemLevel: number;

    setItemQuality: number;

    socketResponse: DestinyRealStepSocketResponseEntry;

    deleteItem: boolean;
  }

  export interface DestinyRealStepRandomValueIndex {
    randomValueIndex: number;
  }

  export interface DestinyRealStepSocketResponseEntry {
    replaceResponses: DestinyRealStepSocketReplaceResponse[];
  }

  export interface DestinyRealStepSocketReplaceResponse {
    socketTypeHash: number;

    plugItemHash: number;
  }

  export interface DestinyRealStepVisibilityEntry {
    unlockExpressions: DestinyUnlockExpressionDefinition[];

    minLevel?: number;

    maxLevel?: number;
  }

  export interface DestinyEventFrequencyDataEntry {
    activeDurationInSeconds: number;

    resetDayOfWeek: any;

    resetStartTimeInSeconds: string;

    firstStartDateInSeconds: string;

    explicitDuration: number;

    periodType: DestinyUnlockEventPeriodType;
  }

  export interface DestinyVendorLocationDefinition {
    unlockExpression: DestinyUnlockExpressionDefinition;

    destinationHash: number;

    backgroundImagePath: string;
  }

  export interface DestinyUnlockCountMappingDefinition {
    expressionsToCount: DestinyUnlockExpressionDefinition[];

    unlockValueHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyUnlockExpressionMappingDefinition {
    expression: DestinyUnlockExpressionDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyTraitDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    displayHint: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyPlugSetDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    reusablePlugItems: DestinyItemSocketEntryPlugItemRandomizedDefinition[];

    isFakePlugSet: boolean;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySocketCategoryDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    uiCategoryStyle: number;

    categoryStyle: DestinySocketCategoryStyle;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySocketTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    insertAction: DestinyInsertPlugActionDefinition;

    plugWhitelist: DestinyPlugWhitelistEntryDefinition[];

    socketCategoryHash: number;

    visibility: DestinySocketVisibility;

    visibilityUnlockExpression: DestinyUnlockExpressionDefinition;

    alwaysRandomizeSockets: boolean;

    isPreviewEnabled: boolean;

    hideDuplicateReusablePlugs: boolean;

    overridesUiAppearance: boolean;

    avoidDuplicatesOnInitialization: boolean;

    currencyScalars: DestinySocketTypeScalarMaterialRequirementEntry[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyInsertPlugActionDefinition {
    actionExecuteSeconds: number;

    actionSoundHash: number;

    isPositiveAction: boolean;

    actionType: SocketTypeActionType;
  }

  export interface DestinyPlugWhitelistEntryDefinition {
    categoryHash: number;

    categoryIdentifier: string;

    reinitializationRewardItemListHash?: number;

    reinitializationPossiblePlugHashes: number[];
  }

  export interface DestinySocketTypeScalarMaterialRequirementEntry {
    currencyItemHash: number;

    scalarValue: number;
  }

  export interface DestinySocialCommendationDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    cardImagePath: string;

    color: DestinyColor;

    displayPriority: number;

    activityGivingLimit: number;

    parentCommendationNodeHash: number;

    parentCommendationNodeIdentifier: string;

    snapshotValueUnlockExpression: DestinyUnlockExpressionDefinition;

    sendingRequirementUnlockExpression: DestinyUnlockExpressionDefinition;

    receivingRequirementUnlockExpression: DestinyUnlockExpressionDefinition;

    valuePredicates: DestinySocialCommendationValuePredicate[];

    displayActivities: DestinyDisplayPropertiesDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySocialCommendationValuePredicate {
    displayProperties: DestinyDisplayPropertiesDefinition;

    recentCommendationWeight: number;

    predicateUnlockExpression: DestinyUnlockExpressionDefinition;

    senderCommendationPointsExpression: DestinyUnlockExpressionDefinition;

    receiverCommendationPointsExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinySocialCommendationNodeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    color: DestinyColor;

    tintedIcon: string;

    valueUnlockExpression: DestinyUnlockExpressionDefinition;

    parentCommendationNodeHash: number;

    childCommendationNodeHashes: number[];

    childCommendationHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyEventCardDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    linkRedirectPath: string;

    color: DestinyColor;

    images: DestinyEventCardImages;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    ownershipUnlockFlagHash: number;

    triumphsPresentationNodeHash: number;

    sealPresentationNodeHash: number;

    ticketCurrencyItemHash: number;

    ticketVendorHash: number;

    ticketVendorCategoryId: string;

    ticketVendorCategoryHash: number;

    endTime: string;

    endTimeOverrideUnlockValueHash: number;

    displayEndingSoonUnlockExpression: DestinyUnlockExpressionDefinition;

    uiThemeHash: number;

    upsellDialogList: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
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

  export interface DestinySeasonDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    backgroundImagePath: string;

    seasonNumber: number;

    startDate?: string;

    endDate?: string;

    seasonPassHash?: number;

    seasonPassProgressionHash?: number;

    artifactItemHash?: number;

    sealPresentationNodeHash?: number;

    startTimeInSeconds: string;

    startTimeOverrideUnlockValueHash?: number;

    acts: DestinySeasonActDefinition[];

    seasonalChallengesPresentationNodeHash?: number;

    memorializedBonusUnlockValueHash?: number;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    clanPerksActiveUnlockExpression: DestinyUnlockExpressionDefinition;

    seasonPassUnlockHash: number;

    seasonPassOwnershipExpression: DestinyUnlockExpressionDefinition;

    seasonEndingSoonUnlockExpression: DestinyUnlockExpressionDefinition;

    preview: DestinySeasonPreviewDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySeasonActDefinition {
    displayName: string;

    startTime: string;

    rankCount: number;
  }

  export interface DestinySeasonPreviewDefinition {
    description: string;

    linkPath: string;

    videoLink: string;

    images: DestinySeasonPreviewImageDefinition[];
  }

  export interface DestinySeasonPreviewImageDefinition {
    thumbnailImage: string;

    highResImage: string;
  }

  export interface DestinySeasonPassDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    rewardProgressionHash: number;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    prestigeProgressionHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySackRewardItemListDefinition {
    entries: DestinySackRewardItemListEntryDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinySackRewardItemListEntryDefinition {
    alternateData: DestinySackAlternateEntryDefinition[];

    categoryLabelHash: number;

    categoryWeight: number;

    itemHash: number;

    quantity: number;

    redirectSackItemListHash: number;

    rewardSelectorLabelHash: number;

    rewardSelectorWeight: number;

    creationLevel: number;

    rewardAdjustorPointerHash: number;

    summaryItemHash: number;

    visibleUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinySackAlternateEntryDefinition {
    unlockExpression: DestinyUnlockExpressionDefinition;

    alternateItemHash: number;

    alternateCategoryWeight: number;

    alternateRewardSelectorWeight: number;
  }

  export interface DestinyRewardAdjusterPointerDefinition {
    adjusterHash?: number;

    adjusterSchema: string;

    adjusterType: DestinyRewardAdjusterType;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRewardAdjusterProgressionMapDefinition {
    progressionHash?: number;

    isAdditive: boolean;

    curve: DestinyProgressionMappingCurvePoint[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyProgressionMappingCurvePoint {
    progressionLevel: number;

    outputLevelMax: number;

    outputLevelMin: number;

    rollBiasPower: number;

    enabledUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyReportReasonCategoryDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    reasons: { [key: number]: DestinyReportReasonDefinition };

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyReportReasonDefinition {
    reasonHash: number;

    displayProperties: DestinyDisplayPropertiesDefinition;
  }

  export interface DestinyRecordDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    scope: DestinyScope;

    presentationInfo: DestinyPresentationChildBlock;

    loreHash?: number;

    objectiveHashes: number[];

    recordValueStyle: DestinyRecordValueStyle;

    forTitleGilding: boolean;

    shouldShowLargeIcons: boolean;

    titleInfo: DestinyRecordTitleBlock;

    completionInfo: DestinyRecordCompletionBlock;

    stateInfo: SchemaRecordStateBlock;

    requirements: DestinyPresentationNodeRequirementsBlock;

    expirationInfo: DestinyRecordExpirationBlock;

    intervalInfo: DestinyRecordIntervalBlock;

    rewardItems: DestinyItemQuantity[];

    intervalRewards: DestinyRecordIntervalRewards[];

    anyRewardHasConditionalVisibility: boolean;

    recordTypeName: string;

    presentationNodeType: DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyRecordTitleBlock {
    hasTitle: boolean;

    titlesByGender: { [key: string]: string };

    titlesByGenderHash: { [key: number]: string };

    masculineTitle: string;

    feminineTitle: string;

    gildingTrackingRecordHash?: number;
  }

  export interface DestinyRecordCompletionBlock {
    completionRewardSiteHash?: number;

    partialCompletionObjectiveCountThreshold: number;

    ScoreValue: number;

    shouldFireToast: boolean;

    toastStyle: DestinyRecordToastStyle;
  }

  export interface SchemaRecordStateBlock {
    featuredPriority: number;

    obscuredName: string;

    obscuredDescription: string;

    featuredExpression: DestinyUnlockExpressionDefinition;

    obscuredExpression: DestinyUnlockExpressionDefinition;

    rewardAvailableExpression: DestinyUnlockExpressionDefinition;

    completeUnlockHash: number;

    claimedUnlockHash: number;

    completedCounterUnlockValueHash: number;

    invisibleExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyRecordExpirationBlock {
    hasExpiration: boolean;

    description: string;

    icon: string;
  }

  export interface DestinyRecordIntervalBlock {
    intervalObjectives: DestinyRecordIntervalObjective[];

    intervalRewards: DestinyRecordIntervalRewards[];

    originalObjectiveArrayInsertionIndex: number;

    isIntervalVersionedFromNormalRecord: boolean;

    intervalClaimedUnlockValueHash?: number;
  }

  export interface DestinyRecordIntervalObjective {
    intervalObjectiveHash: number;

    intervalScoreValue: number;

    intervalClaimedRewardSiteHash?: number;
  }

  export interface DestinyRecordIntervalRewards {
    intervalRewardItems: DestinyItemQuantity[];
  }

  export interface DestinyPresentationChildBlock {
    presentationNodeType: DestinyPresentationNodeType;

    parentPresentationNodeHashes: number[];

    displayStyle: DestinyPresentationDisplayStyle;
  }

  export interface DestinyPresentationNodeRequirementsBlock {
    entitlementUnavailableMessage: string;

    entitlementOwnedExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyPresentationNodeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    originalIcon: string;

    rootViewIcon: string;

    nodeType: DestinyPresentationNodeType;

    isSeasonal: boolean;

    scope: DestinyScope;

    objectiveHash?: number;

    completionRecordHash?: number;

    children: DestinyPresentationNodeChildrenBlock;

    displayStyle: DestinyPresentationDisplayStyle;

    screenStyle: DestinyPresentationScreenStyle;

    requirements: DestinyPresentationNodeRequirementsBlock;

    disableChildSubscreenNavigation: boolean;

    visibilityExpression: DestinyUnlockExpressionDefinition;

    obscuredExpression: DestinyUnlockExpressionDefinition;

    categoryScoreUnlockValueHash: number;

    maxCategoryRecordScore: number;

    presentationNodeType: DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyPresentationNodeChildrenBlock {
    presentationNodes: DestinyPresentationNodeChildEntry[];

    collectibles: DestinyPresentationNodeCollectibleChildEntry[];

    records: DestinyPresentationNodeRecordChildEntry[];

    metrics: DestinyPresentationNodeMetricChildEntry[];

    craftables: DestinyPresentationNodeCraftableChildEntry[];
  }

  export interface DestinyPresentationNodeChildEntry {
    presentationNodeHash: number;

    selectionExpression: DestinyUnlockExpressionDefinition;

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

  export interface DestinyProgressionLevelRequirementDefinition {
    requirementCurve: InterpolationPointFloat[];

    progressionHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyPowerCapDefinition {
    powerCap: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyEntitlementOfferDefinition {
    offerIdentifier: string;

    offerKey: string;

    grantedUnlocks: DestinyIntrinsicUnlockDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyMilestoneDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    displayPreference: DestinyMilestoneDisplayPreference;

    image: string;

    milestoneType: DestinyMilestoneType;

    recruitable: boolean;

    friendlyName: string;

    showInExplorer: boolean;

    showInMilestones: boolean;

    explorePrioritizesActivityImage: boolean;

    availableUnlockExpression: DestinyUnlockExpressionDefinition;

    activeUnlockExpressions: DestinyUnlockExpressionDefinition[];

    eventFrequencyDataSet: DestinyEventFrequencyDataEntry[];

    resetFrequencyData: DestinyResetFrequencyEntry;

    explicitDateRanges: DateRange[];

    hasPredictableDates: boolean;

    weeklyResetSiteHash?: number;

    dailyResetSiteHash?: number;

    quests: { [key: number]: DestinyMilestoneQuestDefinition };

    rewards: { [key: number]: DestinyMilestoneRewardCategoryDefinition };

    vendorsDisplayTitle: string;

    vendors: DestinyMilestoneVendorDefinition[];

    values: { [key: string]: DestinyMilestoneValueDefinition };

    isInGameMilestone: boolean;

    activities: DestinyMilestoneChallengeActivityDefinition[];

    defaultOrder: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyMilestoneQuestDefinition {
    questItemHash: number;

    displayProperties: DestinyDisplayPropertiesDefinition;

    overrideImage: string;

    activeUnlockHash?: number;

    availableUnlockHash?: number;

    activeUnlockExpressionHash?: number;

    availableUnlockExpressionHash?: number;

    questRewards: DestinyMilestoneQuestRewardsDefinition;

    activities: { [key: number]: DestinyMilestoneActivityDefinition };

    destinationHash?: number;

    completeTrackingUnlockValue?: number;

    trackingUnlockValueHash: number;
  }

  export interface DestinyMilestoneQuestRewardsDefinition {
    items: DestinyMilestoneQuestRewardItem[];
  }

  export interface DestinyMilestoneQuestRewardItem {
    vendorHash?: number;

    vendorItemIndex?: number;

    itemHash: number;

    itemInstanceId?: string;

    quantity: number;

    hasConditionalVisibility: boolean;

    uiOnlyGatingUnlockExpressionMappingHash?: number;

    uiOnlyGatingUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyMilestoneActivityDefinition {
    conceptualActivityHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;

    variants: { [key: number]: DestinyMilestoneActivityVariantDefinition };
  }

  export interface DestinyMilestoneActivityVariantDefinition {
    activityHash: number;

    order: number;
  }

  export interface DestinyMilestoneRewardCategoryDefinition {
    categoryHash: number;

    categoryIdentifier: string;

    displayProperties: DestinyDisplayPropertiesDefinition;

    rewardEntries: { [key: number]: DestinyMilestoneRewardEntryDefinition };

    order: number;
  }

  export interface DestinyMilestoneRewardEntryDefinition {
    rewardEntryHash: number;

    rewardEntryIdentifier: string;

    items: DestinyItemQuantity[];

    vendorHash?: number;

    displayProperties: DestinyDisplayPropertiesDefinition;

    order: number;

    earnedUnlockHash: number;

    redeemedUnlockHash: number;

    objectiveHash?: number;
  }

  export interface DestinyMilestoneVendorDefinition {
    vendorHash: number;

    previewItemHash?: number;

    unlockHash?: number;

    categoryIndex?: number;
  }

  export interface DestinyMilestoneValueDefinition {
    key: string;

    displayProperties: DestinyDisplayPropertiesDefinition;

    unlockValueHash: number;
  }

  export interface DestinyMilestoneChallengeActivityDefinition {
    activityHash: number;

    challenges: DestinyMilestoneChallengeDefinition[];

    activityGraphNodes: DestinyMilestoneChallengeActivityGraphNodeEntry[];

    phases: DestinyMilestoneChallengeActivityPhase[];
  }

  export interface DestinyMilestoneChallengeDefinition {
    challengeObjectiveHash: number;

    unlockEventHashes: number[];

    completeUnlockHash: number;
  }

  export interface DestinyMilestoneChallengeActivityGraphNodeEntry {
    activityGraphHash: number;

    activityGraphNodeHash: number;
  }

  export interface DestinyMilestoneChallengeActivityPhase {
    phaseHash: number;

    phaseCompleteUnlockHash: number;
  }

  export interface DestinyResetFrequencyEntry {
    period: DestinyUnlockEventPeriodType;

    resetOffsetInSeconds: string;
  }

  export interface DestinyMetricDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    trackingObjectiveHash: number;

    invisibleUnlockExpression: DestinyUnlockExpressionDefinition;

    lowerValueIsBetter: boolean;

    toastOnObjectiveComplete: boolean;

    presentationNodeType: DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLoreDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    subtitle: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLoadoutColorDefinition {
    colorImagePath: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLoadoutConstantsDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    whiteIconImagePath: string;

    blackIconImagePath: string;

    loadoutCountPerCharacter: number;

    loadoutPreviewFilterOutSocketCategoryHashes: number[];

    loadoutPreviewFilterOutSocketTypeHashes: number[];

    loadoutNameHashes: number[];

    loadoutIconHashes: number[];

    loadoutColorHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLoadoutIconDefinition {
    iconImagePath: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyLoadoutNameDefinition {
    name: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyGuardianRankConstantsDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    rankCount: number;

    guardianRankHashes: number[];

    rootNodeHash: number;

    iconBackgrounds: DestinyGuardianRankIconBackgroundsDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyGuardianRankIconBackgroundsDefinition {
    backgroundEmptyBorderedImagePath: string;

    backgroundEmptyBlueGradientBorderedImagePath: string;

    backgroundFilledBlueBorderedImagePath: string;

    backgroundFilledBlueGradientBorderedImagePath: string;

    backgroundFilledBlueLowAlphaImagePath: string;

    backgroundFilledBlueMediumAlphaImagePath: string;

    backgroundFilledGrayMediumAlphaBorderedImagePath: string;

    backgroundFilledGrayHeavyAlphaBorderedImagePath: string;

    backgroundFilledWhiteMediumAlphaImagePath: string;

    backgroundFilledWhiteImagePath: string;

    backgroundPlateWhiteImagePath: string;

    backgroundPlateBlackImagePath: string;

    backgroundPlateBlackAlphaImagePath: string;
  }

  export interface DestinyGuardianRankDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    rankNumber: number;

    presentationNodeHash: number;

    foregroundImagePath: string;

    overlayImagePath: string;

    overlayMaskImagePath: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderActivityGraphDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    color: DestinyColor;

    isPlayerElectedDifficultyNode: boolean;

    parentHash?: number;

    children: number[];

    selfAndAllDescendants: DestinyBitVector;

    selfAndAllDescendantHashes: number[];

    relatedActivitySetHashes: number[];

    specificActivitySetHash?: number;

    relatedActivityHashes: number[];

    relatedDirectorNodes: DestinyActivityGraphReference[];

    relatedInteractableActivities: DestinyActivityInteractableReference[];

    relatedEnvironmentConstantsLocationIndices: number[];

    relatedLocationHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityGraphReference {
    activityGraphHash: number;
  }

  export interface DestinyActivityInteractableReference {
    activityInteractableHash: number;

    activityInteractableElementIndex: number;
  }

  export interface DestinyFireteamFinderActivitySetDefinition {
    maximumPartySize: number;

    options: DestinyBitVector;

    optionHashes: number[];

    labels: DestinyBitVector;

    labelHashes: number[];

    graphReferences: DestinyBitVector;

    activityGraphHashes: number[];

    activities: DestinyBitVector;

    activityHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderConstantsDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    fireteamFinderActivityGraphRootCategoryHashes: number[];

    allFireteamFinderActivityHashes: number[];

    guardianOathDisplayProperties: DestinyDisplayPropertiesDefinition;

    guardianOathTenets: DestinyDisplayPropertiesDefinition[];

    guardianOathConfirmedUnlockFlagHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderLabelDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    originalName: string;

    requirement: DestinyFireteamFinderLabelRequirement;

    descendingSortPriority: number;

    groupHash: number;

    allowInFields: FireteamFinderLabelFieldType;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderLabelRequirement {
    unlockExpression: DestinyUnlockExpressionDefinition;

    displayIcon: string;

    displayString: string;

    dialogSet: number;
  }

  export interface DestinyFireteamFinderLabelGroupDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    descendingSortPriority: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderOptionDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    descendingSortPriority: number;

    groupHash: number;

    codeOptionType: FireteamFinderCodeOptionType;

    availability: FireteamFinderOptionAvailability;

    visibility: FireteamFinderOptionVisibility;

    uiDisplayStyle: string;

    creatorSettings: DestinyFireteamFinderOptionCreatorSettings;

    searcherSettings: DestinyFireteamFinderOptionSearcherSettings;

    values: DestinyFireteamFinderOptionValues;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyFireteamFinderOptionCreatorSettings {
    control: DestinyFireteamFinderOptionSettingsControl;
  }

  export interface DestinyFireteamFinderOptionSettingsControl {
    type: FireteamFinderOptionControlType;

    minSelectedItems: number;

    maxSelectedItems: number;
  }

  export interface DestinyFireteamFinderOptionSearcherSettings {
    control: DestinyFireteamFinderOptionSettingsControl;

    searchFilterType: FireteamFinderOptionSearchFilterType;
  }

  export interface DestinyFireteamFinderOptionValues {
    optionalNull: DestinyDisplayPropertiesDefinition;

    optionalFormatString: string;

    displayFormatType: FireteamFinderOptionDisplayFormat;

    type: FireteamFinderOptionValueProviderType;

    valueDefinitions: DestinyFireteamFinderOptionValueDefinition[];
  }

  export interface DestinyFireteamFinderOptionValueDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    valueOriginalSigned?: number;

    value: number;

    flags: FireteamFinderOptionValueFlags;
  }

  export interface DestinyFireteamFinderOptionGroupDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    descendingSortPriority: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyEnergyTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    transparentIconPath: string;

    showIcon: boolean;

    enumValue: DestinyEnergyType;

    capacityStatHash?: number;

    costStatHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityGraphDefinition {
    nodes: DestinyActivityGraphNodeDefinition[];

    artElements: DestinyActivityGraphArtElementDefinition[];

    connections: DestinyActivityGraphConnectionDefinition[];

    displayObjectives: DestinyActivityGraphDisplayObjectiveDefinition[];

    displayProgressions: DestinyActivityGraphDisplayProgressionDefinition[];

    internalPageDescription: string;

    internalPageTitle: string;

    linkedGraphs: DestinyLinkedGraphDefinition[];

    uiScreen: number;

    timerElements: DestinyTimerElementDefinition[];

    ignoreForMilestones: boolean;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityGraphNodeDefinition {
    nodeId: number;

    identifier: string;

    overrideDisplay: DestinyDisplayPropertiesDefinition;

    position: DestinyPositionDefinition;

    featuringStates: DestinyActivityGraphNodeFeaturingStateDefinition[];

    activities: DestinyActivityGraphNodeActivityDefinition[];

    states: DestinyActivityGraphNodeStateEntry[];

    uiActivityTypeOverrideHash: number;

    uiStyleHash: number;
  }

  export interface DestinyActivityGraphNodeFeaturingStateDefinition {
    highlightType: ActivityGraphNodeHighlightType;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyActivityGraphNodeActivityDefinition {
    nodeActivityId: number;

    activityHash: number;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyActivityGraphNodeStateEntry {
    state: DestinyGraphNodeState;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyActivityGraphArtElementDefinition {
    position: DestinyPositionDefinition;

    unlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyActivityGraphConnectionDefinition {
    sourceNodeHash: number;

    destNodeHash: number;
  }

  export interface DestinyActivityGraphDisplayObjectiveDefinition {
    id: number;

    objectiveHash: number;
  }

  export interface DestinyActivityGraphDisplayProgressionDefinition {
    id: number;

    progressionHash: number;
  }

  export interface DestinyLinkedGraphDefinition {
    description: string;

    name: string;

    unlockExpression: DestinyUnlockExpressionDefinition;

    linkedGraphId: number;

    linkedGraphs: DestinyLinkedGraphEntryDefinition[];

    overview: string;
  }

  export interface DestinyLinkedGraphEntryDefinition {
    activityGraphHash: number;

    requiredUnlockExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyTimerElementDefinition {
    position: DestinyPositionDefinition;

    unlockExpression: DestinyUnlockExpressionDefinition;

    expireSecondsSinceEpoch: number;

    label: string;
  }

  export interface DestinyCollectibleDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    scope: DestinyScope;

    sourceString: string;

    sourceHash?: number;

    itemHash: number;

    acquisitionInfo: DestinyCollectibleAcquisitionBlock;

    stateInfo: DestinyCollectibleStateBlock;

    presentationInfo: DestinyPresentationChildBlock;

    presentationNodeType: DestinyPresentationNodeType;

    traitIds: string[];

    traitHashes: number[];

    parentNodeHashes: number[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyCollectibleAcquisitionBlock {
    acquireMaterialRequirementHash?: number;

    acquireTimestampUnlockValueHash?: number;

    acquireRewardSiteHash?: number;

    acquireOverrideRewardAdjustorHash?: number;

    runOnlyAcquisitionRewardSite: boolean;
  }

  export interface DestinyCollectibleStateBlock {
    obscuredOverrideItemHash?: number;

    obscuredExpression: DestinyUnlockExpressionDefinition;

    acquiredExpression: DestinyUnlockExpressionDefinition;

    invisibleExpression: DestinyUnlockExpressionDefinition;

    purchaseInfo: DestinyCollectiblePurchaseBlock;

    requirements: DestinyPresentationNodeRequirementsBlock;
  }

  export interface DestinyCollectiblePurchaseBlock {
    purchaseDisabledReason: string;

    disablePurchasing: boolean;

    purchaseDisabledExpression: DestinyUnlockExpressionDefinition;
  }

  export interface DestinyChecklistDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    viewActionString: string;

    scope: DestinyScope;

    entries: DestinyChecklistEntryDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyChecklistEntryDefinition {
    hash: number;

    unlockHash?: number;

    unlockExpression: DestinyUnlockExpressionDefinition;

    displayProperties: DestinyDisplayPropertiesDefinition;

    destinationHash?: number;

    locationHash?: number;

    bubbleHash?: number;

    activityHash?: number;

    itemHash?: number;

    vendorHash?: number;

    vendorInteractionIndex?: number;

    scope: DestinyScope;
  }

  export interface DestinyCharacterCustomizationCategoryDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyCharacterCustomizationOptionDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    genderHash: number;

    raceHash: number;

    decalColorOptions: DestinyCharacterCustomizationCollectionUInt32;

    decalOptions: DestinyCharacterCustomizationCollectionInt32;

    eyeColorOptions: DestinyCharacterCustomizationCollectionUInt32;

    faceOptionCinematicHostPatternIds: number[];

    faceOptions: DestinyCharacterCustomizationCollectionUInt32;

    featureColorOptions: DestinyCharacterCustomizationCollectionListUInt32;

    featureOptions: DestinyCharacterCustomizationCollectionInt32;

    hairColorOptions: DestinyCharacterCustomizationCollectionListUInt32;

    hairOptions: DestinyCharacterCustomizationCollectionInt32;

    helmetPreferences: DestinyCharacterCustomizationCollectionDestinyHelmetPreferenceType;

    lipColorOptions: DestinyCharacterCustomizationCollectionUInt32;

    personalityOptions: DestinyCharacterCustomizationCollectionUInt32;

    skinColorOptions: DestinyCharacterCustomizationCollectionUInt32;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyCharacterCustomizationCollectionUInt32 {
    customizationCategoryHash: number;

    displayName: string;

    options: DestinyCharacterCustomizationCollectionOptionUInt32[];
  }

  export interface DestinyCharacterCustomizationCollectionOptionUInt32 {
    displayProperties: DestinyDisplayPropertiesDefinition;

    value: number;
  }

  export interface DestinyCharacterCustomizationCollectionInt32 {
    customizationCategoryHash: number;

    displayName: string;

    options: DestinyCharacterCustomizationCollectionOptionInt32[];
  }

  export interface DestinyCharacterCustomizationCollectionOptionInt32 {
    displayProperties: DestinyDisplayPropertiesDefinition;

    value: number;
  }

  export interface DestinyCharacterCustomizationCollectionListUInt32 {
    customizationCategoryHash: number;

    displayName: string;

    options: DestinyCharacterCustomizationCollectionOptionListUInt32[];
  }

  export interface DestinyCharacterCustomizationCollectionOptionListUInt32 {
    displayProperties: DestinyDisplayPropertiesDefinition;

    value: number[];
  }

  export interface DestinyCharacterCustomizationCollectionDestinyHelmetPreferenceType {
    customizationCategoryHash: number;

    displayName: string;

    options: DestinyCharacterCustomizationCollectionOptionDestinyHelmetPreferenceType[];
  }

  export interface DestinyCharacterCustomizationCollectionOptionDestinyHelmetPreferenceType {
    displayProperties: DestinyDisplayPropertiesDefinition;

    value: DestinyHelmetPreferenceType;
  }

  export interface DestinyBreakerTypeDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    enumValue: DestinyBreakerType;

    unlockHash: number;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArtifactDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    translationBlock: DestinyItemTranslationBlockDefinition;

    tiers: DestinyArtifactTierDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyArtifactTierDefinition {
    tierHash: number;

    displayTitle: string;

    progressRequirementMessage: string;

    items: DestinyArtifactTierItemDefinition[];

    minimumUnlockPointsUsedRequirement: number;
  }

  export interface DestinyArtifactTierItemDefinition {
    itemHash: number;

    activeUnlockExpression: DestinyUnlockExpressionDefinition;

    visibleUnlockExpressions: DestinyUnlockExpressionDefinition[];
  }

  export interface DestinyActivityModifierDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    displayInNavMode: boolean;

    displayInActivitySelection: boolean;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityInteractableDefinition {
    entries: DestinyActivityInteractableEntryDefinition[];

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }

  export interface DestinyActivityInteractableEntryDefinition {
    unlockExpression: DestinyUnlockExpressionDefinition;

    activityHash: number;
  }

  export interface DestinyAchievementDefinition {
    displayProperties: DestinyDisplayPropertiesDefinition;

    unlockHash?: number;

    acccumulatorHash?: number;

    acccumulatorThreshold: number;

    platformIndex: number;

    completionToastId: string;

    boundToRelease: string;

    hash: number;

    index: number;

    contentIdentifier: string;

    redacted: boolean;

    blacklisted: boolean;
  }
}
export interface DestinyWorldDefinitionsGenerated {
  DestinyAchievementDefinition?: {
    [key: string]: DestinyDefinitions.DestinyAchievementDefinition;
  };
  DestinyActivityDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityDefinition;
  };
  DestinyActivityGraphDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityGraphDefinition;
  };
  DestinyActivityInteractableDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityInteractableDefinition;
  };
  DestinyActivityModeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityModeDefinition;
  };
  DestinyActivityModifierDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityModifierDefinition;
  };
  DestinyActivityTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyActivityTypeDefinition;
  };
  DestinyArtDyeChannelDefinition?: {
    [key: string]: DestinyDefinitions.DestinyArtDyeChannelDefinition;
  };
  DestinyArtDyeReferenceDefinition?: {
    [key: string]: DestinyDefinitions.DestinyArtDyeReferenceDefinition;
  };
  DestinyArtifactDefinition?: {
    [key: string]: DestinyDefinitions.DestinyArtifactDefinition;
  };
  DestinyBondDefinition?: {
    [key: string]: DestinyDefinitions.DestinyBondDefinition;
  };
  DestinyBreakerTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyBreakerTypeDefinition;
  };
  DestinyCharacterCustomizationCategoryDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyCharacterCustomizationCategoryDefinition;
  };
  DestinyCharacterCustomizationOptionDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyCharacterCustomizationOptionDefinition;
  };
  DestinyChecklistDefinition?: {
    [key: string]: DestinyDefinitions.DestinyChecklistDefinition;
  };
  DestinyClassDefinition?: {
    [key: string]: DestinyDefinitions.DestinyClassDefinition;
  };
  DestinyCollectibleDefinition?: {
    [key: string]: DestinyDefinitions.DestinyCollectibleDefinition;
  };
  DestinyDamageTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyDamageTypeDefinition;
  };
  DestinyDestinationDefinition?: {
    [key: string]: DestinyDefinitions.DestinyDestinationDefinition;
  };
  DestinyEnergyTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyEnergyTypeDefinition;
  };
  DestinyEntitlementOfferDefinition?: {
    [key: string]: DestinyDefinitions.DestinyEntitlementOfferDefinition;
  };
  DestinyEquipmentSlotDefinition?: {
    [key: string]: DestinyDefinitions.DestinyEquipmentSlotDefinition;
  };
  DestinyEventCardDefinition?: {
    [key: string]: DestinyDefinitions.DestinyEventCardDefinition;
  };
  DestinyFactionDefinition?: {
    [key: string]: DestinyDefinitions.DestinyFactionDefinition;
  };
  DestinyFireteamFinderActivityGraphDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition;
  };
  DestinyFireteamFinderActivitySetDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyFireteamFinderActivitySetDefinition;
  };
  DestinyFireteamFinderConstantsDefinition?: {
    [key: string]: DestinyDefinitions.DestinyFireteamFinderConstantsDefinition;
  };
  DestinyFireteamFinderLabelDefinition?: {
    [key: string]: DestinyDefinitions.DestinyFireteamFinderLabelDefinition;
  };
  DestinyFireteamFinderLabelGroupDefinition?: {
    [key: string]: DestinyDefinitions.DestinyFireteamFinderLabelGroupDefinition;
  };
  DestinyFireteamFinderOptionDefinition?: {
    [key: string]: DestinyDefinitions.DestinyFireteamFinderOptionDefinition;
  };
  DestinyFireteamFinderOptionGroupDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyFireteamFinderOptionGroupDefinition;
  };
  DestinyGenderDefinition?: {
    [key: string]: DestinyDefinitions.DestinyGenderDefinition;
  };
  DestinyGuardianRankConstantsDefinition?: {
    [key: string]: DestinyDefinitions.DestinyGuardianRankConstantsDefinition;
  };
  DestinyGuardianRankDefinition?: {
    [key: string]: DestinyDefinitions.DestinyGuardianRankDefinition;
  };
  DestinyInventoryBucketDefinition?: {
    [key: string]: DestinyDefinitions.DestinyInventoryBucketDefinition;
  };
  DestinyInventoryItemDefinition?: {
    [key: string]: DestinyDefinitions.DestinyInventoryItemDefinition;
  };
  DestinyInventoryItemLiteDefinition?: {
    [key: string]: DestinyDefinitions.DestinyInventoryItemLiteDefinition;
  };
  DestinyItemCategoryDefinition?: {
    [key: string]: DestinyDefinitions.DestinyItemCategoryDefinition;
  };
  DestinyItemTierTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyItemTierTypeDefinition;
  };
  DestinyLoadoutColorDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLoadoutColorDefinition;
  };
  DestinyLoadoutConstantsDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLoadoutConstantsDefinition;
  };
  DestinyLoadoutIconDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLoadoutIconDefinition;
  };
  DestinyLoadoutNameDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLoadoutNameDefinition;
  };
  DestinyLocationDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLocationDefinition;
  };
  DestinyLoreDefinition?: {
    [key: string]: DestinyDefinitions.DestinyLoreDefinition;
  };
  DestinyMaterialRequirementSetDefinition?: {
    [key: string]: DestinyDefinitions.DestinyMaterialRequirementSetDefinition;
  };
  DestinyMedalTierDefinition?: {
    [key: string]: DestinyDefinitions.DestinyMedalTierDefinition;
  };
  DestinyMetricDefinition?: {
    [key: string]: DestinyDefinitions.DestinyMetricDefinition;
  };
  DestinyMilestoneDefinition?: {
    [key: string]: DestinyDefinitions.DestinyMilestoneDefinition;
  };
  DestinyNodeStepDefinition?: {
    [key: string]: DestinyDefinitions.DestinyNodeStepDefinition;
  };
  DestinyNodeStepSummaryDefinition?: {
    [key: string]: DestinyDefinitions.DestinyNodeStepSummaryDefinition;
  };
  DestinyObjectiveDefinition?: {
    [key: string]: DestinyDefinitions.DestinyObjectiveDefinition;
  };
  DestinyPlaceDefinition?: {
    [key: string]: DestinyDefinitions.DestinyPlaceDefinition;
  };
  DestinyPlatformBucketMappingDefinition?: {
    [key: string]: DestinyDefinitions.DestinyPlatformBucketMappingDefinition;
  };
  DestinyPlugSetDefinition?: {
    [key: string]: DestinyDefinitions.DestinyPlugSetDefinition;
  };
  DestinyPowerCapDefinition?: {
    [key: string]: DestinyDefinitions.DestinyPowerCapDefinition;
  };
  DestinyPresentationNodeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyPresentationNodeDefinition;
  };
  DestinyProgressionDefinition?: {
    [key: string]: DestinyDefinitions.DestinyProgressionDefinition;
  };
  DestinyProgressionLevelRequirementDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyProgressionLevelRequirementDefinition;
  };
  DestinyProgressionMappingDefinition?: {
    [key: string]: DestinyDefinitions.DestinyProgressionMappingDefinition;
  };
  DestinyRaceDefinition?: {
    [key: string]: DestinyDefinitions.DestinyRaceDefinition;
  };
  DestinyRecordDefinition?: {
    [key: string]: DestinyDefinitions.DestinyRecordDefinition;
  };
  DestinyReportReasonCategoryDefinition?: {
    [key: string]: DestinyDefinitions.DestinyReportReasonCategoryDefinition;
  };
  DestinyRewardAdjusterPointerDefinition?: {
    [key: string]: DestinyDefinitions.DestinyRewardAdjusterPointerDefinition;
  };
  DestinyRewardAdjusterProgressionMapDefinition?: {
    [
      key: string
    ]: DestinyDefinitions.DestinyRewardAdjusterProgressionMapDefinition;
  };
  DestinyRewardSourceDefinition?: {
    [key: string]: DestinyDefinitions.DestinyRewardSourceDefinition;
  };
  DestinySackRewardItemListDefinition?: {
    [key: string]: DestinyDefinitions.DestinySackRewardItemListDefinition;
  };
  DestinySandboxPatternDefinition?: {
    [key: string]: DestinyDefinitions.DestinySandboxPatternDefinition;
  };
  DestinySandboxPerkDefinition?: {
    [key: string]: DestinyDefinitions.DestinySandboxPerkDefinition;
  };
  DestinySeasonDefinition?: {
    [key: string]: DestinyDefinitions.DestinySeasonDefinition;
  };
  DestinySeasonPassDefinition?: {
    [key: string]: DestinyDefinitions.DestinySeasonPassDefinition;
  };
  DestinySocialCommendationDefinition?: {
    [key: string]: DestinyDefinitions.DestinySocialCommendationDefinition;
  };
  DestinySocialCommendationNodeDefinition?: {
    [key: string]: DestinyDefinitions.DestinySocialCommendationNodeDefinition;
  };
  DestinySocketCategoryDefinition?: {
    [key: string]: DestinyDefinitions.DestinySocketCategoryDefinition;
  };
  DestinySocketTypeDefinition?: {
    [key: string]: DestinyDefinitions.DestinySocketTypeDefinition;
  };
  DestinyStatDefinition?: {
    [key: string]: DestinyDefinitions.DestinyStatDefinition;
  };
  DestinyStatGroupDefinition?: {
    [key: string]: DestinyDefinitions.DestinyStatGroupDefinition;
  };
  DestinyTalentGridDefinition?: {
    [key: string]: DestinyDefinitions.DestinyTalentGridDefinition;
  };
  DestinyTalentNodeDefinition?: {
    [key: string]: DestinyDefinitions.DestinyTalentNodeDefinition;
  };
  DestinyTraitDefinition?: {
    [key: string]: DestinyDefinitions.DestinyTraitDefinition;
  };
  DestinyUnlockCountMappingDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockCountMappingDefinition;
  };
  DestinyUnlockDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockDefinition;
  };
  DestinyUnlockEventDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockEventDefinition;
  };
  DestinyUnlockExpressionDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockExpressionDefinition;
  };
  DestinyUnlockExpressionMappingDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockExpressionMappingDefinition;
  };
  DestinyUnlockValueDefinition?: {
    [key: string]: DestinyDefinitions.DestinyUnlockValueDefinition;
  };
  DestinyVendorDefinition?: {
    [key: string]: DestinyDefinitions.DestinyVendorDefinition;
  };
  DestinyVendorGroupDefinition?: {
    [key: string]: DestinyDefinitions.DestinyVendorGroupDefinition;
  };
}
export interface DestinyWorldDefinitionsTypeMap {
  DestinyActivityDefinition?: DestinyDefinitions.DestinyActivityDefinition;
  DestinyActivityModeDefinition?: DestinyDefinitions.DestinyActivityModeDefinition;
  DestinyActivityTypeDefinition?: DestinyDefinitions.DestinyActivityTypeDefinition;
  DestinyBondDefinition?: DestinyDefinitions.DestinyBondDefinition;
  DestinyClassDefinition?: DestinyDefinitions.DestinyClassDefinition;
  DestinyGenderDefinition?: DestinyDefinitions.DestinyGenderDefinition;
  DestinyRaceDefinition?: DestinyDefinitions.DestinyRaceDefinition;
  DestinyDamageTypeDefinition?: DestinyDefinitions.DestinyDamageTypeDefinition;
  DestinyEquipmentSlotDefinition?: DestinyDefinitions.DestinyEquipmentSlotDefinition;
  DestinyFactionDefinition?: DestinyDefinitions.DestinyFactionDefinition;
  DestinyInventoryBucketDefinition?: DestinyDefinitions.DestinyInventoryBucketDefinition;
  DestinyPlatformBucketMappingDefinition?: DestinyDefinitions.DestinyPlatformBucketMappingDefinition;
  DestinyInventoryItemDefinition?: DestinyDefinitions.DestinyInventoryItemDefinition;
  DestinyItemCategoryDefinition?: DestinyDefinitions.DestinyItemCategoryDefinition;
  DestinyDestinationDefinition?: DestinyDefinitions.DestinyDestinationDefinition;
  DestinyLocationDefinition?: DestinyDefinitions.DestinyLocationDefinition;
  DestinyPlaceDefinition?: DestinyDefinitions.DestinyPlaceDefinition;
  DestinyMaterialRequirementSetDefinition?: DestinyDefinitions.DestinyMaterialRequirementSetDefinition;
  DestinyMedalTierDefinition?: DestinyDefinitions.DestinyMedalTierDefinition;
  DestinyObjectiveDefinition?: DestinyDefinitions.DestinyObjectiveDefinition;
  DestinySandboxPerkDefinition?: DestinyDefinitions.DestinySandboxPerkDefinition;
  DestinyProgressionDefinition?: DestinyDefinitions.DestinyProgressionDefinition;
  DestinyProgressionMappingDefinition?: DestinyDefinitions.DestinyProgressionMappingDefinition;
  DestinyArtDyeChannelDefinition?: DestinyDefinitions.DestinyArtDyeChannelDefinition;
  DestinyArtDyeReferenceDefinition?: DestinyDefinitions.DestinyArtDyeReferenceDefinition;
  DestinySandboxPatternDefinition?: DestinyDefinitions.DestinySandboxPatternDefinition;
  DestinyRewardSourceDefinition?: DestinyDefinitions.DestinyRewardSourceDefinition;
  DestinyStatDefinition?: DestinyDefinitions.DestinyStatDefinition;
  DestinyStatGroupDefinition?: DestinyDefinitions.DestinyStatGroupDefinition;
  DestinyNodeStepDefinition?: DestinyDefinitions.DestinyNodeStepDefinition;
  DestinyNodeStepSummaryDefinition?: DestinyDefinitions.DestinyNodeStepSummaryDefinition;
  DestinyTalentGridDefinition?: DestinyDefinitions.DestinyTalentGridDefinition;
  DestinyTalentNodeDefinition?: DestinyDefinitions.DestinyTalentNodeDefinition;
  DestinyUnlockEventDefinition?: DestinyDefinitions.DestinyUnlockEventDefinition;
  DestinyUnlockDefinition?: DestinyDefinitions.DestinyUnlockDefinition;
  DestinyUnlockExpressionDefinition?: DestinyDefinitions.DestinyUnlockExpressionDefinition;
  DestinyUnlockValueDefinition?: DestinyDefinitions.DestinyUnlockValueDefinition;
  DestinyVendorDefinition?: DestinyDefinitions.DestinyVendorDefinition;
  DestinyVendorGroupDefinition?: DestinyDefinitions.DestinyVendorGroupDefinition;
  DestinyUnlockCountMappingDefinition?: DestinyDefinitions.DestinyUnlockCountMappingDefinition;
  DestinyUnlockExpressionMappingDefinition?: DestinyDefinitions.DestinyUnlockExpressionMappingDefinition;
  DestinyTraitDefinition?: DestinyDefinitions.DestinyTraitDefinition;
  DestinyPlugSetDefinition?: DestinyDefinitions.DestinyPlugSetDefinition;
  DestinySocketCategoryDefinition?: DestinyDefinitions.DestinySocketCategoryDefinition;
  DestinySocketTypeDefinition?: DestinyDefinitions.DestinySocketTypeDefinition;
  DestinySocialCommendationDefinition?: DestinyDefinitions.DestinySocialCommendationDefinition;
  DestinySocialCommendationNodeDefinition?: DestinyDefinitions.DestinySocialCommendationNodeDefinition;
  DestinyEventCardDefinition?: DestinyDefinitions.DestinyEventCardDefinition;
  DestinySeasonDefinition?: DestinyDefinitions.DestinySeasonDefinition;
  DestinySeasonPassDefinition?: DestinyDefinitions.DestinySeasonPassDefinition;
  DestinySackRewardItemListDefinition?: DestinyDefinitions.DestinySackRewardItemListDefinition;
  DestinyRewardAdjusterPointerDefinition?: DestinyDefinitions.DestinyRewardAdjusterPointerDefinition;
  DestinyRewardAdjusterProgressionMapDefinition?: DestinyDefinitions.DestinyRewardAdjusterProgressionMapDefinition;
  DestinyReportReasonCategoryDefinition?: DestinyDefinitions.DestinyReportReasonCategoryDefinition;
  DestinyRecordDefinition?: DestinyDefinitions.DestinyRecordDefinition;
  DestinyProgressionLevelRequirementDefinition?: DestinyDefinitions.DestinyProgressionLevelRequirementDefinition;
  DestinyPresentationNodeDefinition?: DestinyDefinitions.DestinyPresentationNodeDefinition;
  DestinyPowerCapDefinition?: DestinyDefinitions.DestinyPowerCapDefinition;
  DestinyEntitlementOfferDefinition?: DestinyDefinitions.DestinyEntitlementOfferDefinition;
  DestinyMilestoneDefinition?: DestinyDefinitions.DestinyMilestoneDefinition;
  DestinyMetricDefinition?: DestinyDefinitions.DestinyMetricDefinition;
  DestinyLoreDefinition?: DestinyDefinitions.DestinyLoreDefinition;
  DestinyLoadoutColorDefinition?: DestinyDefinitions.DestinyLoadoutColorDefinition;
  DestinyLoadoutConstantsDefinition?: DestinyDefinitions.DestinyLoadoutConstantsDefinition;
  DestinyLoadoutIconDefinition?: DestinyDefinitions.DestinyLoadoutIconDefinition;
  DestinyLoadoutNameDefinition?: DestinyDefinitions.DestinyLoadoutNameDefinition;
  DestinyInventoryItemLiteDefinition?: DestinyDefinitions.DestinyInventoryItemLiteDefinition;
  DestinyItemTierTypeDefinition?: DestinyDefinitions.DestinyItemTierTypeDefinition;
  DestinyGuardianRankConstantsDefinition?: DestinyDefinitions.DestinyGuardianRankConstantsDefinition;
  DestinyGuardianRankDefinition?: DestinyDefinitions.DestinyGuardianRankDefinition;
  DestinyFireteamFinderActivityGraphDefinition?: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition;
  DestinyFireteamFinderActivitySetDefinition?: DestinyDefinitions.DestinyFireteamFinderActivitySetDefinition;
  DestinyFireteamFinderConstantsDefinition?: DestinyDefinitions.DestinyFireteamFinderConstantsDefinition;
  DestinyFireteamFinderLabelDefinition?: DestinyDefinitions.DestinyFireteamFinderLabelDefinition;
  DestinyFireteamFinderLabelGroupDefinition?: DestinyDefinitions.DestinyFireteamFinderLabelGroupDefinition;
  DestinyFireteamFinderOptionDefinition?: DestinyDefinitions.DestinyFireteamFinderOptionDefinition;
  DestinyFireteamFinderOptionGroupDefinition?: DestinyDefinitions.DestinyFireteamFinderOptionGroupDefinition;
  DestinyEnergyTypeDefinition?: DestinyDefinitions.DestinyEnergyTypeDefinition;
  DestinyActivityGraphDefinition?: DestinyDefinitions.DestinyActivityGraphDefinition;
  DestinyCollectibleDefinition?: DestinyDefinitions.DestinyCollectibleDefinition;
  DestinyChecklistDefinition?: DestinyDefinitions.DestinyChecklistDefinition;
  DestinyCharacterCustomizationCategoryDefinition?: DestinyDefinitions.DestinyCharacterCustomizationCategoryDefinition;
  DestinyCharacterCustomizationOptionDefinition?: DestinyDefinitions.DestinyCharacterCustomizationOptionDefinition;
  DestinyBreakerTypeDefinition?: DestinyDefinitions.DestinyBreakerTypeDefinition;
  DestinyArtifactDefinition?: DestinyDefinitions.DestinyArtifactDefinition;
  DestinyActivityModifierDefinition?: DestinyDefinitions.DestinyActivityModifierDefinition;
  DestinyActivityInteractableDefinition?: DestinyDefinitions.DestinyActivityInteractableDefinition;
  DestinyAchievementDefinition?: DestinyDefinitions.DestinyAchievementDefinition;
}
export const DestinyWorldDefinitionsTypeNameList = [
  "DestinyActivityDefinition",
  "DestinyActivityModeDefinition",
  "DestinyActivityTypeDefinition",
  "DestinyBondDefinition",
  "DestinyClassDefinition",
  "DestinyGenderDefinition",
  "DestinyRaceDefinition",
  "DestinyDamageTypeDefinition",
  "DestinyEquipmentSlotDefinition",
  "DestinyFactionDefinition",
  "DestinyInventoryBucketDefinition",
  "DestinyPlatformBucketMappingDefinition",
  "DestinyInventoryItemDefinition",
  "DestinyItemCategoryDefinition",
  "DestinyDestinationDefinition",
  "DestinyLocationDefinition",
  "DestinyPlaceDefinition",
  "DestinyMaterialRequirementSetDefinition",
  "DestinyMedalTierDefinition",
  "DestinyObjectiveDefinition",
  "DestinySandboxPerkDefinition",
  "DestinyProgressionDefinition",
  "DestinyProgressionMappingDefinition",
  "DestinyArtDyeChannelDefinition",
  "DestinyArtDyeReferenceDefinition",
  "DestinySandboxPatternDefinition",
  "DestinyRewardSourceDefinition",
  "DestinyStatDefinition",
  "DestinyStatGroupDefinition",
  "DestinyNodeStepDefinition",
  "DestinyNodeStepSummaryDefinition",
  "DestinyTalentGridDefinition",
  "DestinyTalentNodeDefinition",
  "DestinyUnlockEventDefinition",
  "DestinyUnlockDefinition",
  "DestinyUnlockExpressionDefinition",
  "DestinyUnlockValueDefinition",
  "DestinyVendorDefinition",
  "DestinyVendorGroupDefinition",
  "DestinyUnlockCountMappingDefinition",
  "DestinyUnlockExpressionMappingDefinition",
  "DestinyTraitDefinition",
  "DestinyPlugSetDefinition",
  "DestinySocketCategoryDefinition",
  "DestinySocketTypeDefinition",
  "DestinySocialCommendationDefinition",
  "DestinySocialCommendationNodeDefinition",
  "DestinyEventCardDefinition",
  "DestinySeasonDefinition",
  "DestinySeasonPassDefinition",
  "DestinySackRewardItemListDefinition",
  "DestinyRewardAdjusterPointerDefinition",
  "DestinyRewardAdjusterProgressionMapDefinition",
  "DestinyReportReasonCategoryDefinition",
  "DestinyRecordDefinition",
  "DestinyProgressionLevelRequirementDefinition",
  "DestinyPresentationNodeDefinition",
  "DestinyPowerCapDefinition",
  "DestinyEntitlementOfferDefinition",
  "DestinyMilestoneDefinition",
  "DestinyMetricDefinition",
  "DestinyLoreDefinition",
  "DestinyLoadoutColorDefinition",
  "DestinyLoadoutConstantsDefinition",
  "DestinyLoadoutIconDefinition",
  "DestinyLoadoutNameDefinition",
  "DestinyInventoryItemLiteDefinition",
  "DestinyItemTierTypeDefinition",
  "DestinyGuardianRankConstantsDefinition",
  "DestinyGuardianRankDefinition",
  "DestinyFireteamFinderActivityGraphDefinition",
  "DestinyFireteamFinderActivitySetDefinition",
  "DestinyFireteamFinderConstantsDefinition",
  "DestinyFireteamFinderLabelDefinition",
  "DestinyFireteamFinderLabelGroupDefinition",
  "DestinyFireteamFinderOptionDefinition",
  "DestinyFireteamFinderOptionGroupDefinition",
  "DestinyEnergyTypeDefinition",
  "DestinyActivityGraphDefinition",
  "DestinyCollectibleDefinition",
  "DestinyChecklistDefinition",
  "DestinyCharacterCustomizationCategoryDefinition",
  "DestinyCharacterCustomizationOptionDefinition",
  "DestinyBreakerTypeDefinition",
  "DestinyArtifactDefinition",
  "DestinyActivityModifierDefinition",
  "DestinyActivityInteractableDefinition",
  "DestinyAchievementDefinition",
];
