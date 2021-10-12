// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Icon } from "@UIKit/Controls/Icon";
import styles from "./FormikCheckbox.module.scss";
import classNames from "classnames";
import { useField } from "formik";
import React, { HTMLProps } from "react";

interface FormikCheckboxProps extends HTMLProps<HTMLInputElement> {
  /** Required, otherwise clicking on the text acting as a label will not change the checkbox. */
  label: string;
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Optional onChange function */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  classes,
  disabled,
  overrideChecked,
  ...props
}) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({
    ...props,
    type: "checkbox",
    name: props.name,
  });
  const checked = field.checked || !!overrideChecked || field.value === "true";

  const checkboxClasses = classNames(styles.checkbox, {
    [styles.checked]: checked,
    [styles.disabled]: disabled,
  });

  const wrapperClasses = classNames(
    styles.checkboxWrapper,
    classes?.checkboxWrapper
  );

  const labelClasses = classNames(styles.label, classes?.label);

  return (
    <div className={wrapperClasses}>
      <label className={classes?.labelAndCheckbox}>
        <div className={checkboxClasses}>
          <div className={styles.check}>
            <input
              type="checkbox"
              name={field.name}
              checked={checked}
              onChange={field.onChange}
              className={classes?.input}
              {...field}
              {...props}
            />
            <Icon iconType={"material"} iconName={"done"} />
          </div>
        </div>
        <span className={labelClasses}>{props.label}</span>
      </label>
      {meta.touched && meta.error && typeof meta.error === "string" && (
        <div className={classes?.error}>{meta.error}</div>
      )}
    </div>
  );
};
