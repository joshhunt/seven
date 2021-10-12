// Created by jlauer, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { EmailValidationStatus, OptInFlags } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { AuthTemporaryGlobalState, ShowAuthModal } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface MarketingOptInButtonProps {
  /**
   * The label shown on the button if the user has yet to sign up for email updates
   */
  notSignedUpLabel?: ReactNode;

  /**
   * The label shown on the button if the user has already signed up for email updates
   */
  alreadySignedUplabel?: ReactNode;

  /**
   * By default, this button has the analytics ID "marketing-opt-in", but you can replace it if you like.
   */
  analyticsIdOverride?: string;
  className?: string;
}

const aggregateEmailSetting =
  OptInFlags.Newsletter |
  OptInFlags.Marketing |
  OptInFlags.Social |
  OptInFlags.UserResearch;

const updateEmailSettings = (membershipId: string, onSuccess: () => void) => {
  const input: Contract.UserEditRequest = {
    membershipId: membershipId,
    addedOptIns: aggregateEmailSetting.toString(),
    removedOptIns: null,
    displayName: null,
    about: null,
    locale: null,
    emailAddress: null,
    statusText: null,
  };

  Platform.UserService.UpdateUser(input)
    .then(() => {
      onSuccess();

      GlobalStateDataStore.refreshUserAndRelatedData(true);

      Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
        position: "br",
      });
    })
    .catch(ConvertToPlatformError)
    .catch((e) => Modal.error(e));
};

/**
 * Shows a button to opt in to marketing emails if the user has not already done that.
 * @param props
 * @constructor
 */
export const MarketingOptInButton: React.FC<MarketingOptInButtonProps> = (
  props
) => {
  const { children, alreadySignedUplabel, notSignedUpLabel, className } = props;

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [settingsUpdating, setSettingsUpdating] = useState(false);
  const modalRef = useRef<Modal>();
  const [attemptedSignUp, setAttemptedSignUp] = useState(false);

  // If the user attempted to sign up but needed to log in, we'll catch that state so they don't have to
  // click the button again.
  useEffect(() => {
    if (attemptedSignUp) {
      setEmailSettings();
      setAttemptedSignUp(false);
    }
  }, [globalState]);

  const isLoggedIn = UserUtils.isAuthenticated(globalState);

  let emailValid = false,
    emailSettingDisabled = false,
    showEmailSettingsButton = false,
    userAlreadySignedUpUpdates = false;

  if (isLoggedIn) {
    emailValid =
      globalState.loggedInUser.emailStatus === EmailValidationStatus.VALID;
    emailSettingDisabled =
      (parseInt(globalState.loggedInUser.emailUsage, 10) &
        aggregateEmailSetting) ===
      0;
    showEmailSettingsButton =
      !isLoggedIn || (emailValid && emailSettingDisabled);
    userAlreadySignedUpUpdates =
      isLoggedIn && emailValid && !emailSettingDisabled;
  }

  const setEmailSettings = () => {
    // Prompt for login
    if (!isLoggedIn) {
      ShowAuthModal(
        {
          onSignIn: () => {
            modalRef.current?.close();
            setAttemptedSignUp(true);
          },
        },
        modalRef
      );

      return;
    }

    // Prompt for email validation
    if (!emailValid) {
      Modal.open(
        <div>
          {Localizer.FormatReact(Localizer.Destinyreveal.InvalidEmailMessage, {
            updateEmailLink: (
              <Anchor url={RouteHelper.Settings({ category: "Notifications" })}>
                {Localizer.Destinyreveal.ValidateEmailLink}
              </Anchor>
            ),
          })}
        </div>
      );

      return;
    }

    setSettingsUpdating(true);

    updateEmailSettings(globalState.loggedInUser.user.membershipId, () =>
      setSettingsUpdating(false)
    );
  };

  const label = userAlreadySignedUpUpdates
    ? alreadySignedUplabel || Localizer.Destinyreveal.AlreadySignedUpForEmail
    : notSignedUpLabel || Localizer.Destinyreveal.SignUpForEmailUpdates;

  return (
    <Button
      analyticsId={props.analyticsIdOverride ?? "marketing-opt-in"}
      buttonType={"gold"}
      onClick={setEmailSettings}
      loading={settingsUpdating}
      disabled={userAlreadySignedUpUpdates}
      className={className}
    >
      {label}
    </Button>
  );
};
