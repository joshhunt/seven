import React, { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FireteamFinder } from "@Platform";
import { IFireteamFinderParams } from "@Routes/Definitions/RouteParams";
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
  UrlManager,
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
import { UserUtils } from "@Utilities/UserUtils";

interface BrowseFireteamsProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {}

const CoreBrowsing: FC<BrowseFireteamsProps> = (props) => {
  /* URL Management */
  const getParams = () => UrlManager.getCurrentParams();
  const dispatch = useAppDispatch();
  const updateUrlWithoutRefresh = (key: string, value: string) =>
    UrlManager.updateUrl(key, value);
  const [urlUpdateTrigger, setUrlUpdateTrigger] = useState(0);

  useEffect(() => {
    UrlManager.setChangeCallback(() => {
      setUrlUpdateTrigger((prev) => prev + 1);
    });

    // Clean up on unmount
    return () => {
      UrlManager.setChangeCallback(null);
    };
  }, []);

  const account = useAppSelector(selectDestinyAccount);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  /* State */
  const [tags, setTags] = useState<string[]>([]);
  const { graphId } = useParams<IFireteamFinderParams>();
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
    LobbyStateManager.getInitialLobbyState(getParams(), CustomLobbyState.Active)
  );

  const browseFilterDefinitionTree = new FireteamOptions(
    props.definitions.DestinyFireteamFinderOptionDefinition
  ).createOptionsTree();
  const initialFilters = FireteamFilterManager.createInitialFilters(
    browseFilterDefinitionTree,
    selectorFilterTypes
  );
  const formMethods = useForm({ defaultValues: { ...initialFilters } });

  const loadFireteams: SubmitHandler<FieldValues> = async (
    data: FieldValues
  ) => {
    if (!account.selectedMembership || !account.selectedCharacterId) {
      // The useEffect below will load this data.
      return;
    }

    const destinyLobbyState = LobbyStateManager.getDestinyLobbyState(
      showingLobbyState
    );

    const searchInput: SearchFiltersInput = {
      tags,
      graphId,
      lobbyState: destinyLobbyState || DestinyFireteamFinderLobbyState.Active,
      filterData: data,
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
      // Set results based on lobby state
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
    if (formMethods.getValues()) {
      loadFireteams(getParams());
    }
  }, [tags, showingLobbyState, urlUpdateTrigger, account]);

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

  return (
    <div className={styles.browseContainer}>
      <GridCol cols={3} tiny={12} mobile={12}>
        <FilterSection
          formMethods={formMethods}
          handleSubmit={loadFireteams}
          tagsProps={{
            definitions: props?.definitions,
            savedTags: tags,
            tagHashesUpdated: setTags,
          }}
          optionsProps={{
            browseFilterDefinitionTree,
            selectorFilterTypes,
            formMethods,
            handleUrlUpdate: updateUrlWithoutRefresh,
          }}
        />
      </GridCol>
      <GridCol className={styles.lobbyCards} cols={9} tiny={12} mobile={12}>
        <div className={styles.tabHeader}>
          <TabAndListings
            setShowingLobbyState={setShowingLobbyState}
            handleUrlUpdate={updateUrlWithoutRefresh}
            activeLobbyState={showingLobbyState}
            matchingLobbyState={CustomLobbyState.Active}
          />
          <TabAndListings
            setShowingLobbyState={setShowingLobbyState}
            handleUrlUpdate={updateUrlWithoutRefresh}
            activeLobbyState={showingLobbyState}
            matchingLobbyState={CustomLobbyState.Inactive}
          />
          <TabAndListings
            setShowingLobbyState={setShowingLobbyState}
            handleUrlUpdate={updateUrlWithoutRefresh}
            activeLobbyState={showingLobbyState}
            matchingLobbyState={CustomLobbyState.Clan}
          />
          <TabAndListings
            setShowingLobbyState={setShowingLobbyState}
            handleUrlUpdate={updateUrlWithoutRefresh}
            activeLobbyState={showingLobbyState}
            matchingLobbyState={CustomLobbyState.Mine}
          />
        </div>
        <div>
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
