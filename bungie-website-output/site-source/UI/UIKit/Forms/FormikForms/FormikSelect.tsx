// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { useField } from "formik";
import React, { ChangeEventHandler } from "react";

interface FormikSelectProps {
  /** Name of field, pass in string version of the property you want to map it to */
  name: string;
  /** Options to display */
  options: IDropdownOption[];
  /** If the dropdown should show a selected value outside its internal selection, populate this prop */
  selectedValue?: string;
  /** Function to call when new value is selected*/
  onChange?: (value: string) => void;
  /** Label marked as "for" the select tag */
  label?: string;
  /** Initial placeholder */
  placeholder?: string;
  /** Passed to the select tag by default */
  className?: string;
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  label,
  options,
  onChange,
  selectedValue,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <Dropdown
        options={options}
        {...field}
        {...props}
        onChange={(e) => {
          onChange && onChange(e);
          field.onChange(e);
        }}
        selectedValue={selectedValue}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};
