import * as React from "react";
import { CrossSave } from "@Platform";
import styles from "./CrossSaveValidationError.module.scss";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

interface ICrossSaveValidationErrorProps {
  error: CrossSave.CrossSaveValidationError;
}

interface DefaultProps {
  includeMembershipType: boolean;
}

interface ICrossSaveValidationErrorState {}

/**
 * Renders a validation error for the Cross Save system
 *  *
 * @param {ICrossSaveValidationErrorProps} props
 * @returns
 */
export class CrossSaveValidationError extends React.Component<
  ICrossSaveValidationErrorProps & DefaultProps,
  ICrossSaveValidationErrorState
> {
  constructor(props: ICrossSaveValidationErrorProps & DefaultProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps = {
    includeMembershipType: false,
  };

  public render() {
    let memTypeString = "";

    if (this.props.includeMembershipType) {
      try {
        memTypeString = LocalizerUtils.getPlatformNameFromMembershipType(
          this.props.error.membershipType
        );
      } catch (e) {
        // Ignore
      }
    }

    const fullMessage = `${memTypeString} ${this.props.error.message}`;

    // tslint:disable: jsx-use-translation-function
    return (
      <div className={styles.error}>
        <Icon
          iconType="bungle"
          iconName={"destinydarknesszone"}
          className={styles.icon}
        />
        <div className={styles.message}>{fullMessage}</div>
      </div>
    );
  }
}
