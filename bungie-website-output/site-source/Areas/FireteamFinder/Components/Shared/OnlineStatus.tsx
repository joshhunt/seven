import React, { memo } from "react";
import classNames from "classnames";

import styles from "./OnlineStatus.module.scss";

interface OnlineStatusProps {
  activeStatus?: boolean;
  labels?: {
    online?: string;
    offline?: string;
  };
}

const OnlineStatus: React.FC<OnlineStatusProps> = (props) => {
  return props.activeStatus ? (
    <div
      className={classNames(styles.active, styles.onlineStatus, styles.circle)}
    >
      {props?.labels?.online}
    </div>
  ) : (
    <div
      className={classNames(
        styles.inactive,
        styles.onlineStatus,
        styles.circle
      )}
    >
      {props?.labels?.offline}
    </div>
  );
};

export default memo(OnlineStatus);
