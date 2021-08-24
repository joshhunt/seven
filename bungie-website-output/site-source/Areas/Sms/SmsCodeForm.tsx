import { ConvertToPlatformError } from "@ApiIntermediary";
import { SmsDataStore } from "@Areas/Sms/SmsDataStore";
import { SmsError } from "@Areas/Sms/SmsError";
import styles from "@Areas/Sms/SmsPage.module.scss";
import { PlatformError } from "@CustomErrors";
import { PhoneValidationStatusEnum } from "@Enum";
import { Localizer } from "@bungie/localization";
import { Platform } from "@Platform";
import { Recaptcha } from "@UI/Authentication/Recaptcha";
import { RecaptchaBroadcaster } from "@UI/Authentication/RecaptchaBroadcaster";
import { Button } from "@UIKit/Controls/Button/Button";
import { Spinner } from "@UIKit/Controls/Spinner";
import { SubmitButton } from "@UIKit/Forms/SubmitButton";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { useDataStore } from "@bungie/datastore/DataStore";
import React, { ChangeEvent, useEffect, useState } from "react";

interface SmsCodeFormProps {}

export const SmsCodeForm: React.FC<SmsCodeFormProps> = (props) => {
  const smsDatastorePayload = useDataStore(SmsDataStore);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(Localizer.Sms.EnterCode);
  const captchaEnabled = ConfigUtils.SystemStatus("SmsResendCodeRecaptcha");

  useEffect(() => {
    //Check SMS validation status
    Platform.UserService.GetSmsValidationStatus()
      .then(
        (response) =>
          response.phoneStatus === PhoneValidationStatusEnum.CodeSent &&
          SmsDataStore.actions.updateLastDigits(response.lastDigits)
      )
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  //Handles change for input
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setError("");
    setCode(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");

    Platform.UserService.CheckPhoneValidation(code)
      .then((response) => {
        SmsDataStore.actions.updateLastDigits(response.lastDigits);
        SmsDataStore.actions.updatePhase("Verified");
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
    SmsDataStore.actions.updatePhase("PhoneEntry");
  };

  const showFailedRecaptchaError = () => {
    setError(Localizer.sms.FailedRecaptcha);
  };

  const resendCode = () => {
    Platform.UserService.SendPhoneVerificationMessage()
      .then((response) => {
        setMessage(Localizer.Sms.resentCode);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setMessage("");
        setError(e.message);
      });

    setLoading(false);
  };

  const executeRecaptchaAsync = () => {
    setLoading(true);
    setMessage(Localizer.sms.SendingCode);
    setError("");
    setCode("");

    RecaptchaBroadcaster.executeAsync();
  };

  const enableSubmit = code.length > 3;
  const submitStatus = enableSubmit ? "gold" : "disabled";

  return (
    <>
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
            onClick={captchaEnabled ? executeRecaptchaAsync : resendCode}
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
          <Recaptcha
            onSuccess={resendCode}
            onFailure={showFailedRecaptchaError}
          />
        )}
      </form>
    </>
  );
};
