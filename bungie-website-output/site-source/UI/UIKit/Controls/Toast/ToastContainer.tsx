// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./ToastContainer.module.scss";
import { IGlobalElement } from "@Global/DataStore/GlobalElementDataStore";
import { ToastPosition, ToastProps } from "./Toast";
import classNames from "classnames";

// Required props
interface IToastContainerProps {
  toasts: IGlobalElement[];
}

// Default props - these will have values set in ToastContainer.defaultProps
interface DefaultProps {}

type Props = IToastContainerProps & DefaultProps;

interface IToastContainerState {}

/**
 * ToastContainer - Replace this description
 *  *
 * @param {IToastContainerProps} props
 * @returns
 */
export class ToastContainer extends React.Component<
  Props,
  IToastContainerState
> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {};

  /** Loop through all the toasts and put them in the appropriate buckets by position */
  private getToastsByPosition() {
    const toasts = this.props.toasts.map((t) => t.el);
    const byPosition: { [key in ToastPosition]: JSX.Element[] } = {
      t: [],
      tl: [],
      tr: [],
      r: [],
      l: [],
      b: [],
      br: [],
      bl: [],
    };

    Object.keys(byPosition).forEach((pos: ToastPosition) => {
      const matching = toasts.filter(
        (t) => (t.props as ToastProps).position === pos
      );
      byPosition[pos].push(...matching);
    });

    return byPosition;
  }

  public render() {
    const toastsByPosition = this.getToastsByPosition();

    return (
      <div className={styles.container}>
        {
          // Render each bucket with the toasts inside
          Object.keys(toastsByPosition).map((pos: ToastPosition) => (
            <div key={pos} className={classNames(styles.toaster, styles[pos])}>
              {toastsByPosition[pos]}
            </div>
          ))
        }
      </div>
    );
  }
}
