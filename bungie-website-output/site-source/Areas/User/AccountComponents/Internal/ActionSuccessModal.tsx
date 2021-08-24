// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import React from "react";

interface ActionSuccessModalProps {}

export const ActionSuccessModal: React.FC<ActionSuccessModalProps> = (
  props
) => {
  return (
    <div>
      <h1>{Localizer.friends.success}</h1>
      <p>{Localizer.friends.successdesc}</p>
    </div>
  );
};
