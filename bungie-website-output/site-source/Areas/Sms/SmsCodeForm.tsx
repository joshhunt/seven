import { ConvertToPlatformError } from "@ApiIntermediary";
import { SmsDataStore } from "@Areas/Sms/SmsDataStore";
import { SmsError } from "@Areas/Sms/SmsError";
import styles from "@Areas/Sms/SmsPage.module.scss";
import { PlatformError } from "@CustomErrors";
import { PhoneValidationStatusEnum } from "@Enum";
import { Localizer } from "@Global/Localizer";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { SubmitButton } from "@UIKit/Forms/SubmitButton";
import { BasicSize } from "@UIKit/UIKitUtils";
import { useDataStore } from "@Utilities/ReactUtils";
import React, { useEffect, useState } from "react";

interface SmsCodeFormProps {}

export const SmsCodeForm: React.FC<SmsCodeFormProps> = (props) => {
  const smsDatastorePayload = useDataStore(SmsDataStore);

  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resentCode, setResentCode] = useState<boolean>(false);

  const message = resentCode
    ? Localizer.Sms.resentCode
    : Localizer.Sms.EnterCode;

  useEffect(() => {
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

  const handleChange = (event) => {
    event.preventDefault();
    error !== "" && setError("");
    setCode(event.target.value);
  };

  const onSubmit = (event) => {
    setLoading(true);
    setError("");

    event.preventDefault();

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

  const onCancel = () => {
    setLoading(false);
    SmsDataStore.updatePhase("PhoneEntry");
  };

  const resendCode = () => {
    setLoading(true);
    setError("");
    Platform.UserService.SendPhoneVerificationMessage()
      .then((response) => {
        setResentCode(true);
        setLoading(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const enableSubmit = code.length > 3;
  const submitStatus = enableSubmit ? "gold" : "disabled";

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <SpinnerContainer loading={loading}>
        <div className={styles.spacer}>
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
          <div className={styles.linkText} onClick={resendCode} role={"button"}>
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
      </SpinnerContainer>
    </form>
  );
};
