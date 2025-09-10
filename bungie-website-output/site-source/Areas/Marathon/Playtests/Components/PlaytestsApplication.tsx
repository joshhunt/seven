import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Platform } from "@Platform";
import { BungieCredentialType, EmailValidationStatus } from "@Enum";
import { Logger } from "@Global/Logger";
import { Localizer } from "@bungie/localization";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "./PlaytestsApplication.module.scss";

interface PlaytestsApplicationProps {
  onContinue?: () => void;
  mode?: "initial" | "edit" | "review";
  existingData?: Partial<ApplicationData>;
}

interface ApplicationData {
  bungieName: string;
  platform: string;
  discordId: string;
  emailOptIn: boolean;
}

interface ValidationErrors {
  bungieName?: string;
  platform?: string;
  discordId?: string;
  emailVerification?: string;
  general?: string;
}

interface PlatformOption {
  value: string;
  label: string;
  credentialType: BungieCredentialType;
  available: boolean;
  isCurrentlyLoggedIn: boolean;
}

const SUPPORTED_PLATFORMS: Array<{
  value: string;
  label: string;
  credentialType: BungieCredentialType;
}> = [
  {
    value: "PlayStation",
    label: Localizer.playtests.PlatformPlayStation,
    credentialType: BungieCredentialType.Psnid,
  },
  {
    value: "Xbox",
    label: Localizer.playtests.PlatformXbox,
    credentialType: BungieCredentialType.Xuid,
  },
  {
    value: "Steam",
    label: Localizer.playtests.PlatformSteam,
    credentialType: BungieCredentialType.SteamId,
  },
];

