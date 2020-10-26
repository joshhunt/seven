// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BuyButton.module.scss";
import { Button, ButtonProps } from "./Button";
import classNames from "classnames";

// Required props
interface IBuyButtonProps extends ButtonProps {}

// Default props - these will have values set in BuyButton.defaultProps
interface DefaultProps {
  /** Between 0 and 1 (opacity of sheen) */
  sheen: number;
}

export type BuyButtonProps = IBuyButtonProps & DefaultProps;

interface IBuyButtonState {}

/**
 * BuyButton - Replace this description
 *  *
 * @param {IBuyButtonProps} props
 * @returns
 */
export class BuyButton extends React.Component<
  BuyButtonProps,
  IBuyButtonState
> {
  constructor(props: BuyButtonProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {
    sheen: 0.5,
  };

  public render() {
    const { children, className, sheen, ...rest } = this.props;

    const buttonClasses = classNames(className, styles.buyButton);

    const sheenValue = Math.min(1, Math.max(0, sheen));

    return (
      <Button {...rest} className={buttonClasses}>
        {sheenValue > 0 && (
          <div className={styles.sheen} style={{ opacity: sheenValue }} />
        )}
        <Arrows className={styles.left} />
        <span className={styles.buttonContent}>{children}</span>
        <Arrows className={styles.right} />
      </Button>
    );
  }
}

const Arrows = (props: { className: string }) => {
  const classes = classNames(styles.arrows, props.className);

  return (
    <span className={classes}>
      <span className={styles.baseArrows} />
      <span className={styles.animatedArrow} />
    </span>
  );
};
