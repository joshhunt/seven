import React, { FC, useEffect, useState } from "react";
import { EnumUtils } from "@Utilities/EnumUtils";
import { AlertNotification } from "@Areas/User/AccountComponents/ParentalControls/components";
import { usePlayerContext } from "@Areas/User/AccountComponents/ParentalControls/lib/usePlayerContext";
import { Localizer } from "@bungie/localization";
import { AgeCategoriesEnum, ChildPermissionEnum } from "@Enum";
import { Snackbar } from "@mui/material";
import { PnP } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import { Alert } from "plxp-web-ui/components/base";
import UserSettingsCheckbox from "../UserSettingsCheckbox";
import styles from "./SettingsPanel.module.scss";
import SettingsSection from "./SettingsSection";

interface SettingsPanelProps {
  asContainer?: boolean;
  assignedAccount: any;
}

const SettingsPanel: FC<SettingsPanelProps> = ({
  assignedAccount,
  asContainer,
}) => {
  /* Snackbar Config + Settings */
  const [open, setOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(undefined);
  const [snackPack, setSnackPack] = useState<string[]>([]);
  const showMarathonControls = ConfigUtils.SystemStatus(
    "FeatureMarathonParentalControls"
  );
  const {
    playerContext,
    updatePreferences,
    updatePermissions,
    error,
  } = usePlayerContext();
  const isChild = EnumUtils.looseEquals(
    playerContext?.ageCategory,
    AgeCategoriesEnum.Child,
    AgeCategoriesEnum
  );
  const resetSnackbarKey = () => {
    setSnackbarKey(undefined);
  };

  useEffect(() => {
    snackbarKey && setSnackPack((prev) => [...prev, snackbarKey]);
  }, [snackbarKey]);

  useEffect(() => {
    if (snackPack.length) {
      if (error) {
        setHasError(error);
      }
      // Set a new snack when we don't have an active one
      setSnackbarKey(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, open, error]);

  const [hasError, setHasError] = useState(null);

  const onChange = (id: number, value: boolean) => {
    const deploySnacks = () => {
      setSnackPack((prev) => [...prev, id]);
      setSnackbarKey(id);
      setOpen(true);
    };
    const membershipId = assignedAccount.membershipId;
    if (!isChild) {
      updatePermissions(
        membershipId,
        [{ type: id, value: value, isSetByParentOrGuardian: true }],
        true
      ).then((r) => {
        if (error) {
          setHasError(true);
        }
        deploySnacks();
      });
    } else {
      updatePreferences(membershipId, [{ type: id, value }]).then((r) => {
        if (error) {
          setHasError(true);
        }
        deploySnacks();
      });
    }
  };

  /* Localization */
  const ParentalControlLoc = Localizer.parentalcontrols;
  const {
    SaveSettings,
    SettingsHaveChanged,
    ErrorLabel,
  } = Localizer.parentalcontrols;

  const settingsCopy = {
    summaryText: !isChild
      ? null
      : ParentalControlLoc.ChildControlYourGamingExperience,
    socialSection: {
      heading: ParentalControlLoc.SocialLabel,
      subheading: !isChild
        ? ParentalControlLoc.AdultSocialSubheading
        : ParentalControlLoc.ChildSocialSubheading,
      formElements: {
        one: ParentalControlLoc.AllowVoiceChatAccess,
        two: ParentalControlLoc.AllowTextChatAccess,
      },
    },
    marathonSection: {
      heading: "Marathon",
    },
    storeSection: {
      heading: ParentalControlLoc.StoreAndPurchasesLabel,
      subheading: !isChild
        ? ParentalControlLoc.AdultStoreAndPurchasesSubheading
        : null,
      formElements: {
        one: ParentalControlLoc.EnableLinktoPlatformStore,
      },
    },
    alertSection: {
      heading: ParentalControlLoc.TheseSettingsDoNotImpact,
      subheading: isChild
        ? ParentalControlLoc.ThereAreOtherControlsChild
        : ParentalControlLoc.ThereAreOtherControlsAdult,
    },
  };

  const extractSettingsById = (id: number) => {
    if (assignedAccount.childData) {
      const { childData } = assignedAccount;
      const permission = childData.permissions.find(
        (p: PnP.ChildPermission) => p?.type === id
      ) || { id: id, value: true };
      const preference = childData.preferences.find(
        (p: PnP.ChildPreference) => p?.type === id
      ) || { id: id, value: false };

      return {
        permission: permission,
        preference: preference,
      };
    }
  };

  return (
    <div
      className={classNames({
        [styles.container]: asContainer,
        [styles.accordionPanel]: !asContainer,
      })}
    >
      {settingsCopy?.summaryText && (
        <p className={styles.sectionCopy}>{settingsCopy.summaryText}</p>
      )}
      {/* Social */}
      <SettingsSection
        heading={settingsCopy.socialSection.heading}
        subheading={settingsCopy.socialSection.subheading}
      >
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(
            ChildPermissionEnum.IsAccessVoiceChatAllowed
          )}
          variant={ChildPermissionEnum.IsAccessVoiceChatAllowed}
          isChild={isChild}
          handleOnChange={onChange}
        />
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(
            ChildPermissionEnum.IsAccessTextChatAllowed
          )}
          variant={ChildPermissionEnum.IsAccessTextChatAllowed}
          isChild={isChild}
          handleOnChange={onChange}
        />
        {/* Marathon */}
        {showMarathonControls ? (
          <SettingsSection
            heading={settingsCopy.marathonSection.heading}
            subSection
          >
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(
                ChildPermissionEnum.IsJoinGroupWithoutInviteAllowed
              )}
              variant={ChildPermissionEnum.IsJoinGroupWithoutInviteAllowed}
              isChild={isChild}
              handleOnChange={onChange}
            />
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(
                ChildPermissionEnum.IsReceiveGroupInvitesAllowed
              )}
              variant={ChildPermissionEnum.IsReceiveGroupInvitesAllowed}
              isChild={isChild}
              handleOnChange={onChange}
            />

            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(
                ChildPermissionEnum.IsSendGroupInvitesAllowed
              )}
              variant={ChildPermissionEnum.IsSendGroupInvitesAllowed}
              isChild={isChild}
              handleOnChange={onChange}
            />
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(
                ChildPermissionEnum.IsReceiveBungieFriendRequestsAllowed
              )}
              variant={ChildPermissionEnum.IsReceiveBungieFriendRequestsAllowed}
              isChild={isChild}
              handleOnChange={onChange}
            />
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(
                ChildPermissionEnum.IsSharePlatformIdAllowed
              )}
              variant={ChildPermissionEnum.IsSharePlatformIdAllowed}
              isChild={isChild}
              handleOnChange={onChange}
            />
          </SettingsSection>
        ) : null}
      </SettingsSection>
      {/* Store */}
      <SettingsSection
        heading={settingsCopy?.storeSection?.heading}
        subheading={settingsCopy.storeSection?.subheading}
      >
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(
            ChildPermissionEnum.IsCommerceBuySilverAllowed
          )}
          variant={ChildPermissionEnum.IsCommerceBuySilverAllowed}
          isChild={isChild}
          handleOnChange={onChange}
        />
      </SettingsSection>
      <AlertNotification
        alertTitle={settingsCopy.alertSection.heading}
        icon={null}
        alertMessage={settingsCopy.alertSection.subheading}
      />
      <Snackbar
        key={snackbarKey}
        TransitionProps={{ onExited: resetSnackbarKey }}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={() => setOpen(false)}
      >
        <div>
          <Alert
            onClose={() => setOpen(false)}
            severity={hasError ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%", minWidth: "200px" }}
          >
            <p>{hasError ? ErrorLabel : SaveSettings}</p>
            <p>{hasError ? hasError : SettingsHaveChanged}</p>
          </Alert>
        </div>
      </Snackbar>
    </div>
  );
};

export default SettingsPanel;
