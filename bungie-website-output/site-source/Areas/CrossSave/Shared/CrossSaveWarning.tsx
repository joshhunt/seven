import * as React from "react";
import styles from "./CrossSaveWarning.module.scss";

interface ICrossSaveWarningProps {
  children?: React.ReactNode;
}

interface ICrossSaveWarningState {}

/**
 * Warning UI for problems in Cross Save that we want to show to the user
 *  *
 * @param {ICrossSaveWarningProps} props
 * @returns
 */
export class CrossSaveWarning extends React.Component<
  ICrossSaveWarningProps,
  ICrossSaveWarningState
> {
  constructor(props: ICrossSaveWarningProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className={styles.warning}>{this.props.children}</div>;
  }
}
