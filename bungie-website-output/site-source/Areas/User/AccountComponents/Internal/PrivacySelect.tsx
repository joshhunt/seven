// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { FormikSelect } from "@UIKit/Forms/FormikForms/FormikSelect";
import { FormikValues } from "formik";
import React from "react";
import styles from "../Privacy.module.scss";

interface PrivacySelectProps {
  title: React.ReactNode;
  name: string;
  options: IDropdownOption[];
  formikProps: FormikValues;
}

export const PrivacySelect: React.FC<PrivacySelectProps> = ({
  title,
  name,
  options,
  formikProps,
}) => {
  return (
    <div className={styles.select}>
      <div>{title}</div>
      <div>
        <FormikSelect
          name={name}
          options={options}
          selectedValue={formikProps.values[name]}
          onChange={(value) => formikProps.setFieldValue(name, value)}
        />
      </div>
    </div>
  );
};
