import React, { FC, useState, useEffect } from "react";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import { Snackbar } from "@mui/material";
import { Alert } from "plxp-web-ui/components/base";
import SettingsSection from "./SettingsSection";
import { ParentalControls, Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { ParentalControlsResponseStatus } from "@Enum";
import UserSettingsCheckbox from "../UserSettingsCheckbox";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  asContainer?: boolean;
  assignedAccount: any;
  currentUserType?: any;
}

const SettingsPanel: FC<SettingsPanelProps> = ({
  assignedAccount,
  currentUserType,
  asContainer,
}) => {
  /* Snackbar Config + Settings */
  const [open, setOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(undefined);
  const [snackPack, setSnackPack] = useState<string[]>([]);
  const showMarathonControls = ConfigUtils.SystemStatus(
    "FeatureMarathonParentalControls"
  );
  /*  const { updatePreferences, updatePermissions, refreshPlayerContext  } = usePlayerContext();*/

  const resetSnackbarKey = () => {
    setSnackbarKey(undefined);
  };

  useEffect(() => {
    snackbarKey && setSnackPack((prev) => [...prev, snackbarKey]);
  }, [snackbarKey]);

  useEffect(() => {
    if (snackPack.length) {
      // Set a new snack when we don't have an active one
      setSnackbarKey(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, open]);

  const [isSaved, setIsSaved] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [updatedPreference, setUpdatedPreference] = useState([]);

  /* Remove logs, remove timeout */
  const updateSettings = () => {
    let status: ParentalControlsResponseStatus;

    setIsLoading(true);
    /* const membershipId = currentUserType === 3 ? playerContext.membershipId ? : assignedAccount.childData.memberShipId*/
    /*updatePreferences(playerContext.membershipId, {...newSettings})*/

    /*      
		  Preserving just in case but will probably be removed with function above.
		  Platform.UserService.UpdateParentalControlPermissionsForChild({Permissions: updatedPermissions}, linkedAccount.PlayerId)
                    .then(r => {
                        status = r.StatusCode;
        
                        if (r.StatusCode === 20) {
                            setIsSaved(true)
                            setIsUpdated(false)
                        }
        
                        if (r.StatusCode === 50) {
                            setError(r?.ErrorMessage);
                            setIsSaved(false)
                            setIsUpdated(true)
                            setIsLoading(false)
                        }
                    })
                    .catch(ConvertToPlatformError)
                    .catch(e => {
                        console.log(e)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    });*/
  };

  /* wire this onchange up */
  const onChange = (id: number, value: boolean) => {
    if (id) {
      setSnackPack((prev) => [...prev, id]);
      const updatedItem = updatedPreference.map((itm) =>
        itm.id === id ? { ...itm, Value: value } : itm
      );
      setSnackbarKey(id);
      setOpen(true);
      setUpdatedPreference(updatedItem);
    }
  };

  /* Localization */
  const ParentalControlLoc = Localizer.parentalcontrols;
  const saveLabel = ParentalControlLoc.SaveSettings;
  const saveMessage = ParentalControlLoc.SettingsHaveChanged;
  const errorLabel = ParentalControlLoc.ErrorLabel;

  const settingsCopy = {
    summaryText:
      currentUserType === 3
        ? null
        : ParentalControlLoc.ChildControlYourGamingExperience,
    socialSection: {
      heading: ParentalControlLoc.SocialLabel,
      subheading:
        currentUserType === 3
          ? ParentalControlLoc.AdultSocialSubheading
          : ParentalControlLoc.ChildSocialSubheading,
      formElements: {
        one: ParentalControlLoc.AllowVoiceChatAccess,
        two: ParentalControlLoc.AllowTextChatAccess,
      },
    },
    maratonSection: {
      heading: "Marathon",
    },
    storeSection: {
      heading: ParentalControlLoc.StoreAndPurchasesLabel,
      subheading:
        currentUserType === 3
          ? ParentalControlLoc.AdultStoreAndPurchasesSubheading
          : null,
      formElements: {
        one: ParentalControlLoc.EnableLinktoPlatformStore,
      },
    },
  };

  const extractSettingsById = (id: number) => {
    if (
      Array.isArray(assignedAccount.childData) &&
      assignedAccount.childData?.length > 0
    ) {
      const [child] = assignedAccount.childData;
      const permission = child.permissions.find((p) => p.id === id);
      const preference = child.preferences.find((p) => p.id === id);

      return {
        permission: permission || null,
        preference: preference || null,
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
      <SettingsSection
        heading={settingsCopy.socialSection.heading}
        subheading={settingsCopy.socialSection.subheading}
      >
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(2)}
          variant={2}
          isChild={currentUserType === 1}
        />
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(1)}
          variant={1}
          isChild={currentUserType === 1}
        />
        {showMarathonControls ? (
          <SettingsSection
            heading={settingsCopy.maratonSection.heading}
            subSection
          >
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(8)}
              variant={8}
              isChild={currentUserType === 1}
            />
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(9)}
              variant={9}
              isChild={currentUserType === 1}
            />

            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(10)}
              variant={10}
              isChild={currentUserType === 1}
            />
            <UserSettingsCheckbox
              userPermissionsAndPreferences={extractSettingsById(11)}
              variant={11}
              isChild={currentUserType === 1}
            />
          </SettingsSection>
        ) : null}
      </SettingsSection>
      <SettingsSection
        heading={settingsCopy.storeSection.heading}
        subheading={settingsCopy.storeSection?.subheading}
      >
        <UserSettingsCheckbox
          userPermissionsAndPreferences={extractSettingsById(4)}
          variant={4}
          isChild={currentUserType === 1}
        />
      </SettingsSection>
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
            severity={error?.length > 0 ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            <p>{error?.length > 0 ? errorLabel : saveLabel}</p>
            <p>{error?.length > 0 ? error : saveMessage}</p>
          </Alert>
        </div>
      </Snackbar>
    </div>
  );
};

export default SettingsPanel;
