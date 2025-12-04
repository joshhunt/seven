import React from "react";
import SeasonProgressUtils from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import UnifiedSeasonPass from "@Areas/Seasons/SeasonProgress/pages/UnifiedSeasonPass/UnifiedSeasonPass";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import {
  withDestinyDefinitions,
  D2DatabaseComponentProps,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { RouteComponentProps } from "react-router-dom";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { BnetRewardsPassConfig } from "@Areas/Seasons/SeasonProgress/constants/BnetRewardsPassConfig";
import { Platform } from "@Platform";

type SeasonsAreaProps = RouteComponentProps &
  GlobalStateComponentProps<any> &
  D2DatabaseComponentProps<
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
    | "DestinyInventoryItemLiteDefinition"
  >;

type SeasonsAreaState = {
  selectedCurrentPassHash?: number;
  selectedPreviousPassHash?: number;
  ownedSeasonPassHashes: number[];
  loadingOwnership?: boolean;
};

class SeasonsArea extends React.Component<SeasonsAreaProps, SeasonsAreaState> {
  state: SeasonsAreaState = {
    selectedCurrentPassHash: undefined,
    selectedPreviousPassHash: undefined,
    ownedSeasonPassHashes: [],
    loadingOwnership: false,
  };

  componentDidMount() {
    this.ensureInitialSelection();
  }

  componentDidUpdate(prevProps: SeasonsAreaProps, prevState: SeasonsAreaState) {
    if (
      prevProps.globalState !== this.props.globalState ||
      prevProps.definitions !== this.props.definitions
    ) {
      this.ensureInitialSelection();
    }
  }

  ensureInitialSelection() {
    const { globalState, definitions } = this.props;
    const seasonHash = globalState?.coreSettings?.destiny2CoreSettings
      ?.currentSeasonHash as number | undefined;
    if (!seasonHash || !definitions) return;

    const currentSeasonDef: any = definitions.DestinySeasonDefinition.get(
      seasonHash
    );
    const passList: any[] = currentSeasonDef?.seasonPassList ?? [];
    if (!passList.length) return;

    const now = SeasonProgressUtils.getEffectiveNow?.() ?? new Date();

    const activeIdx = passList.findIndex((sp) => {
      if (!sp?.seasonPassStartDate) return false;
      const s = new Date(sp.seasonPassStartDate);
      const e = sp?.seasonPassEndDate
        ? new Date(sp.seasonPassEndDate)
        : undefined;
      return e ? now >= s && now <= e : now >= s;
    });

    const currentPassRef =
      (activeIdx >= 0 ? passList[activeIdx] : undefined) ?? passList[0];
    const previousInCurrent =
      activeIdx > 0 ? passList[activeIdx - 1] : passList[passList.length - 1];

    this.setState((s) => ({
      selectedCurrentPassHash:
        s.selectedCurrentPassHash ?? currentPassRef?.seasonPassHash,
      selectedPreviousPassHash:
        s.selectedPreviousPassHash ?? previousInCurrent?.seasonPassHash,
    }));
  }

  public render() {
    const { globalState, definitions, location } = this.props;
    const currentSeasonHash = globalState?.coreSettings?.destiny2CoreSettings
      ?.currentSeasonHash as number | undefined;
    const currentSeasonDef = currentSeasonHash
      ? definitions?.DestinySeasonDefinition?.get(currentSeasonHash)
      : undefined;
    const pastSeasonHashes: number[] =
      globalState?.coreSettings?.destiny2CoreSettings?.pastSeasonHashes ?? [];
    const previousSeasonHash = pastSeasonHashes[pastSeasonHashes.length - 1];
    const previousSeasonDef = previousSeasonHash
      ? definitions?.DestinySeasonDefinition?.get(previousSeasonHash)
      : undefined;

    if (!definitions || !currentSeasonHash || !currentSeasonDef) {
      return null;
    }

    const {
      selectedCurrentPassHash,
      selectedPreviousPassHash,
      ownedSeasonPassHashes,
    } = this.state;

    // Determine page first
    const page = location?.pathname?.toLowerCase().includes("previous")
      ? ("previous" as const)
      : ("current" as const);

    // Compute current and previous pass refs (previous falls back to previous season if current active is first)
    const now = SeasonProgressUtils.getEffectiveNow?.() ?? new Date();
    const currRefs = currentSeasonDef?.seasonPassList ?? [];
    const activeIdx = currRefs.findIndex((sp) => {
      if (!sp?.seasonPassStartDate) return false;
      const s = new Date(sp.seasonPassStartDate);
      const e = sp?.seasonPassEndDate
        ? new Date(sp.seasonPassEndDate)
        : undefined;
      return e ? now >= s && now <= e : now >= s;
    });
    const currentRef =
      (activeIdx >= 0 ? currRefs[activeIdx] : undefined) ?? currRefs[0];
    const prevRefs = previousSeasonDef?.seasonPassList ?? [];
    const previousRef =
      activeIdx > 0 ? currRefs[activeIdx - 1] : prevRefs[prevRefs.length - 1];

    // Resolve defs
    const currentPassDef = currentRef?.seasonPassHash
      ? definitions?.DestinySeasonPassDefinition?.get(
          currentRef?.seasonPassHash
        )
      : undefined;
    const previousPassDef = previousRef?.seasonPassHash
      ? definitions?.DestinySeasonPassDefinition?.get(
          previousRef?.seasonPassHash
        )
      : undefined;

    // Build current pass model using config (not content display props)
    const cStart = currentRef?.seasonPassStartDate
      ? new Date(currentRef.seasonPassStartDate)
      : undefined;
    const cEnd = currentRef?.seasonPassEndDate
      ? new Date(currentRef.seasonPassEndDate)
      : undefined;
    const cActive = cStart
      ? cEnd
        ? now >= cStart && now <= cEnd
        : now >= cStart
      : false;
    const currentModel = {
      seasonHash: currentSeasonHash,
      seasonPassHash: currentRef?.seasonPassHash,
      index: activeIdx >= 0 ? activeIdx : 0,
      title: BnetRewardsPassConfig.currentPass.title,
      smallIcon: BnetRewardsPassConfig.currentPass.smallIcon,
      backgroundImage: BnetRewardsPassConfig.currentPass.progressPageImage,
      startDate: cStart,
      endDate: cEnd,
      isActive: cActive,
      ended: !!(cEnd && now > cEnd),
      msRemaining: cEnd ? Math.max(0, cEnd.getTime() - now.getTime()) : 0,
      role: "current" as const,
      strings: BnetRewardsPassConfig.currentPass,
      seasonDefinition: currentSeasonDef,
      passDefinition: currentPassDef,
      rewardProgressionHash: currentPassDef?.rewardProgressionHash,
      rewardsDef: currentPassDef?.rewardProgressionHash
        ? definitions?.DestinyProgressionDefinition?.get(
            currentPassDef?.rewardProgressionHash
          )
        : undefined,
      rewardItems: currentPassDef?.rewardProgressionHash
        ? definitions?.DestinyProgressionDefinition?.get(
            currentPassDef?.rewardProgressionHash
          )?.rewardItems
        : undefined,
    };

    // Build previous pass model using config
    const pStart = previousRef?.seasonPassStartDate
      ? new Date(previousRef.seasonPassStartDate)
      : undefined;
    const pEnd = previousRef?.seasonPassEndDate
      ? new Date(previousRef.seasonPassEndDate)
      : undefined;
    const prevSeasonForModel =
      activeIdx > 0 ? currentSeasonHash : previousSeasonHash;
    const prevSeasonDefForModel =
      activeIdx > 0 ? currentSeasonDef : previousSeasonDef;
    const previousModel = {
      seasonHash: prevSeasonForModel!,
      seasonPassHash: previousRef?.seasonPassHash,
      index: activeIdx > 0 ? activeIdx - 1 : prevRefs.length - 1,
      title: BnetRewardsPassConfig.previousPass.title,
      smallIcon: BnetRewardsPassConfig.previousPass.smallIcon,
      backgroundImage: BnetRewardsPassConfig.previousPass.progressPageImage,
      startDate: pStart,
      endDate: pEnd,
      isActive: false,
      ended: true,
      msRemaining: 0,
      role: "previous" as const,
      strings: BnetRewardsPassConfig.previousPass,
      seasonDefinition: prevSeasonDefForModel,
      passDefinition: previousPassDef,
      rewardProgressionHash: previousPassDef?.rewardProgressionHash,
      rewardsDef: previousPassDef?.rewardProgressionHash
        ? definitions?.DestinyProgressionDefinition?.get(
            previousPassDef?.rewardProgressionHash
          )
        : undefined,
      rewardItems: previousPassDef?.rewardProgressionHash
        ? definitions?.DestinyProgressionDefinition?.get(
            previousPassDef?.rewardProgressionHash
          )?.rewardItems
        : undefined,
    };

    const passes = [currentModel, previousModel];
    const activeIndex2 = currentModel.isActive ? 0 : -1;
    const currentIndex = 0;
    const previousIndex = 1;

    // Clamp selected index properly
    const currentSelectedIdx = passes.findIndex(
      (p) => p.seasonPassHash === currentModel.seasonPassHash
    );
    const previousSelectedIdx = passes.findIndex(
      (p) => p.seasonPassHash === previousModel.seasonPassHash
    );
    const selectedIndex =
      page === "current"
        ? currentSelectedIdx >= 0
          ? currentSelectedIdx
          : 0
        : previousSelectedIdx >= 0
        ? previousSelectedIdx
        : 1;

    const currentShared = {
      definitions,
      seasonHash: currentModel.seasonHash,
      seasonDefinition: currentModel.seasonDefinition,
      passes,
      activeIndex: activeIndex2,
      currentIndex,
      previousIndex,
      selectedIndex,
      selectedPass: passes.find(
        (p) => p.seasonPassHash === currentModel.seasonPassHash
      ),
      currentPass: currentModel,
      previousPass: previousModel,
      page: "current" as const,
      currentStrings: BnetRewardsPassConfig.currentPass,
      previousStrings: BnetRewardsPassConfig.previousPass,
      now,
    } as const;

    const previousShared = {
      definitions,
      seasonHash: previousModel.seasonHash,
      seasonDefinition: previousModel.seasonDefinition,
      passes,
      activeIndex: activeIndex2,
      currentIndex,
      previousIndex,
      selectedIndex,
      selectedPass: passes.find(
        (p) => p.seasonPassHash === previousModel.seasonPassHash
      ),
      currentPass: currentModel,
      previousPass: previousModel,
      page: "previous" as const,
      currentStrings: BnetRewardsPassConfig.currentPass,
      previousStrings: BnetRewardsPassConfig.previousPass,
      now,
    } as const;

    const defaultCurrentHash = currentModel.seasonPassHash;
    const defaultPreviousHash = previousModel.seasonPassHash;

    const ownsPremiumCurrent =
      typeof currentModel.seasonPassHash === "number" &&
      ownedSeasonPassHashes.includes(currentModel.seasonPassHash);
    const ownsPremiumPrevious =
      typeof previousModel.seasonPassHash === "number" &&
      ownedSeasonPassHashes.includes(previousModel.seasonPassHash);

    const passProps =
      page === "previous"
        ? {
            ...previousShared,
            selectedPassHash: defaultPreviousHash,
            onSelectPass: (h: number) => 0,
            ownsPremium: ownsPremiumPrevious,
          }
        : {
            ...currentShared,
            selectedPassHash: defaultCurrentHash,
            onSelectPass: (h: number) => 0,
            ownsPremium: ownsPremiumCurrent,
          };

    return <UnifiedSeasonPass {...passProps} mode={page} />;
  }
}

export default WithRouteData(
  withGlobalState(
    withDestinyDefinitions(SeasonsArea, {
      types: [
        "DestinySeasonDefinition",
        "DestinySeasonPassDefinition",
        "DestinyProgressionDefinition",
        "DestinyInventoryItemLiteDefinition",
      ],
    })
  )
);
