import * as React from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { resolvePlaytestStatus } from "../Helpers/PlaytestsHelper";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "./PlaytestsSurvey.module.scss";

export const PlaytestsSurvey: React.FC<any> = (props) => {
  React.useEffect(() => {
    const prevBg =
      typeof document !== "undefined"
        ? document.body.style.backgroundColor
        : "";
    const prevColor =
      typeof document !== "undefined" ? document.body.style.color : "";
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "#fff";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.backgroundColor = prevBg;
        document.body.style.color = prevColor;
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Playtest Survey</h1>
        <p>
          Please complete the survey below. It includes an NDA acknowledgement.
        </p>
      </div>
      <div className={styles.panel}>
        <iframe
          title="Playtests Survey"
          src="https://playstationresearch.qualtrics.com/jfe/form/SV_1zTnC5rSTBk75pY"
          className={styles.surveyFrame}
        />
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => {
              props.history.push(RouteHelper.MarathonPlaytestsStatus().url);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export const PlaytestsSurveyLoader: React.FC<any> = (props) => {
  const gs = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [loading, setLoading] = React.useState(true);
  const membershipId = gs?.loggedInUser?.user?.membershipId;

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const status = await resolvePlaytestStatus(membershipId);
      if (!mounted) return;
      if (status !== "surveyIncomplete") {
        props.history.replace(RouteHelper.MarathonPlaytestsStatus().url);
      } else {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [membershipId]);

  if (loading) return null;
  return <PlaytestsSurvey {...props} />;
};
