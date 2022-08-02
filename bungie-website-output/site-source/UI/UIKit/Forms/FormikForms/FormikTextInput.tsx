// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useField } from "formik";
import React, { ChangeEvent } from "react";

interface FormikTextInputProps {
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Specifies input type */
  type: string;
  /** Label marked as "for" the input tag */
  label?: string;
  /** Initial placeholder */
  placeholder?: string;
  /* Maximum character limit. Number as string. */
  maxlength?: string;
  /** Optional function called on input value change */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Optional function called on input focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Optional function called on input blur */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Passed by key to matching tag type */
  classes?: {
    container?: string;
    input?: string;
    error?: string;
    label?: string;
  };
  /** Controls whether or not the input value can be modified */
  disabled?: boolean;
}

export const FormikTextInput: React.FC<FormikTextInputProps> = ({
  classes,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <div className={classes?.container}>
      <label htmlFor={field.name} className={classes?.label}>
        {props.label}
      </label>
      <input
        {...field}
        {...props}
        id={field.name}
        className={classes?.input}
        onChange={(e) => {
          props.onChange && props.onChange(e);
          field.onChange(e);
        }}
        onFocus={(e) => (props.onFocus ? props.onFocus(e) : null)}
        onBlur={(e) => (props.onBlur ? props.onBlur(e) : null)}
      />
      {meta.touched && meta.error && typeof meta.error === "string" ? (
        <div className={classes?.error}>{meta.error}</div>
      ) : null}
    </div>
  );
};
