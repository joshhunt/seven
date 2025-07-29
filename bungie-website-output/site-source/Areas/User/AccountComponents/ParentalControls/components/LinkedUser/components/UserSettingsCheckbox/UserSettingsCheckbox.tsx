import { Localizer } from "@bungie/localization";
import { ChildPermissionEnum, ChildPreferenceEnum } from "@Enum";
import { Divider, FormControlLabel, FormGroup } from "@mui/material";
import { EnumUtils } from "@Utilities/EnumUtils";
import { Checkbox } from "plxp-web-ui/components/base";
import React, { FC } from "react";

interface UserSettingsCheckboxProps {
  isChild?: boolean;
  handleOnChange?: (
    id: ChildPermissionEnum | ChildPreferenceEnum,
    value: boolean
  ) => void;
  variant?: ChildPermissionEnum;
  userPermissionsAndPreferences?: {
    permission: {
      id: ChildPermissionEnum;
      value: boolean;
    };
    preference: {
      id: ChildPreferenceEnum;
      value: boolean;
    };
  };
}

const UserSettingsCheckbox: FC<UserSettingsCheckboxProps> = ({
  userPermissionsAndPreferences,
  variant,
  handleOnChange,
  isChild,
}) => {
  const { permission, preference } = userPermissionsAndPreferences;

  const getDefaultChecked = () => {
    if (isChild) {
      if (!permission?.value) {
        return false;
      }

      return preference?.value;
    }

    if (!isChild) {
      return permission?.value;
    }

    return false;
  };

  const ParentalControlsLoc = Localizer.parentalcontrols;
  const label =
    ParentalControlsLoc[EnumUtils.getStringValue(variant, ChildPermissionEnum)];

  return variant ? (
    <FormGroup>
      <FormControlLabel
        sx={{ margin: "0.5rem 0" }}
        control={
          <Checkbox
            disabled={isChild ? !permission.value : false}
            defaultChecked={getDefaultChecked()}
            onChange={(value) =>
              handleOnChange(
                isChild
                  ? EnumUtils.getEnumValue(preference?.id, ChildPreferenceEnum)
                  : EnumUtils.getEnumValue(permission?.id, ChildPermissionEnum),
                value?.currentTarget?.checked
              )
            }
          />
        }
        label={label}
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
