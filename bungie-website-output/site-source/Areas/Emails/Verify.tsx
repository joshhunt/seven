import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Emails/Emails.module.scss";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitchIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@Areas/Home/Components/SocialIcons";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { PlatformErrorCodes } from "@Enum";
import { Platform, User, Contract } from "@Platform";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router";
import { Link } from "react-router-dom";

interface VerifyProps {}

interface IEmailVerifyRouteQuery {
  id?: string;
}

const VerifyPlatformErrorToLocaleString = (
  errorCode: PlatformErrorCodes
): string => {
  switch (errorCode) {
    case PlatformErrorCodes.EmailValidationOffline:
      return Localizer.userpages.ValidateEmailOff;
    case PlatformErrorCodes.EmailValidationFailBadLink:
      return Localizer.userpages.ValidateEmailFailBadLink;
    case PlatformErrorCodes.EmailValidationFailOldCode:
      return Localizer.userpages.ValidateEmailFailOldCode;
    // case PlatformErrorCodes.UserEmailValidationUnknown:
    // case PlatformErrorCodes.TokenInvalidMembership:
    // case PlatformErrorCodes.UserCannotSaveUserProfileData:
    // case PlatformErrorCodes.FailedMinimumAgeCheck:
    default:
      return Localizer.userpages.ValidateEmailFailNew;
  }
};
const Verify: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [verifyResponse, setVerifyResponse] = useState<
    User.UserEmailVerificationResponse
  >();
  const [errorResponse, setErrorResponse] = useState<PlatformError>();

  useEffect(() => {
    const validateEmailInput: User.UserEmailVerificationRequest = {
      tokenGuid: params.get("id"),
    };
    Platform.UserService.ValidateEmail(validateEmailInput)
      .then((response) => {
        setVerifyResponse(response);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        setErrorResponse(e);
      });
  }, []);

  if (errorResponse?.errorCode) {
    const localeErrorHtml = VerifyPlatformErrorToLocaleString(
      errorResponse.errorCode
    );

    return (
      <div className={styles.crmContainer}>
        <div className="section crm-body grid-col-12">
          <h1 className="section-header">
            {Localizer.emails.VerificationError}
          </h1>
          <p dangerouslySetInnerHTML={{ __html: localeErrorHtml }} />
        </div>
      </div>
    );
  }

  return (
    <SpinnerContainer loading={!verifyResponse}>
      <div className={styles.crmContainer}>
        <div className="section crm-body grid-col-12">
          <h1 className="section-header">
            {Localizer.emails.EmailAddressVerified}
          </h1>
          <p>{Localizer.emails.VerificationSuccessContentLoggedIn}</p>
        </div>

        <div
          className={`section grid-col-12 ${styles.emailFeaturesContainer} engram`}
        >
          <Anchor
            url={RouteHelper.DigitalRewards()}
            className={"featureContainer engramReward"}
            aria-label={Localizer.emails.verifiedFeatureBungieRewards}
          >
            <h3 className="section-header">
              {Localizer.emails.PowerfulEngram}
            </h3>
            <p>{Localizer.emails.PickUpEngram}</p>
          </Anchor>
        </div>

        <div className={`section grid-col-12 ${styles.emailFeaturesContainer}`}>
          <Anchor
            url={RouteHelper.Rewards()}
            className={"featureContainer bungieRewards"}
            aria-label={Localizer.emails.verifiedFeatureBungieRewards}
          >
            <h3 className="section-header">
              {Localizer.emails.verifiedFeatureBungieRewards}
            </h3>
            <p>{Localizer.emails.verifiedFeatureBungieRewardsDescription}</p>
          </Anchor>
          <Anchor
            url={RouteHelper.Notifications()}
            className={"featureContainer emailSettings"}
            aria-label={Localizer.emails.verifiedFeatureBungieRewards}
          >
            <h3 className="section-header">
              {Localizer.emails.verifiedFeatureEmailSettings}
            </h3>
            <p>{Localizer.emails.verifiedFeatureEmailSettingsDescription}</p>
          </Anchor>
        </div>
      </div>
    </SpinnerContainer>
  );
};

export default React.memo(Verify);
