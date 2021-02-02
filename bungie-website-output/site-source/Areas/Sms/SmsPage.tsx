// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { SmsAccountLine } from "@Areas/Sms/SmsAccountLine";
import { SmsCodeForm } from "@Areas/Sms/SmsCodeForm";
import { SmsDataStore, SmsVerificationPhases } from "@Areas/Sms/SmsDataStore";
import { SmsPhoneEntryForm } from "@Areas/Sms/SmsPhoneEntryForm";
import { SmsSignInButton } from "@Areas/Sms/SmsSignInButton";
import { SmsVerifiedState } from "@Areas/Sms/SmsVerifiedState";
import { PlatformError } from "@CustomErrors";
import { PhoneValidationStatusEnum } from "@Enum";
import { useDataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Platform } from "@Platform";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Icon } from "@UIKit/Controls/Icon";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./SmsPage.module.scss";

interface SmsPageProps {}

export const SmsPage: React.FC<SmsPageProps> = (props) => {
  const [loading, setLoading] = useState(false);

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const userLoggedIn = UserUtils.isAuthenticated(globalState);

  useEffect(() => {
    if (userLoggedIn) {
      setLoading(true);

      Platform.UserService.GetSmsValidationStatus()
        .then((response) => {
          const phase: SmsVerificationPhases =
            response.phoneStatus === PhoneValidationStatusEnum.Validated
              ? "Verified"
              : "PhoneEntry";

          SmsDataStore.actions.updatePhase(phase);

          if (response.lastDigits) {
            SmsDataStore.actions.updateLastDigits(response.lastDigits);
          }

          setLoading(false);
        })
        .catch((e: PlatformError) => {
          setLoading(false);
        });
    }
  }, [globalState.loggedInUser]);

  const metaImage = "/7/ca/destiny/bgs/new_light_group_shot.jpg";

  const urlParams = new URLSearchParams(location.search);
  const steamRedirect = urlParams.get("platform") === "steam";

  const smsDataStorePayload = useDataStore(SmsDataStore);

  return (
    <>
      <BungieHelmet
        title={Localizer.sms.PageTitle}
        image={metaImage}
        description={Localizer.sms.subtitle}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.hero}>
        <div className={styles.gradient} />
        <Icon
          className={styles.icon}
          iconType={"material"}
          iconName={"phonelink_lock"}
        />
        <h1 className={styles.title}>{Localizer.sms.VerifyYourSms}</h1>
        <div className={styles.subtitle}>{Localizer.sms.subtitle}</div>
        {!userLoggedIn ? (
          <div className={styles.signInButton}>
            <SmsSignInButton steam={steamRedirect} />
          </div>
        ) : (
          <div className={styles.heroSpacer} />
        )}
      </div>
      <Grid isTextContainer={true} className={styles.contentContainer}>
        <GridCol cols={12}>
          <SystemDisabledHandler systems={["SmsVerification"]}>
            <SpinnerContainer loading={loading}>
              {userLoggedIn && (
                <div className={styles.content}>
                  <>
                    <SmsAccountLine />
                    {
                      {
                        PhoneEntry: <SmsPhoneEntryForm />,
                        CodeEntry: <SmsCodeForm />,
                        Verified: <SmsVerifiedState />,
                      }[smsDataStorePayload.verificationPhase]
                    }
                  </>
                </div>
              )}
              <div className={styles.infoBlock}>
                <InfoBlock
                  tagAndType={{
                    tag: "smsfaq",
                    type: "InformationBlock",
                  }}
                />
              </div>
            </SpinnerContainer>
          </SystemDisabledHandler>
        </GridCol>
      </Grid>
    </>
  );
};
