// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { FC, ReactNode, useMemo, memo } from "react";
import classNames from "classnames";

import styles from "./ClipPathWrapper.module.scss";

interface Classes {
  wrapper?: string;
}
interface Props {
  backgroundColor?: string;
  backgroundImage?: string;
  children: ReactNode;
  clipPathOff?: boolean;
  classes?: Classes;
}

const ClipPathWrapper: FC<Props> = ({
  children,
  backgroundColor,
  backgroundImage,
  clipPathOff = false,
  classes,
}) => {
  const composedWrapperClass = useMemo(
    () =>
      classNames({
        [styles.clipPathWrapper]: !clipPathOff,
        [classes?.wrapper]: classes?.wrapper,
      }),
    [clipPathOff, classes?.wrapper]
  );

  return (
    <section className={composedWrapperClass}>
      <div
        style={{
          backgroundColor: `${backgroundColor && backgroundColor}`,
          backgroundImage: backgroundImage && `url(${backgroundImage})`,
        }}
        className={styles.bgContainer}
      >
        {children}
      </div>
    </section>
  );
};

export default memo(ClipPathWrapper);
