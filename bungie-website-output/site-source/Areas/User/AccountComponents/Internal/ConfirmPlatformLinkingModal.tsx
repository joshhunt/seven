// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/Internal/ConfirmPlatformLinkingModal.module.scss";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, PlatformFriendType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

interface ConfirmPlatformLinkingModalContentProps {
  credential: BungieCredentialType;
  onCancelButton: () => void;
  continueToLinkingCallback: () => void;
}

export const ConfirmPlatformLinkingModalContent: React.FC<ConfirmPlatformLinkingModalContentProps> = (
  props
) => {
  const { credential, onCancelButton, continueToLinkingCallback } = props;

  const globalState = useDataStore(GlobalStateDataStore, [
    "crossSavePairingStatus",
  ]);

  const accountlinkingLoc = Localizer.Accountlinking;
  const linkAccount = accountlinkingLoc.LinkAccount;
  const typeToContinue = Localizer.Format(
    accountlinkingLoc.TypeConfirmstringToContinue,
    { confirmString: linkAccount }
  );

  const [canContinue, allowContinue] = useState(false);

  const [credentialTypes, updateCredential] = useState<BungieCredentialType[]>(
    []
  );

  const isCrossSaved =
    globalState?.crossSavePairingStatus &&
    typeof globalState.crossSavePairingStatus.primaryMembershipId !==
      "undefined";

  if (credential === BungieCredentialType.None) {
    return null;
  }

  //getting credentialTypes here instead of GlobalStateDataStore to determine successful linking because there is a race condition in GlobalStateDataStore preventing us
  const getCredentialTypes = () => {
    Platform.UserService.GetCredentialTypesForAccount().then(
      (response: Contract.GetCredentialTypesForAccountResponse[]) => {
        updateCredential(response?.map((value) => value.credentialType));
      }
    );
  };

  const linkPlatform = () => {
    //close the modal
    continueToLinkingCallback();

    BrowserUtils.openWindow(
      RouteHelper.GetAccountLink(credential, 0).url,
      "loginui",
      () => {
        GlobalStateDataStore.refreshUserAndRelatedData();
        getCredentialTypes();
      }
    );
  };

  useEffect(() => {
    if (credentialTypes.includes(credential)) {
      //the login window was closed and the credentialTypes now includes the new one
      //success
      Modal.open(accountlinkingLoc.SuccessfullyLinked);
    }

    //if loginClosed but did not add publicCredential then assume user backed out of auth window manually
  }, [credentialTypes]);

  useEffect(() => {
    //new platform? reset the check
    allowContinue(false);
  }, [credential]);

  useEffect(() => {
    getCredentialTypes();
  }, []);

  const credentialString =
    accountlinkingLoc[
      EnumUtils.getStringValue(credential, BungieCredentialType)
    ];

  return (
    <div className={styles.confirmPlatformLinkModal}>
      {isCrossSaved && (
        <div className={styles.crossSaveWarningHeader}>
          <h3>{accountlinkingLoc.CrossSave}</h3>
          <p>{accountlinkingLoc.YourBungieAccountHasCross}</p>
        </div>
      )}

      <div className={styles.crossSaveWarningBody}>
        {isCrossSaved && (
          <ul className={styles.crossSaveWarnings}>
            <li>
              {Localizer.Format(accountlinkingLoc.YourCrossSaveGuardians, {
                platform: credentialString,
              })}
            </li>
            <li className={styles.importantPoint}>
              {Localizer.Format(accountlinkingLoc.YouWillNotBeAbleToUnlink, {
                platform: credentialString,
              })}
            </li>
          </ul>
        )}
        <p>{typeToContinue}</p>
        <Formik
          initialValues={{
            linkAccountConfirm: "",
          }}
          validationSchema={Yup.object({
            linkAccountConfirm: Yup.string(),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm();
            linkPlatform();
          }}
          onReset={(value, { resetForm }) => {
            onCancelButton();
          }}
        >
          {(formikProps) => {
            return (
              <Form>
                <FormikTextInput
                  name={"linkAccountConfirm"}
                  type={"text"}
                  disabled={false}
                  classes={{ input: styles.textInput }}
                  placeholder={linkAccount}
                  onChange={(e) => {
                    e.target.value.trim().toLowerCase() !==
                    linkAccount.trim().toLowerCase()
                      ? allowContinue(false)
                      : allowContinue(true);
                  }}
                />
                <div className={styles.actions}>
                  <button type="submit" className={styles.textOnly}>
                    <Button
                      buttonType={canContinue ? "gold" : "disabled"}
                      size={BasicSize.Small}
                      loading={formikProps.isSubmitting}
                      disabled={!canContinue}
                    >
                      {linkAccount}
                    </Button>
                  </button>
                  <button type="reset" className={styles.textOnly}>
                    <Button buttonType={"white"} size={BasicSize.Small}>
                      {Localizer.Actions.Cancel}
                    </Button>
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

interface ConfirmPlatformLinkingModalProps {
  open: boolean;
  onClose: () => void;
  platform?: PlatformFriendType;
  credential?: BungieCredentialType;
}

export const ConfirmPlatformLinkingModal: React.FC<ConfirmPlatformLinkingModalProps> = (
  props
) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      contentClassName={styles.linkPlatformWarningContent}
    >
      <ConfirmPlatformLinkingModalContent
        credential={
          props.credential ??
          UserUtils.getCredentialTypeFromPlatformFriendType(props.platform)
        }
        onCancelButton={() => props.onClose()}
        continueToLinkingCallback={() => props.onClose()}
      />
    </Modal>
  );
};
