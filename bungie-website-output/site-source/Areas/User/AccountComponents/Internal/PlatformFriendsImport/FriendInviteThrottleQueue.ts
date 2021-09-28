// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Queue } from "@Global/Queue";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";

export class FriendInviteThrottleQueue extends Queue {
  // put "override in here when we get to Typescript 4.3"
  public runFunction = async (func: Promise<void>) => {
    const friendImportThrottle = ConfigUtils.GetParameter(
      SystemNames.BungieFriends,
      "FriendsInviteMiniThrottleMilliseconds",
      100
    );
    const friendThrottleExtraTime = ConfigUtils.GetParameter(
      SystemNames.BungieFriends,
      "FriendThrottleExtraClientDelay",
      0
    );

    const throttle = new Promise<void>((resolve, reject) => {
      setTimeout(
        () => resolve(),
        friendImportThrottle + friendThrottleExtraTime
      );
    });

    await Promise.allSettled([throttle, func]);
  };
}
