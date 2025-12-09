import { IGlobalElement } from "@Global/DataStore/GlobalElementDataStore";
import {
  Toast,
  ToastContent,
  ToastProps,
} from "@UI/UIKit/Controls/Toast/Toast";
import { ToastContainer } from "@UI/UIKit/Controls/Toast/ToastContainer";
import { StringUtils } from "@Utilities/StringUtils";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

type ToastData = {
  id: string;
  children: React.ReactNode;
  toastProps?: ToastProps;
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const add = (toast: ToastData) => setToasts((curr) => curr.concat([toast]));
  const remove = (toastId: string) =>
    setToasts((curr) => curr.filter((t) => t.id !== toastId));
  useEffect(() => {
    Toast.show = (children: ReactNode, toastProps?: ToastProps) => {
      return add({
        id: StringUtils.generateGuid(),
        children,
        toastProps,
      });
    };
  }, []);

  const toastsFormatted: IGlobalElement[] = useMemo(() => {
    return toasts.map((t) => ({
      guid: t.id,
      el: (
        <ToastContent
          key={t.id}
          visible={true}
          onClose={() => remove(t.id)}
          {...t.toastProps}
        >
          {t.children}
        </ToastContent>
      ),
    }));
  }, [toasts]);

  return <ToastContainer toasts={toastsFormatted} />;
}
