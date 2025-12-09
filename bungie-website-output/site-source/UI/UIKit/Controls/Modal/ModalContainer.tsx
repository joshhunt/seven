import { RefObject, useEffect, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import React from "react";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { StringUtils } from "@Utilities/StringUtils";

type ModalData = {
  id: string;
  children: React.ReactNode;
  modalProps: ModalProps;
  ref: RefObject<Modal>;
};

export function ModalContainer() {
  const [modals, setModals] = useState<ModalData[]>([]);
  const add = (modal: ModalData) => setModals((curr) => curr.concat([modal]));
  const remove = (modalId: string) =>
    setModals((curr) => curr.filter((t) => t.id !== modalId));
  useEffect(() => {
    Modal.open = (children, modalProps, existingRef) => {
      const id = StringUtils.generateGuid();
      const ref = existingRef ?? React.createRef<Modal>();
      add({
        id: id,
        children,
        modalProps,
        ref,
      });

      // Maintaining backwards compatibility with components that close the modal by passing refs around
      return ref;
    };
  }, []);

  return (
    <>
      {modals.map((m) => (
        <Modal
          ref={m.ref}
          key={m.id}
          open={true}
          onClose={() => remove(m.id)}
          {...m.modalProps}
        >
          <InnerErrorBoundary>{m.children}</InnerErrorBoundary>
        </Modal>
      ))}
    </>
  );
}
