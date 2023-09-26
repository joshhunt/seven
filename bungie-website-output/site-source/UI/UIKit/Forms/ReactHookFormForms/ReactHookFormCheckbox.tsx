// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Icon } from "@UIKit/Controls/Icon";
import styles from "@UIKit/Forms/FormikForms/FormikCheckbox.module.scss";
import { ReactHookFormError } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormError";
import classNames from "classnames";
import React from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface ReactHookFormCheckboxProps extends UseControllerProps {
  /** Required, otherwise clicking on the text acting as a label will not change the checkbox. */
  label: string;
  /** Provide context where checkbox should not be clickable */
  disabled?: boolean;
  /** Overrides default checkbox checked behavior */
  overrideChecked?: boolean;
  /** Passed by key to matching tag type */
  classes?: {
    checkboxWrapper?: string;
    input?: string;
    error?: string;
    label?: string;
    labelAndCheckbox?: string;
  };
}

export const ReactHookFormCheckbox = ({
  control,
  name,
  label,
  disabled,
  classes,
  overrideChecked,
  ...props
}: ReactHookFormCheckboxProps) => {
  const { field, fieldState } = useController({ control, name });
  const checked =
    field.value === true || !!overrideChecked || field.value === "true";

  const checkboxClasses = classNames(styles.checkbox, {
    [styles.checked]: checked,
    [styles.disabled]: disabled,
  });

  const wrapperClasses = classNames(
    styles.checkboxWrapper,
    classes?.checkboxWrapper
  );
  const labelClasses = classNames(styles.label, classes?.label);

  const error = fieldState?.error?.message;

  return (
    <div className={wrapperClasses}>
      <label className={classes?.labelAndCheckbox}>
        <div className={checkboxClasses}>
          <div className={styles.check}>
            <input
              type="checkbox"
              checked={checked}
              className={classes?.input}
              {...field}
              {...props}
            />
            <Icon iconType={"material"} iconName={"done"} />
          </div>
        </div>
        <span className={labelClasses}>{label}</span>
      </label>
      <ReactHookFormError error={error} />
    </div>
  );
};
