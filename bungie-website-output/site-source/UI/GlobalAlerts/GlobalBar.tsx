// Created by atseng, 2019
// Copyright Bungie, Inc.

import React, { useEffect, useState } from "react";
import { FaCheckCircle, MdClose } from "react-icons/all";
import { IoMdWarning } from "react-icons/io";
import styles from "./GlobalBar.module.scss";
import classNames from "classnames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { IMultiSiteLink } from "@Routes/RouteHelper";

// Required props
interface IGlobalBarProps {
  initiallyVisible: boolean;
  message: string;
  url: string | IMultiSiteLink;
  dismissible: boolean;
  localStorageKey: string;
  barClassNames?: string;
  showWarningIcon?: boolean;
  showCheckIcon?: boolean;
}

/**
 * GlobalBar - a generic global bar that is shown at the top of all react pages
 *  *
 * @param {IGlobalBarProps} props
 * @returns
 */
export const GlobalBar: React.FC<IGlobalBarProps> = (props) => {
  const {
    initiallyVisible,
    barClassNames,
    url,
    localStorageKey,
    message,
    dismissible,
    showCheckIcon,
    showWarningIcon,
    children,
  } = props;

  const [childShow, setChildShow] = useState(initiallyVisible);

  const removeBar = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setChildShow(false);
  };

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, childShow.toString());
    const appLayout = document.getElementById("app-layout");
    appLayout.classList.toggle("global-bar-shown", childShow);
  }, [childShow]);

  return childShow ? (
    <>
      <Anchor
        className={classNames(styles.globalAlertsBar, barClassNames)}
        url={url}
      >
        <Grid className={styles.globalBar}>
          <GridCol cols={12}>
            {showWarningIcon && <IoMdWarning />}
            {showCheckIcon && <FaCheckCircle />}
            <span className={styles.content}>{message}</span>
            {dismissible && (
              <div className={styles.closeButton} onClick={(e) => removeBar(e)}>
                <MdClose />
              </div>
            )}
          </GridCol>
          {children}
        </Grid>
      </Anchor>
    </>
  ) : null;
};
