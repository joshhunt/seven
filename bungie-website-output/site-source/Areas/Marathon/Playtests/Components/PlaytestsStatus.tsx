import React, { FC, useState, useEffect } from "react";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import styles from "./PlaytestsStatus.module.scss";
import {
  AuthenticationSummary,
  PlaytestsHelper,
} from "@Areas/Marathon/Playtests/Helpers/PlaytestsHelper";
import { BungieCredentialType, ClientDeviceType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  resolvePlaytestStatus,
  PlaytestStatus,
} from "../Helpers/PlaytestsHelper";
import { Platform } from "@Platform";
import { EnumUtils } from "@Utilities/EnumUtils";
import { AclHelper } from "@Areas/Marathon/Helpers/AclHelper";

interface PlaytestsStatusProps {
  status: "received" | "granted" | "not-selected";
}

interface ApplicationData {
  bungieName: string;
  platform: string;
  discordId: string;
  emailOptIn: boolean;
  submittedAt?: string;
  playStationRegion?: "americas" | "europe";
}

interface IPlaytestsStatusProps {}

interface IPlaytestsStatusState {
  loading: boolean;
  authSummary: AuthenticationSummary | null;
  error: string | null;
  lastUpdated: Date | null;
}

export const PlaytestsStatus: FC<PlaytestsStatusProps> = ({ status }) => {
  // Area-level body theming while mounted
  useEffect(() => {
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

  const [
    applicationData,
    setApplicationData,
  ] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSummary, setAuthSummary] = useState<AuthenticationSummary | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  let refreshInterval: ReturnType<typeof setTimeout> | null = null;

  // New: game codes + region
  const [codes, setCodes] = useState<any[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [psRegion, setPsRegion] = useState<"americas" | "europe" | null>(null);
  const gs = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    // Load application data from localStorage
    const storedData = localStorage.getItem("marathonPlaytestsApplication");
    if (storedData) {
      const parsed: ApplicationData = JSON.parse(storedData);
      setApplicationData(parsed);
      if (parsed.playStationRegion) setPsRegion(parsed.playStationRegion);
    } else {
      // Remove mock fallback values
      setApplicationData(null);
    }

    loadAuthSummary();
    // Refresh status every 30 seconds
    refreshInterval = setInterval(loadAuthSummary, 30000);

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Load codes when selected (explicit granted or via ACL)
  useEffect(() => {
    const hasAcl =
      !!gs?.loggedInUser?.userAcls &&
      AclHelper.hasGameCodesAccess(gs.loggedInUser.userAcls);
    if (status === "granted" || hasAcl) {
      loadCodes();
    }
  }, [status, gs?.loggedInUser?.userAcls]);

  const loadCodes = async () => {
    try {
      setCodesLoading(true);
      const response = await Platform.TokensService.MarketplacePlatformCodeOfferHistory();
      if (Array.isArray(response)) {
        setCodes(response);
      }
    } catch (e) {
      console.error("Failed to load codes", e);
    } finally {
      setCodesLoading(false);
    }
  };

  const setPlayStationRegion = (region: "americas" | "europe") => {
    setPsRegion(region);
    if (applicationData) {
      const updated: ApplicationData = {
        ...applicationData,
        playStationRegion: region,
      };
      setApplicationData(updated);
      localStorage.setItem(
        "marathonPlaytestsApplication",
        JSON.stringify(updated)
      );
    }
  };

  const loadAuthSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const summary = await PlaytestsHelper.getAuthenticationSummary();

      setAuthSummary(summary);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load authentication summary:", err);
      setError("Failed to load authentication status");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordUpdate = () => {
    if (!applicationData) return;

    const currentDiscord = applicationData.discordId || "";
    const newDiscordId = prompt(
      "Please enter your corrected Discord Username:",
      currentDiscord
    );

    if (newDiscordId !== null && newDiscordId.trim() !== "") {
      const updatedData = {
        ...applicationData,
        discordId: newDiscordId.trim(),
      };

      setApplicationData(updatedData);
      localStorage.setItem(
        "marathonPlaytestsApplication",
        JSON.stringify(updatedData)
      );
      alert("Discord username updated!");
    }
  };

  const renderStatusContent = () => {
    switch (status) {
      case "received":
        return (
          <div className={styles.statusBox}>
            <h2 className={styles.received}>Status: Application Received</h2>
            <p>
              We've successfully received your application. Thank you!
              Selections will be made in waves, and access is limited. Please
              check back on this page for updates on your status.
            </p>

            {applicationData && (
              <div className={styles.infoSection}>
                <p>
                  <strong>Bungie Name:</strong> {applicationData.bungieName}
                </p>
                <p>
                  <strong>Platform:</strong> {applicationData.platform}
                </p>
                <p>
                  <strong>Discord Username:</strong>{" "}
                  {applicationData.discordId || "Not provided"}{" "}
                  <button
                    type="button"
                    onClick={handleDiscordUpdate}
                    className={styles.discordUpdateBtn}
                  >
                    Update
                  </button>
                </p>
              </div>
            )}
          </div>
        );

      case "granted":
        return (
          <div className={styles.statusBox}>
            <h2 className={styles.granted}>
              Status: You're In! Welcome to the Tech Test!
            </h2>
            {codesLoading && <p>Loading your game code…</p>}
            {!codesLoading && codes.length > 0 && (
              <div>
                <p>
                  <strong>Platform:</strong>{" "}
                  {EnumUtils.getStringValue(
                    codes[0]?.deviceType,
                    ClientDeviceType
                  )}
                </p>
                <div className={styles.codeBox}>{codes[0]?.platformCode}</div>
              </div>
            )}
            {!codesLoading &&
              codes.length === 0 &&
              applicationData?.platform === "PlayStation" && (
                <div>
                  <p>
                    Choose your PlayStation region to receive the correct code:
                  </p>
                  <div className={styles.regionPicker}>
                    <button
                      onClick={() => setPlayStationRegion("americas")}
                      className={`${styles.regionBtn} ${
                        psRegion === "americas" ? styles.active : ""
                      }`}
                    >
                      Americas
                    </button>
                    <button
                      onClick={() => setPlayStationRegion("europe")}
                      className={`${styles.regionBtn} ${
                        psRegion === "europe" ? styles.active : ""
                      }`}
                    >
                      Europe
                    </button>
                  </div>
                  {psRegion && (
                    <p className={styles.desc}>
                      Saved preference:{" "}
                      {psRegion === "americas" ? "Americas" : "Europe"}. Your
                      code will be issued for this region.
                    </p>
                  )}
                </div>
              )}
          </div>
        );

      case "not-selected":
        return (
          <div className={styles.statusBox}>
            <h2 className={styles.notSelected}>
              Status: This Playtest has Ended
            </h2>
            <p>
              Thank you for your incredible interest in the Tech Test. We
              received a massive number of applications and cannot accommodate
              everyone in this phase. While your account wasn't selected for
              this test, you are on our list for potential future opportunities.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderCredentialBadge = (
    credType: BungieCredentialType,
    label: string
  ) => {
    const displayName = PlaytestsHelper.getCredentialTypeDisplayName(credType);
    const isCurrent = authSummary?.currentCredentialType === credType;

    return (
      <span
        key={credType}
        className={`${styles.credentialBadge} ${
          isCurrent ? styles.current : ""
        }`}
        title={`${displayName} - ${label}`}
      >
        {displayName}
        {isCurrent && <span className={styles.currentIndicator}>●</span>}
      </span>
    );
  };

  return (
    <>
      <BungieHelmet title="Marathon Application Status"></BungieHelmet>

      <div className={styles.container}>
        <h1>Your Marathon Application Status</h1>
        {renderStatusContent()}

        <div className={styles.header}>
          <h2>Authentication Status</h2>
          <button
            onClick={loadAuthSummary}
            disabled={loading}
            className={styles.refreshButton}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {lastUpdated && (
          <div className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {authSummary && (
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <h3>Current Session</h3>
              <div className={styles.currentSession}>
                <div className={styles.mainCredential}>
                  {authSummary.currentCredentialDisplayName}
                </div>
                <div className={styles.sessionDetails}>
                  <span>Membership: {authSummary.membershipId}</span>
                  <span>Device: {authSummary.deviceType}</span>
                  <span>
                    OAuth: {authSummary.isOAuthSession ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.statusCard}>
              <h3>Linked Accounts</h3>
              <div className={styles.credentialList}>
                {authSummary.linkedCredentials.map(
                  (
                    cred: {
                      credentialType: BungieCredentialType;
                      isPublic: any;
                    },
                    index: any
                  ) =>
                    renderCredentialBadge(
                      cred.credentialType,
                      cred.isPublic ? "Public" : "Private"
                    )
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles.apiInfo}>
          <h3>API Methods Used</h3>
          <ul>
            <li>
              <code>Platform.UserService.GetCurrentUserAuthContextState()</code>
              <span>- Gets current session authentication context</span>
            </li>
            <li>
              <code>Platform.UserService.GetCredentialTypesForAccount()</code>
              <span>- Gets all linked credential types</span>
            </li>
            <li>
              <code>Platform.UserService.GetCurrentUser()</code>
              <span>- Gets user details including credential settings</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export const PlaytestsStatusLoader: React.FC<any> = (props) => {
  const gs = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [status, setStatus] = React.useState<PlaytestStatus | null>(null);
  const membershipId = gs?.loggedInUser?.user?.membershipId;

  React.useEffect(() => {
    let mounted = true;
    resolvePlaytestStatus(membershipId).then((s) => {
      if (mounted) setStatus(s);
    });
    return () => {
      mounted = false;
    };
  }, [membershipId]);

  return <PlaytestsStatus {...props} status={status ?? undefined} />;
};
