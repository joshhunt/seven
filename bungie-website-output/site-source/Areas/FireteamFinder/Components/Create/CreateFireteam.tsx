// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { CrossSaveActiveBadge } from "@Areas/CrossSave/Activate/Components/CrossSaveActiveBadge";
import { CreateTitleInput } from "@Areas/FireteamFinder/Components/Create/CreateTitleInput";
import CreationTags from "@Areas/FireteamFinder/Components/Create/CreationTags";
import { FireteamScheduler } from "@Areas/FireteamFinder/Components/Create/FireteamScheduler";
import { ActivityStamp } from "@Areas/FireteamFinder/Components/Shared/ActivityStamp";
import {
  IRadioOption,
  RadioButtons,
} from "@Areas/FireteamFinder/Components/Shared/RadioButtons";
import { FireteamOptions } from "@Areas/FireteamFinder/Constants/FireteamOptions";
import { FireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { DestinyDefinitions } from "@Definitions";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Platform } from "@Platform";
import { IoIosAlert } from "@react-icons/all-files/io/IoIosAlert";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { ReactHookFormSelect } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormSelect";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import "flatpickr/dist/themes/airbnb.css";
import React, { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as Yup from "yup";
import {
  BungieMembershipType,
  DestinyFireteamFinderLobbyPrivacyScope,
} from "@Enum";
import styles from "./CreateFireteam.module.scss";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface CreateFireteamProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderOptionDefinition"
    | "DestinyFireteamFinderActivitySetDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyClassDefinition"
    | "DestinyRaceDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  activityGraphId: string;
  activityId: string;
  updateStep: React.Dispatch<React.SetStateAction<number>>;
}

