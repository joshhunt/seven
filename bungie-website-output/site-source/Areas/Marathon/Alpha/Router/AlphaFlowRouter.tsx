// Copyright Bungie, Inc.
import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";
import { DiscordDataHelper } from "@Areas/Marathon/Alpha/Helpers/DiscordDataHelper";
import { SurveyType } from "@Areas/Marathon/Alpha/Helpers/SurveyHelper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { AclEnum } from "@Enum";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { usePrevious } from "@Utilities/ReactUtils";
import styles from "../Pages/Registration/Registration.module.scss";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  setCohortId,
  setIsFriendLinkFlow,
  setInviterId,
  setInviterCohort,
  setFriendIndex,
  setSurveyType,
} from "@Global/Redux/slices/registrationSlice";
import { useAppDispatch } from "@Global/Redux/store";
import { Platform } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";
import React, { FC, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface AlphaFlowRouterProps {
  children: React.ReactNode;
}

export const AlphaFlowRouter: FC<AlphaFlowRouterProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const prevGlobalState = usePrevious(globalState);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const wasAuthed = UserUtils.isAuthenticated(prevGlobalState);
    const isNowAuthed = UserUtils.isAuthenticated(globalState);

    if (!isNowAuthed && wasAuthed) {
      DiscordDataHelper.clearDiscordData();
    }
  }, [globalState]);

  useEffect(() => {
    const processQueryParams = async () => {
      if (!UserUtils.isAuthenticated(globalState)) {
        setLoading(false);
        return;
      }

      if (
        !location.search ||
        location.search === "?" ||
        location.search === ""
      ) {
        setError(
          <span>
            This link is missing some important information. Please use the link
            that was shared with you. Or check out{" "}
            <a
              href="https://www.discord.gg/marathonthegame"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#7289DA", textDecoration: "underline" }}
            >
              discord.gg/marathonthegame
            </a>{" "}
            for more information on how to sign up for Alpha.
          </span>
        );
        setLoading(false);
        return;
      }
      const params = new URLSearchParams(location.search);

      const dataParam = sanitizeHTML(params.get("data")).__html;
      const cohortIdParam = sanitizeHTML(params.get("cohort_id")).__html;
      const discordId = DiscordDataHelper.fetchDiscordId(window.location.href);
      const discordName = DiscordDataHelper.fetchDiscordName(
        window.location.href
      );

      // Validate Discord parameters if present
      if (discordId || discordName) {
        if (discordId) {
          const discordIdValidation = DiscordDataHelper.isValidDiscordId(
            discordId
          );
          if (!discordIdValidation.valid) {
            setError(`Invalid Discord ID: ${discordIdValidation.message}`);
            setLoading(false);
            return;
          }
        }

        if (discordName) {
          const discordNameValidation = DiscordDataHelper.isValidDiscordUser(
            discordName
          );
          if (!discordNameValidation.valid) {
            setError(
              `Invalid Discord username: ${discordNameValidation.message}`
            );
            setLoading(false);
            return;
          }
        }
      }

      try {
        if (cohortIdParam) {
          const config = await Platform.TokensService.GetCohortConfig(
            cohortIdParam
          );
          dispatch(setCohortId(cohortIdParam));
          dispatch(setSurveyType(config?.SurveyType as SurveyType));
          setLoading(false);
          return;
        }

        const hasMarathonAccess = AclHelper.hasMarathonAccess(
          globalState?.loggedInUser?.userAcls
        );
        const hasGeneralAccess = globalState?.loggedInUser?.userAcls?.find(
          (acl: AclEnum) => {
            return acl === AclEnum.MarathonAlpha_General;
          }
        );

        if (hasMarathonAccess) {
          if (!(hasGeneralAccess && (cohortIdParam || dataParam))) {
            history.push({
              pathname: "/en/Codes/GameCodes",
              search: location.search,
            });
            setLoading(false);
            return;
          }
        }

        const isInvitePath = location.pathname.includes("/invite");

        if (isInvitePath && !dataParam) {
          setError(
            "Invalid invitation link. Please use the complete invitation link that was shared with you."
          );
          setLoading(false);
          return;
        } else if (
          !isInvitePath &&
          !cohortIdParam &&
          !(discordId && discordName)
        ) {
          setError(
            "You need a valid invitation to access the Marathon Alpha. Please use the link that was shared with you."
          );
          setLoading(false);
          return;
        }

        if (discordId) {
          sessionStorage.setItem("marathonDiscordId", discordId);
        }
        if (discordName) {
          sessionStorage.setItem("marathonDiscordName", discordName);
        }

        if (dataParam) {
          const tokenParts = dataParam.split(".");
          if (tokenParts.length !== 3) {
            setError("Invalid token format.");
            setLoading(false);
            return;
          }

          const items = await Platform.UserService.DecodeInviteToken(dataParam);

          if (
            !items ||
            !items.InviterCohort ||
            !items.InviterId ||
            !items.FriendIndex
          ) {
            setError("Invalid invitation link. Missing required token data.");
            setLoading(false);
            return;
          }

          dispatch(setInviterId(items.InviterId));
          dispatch(setInviterCohort(items.InviterCohort));
          dispatch(setFriendIndex(parseInt(items.FriendIndex)));
          dispatch(setIsFriendLinkFlow(true));

          if (
            items.InviterId === globalState?.loggedInUser?.user?.membershipId
          ) {
            setError("You cannot use your own invitation link.");
            setLoading(false);
            return;
          }

          const inviterHasAccess = await validateInviterAccess(items.InviterId);
          if (!inviterHasAccess) {
            setError(
              "Invalid invitation. The person who invited you may not have access to the Alpha program."
            );
            setLoading(false);
            return;
          }

          const inviterCohortConfig = await Platform.TokensService.GetCohortConfig(
            items.InviterCohort
          );
          if (!inviterCohortConfig) {
            setError("The inviter's cohort is not recognized.");
            setLoading(false);
            return;
          }

          if (inviterCohortConfig.FriendLinkCount <= 0) {
            setError("The inviter's cohort does not allow friend invitations.");
            setLoading(false);
            return;
          }

          if (
            parseInt(items.FriendIndex) > inviterCohortConfig.FriendLinkCount
          ) {
            setError("Invalid friend invitation index.");
            setLoading(false);
            return;
          }

          if (inviterCohortConfig.FriendCohortToken) {
            dispatch(setCohortId(inviterCohortConfig.FriendCohortToken));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error processing flow routing:", error);
        setError(
          "An error occurred while processing your request. Please try again later."
        );
        setLoading(false);
      }
    };

    processQueryParams();
  }, [globalState?.loggedInUser?.user?.membershipId]);

  const validateInviterAccess = async (inviterId: string): Promise<boolean> => {
    try {
      // In production, this would validate the inviter through an API call to getDirectAcls
      // For now, assume all inviters are valid
      return true;
    } catch (error) {
      console.error("Error validating inviter access:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.commandPrompt}>{"> validating_access"}</div>
        <div className={styles.loading}>{"ANALYZING..."}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.marathonTerminal}>
        <div className={styles.contentWrapper}>
          <div className={styles.marathonLogo} />
          <div className={styles.terminal}>
            <div className={styles.terminalHeader} />
            <div className={styles.terminalContent}>
              <div className={styles.commandPrompt}>
                {"> access_verification_failed"}
              </div>
              <div className={styles.errorMessage}>{error}</div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.selectionButton}
                  onClick={() => window.history.back()}
                >
                  {"GO_BACK"}
                  <span className={styles.arrow}>›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
