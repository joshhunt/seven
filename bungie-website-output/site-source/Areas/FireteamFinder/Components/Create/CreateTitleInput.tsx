// Created by atseng, 2023
// Copyright Bungie, Inc.

import TitleBuilder from "@Areas/FireteamFinder/Components/Create/TitleBuilder";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React from "react";
import modalStyles from "./CreateFireteamModals.module.scss";
import styles from "./CreateTitleInput.module.scss";

interface CreateTitleInputProps {
  placeholder: string;
  titleStrings: string[];
  openTitleBuilderOnClick: boolean;
  removeOnClick: boolean;
  relevantActivitySetLabelHashes?: number[];
  updateTitleHashes?: React.Dispatch<React.SetStateAction<number[]>>;
  updateTitleStrings?: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export const CreateTitleInput: React.FC<CreateTitleInputProps> = (props) => {
  const openTitleBuilder = () => {
    const titleModal = Modal.open(
      <TitleBuilder
        currentTitleStrings={props.titleStrings}
        updateTitleHashes={props.updateTitleHashes}
        titleUpdated={(newStrings: string[]) => {
          props.updateTitleStrings(newStrings);
          titleModal.current.close();
        }}
        closeModal={() => titleModal.current.close()}
        relevantActivitySetLabelHashes={props.relevantActivitySetLabelHashes}
      />,
      { className: modalStyles.createFireteamModalWrapper }
    );

    return titleModal;
  };

  const CurrentConstructedTitle: React.FC<CreateTitleInputProps> = (
    relayedProps
  ) => {
    return relayedProps.titleStrings?.length ? (
      <>
        {relayedProps.titleStrings.map((ts, index) => (
          <div
            key={`${ts}-${index}`}
            onClick={
              relayedProps.removeOnClick ? () => removeFromTitle(ts) : null
            }
          >
            {ts}
          </div>
        ))}
      </>
    ) : (
      <span className={styles.placeholder}>{relayedProps.placeholder}</span>
    );
  };

  const removeFromTitle = (titleString: string) => {
    props.updateTitleStrings([
      ...props.titleStrings.filter((s) => s !== titleString),
    ]);
  };

  return props.openTitleBuilderOnClick ? (
    <Button
      buttonType={"white"}
      className={classNames(styles.inputBoxTitle, props.className)}
      onClick={() => openTitleBuilder()}
    >
      <CurrentConstructedTitle {...props} />
    </Button>
  ) : (
    <div className={classNames(styles.inputBoxTitle, props.className)}>
      <CurrentConstructedTitle {...props} />
    </div>
  );
};
