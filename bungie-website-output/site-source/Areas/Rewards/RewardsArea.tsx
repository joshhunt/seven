import { Reward } from "@Areas/Rewards/Reward";
import { Rewards } from "@Areas/Rewards/Rewards";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router-dom";

export default function RewardsArea() {
  const rewardsPath = RouteDefs.Areas.Rewards.getAction("Rewards").path;
  const rewardPath = RouteDefs.Areas.Rewards.getAction("Reward").path;

  return (
    <SwitchWithErrors>
      <Route path={rewardsPath} component={Rewards} />
      <Route path={rewardPath} component={Reward} />
    </SwitchWithErrors>
  );
}
