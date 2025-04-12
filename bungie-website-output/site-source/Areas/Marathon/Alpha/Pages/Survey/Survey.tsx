// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { DiscordDataHelper } from "@Areas/Marathon/Alpha/Helpers/DiscordDataHelper";
import { SurveyHelper } from "@Areas/Marathon/Alpha/Helpers/SurveyHelper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieCredentialType, EmailValidationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  setStep,
  setSurveyCompleted,
} from "@Global/Redux/slices/registrationSlice";
import { useAppSelector, useAppDispatch } from "@Global/Redux/store";
import { Platform } from "@Platform";
import { EnumUtils } from "@Utilities/EnumUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import React, { FC, useMemo, useEffect, useState } from "react";
import styles from "./Survey.module.scss";

interface SurveyProps {
  onComplete?: () => void;
}

export const Survey: FC<SurveyProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const { validAlphaCredential, isFriendLinkFlow, surveyType } = useAppSelector(
    (state) => state.registration
  );
  const registration = useAppSelector((state) => state.registration);

  const params = new URLSearchParams(document.location.search);
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [surveyWindow, setSurveyWindow] = useState<any>(null);
  const [surveyTaken, setSurveyTaken] = useState(false);

  useEffect(() => {
    Platform.UserService.GetCurrentUser()
      .then((user) => {
        if (
          user?.emailStatus &&
          !(
            (user.emailStatus & EmailValidationStatus.VALID) ===
            EmailValidationStatus.VALID
          )
        ) {
          dispatch(setStep(1));
        }
      })
      .catch((e) => {
        ConvertToPlatformError(e).then((error) => {
          console.error(error);
        });
      });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const url = window.location.href;
  let discordName = DiscordDataHelper.fetchDiscordName(url);

  const customVariables = useMemo(() => {
    return {
      d: params.get("discordId") ?? "",
      dn: discordName,
      ptype: validAlphaCredential?.credentialType
        ? EnumUtils.getStringValue(
            validAlphaCredential.credentialType,
            BungieCredentialType
          )
        : "",
      p: validAlphaCredential?.credentialDisplayName ?? "",
      co: params.get("cohort_id") ?? "",
      b: loggedInUser?.user?.membershipId ?? "",
      e: loggedInUser?.email ?? "",
      uq: params.get("code") ?? "",
      fi:
        registration.friendIndex > 0 ? registration.friendIndex.toString() : "",
      im: registration.inviterId ?? "",
    };
  }, [params, validAlphaCredential, loggedInUser, registration]);

  const transformedVariables = useMemo(() => {
    return Platform.TokensService.EncryptSurveyVariables(customVariables).then(
      (result: any) => {
        return result;
      }
    );
  }, [customVariables]);

  const surveyUrl = useMemo(() => {
    return transformedVariables.then((vars: any) => {
      return `https://www.surveymonkey.com/r/${SurveyHelper.GetSurveyUrlFromType(
        surveyType
      )}?d=${vars.d}&dn=${vars.dn}&ptype=${vars.ptype}&p=${vars.p}&co=${
        vars.co
      }&b=${vars.b}&e=${vars.e}&uq=${vars.uq}&fi=${vars.fi}&im=${vars.im}`;
    });
  }, [transformedVariables, isFriendLinkFlow]);

  const handleOpenSurvey = async () => {
    const resolvedUrl = await surveyUrl;

    const popupWindow: any = BrowserUtils.openWindow(
      resolvedUrl,
      "marathonAlphaSurvey",
      () => {
        setSurveyTaken(true);
        dispatch(setSurveyCompleted(true));
      },
      800,
      600
    );

    setSurveyWindow(popupWindow);
  };

  return (
    <div className={styles.surveyBlock}>
      <div className={styles.commandPrompt}>
        {"> alpha_survey > user_intel"}
      </div>

      {!surveyTaken ? (
        <div className={styles.surveyContent}>
          <div className={styles.surveyDescription}>
            Complete a quick survey to help us optimize your Marathon Alpha
            experience. This information will be used to understand player
            preferences and improve the game.
          </div>

          <button className={styles.selectionButton} onClick={handleOpenSurvey}>
            {"TAKE_SURVEY"}
            <span className={styles.arrow}>›</span>
          </button>

          <div className={styles.surveyNote}>
            The survey will open in a new window. Please complete it entirely to
            continue with your Alpha registration.
          </div>
        </div>
      ) : (
        <div className={styles.thankYouContainer}>
          <div className={styles.thankYouTitle}>{"SURVEY_COMPLETED"}</div>

          <div className={styles.thankYouMessage}>
            You have completed the Marathon Alpha Intake Survey and entered the
            pool of potential Alpha participants!
          </div>

          <div className={styles.nextSteps}>
            You will be contacted with further information if your access is
            approved.
          </div>
        </div>
      )}
    </div>
  );
};
