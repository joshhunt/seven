import { ConvertToPlatformError } from "@ApiIntermediary";
import { SmsDataStore } from "@Areas/Sms/SmsDataStore";
import { SmsError } from "@Areas/Sms/SmsError";
import styles from "@Areas/Sms/SmsPage.module.scss";
import { PlatformError } from "@CustomErrors";
import { PhoneValidationStatusEnum } from "@Enum";
import { Localizer } from "@Global/Localizer";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { Spinner, SpinnerContainer } from "@UIKit/Controls/Spinner";
import { SubmitButton } from "@UIKit/Forms/SubmitButton";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { useDataStore } from "@Utilities/ReactUtils";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface SmsCodeFormProps {}

export const SmsCodeForm: React.FC<SmsCodeFormProps> = (props) => {
  const smsDatastorePayload = useDataStore(SmsDataStore);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(Localizer.Sms.EnterCode);
  const siteKey = ConfigUtils.GetParameter(
    "GoogleRecaptcha",
    "RecaptchaSiteInvisible",
    ""
  );
  const captchaEnabled =
    ConfigUtils.SystemStatus("GoogleRecaptcha") &&
    ConfigUtils.SystemStatus("SmsResendCodeRecaptcha");
  const recaptchaRef = useRef<ReCAPTCHA>();

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

  //ComponentDidMount equivalent
  useEffect(() => {
    //Check SMS validation status
    Platform.UserService.GetSmsValidationStatus()
      .then(
        (response) =>
          response.phoneStatus === PhoneValidationStatusEnum.CodeSent &&
          SmsDataStore.updateLastDigits(response.lastDigits)
      )
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  //Handles change for input
  const handleChange = (event) => {
    event.preventDefault();
    error !== "" && setError("");
    setCode(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");

    Platform.UserService.CheckPhoneValidation(code)
      .then((response) => {
        SmsDataStore.updateLastDigits(response.lastDigits);
        SmsDataStore.updatePhase("Verified");
        setLoading(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  };

  //Goes to previous page
  const onCancel = () => {
    setLoading(false);
    SmsDataStore.updatePhase("PhoneEntry");
  };

  const checkHuman = async () => {
    setLoading(true);
    setMessage(Localizer.sms.SendingCode);
    setError("");
    setCode("");

    setTimeout(() => {
      setMessage(Localizer.sms.timeout);
      setLoading(false);
    }, 15000);

    let token = "";

    try {
      token = await recaptchaRef.current.executeAsync();
    } catch (error) {
      error.log();
    }

    Platform.RecaptchaService.Verify({ Token: token })
      .then((response) => {
        const human = response.Success;

        if (human) {
          resendCode();
        } else {
          setError(Localizer.Sms.FailedRecaptcha);
          setLoading(false);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Logger.error(e.message);
        setLoading(false);
      });
  };

  const resendCode = () => {
    Platform.UserService.SendPhoneVerificationMessage()
      .then((response) => {
        setMessage(Localizer.Sms.resentCode);
        setLoading(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const resetCaptcha = () => {
    recaptchaRef.current.reset();
  };

  const enableSubmit = code.length > 3;
  const submitStatus = enableSubmit ? "gold" : "disabled";

  return (
    <>
      <BungieHelmet>
        {captchaEnabled && (
          <script src={"https://www.google.com/recaptcha/api.js"} async defer />
        )}
      </BungieHelmet>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.spacer}>
          {loading && <Spinner inline={true} on={loading} />}
          {smsDatastorePayload.lastDigits &&
            !loading &&
            Localizer.Format(message, {
              LastTwoDigits: smsDatastorePayload.lastDigits,
            })}
        </div>
        <div className={styles.inputLine}>
          <input
            type="text"
            pattern="[0-9]*"
            onChange={handleChange}
            value={code}
            placeholder={Localizer.Sms.Code}
            className={styles.codeInput}
          />
          <div
            className={styles.linkText}
            onClick={captchaEnabled ? checkHuman : resendCode}
            role={"button"}
          >
            {Localizer.Sms.ResendCode}
          </div>
        </div>
        {error !== "" && <SmsError errorMessage={error} />}
        <div className={styles.buttons}>
          <div className={styles.cancel}>
            <Button
              buttonType={"white"}
              size={BasicSize.Small}
              onClick={onCancel}
            >
              {Localizer.Sms.Cancel}
            </Button>
          </div>
          <SubmitButton
            buttonType={submitStatus}
            size={BasicSize.Small}
            onClick={onSubmit}
          >
            {Localizer.Sms.SubmitCode}
          </SubmitButton>
        </div>
        {captchaEnabled && (
          <ReCAPTCHA
            sitekey={siteKey}
            size={"invisible"}
            ref={recaptchaRef}
            theme={"dark"}
            hl={recaptchaLocEquivalents[LocalizerUtils.currentCultureName]}
            onExpired={resetCaptcha}
          />
        )}
      </form>
    </>
  );
};
