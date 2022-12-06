// Created by atseng, 2019
// Copyright Bungie, Inc.

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { IoMdWarning } from "@react-icons/all-files/io/IoMdWarning";
import styles from "./GlobalBar.module.scss";
import classNames from "classnames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { IMultiSiteLink } from "@Routes/RouteHelper";

// Required props
interface IGlobalBarProps {
  initiallyVisible: boolean;
  message: React.ReactNode;
  url: string | IMultiSiteLink;
  dismissible: boolean;
  localStorageKey: string;
  barClassNames?: string;
  showWarningIcon?: boolean;
  showCheckIcon?: boolean;
  children?: React.ReactNode;
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
    const appLayout = document.getElementById("app-layout");

    window.localStorage.setItem(localStorageKey, childShow.toString());
    appLayout?.classList.toggle("global-bar-shown", childShow);

    if (document.getElementsByClassName(styles.globalAlertsBar).length > 0) {
      appLayout?.classList.add("global-bar-shown");
    }
  }, [childShow]);

  return childShow ? (
    <>
      <Anchor
        className={classNames(styles.globalAlertsBar, barClassNames)}
        url={url}
      >
        <Grid>
          <GridCol cols={12}>
            {showWarningIcon && <IoMdWarning />}
            {showCheckIcon && <FaCheckCircle />}
            <span>{message}</span>
            {dismissible && (
              <div onClick={(e) => removeBar(e)}>
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
