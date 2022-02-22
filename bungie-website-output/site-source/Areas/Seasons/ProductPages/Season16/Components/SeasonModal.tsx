// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./SeasonModal.module.scss";

interface Season16ModalProps {
  backgroundImage?: string;
  backgroundImageMobile?: string;
  backgroundVideo?: string;
  title: string;
  smallTitle: string;
  blurb: string;
  toggleShow: () => void;
  show: boolean;
}

const Season16Modal: React.FC<Season16ModalProps> = (props) => {
  const responsive = useDataStore(Responsive);

  // indicates if modal is fading in/out
  const [isLoading, setIsLoading] = useState(false);
  // fade in/out transition duration
  const transitionDuration = useRef(200);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // props.setIsBodyOverflowHidden(props.show);
      props.show ? BrowserUtils.lockScroll(null) : BrowserUtils.unlockScroll();
    }, transitionDuration.current);
  }, [props.show]);

  const attemptModalToggle = () => {
    // toggle visibility status of modal if not currently animating
    if (!isLoading) {
      props.toggleShow();
    }
  };

  const bgImage = responsive.mobile
    ? props.backgroundImageMobile
    : props.backgroundImage;

  const modalClasses = classNames(
    styles.modal,
    { [styles.show]: props.show },
    { [styles.fadingOut]: !props.show && isLoading },
    { [styles.hidden]: !props.show && !isLoading }
  );

  return (
    <div className={modalClasses}>
      <div className={styles.pageOverlay} onClick={attemptModalToggle} />
      <div className={styles.modalContent}>
        <div
          className={styles.bgWrapper}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className={styles.modalExitWrapper} onClick={attemptModalToggle}>
          <img
            src={"/7/ca/destiny/bgs/season15/modal_close_x.svg"}
            className={styles.icon}
          />
        </div>
        <div className={styles.textOuterWrapper}>
          <div className={styles.textContent}>
            <p className={classNames(styles.smallTitle)}>{props.smallTitle}</p>
            <h1 className={classNames(styles.heading, styles.title)}>
              {props.title}
            </h1>
            <p className={styles.blurb}>{props.blurb}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Season16Modal;
