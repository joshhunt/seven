import { ConvertToPlatformError } from "@ApiIntermediary";
import { SmsDataStore } from "@Areas/Sms/SmsDataStore";
import { SmsError } from "@Areas/Sms/SmsError";
import styles from "@Areas/Sms/SmsPage.module.scss";
import { PlatformError } from "@CustomErrors";
import { Localizer } from "@Global/Localization/Localizer";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { BasicSize } from "@UIKit/UIKitUtils";
import { useDataStore } from "@Utilities/ReactUtils";
import classNames from "classnames";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface SmsPhoneEntryFormProps {}

export const SmsPhoneEntryForm: React.FC<SmsPhoneEntryFormProps> = (props) => {
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const smsDataStorePayload = useDataStore(SmsDataStore);

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    Platform.UserService.AddPhoneNumber(phone)
      .then((response) => {
        if (response) {
          sendCode();
        } else {
          setLoading(false);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const sendCode = () => {
    Platform.UserService.SendPhoneVerificationMessage()
      .then((response) => {
        setPhone("");
        setLoading(false);
        goToCodeInput();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e.message);
        setLoading(false);
      });
  };

  const goToCodeInput = () => {
    SmsDataStore.actions.updatePhase("CodeEntry");
  };

  const clearErrorAndHandleInput = (input) => {
    error !== "" && setError("");
    setPhone(input);
  };

  const enableSubmit = phone.length > 5;
  const submitStatus = enableSubmit ? "gold" : "disabled";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <SpinnerContainer loading={loading}>
        <div className={styles.phoneTitle}>
          {Localizer.Sms.EnterPhoneNumber}
        </div>
        <div className={styles.phoneInput}>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={clearErrorAndHandleInput}
            placeholder={""}
            enableSearch={true}
            disableSearchIcon={true}
            dropdownStyle={{ color: "black" }}
            inputStyle={{
              borderRadius: "unset",
              fontSize: "1.15rem",
            }}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && enableSubmit && handleSubmit()
            }
          />
        </div>
        {error !== "" && <SmsError errorMessage={error} />}
        <div className={styles.submit}>
          <Button
            buttonType={submitStatus}
            onClick={handleSubmit}
            size={BasicSize.Small}
          >
            {Localizer.Sms.SendCode}
          </Button>
          {smsDataStorePayload.lastDigits && (
            <p
              className={classNames(styles.linkText, styles.haveCode)}
              onClick={goToCodeInput}
              role={"link"}
            >
              {Localizer.sms.HaveCode}
            </p>
          )}
        </div>
      </SpinnerContainer>
    </form>
  );
};
