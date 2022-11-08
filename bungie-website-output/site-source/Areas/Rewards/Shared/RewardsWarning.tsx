// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { RewardsDestinyMembershipDataStore } from "@Areas/Rewards/DataStores/RewardsDestinyMembershipDataStore";
import styles from "@Areas/Rewards/Rewards.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { OptInFlags } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EmailValidationState, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { ReactNode, useState } from "react";

interface RewardsWarningProps {}

export const RewardsWarning: React.FC<RewardsWarningProps> = (props) => {
  const rewardLoc = Localizer.Bungierewards;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(RewardsDestinyMembershipDataStore);

  const openSignInModal = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();
    });
  };

  const determineWarning = () => {
    if (ConfigUtils.SystemStatus("D2RewardsStoreMigration")) {
      const migrationAlertHelpArticleUrl = ConfigUtils.GetParameter(
        SystemNames.StoreMigrationHelpArticleByLocale,
        `help_${Localizer.CurrentCultureName}`,
        "https://help.bungie.net/hc/en-us/articles/360048721172-Bungie-Rewards"
      );

      const helpArticleLink = (
        <Anchor url={migrationAlertHelpArticleUrl}>
          {rewardLoc.helpArticleLink}
        </Anchor>
      );

      const migrationAlertDesc = (
        <>
          {Localizer.FormatReact(rewardLoc.ComingSoonInJuly2021Purchases, {
            helpArticleLink: helpArticleLink,
          })}
        </>
      );

      return (
        <RewardsWarningFragment
          title={rewardLoc.StoreMigrationHeading}
          description={migrationAlertDesc}
          className={styles.storeMigration}
        />
      );
    }

    if (!UserUtils.isAuthenticated(globalState)) {
      const signInActionTrigger = (
        <span
          className={styles.actionTrigger}
          onClick={() => openSignInModal()}
        >
          {rewardLoc.triggerToSignInOrCreate}
        </span>
      );
      const signInDesc = (
        <>
          {" "}
          {Localizer.FormatReact(rewardLoc.Signintoearnrewards, {
            triggerToSignInOrCreate: signInActionTrigger,
          })}
        </>
      );

      return (
        <RewardsWarningFragment
          title={rewardLoc.PlayEarnReward}
          description={signInDesc}
          className={styles.earn}
        />
      );
    }

    const emailVerified =
      UserUtils.getEmailValidationState(
        globalState.loggedInUser.emailStatus
      ) === EmailValidationState.Verified;
    const emailSettingLink = RouteHelper.EmailAndSms();

    if (!emailVerified) {
      const verifyEmailDescription = (
        <>
          {rewardLoc.VerificationRequiredBody}{" "}
          <Anchor url={emailSettingLink}>{rewardLoc.EmailSettingsText}</Anchor>
        </>
      );

      return (
        <RewardsWarningFragment
          title={rewardLoc.VerificationRequiredHeader}
          description={verifyEmailDescription}
          className={""}
        />
      );
    }

    const emailSettingsValue = parseInt(
      globalState.loggedInUser.emailUsage,
      10
    );
    const hasMarketing =
      (emailSettingsValue & OptInFlags.Marketing) === OptInFlags.Marketing;
    const hasSocial =
      (emailSettingsValue & OptInFlags.Social) === OptInFlags.Social;

    if (emailVerified && (!hasMarketing || !hasSocial)) {
      const updateMarketingSettingsLink = (
        <Anchor url={emailSettingLink}>
          {rewardLoc.yourEmailSettingsLink}
        </Anchor>
      );

      return (
        <RewardsWarningFragment
          title={rewardLoc.MarketingRequiredHeader}
          description={
            <>
              {Localizer.FormatReact(rewardLoc.ToParticipateInTheBungie, {
                yourEmailSettingsLink: updateMarketingSettingsLink,
              })}
            </>
          }
          className={styles.marketing}
        />
      );
    }

    if (hasMarketing && hasSocial && emailVerified) {
      const helpArticle = RouteHelper.HelpArticle(
        ConfigUtils.GetParameter(
          SystemNames.D2Rewards,
          SystemNames.D2RewardsHelpArticleFirehoseId,
          0
        )
      );

      const verifiedEmailSettingsLink = (
        <Anchor url={emailSettingLink}>
          {rewardLoc.verifiedEmailSettingsLink}
        </Anchor>
      );
      const helpArticleLink = (
        <Anchor url={helpArticle}>{rewardLoc.verifiedHelpPageLink}</Anchor>
      );

      const verifiedSuccessDesc = (
        <>
          {Localizer.FormatReact(rewardLoc.VerificationSuccessBodyReact, {
            verifiedEmailSettingsLink: verifiedEmailSettingsLink,
            verifiedHelpPageLink: helpArticleLink,
          })}
        </>
      );

      return (
        <RewardsWarningFragment
          title={Localizer.Format(rewardLoc.VerificationSuccessHeader, {
            email: globalState.loggedInUser.email,
          })}
          description={verifiedSuccessDesc}
          className={styles.success}
        />
      );
    }

    if (destinyMembership?.loaded && !destinyMembership?.characters) {
      return (
        <RewardsWarningFragment
          title={rewardLoc.Destiny2CharacterRequiredHeader}
          description={rewardLoc.Destiny2CharacterRequiredBody}
          className={""}
        />
      );
    }
  };

  return determineWarning();
};

interface RewardsWarningFragmentProps {
  title: string;
  description: ReactNode;
  className: string;
}

const RewardsWarningFragment: React.FC<RewardsWarningFragmentProps> = (
  props
) => {
  const rewardLoc = Localizer.Bungierewards;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [agreeEmailStarted, setAgreeEmailStarted] = useState(false);

  const agreeEmail = () => {
    let emailUsage: OptInFlags;

    const userEmailUsage = globalState.loggedInUser.emailUsage;

    if (parseInt(userEmailUsage, 10) & OptInFlags.System) {
      emailUsage |= OptInFlags.System;
    }

    if (parseInt(userEmailUsage, 10) & OptInFlags.CustomerService) {
      emailUsage |= OptInFlags.CustomerService;
    }

    emailUsage |=
      OptInFlags.Social |
      OptInFlags.Marketing |
      OptInFlags.Newsletter |
      OptInFlags.UserResearch;

    const input: Contract.UserEditRequest = {
      membershipId: globalState.loggedInUser.user.membershipId,
      displayName: null,
      about: null,
      emailAddress: null,
      locale: null,
      statusText: null,
      emailUsage: emailUsage.toString(),
    };

    Platform.UserService.UpdateUser(input)
      .then((result) => {
        setAgreeEmailStarted(false);
        GlobalStateDataStore.actions.refreshCurrentUser(true);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setAgreeEmailStarted(false);
        Modal.error(e);
      });
  };

  return (
    <GridCol
      cols={12}
      className={classNames(styles.rewardWarning, props.className)}
    >
      <div className={styles.rewardWarningContainer}>
        <p className={styles.emailTitle}>
          <SafelySetInnerHTML html={props.title} />
        </p>
        {props.description && (
          <p className={styles.emailDescription}>{props.description}</p>
        )}
        {props.className.indexOf("marketing") > -1 && (
          <Button
            className={styles.optInButton}
            buttonType={"gold"}
            size={BasicSize.Small}
            loading={agreeEmailStarted}
            onClick={agreeEmail}
          >
            {rewardLoc.Agree}
          </Button>
        )}
      </div>
    </GridCol>
  );
};
