// Created by larobinson, 2025
// Copyright Bungie, Inc.

import React from "react";

export type SurveyType = "Slim" | "FriendSurvey" | "Standard" | "General";
export class SurveyHelper {
  public static SurveyUrlMap: Record<SurveyType, string> = {
    Slim: "marathonalphaslim",
    Standard: "marathonalphastandard",
    FriendSurvey: "marathonalphafriend",
    General: "marathonalphageneral",
  };

  public static GetSurveyUrlFromType(surveyType: SurveyType): string | null {
    return SurveyHelper.SurveyUrlMap[surveyType] || null;
  }
}
