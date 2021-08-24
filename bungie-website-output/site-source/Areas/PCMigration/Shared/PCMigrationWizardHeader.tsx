import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import React, { DOMAttributes, ReactElement } from "react";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import classNames from "classnames";
import styles from "./PCMigrationPlatformContainer.module.scss";

export type WizardHeaderType =
  | "email"
  | "transfer"
  | "link"
  | "notes"
  | "library_add"
  | "check"
  | "playlist_add"
  | "success"
  | "warning";

interface IPCMigrationWizardHeaderProps extends DOMAttributes<HTMLElement> {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  type: WizardHeaderType;
  className?: string;
  style?: React.CSSProperties;
  iconPath?: string;
  iconPath2?: string;
  header?: string;
  description?: string;
}

export class PCMigrationWizardHeader extends React.Component<
  IPCMigrationWizardHeaderProps
> {
  public render() {
    const checkCircle = "check_circle";

    return (
      <div
        className={classNames(
          styles.wizardHeaderContainer,
          this.props.className
        )}
      >
        {this.props.iconPath && this.props.type !== "success" && (
          <img className={styles.platformIcon} src={this.props.iconPath} />
        )}
        {this.props.type === "success" && (
          <i className={classNames("material-icons", "successCheckIcon")}>
            {checkCircle}
          </i>
        )}
        {this.icon()}
        {this.props.header && (
          <h2 className={styles.platformName}>{this.props.header}</h2>
        )}
        {this.props.description && (
          <p
            className={styles.platformDescription}
            dangerouslySetInnerHTML={sanitizeHTML(this.props.description)}
          />
        )}
      </div>
    );
  }

  private icon(): React.ReactElement {
    switch (this.props.type) {
      case "email":
        return (
          <span className="emailIcon">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      case "notes":
        return (
          <span className="notes">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      case "link":
        return (
          <span className="link">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      case "check":
        return (
          <span className="check">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      case "playlist_add":
        return (
          <span className="playlist_add">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      case "warning":
        return (
          <span className="warning">
            <i className="material-icons">{this.props.type}</i>
          </span>
        );
      default:
        return null;
    }
  }
}
