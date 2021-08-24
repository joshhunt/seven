// Created by larobinson, 2021
// Copyright Bungie, Inc.

import classNames from "classnames";
import { useField } from "formik";
import React, { HTMLProps } from "react";

interface FormikCheckboxProps extends HTMLProps<HTMLInputElement> {
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Optional onChange function */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  label,
  children,
  ...props
}) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <div className={classNames(props.className)}>
      <input
        type="checkbox"
        checked={field.checked}
        onChange={field.onChange}
        {...field}
        {...props}
      />
      <label htmlFor={field.name}>{label}</label>
      {children}
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};
