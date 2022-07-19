// Created by larobinson, 2022
// Copyright Bungie, Inc.

import {
  createCustomModal,
  CustomModalProps,
} from "@UIKit/Controls/Modal/CreateCustomModal";
import styles from "../Pgcr.module.scss";
import React from "react";

interface PgcrModalProps extends CustomModalProps {}

interface PgcrModalState {}

class PgcrModal extends React.Component<PgcrModalProps, PgcrModalState> {
  constructor(props: PgcrModalProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}

export default createCustomModal<PgcrModalProps>(
  PgcrModal,
  {
    className: styles.pgcrModal,
    contentClassName: styles.modalContentClass,
  },
  (props) => {
    return true;
  }
);
