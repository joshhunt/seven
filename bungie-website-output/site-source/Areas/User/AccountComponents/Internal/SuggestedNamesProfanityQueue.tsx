// Created by larobinson, 2021
// Copyright Bungie, Inc.
import { Queue } from "@Global/Queue";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";

export class SuggestedNamesProfanityQueue extends Queue {
  // TODO: put "override in here when we get to Typescript 4.3"
  public runFunction = async (func: () => Promise<void>): Promise<void> => {
    const nameValidateThrottle = ConfigUtils.GetParameter(
      SystemNames.UseGlobalBungieDisplayNames,
      "ThrottleMilliseconds",
      1000
    );

    const throttle = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), nameValidateThrottle);
    });

    await Promise.allSettled([throttle, func()]);
  };
}
