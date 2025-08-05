// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import styles from "@UIKit/Forms/Dropdown.module.scss";
import {
  DropdownPrettyOptionItem,
  DropdownPrettyOptions,
} from "@UIKit/Forms/DropdownPrettyOptions";
import { ReactHookFormError } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormError";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useController, UseControllerProps } from "react-hook-form";

interface ReactHookFormSelectProps extends UseControllerProps {
  /** Options to display */
  options: IDropdownOption[];
  /** Initial placeholder */
  placeholder?: string;
  /** Label marked as "for" the select tag */
  label?: string;
  /** If the dropdown should show a selected value outside its internal selection, populate this prop */
  selectedValue?: string;
  /** Function to call when new value is selected*/
  onChange?: (value: string) => void;

  /** (Optional) Number of columns of options */
  columns?: number;

  /** If you want to set an initial value but have the dropdown control updating the selected value, populate this prop */
  initialValue?: string;
  /** If you want to show a placeholder value that isn't an option, populate this prop */
  placeholderValue?: string;

  className?: string;
  isOpenClassName?: string;
  selectBoxClassName?: string;
  currentOptionClassName?: string;
  optionItemClassName?: string;
  optionsClassName?: string;
  childrenClassName?: string;
  /** Icon for the overall dropdown - shown only on the visible selected option **/
  iconPath?: string;
}

export const ReactHookFormSelect = ({
  control,
  name,
  label,
  selectedValue,
  onChange,
  options,
  ...props
}: ReactHookFormSelectProps) => {
  const applicationLoc = Localizer.Application;

  const { field, fieldState } = useController({ control, name });

  const error = fieldState?.error?.message;

  const containerRef = useRef<HTMLDivElement>();

  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    field?.value ?? options[0].value
  );

  useEffect(() => {
    const newValue = options.find((o) => o.value === selectedValue);
    if (newValue?.value) {
      setCurrentValue(newValue.value);
    }
  }, [options, selectedValue]);

  const classes = classNames(styles.dropdownItem, props.className, {
    [styles.open]: isOpen,
    [props.isOpenClassName]: isOpen,
  });

  const selectedOption = () => {
    let sOption = options.find((a) => a.value === currentValue);
    if (!sOption) {
      sOption = options[0];
    }

    return sOption;
  };

  const closeOnOutsideClick = (e: MouseEvent) => {
    try {
      const rootNode = ReactDOM.findDOMNode(containerRef?.current);
      if (
        rootNode.contains(e.target as Node) ||
        (containerRef?.current &&
          containerRef?.current?.contains(e.target as Node))
      ) {
        return false;
      } else {
        close();
      }
    } catch (e) {
      // ignore
    }
  };

  const toggle = (force?: boolean) => {
    const updatedIsOpen = force ?? !isOpen;

    setIsOpen(updatedIsOpen);

    if (updatedIsOpen) {
      document.addEventListener("click", closeOnOutsideClick);
    } else {
      document.removeEventListener("click", closeOnOutsideClick);
    }
  };

  const onOptionClick = (value: string) => {
    setCurrentValue(value);
    close();
    onChange && onChange(value);
  };

  const close = () => toggle(false);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div className={classes} ref={containerRef}>
        <select
          role={"listbox"}
          {...field}
          value={currentValue}
          onChange={(e) => onOptionClick(e.target.value)}
        >
          {options.map((a, i) => (
            <option
              aria-selected={a.value === currentValue}
              disabled={a.disabled}
              key={i}
              value={a.value}
            >
              {typeof a.mobileLabel !== "undefined" ? a.mobileLabel : a.label}
            </option>
          ))}
        </select>
        <div
          className={classNames([styles.selectBox, props.selectBoxClassName])}
          onClick={() => toggle()}
          role={"presentation"}
        >
          <div
            className={classNames([
              styles.currentOption,
              props.currentOptionClassName,
            ])}
          >
            {props.placeholderValue && !currentValue ? (
              <DropdownPrettyOptionItem
                iconPath={props.iconPath}
                className={props.optionItemClassName}
                option={{
                  label: props.placeholderValue,
                  value: "",
                }}
                onClick={null}
                selected={true}
              />
            ) : (
              <DropdownPrettyOptionItem
                iconPath={props.iconPath}
                className={props.optionItemClassName}
                option={selectedOption()}
                onClick={null}
                selected={true}
              />
            )}
          </div>
        </div>
        {containerRef.current && (
          <DropdownPrettyOptions
            className={props.optionsClassName}
            childrenClassName={props.childrenClassName}
            optionItemClassName={props.optionItemClassName}
            open={isOpen}
            currentValue={currentValue}
            triggerClientRect={containerRef.current.getBoundingClientRect()}
            options={options}
            onOptionClick={onOptionClick}
          />
        )}
      </div>
      <ReactHookFormError error={error} />
    </>
  );
};
