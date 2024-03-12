// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import SelectTagsModal from "@Areas/FireteamFinder/Components/Create/SelectTagsModal";
import FireteamListingCard from "@Areas/FireteamFinder/Components/Shared/FireteamListingCard";
import { FireteamOptions } from "@Areas/FireteamFinder/Constants/FireteamOptions";
import {
  FireteamFinderValueTypes,
  FireteamFinderValueTypesKeys,
  ValidFireteamFinderValueTypes,
} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  DestinyFireteamFinderListingFilterMatchType,
  DestinyFireteamFinderListingFilterRangeType,
  DestinyFireteamFinderLobbyState,
} from "@Enum";
import { FireteamFinder, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/RouteParams";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ReactHookFormSelect } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormSelect";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useParams } from "react-router";
import tagStyles from "../Create/CreationTags.module.scss";
import styles from "./BrowseFireteams.module.scss";

interface BrowseFireteamsProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {}

const BrowseFireteams: React.FC<BrowseFireteamsProps> = (props) => {
  const getParams = () => UrlUtils.QueryToObject(window.location.search);
  const postParam = (key: string, value: string) => {
    const currentParams = getParams();
    currentParams[key] = value;

    return currentParams;
  };
  const updateUrlWithoutRefresh = (key: string, value: string) => {
    if (key && value) {
      const currentParams = postParam(key, value);
      history.replaceState(
        null,
        null,
        location.pathname + `?${UrlUtils.ObjectToQuery(currentParams)}`
      );
    }
  };

  const [resultsList, setResultsList] = useState<
    FireteamFinder.DestinyFireteamFinderListing[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const { graphId } = useParams<IFireteamFinderParams>();
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const selectorFilterTypes: ValidFireteamFinderValueTypes[] = [
    FireteamFinderValueTypes.applicationRequirement,
    FireteamFinderValueTypes.locale,
    FireteamFinderValueTypes.mic,
    FireteamFinderValueTypes.minGuardianRank,
    FireteamFinderValueTypes.platform,
  ];
  const parseIntAndTestForNumber = (filterValue: string) =>
    !isNaN(parseInt(filterValue)) ? parseInt(filterValue) : null;
  const [showingLobbyState, setShowingLobbyState] = useState<
    DestinyFireteamFinderLobbyState
  >(
    getParams().lobbyState === "1"
      ? DestinyFireteamFinderLobbyState.Inactive
      : DestinyFireteamFinderLobbyState.Active
  );

  const needsIgnoreValue = (key: string) =>
    key === FireteamFinderValueTypes.mic ||
    key === FireteamFinderValueTypes.applicationRequirement ||
    key === FireteamFinderValueTypes.minGuardianRank;
  const browseFilterDefinitionTree = new FireteamOptions(
    props.definitions.DestinyFireteamFinderOptionDefinition
  ).createOptionsTree();
  browseFilterDefinitionTree[FireteamFinderValueTypes.size] = null;

  const initialFilters: Record<string, string> = {};
  selectorFilterTypes.forEach((key: string) => {
    initialFilters[key] = browseFilterDefinitionTree[key].defaultBrowseValue;
  });
  Object.keys(browseFilterDefinitionTree)
    .filter((hash) =>
      selectorFilterTypes.includes(hash as ValidFireteamFinderValueTypes)
    )
    .map((key) => {
      const optionCategory = browseFilterDefinitionTree[key];

      if (needsIgnoreValue(key)) {
        optionCategory.options.push({
          label: Localizer.fireteams.Any,
          value: "-1",
        });
        initialFilters[key] = "-1";
      }
    });
  const paramsObject = getParams();
  Object.keys(paramsObject).forEach((key) => {
    if (key in initialFilters) {
      initialFilters[key] = paramsObject[key];
    }
  });
  const formMethods = useForm({
    defaultValues: { ...initialFilters },
  });

  useEffect(() => {
    if (formMethods.getValues()) {
      loadFireteams(getParams());
    }
  }, [tags, window.location.search]);

  const loadFireteams: SubmitHandler<FieldValues> = (data: FieldValues) => {
    const listingValues: { values: number[]; valueType: number }[] = [];

    Object.keys(data)?.forEach((key: string) => {
      if (data[key] !== "-1" && data[key] !== [] && key !== "lobbyState") {
        const optionCategory = browseFilterDefinitionTree[key];

        if (
          key !== FireteamFinderValueTypes.title &&
          key !== FireteamFinderValueTypes.tags &&
          key !== FireteamFinderValueTypes.activity
        ) {
          listingValues.push({
            values: [parseIntAndTestForNumber(data[key])],
            valueType: optionCategory.hash,
          });
        }
      }
    });

    // a filter value is a listing value with a match type and range type
    const requestFilters = listingValues.map(
      (listingValue: { values: number[]; valueType: number }) => {
        return {
          listingValue,
          matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
          rangeType:
            DestinyFireteamFinderListingFilterRangeType.InRangeInclusive,
        } as FireteamFinder.DestinyFireteamFinderListingFilter;
      }
    );

    // add tags and activity if relevant
    const tagsRequestfilters = {
      listingValue: {
        values: tags.map((tag) => parseInt(tag)),
        valueType: parseIntAndTestForNumber(FireteamFinderValueTypes.tags),
      },
      matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
      rangeType: DestinyFireteamFinderListingFilterRangeType.All,
    };
    if (tags?.length > 0) {
      requestFilters.push(tagsRequestfilters);
    }
    const activityRequestFilters = {
      listingValue: {
        values: [parseInt(graphId)],
        valueType: parseIntAndTestForNumber(FireteamFinderValueTypes.activity),
      },
      matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
      rangeType: DestinyFireteamFinderListingFilterRangeType.All,
    };
    requestFilters.push(activityRequestFilters);

    const input = {
      filters: requestFilters,
      pageSize: 20,
      pageToken: "",
      lobbyState: showingLobbyState,
    };

    if (
      !destinyMembership?.selectedMembership?.membershipId ||
      !destinyMembership?.selectedMembership?.membershipType
    ) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    } else {
      Platform.FireteamfinderService.SearchListingsByFilters(
        input,
        destinyMembership.selectedMembership.membershipType,
        destinyMembership.selectedMembership.membershipId,
        destinyMembership?.selectedCharacter?.characterId
      )
        .then((response) => {
          setResultsList(response.listings);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  };

  const FilterFireteamOptions: React.FC = () => {
    return (
      <div className={styles.selects}>
        {Object.keys(browseFilterDefinitionTree)
          .filter((hash) =>
            selectorFilterTypes.includes(hash as ValidFireteamFinderValueTypes)
          )
          .map((key) => {
            const optionCategory = browseFilterDefinitionTree[key];

            return (
              <div key={key} className={styles.labelAndSelector}>
                <label htmlFor={key}>
                  {
                    Localizer.fireteams[
                      Object.keys(FireteamFinderValueTypes).find(
                        (type: FireteamFinderValueTypesKeys) =>
                          FireteamFinderValueTypes[type] === key
                      )
                    ]
                  }
                </label>
                <ReactHookFormSelect
                  options={optionCategory.options}
                  className={styles.filterMenu}
                  name={key}
                  onChange={(value) => {
                    updateUrlWithoutRefresh(key, value);
                    formMethods.setValue(key, value);
                    loadFireteams(getParams());
                  }}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const FilterFireteamTags: React.FC = () => {
    return (
      <SelectTagsModal
        savedTags={tags}
        tagHashesUpdated={setTags}
        noHeader={true}
        filterView={true}
      />
    );
  };

  const Filters: React.FC = () => {
    return (
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(loadFireteams)}>
          <div className={styles.buttonContainer}>
            <Button
              buttonType={"white"}
              url={RouteHelper.FireteamFinderBrowse()}
            >
              {Localizer.fireteams.Changeactivity}
            </Button>
          </div>
          <div className={styles.title}>{Localizer.fireteams.filters}</div>
          <FilterFireteamOptions />
          <div className={styles.title}>{Localizer.fireteams.tags}</div>
          <FilterFireteamTags />
        </form>
      </FormProvider>
    );
  };

  const tagRemoveHandler = (tagHash: number) => {
    // should tags always be the tag hash as a number, yes, but this is a quick fix
    const newTags = tags.filter((t) => parseInt(t) !== tagHash);

    setTags(newTags);
  };

  return (
    <div>
      <div className={styles.browseFilterTagContainer}>
        <div className={tagStyles.tagsWrapper}>
          <div className={tagStyles.selectTagWrapper}>
            {tags.map((t) => (
              <div
                key={t}
                className={classNames(tagStyles.tag, styles.removableTag)}
                onClick={(e) => tagRemoveHandler(parseInt(t))}
              >
                {
                  props.definitions?.DestinyFireteamFinderLabelDefinition?.get(
                    t
                  ).displayProperties?.name
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.browseContainer}>
        <GridCol cols={5}>
          <Filters />
        </GridCol>
        <GridCol cols={7}>
          <div className={styles.tabHeader}>
            <a
              className={classNames(styles.tabHeaderItemText, {
                [styles.selected]:
                  showingLobbyState === DestinyFireteamFinderLobbyState.Active,
              })}
              onClick={() => {
                setShowingLobbyState(DestinyFireteamFinderLobbyState.Active);
                updateUrlWithoutRefresh(
                  "lobbyState",
                  DestinyFireteamFinderLobbyState.Active.toString()
                );
                loadFireteams(formMethods.getValues());
              }}
            >
              {Localizer.fireteams.active}
            </a>
            <a
              className={classNames(styles.tabHeaderItemText, {
                [styles.selected]:
                  showingLobbyState ===
                  DestinyFireteamFinderLobbyState.Inactive,
              })}
              onClick={() => {
                setShowingLobbyState(DestinyFireteamFinderLobbyState.Inactive);
                updateUrlWithoutRefresh(
                  "lobbyState",
                  DestinyFireteamFinderLobbyState.Inactive.toString()
                );
                loadFireteams(formMethods.getValues());
              }}
            >
              {Localizer.fireteams.inactive}
            </a>
          </div>
          <div>
            {resultsList?.length > 0 ? (
              <div>
                {resultsList.map((listing, index) => (
                  <FireteamListingCard
                    key={index}
                    fireteam={listing}
                    linkToDetails={true}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIcon} />
                <h4 className={classNames(styles.emptyHeader)}>
                  {Localizer.clans.NoFireteamsFound}
                </h4>
                <p>{Localizer.clans.CreateOneOrTryChanging}</p>
              </div>
            )}
          </div>
        </GridCol>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(BrowseFireteams, {
  types: [
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityDefinition",
    "DestinyFireteamFinderOptionDefinition",
  ],
});