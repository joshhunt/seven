// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useField } from "formik";
import React, { ReactElement } from "react";

interface FormikTextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Passed by key to matching tag type */
  classes?: {
    container?: string;
    input?: string;
    error?: string;
    label?: string;
  };
}

export const FormikTextArea: React.FC<FormikTextAreaProps> = ({
  label,
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
        {label}
      </label>
      <textarea
        id={field.name}
        className={classes?.input}
        {...field}
        {...props}
        rows={props.rows ?? 8}
        cols={props.cols ?? 24}
        maxLength={props.maxLength}
      />
      {meta.touched && meta.error && typeof meta.error === "string" ? (
        <div className={classes?.error}>{meta.error}</div>
      ) : null}
    </div>
  );
};
