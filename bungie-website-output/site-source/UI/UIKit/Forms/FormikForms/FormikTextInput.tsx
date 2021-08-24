// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useField } from "formik";
import React, { ChangeEvent, MouseEventHandler } from "react";

interface FormikTextInputProps {
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Specifies input type */
  type: string;
  /** Label marked as "for" the input tag */
  label?: string;
  /** Initial placeholder */
  placeholder?: string;
  /** Optional function called on input value change */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Passed by default to the input tag */
  className?: string;
  /** Controls whether or not the input value can be modified */
  disabled?: boolean;
}

export const FormikTextInput: React.FC<FormikTextInputProps> = ({
  label,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input
        {...field}
        {...props}
        onChange={(e) => {
          props.onChange && props.onChange(e);
          field.onChange(e);
        }}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};
