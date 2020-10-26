import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import classNames from "classnames";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Dropdown.module.scss";

export interface IDropdownPrettyOptionsProps {
  open: boolean;
  currentValue: string;
  triggerClientRect: ClientRect;
  options: IDropdownOption[];
  onOptionClick?: (value: string) => void;
  children?: undefined;
}

const optionsContainer = document.createElement("div");

export const DropdownPrettyOptions: React.FC<IDropdownPrettyOptionsProps> = ({
  children,
  onOptionClick,
  currentValue,
  triggerClientRect,
  open,
  options,
}) => {
  useEffect(() => {
    const portalEl = document.getElementById("dropdown-options-container");
    portalEl.appendChild(optionsContainer);
  }, []);

  const top = triggerClientRect.top + triggerClientRect.height + window.scrollY;
  const left = triggerClientRect.left + window.scrollX;

  const classes = classNames(styles.dropdownSelectOptions, {
    [styles.on]: open,
  });

  return createPortal(
    <div className={classes} data-col="" style={{ top, left }}>
      <div className={styles.children}>
        {options.map((option, i) => (
          <DropdownPrettyOptionItem
            onClick={onOptionClick}
            selected={currentValue === option.value}
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
  onClick?: (value: string) => void;
  children?: undefined;
}

export const DropdownPrettyOptionItem: React.FC<IDropdownPrettyOption> = ({
  children,
  onClick,
  selected,
  option,
}) => {
  const iconRendered = option.iconPath && (
    <div
      className={styles.icon}
      style={{ backgroundImage: `url(${option.iconPath})` }}
    />
  );

  return (
    <div
      aria-selected={selected}
      className={styles.selectOption}
      data-value={option.value}
      style={option.style}
      onClick={() => onClick?.(option.value)}
      key={option.value}
      role={"option"}
    >
      {iconRendered}
      <div className={styles.optionLabel}>{option.label}</div>
    </div>
  );
};
