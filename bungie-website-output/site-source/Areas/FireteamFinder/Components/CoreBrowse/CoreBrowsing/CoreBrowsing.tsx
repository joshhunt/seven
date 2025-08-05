import React, { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FireteamFinder } from "@Platform";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { FireteamOptions } from "@Areas/FireteamFinder/Constants/FireteamOptions";
import {
  FireteamFinderValueTypes,
  ValidFireteamFinderValueTypes,
} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import {
  FireteamApiService,
  FireteamFilterManager,
  LobbyStateManager,
} from "../Helpers";
import { CustomLobbyState } from "../Helpers/LobbyStateManager";
import styles from "./CoreBrowsing.module.scss";
import FilterSection from "@Areas/FireteamFinder/Components/CoreBrowse/FilterSection/FilterSection";
import {
  NoFireteamsFound,
  TabAndListings,
  FireteamListingCard,
} from "./Components";
import {
  MembershipInfo,
  SearchFiltersInput,
} from "@Areas/FireteamFinder/Components/CoreBrowse/Helpers/FireteamApiService";
import { BungieMembershipType, DestinyFireteamFinderLobbyState } from "@Enum";
import CustomLobbyStateCard from "./Components/CustomLobbyStateCard/CustomLobbyStateCard";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import {
  loadUserData,
  resetMembership,
  selectDestinyAccount,
} from "@Global/Redux/slices/destinyAccountSlice";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { AppliedFilters } from "./Components/AppliedFilters/AppliedFilters";
import { SearchParams, useFireteamSearchParams } from "../Helpers/Hooks";

interface BrowseFireteamsProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {}

const lobbyTabs: CustomLobbyState[] = [
  CustomLobbyState.Active,
  CustomLobbyState.Inactive,
  CustomLobbyState.Clan,
  CustomLobbyState.Mine,
];

