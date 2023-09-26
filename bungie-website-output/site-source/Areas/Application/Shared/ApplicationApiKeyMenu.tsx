// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Application/Shared/ApplicationApiKeys.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { ApiKeyStatus } from "@Enum";
import { Applications, Platform } from "@Platform";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface ApplicationApiKeyMenuProps {
  applicationKey: Applications.ApplicationApiKey;
  callback: () => void;
}

export const ApplicationApiKeyMenu: React.FC<ApplicationApiKeyMenuProps> = (
  props
) => {
  const applicationLoc = Localizer.Application;
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>();

  const changeApiStatus = (keyId: number, newStatus: ApiKeyStatus) => {
    Platform.ApplicationService.ChangeApiKeyStatus(keyId, newStatus)
      .then((result) => {
        //refresh the keys
        props.callback();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const handleChangeApiKeyStatus = (
    keyId: number,
    newStatus: ApiKeyStatus,
    onlyUpdateMenu: boolean
  ) => {
    openMenu && setOpenMenu(false);

    if (!onlyUpdateMenu) {
      changeApiStatus(keyId, newStatus);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef?.current && !menuRef.current.contains(e.target as Node)) {
      setOpenMenu(false);
    }
  };

  const handleClickInside = (e: React.MouseEvent) => {
    !openMenu && setOpenMenu(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", (e) => handleClickOutside(e));

    return () =>
      document.removeEventListener("mousedown", (e) => handleClickOutside(e));
  }, []);

  return (
    <div
      className={styles.keyMenu}
      ref={menuRef}
      onClick={(e) => handleClickInside(e)}
    >
      {!openMenu && <FaCaretDown />}
      {openMenu && (
        <>
          <Button
            buttonType={"text"}
            className={classNames(styles.keyStatus, {
              [styles.keyOff]:
                props.applicationKey.status !== ApiKeyStatus.Active,
            })}
            onClick={(e) =>
              handleChangeApiKeyStatus(
                props.applicationKey.apiKeyId,
                ApiKeyStatus.Disabled,
                props.applicationKey.status !== ApiKeyStatus.Active
              )
            }
          >
            {applicationLoc.DisableKeyButton}
          </Button>
          <Button
            buttonType={"text"}
            className={classNames(styles.keyStatus, {
              [styles.keyOff]:
                props.applicationKey.status === ApiKeyStatus.Active,
            })}
            onClick={(e) =>
              handleChangeApiKeyStatus(
                props.applicationKey.apiKeyId,
                ApiKeyStatus.Active,
                props.applicationKey.status === ApiKeyStatus.Active
              )
            }
          >
            {applicationLoc.EnableKeyButton}
          </Button>
          <Button
            buttonType={"text"}
            className={classNames(styles.keyStatus, {
              [styles.keyOff]:
                props.applicationKey.status === ApiKeyStatus.Active,
            })}
            onClick={(e) =>
              handleChangeApiKeyStatus(
                props.applicationKey.apiKeyId,
                ApiKeyStatus.Deleted,
                props.applicationKey.status === ApiKeyStatus.Active
              )
            }
          >
            {applicationLoc.DeleteKeyButton}
          </Button>
        </>
      )}
    </div>
  );
};
