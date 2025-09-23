import { useEffect, useMemo, useState } from "react";
import { ObjectUtils } from "@Utilities/ObjectUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { BungieCredentialType, EmailValidationStatus } from "@Enum";

const QUALTRICS_BASE_URL =
  "https://playstationresearch.qualtrics.com/jfe/form/SV_3xj8jPsImpkI6Ka";

export function useQualtricsEmbed(globalState: any) {
  const [src, setSrc] = useState<string>(QUALTRICS_BASE_URL);

  const embed = useMemo(() => {
    const user = globalState?.loggedInUser?.user;

    const fullBungieName = (() => {
      if (user) {
        const bn = UserUtils.getBungieNameFromBnetGeneralUser(user);
        if (bn?.bungieGlobalName) {
          return `${bn.bungieGlobalName}${
            bn.bungieGlobalCodeWithHashtag ?? ""
          }`;
        }
      }
      return "";
    })();

    const q_email = globalState?.loggedInUser?.email ?? "";
    const emailStatus = globalState?.loggedInUser?.emailStatus ?? 0;
    const emailVerified =
      (emailStatus & EmailValidationStatus.VALID) ===
      EmailValidationStatus.VALID;
    let discordId = "";

    let cohort = "";
    try {
      const sp = new URLSearchParams(window.location.search);
      cohort = sp.get("cohort") ?? sp.get("cohort_id") ?? "";
      discordId = sp.get("discordId") ?? sp.get("discord_id") ?? "";
    } catch {
      // ignore
    }

    const platforms =
      globalState?.credentialTypes
        ?.map((c: any) => BungieCredentialType[c.credentialType])
        .join(",")
        .toLowerCase() ?? "";

    return {
      membershipId: user?.membershipId ?? "",
      bungieName: fullBungieName ?? "",
      q_email: q_email ?? "",
      emailVerified,
      discordId: discordId ?? "",
      cohort,
      platforms,
    } as Record<string, any>;
  }, [globalState?.loggedInUser, globalState?.credentialTypes]);

  useEffect(() => {
    try {
      const eed = ObjectUtils.jsonToBase64Url(embed);
      const withParam = `${QUALTRICS_BASE_URL}?Q_EED=${encodeURIComponent(
        eed
      )}`;
      setSrc(withParam);
    } catch {
      setSrc(QUALTRICS_BASE_URL);
    }
  }, [embed]);

  useEffect(() => {
    const emailStatus = globalState?.loggedInUser?.emailStatus ?? 0;
    const emailVerified =
      (emailStatus & EmailValidationStatus.VALID) ===
      EmailValidationStatus.VALID;
    const iframe = document.getElementById(
      "surveyFrame"
    ) as HTMLIFrameElement | null;
    iframe?.contentWindow?.postMessage(
      { type: "emailVerified", verified: emailVerified.toString() },
      "*"
    );
    iframe?.contentWindow?.postMessage(
      { type: "emailUpdate", q_email: globalState?.loggedInUser?.email },
      "*"
    );
  }, [
    globalState?.loggedInUser?.emailStatus,
    globalState?.loggedInUser?.email,
  ]);

  return src;
}
