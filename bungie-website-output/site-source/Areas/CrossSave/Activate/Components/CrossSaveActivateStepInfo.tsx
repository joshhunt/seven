import React from "react";
import styles from "./CrossSaveActivateStepInfo.module.scss";

export class CrossSaveActivateStepInfo extends React.Component<{
  title: React.ReactNode;
  desc: React.ReactNode;
}> {
  public render() {
    return (
      <div className={styles.stepInfo}>
        <h1 className={styles.title}>{this.props.title}</h1>
        <p className={styles.desc}>{this.props.desc}</p>
      </div>
    );
  }
}
