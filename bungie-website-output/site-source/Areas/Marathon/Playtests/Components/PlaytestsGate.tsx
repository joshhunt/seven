import * as React from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { resolvePlaytestState } from "@Areas/Marathon/Playtests/state";
import { PlaytestState } from "@Areas/Marathon/Playtests/types";
import { PlaytestsSurvey } from "./PlaytestsSurvey";
import { PlaytestsLoggedOut } from "./PlaytestsLoggedOut";
import { PlaytestsStatus } from "./PlaytestsStatus";
import { PlaytestsPending } from "./PlaytestsPending";
import { useEffect, useState } from "react";
import { ContentStackClient } from "Platform/ContentStack/ContentStackClient";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { BnetStackFrequentlyAskedQuestions } from "Generated/contentstack-types";
import FrequentlyAskedQuestions from "@UI/Content/FrequentlyAskedQuestions";
import { PlaytestsChild } from "./PlaytestsChild";
import { AclEnum } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";

export const PlaytestsGate: React.FC = (props) => {
  const gs = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const detail = gs?.loggedInUser;
  const membershipId = detail?.user?.membershipId;
  const birthDate = detail?.birthDate;
  const acls = detail?.userAcls ?? [];

  const [state, setState] = useState<PlaytestState>("loading");
  const [faqData, setFaqData] = React.useState<
    BnetStackFrequentlyAskedQuestions
  >();

  useEffect(() => {
    try {
      const s = resolvePlaytestState({ membershipId, acls, birthDate });
      setState(s);
    } catch {
      setState("error");
    }
  }, [membershipId, acls, birthDate]);

  useEffect(() => {
    ContentStackClient()
      .ContentType("frequently_asked_questions")
      .Entry("blt7006f46784f4e557")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .fetch()
      .then(setFaqData);
  }, [Localizer.CurrentCultureName]);

  function getStateComponent() {
    switch (state) {
      case "loading":
        return null;
      case "notLoggedIn":
        return <PlaytestsLoggedOut />;
      case "underage":
        return <PlaytestsChild />;
      case "approved":
        return <PlaytestsStatus />;
      case "pending":
        return <PlaytestsPending />;
      case "error":
        return <p>An error occurred. Please try again later.</p>;
      case "surveyIncomplete":
        return <PlaytestsSurvey />;
      default:
        return null;
    }
  }
  return (
    <div>
      {getStateComponent()}
      {state !== "surveyIncomplete" && (
        <FrequentlyAskedQuestions
          sectionTitle={faqData?.section_title}
          questions={faqData?.questions?.question_block}
          buttonData={faqData?.link}
        />
      )}
    </div>
  );
};
