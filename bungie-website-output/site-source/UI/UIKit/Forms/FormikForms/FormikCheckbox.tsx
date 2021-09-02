// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useField } from "formik";
import React, { HTMLProps } from "react";

interface FormikCheckboxProps extends HTMLProps<HTMLInputElement> {
  /** Required, otherwise clicking on the text acting as a label will not change the checkbox. */
  label: string;
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Optional onChange function */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Passed by key to matching tag type */
  classes?: {
    container?: string;
    input?: string;
    error?: string;
    label?: string;
  };
}

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  classes,
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

  return (
    <div className={classes?.container}>
      <label className={classes?.label}>
        <input
          type="checkbox"
          name={field.name}
          checked={field.checked}
          onChange={field.onChange}
          {...field}
          {...props}
          className={classes?.input}
        />
        <span>{props.label}</span>
      </label>
      {meta.touched && meta.error && typeof meta.error === "string" ? (
        <div className={classes?.error}>{meta.error}</div>
      ) : null}
    </div>
  );
};
