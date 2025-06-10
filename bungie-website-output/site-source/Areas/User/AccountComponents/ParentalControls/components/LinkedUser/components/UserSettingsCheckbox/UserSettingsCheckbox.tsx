import React, { FC } from "react";
import { ChildPermissionEnum } from "@Enum";
import { FormControlLabel, FormGroup, Divider } from "@mui/material";
import { Checkbox } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization";
import { EnumUtils } from "@Utilities/EnumUtils";

interface UserSettingsCheckboxProps {
  isChild?: boolean;
  handleOnChange?: (id: ChildPermissionEnum, value: boolean) => void;
  variant?: ChildPermissionEnum;
  userPermissionsAndPreferences?: {
    permission: {
      id: ChildPermissionEnum;
      value: boolean;
    };
    preference: {
      id: ChildPermissionEnum;
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
      return preference?.value;
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
              handleOnChange(preference?.id, value?.currentTarget?.checked)
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
