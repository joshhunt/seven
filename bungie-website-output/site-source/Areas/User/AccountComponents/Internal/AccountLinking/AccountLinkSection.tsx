// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import sharedStyles from "@Areas/User/Account.module.scss";
import styles from "@Areas/User/AccountComponents/AccountLinking.module.scss";
import { ConfirmPlatformLinkingModal } from "@Areas/User/AccountComponents/Internal/ConfirmPlatformLinkingModal";
import { SaveButtonBar } from "@Areas/User/AccountComponents/Internal/SaveButtonBar";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { sortUsingFilterArray } from "@Helpers";
import { Contract, Platform, User } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { AccountLinkItem } from "./AccountLinkItem";
import { GoAlert } from "@react-icons/all-files/go/GoAlert";

export enum AccountLinkingFlags {
  None = 0,
  Linked = 1 << 0,
  CrossSaveEligible = 1 << 1,
  CrossSaved = 1 << 2,
  Public = 1 << 3,
}

const validCredentialTypes = [
  BungieCredentialType.Xuid,
  BungieCredentialType.Psnid,
  BungieCredentialType.SteamId,
  BungieCredentialType.StadiaId,
  BungieCredentialType.TwitchId,
  BungieCredentialType.EgsId,
];
const crossSaveIneligibleTypes = [BungieCredentialType.TwitchId];

interface AccountLinkSectionProps {}