export const PlaytestsApplication: FC<PlaytestsApplicationProps> = ({
  onContinue,
  mode = "initial",
  existingData,
}) => {
  // Ensure area-level body background/text color while Playtests is mounted
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

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [loggedInCredentialType, setLoggedInCredentialType] = useState<
    BungieCredentialType
  >(BungieCredentialType.None);

  // Initialize form data based on mode and existing data
  const [formData, setFormData] = useState<ApplicationData>(() => {
    const baseData = {
      bungieName: "",
      platform: "",
      discordId: "",
      emailOptIn: false,
    };

    // If we have existing data, merge it with base data
    if (existingData) {
      return { ...baseData, ...existingData };
    }

    return baseData;
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [availablePlatforms, setAvailablePlatforms] = useState<
    PlatformOption[]
  >([]);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBungieName, setIsLoadingBungieName] = useState(true);

  // Get credential type from global state
  const getCurrentAuthCredential = useCallback(async (): Promise<
    BungieCredentialType
  > => {
    if (
      !UserUtils.isAuthenticated(globalState) ||
      !globalState.loggedInUser?.user
    ) {
      return BungieCredentialType.None;
    }

    try {
      const authState = await Platform.UserService.GetCurrentUserAuthContextState();
      setLoggedInCredentialType(authState.AuthProvider);
      return authState.AuthProvider;
    } catch (error) {
      Logger.error("Failed to get auth credential", error);
      return BungieCredentialType.None;
    }
  }, [globalState]);

  // Handle platform button clicks - open OAuth in popup like Alpha but with direct OAuth URLs
  const handlePlatformClick = async (
    e: React.MouseEvent,
    platform: BungieCredentialType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // If user is already authenticated, check their credentials
    if (UserUtils.isAuthenticated(globalState)) {
      try {
        // Check if user has credentials for the selected platform
        const credentials = await Platform.UserService.GetCredentialTypesForTargetAccount(
          globalState?.loggedInUser?.user?.membershipId
        );

        const matchingCredential = credentials?.find(
          (cred) => cred.credentialType === platform
        );

        if (matchingCredential) {
          // User has credential for this platform, continue with application
          setFormData((prev) => ({
            ...prev,
            platform:
              SUPPORTED_PLATFORMS.find((p) => p.credentialType === platform)
                ?.value || "",
          }));

          // Clear any platform-related errors
          setValidationErrors((prev) => ({
            ...prev,
            platform: undefined,
          }));
          return;
        }

        // User doesn't have this platform linked
        setValidationErrors((prev) => ({
          ...prev,
          platform: `You don't have ${
            SUPPORTED_PLATFORMS.find((p) => p.credentialType === platform)
              ?.label
          } linked to your account.`,
        }));
      } catch (error) {
        Logger.error("Failed to check platform credentials", error);
        setValidationErrors((prev) => ({
          ...prev,
          general: "Unable to verify platform credentials. Please try again.",
        }));
      }
    } else {
      // User not authenticated - use same URL pattern as AuthTrigger
      const credentialString = BungieCredentialType[platform];
      const signInUrl = `/en/User/SignIn/${credentialString}/?flowStart=1`;

      BrowserUtils.openWindow(signInUrl, "loginui", () => {
        // Refresh user data when auth window closes
        GlobalStateDataStore.refreshUserAndRelatedData(true);
      });
    }
  };

  // Validate Discord username format
  const validateDiscordUsername = (username: string): boolean => {
    if (!username) return true; // Optional field

    // Discord username format: alphanumeric, underscores, periods, max 32 chars
    // May or may not have discriminator (#1234)
    const discordRegex = /^[a-zA-Z0-9_.]{1,32}(#\d{4})?$/;
    return discordRegex.test(username);
  };

  // Consolidated email verification flag across possible globalState shapes (prefer bitflag)
  const isEmailVerified = useMemo(() => {
    const u: any = globalState?.loggedInUser;
    if (!u) return false;
    // Prefer numeric bitflag if available
    if (typeof u.emailStatus === "number") {
      return (
        (u.emailStatus & EmailValidationStatus.VALID) ===
        EmailValidationStatus.VALID
      );
    }
    if (typeof u.emailVerified === "boolean") return u.emailVerified;
    if (typeof u.emailStatus?.isVerified === "boolean")
      return u.emailStatus.isVerified;
    if (typeof u.email?.isVerified === "boolean") return u.email.isVerified;
    if (typeof u.emailUsage?.isVerified === "boolean")
      return u.emailUsage.isVerified;
    return false;
  }, [globalState?.loggedInUser]);

  // Debug snapshot for verification sources (include bitflag check)
  const emailDebugSnapshot = useMemo(() => {
    const u: any = globalState?.loggedInUser;
    const flagCheck =
      typeof u?.emailStatus === "number"
        ? (u.emailStatus & EmailValidationStatus.VALID) ===
          EmailValidationStatus.VALID
        : undefined;
    return {
      isEmailVerified,
      flagCheck,
      flagRawStatus: u?.emailStatus,
      emailVerified: u?.emailVerified,
      emailStatus: u?.emailStatus,
      email: u?.email,
      emailUsage: u?.emailUsage,
      userHasUser: !!u?.user,
      timestamp: new Date().toISOString(),
    };
  }, [globalState?.loggedInUser, isEmailVerified]);

  useEffect(() => {
    try {
      const L: any = Logger as any;
      if (L?.log) {
        L.log("[Playtests][EmailVerification]", emailDebugSnapshot);
      } else if (L?.info) {
        L.info("[Playtests][EmailVerification]", emailDebugSnapshot);
      } else if (L?.warn) {
        L.warn("[Playtests][EmailVerification]", emailDebugSnapshot);
      } else if (L?.error) {
        L.error("[Playtests][EmailVerification]", emailDebugSnapshot);
      }
    } catch {
      // noop
    }
    // Always echo to browser console for visibility
    // eslint-disable-next-line no-console
    console.log("[Playtests][EmailVerification]", emailDebugSnapshot);
  }, [emailDebugSnapshot]);

  // Toggle on-page debug panel via query: ?debug=playtests|1|true
  const showDebug = useMemo(() => {
    try {
      if (typeof window === "undefined") return false;
      const v = new URLSearchParams(window.location.search).get("debug");
      if (!v) return false;
      return v === "playtests" || v === "1" || v === "true";
    } catch {
      return false;
    }
  }, []);

  // Comprehensive form validation
  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Bungie Name is automatically populated, so only check if it exists
    if (!formData.bungieName.trim()) {
      errors.bungieName = Localizer.playtests.ErrorBungieNameMissing;
    }

    if (!formData.platform) {
      errors.platform = Localizer.playtests.ErrorPlatformMissing;
    }

    if (formData.discordId && !validateDiscordUsername(formData.discordId)) {
      errors.discordId = Localizer.playtests.ErrorDiscordInvalid;
    }

    if (formData.emailOptIn && !isEmailVerified) {
      errors.emailVerification = Localizer.playtests.ErrorEmailNotVerified;
    }

    return errors;
  }, [formData, isEmailVerified]);

  // Load Bungie Name when user data becomes available (only if not already provided)
  useEffect(() => {
    // Don't override existing data unless in initial mode
    if (mode !== "initial" && existingData?.bungieName) {
      return;
    }

    if (
      UserUtils.isAuthenticated(globalState) &&
      globalState.loggedInUser?.user
    ) {
      setIsLoadingBungieName(true);
      try {
        // Automatically populate Bungie Name from authenticated user
        const bungieName = UserUtils.getBungieNameFromBnetGeneralUser(
          globalState.loggedInUser.user
        );
        const fullBungieName = bungieName
          ? `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`
          : "";

        if (fullBungieName) {
          setFormData((prev) => ({
            ...prev,
            bungieName: fullBungieName,
          }));
          // Clear any previous errors, including general sign-in error
          setValidationErrors((prev) => {
            const { bungieName, general, ...rest } = prev;
            return rest as ValidationErrors;
          });
        } else {
          // If we can't get the Bungie Name, show an error
          setValidationErrors((prev) => ({
            ...prev,
            bungieName: Localizer.playtests.ErrorBungieNameMissing,
          }));
        }
      } catch (error) {
        Logger.error("Error retrieving Bungie Name", error);
        setValidationErrors((prev) => ({
          ...prev,
          bungieName: Localizer.playtests.ErrorBungieNameMissing,
        }));
      } finally {
        setIsLoadingBungieName(false);
      }
    } else if (isAuthReady && !UserUtils.isAuthenticated(globalState)) {
      // Only set sign-in required after we know auth is ready
      setLoggedInCredentialType(BungieCredentialType.None);
      setIsLoadingBungieName(false);

      // Clear Bungie Name and platform when not authenticated
      setFormData((prev) => ({
        ...prev,
        bungieName: "",
        platform: "",
      }));

      // Clear platforms list
      setAvailablePlatforms([]);

      setValidationErrors((prev) => ({
        ...prev,
        general: Localizer.playtests.ErrorSignInRequired,
      }));
    }
  }, [globalState.loggedInUser, mode, existingData?.bungieName, isAuthReady]);

  // Fetch user's linked credentials
  useEffect(() => {
    const fetchLinkedCredentials = async () => {
      if (
        !UserUtils.isAuthenticated(globalState) ||
        !globalState.loggedInUser?.user
      ) {
        return;
      }

      setIsLoadingCredentials(true);

      try {
        const currentAuthCredential = await getCurrentAuthCredential();

        // Try to get credentials from global state first
        let credentials = globalState.credentialTypes;

        // If not available in global state, fetch from API
        if (!credentials || credentials.length === 0) {
          const credentialsResponse = await Platform.UserService.GetCredentialTypesForAccount();
          credentials = credentialsResponse || [];
        }

        // Build platform options based on supported platforms and user's linked credentials
        const platforms: PlatformOption[] = SUPPORTED_PLATFORMS.map(
          (platform) => {
            const hasCredential = credentials.some(
              (cred) => cred.credentialType === platform.credentialType
            );

            return {
              value: platform.value,
              label: platform.label,
              credentialType: platform.credentialType,
              available: hasCredential,
              isCurrentlyLoggedIn:
                currentAuthCredential === platform.credentialType,
            };
          }
        );

        setAvailablePlatforms(platforms);

        // Only auto-select platform if we don't have existing data
        if (mode === "initial" && !existingData?.platform) {
          // Default to the platform they're currently logged in with
          const currentlyLoggedInPlatform = platforms.find(
            (p) => p.isCurrentlyLoggedIn && p.available
          );
          if (currentlyLoggedInPlatform) {
            setFormData((prev) => ({
              ...prev,
              platform: currentlyLoggedInPlatform.value,
            }));
          } else {
            // Fallback to first available platform
            const firstAvailable = platforms.find((p) => p.available);
            if (firstAvailable) {
              setFormData((prev) => ({
                ...prev,
                platform: firstAvailable.value,
              }));
            }
          }
        }
      } catch (error) {
        Logger.error("Failed to fetch linked credentials", error);

        // Fallback to basic platform options
        const platforms: PlatformOption[] = SUPPORTED_PLATFORMS.map(
          (platform) => ({
            value: platform.value,
            label: platform.label,
            credentialType: platform.credentialType,
            available: false, // Can't determine availability due to error
            isCurrentlyLoggedIn: false,
          })
        );

        setAvailablePlatforms(platforms);

        // Set validation error
        setValidationErrors((prev) => ({
          ...prev,
          general: Localizer.playtests.ErrorCredentialsFailed,
        }));
      } finally {
        setIsLoadingCredentials(false);
      }
    };

    if (
      UserUtils.isAuthenticated(globalState) &&
      globalState.loggedInUser?.user
    ) {
      fetchLinkedCredentials();
    }
  }, [
    globalState.loggedInUser,
    getCurrentAuthCredential,
    mode,
    existingData?.platform,
  ]);

  // Handle input changes
  const handleInputChange = (
    field: keyof ApplicationData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific validation errors when user starts correcting them
    // Only clear if the field exists in ValidationErrors
    if (
      field in validationErrors &&
      validationErrors[field as keyof ValidationErrors]
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear email verification error if user unchecks email opt-in
    if (field === "emailOptIn" && !value) {
      setValidationErrors((prev) => ({
        ...prev,
        emailVerification: undefined,
      }));
    }
  };

  // Real-time email validation
  useEffect(() => {
    if (formData.emailOptIn) {
      setValidationErrors((prev) => ({
        ...prev,
        emailVerification: isEmailVerified
          ? undefined
          : Localizer.playtests.ErrorEmailNotVerified,
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        emailVerification: undefined,
      }));
    }
  }, [formData.emailOptIn, isEmailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    // Validate form
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Store form data for next step - but don't rely on localStorage for state
      const applicationData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        userMembershipId: globalState.loggedInUser?.user?.membershipId,
        currentCredentialType: await getCurrentAuthCredential(),
      };

      // Only store in localStorage as a backup/convenience
      localStorage.setItem(
        "marathon-playtests-data",
        JSON.stringify(applicationData)
      );

      // Continue to next step with the data
      if (onContinue) {
        onContinue();
      } else {
        // If no callback provided, this indicates a routing issue
        Logger.error(
          "No onContinue callback provided to PlaytestsApplication component"
        );
        setValidationErrors({
          general: Localizer.playtests.ErrorSubmitNoCallback,
        });
      }
    } catch (error) {
      Logger.error("Error submitting application", error);
      setValidationErrors({
        general: Localizer.playtests.ErrorSubmitGeneral,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    formData.bungieName &&
    formData.platform &&
    !isSubmitting &&
    (!formData.emailOptIn || isEmailVerified);

  // Get mode-specific content
  const getModeContent = () => {
    switch (mode) {
      case "edit":
        return {
          title: Localizer.playtests.ApplicationTitleEdit,
          description: Localizer.playtests.ApplicationDescriptionEdit,
          buttonText: Localizer.playtests.ButtonSaveChanges,
        };
      case "review":
        return {
          title: Localizer.playtests.ApplicationTitleReview,
          description: Localizer.playtests.ApplicationDescriptionReview,
          buttonText: Localizer.playtests.ButtonContinue,
        };
      default:
        return {
          title: Localizer.playtests.ApplicationTitle,
          description: Localizer.playtests.ApplicationDescription,
          buttonText: Localizer.playtests.ButtonContinue,
        };
    }
  };

  const modeContent = getModeContent();

  // Prevent sign-in prompt from flashing before auth state hydrates
  const [isClientHydrated, setIsClientHydrated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsClientHydrated(true);
    let mounted = true;
    const checkAuth = async () => {
      try {
        // Touch the auth context so DataStore/user state is settled
        await Platform.UserService.GetCurrentUserAuthContextState();
      } catch {
        /* ignore */
      } finally {
        if (mounted) setIsAuthReady(true);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  // After auth is ready, force a fresh pull of user data to avoid stale email status
  useEffect(() => {
    if (isAuthReady) {
      GlobalStateDataStore.refreshUserAndRelatedData(true);
    }
  }, [isAuthReady]);

  // When user returns focus (e.g., after verifying in settings), refresh user data
  useEffect(() => {
    const onFocus = () => GlobalStateDataStore.refreshUserAndRelatedData(true);
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
    };
  }, []);

  // Wait until client is hydrated and auth context checked before deciding to show sign-in
  if (!isClientHydrated || !isAuthReady) {
    return null;
  }

  // Show sign-in prompt if user is not authenticated
  if (!UserUtils.isAuthenticated(globalState)) {
    return (
      <>
        <BungieHelmet title={Localizer.playtests.ApplicationTitle}>
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>

        <div className={styles.container}>
          {showDebug && (
            <div className={styles.debugBox}>
              <pre>{JSON.stringify(emailDebugSnapshot, null, 2)}</pre>
            </div>
          )}
          <div className={styles.applicationForm}>
            {/* Progress indicator */}
            <div className={styles.progressContainer}>
              <div className={styles.progressWrapper}>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${styles.step1Active}`}
                  ></div>
                </div>
                <div className={styles.progressSteps}>
                  <div className={`${styles.progressStep} ${styles.active}`}>
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>
                      {Localizer.playtests.ProgressStep1}
                    </span>
                  </div>
                  <div className={styles.progressStep}>
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>
                      {Localizer.playtests.ProgressStep2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h1>Marathon Playtest Application</h1>
            <p>{Localizer.playtests.SignInSubtitle}</p>

            <div className={styles.signInPrompt}>
              <div className={styles.signInHeader}>
                <h2>{Localizer.playtests.NoticePlatformChoice}</h2>
                <p>{Localizer.playtests.SignInSubtitle}</p>
              </div>

              <div className={styles.platformButtons}>
                <button
                  className={styles.platformButton}
                  onClick={(e) =>
                    handlePlatformClick(e, BungieCredentialType.Psnid)
                  }
                  aria-label={Localizer.playtests.PlatformPlayStation}
                >
                  <img
                    className={styles.platformImage}
                    src="/7/assets/platforms/presskit/playstation-signin.png"
                    alt={Localizer.playtests.SignInPlayStation}
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <span className={styles.platformFallback}>
                    {Localizer.playtests.PlatformPlayStation}
                  </span>
                </button>

                <button
                  className={styles.platformButton}
                  onClick={(e) =>
                    handlePlatformClick(e, BungieCredentialType.Xuid)
                  }
                  aria-label={Localizer.playtests.PlatformXbox}
                >
                  <img
                    className={styles.platformImage}
                    src="/7/assets/platforms/presskit/xbox-signin.png"
                    alt={Localizer.playtests.SignInXbox}
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <span className={styles.platformFallback}>
                    {Localizer.playtests.PlatformXbox}
                  </span>
                </button>

                <button
                  className={styles.platformButton}
                  onClick={(e) =>
                    handlePlatformClick(e, BungieCredentialType.SteamId)
                  }
                  aria-label={Localizer.playtests.PlatformSteam}
                >
                  <img
                    className={styles.platformImage}
                    src="/7/assets/platforms/presskit/steam-signin.png"
                    alt={Localizer.playtests.SignInSteam}
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <span className={styles.platformFallback}>
                    {Localizer.playtests.PlatformSteam}
                  </span>
                </button>
              </div>

              <div className={styles.signInFooter}>
                <p>
                  <strong>{Localizer.playtests.NoticeAccountImportant}</strong>
                </p>
                <p>
                  {Localizer.FormatReact(
                    Localizer.playtests.SignInNeedAccount,
                    {
                      [1]: (
                        <a
                          href="https://local-admin.bungie.bng.local/7/en/User/Account/AccountLinking"
                          target="_blank"
                        />
                      ),
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BungieHelmet title={Localizer.playtests.ApplicationTitle}></BungieHelmet>

      <div className={styles.container}>
        {showDebug && (
          <div className={styles.debugBox}>
            <pre>{JSON.stringify(emailDebugSnapshot, null, 2)}</pre>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Header Panel */}
          <div className={styles.headerPanel}>
            <h1>Marathon Playtest Application</h1>
          </div>

          {/* Main Form Panel */}
          <div className={styles.mainPanel}>
            {/* Account Notice - Large Panel */}
            <div className={`${styles.formSection} ${styles.large}`}>
              {validationErrors.general && (
                <div className={styles.errorBanner}>
                  {validationErrors.general}
                </div>
              )}

              <div className={styles.accountNotice}>
                <strong>{Localizer.playtests.NoticeAccountImportant}</strong>
              </div>
            </div>

            {/* Bungie Name - Large Panel for long names */}
            <div className={`${styles.formSection} ${styles.large}`}>
              <label htmlFor="bungieName" className={styles.comicLabel}>
                {Localizer.playtests.FormBungieNameLabel}
              </label>
              <input
                type="text"
                id="bungieName"
                value={
                  isLoadingBungieName
                    ? Localizer.playtests.LoadingBungieName
                    : formData.bungieName || Localizer.playtests.LoadingNotFound
                }
                readOnly
                className={styles.brutalistInput}
                aria-describedby={
                  validationErrors.bungieName
                    ? "bungieName-error"
                    : "bungieName-hint"
                }
              />
              {validationErrors.bungieName && (
                <p id="bungieName-error" className={styles.errorBanner}>
                  {validationErrors.bungieName}
                </p>
              )}
            </div>

            {/* Platform - Medium Panel */}
            <div className={`${styles.formSection} ${styles.medium}`}>
              <label htmlFor="platform" className={styles.comicLabel}>
                {Localizer.playtests.FormPlatformLabel}
              </label>
              {isLoadingCredentials ? (
                <select disabled className={styles.brutalistSelect}>
                  <option>{Localizer.playtests.LoadingCredentials}</option>
                </select>
              ) : (
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) =>
                    handleInputChange("platform", e.target.value)
                  }
                  className={styles.brutalistSelect}
                  aria-describedby={
                    validationErrors.platform ? "platform-error" : undefined
                  }
                >
                  {availablePlatforms.map((platform) => (
                    <option
                      key={platform.value}
                      value={platform.value}
                      disabled={!platform.available}
                    >
                      {platform.label}
                      {platform.isCurrentlyLoggedIn
                        ? ` ${Localizer.playtests.PlatformCurrent}`
                        : ""}
                      {!platform.available
                        ? ` ${Localizer.playtests.PlatformNotLinked}`
                        : ""}
                    </option>
                  ))}
                  {availablePlatforms.length === 0 && (
                    <>
                      <option value="PlayStation">
                        {Localizer.playtests.PlatformPlayStation}
                      </option>
                      <option value="Xbox">
                        {Localizer.playtests.PlatformXbox}
                      </option>
                      <option value="Steam">
                        {Localizer.playtests.PlatformSteam}
                      </option>
                    </>
                  )}
                </select>
              )}
              {validationErrors.platform && (
                <p id="platform-error" className={styles.errorBanner}>
                  {validationErrors.platform}
                </p>
              )}
            </div>

            {/* Email Opt-in - Medium Panel (known length) */}
            <div className={`${styles.formSection} ${styles.medium}`}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="emailOptIn"
                  checked={formData.emailOptIn}
                  onChange={(e) =>
                    handleInputChange("emailOptIn", e.target.checked)
                  }
                />
                <label htmlFor="emailOptIn" className={styles.comicLabel}>
                  {Localizer.playtests.FormEmailOptInLabel}
                </label>
              </div>

              {/* Helper text explaining what the opt-in means */}
              <p className={styles.helpText}>
                This will use your current account email and only opts you into
                playtest-related communications.
              </p>

              {validationErrors.emailVerification && (
                <p className={styles.errorBanner}>
                  {validationErrors.emailVerification} Please verify your email
                  in{" "}
                  <a
                    href="/7/en/User/Account/EmailSms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Email & SMS settings
                  </a>
                  .
                </p>
              )}
            </div>

            {/* Discord - Large Panel for long usernames */}
            <div className={`${styles.formSection} ${styles.large}`}>
              <label htmlFor="discordId" className={styles.comicLabel}>
                {Localizer.playtests.FormDiscordLabel}
              </label>
              <input
                type="text"
                id="discordId"
                placeholder={Localizer.playtests.FormDiscordPlaceholder}
                value={formData.discordId}
                onChange={(e) => handleInputChange("discordId", e.target.value)}
                className={styles.brutalistInput}
                aria-describedby={
                  validationErrors.discordId
                    ? "discordId-error"
                    : "discordId-hint"
                }
              />
              {validationErrors.discordId && (
                <p id="discordId-error" className={styles.errorBanner}>
                  {validationErrors.discordId}
                </p>
              )}
            </div>
          </div>

          {/* Side Panel - Instructions */}
          <div className={styles.sidePanel}>
            <h2>INSTRUCTIONS</h2>
            <p>{modeContent.description}</p>
            <p>{Localizer.playtests.FormBungieNameHint}</p>
          </div>

          {/* Progress Panel */}
          <div className={styles.progressPanel}>
            <div className={styles.progressContainer}>
              <div className={styles.progressWrapper}>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${styles.step1Active}`}
                  ></div>
                </div>
                <div className={styles.progressSteps}>
                  <div className={`${styles.progressStep} ${styles.active}`}>
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>
                      {Localizer.playtests.ProgressStep1}
                    </span>
                  </div>
                  <div className={styles.progressStep}>
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>
                      {Localizer.playtests.ProgressStep2}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className={styles.actionPanel}>
            <button
              type="submit"
              disabled={!canSubmit}
              className={styles.brutalistButton}
            >
              {modeContent.buttonText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlaytestsApplication;
