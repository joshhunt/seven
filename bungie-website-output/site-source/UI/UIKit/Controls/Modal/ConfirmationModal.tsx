// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { Checkbox } from "@UIKit/Forms/Checkbox";
import * as React from "react";
import styles from "./ConfirmationModal.module.scss";
import { Icon } from "../Icon";
import { Localizer } from "@Global/Localization/Localizer";
import classNames from "classnames";
import { Button, ButtonTypes } from "../Button/Button";
import { ModalProps, Modal } from "./Modal";
import { createCustomModal } from "./CreateCustomModal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";

interface IConfirmationModalProps extends ModalProps {
  /** Determines the type of modal */
  type: "none" | "info" | "warning";
  modalRef: React.RefObject<Modal>;
  confirmButtonProps?: IConfirmationModalButtonProps;
  cancelButtonProps?: IConfirmationModalButtonProps;
  /** Modal title */
  title?: React.ReactNode;
  acknowledgements?: string[];
  footerContent?: React.ReactNode;
}

interface IConfirmationModalButtonProps {
  /**Type */
  buttonType?: ButtonTypes | ButtonTypes[];
  /** If true, remove this button */
  disable?: boolean;
  /** Replaces the default label */
  labelOverride?: React.ReactNode;
  /** Do something on click. The returned boolean determines whether the modal will close on click (if true, modal will close) */
  onClick?: () => boolean;
}

interface DefaultProps {
  /** Provide a custom icon */
  iconOverride: React.ReactNode;
}

type Props = IConfirmationModalProps & Partial<DefaultProps>;

interface IConfirmationModalState {
  acknowledged: boolean;
  ackCheckboxState?: boolean[];
}

/**
 * ConfirmationModal - Replace this description
 *  *
 * @param {IConfirmationModalProps} props
 * @returns
 */
class ConfirmationModalInner extends React.Component<
  Props,
  IConfirmationModalState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      acknowledged: !(this.props.acknowledgements?.length > 0),
      ackCheckboxState: this.props.acknowledgements?.length
        ? this.props.acknowledgements.map((value, index) => false)
        : null,
    };
  }

  public static defaultProps: DefaultProps = {
    iconOverride: null,
  };

  private onButtonClick(buttonProps: IConfirmationModalButtonProps) {
    const closeOnClick =
      (buttonProps && buttonProps.onClick && buttonProps.onClick()) || true;

    if (closeOnClick) {
      this.props.modalRef.current?.close();
    }
  }

  private readonly changeAcknowledge = (acknowledgeNumber: number) => {
    const ackCheckboxStateArray = this.state.ackCheckboxState;

    ackCheckboxStateArray[acknowledgeNumber] = !this.state.ackCheckboxState[
      acknowledgeNumber
    ];

    this.setState({
      ackCheckboxState: ackCheckboxStateArray,
      acknowledged: !this.state.ackCheckboxState.includes(false),
    });
  };

  private readonly checkAcknowledgeStatus = (acknowledgeNumber: number) => {
    return this.state.ackCheckboxState[acknowledgeNumber];
  };

  public render() {
    const {
      type,
      iconOverride,
      children,
      cancelButtonProps,
      confirmButtonProps,
      title,
      footerContent,
    } = this.props;

    let cancelLabel = Localizer.Actions.canceldialogbutton,
      confirmLabel = Localizer.Actions.confirmdialogbutton,
      excludeCancelButton = false,
      excludeConfirmButton = false,
      cancelType = ["text", "white"] as ButtonTypes | ButtonTypes[],
      confirmType = ["text", "gold"] as ButtonTypes | ButtonTypes[];

    if (cancelButtonProps) {
      if (cancelButtonProps.labelOverride) {
        cancelLabel = cancelButtonProps.labelOverride;
      }

      if (cancelButtonProps.disable) {
        excludeCancelButton = true;
      }

      if (cancelButtonProps.buttonType) {
        cancelType = cancelButtonProps.buttonType;
      }
    }

    if (confirmButtonProps) {
      if (confirmButtonProps.labelOverride) {
        confirmLabel = confirmButtonProps.labelOverride;
      }

      if (confirmButtonProps.disable) {
        excludeConfirmButton = true;
      }

      if (confirmButtonProps.buttonType) {
        confirmType = confirmButtonProps.buttonType;
      }
    }

    let icon = iconOverride;
    if (!icon) {
      switch (type) {
        case "info":
          icon = (
            <Icon
              iconName={"info"}
              iconType="material"
              className={classNames(styles.icon, styles.info)}
            />
          );
          break;

        case "warning":
          icon = (
            <Icon
              iconName={"warning"}
              iconType="material"
              className={classNames(styles.icon, styles.warning)}
            />
          );
          break;
      }
    }
    const buttonsAreShowing = !excludeCancelButton && !excludeConfirmButton;
    const buttonClasses = classNames(styles.buttons, {
      [styles.buttonsWithSpace]: buttonsAreShowing,
    });

    return (
      <div className={styles.confirmationModalContent}>
        <div className={styles.topContent}>
          {icon}
          <div className={styles.message}>
            {title && <h2 className={styles.modalTitle}>{title}</h2>}
            <div className={styles.description}>{children}</div>
          </div>
        </div>

        {this.props.acknowledgements && (
          <div className={styles.ackWrapper}>
            {this.props.acknowledgements.map((value, index) => {
              return (
                <Checkbox
                  key={index}
                  checked={this.state.ackCheckboxState[index]}
                  onChange={() => this.checkAcknowledgeStatus(index)}
                  onClick={() => this.changeAcknowledge(index)}
                  label={value}
                />
              );
            })}
          </div>
        )}
        {footerContent && (
          <div className={styles.footerContent}>
            <div className={styles.description}>{footerContent}</div>
          </div>
        )}
        <div className={buttonClasses}>
          {!excludeCancelButton && (
            <Button
              buttonType={cancelType}
              className={styles.cancelButton}
              onClick={() => this.onButtonClick(cancelButtonProps)}
              size={BasicSize.Small}
            >
              {cancelLabel}
            </Button>
          )}
          {!excludeConfirmButton && (
            <Button
              buttonType={confirmType}
              className={styles.confirmButton}
              disabled={!this.state.acknowledged}
              onClick={() => this.onButtonClick(confirmButtonProps)}
              size={BasicSize.Small}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default createCustomModal<Props>(ConfirmationModalInner, {
  className: styles.confirmationModal,
  contentClassName: styles.content,
  containerClassName: styles.confirmationModalContainer,
  preventUserClose: true,
});

/** If you want to create a confirmation modal inline instead of triggering it with a function, that is what this does. */
export class ConfirmationModalInline extends React.Component<Props> {
  public render() {
    const { children, ...rest } = this.props;

    return (
      <Modal {...rest}>
        <ConfirmationModalInner {...rest}>{children}</ConfirmationModalInner>
      </Modal>
    );
  }
}
