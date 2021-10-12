// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import classNames from "classnames";
import * as React from "react";
import { Button, ButtonTypes } from "../Button/Button";
import { Icon } from "../Icon";
import styles from "./ConfirmationModal.module.scss";
import { createCustomModal } from "./CreateCustomModal";
import { Modal, ModalProps } from "./Modal";

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
  allAcknowledgementsChecked: boolean;
  acknowledgementsCheckedStatus?: boolean[];
}

/**
 * ConfirmationModal - Replace this description
 *  *
 * @param {IConfirmationModalProps} props
 * @returns
 */
class _ConfirmationModal extends React.Component<
  Props,
  IConfirmationModalState
> {
  public static defaultProps: DefaultProps = {
    iconOverride: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      allAcknowledgementsChecked: false,
      acknowledgementsCheckedStatus: this.props?.acknowledgements?.map(
        (a) => false
      ),
    };
  }

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

    const cancelLabel =
      cancelButtonProps?.labelOverride ?? Localizer.Actions.canceldialogbutton;
    const confirmLabel =
      confirmButtonProps?.labelOverride ??
      Localizer.Actions.confirmDialogButton;
    const excludeCancelButton = cancelButtonProps?.disable ?? false;
    const excludeConfirmButton = confirmButtonProps?.disable ?? false;

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
        <div className={styles.ackWrapper}>
          {this.props?.acknowledgements?.length &&
            this.props?.acknowledgements?.map((value, index) => {
              return (
                <Checkbox
                  key={index}
                  checked={this.state.acknowledgementsCheckedStatus?.[index]}
                  onChecked={(checked) => {
                    const copy = [...this.state.acknowledgementsCheckedStatus];
                    if (copy) {
                      copy[index] = checked;
                    }
                    this.setState({ acknowledgementsCheckedStatus: copy });
                  }}
                  label={value}
                />
              );
            })}
        </div>
        {footerContent && (
          <div className={styles.footerContent}>
            <div className={styles.description}>{footerContent}</div>
          </div>
        )}
        <div className={buttonClasses}>
          {!excludeCancelButton && (
            <Button
              {...this.props?.cancelButtonProps}
              onClick={() => this.onButtonClick(cancelButtonProps)}
              buttonType={
                this.props?.cancelButtonProps?.buttonType ?? ["text", "white"]
              }
              size={BasicSize.Small}
            >
              {cancelLabel}
            </Button>
          )}
          {!excludeConfirmButton && (
            <Button
              {...this.props?.confirmButtonProps}
              onClick={() => this.onButtonClick(confirmButtonProps)}
              buttonType={
                this.props?.confirmButtonProps?.buttonType ?? ["text", "gold"]
              }
              size={BasicSize.Small}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  private onButtonClick(buttonProps: IConfirmationModalButtonProps) {
    const closeOnClick =
      (buttonProps && buttonProps.onClick && buttonProps.onClick()) || true;

    if (closeOnClick) {
      this.props.modalRef.current?.close();
    }
  }
}

export default createCustomModal<Props>(_ConfirmationModal, {
  className: styles.confirmationModal,
  contentClassName: styles.content,
  containerClassName: styles.confirmationModalContainer,
  preventUserClose: true,
});

/** If you want to create a confirmation modal inline instead of triggering it with a function, that is what this does. */
export const ConfirmationModalInline: React.FC<Omit<Props, "modalRef">> = (
  props
) => {
  const { children, ...rest } = props;
  const ref = React.useRef();

  return (
    <Modal {...rest} ref={ref}>
      <_ConfirmationModal {...rest} modalRef={ref}>
        {children}
      </_ConfirmationModal>
    </Modal>
  );
};