const CreateFireteam: React.FC<CreateFireteamProps> = (props) => {
  const makeActivityTree = (
    activityGraphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition
  ) => {
    // RETURN a tree of activity hashes including the current activityGraphDefinition hash and all of its parents' hashes
    const tree: number[] = [];
    let currentActivityGraphDefinition = activityGraphDefinition;

    while (currentActivityGraphDefinition) {
      tree.push(currentActivityGraphDefinition.hash);
      currentActivityGraphDefinition = props.definitions.DestinyFireteamFinderActivityGraphDefinition.get(
        currentActivityGraphDefinition.parentHash
      );
    }

    return tree;
  };

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const fireteamsLoc = Localizer.Fireteams;
  const history = useHistory();
  const activityHashId = props.activityId;
  const activityGraphDef = props.definitions.DestinyFireteamFinderActivityGraphDefinition.get(
    props.activityGraphId
  );
  const activityDef = props.definitions.DestinyActivityDefinition.get(
    activityHashId
  );

  const minGuardianRanks = props.definitions.DestinyFireteamFinderOptionDefinition.get(
    FireteamFinderValueTypes.minGuardianRank
  )?.values;
  const isStadiaPrimaryCrossSaved =
    globalState?.crossSavePairingStatus?.primaryMembershipType ===
    BungieMembershipType.TigerStadia;

  // Bnet service will consider a null value for dateTimeValue as "now" when creating a fireteam and try to activate it immediately
  const [dateTimeValue, setDateTimeValue] = useState<string>(null);
  const [titleStrings, setTitleStrings] = useState<string[]>([]);
  const [titleHashes, setTitleHashes] = useState<number[]>([]);
  const [tagsStrings, setTagsStrings] = useState<string[]>([]);

  const fireteamOptionTree = new FireteamOptions(
    props.definitions.DestinyFireteamFinderOptionDefinition
  ).createOptionsTree();

  const activityMaxSize = activityDef?.matchmaking?.maxParty;

  const initialValues = {
    membershipType: destinyMembership?.selectedMembership?.membershipType,
    characterId: destinyMembership?.selectedCharacter?.characterId,
    fireteamActivity: activityDef.hash,
    platform:
      fireteamOptionTree[FireteamFinderValueTypes.platform].defaultCreateValue,
    players: activityMaxSize.toString(),
    isScheduled: "0",
    applicationRequirement:
      fireteamOptionTree[FireteamFinderValueTypes.applicationRequirement]
        .defaultCreateValue,
    hasMic:
      fireteamOptionTree[FireteamFinderValueTypes.mic].defaultCreateValue ??
      "0",
    locale:
      fireteamOptionTree[FireteamFinderValueTypes.locale].defaultCreateValue,
    minimumRank:
      fireteamOptionTree[FireteamFinderValueTypes.minGuardianRank]
        .defaultCreateValue ?? "3212108350",
    isPublic: "1",
    scheduledTime: dateTimeValue,
    joinSetting:
      fireteamOptionTree[FireteamFinderValueTypes.joinSetting]
        .defaultCreateValue ?? "0",
  };

  const validationSchema = Yup.object({
    players: Yup.string().required("Required"),
  });

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { ...(initialValues as any) },
  });

  useEffect(() => {
    if (!destinyMembership?.selectedCharacter) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyMembership?.characters]);

  const getRelevantActivitySetLabelHashes = (
    activityGraphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition
  ) => {
    const activitySetDefinitions = props.definitions.DestinyFireteamFinderActivitySetDefinition.all();

    const relevantActivitySets = Object.values(activitySetDefinitions).filter(
      (activitySet) => {
        return activitySet?.activityGraphHashes?.includes(
          activityGraphDefinition.hash
        );
      }
    );

    return relevantActivitySets
      .map((activitySet) => activitySet.labelHashes)
      .flat();
  };

  const onSubmit = (data: FieldValues) => {
    const membershipId = destinyMembership?.selectedMembership?.membershipId;
    const membershipType =
      destinyMembership?.selectedMembership?.membershipType;
    const characterId = destinyMembership?.selectedCharacter?.characterId;

    if (
      !membershipId ||
      membershipId === "" ||
      !membershipType ||
      EnumUtils.looseEquals(
        BungieMembershipType[membershipType],
        BungieMembershipType?.None,
        BungieMembershipType
      ) ||
      !characterId ||
      characterId === ""
    ) {
      Modal.open(<div>{Localizer.Fireteams.ErrorLoadingMembership}</div>);
    }

    Platform.FireteamfinderService.HostLobby(
      {
        maxPlayerCount: data.players,
        // onlinePlayersOnly will always be false for fireteam lobbies created on the site
        onlinePlayersOnly: false,
        // applicationRequirement value of 0 means 'Auto-Join' (aka Open), value of 1 means 'Application Required)
        privacyScope:
          parseInt(data.applicationRequirement) === 0
            ? DestinyFireteamFinderLobbyPrivacyScope.Open
            : DestinyFireteamFinderLobbyPrivacyScope.Applications,
        scheduledDateTime: data.isScheduled === "1" ? dateTimeValue : null,
        activityGraphHash: parseInt(props.activityGraphId),
        activityHash: parseInt(props.activityId),
        // this is not supported in the Beta
        clanId: "0",
        listingValues: [
          ...FireteamUtils.getListingValuesFromFireteamOptions(
            titleHashes,
            tagsStrings.map((tag) => parseInt(tag)),
            !isNaN(parseInt(data.locale)) ? parseInt(data.locale) : 0,
            !isNaN(parseInt(data.minimumRank)) ? parseInt(data.minimumRank) : 0,
            parseInt(data.hasMic),
            parseInt(data.platform),
            parseInt(data.applicationRequirement),
            parseInt(data.joinSetting),
            parseInt(data.players)
          ),
          {
            valueType: parseInt(FireteamFinderValueTypes.activity),
            values: makeActivityTree(activityGraphDef),
          },
        ],
      },
      membershipType,
      membershipId,
      characterId
    )
      .then((lobby) => {
        history.push(
          RouteHelper.FireteamFinderDetail({
            lobbyId: lobby.lobbyId,
          }).url
        );
      })
      .catch(ConvertToPlatformError)
      .catch((error) => {
        Modal.error(error);
      });
  };

  if (
    destinyMembership?.characters === null ||
    Object.keys(destinyMembership.characters).length === 0
  ) {
    return <p>{Localizer.Clans.adestiny2characterisrequired}</p>;
  }

  const playerOptions: IRadioOption[] = [];
  Array(activityMaxSize)
    .fill(0)
    .map((_, i) => {
      !(i === 0) &&
        playerOptions.push({
          id: i.toString(),
          value: (i + 1).toString(),
          label: (i + 1).toString(),
        });
    });

  const convertDropdownToRadioButtonOptions = (
    options: IDropdownOption[]
  ): IRadioOption[] => {
    return options.map((opt, i) => {
      return { id: i.toString(), value: opt.value, label: opt.label as string };
    });
  };

  return (
    <div className={styles.createFireteamContainer}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className={styles.body}>
            <div className={styles.activitySection}>
              <ActivityStamp
                activityGraphDefinitions={
                  props.definitions
                    ?.DestinyFireteamFinderActivityGraphDefinition
                }
                activityGraphId={props.activityGraphId}
              />
              <Button
                buttonType={"gold"}
                className={styles.link}
                url={RouteHelper.FireteamFinderCreateSelectActivity()}
              >
                {Localizer.fireteams.Changeactivity}
              </Button>
            </div>

            <div className={classNames(styles.title, styles.section)}>
              <h6>{fireteamsLoc.BuildListingTitle}</h6>
              <CreateTitleInput
                placeholder={fireteamsLoc.ClickToBuildTitle}
                className={styles.titleInput}
                titleStrings={titleStrings}
                openTitleBuilderOnClick={true}
                removeOnClick={false}
                updateTitleStrings={setTitleStrings}
                updateTitleHashes={setTitleHashes}
                relevantActivitySetLabelHashes={getRelevantActivitySetLabelHashes(
                  activityGraphDef
                )}
              />
            </div>

            <div className={styles.tags}>
              <CreationTags setTagsStrings={setTagsStrings} />
            </div>
            <div className={classNames(styles.additionalOptions)}>
              <h6>{fireteamsLoc.ListingSettings}</h6>
              <div className={styles.sectionWrapper}>
                <div className={styles.section}>
                  <label
                    className={styles.schedulerLabel}
                    htmlFor={"isScheduled-radio-group"}
                  >
                    {fireteamsLoc.ScheduledQuestion}
                  </label>
                  <RadioButtons
                    formMethods={formMethods}
                    name={"isScheduled"}
                    radioOptions={convertDropdownToRadioButtonOptions(
                      fireteamOptionTree[FireteamFinderValueTypes.scheduled]
                        .options
                    )}
                  />
                  <div className={styles.scheduledGap}>
                    {formMethods.watch("isScheduled") === "1" ? (
                      <div className={styles.section}>
                        <label
                          className={styles.schedulerLabel}
                          htmlFor={"dateTimePicker"}
                        >
                          {fireteamsLoc.ChooseAStartTime}
                        </label>
                        <div className={styles.schedulerWrapper}>
                          <FireteamScheduler
                            dateTimeValue={dateTimeValue}
                            setDateTimeValue={(value: string) => {
                              let newDate = new Date(value);
                              newDate.setSeconds(0);
                              setDateTimeValue(newDate.toUTCString());
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className={styles.warningBlock}>
                        <IoIosAlert /> <>{fireteamsLoc.nowalert}</>
                      </p>
                    )}
                  </div>
                </div>

                <div className={classNames(styles.section)}>
                  <p className={styles.errorBlock}>
                    {fireteamsLoc.FireteamSize}
                    {formMethods.formState.errors.players && <IoIosAlert />}
                  </p>
                  <div className={styles.section}>
                    <RadioButtons
                      className={styles.numberButtons}
                      formMethods={formMethods}
                      name={"players"}
                      radioOptions={playerOptions}
                    />
                  </div>
                </div>

                <div className={classNames(styles.section)}>
                  <p>{fireteamsLoc.ApplicationRequirement}</p>
                  <div className={styles.section}>
                    <RadioButtons
                      formMethods={formMethods}
                      name={"applicationRequirement"}
                      radioOptions={convertDropdownToRadioButtonOptions(
                        fireteamOptionTree[
                          FireteamFinderValueTypes.applicationRequirement
                        ].options
                      )}
                    />
                  </div>
                </div>

                {!isStadiaPrimaryCrossSaved ? (
                  <div className={styles.section}>
                    <p>{fireteamsLoc.PreferredPlatform}</p>
                    <RadioButtons
                      formMethods={formMethods}
                      name={"platform"}
                      radioOptions={convertDropdownToRadioButtonOptions(
                        fireteamOptionTree[FireteamFinderValueTypes.platform]
                          .options
                      )}
                    />
                  </div>
                ) : (
                  <div>{Localizer.Fireteams.StadiaNotSupported}</div>
                )}
                <div className={styles.section}>
                  <p>{Localizer.Fireteams.Microphone}</p>
                  <RadioButtons
                    formMethods={formMethods}
                    name={"hasMic"}
                    radioOptions={convertDropdownToRadioButtonOptions(
                      fireteamOptionTree[FireteamFinderValueTypes.mic].options
                    )}
                  />
                </div>
                <div className={styles.section}>
                  <p>{fireteamsLoc.Language}</p>
                  <ReactHookFormSelect
                    name={"locale"}
                    options={
                      fireteamOptionTree[FireteamFinderValueTypes.locale]
                        .options
                    }
                    selectedValue={formMethods.getValues("locale")}
                    onChange={(value) => {
                      formMethods.setValue("locale", value);
                    }}
                    className={styles.localeSelector}
                  />
                </div>
                <div className={styles.section}>
                  <p>{fireteamsLoc.MinimumGuardianRank}</p>
                  <ReactHookFormSelect
                    name={"minimumRank"}
                    options={minGuardianRanks.valueDefinitions.map(
                      (valueDefinition) => {
                        return {
                          label: valueDefinition.displayProperties.name,
                          value: valueDefinition.value.toString(),
                        };
                      }
                    )}
                    selectedValue={formMethods.getValues("minimumRank")}
                    onChange={(value) => {
                      formMethods.setValue("minimumRank", value);
                    }}
                    className={styles.localeSelector}
                  />
                </div>

                <div className={styles.section}>
                  <p>{fireteamsLoc.JoinSettings}</p>
                  <ReactHookFormSelect
                    name={"locale"}
                    options={
                      fireteamOptionTree[FireteamFinderValueTypes.joinSetting]
                        .options
                    }
                    selectedValue={formMethods.getValues("joinSetting")}
                    onChange={(value) => {
                      formMethods.setValue("joinSetting", value);
                    }}
                    className={styles.localeSelector}
                  />
                </div>
              </div>
            </div>
            <div className={classNames(styles.character, styles.section)}>
              <h6>{fireteamsLoc.SelectCharacterAndPlatform}</h6>
              <div className={styles.sectionWrapper}>
                <input
                  type={"hidden"}
                  {...formMethods.register("membershipType")}
                />
                <input
                  type={"hidden"}
                  {...formMethods.register("characterId")}
                />
                <DestinyAccountWrapper
                  membershipDataStore={FireteamsDestinyMembershipDataStore}
                  showCrossSaveBanner={false}
                >
                  {({
                    platformSelector,
                    characterCardSelector,
                  }: IAccountFeatures) => (
                    <div>
                      {destinyMembership?.isCrossSaved && (
                        <CrossSaveActiveBadge
                          className={styles.crosssaveBadge}
                        />
                      )}
                      <div className={styles.userSelector}>
                        <div className={styles.extraPlatformSelector}>
                          <DestinyPlatformSelector
                            userMembershipData={
                              destinyMembership.membershipData
                            }
                            onChange={(value) =>
                              FireteamsDestinyMembershipDataStore.actions.updatePlatform(
                                value as any
                              )
                            }
                            defaultValue={
                              destinyMembership.selectedMembership
                                .membershipType
                            }
                            showAllCrossSavedPlatforms={true}
                            currentOptionClassName={styles.currentOption}
                          />
                        </div>
                        {characterCardSelector}
                      </div>
                    </div>
                  )}
                </DestinyAccountWrapper>
              </div>
            </div>
            <div className={styles.submitButtonWrapper}>
              <Button submit buttonType={"gold"} size={BasicSize.FullSize}>
                {fireteamsLoc.CreateListing}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default withDestinyDefinitions(CreateFireteam, {
  types: [
    "DestinyFireteamFinderActivitySetDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityDefinition",
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyClassDefinition",
    "DestinyRaceDefinition",
    "DestinyInventoryItemLiteDefinition",
    "DestinyFireteamFinderOptionDefinition",
  ],
});
