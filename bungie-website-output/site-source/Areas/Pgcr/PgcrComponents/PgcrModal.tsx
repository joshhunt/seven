// Created by larobinson, 2022
// Copyright Bungie, Inc.

import {
  createCustomModal,
  CustomModalProps,
} from "@UIKit/Controls/Modal/CreateCustomModal";
import { Spinner, SpinnerContainer } from "@UIKit/Controls/Spinner";
import styles from "../Pgcr.module.scss";
import React from "react";

interface PgcrModalProps extends CustomModalProps {}

interface PgcrModalState {
  loading: boolean;
}

class PgcrModal extends React.Component<PgcrModalProps, PgcrModalState> {
  constructor(props: PgcrModalProps) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  public componentDidMount() {
    this.setState({ loading: false });
  }

  public render() {
    return (
      <SpinnerContainer loading={this.state.loading}>
        {this.props.children}
      </SpinnerContainer>
    );
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
