import * as React from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { useQualtricsEmbed } from "@Areas/Marathon/Playtests/Hooks/useQualtricsEmbed";
import styles from "./PlaytestsSurvey.module.scss";

interface PlaytestsSurveyProps {
  onSurveyCompleted?: () => void;
}

export const PlaytestsSurvey: React.FC<PlaytestsSurveyProps> = ({
  onSurveyCompleted,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "credentialTypes",
  ]);
  const surveySrc = useQualtricsEmbed(globalState);
  const membershipId = globalState?.loggedInUser?.user?.membershipId;
  const [showToast, setShowToast] = React.useState(false);

  // This is temporary to support the test while we wait for the right API key for qualtrics
  const markSurveyCompleted = React.useCallback(() => {
    try {
      const key = "marathon-playtests-survey-completed";
      let map: Record<string, boolean> = {};
      const existing = localStorage.getItem(key);
      if (existing) {
        try {
          map = JSON.parse(existing) || {};
        } catch {
          map = {};
        }
      }
      if (membershipId) {
        map[String(membershipId)] = true;
        localStorage.setItem(key, JSON.stringify(map));
      }
    } catch {
      /* ignore */
    }
    onSurveyCompleted?.();
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3000);
  }, [membershipId, onSurveyCompleted]);

  return (
    <>
      <iframe
        id="surveyFrame"
        width="100%"
        height="1100"
        title="Playtests Survey"
        src={surveySrc}
        style={{ border: 0 }}
      />
      <button
        className={styles.completeButton}
        onClick={markSurveyCompleted}
        aria-label="I have completed the survey"
      >
        I have completed the survey
      </button>
      <div className={styles.completeHelper}>
        If the survey doesn't advance automatically, click this to continue.
      </div>
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          Marked as completed
        </div>
      )}
    </>
  );
};
