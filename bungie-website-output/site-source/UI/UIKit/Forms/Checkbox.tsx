import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React, { useRef } from "react";
import { Icon } from "../Controls/Icon";
import styles from "./Checkbox.module.scss";

interface ICheckboxProps {
  checked: boolean;
  // The checked status of this checkbox should depend wholly on its parent component
  onChecked: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
}

/**
 * Form checkbox
 *  *
 * @param {ICheckboxProps} props
 * @returns
 */
export const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const { checked, onChecked, disabled, label, className } = props;

  const checkboxClasses = classNames(styles.checkbox, {
    [styles.checked]: checked,
    [styles.disabled]: disabled,
  });

  const inputElement = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) {
      return;
    }

    const toggledCheck = !checked;

    if (onChecked) {
      inputElement?.current?.setAttribute("checked", toggledCheck.toString());
      onChecked(toggledCheck);
    }
  };

  const wrapperClasses = classNames(styles.checkboxWrapper, className);

  return (
    <div className={wrapperClasses} onClick={handleClick}>
      <div className={checkboxClasses}>
        <div className={styles.check}>
          {/*				<input
						ref={inputElement}
						type="checkbox"
						disabled={disabled}
						checked={checked}
						defaultChecked={true}
					/>*/}
          <Icon iconType={"material"} iconName={"done"} />
        </div>
      </div>
      {label && (
        <div
          className={styles.label}
          dangerouslySetInnerHTML={sanitizeHTML(label.toString())}
        />
      )}
    </div>
  );
};
