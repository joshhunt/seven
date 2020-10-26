import { Icon } from "@UI/UIKit/Controls/Icon";
import React, { DOMAttributes } from "react";
import styles from "./PCMigrationWarning.module.scss";
import classNames from "classnames";
import { Spinner } from "@UI/UIKit/Controls/Spinner";

interface WarningProps extends DOMAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  warningIcon?: string;
  warningHeaderLabel?: string;
  warningDescriptionLabel?: string;
  seriousWarning?: boolean;
  error?: boolean;
}

export class PCMigrationWarning extends React.Component<WarningProps> {
  public render() {
    return (
      <div
        className={classNames(
          styles.warningContainer,
          this.props.className,
          this.props.seriousWarning ? styles.true : styles.false
        )}
      >
        {(() => {
          if (this.props.seriousWarning) {
            return <Icon iconName="destinyuialert" iconType="bungle" />;
          } else if (this.props.error) {
            return <Icon iconName="error_outline" iconType="material" />;
          } else {
            return <Icon iconName="destinyghost" iconType="bungle" />;
          }
        })()}
        <div className={styles.textContent}>
          <p className={styles.warning}>{this.props.warningHeaderLabel}</p>
          <p className={styles.warningDescription}>
            {this.props.warningDescriptionLabel}
          </p>
        </div>
      </div>
    );
  }
}
