import React, { FC, ReactNode } from "react";
import { Alert } from "plxp-web-ui/components/base";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import styles from "./AlertNotification.module.scss";
import { AlertColor } from "@mui/material/Alert/Alert";

interface AlertProps {
  alertTitle: string;
  alertMessage?: string;
  severity?: AlertColor;
  icon?: ReactNode;
  bottomMargin?: string;
}

const AlertNotification: FC<AlertProps> = ({
  alertTitle,
  alertMessage,
  icon,
  severity = "success",
  bottomMargin,
}) => {
  return (
    <Alert
      sx={{
        marginBottom: bottomMargin,
      }}
      icon={icon}
      severity={severity}
      onClick={null}
    >
      <p className={styles.title}>{alertTitle}</p>
      <p
        className={styles.message}
        dangerouslySetInnerHTML={sanitizeHTML(alertMessage)}
      />
    </Alert>
  );
};

export default AlertNotification;
