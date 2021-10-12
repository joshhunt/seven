// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import styles from "./SeasonModal.module.scss";

interface Season14ModalProps {
  backgroundImage?: string;
  backgroundImageMobile?: string;
  backgroundVideo?: string;
  title: string;
  smallTitle: string;
  blurb: string;
  toggleShow: () => void;
  show: boolean;
}

const Season14Modal: React.FC<Season14ModalProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const [isShowing, setIsShowing] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const transitionDuration = useRef(200);

  useEffect(() => {
    // when show status of modal is changed, update states to control animations of modal
    if (props.show) {
      setIsShowing(true);
      setTimeout(() => {
        setIsShowing(false);
      }, transitionDuration.current);
    } else {
      setIsHiding(true);
      setTimeout(() => {
        setIsHiding(false);
      }, transitionDuration.current);
    }
  }, [props.show]);

  useEffect(() => {
    // if modal is fully shown, prevent page scroll
    const isModalShowing = props.show && !isShowing;
    document.body.style.overflowY = isModalShowing ? "hidden" : "auto";
  }, [isShowing, isHiding]);

  const attemptModalToggle = () => {
    // toggle show status of modal if not currently animating
    if (!isShowing && !isHiding) {
      props.toggleShow();
    }
  };

  const bgImage = responsive.mobile
    ? props.backgroundImageMobile
    : props.backgroundImage;

  const modalClasses = classNames(
    styles.modal,
    isShowing
      ? styles.showing
      : isHiding
      ? styles.hiding
      : props.show
      ? styles.show
      : null
  );

  return (
    <div className={modalClasses}>
      <div className={styles.pageOverlay} onClick={attemptModalToggle} />
      <div className={styles.modalContent}>
        <div
          className={styles.bgWrapper}
          style={{
            backgroundImage: `url(${
              responsive.mobile
                ? props.backgroundImageMobile
                : props.backgroundImage
            })`,
          }}
        />
        <div className={styles.modalExitWrapper} onClick={attemptModalToggle}>
          <img
            src={"/7/ca/destiny/bgs/season14/modal_close_x.svg"}
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

export default Season14Modal;
