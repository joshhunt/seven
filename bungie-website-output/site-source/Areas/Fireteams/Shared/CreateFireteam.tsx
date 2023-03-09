// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import { FireteamScheduler } from "@Areas/Fireteams/Shared/FireteamScheduler";
import { FireteamUtils } from "@Areas/Fireteams/Shared/FireteamUtils";
import { RadioButtons } from "@Areas/Fireteams/Shared/RadioButtons";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType, FireteamActivityType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Fireteam, Platform } from "@Platform";
import { IoIosAlert } from "@react-icons/all-files/io/IoIosAlert";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { FormikSelect } from "@UIKit/Forms/FormikForms/FormikSelect";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import "flatpickr/dist/themes/airbnb.css";
import { Field, Form, Formik, FormikValues } from "formik";
import { DateTime } from "luxon";
import React, { FormEvent, useState } from "react";
import * as Yup from "yup";
import styles from "./CreateFireteam.module.scss";
import { FireteamRadioOptions } from "./FireteamRadioOptions";

interface CreateFireteamProps {
  groupId: string;
  onCreate: (groupId: string, fireteamId: string) => void;
  modalRef?: React.RefObject<Modal>;
}

export const CreateFireteam: React.FC<CreateFireteamProps> = (props) => {
  const titleMaxLength = 50;
  const titleMinLength = 3;
  const defaultFireteamActivity = EnumUtils.getNumberValue(
    FireteamActivityType.Anything,
    FireteamActivityType
  );
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const fireteamsLoc = Localizer.Fireteams;

  const isStadiaPrimaryCrossSaved =
    globalState?.crossSavePairingStatus?.primaryMembershipType ===
    BungieMembershipType.TigerStadia;

  const [activitySelected, setActivitySelected] = useState(5);
  const [dateTimeValue, setDateTimeValue] = useState(new Date());
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);

  const currentActivity = globalState?.coreSettings?.fireteamActivities?.find(
    (f) => f.identifier === activitySelected?.toString()
  );

  const fireteamMaxSize = parseInt(
    currentActivity?.childSettings?.find(
      (c) => c.identifier === "maxfireteamsize"
    )?.summary ?? "3",
    10
  );
  const fireteamBg = currentActivity?.childSettings?.find(
    (c) => c.identifier === "widebackground"
  )?.imagePath;

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  if (
    !destinyMembership?.characters ||
    Object.keys(destinyMembership.characters).length === 0
  ) {
    return <p>{Localizer.Clans.adestiny2characterisrequired}</p>;
  }

  const createFireteam = (values: FormikValues) => {
    const input: Fireteam.FireteamCreationRequest = {
      title: values.fireteamTitle,
      isPublic: values.isPublic === "0",
      activityType: parseInt(values.fireteamActivity, 10),
      platform: FireteamUtils.BnetMembershipTypeToFireteamPlatform(
        values.membershipType
      ),
      locale: values.locale,
      ownerCharacterId:
        destinyMembership?.selectedCharacter?.characterId ?? values.characterId,
      playerSlotCount: parseInt(values.players, 10),
      preferNativePlatform: isStadiaPrimaryCrossSaved
        ? false
        : values.platform === "1",
      ownerHasMicrophone: values.hasMic === "0",
      scheduledTime:
        values.isScheduled === "1"
          ? DateTime.fromJSDate(dateTimeValue).toUTC().toISO()
          : "",
    };

    Platform.FireteamService.CreateClanFireteam(input, props.groupId ?? "0")
      .then((result) => {
        props.onCreate(result.Summary.groupId, result.Summary.fireteamId);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      });
  };

  const handleSchedulingEvents = (e: FormEvent | MouseEvent) => {
    const ele = e.target as HTMLInputElement;

    if (ele.name === "isScheduled") {
      const value =
        ele.value === FireteamRadioOptions.isScheduledRadioOptions()[1].value;

      openDateTimePicker !== value && setOpenDateTimePicker(value);
    }
  };

  return (
    <div className={styles.createFireteamContainer}>
      <Formik
        initialValues={{
          fireteamTitle: "",
          membershipType: destinyMembership?.selectedMembership?.membershipType,
          characterId: destinyMembership?.selectedCharacter?.characterId,
          fireteamActivity: defaultFireteamActivity.toString(),
          platform: FireteamRadioOptions.platformRadioOptions()[0].value,
          players: FireteamRadioOptions.playersRadioOptions(fireteamMaxSize)[0]
            .value,
          isScheduled: FireteamRadioOptions.isScheduledRadioOptions()[0].value,
          hasMic: "",
          locale: Localizer.CurrentCultureName,
          isPublic: FireteamRadioOptions.isPublic()[0].value,
          scheduledTime: DateTime.now(),
        }}
        validationSchema={Yup.object({
          fireteamTitle: Yup.string()
            .nullable()
            .required("Required")
            .max(
              titleMaxLength,
              Localizer.Format(fireteamsLoc.MustBeBetweenMinlength, {
                minLength: titleMinLength,
                maxLength: titleMaxLength,
              })
            ),
          players: Yup.string().required("Required"),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          createFireteam(values);
        }}
      >
        {(formikProps) => {
          return (
            <Form onChange={(e) => handleSchedulingEvents(e)}>
              <div
                className={styles.header}
                style={{ backgroundImage: `url(${fireteamBg})` }}
              >
                <h2>{fireteamsLoc.CreateFireteam}</h2>
                <div className={styles.activities}>
                  <h6 className={styles.sectionHeader}>
                    {fireteamsLoc.IWantToPlay}
                  </h6>
                  <FormikSelect
                    options={FireteamUtils.activityOptions(
                      globalState.coreSettings,
                      true
                    )}
                    name={"fireteamActivity"}
                    selectedValue={formikProps.values.fireteamActivity}
                    onChange={(value) => {
                      formikProps.setFieldValue("fireteamActivity", value);
                      setActivitySelected(parseInt(value, 10));
                    }}
                  />
                </div>
              </div>
              <div className={styles.body}>
                <div className={classNames(styles.title, styles.section)}>
                  <h6 className={styles.sectionHeader}>
                    {fireteamsLoc.FireteamTitle}
                  </h6>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <FormikTextInput
                      name={"fireteamTitle"}
                      type={"text"}
                      placeholder={fireteamsLoc.EnterFireteamTitle}
                    />
                  </div>
                </div>
                <div className={classNames(styles.character, styles.section)}>
                  <h6>{fireteamsLoc.SelectCharacterAndPlatform}</h6>
                  <Field
                    type={"hidden"}
                    id={"membershipType"}
                    name={"membershipType"}
                    value={
                      destinyMembership?.selectedMembership?.membershipType
                    }
                  />
                  <Field
                    type={"hidden"}
                    id={"characterId"}
                    name={"characterId"}
                    value={destinyMembership?.selectedCharacter?.characterId}
                  />
                  <DestinyAccountWrapper
                    membershipDataStore={FireteamsDestinyMembershipDataStore}
                    showCrossSaveBanner={true}
                  >
                    {({
                      platformSelector,
                      characterCardSelector,
                    }: IAccountFeatures) => (
                      <div>
                        <div className={styles.userSelector}>
                          {platformSelector}
                          {characterCardSelector}
                        </div>
                      </div>
                    )}
                  </DestinyAccountWrapper>
                </div>
                <div className={classNames(styles.additionalOptions)}>
                  <div
                    className={classNames(styles.playerCount, styles.section)}
                  >
                    <h6 className={styles.errorBlock}>
                      {fireteamsLoc.PlayersNeeded}
                      {formikProps.errors.players && <IoIosAlert />}
                    </h6>
                    <div className={styles.section}>
                      <RadioButtons
                        radioGroupName={"players"}
                        radioOptions={FireteamRadioOptions.playersRadioOptions(
                          fireteamMaxSize
                        )}
                      />
                    </div>
                  </div>
                  <div className={classNames(styles.options, styles.section)}>
                    <h6>{fireteamsLoc.Options}</h6>
                    {!isStadiaPrimaryCrossSaved && (
                      <div className={styles.section}>
                        <p>{fireteamsLoc.PlayWithAllPlatformsRecommended}</p>
                        <RadioButtons
                          radioGroupName={"platform"}
                          radioOptions={FireteamRadioOptions.platformRadioOptions()}
                        />
                      </div>
                    )}

                    <div
                      className={styles.section}
                      onClick={(e) => handleSchedulingEvents(e)}
                    >
                      <p>{fireteamsLoc.WantToPlayNowOrInTheFuture}</p>
                      <RadioButtons
                        radioGroupName={"isScheduled"}
                        radioOptions={FireteamRadioOptions.isScheduledRadioOptions()}
                      />
                      {openDateTimePicker && (
                        <FireteamScheduler
                          dateTimeValue={new Date()}
                          setDateTimeValue={(value) => {
                            setDateTimeValue(value);
                          }}
                        />
                      )}
                    </div>
                    <div className={styles.section}>
                      <p>{fireteamsLoc.IHaveAMicrophone}</p>
                      <RadioButtons
                        radioGroupName={"hasMic"}
                        radioOptions={FireteamRadioOptions.hasMicRadioOptions()}
                      />
                    </div>
                    {props.groupId && props.groupId !== "0" && (
                      <div className={styles.section}>
                        <p>{fireteamsLoc.PublicFireteamLabel}</p>
                        <RadioButtons
                          radioGroupName={"isPublic"}
                          radioOptions={FireteamRadioOptions.isPublic()}
                        />
                      </div>
                    )}
                    <div className={styles.section}>
                      <p>{fireteamsLoc.Language}</p>
                      <FormikSelect
                        name={"locale"}
                        options={FireteamUtils.langOptions()}
                        selectedValue={formikProps.values.locale}
                        onChange={(value) => {
                          formikProps.setFieldValue("locale", value);
                        }}
                        className={styles.localeSelector}
                      />
                    </div>
                  </div>
                  {/*<div className={classNames(styles.tag, styles.section)}>
										<h6>{fireteamsLoc.Tag}</h6>
									</div>*/}
                  <button
                    type={"submit"}
                    className={styles.submitButtonWrapper}
                  >
                    <Button buttonType={"gold"} size={BasicSize.FullSize}>
                      {fireteamsLoc.OpenFireteam}
                    </Button>
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
