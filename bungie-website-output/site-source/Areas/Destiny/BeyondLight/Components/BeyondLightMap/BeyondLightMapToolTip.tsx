// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { memo } from "react";
import styles from "./BeyondLightMapToolTip.module.scss";

interface BeyondLightMapToolTipProps {
  title: string;
  description: string;
  imageThumb?: string;
  image?: string;
  isActive?: boolean;
  outer?: string;
  toolTipId?: string;
  toolTipFlair?: string;
}

const BeyondLightMapToolTip = ({
  title,
  description,
  image,
  imageThumb,
  isActive,
  toolTipId,
  toolTipFlair,
}: BeyondLightMapToolTipProps) => {
  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  return (
    <div className={styles.contentWrapper} style={{ zIndex: isActive ? 1 : 0 }}>
      <span
        id={isActive ? null : toolTipId}
        className={classNames(
          styles.iconWrapper,
          styles.iconWrapperPulse,
          isActive && styles.iconWrapperActive
        )}
      >
        <svg
          aria-hidden="true"
          fill="#fff"
          className="icon icon--type-cog"
          width="16"
          height="16"
          role="img"
          version="1.1"
          viewBox="0 0 64 64"
        >
          <rect className="horizontal" y="28" width="64" height="8" />
          <rect className="vertical" x="28" width="8" height="64" />
        </svg>
      </span>

      {isActive && (
        <div
          id={toolTipId}
          className={classNames(
            styles.innerContentWrapper,
            isActive && styles.innerContentWrapperActive
          )}
          style={{ backgroundImage: `url(${toolTipFlair}` }}
        >
          <h3 id={toolTipId} onClick={() => showImage(image)}>
            {title}
          </h3>
          <p id="description">{description}</p>
          <img
            src={imageThumb}
            alt=""
            role="presentation"
            aria-describedby={"description"}
            onClick={() => showImage(image)}
          />
        </div>
      )}
    </div>
  );
};

export default memo(BeyondLightMapToolTip);
