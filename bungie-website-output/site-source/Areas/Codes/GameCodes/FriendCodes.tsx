import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { Typography } from "plxp-web-ui/components/base";
import React, { useEffect, useState } from "react";
import { FriendCodeRow } from "./FriendCodeRow";
import styles from "./FriendCodes.module.scss";

export const FriendCodes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [eligibility, setEligibility] = useState(false);
  const [friendCodes, setFriendCodes] = useState<string[]>([]);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    loadFriendCodes();
  }, [globalState?.loggedInUser]);

  const loadFriendCodes = async () => {
    setIsLoading(true);
    try {
      // Get the cohort name from AclHelper
      const userCohortKey = AclHelper.getMarathonAclAsCohortMapKey(
        globalState?.loggedInUser?.userAcls
      );
      if (!userCohortKey) {
        setEligibility(false);
        setIsLoading(false);
        return;
      }

      // Fetch friend invite URLs from the backend
      const friendUrls = await Platform.UserService.GetMarathonFriendInviteUrls(
        userCohortKey
      );
      if (!friendUrls || friendUrls.length === 0) {
        setEligibility(false);
        setIsLoading(false);
        return;
      }

      setFriendCodes(friendUrls);
      setEligibility(true);
    } catch (error) {
      console.error("Error loading friend codes:", error);
      setEligibility(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Typography
          align="center"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="body1"
        >
          Loading invite links...
        </Typography>
      </div>
    );
  }

  if (!eligibility) {
    return (
      <div className={styles.notEligibleContainer}>
        <Typography
          align="center"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="h5"
          className={styles.notEligibleTitle}
        >
          Friend Codes
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="body1"
          className={styles.notEligibleText}
        >
          You are not eligible to generate invite links at this time.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography
          align="left"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="h5"
          className={styles.title}
        >
          Invite Links
        </Typography>
        <Typography
          align="left"
          color="textSecondary"
          themeVariant="bungie-core"
          variant="body2"
          className={styles.description}
        >
          Share these links with your friends to invite them to join the
          Marathon Alpha. Each invite link can only be used once.
        </Typography>
      </div>

      {friendCodes.length > 0 ? (
        <div className={styles.codesList}>
          {friendCodes.map((code, index) => (
            <FriendCodeRow key={index} code={code} index={index} />
          ))}
        </div>
      ) : null}

      <div className={styles.infoText}>
        <Typography
          align="left"
          color="textSecondary"
          themeVariant="bungie-core"
          variant="caption"
        >
          Invite links can only be used once and expire at the end of the Alpha
          period.
        </Typography>
      </div>
    </div>
  );
};
