// Created by larobinson, 2021
// Copyright Bungie, Inc.
// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { FormikCheckbox } from "@UIKit/Forms/FormikForms/FormikCheckbox";
import classNames from "classnames";
import { FormikProps, FormikValues } from "formik";
import React from "react";
import styles from "../EmailSms.module.scss";

interface EmailSettingsProps {
  label: string;
  value: string;
  formikProps: FormikProps<FormikValues>;
  secondary?: boolean;
}

export const EmailCheckbox: React.FC<EmailSettingsProps> = ({
  label,
  value,
  secondary,
  formikProps,
}) => {
  // This gets run for every value when a checkbox is updated. So when "PlayTestsLocal" is checked,
  // it rerenders the options and when it gets to "Playtests," it sets checked to true.

  const playtestsLocalIsChecked = formikProps
    .getFieldProps("emailFlags")
    .value.includes("playtestsLocal");
  const currentlyRerenderingPlaytestsChecked = value === "playtests";
  const playtestsIsUnchecked = !formikProps
    .getFieldProps("emailFlags")
    .value.includes("playtests");
  let shouldBoxBeChecked = false;

  if (playtestsLocalIsChecked && currentlyRerenderingPlaytestsChecked) {
    if (playtestsIsUnchecked) {
      shouldBoxBeChecked = true;
    }
  } else {
    shouldBoxBeChecked = formikProps
      .getFieldProps("emailFlags")
      .value.includes(value);
  }

  return (
    <div className={classNames(styles.flex, { [styles.secondary]: secondary })}>
      <FormikCheckbox
        name={"emailFlags"}
        value={value}
        overrideChecked={shouldBoxBeChecked}
        label={label}
        classes={{ input: styles.input, labelAndCheckbox: styles.label }}
      />
    </div>
  );
};
