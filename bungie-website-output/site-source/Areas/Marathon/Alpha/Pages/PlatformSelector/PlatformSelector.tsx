// Created by larobinson, 2024
// Copyright Bungie, Inc.

import React, { useEffect } from "react";
import { useHistory } from "react-router";
import moment from "moment";

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Marathon/Alpha/Pages/Registration/Registration.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  setSelectedCredentialType,
  setEligibility,
  setShowConfirmation,
  setValidCredential,
  resetFlow,
  setIsFriendLinkFlow,
} from "@Global/Redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import { SystemNames } from "@Global/SystemNames";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";

interface PlatformSelectorProps {}

export const PlatformSelector: React.FC<PlatformSelectorProps> = () => {
  const dispatch = useAppDispatch();
  const { selectedCredentialType } = useAppSelector(
    (state) => state.registration
  );

  const psnSystem = ConfigUtils.SystemStatus(SystemNames.PSNAuth);
  const steamSystem = ConfigUtils.SystemStatus(SystemNames.SteamIdAuth);
  const xboxSystem = ConfigUtils.SystemStatus(SystemNames.XuidAuth);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const minAge: number = 18;
  const allowedRegions: string[] = ["US", "CA"];
  const registrationSteps = [
    {
      label: "platform_selection >",
      options: ["STEAM", "PLAYSTATION", "XBOX"],
    },
  ];

  const calculateAge = (birthdateStr: string) => {
    const birthdate = moment(birthdateStr, "YYYY-MM-DD").utc();
    const today = moment.utc();

    let age = today.year() - birthdate.year();
    const monthDifference = today.month() - birthdate.month();
    const dayDifference = today.date() - birthdate.date();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };

  const isAgeAndRegionEligible = () => {
    if (!globalState?.loggedInUser?.birthDate) {
      return false;
    }
    const currentAge = calculateAge(globalState?.loggedInUser?.birthDate);

    return (
      currentAge >= minAge &&
      allowedRegions?.includes(globalState?.loggedInUser?.countryOfResidence)
    );
  };

  const checkAndUpdateCredentials = (
    selectedCredentialType: BungieCredentialType
  ) => {
    Platform.UserService.GetCredentialTypesForTargetAccount(
      globalState?.loggedInUser?.user?.membershipId
    )
      .then((response) => {
        const newCredential = response?.find(
          (cred) => cred.credentialType === selectedCredentialType
        );

        if (newCredential) {
          dispatch(setValidCredential(newCredential));
          dispatch(setShowConfirmation(true));
        }
      })
      .catch((error) => {
        Modal.error(error);
      });
  };

  const openLinkWindow = (credentialType: BungieCredentialType) => {
    const onCredentialChange = () => {
      if (globalState?.loggedInUser) {
        GlobalStateDataStore.refreshUserAndRelatedData(true).then(() => {
          checkAndUpdateCredentials(credentialType);
        });
      }
    };

    BrowserUtils.openWindow(
      RouteHelper.SignInPreview(credentialType).url,
      "linkpreviewui",
      onCredentialChange
    );
  };

  const handlePlatformClick = async (
    e: React.MouseEvent,
    platform: BungieCredentialType
  ) => {
    dispatch(setSelectedCredentialType(platform));

    if (UserUtils.isAuthenticated(globalState)) {
      e.preventDefault();
      e.stopPropagation();

      try {
        // Separate the credential check from the authentication context
        const credentials = await Platform.UserService.GetCredentialTypesForTargetAccount(
          globalState?.loggedInUser?.user?.membershipId
        );

        // First, check if user has credentials for the selected platform
        const matchingCredential = credentials?.find(
          (cred) => cred.credentialType === platform
        );

        if (matchingCredential) {
          // User has credential for this platform, update state
          dispatch(setValidCredential(matchingCredential));
          dispatch(setShowConfirmation(true));
          return;
        }

        // No matching credential, open linking flow
        openLinkWindow(platform);
      } catch (error) {
        Modal.error(error);
      }
    }
    // If not authenticated, AuthTrigger will handle opening the sign-in modal
  };

  const SignedInHeader = () => {
    return (
      <>
        <span className={styles.happy}>WELCOME.</span>
        <br />
        <span className={styles.aware}>
          PICK A PLATFORM ACCOUNT FOR MARATHON.
        </span>
        <br />
        <span className={styles.aware}>
          THE ACCOUNT YOU PICK WILL BE FOREVER LINKED TO THIS BUNGIE MEMBERSHIP
          AND YOUR MARATHON SAVE DATA.
        </span>
        <br />
        <span className={styles.happy}>NO PRESSURE.</span>
        <br />
      </>
    );
  };

  const handleAuthClosed = async () => {
    if (UserUtils.isAuthenticated(globalState)) {
      try {
        // If no credential type has been selected, we don't want to do anything
        if (!selectedCredentialType) {
          return;
        }

        // Get the current user's credentials
        const credentials = await Platform.UserService.GetCredentialTypesForTargetAccount(
          globalState?.loggedInUser?.user?.membershipId
        );

        // Check for matching credential
        const matchingCredential = credentials?.find(
          (cred) => cred.credentialType === selectedCredentialType
        );

        if (matchingCredential) {
          dispatch(setValidCredential(matchingCredential));
          dispatch(setShowConfirmation(true));
          return;
        }

        // If no matching credential, open linking window
        openLinkWindow(selectedCredentialType);
      } catch (e) {
        // Only convert and show error if it's not an auth error
        if (e?.errorCode !== "AuthenticationError") {
          ConvertToPlatformError(e);
        }
      }
    }
  };

  const getPlatformDisplayName = (platform: BungieCredentialType) => {
    const platformAsMembershipType = UserUtils.getMembershipTypeFromCredentialType(
      platform
    );

    return Localizer.Platforms[
      EnumUtils.getStringValue(platformAsMembershipType, BungieMembershipType)
    ];
  };

  return (
    <>
      <div className={styles.label}>
        {!UserUtils.isAuthenticated(globalState) ? (
          <span className={styles.required}>LOG IN OR SIGN UP TO CONTINUE</span>
        ) : (
          <SignedInHeader />
        )}
        <br />
        {registrationSteps[0].label}
      </div>
      <div className={styles.platformGrid}>
        {psnSystem && (
          <AuthTrigger
            key={BungieCredentialType.Psnid}
            credential={BungieCredentialType.Psnid}
            onAuthWindowClosed={handleAuthClosed}
          >
            <button
              className={styles.selectionButton}
              onClick={(e) => {
                handlePlatformClick(e, BungieCredentialType.Psnid);
              }}
            >
              {getPlatformDisplayName(BungieCredentialType.Psnid)}
              <span className={styles.arrow}>›</span>
            </button>
          </AuthTrigger>
        )}
        {xboxSystem && (
          <AuthTrigger
            key={BungieCredentialType.Xuid}
            credential={BungieCredentialType.Xuid}
            onAuthWindowClosed={handleAuthClosed}
          >
            <button
              className={styles.selectionButton}
              onClick={(e) => {
                handlePlatformClick(e, BungieCredentialType.Xuid);
              }}
            >
              {getPlatformDisplayName(BungieCredentialType.Xuid)}
              <span className={styles.arrow}>›</span>
            </button>
          </AuthTrigger>
        )}
        {steamSystem && (
          <AuthTrigger
            key={BungieCredentialType.SteamId}
            credential={BungieCredentialType.SteamId}
            onAuthWindowClosed={handleAuthClosed}
          >
            <button
              className={styles.selectionButton}
              onClick={(e) => {
                handlePlatformClick(e, BungieCredentialType.SteamId);
              }}
            >
              {getPlatformDisplayName(BungieCredentialType.SteamId)}
              <span className={styles.arrow}>›</span>
            </button>
          </AuthTrigger>
        )}
        {UserUtils.isAuthenticated(globalState) && (
          <button
            className={`${styles.selectionButton} ${styles.logoutButton}`}
            onClick={() => {
              const returnUrl = window.location.href;

              window.location.href = `/en/User/SignOut?bru=${encodeURIComponent(
                returnUrl
              )}`;
            }}
          >
            SIGN OUT OF THIS ACCOUNT
            <span className={styles.arrow}>›</span>
          </button>
        )}
      </div>
    </>
  );
};
