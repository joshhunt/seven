// Created by atseng, 2022
// Copyright Bungie, Inc.

import classNames from "classnames";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import styles from "./RadioButtons.module.scss";

export interface RadioButtonsProps {
  formMethods?: UseFormReturn;
  radioOptions: IRadioOption[];
  name: string;
  className?: string;
}

export interface IRadioOption {
  id: string;
  value: string;
  label: string;
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({
  formMethods,
  name,
  radioOptions,
  className,
  ...props
}: RadioButtonsProps) => {
  const radioInput = (
    id: string,
    value: string,
    label: string,
    groupName: string
  ) => {
    const radioId = `${groupName}-${id}`;

    return (
      <>
        <input
          {...formMethods.register(groupName)}
          {...props}
          value={value}
          id={radioId}
          type={"radio"}
        />
        <label htmlFor={radioId} className={styles.radioLabel}>
          {label}
        </label>
      </>
    );
  };

  return (
    <div
      className={classNames(styles.radioContainer, className)}
      role={"group"}
      aria-labelledby={`${name}-radio-group`}
    >
      {radioOptions.map((r) => {
        return radioInput(r.id, r.value, r.label, name);
      })}
    </div>
  );
};
