import { useEffect, useMemo, useState } from "react";
import { ObjectUtils } from "@Utilities/ObjectUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { BungieCredentialType, EmailValidationStatus } from "@Enum";
import { useLocation } from "react-router-dom";

const QUALTRICS_BASE_URL =
  "https://playstationresearch.qualtrics.com/jfe/form/SV_9zqEy8HvfO78V26";

export function useQualtricsEmbed(globalState: any) {
  const [src, setSrc] = useState<string>(QUALTRICS_BASE_URL);
  const search = useLocation().search;

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

    const sp = new URLSearchParams(search);
    const cohort = sp.get("cohort") ?? sp.get("cohort_id") ?? "";

    const discordId = sp.get("discordId") ?? sp.get("discord_id") ?? "";
    const discordName = sp.get("discordName");

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
      discordName: discordName ?? "",
      cohort,
      platforms,
    } as Record<string, any>;
  }, [globalState?.loggedInUser, globalState?.credentialTypes, search]);

  useEffect(() => {
    const cohort = (embed.cohort ?? "").trim();
    const payload = { ...embed, cohort: cohort };

    let baseUrl = QUALTRICS_BASE_URL;

    try {
      const eed = ObjectUtils.jsonToBase64Url(payload);
      const withParam = `${baseUrl}?Q_EED=${encodeURIComponent(eed)}`;
      setSrc(withParam);
    } catch {
      setSrc(baseUrl);
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
