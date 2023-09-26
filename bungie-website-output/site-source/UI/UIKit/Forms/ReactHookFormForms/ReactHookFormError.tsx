// Created by atseng, 2023
// Copyright Bungie, Inc.

import React from "react";

interface ReactHookFormErrorProps {
  error?: string;
  className?: string;
}

export const ReactHookFormError: React.FC<ReactHookFormErrorProps> = (
  props
) => {
  if (!props.error) {
    return null;
  }

  return (
    <div className={props.className}>
      <p>{props.error}</p>
    </div>
  );
};
