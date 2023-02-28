// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import { FireteamRadioOptions } from "@Areas/Fireteams/Shared/FireteamRadioOptions";
import { FireteamUtils } from "@Areas/Fireteams/Shared/FireteamUtils";
import { RadioButtons } from "@Areas/Fireteams/Shared/RadioButtons";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { FireteamPlatform } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Fireteam, Platform } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { Form, Formik, FormikValues } from "formik";
import React from "react";
import styles from "./FireteamJoin.module.scss";

interface FireteamJoinProps {
  fireteam: Fireteam.FireteamSummary;
  refreshFireteam: () => void;
}

export const FireteamJoin: React.FC<FireteamJoinProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);

  const fireteamsLoc = Localizer.Fireteams;

  const isCrossSaved = destinyMembership.isCrossSaved;
  let canJoin = false;

  //join restictions
  if (props.fireteam.platform !== FireteamPlatform.Any) {
    //specific platform

    //has correct membership
    if (
      !!destinyMembership.memberships.find(
        (m) =>
          FireteamUtils.BnetMembershipTypeToFireteamPlatform(
            m.membershipType
          ) === props.fireteam.platform
      )
    ) {
      canJoin = true;
      //set the membershipStore to the correct platform
      FireteamsDestinyMembershipDataStore.actions.updatePlatform(
        FireteamUtils.FireteamPlatformToBnetMembershipType(
          props.fireteam.platform
        ).toString()
      );
    }
  } else {
    //any one can join as long as have characters
    canJoin = Object.keys(destinyMembership.characters)?.length > 0;
  }

  const joinFireteam = (values: FormikValues) => {
    Platform.FireteamService.JoinClanFireteam(
      props.fireteam.groupId,
      props.fireteam.fireteamId,
      destinyMembership?.selectedCharacter?.characterId,
      values.hasMic === FireteamRadioOptions.hasMicRadioOptions()[0].value,
      isCrossSaved
        ? FireteamPlatform.Any
        : FireteamUtils.BnetMembershipTypeToFireteamPlatform(
            destinyMembership?.selectedMembership?.membershipType
          )
    )
      .then(() => {
        props.refreshFireteam();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => Modal.error(e));
  };

  if (!canJoin) {
    return <p>{fireteamsLoc.YouDoNotHaveAnyValidDestiny}</p>;
  }

  return (
    <div className={styles.joinFireteam}>
      <Formik
        initialValues={{
          hasMic: "",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          joinFireteam(values);
        }}
      >
        {(formikProps) => {
          return (
            <Form>
              <h2>{fireteamsLoc.JoinFireteam}</h2>
              <DestinyAccountWrapper
                membershipDataStore={FireteamsDestinyMembershipDataStore}
                showCrossSaveBanner={true}
              >
                {({
                  platformSelector,
                  characterCardSelector,
                }: IAccountFeatures) => (
                  <div>
                    <p>{fireteamsLoc.SelectCharacter}</p>
                    <div className={styles.userSelector}>
                      {platformSelector}
                      {characterCardSelector}
                    </div>
                  </div>
                )}
              </DestinyAccountWrapper>
              <div className={styles.section}>
                <p>{fireteamsLoc.IHaveAMicrophone}</p>
                <RadioButtons
                  radioGroupName={"hasMic"}
                  radioOptions={FireteamRadioOptions.hasMicRadioOptions()}
                />
              </div>
              <Button buttonType={"gold"} size={BasicSize.FullSize}>
                {fireteamsLoc.JoinFireteam}
              </Button>
              <div className={styles.joinWarning}>
                <SafelySetInnerHTML
                  html={Localizer.Format(fireteamsLoc.FireteamTeamJoinWarning, {
                    url: RouteDefs.Areas.Legal.getAction("terms").path,
                  })}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
