import { ModalProps, Modal, showModalInternal } from "./Modal";
import React from "react";
import classNames from "classnames";

interface IModalRefProps {
  /** Required in order to allow the custom modal to access methods on the parent */
  modalRef: React.RefObject<Modal>;
}

export type CustomModalProps = ModalProps & IModalRefProps;

type ChildPropsOnly<Child, Parent> = Pick<
  Child,
  Exclude<keyof Child, keyof Parent>
>;

interface IReactChildrenProps {
  children?: React.ReactNode;
}

type Interceptor<P> = (
  props: ChildPropsOnly<P, CustomModalProps> & IReactChildrenProps
) => boolean | void;

/**
 * Allows other classes to create modals that have preset behaviors. Includes a 'show' static function that accepts only the custom modal's props, but renders the entire modal.
 * The custom modal class only needs to render the stuff INSIDE the modal, not including the modal itself.
 * @param BoundComponent
 * @param defaultProps
 * @param showInterceptor Run this before anything else, and return a boolean. If true, the function will continue.
 */
export const createCustomModal = <P extends CustomModalProps>(
  BoundComponent: React.ComponentClass<ChildPropsOnly<P, ModalProps>>,
  defaultProps: Partial<ModalProps> = {},
  showInterceptor: Interceptor<P> = () => {
    /**/
  }
) =>
  class extends React.Component<P> {
    private readonly modalRef: React.RefObject<Modal> = React.createRef();

    public static show(
      props: ChildPropsOnly<P, CustomModalProps> & IReactChildrenProps,
      baseModalProps: Partial<ModalProps> = {}
    ) {
      const continueFunction = showInterceptor?.(props);
      if (continueFunction === false) {
        return;
      }

      // Make the reference up here so we have it before we create the children
      let modalRef: React.RefObject<Modal> = React.createRef();

      const { children, ...rest } = props;

      const remainingProps = rest as P;

      const rendered = (
        <BoundComponent {...remainingProps} modalRef={modalRef}>
          {children}
        </BoundComponent>
      );

      const derivedBaseModalProps = { ...defaultProps, ...baseModalProps };
      derivedBaseModalProps.className = classNames(
        defaultProps.className || "",
        baseModalProps.className || ""
      );
      derivedBaseModalProps.containerClassName = classNames(
        defaultProps.containerClassName || "",
        baseModalProps.containerClassName || ""
      );
      derivedBaseModalProps.contentClassName = classNames(
        defaultProps.contentClassName || "",
        baseModalProps.contentClassName || ""
      );

      // Pass the reference here. We need the reference to exist now because it has to go to the children
      modalRef = showModalInternal(rendered, derivedBaseModalProps, modalRef);

      return modalRef;
    }

    public render() {
      return (
        <Modal {...defaultProps} ref={this.modalRef}>
          <BoundComponent {...this.props} modalRef={this.modalRef.current}>
            {this.props.children}
          </BoundComponent>
        </Modal>
      );
    }
  };
