// Created by larobinson, 2020
// Copyright Bungie, Inc.

import React from "react";
import styles from "./SmsPage.module.scss";

interface SmsErrorProps {
  errorMessage: string;
}

export const SmsError: React.FC<SmsErrorProps> = (props) => {
  return <div className={styles.errorString}>{props.errorMessage}</div>;
};
