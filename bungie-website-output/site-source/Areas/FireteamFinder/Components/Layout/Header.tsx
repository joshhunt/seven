// Created by atseng, 2023
// Copyright Bungie, Inc.

import {
  BreadcrumbConfiguration,
  FireteamFinderBreadcrumb,
} from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { ButtonConfiguration, HeaderButtons } from "./HeaderButtons";
import styles from "./Header.module.scss";
import React, { ChangeEvent, ReactNode, FC } from "react";
import { Localizer } from "@bungie/localization/Localizer";

interface HeaderProps {
  title?: string;
  subtitle?: ReactNode;
  buttonConfiguration: ButtonConfiguration;
  breadcrumbConfiguration: BreadcrumbConfiguration;
  isLoggedIn?: boolean;
  activityFilterString?: string;
  setActivityFilterString?: (value: string) => void;
}

export const Header: FC<HeaderProps> = (props) => {
  const {
    setActivityFilterString,
    activityFilterString,
    buttonConfiguration,
    subtitle,
    isLoggedIn,
    title,
    breadcrumbConfiguration,
  } = props;
  const activityLabel = "Select Activity";
  const activityPlaceHolder = "Search Activities";
  const clearResultsLabel = "Clear Results";
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActivityFilterString(event.target.value);
  };

  const isActivitySelectView =
    props.breadcrumbConfiguration === "browse-select" ||
    props.breadcrumbConfiguration === "create-select";

  const clearActivityFilter = () => setActivityFilterString("");

  return (
    <div className={styles.header}>
      <FireteamFinderBreadcrumb breadcrumbConfig={breadcrumbConfiguration} />
      <div className={styles.titleWrap}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div id={"headerSecondLine"} className={styles.secondLine}>
        <div className={styles.subtitle}>{subtitle}</div>
        <div className={styles.buttons}>
          <HeaderButtons
            buttonConfig={buttonConfiguration}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
      {isActivitySelectView && (
        <div className={styles.activityFilterWrapper}>
          <p className={styles.selectActivityLabel}>{activityLabel}</p>
          <div className={styles.activityFilterContainer}>
            {activityFilterString && (
              <button className={styles.clearBtn} onClick={clearActivityFilter}>
                {clearResultsLabel}
              </button>
            )}
            <div className={styles.inputIconWrapper}>
              <input
                value={activityFilterString}
                onChange={handleInputChange}
                placeholder={activityPlaceHolder}
                type="text"
                className={styles.activityInput}
              />
              <MagnifierIcon className={styles.magnifierIcon} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MagnifierIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      className={className}
    >
      <path
        d="M24.6074 26.3574L16.7324 18.4824C16.1074 18.9824 15.3887 19.3783 14.5762 19.6699C13.7637 19.9616 12.8991 20.1074 11.9824 20.1074C9.71159 20.1074 7.78992 19.3212 6.21742 17.7487C4.64409 16.1753 3.85742 14.2533 3.85742 11.9824C3.85742 9.71159 4.64409 7.78951 6.21742 6.21617C7.78992 4.64367 9.71159 3.85742 11.9824 3.85742C14.2533 3.85742 16.1753 4.64367 17.7487 6.21617C19.3212 7.78951 20.1074 9.71159 20.1074 11.9824C20.1074 12.8991 19.9616 13.7637 19.6699 14.5762C19.3783 15.3887 18.9824 16.1074 18.4824 16.7324L26.3574 24.6074L24.6074 26.3574ZM11.9824 17.6074C13.5449 17.6074 14.8733 17.0608 15.9674 15.9674C17.0608 14.8733 17.6074 13.5449 17.6074 11.9824C17.6074 10.4199 17.0608 9.09159 15.9674 7.99742C14.8733 6.90409 13.5449 6.35742 11.9824 6.35742C10.4199 6.35742 9.09159 6.90409 7.99742 7.99742C6.90409 9.09159 6.35742 10.4199 6.35742 11.9824C6.35742 13.5449 6.90409 14.8733 7.99742 15.9674C9.09159 17.0608 10.4199 17.6074 11.9824 17.6074Z"
        fill="white"
      />
    </svg>
  );
};
