// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./RadioButtons.module.scss";
import classNames from "classnames";
import { Field } from "formik";
import React from "react";

export interface RadioButtonsProps {
  radioGroupName: string;
  radioOptions: IRadioOption[];
  className?: string;
}

export interface IRadioOption {
  id: string;
  value: string;
  label: string;
}

export const RadioButtons: React.FC<RadioButtonsProps> = (props) => {
  const radioInput = (
    id: string,
    value: string,
    label: string,
    radioGroupName: string
  ) => {
    const radioId = `${radioGroupName}-${id}`;

    return (
      <>
        <Field
          id={radioId}
          type={"radio"}
          value={value}
          name={radioGroupName}
        />
        <label htmlFor={radioId} className={styles.radioLabel}>
          {label}
        </label>
      </>
    );
  };

  return (
    <div
      className={classNames(styles.radioContainer, props.className)}
      role={"group"}
      aria-labelledby={`${props.radioGroupName}-radio-group`}
    >
      {props.radioOptions.map((r) => {
        return radioInput(r.id, r.value, r.label, props.radioGroupName);
      })}
    </div>
  );
};