export const AccountLinkSection: React.FC<AccountLinkSectionProps> = () => {
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );

  const initialRequestObject: Contract.UserEditRequest = {
    membershipId: isSelf ? loggedInUserId : membershipIdFromQuery,
    displayName: null,
    about: null,
    emailAddress: null,
    locale: null,
    statusText: null,
    showPsnPublic: null,
    showGamertagPublic: null,
    showSteamDisplayNamePublic: null,
    showTwitchDisplayNamePublic: null,
    showStadiaDisplayNamePublic: null,
    // showEgsDisplayNamePublic: null
  };

  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [currentRequestObject, setCurrentRequestObject] = useState<
    Contract.UserEditRequest
  >(initialRequestObject);
  const [accountLinkingFlagMap, setAccountLinkingFlagMap] = useState<
    Record<BungieCredentialType, AccountLinkingFlags>
  >(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [loginCredType, setLoginCredType] = useState<BungieCredentialType>(
    null
  );
  const [linkingModalOpen, setLinkingModalOpen] = useState(false);
  const [credentials, setCredentials] = useState<
    Contract.GetCredentialTypesForAccountResponse[]
  >();
  const [credentialToLink, setCredentialToLink] = useState<
    BungieCredentialType
  >(null);
  const [updateCredentials, setUpdateCredentials] = useState(false);
  const [membershipIds, setMembershipIds] = useState<{ [key: string]: string }>(
    {}
  );

  const onPageMembershipId = isSelf ? loggedInUserId : membershipIdFromQuery;

  const getAccountLinkingFlagMap = (
    userCredentials: BungieCredentialType[],
    userMembershipData: User.UserMembershipData
  ) => {
    return validCredentialTypes.reduce((flagMap, validCredentialType) => {
      const relevantMembership = userMembershipData?.destinyMemberships?.find(
        (m) =>
          UserUtils.getCredentialTypeFromMembershipType(m.membershipType) ===
          validCredentialType
      );

      const isLinked = userCredentials.includes(validCredentialType)
        ? AccountLinkingFlags.Linked
        : AccountLinkingFlags.None;
      const isCrossSaveEligible = !crossSaveIneligibleTypes.includes(
        validCredentialType
      )
        ? AccountLinkingFlags.CrossSaveEligible
        : AccountLinkingFlags.None;
      const isCrossSave = !!relevantMembership?.crossSaveOverride
        ? AccountLinkingFlags.CrossSaved
        : AccountLinkingFlags.None;
      const isPublic = !!globalStateData?.credentialTypes?.find(
        (c) => c.credentialType === validCredentialType
      )?.isPublic
        ? AccountLinkingFlags.Public
        : AccountLinkingFlags.None;

      flagMap[validCredentialType] =
        isLinked | isCrossSaveEligible | isCrossSave | isPublic;

      return flagMap;
    }, {} as Record<BungieCredentialType, AccountLinkingFlags>);
  };

  const getMembershipIdsForCredentials = (
    userMembershipData: User.UserMembershipData
  ) => {
    return userMembershipData.destinyMemberships.reduce(
      (a: { [key: string]: string }, b) => {
        const credential = UserUtils.getCredentialTypeFromMembershipType(
          b.membershipType
        );
        const credentialString = EnumUtils.getStringValue(
          credential,
          BungieCredentialType
        ).toString();

        a[credentialString] = b.membershipId;

        return a;
      },
      {}
    );
  };

  const getLoggedInPlatform = () => {
    Platform.UserService.GetCurrentUserAuthContextState()
      .then((data) => {
        setLoginCredType(data.AuthProvider);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const getMembershipData = (creds: BungieCredentialType[]) =>
    Platform.UserService.GetMembershipDataById(
      onPageMembershipId,
      BungieMembershipType.BungieNext
    )
      .then((data) => {
        setAccountLinkingFlagMap(getAccountLinkingFlagMap(creds, data));
        setMembershipIds(getMembershipIdsForCredentials(data));
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));

  const getCredentialTypesForUser = () => {
    Platform.UserService.GetCredentialTypesForTargetAccount(onPageMembershipId)
      .then((data) => {
        setCredentials(data);
        getMembershipData(data.map((cr) => cr.credentialType));
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  useEffect(() => {
    getLoggedInPlatform();
    setUpdateCredentials(true);
  }, [globalStateData?.loggedInUser]);

  useEffect(() => {
    if (updateCredentials) {
      getCredentialTypesForUser();
      setUpdateCredentials(false);
    }
  }, [updateCredentials]);

  const openLinkingModal = (cr: BungieCredentialType) => {
    setCredentialToLink(cr);
    setLinkingModalOpen(true);
  };

  const filterArray = [
    (cred: BungieCredentialType) => {
      return (
        cred === BungieCredentialType.Xuid &&
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaved
        ) &&
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaveEligible
        )
      );
    },
    (cred: BungieCredentialType) => {
      return (
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaved
        ) &&
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaveEligible
        )
      );
    },
    (cred: BungieCredentialType) => {
      return (
        cred === BungieCredentialType.Xuid &&
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaveEligible
        )
      );
    },
    (cred: BungieCredentialType) => {
      return (
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.Linked
        ) &&
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaveEligible
        )
      );
    },
    (cred: BungieCredentialType) => {
      return (
        EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.Linked
        ) &&
        !EnumUtils.hasFlag(
          accountLinkingFlagMap[cred],
          AccountLinkingFlags.CrossSaveEligible
        )
      );
    },
    (cred: BungieCredentialType) =>
      !EnumUtils.hasFlag(
        accountLinkingFlagMap[cred],
        AccountLinkingFlags.CrossSaveEligible
      ),
  ];

  const onPublicSettingChanged = (
    checked: boolean,
    credentialType: BungieCredentialType
  ) => {
    switch (credentialType) {
      case BungieCredentialType.StadiaId:
        setCurrentRequestObject({
          ...currentRequestObject,
          showStadiaDisplayNamePublic: checked,
        });
        break;
      case BungieCredentialType.Psnid:
        setCurrentRequestObject({
          ...currentRequestObject,
          showPsnPublic: checked,
        });
        break;
      case BungieCredentialType.Xuid:
        setCurrentRequestObject({
          ...currentRequestObject,
          showGamertagPublic: checked,
        });
        break;
      case BungieCredentialType.SteamId:
        setCurrentRequestObject({
          ...currentRequestObject,
          showSteamDisplayNamePublic: checked,
        });
        break;
      case BungieCredentialType.EgsId:
        setCurrentRequestObject({
          ...currentRequestObject,
          showEgsDisplayNamePublic: checked,
        });
        break;
      case BungieCredentialType.TwitchId:
        setCurrentRequestObject({
          ...currentRequestObject,
          showTwitchDisplayNamePublic: checked,
        });
        break;
    }

    setShowSaveButton(true);
  };

  const saveSettings = () => {
    Platform.UserService.UpdateUser(currentRequestObject)
      .then(() => {
        GlobalStateDataStore.refreshUserAndRelatedData(true);
      })
      .then(() =>
        Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
          position: "br",
        })
      )
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const stadiaSunsetCampaignLive = ConfigUtils.SystemStatus(
    SystemNames.StadiaSunsetAlerts
  );

  return (
    <>
      <GridCol
        cols={10}
        medium={12}
        className={classNames(styles.linkingContent)}
      >
        {accountLinkingFlagMap &&
          sortUsingFilterArray(validCredentialTypes, filterArray).map(
            (credential, i) => {
              return (
                <div key={i} className={styles.accountLinkItem}>
                  <AccountLinkItem
                    onPageUserLoggedInCred={isSelf ? loginCredType : null}
                    displayName={
                      credentials?.find((c) => c.credentialType === credential)
                        ?.credentialDisplayName
                    }
                    openLinkingModal={() => openLinkingModal(credential)}
                    flag={accountLinkingFlagMap[credential]}
                    credentialType={credential}
                    onPublicSettingChanged={(checked) =>
                      onPublicSettingChanged(checked, credential)
                    }
                    onCredentialChange={() => {
                      setUpdateCredentials(true);
                    }}
                    membershipSpecificId={
                      membershipIds[
                        EnumUtils.getStringValue(
                          credential,
                          BungieCredentialType
                        )
                      ]
                    }
                  />
                  {stadiaSunsetCampaignLive &&
                    EnumUtils.looseEquals(
                      credential,
                      BungieCredentialType.StadiaId,
                      BungieCredentialType
                    ) && (
                      <div className={styles.stadiaSunsetAlert}>
                        <GoAlert />
                        <span>{Localizer.userPages.StadiaSunsetAlert}</span>
                      </div>
                    )}
                  {i < validCredentialTypes.length - 1 && (
                    <GridDivider cols={12} />
                  )}
                </div>
              );
            }
          )}
      </GridCol>
      <SaveButtonBar
        className={sharedStyles.saveButtonBar}
        saveButton={
          <Button
            buttonType={"gold"}
            onClick={() => {
              saveSettings();
              setShowSaveButton(false);
            }}
          >
            {Localizer.userPages.savesettings}
          </Button>
        }
        showing={showSaveButton}
      />
      <ConfirmPlatformLinkingModal
        open={linkingModalOpen}
        credential={credentialToLink}
        credentials={credentials?.map((c) => c?.credentialType)}
        onClose={() => {
          setLinkingModalOpen(false);
        }}
      />
    </>
  );
};
