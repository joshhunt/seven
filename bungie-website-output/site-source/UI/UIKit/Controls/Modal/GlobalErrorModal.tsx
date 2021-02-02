// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React, { useRef } from "react";

import { ConfirmationModalInline } from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface IGlobalErrorModalProps {
  errorString: string[];
}

/**
 * GlobalErrorModal - a component that consumes the confirmation modal to help users when they encounter an error.
 * It displays a generic error message with the option to reload the page or go to the support page.
 *  *
 * @param {IGlobalErrorModalProps} props
 * @returns
 */
export const GlobalErrorModal: React.FC<IGlobalErrorModalProps> = ({
  errorString,
}) => {
  const supportId = ConfigUtils.GetParameter(
    "WebRendererCore",
    "BrowserSupportHelpArticleID",
    0
  );
  const modalRef = useRef();

  return (
    <ConfirmationModalInline
      open={true}
      modalRef={modalRef}
      type={"warning"}
      confirmButtonProps={{
        labelOverride: Localizer.Errors.FatalErrorConfirmAction,
        buttonType: "gold",
        onClick: () => {
          location.reload();

          return true;
        },
      }}
      cancelButtonProps={{
        labelOverride: Localizer.Errors.FatalErrorCancelAction,
        buttonType: "white",
        onClick: () => {
          window.location.href = RouteHelper.HelpArticle(supportId).url;

          return false;
        },
      }}
    >
      <p>{Localizer.Errors.FatalErrorMessage}</p>

      {errorString.length > 0 &&
        errorString.map((error) => (
          <p key={error}>
            {Localizer.Errors.Error}: {error}
          </p>
        ))}
    </ConfirmationModalInline>
  );
};

export default GlobalErrorModal;
