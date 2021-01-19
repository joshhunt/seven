// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Broadcaster } from "@Global/Broadcaster/Broadcaster";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import { RecaptchaBroadcaster } from "@UI/Authentication/RecaptchaBroadcaster";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import makeAsyncScriptLoader from "react-async-script";
import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const Recaptcha = (props: RecaptchaProps) => {
  const siteKey = ConfigUtils.GetParameter(
    "GoogleRecaptcha",
    "RecaptchaSiteInvisible",
    ""
  );
  const reRef = useRef<ReCAPTCHA>();
  const AsyncRecaptcha = makeAsyncScriptLoader(
    "https://www.google.com/recaptcha/api.js?render=explicit"
  )(ReCAPTCHA);

  useEffect(() => {
    const unsubscribeToBroadcaster = RecaptchaBroadcaster.observe((data) => {
      if (data === "EXECUTE_ASYNC") {
        executeRecaptcha();
      }
    });

    return () => unsubscribeToBroadcaster();
  }, [reRef]);

  const executeRecaptcha = async () => {
    const token: string = await reRef.current.executeAsync();

    Platform.RecaptchaService.Verify({ Token: token })
      .then((response) => {
        const isHuman = response.Success;

        isHuman ? props.onSuccess() : props.onFailure();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Logger.error(e.message);
      });
  };

  //Translate our loc names to google's
  const recaptchaLocEquivalents = {
    de: "de",
    en: "en",
    es: "es",
    "es-mx": "es-419",
    fr: "fr",
    it: "it",
    ja: "ja",
    ko: "ko",
    pl: "pl",
    "pt-br": "pt-BR",
    ru: "ru",
    "zh-chs": "zh-CN",
    "zh-cht": "zh-TW",
  };

  return (
    <>
      <AsyncRecaptcha
        sitekey={siteKey}
        size={"invisible"}
        ref={reRef}
        theme={"dark"}
        hl={recaptchaLocEquivalents[LocalizerUtils.currentCultureName]}
      />
    </>
  );
};

export const recaptchaBroadcaster = new Broadcaster();
