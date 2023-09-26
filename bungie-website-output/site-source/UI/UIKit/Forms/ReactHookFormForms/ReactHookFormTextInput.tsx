// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ReactHookFormError } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormError";
import React from "react";
import {
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

interface IReactHookFormTextInputProps extends UseControllerProps {
  /** Initial placeholder */
  placeholder?: string;
  /** Label marked as "for" the input tag */
  label?: string;
  /** Controls whether or not the input value can be modified */
  disabled?: boolean;
  /** Passed by key to matching tag type */
  classes?: {
    container?: string;
    inputWrapper?: string;
    input?: string;
    error?: string;
    label?: string;
  };
  /** a special text input that will validate or format based on the type attribute */
  textInputTypeAttribute?: "url" | "email" | "tel" | "password" | "time";
}

export const ReactHookFormTextInput = ({
  control,
  name,
  label,
  classes,
  textInputTypeAttribute,
  ...props
}: IReactHookFormTextInputProps) => {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState?.error?.message;

  return (
    <div className={classes?.container}>
      <label htmlFor={name} className={classes?.label}>
        {label}
      </label>
      <div className={classes?.inputWrapper}>
        <input
          className={classes?.input}
          {...field}
          {...props}
          id={name}
          type={textInputTypeAttribute ?? "text"}
        />
      </div>
      <ReactHookFormError error={error} className={classes?.error} />
    </div>
  );
};
