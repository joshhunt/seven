import * as React from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import styles from "./PlaytestsSurvey.module.scss";
import { resolvePlaytestState } from "@Areas/Marathon/Playtests/state";
import { PlaytestState } from "@Areas/Marathon/Playtests/types";
import {
  getSurveyCompletedForUser,
  is18OrOlder,
} from "@Areas/Marathon/Helpers/PlaytestsHelper";
import { AclHelper } from "@Areas/Marathon/Helpers/AclHelper";
import { PlaytestsSurvey } from "./PlaytestsSurvey";
import { PlaytestsLoggedOut } from "./PlaytestsLoggedOut";
import { PlaytestsStatus } from "./PlaytestsStatus";
import { PlaytestsPending } from "./PlaytestsPending";

export const PlaytestsGate: React.FC<any> = (props) => {
  const gs = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const detail: any = gs?.loggedInUser;
  const membershipId = detail?.user?.membershipId;
  const birthDate = detail?.birthDate;

  const rawAcls = Array.isArray(detail?.userAcls)
    ? detail.userAcls
    : Array.isArray(detail?.AclEnums)
    ? detail.AclEnums
    : [];
  const acls: any[] = rawAcls ?? [];

  const [state, setState] = React.useState<PlaytestState>("loading");
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    resolvePlaytestState(
      { membershipId, acls, birthDate },
      {
        fetchSurveyCompleted: getSurveyCompletedForUser,
        hasCodesAccess: AclHelper.hasGameCodesAccess,
        is18OrOlder,
      }
    )
      .then((s) => {
        if (mounted) {
          setState(s);
        }
      })
      .catch(() => {
        if (mounted) {
          setState("error");
        }
      });
    return () => {
      mounted = false;
    };
  }, [membershipId, acls, birthDate, refreshKey]);

  if (state === "loading") return null;

  if (state === "notLoggedIn") {
    return <PlaytestsLoggedOut />;
  }

  if (state === "underage") {
    return <p className={styles.childMessage}>This feature isn’t available.</p>;
  }

  if (state === "approved") {
    return <PlaytestsStatus />;
  }

  if (state === "pending") {
    return <PlaytestsPending />;
  }

  if (state === "error") {
    return (
      <p className={styles.childMessage}>
        An error occurred. Please try again later.
      </p>
    );
  }

  // surveyIncomplete, pending, notEligible -> show survey iframe, with a manual completion button for e2e test
  return (
    <PlaytestsSurvey
      {...props}
      onSurveyCompleted={() => setRefreshKey((k) => k + 1)}
    />
  );
};
