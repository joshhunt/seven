// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./ConfirmationModal.module.scss";
import { Icon } from "../Icon";
import { Localizer } from "@Global/Localizer";
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

interface IConfirmationModalState {}

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

    this.state = {};
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

  public render() {
    const {
      type,
      iconOverride,
      children,
      cancelButtonProps,
      confirmButtonProps,
      title,
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
