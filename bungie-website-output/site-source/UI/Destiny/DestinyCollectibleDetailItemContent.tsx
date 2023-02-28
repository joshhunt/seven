// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  BungieMembershipType,
  DamageType,
  DestinyComponentType,
  DestinyItemType,
  PlatformErrorCodes,
  TierType,
} from "@Enum";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Definitions, Platform, Responses, World } from "@Platform";
import styles from "@UI/Destiny/DestinyCollectibleDetailItemModal.module.scss";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";

interface DestinyDetailItemModalProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyDamageTypeDefinition"
    | "DestinyStatDefinition"
    | "DestinyStatGroupDefinition"
    | "DestinySandboxPerkDefinition"
    | "DestinyCollectibleDefinition"
  > {
  itemHash: number;
  membershipId?: string;
  membershipType?: BungieMembershipType;
}

const DestinyCollectibleDetailItemModalContent: React.FC<DestinyDetailItemModalProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const [isLoading, setIsLoading] = useState(true);
  const [itemDef, setItemDef] = useState<
    Definitions.DestinyInventoryItemDefinition
  >();
  const [itemDetails, setItemDetails] = useState<
    Responses.DestinyCollectibleNodeDetailResponse
  >();

  const getDefinition = () => {
    Platform.Destiny2Service.GetDestinyEntityDefinition(
      "DestinyInventoryItemDefinition",
      props.itemHash
    )
      .then((result) => {
        setItemDef(result as Definitions.DestinyInventoryItemDefinition);
        setIsLoading(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (e.errorCode === PlatformErrorCodes.DestinyAccountNotFound) {
          Modal.open(Localizer.Seasons.PlayDestiny2ToUnlock);
        } else {
          Modal.error(e);
        }
      });
  };

  const getCollectibleNodeDetails = (parentNodeHash: number) => {
    Platform.Destiny2Service.GetCollectibleNodeDetails(
      destinyMembership?.selectedMembership?.membershipType,
      destinyMembership?.selectedMembership?.membershipId,
      destinyMembership?.selectedCharacter?.characterId,
      parentNodeHash,
      [
        DestinyComponentType.ItemObjectives,
        DestinyComponentType.ItemPerks,
        DestinyComponentType.ItemInstances,
        DestinyComponentType.ItemCommonData,
        DestinyComponentType.ItemRenderData,
        DestinyComponentType.ItemStats,
      ]
    ).then((result) => setItemDetails(result));
  };

  useEffect(() => {
    getDefinition();

    if (!destinyMembership?.selectedMembership) {
      const membershipPair: MembershipPair =
        !!props.membershipId && !!props.membershipType
          ? {
              membershipId: props.membershipId,
              membershipType: props.membershipType,
            }
          : undefined;

      membershipPair
        ? PresentationNodeDestinyMembershipDataStore.actions.loadUserData(
            membershipPair,
            true
          )
        : PresentationNodeDestinyMembershipDataStore.actions.loadUserData();
    }
  }, []);

  useEffect(() => {
    if (destinyMembership?.selectedMembership && itemDef) {
      const coDef = props.definitions.DestinyCollectibleDefinition.get(
        itemDef?.collectibleHash
      );

      getCollectibleNodeDetails(coDef?.parentNodeHashes[0]);
    }
  }, [itemDef, destinyMembership?.selectedMembership]);

  if (isLoading) {
    return (
      <SpinnerContainer
        className={styles.spinner}
        loading={true}
        mode={SpinnerDisplayMode.cover}
      />
    );
  }

  if (!isLoading && !itemDef) {
    return (
      <div className={styles.gearItemError}>
        {Localizer.Gear.GearSummaryError}
      </div>
    );
  }

  const collectibleDef = props.definitions.DestinyCollectibleDefinition.get(
    itemDef?.collectibleHash
  );

  const collectibleComponentSet = itemDetails?.collectibleItemComponents;

  const rarityClass = EnumUtils.getStringValue(
    itemDef.inventory?.tierType,
    TierType
  );

  const stats = collectibleComponentSet
    ? collectibleComponentSet?.stats?.data[collectibleDef?.itemHash]?.stats
    : itemDef.stats?.stats;
  const perks =
    collectibleComponentSet?.perks?.data[collectibleDef?.itemHash]?.perks;
  const damageTypes = props.definitions.DestinyDamageTypeDefinition.all(); //(props.itemDef?.defaultDamageType);

  const filteredDamageTypes = Object.entries(damageTypes).filter(([k, def]) => {
    return (
      parseInt(def.enumValue.toString(), 10) ===
      EnumUtils.getNumberValue(itemDef.defaultDamageType, DamageType)
    );
  });

  const damageDef =
    filteredDamageTypes?.[0]?.[1] ??
    props.definitions.DestinyDamageTypeDefinition.get(
      itemDef?.defaultDamageType
    ); //get the first and only one and get the value

  const primaryStats = () => {
    const primaryStateInstance =
      collectibleComponentSet?.instances?.data?.[itemDef.hash]?.primaryStat;
    const primaryStatFallback = collectibleComponentSet
      ? collectibleComponentSet?.instances?.data?.[itemDef.hash]?.primaryStat
      : stats?.[itemDef?.stats?.primaryBaseStatHash];
    const primaryStatDef =
      itemDef?.stats?.stats?.[itemDef?.stats?.primaryBaseStatHash];
    const actualPrimaryStat = primaryStateInstance ?? primaryStatFallback;

    if (!primaryStatDef) {
      return null;
    }

    const primaryStatStatDef = props.definitions.DestinyStatDefinition.get(
      primaryStatDef.statHash
    );

    if (!itemDef.stats?.primaryBaseStatHash || !itemDef.stats?.stats) {
      return null;
    }

    return (
      <>
        <hr />
        <div className={styles.itemStatsPrimary}>
          {primaryStatDef && (
            <>
              {primaryStatStatDef && !!actualPrimaryStat?.value && (
                <>
                  {damageDef && (
                    <img
                      src={damageDef.displayProperties.icon}
                      alt={damageDef.displayProperties.name}
                    />
                  )}

                  <div className={styles.itemPrimaryStat}>
                    <div className={styles.itemPrimaryStatValue}>
                      {actualPrimaryStat.value}
                    </div>
                    <div className={styles.itemPrimaryStatName}>
                      {primaryStatStatDef.displayProperties.name}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  const renderStatGroup = (
    statGroupHash: number,
    statGroupStats: { [p: string]: World.DestinyStat }
  ): ReactNode => {
    const statGroupDef = props.definitions.DestinyStatGroupDefinition.get(
      statGroupHash
    );

    if (!statGroupDef) {
      return null;
    }

    return statGroupDef.scaledStats
      .filter((ss) => ss.statHash)
      .map((ss) => {
        const itemStatDef = itemDef.stats.stats[ss.statHash];

        if (!itemStatDef) {
          return null;
        }

        const matchingStat = stats?.[ss.statHash];

        return renderStat(itemStatDef, ss, matchingStat);
      });
  };

  const renderStat = (
    statDef: Definitions.DestinyInventoryItemStatDefinition,
    displayInfo: Definitions.DestinyStatDisplayDefinition,
    stat: World.DestinyStat
  ): ReactNode => {
    const baseStatDef = props.definitions.DestinyStatDefinition.get(
      statDef.statHash
    );

    return (
      <div
        className={classNames(
          styles.statItem,
          displayInfo.displayAsNumeric ? styles.numeric : styles.bar
        )}
      >
        <div className={styles.statHeader}>
          <div className={styles.statTitle}>
            {baseStatDef.displayProperties.name}
          </div>
        </div>

        {displayInfo.displayAsNumeric && renderStatNumber(statDef, stat)}
        {!displayInfo.displayAsNumeric &&
          renderStatBar(statDef, displayInfo, stat)}
      </div>
    );
  };

  const renderStatNumber = (
    statDef: Definitions.DestinyInventoryItemStatDefinition,
    stat: World.DestinyStat
  ): ReactNode => {
    const statValue = stat?.value ?? statDef.value;

    return <div className={styles.statNumber}>{statValue}</div>;
  };

  const renderStatBar = (
    statDef: Definitions.DestinyInventoryItemStatDefinition,
    displayInfo: Definitions.DestinyStatDisplayDefinition,
    stat: World.DestinyStat
  ) => {
    const statValue = stat?.value ?? statDef.value;

    const mainWidthPct =
      displayInfo.maximumValue > 0
        ? (statValue / displayInfo.maximumValue) * 100
        : 0;

    return (
      <div className={styles.statBar}>
        <div
          className={styles.mainWidth}
          style={{ width: `${mainWidthPct}%` }}
        />
        <div className={styles.extraWidth} />
      </div>
    );
  };

  return (
    <div
      className={classNames(styles.gearItemSummary, {
        [rarityClass]: rarityClass,
      })}
    >
      <div className={styles.detailPane}>
        {itemDef.screenshot && (
          <div
            className={styles.background}
            style={{ backgroundImage: `url(${itemDef.screenshot})` }}
          />
        )}
        <div className={styles.itemHeader}>
          <div className={styles.title}>{itemDef.displayProperties.name}</div>
          <div className={styles.subtitle}>
            {itemDef.itemTypeAndTierDisplayName}
          </div>
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemDescription}>
            {itemDef.displayProperties.description}
          </div>
          {collectibleDef?.sourceString && (
            <div className={classNames(styles.itemDescription, styles.source)}>
              {collectibleDef?.sourceString}
            </div>
          )}
          {primaryStats()}
          {itemDef?.stats?.stats &&
            Object.keys(itemDef.stats?.stats)?.length > 0 &&
            stats && (
              <div
                className={classNames(
                  styles.itemStats,
                  styles.detailModeContent,
                  styles.active
                )}
                data-mode="stats"
              >
                {renderStatGroup(itemDef?.stats?.statGroupHash ?? 0, stats)}
              </div>
            )}
          {perks && (
            <div className={styles.itemPerks}>
              {perks?.map((p) => {
                const perkDef = props.definitions.DestinySandboxPerkDefinition.get(
                  p.perkHash
                );

                if (!perkDef || !p.visible) {
                  return null;
                }

                return (
                  <TwoLineItem
                    key={perkDef.hash}
                    itemTitle={perkDef.displayProperties.name}
                    itemSubtitle={perkDef.displayProperties.description}
                    icon={
                      <IconCoin iconImageUrl={perkDef.displayProperties.icon} />
                    }
                    normalWhiteSpace={true}
                  />
                );
              })}
            </div>
          )}
          {itemDef.itemType === DestinyItemType.Mod && (
            <div className={styles.itemPerks}>
              {itemDef.perks?.map((p) => {
                const def = props.definitions.DestinySandboxPerkDefinition.get(
                  p.perkHash
                );

                if (
                  !def ||
                  (def &&
                    (def.redacted ||
                      !def.displayProperties.name ||
                      def.displayProperties.name === ""))
                ) {
                  return null;
                }

                return (
                  <TwoLineItem
                    key={def.hash}
                    itemTitle={def?.displayProperties.name}
                    itemSubtitle={def?.displayProperties.description}
                    icon={
                      <IconCoin iconImageUrl={def.displayProperties.icon} />
                    }
                    normalWhiteSpace={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(
  DestinyCollectibleDetailItemModalContent,
  {
    types: [
      "DestinyPresentationNodeDefinition",
      "DestinyDamageTypeDefinition",
      "DestinyStatDefinition",
      "DestinyStatGroupDefinition",
      "DestinySandboxPerkDefinition",
      "DestinyCollectibleDefinition",
    ],
  }
);
