import React, { FC, useState, useEffect } from "react";
import { FormControlLabel, FormGroup, Divider } from "@mui/material";
import { Checkbox } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization";

interface UserSettingsCheckboxProps {
  isChild?: boolean;
  handleOnChange?: (id: number, value: boolean) => void;
  variant?: number;
  userPermissionsAndPreferences?: any;
}

const UserSettingsCheckbox: FC<UserSettingsCheckboxProps> = ({
  userPermissionsAndPreferences,
  variant,
  handleOnChange,
  isChild,
}) => {
  const {
    assignedAccountPermission,
    assignedAccountPreference,
  } = userPermissionsAndPreferences;

  const getDefaultChecked = () => {
    if (isChild) {
      if (!assignedAccountPermission?.value) {
        return false;
      }

      return assignedAccountPreference?.value || false;
    }

    if (!isChild) {
      return assignedAccountPreference?.value || false;
    }

    return false;
  };

  /*TODO map this stuff to the real enums (the numbers are already 1:1 with what will be the enums) */
  const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
  type Key = typeof keys[number];
  const LABEL_MAP: Record<Key, string> = {
    0: "Invalid",
    1: Localizer.parentalcontrols.AllowTextChatAccess,
    2: Localizer.parentalcontrols.AllowVoiceChatAccess,
    3: "CharacterSelectOffers", // not used
    4: Localizer.parentalcontrols.EnableLinktoPlatformStore,
    5: "CommerceDialogsAndUpsells", // not used
    6: "EververseRecommendations", // not used
    7: "RankPurchasing", // not used
    8: Localizer.parentalcontrols.AllowOtherPlayersToJoin,
    9: Localizer.parentalcontrols.AllowPlayerToReceiveCrew,
    10: Localizer.parentalcontrols.AllowPlayerToSendCrew,
    11: Localizer.parentalcontrols.AllowPlayerToSendBungie,
    12: "SharePlatformId", // not used
  };

  return variant ? (
    <FormGroup>
      <FormControlLabel
        sx={{ margin: "0.5rem 0" }}
        control={
          <Checkbox
            disabled={isChild ? !assignedAccountPermission?.value : false}
            defaultChecked={getDefaultChecked()}
            onChange={(value) =>
              handleOnChange(
                assignedAccountPreference?.id,
                value?.currentTarget?.checked
              )
            }
          />
        }
        label={LABEL_MAP[variant]}
      />
      <Divider
        sx={(theme) => ({
          borderColor: "#272833",
          borderWidth: "1px",
        })}
      />
    </FormGroup>
  ) : null;
};

export default UserSettingsCheckbox;
