import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import classNames from "classnames";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Dropdown.module.scss";

export interface IDropdownPrettyOptionsProps {
  open: boolean;
  currentValue: string;
  triggerClientRect: DOMRect;
  options: IDropdownOption[];
  onOptionClick?: (value: string) => void;
  children?: undefined;
  className?: string;
  childrenClassName?: string;
  optionItemClassName?: string;
  hoveredValue?: string;
}

const optionsContainer = document.createElement("div");

export const DropdownPrettyOptions: React.FC<IDropdownPrettyOptionsProps> = ({
  children,
  onOptionClick,
  currentValue,
  triggerClientRect,
  open,
  options,
  className,
  childrenClassName,
  optionItemClassName,
  hoveredValue,
}) => {
  useEffect(() => {
    const portalEl = document.getElementById("dropdown-options-container");
    portalEl.appendChild(optionsContainer);
  }, []);

  const top = triggerClientRect.top + triggerClientRect.height + window.scrollY;
  const left = triggerClientRect.left + window.scrollX;
  const width = triggerClientRect.width;

  const classes = classNames(styles.dropdownSelectOptions, className, {
    [styles.on]: open,
  });

  return createPortal(
    <div className={classes} data-col="" style={{ top, left, minWidth: width }}>
      <div className={classNames([styles.children, childrenClassName])}>
        {options.map((option, i) => (
          <DropdownPrettyOptionItem
            className={optionItemClassName}
            onClick={onOptionClick}
            selected={currentValue === option.value}
            hovered={hoveredValue === option.value}
            option={option}
            key={i}
          />
        ))}
      </div>
    </div>,
    optionsContainer
  );
};

export interface IDropdownPrettyOption {
  option: IDropdownOption;
  selected: boolean;
  hovered?: boolean;
  onClick?: (value: string) => void;
  children?: undefined;
  className?: string;
  iconPath?: string;
}

export const DropdownPrettyOptionItem: React.FC<IDropdownPrettyOption> = ({
  iconPath,
  children,
  onClick,
  selected,
  hovered,
  option,
  className,
}) => {
  const icon = iconPath ?? option?.iconPath;

  const iconRendered = icon && (
    <div className={styles.icon} style={{ backgroundImage: `url(${icon})` }} />
  );

  return (
    <div
      aria-selected={selected}
      className={classNames([
        styles.selectOption,
        className,
        { [styles.hovered]: hovered },
      ])}
      data-value={option.value}
      style={option.style}
      onClick={() => onClick?.(option.value)}
      key={option.value}
      role={"option"}
    >
      {iconRendered}
      <div>{option.label}</div>
    </div>
  );
};
