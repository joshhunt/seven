import { DropStateEnum } from "@Enum";
import { Tokens } from "@Platform";

type PartnerRewardsMockEntry =
  | ({ type: "Twitch"; partnerId: number } & Tokens.TwitchDropHistoryResponse)
  | ({
      type: "PartnerOffer";
      partnerId: number;
    } & Tokens.PartnerOfferSkuHistoryResponse);

const MOCK_TWITCH_PARTNER_ID = 999001;
const MOCK_PARTNER_OFFER_ID = 999002;

const createTwitchDrop = (
  title: string,
  description: string,
  createdAt: string
): PartnerRewardsMockEntry => ({
  type: "Twitch",
  partnerId: MOCK_TWITCH_PARTNER_ID,
  Title: title,
  Description: description,
  CreatedAt: createdAt,
  ClaimState: DropStateEnum.Fulfilled,
});

const createPartnerOffer = (
  skuIdentifier: string,
  name: string,
  description: string,
  claimDate: string
): PartnerRewardsMockEntry => ({
  type: "PartnerOffer",
  partnerId: MOCK_PARTNER_OFFER_ID,
  SkuIdentifier: skuIdentifier,
  LocalizedName: name,
  LocalizedDescription: description,
  ClaimDate: claimDate,
  AllOffersApplied: true,
  TransactionId: `mock-${skuIdentifier}`,
  SkuOffers: [
    {
      PartnerOfferKey: skuIdentifier,
      LocalizedName: name,
      LocalizedDescription: description,
      IsConsumable: false,
      QuantityApplied: 1,
      ApplyDate: claimDate,
    },
  ],
});

export const mockPartnerRewards: PartnerRewardsMockEntry[] = [
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Seekers, Not Saints",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-11-25T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Rallying Cry Shader",
    "Claim the Destiny 2 Shader from Special Deliveries terminal in the Tower.",
    "2025-11-11T00:00:00Z"
  ),
  createTwitchDrop(
    "Unknown Drop",
    "Destiny 2 Twitch Drop: Knights of Old Emblem",
    "2025-09-09T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Gracious Gloss Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-08-05T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Refulgent Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-07-28T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Observer Effect Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-07-01T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Astromancy Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-06-24T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Destination: Tau Ceti Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-03-21T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Portable Power Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-03-04T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Trigonic Amber Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-02-07T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Retro Boy Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-02-06T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Scorned Organ Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2025-01-28T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: We Begin in the Stars Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2024-11-12T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Stand In Salvation",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2024-06-07T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Roots Remain",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2024-06-07T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Effortless Flow Emblem",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2024-05-07T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Diamond Medallion 2",
    "Reward available from Eva in the Tower during Guardian Games.",
    "2024-03-19T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Twitch Drop: Diamond Medallion 1",
    "Reward available from Eva in the Tower during Guardian Games.",
    "2024-03-19T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Emblem: Traveler's Wish",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your drop has been applied.",
    "2024-02-01T00:00:00Z"
  ),
  createTwitchDrop(
    "Destiny 2 Emblem: Every End",
    "Claim this Destiny 2 emblem from your in-game Flair Collections once your code has been applied.",
    "2023-09-01T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_25",
    "Prime Gaming Reward Offer 25",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2022-01-13T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_20",
    "Prime Gaming Reward Offer 20",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2021-08-11T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_14",
    "Prime Gaming Reward Offer 14",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2021-02-24T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_11",
    "Prime Gaming Reward Offer 11",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-11-25T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_8",
    "Prime Gaming Reward Offer 8",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-08-19T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_7",
    "Prime Gaming Reward Offer 7",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-07-23T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_6",
    "Prime Gaming Reward Offer 6",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-07-09T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_4",
    "Prime Gaming Reward Offer 4",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-05-26T00:00:00Z"
  ),
  createPartnerOffer(
    "prime_gaming_reward_offer_1",
    "Prime Gaming Reward Offer 1",
    "Reward available from the Special Deliveries terminal in the Tower.",
    "2020-01-30T00:00:00Z"
  ),
];
