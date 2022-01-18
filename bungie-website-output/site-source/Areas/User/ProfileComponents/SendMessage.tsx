// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/ProfileComponents/SendMessage.module.scss";
import { PlatformError } from "@CustomErrors";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Platform, Requests, Responses } from "@Platform";
import { Auth } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { FormikTextArea } from "@UIKit/Forms/FormikForms/FormikTextArea";
import { BasicSize } from "@UIKit/UIKitUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import classNames from "classnames";

interface SendMessageProps {
  className: string;
  recipientsBnetMembershipId: string;
  showModal: boolean;
  onClose: () => void;
}

export const SendMessage: React.FC<SendMessageProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const [modalIsOpen, toggleModalVisibility] = useState<boolean>(
    props.showModal
  );
  const [canShowModal, toggleModalPermission] = useState<boolean>(
    UserUtils.isAuthenticated(globalState)
  );

  const sendMessage = (
    input: Requests.CreateConversationRequest,
    callback: () => void
  ) => {
    Platform.MessageService.CreateConversationV2(input)
      .then((response: Responses.SaveMessageResult) => {
        callback();

        toggleModalVisibility(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        callback();
        Modal.error(e);
      });
  };

  useEffect(() => {
    toggleModalVisibility(props.showModal);
  }, [props.showModal, modalIsOpen]);

  useEffect(() => {
    toggleModalPermission(UserUtils.isAuthenticated(globalState));
  }, [globalState.loggedInUser]);

  const onClose = () => {
    toggleModalVisibility(false);
    props.onClose();
  };

  const classes = classNames(styles.sendMessageModal, {
    [props.className]: props.className,
  });

  return (
    <Modal
      open={modalIsOpen}
      onClose={() => onClose()}
      contentClassName={styles.sendMessageModalContent}
      className={classes}
    >
      {!canShowModal && (
        <Auth
          onSignIn={() => toggleModalPermission(true)}
          autoOpenModal={false}
          mode={"inline"}
        />
      )}
      {canShowModal && (
        <Formik
          initialValues={{
            message: "",
          }}
          validationSchema={Yup.object({
            message: Yup.string(),
          })}
          enableReinitialize
          onSubmit={(values, { setSubmitting, resetForm }) => {
            sendMessage(
              {
                subject: "",
                membersToId: [
                  props.recipientsBnetMembershipId,
                  globalState.loggedInUser.user.membershipId,
                ],
                body: values.message,
              },
              () => {
                resetForm();
                setSubmitting(false);
              }
            );
          }}
        >
          {(formikProps) => (
            <Form className={styles.sendMessageForm}>
              <h3>{Localizer.Profile.SendMessage}</h3>
              <FormikTextArea
                name={"message"}
                placeholder={Localizer.Usertools.EnterMessage}
                className={styles.textArea}
              />
              <button
                type="submit"
                className={styles.textOnly}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                <Button
                  buttonType={"gold"}
                  size={BasicSize.Small}
                  loading={formikProps.isSubmitting}
                  disabled={!(formikProps.isValid && formikProps.dirty)}
                >
                  {Localizer.Usertools.SubmitMessageButtonText}
                </Button>
              </button>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};
