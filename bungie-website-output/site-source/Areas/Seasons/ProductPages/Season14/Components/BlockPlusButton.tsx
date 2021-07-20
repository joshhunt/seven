// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React from "react";
import styles from "./BlockPlusButton.module.scss";

interface BlockPlusButtonProps {
  title: string;
  smallTitle?: string;
  link?: string;
  toggleModalFunc?: () => void;
  className?: string;
  isHalfWidth?: boolean;
  hasBottomMargin?: boolean;
  hasRightMargin?: boolean;
  backgroundImage?: string;
  onClick?: () => void;
}

const BlockPlusButton: React.FC<BlockPlusButtonProps> = (props) => {
  const btnClasses = classNames(
    styles.blockPlusButton,
    { [props.className]: props.className },
    { [styles.rightMargin]: props.hasRightMargin },
    { [styles.bottomMargin]: props.hasBottomMargin },
    { [styles.halfWidth]: props.isHalfWidth }
  );

  const handleBtnClick = () => {
    if (props.onClick) {
      props.onClick();
    } else if (props.link) {
      window.location.href = props.link;
    } else if (props.toggleModalFunc) {
      props.toggleModalFunc();
    }
  };

  return (
    <div className={btnClasses} onClick={handleBtnClick}>
      <div
        className={styles.btnBg}
        style={{
          backgroundImage:
            props.backgroundImage && `url(${props.backgroundImage})`,
        }}
      />
      {props.link && (
        <img
          src={"/7/ca/destiny/bgs/season14/link_arrow.svg"}
          className={classNames(styles.btnIcon, { [styles.arrow]: props.link })}
        />
      )}
      {!props.link && (
        <Icon
          iconType={props.link ? "fa" : "material"}
          iconName={props.link ? "arrow-up" : "add"}
          className={classNames(styles.btnIcon, { [styles.arrow]: props.link })}
        />
      )}
      <div className={styles.textContent}>
        <p className={styles.smallTitle}>{props.smallTitle}</p>
        <p className={styles.title}>{props.title}</p>
      </div>
      <div className={styles.bottomShade} />
    </div>
  );
};

export default BlockPlusButton;

export { BlockPlusButtonProps };
