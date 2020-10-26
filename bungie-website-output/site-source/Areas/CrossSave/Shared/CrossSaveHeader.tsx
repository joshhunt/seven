import * as React from "react";
import styles from "./CrossSaveHeader.module.scss";
import { CrossSaveActivateSteps } from "../CrossSaveActivate";

interface ICrossSaveHeaderProps extends React.DOMAttributes<HTMLDivElement> {
  /** Text that displays as the title */
  text: React.ReactNode;
  /** Displays as subtitle */
  subtext?: React.ReactNode;
  children?: undefined;
  step?: CrossSaveActivateSteps;
}

interface ICrossSaveHeaderState {}

/**
 * Header showing which step the user is on for cross save
 *  *
 * @param {ICrossSaveHeaderProps} props
 * @returns
 */
export class CrossSaveHeader extends React.Component<
  ICrossSaveHeaderProps,
  ICrossSaveHeaderState
> {
  constructor(props: ICrossSaveHeaderProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { text, subtext, children, ...rest } = this.props;

    return (
      <div className={styles.wrapper} {...rest}>
        <div className={styles.title}>{text}</div>

        {subtext && <div className={styles.subtitle}>{subtext}</div>}
      </div>
    );
  }
}