const CoreBrowsing: FC<BrowseFireteamsProps> = (props) => {
  /* URL Management */
  const { params, setParams } = useFireteamSearchParams();
  const { activityGraphId } = params;
  const dispatch = useAppDispatch();

  const account = useAppSelector(selectDestinyAccount);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  /* State */
  const [resultsList, setResultsList] = useState<
    FireteamFinder.DestinyFireteamFinderListing[]
  >([]);

  const selectorFilterTypes: ValidFireteamFinderValueTypes[] = [
    FireteamFinderValueTypes.applicationRequirement,
    FireteamFinderValueTypes.locale,
    FireteamFinderValueTypes.mic,
    FireteamFinderValueTypes.minGuardianRank,
    FireteamFinderValueTypes.platform,
    FireteamFinderValueTypes.joinSetting,
  ];

  const [showingLobbyState, setShowingLobbyState] = useState<CustomLobbyState>(
    LobbyStateManager.getInitialLobbyState(params, CustomLobbyState.Active)
  );

  const browseFilterDefinitionTree = new FireteamOptions(
    props.definitions.DestinyFireteamFinderOptionDefinition
  ).createOptionsTree();
  const initialFilters = FireteamFilterManager.createInitialFilters(
    browseFilterDefinitionTree,
    selectorFilterTypes
  );
  const formMethods = useForm({ defaultValues: { ...initialFilters } });

  const loadFireteams = async () => {
    if (!account.selectedMembership || !account.selectedCharacterId) {
      // The useEffect below will load this data.
      return;
    }

    const destinyLobbyState = LobbyStateManager.getDestinyLobbyState(
      showingLobbyState
    );

    const searchInput: SearchFiltersInput = {
      tags: params.tags,
      graphId: activityGraphId,
      lobbyState: destinyLobbyState || DestinyFireteamFinderLobbyState.Active,
      filterData: params.filters,
      browseFilterDefinitionTree,
    };

    const membershipInfo: MembershipInfo = {
      membershipId: account.selectedMembership.membershipId,
      membershipType: account.selectedMembership.membershipType,
      characterId: account.selectedCharacterId,
    };
    let listings: FireteamFinder.DestinyFireteamFinderListing[] = [];
    try {
      listings =
        (await FireteamApiService.getFireteamsByLobbyState(
          showingLobbyState,
          searchInput,
          membershipInfo
        )) ?? [];
    } finally {
      // This try-finally is here so that even if the request fails the user does not get shown incorrect data.
      if (LobbyStateManager.isActive(showingLobbyState)) {
        setResultsList(listings);
      } else if (LobbyStateManager.isInactive(showingLobbyState)) {
        setResultsList(listings);
      } else if (LobbyStateManager.isClan(showingLobbyState)) {
        setResultsList(listings);
      } else if (LobbyStateManager.isMine(showingLobbyState)) {
        setResultsList(listings);
      }
    }
  };

  useEffect(() => {
    if (!globalState.loggedInUser) {
      dispatch(resetMembership());
    } else {
      let membershipPair = {
        membershipId: globalState?.loggedInUser?.user?.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      };
      dispatch(loadUserData({ membershipPair }));
    }
  }, [globalState?.loggedInUser]);

  useEffect(() => {
    loadFireteams();
  }, [showingLobbyState, params, account]);

  const [activeUserLobbies, inactiveUserLobbies] = useMemo(() => {
    if (
      !LobbyStateManager.isClan(showingLobbyState) &&
      !LobbyStateManager.isMine(showingLobbyState)
    ) {
      return [[], []];
    }

    const activeUserLobbiesInner = resultsList.filter(
      (r) => r.lobbyState === DestinyFireteamFinderLobbyState.Active
    );
    const inactiveUserLobbiesInner = resultsList.filter(
      (r) => r.lobbyState === DestinyFireteamFinderLobbyState.Inactive
    );

    return [activeUserLobbiesInner, inactiveUserLobbiesInner];
  }, [resultsList, showingLobbyState]);

  const selectedActivity = useMemo(() => {
    if (!activityGraphId) {
      return;
    }
    return props.definitions?.DestinyFireteamFinderActivityGraphDefinition?.get(
      activityGraphId
    )?.displayProperties?.name;
  }, [activityGraphId]);

  return (
    <div className={styles.browseContainer}>
      <GridCol cols={3} tiny={12} mobile={12}>
        <FilterSection
          selectedActivity={selectedActivity}
          params={params}
          formMethods={formMethods}
          handleSubmit={() => null}
          tagsProps={{
            definitions: props?.definitions,
            savedTags: params.tags,
            tagHashesUpdated: (tags) =>
              setParams({
                ...params,
                tags,
              }),
          }}
          optionsProps={{
            selectedFilterHashes: params.filters,
            browseFilterDefinitionTree,
            selectorFilterTypes,
            formMethods,
            handleUrlUpdate: (key, value) =>
              setParams({
                ...params,
                filters: {
                  ...params.filters,
                  [key]: value,
                },
              }),
          }}
        />
      </GridCol>
      <GridCol className={styles.lobbyCards} cols={9} tiny={12} mobile={12}>
        <div className={styles.tabHeader}>
          {lobbyTabs.map((tab) => (
            <TabAndListings
              key={tab}
              setShowingLobbyState={setShowingLobbyState}
              handleLobbyStateUpdate={(lobbyState) =>
                setParams({
                  ...params,
                  lobbyState: lobbyState.toString(),
                })
              }
              activeLobbyState={showingLobbyState}
              matchingLobbyState={tab}
            />
          ))}
        </div>
        <div>
          <AppliedFilters
            selectedActivity={selectedActivity}
            lobbyState={showingLobbyState}
            filterDefinitions={browseFilterDefinitionTree}
            selectedFilterHashes={params.filters}
            tagDefinitions={props.definitions.DestinyFireteamFinderLabelDefinition.all()}
            selectedTagHashes={params.tags}
            onClear={() => {
              setParams({});
            }}
          />
          {/* Active listings */}
          {LobbyStateManager.isActive(showingLobbyState) &&
            (resultsList.length > 0 ? (
              <div>
                {resultsList.map((listing, index) => (
                  <FireteamListingCard
                    key={`active-${index}`}
                    fireteam={listing}
                    linkToDetails={true}
                    showHover={true}
                    lobbyStateOverride={DestinyFireteamFinderLobbyState.Active}
                  />
                ))}
              </div>
            ) : (
              <NoFireteamsFound />
            ))}

          {/* Inactive listings */}
          {LobbyStateManager.isInactive(showingLobbyState) &&
            (resultsList.length > 0 ? (
              <div>
                {resultsList.map((listing, index) => (
                  <FireteamListingCard
                    key={`scheduled-${index}`}
                    fireteam={listing}
                    linkToDetails={true}
                    showHover={true}
                    lobbyStateOverride={
                      DestinyFireteamFinderLobbyState.Inactive
                    }
                  />
                ))}
              </div>
            ) : (
              <NoFireteamsFound />
            ))}

          {LobbyStateManager.isClan(showingLobbyState) && (
            <CustomLobbyStateCard
              activeFireteams={activeUserLobbies}
              scheduledFireteams={inactiveUserLobbies}
            />
          )}

          {/* Mine listings - shows userActiveFireteam + userScheduledFireteams */}
          {LobbyStateManager.isMine(showingLobbyState) && (
            <CustomLobbyStateCard
              activeFireteams={activeUserLobbies}
              scheduledFireteams={inactiveUserLobbies}
            />
          )}
        </div>
      </GridCol>
    </div>
  );
};

export default withDestinyDefinitions(CoreBrowsing, {
  types: [
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityDefinition",
    "DestinyFireteamFinderOptionDefinition",
  ],
});
