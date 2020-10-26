import {
  DropdownPrettyOptionItem,
  DropdownPrettyOptions,
} from "@UIKit/Forms/DropdownPrettyOptions";
import * as React from "react";
import ReactDOM from "react-dom";
import styles from "./Dropdown.module.scss";
import classNames from "classnames";

interface IDropdownProps {
  /** Options to display */
  options: IDropdownOption[];
  /** (Optional) Number of columns of options */
  columns?: number;
  /** If the dropdown should show a selected value outside its internal selection, populate this prop */
  selectedValue?: string;
  /** If you need access to the name of the inner <select> (like for form data submission), set this */
  name?: string;
  /** Triggered when dropdown is changed */
  onChange?: (value: string) => void;

  className?: string;
}

export interface IDropdownOption<T = any> {
  /** The label for the dropdown option */
  label: React.ReactNode;
  /** The value for the dropdown option */
  value: string;
  /** Additional styles for the option */
  style?: React.CSSProperties;
  /** (Optional) Path to an image to use as an icon */
  iconPath?: string;
  /** (Optional) Extra data for this option */
  metadata?: T;
  /** Mobile text only label if label is not a simple string **/
  mobileLabel?: string;
}

interface IDropdownState {
  isOpen: boolean;
  currentValue: string;
}

/**
 * Dropdown item
 *  *
 * @param {IDropdownProps} props
 * @returns
 */
export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {
  private readonly containerRef = React.createRef<HTMLDivElement>();

  constructor(props: IDropdownProps) {
    super(props);

    this.state = {
      isOpen: false,
      currentValue: props.selectedValue || props.options[0].value,
    };
  }

  public componentDidUpdate() {
    this.updateIfNeeded();
  }

  public render() {
    const name = this.props.name || "";

    const classes = classNames(styles.dropdownItem, this.props.className);

    return (
      <div className={classes} ref={this.containerRef}>
        <select
          role={"listbox"}
          name={name}
          value={this.state.currentValue}
          onChange={(e) => this.onOptionClick(e.target.value)}
        >
          {this.props.options.map((a, i) => (
            <option
              aria-selected={a.value === this.state.currentValue}
              key={i}
              value={a.value}
            >
              {typeof a.mobileLabel !== "undefined" ? a.mobileLabel : a.label}
            </option>
          ))}
        </select>
        <div
          className={styles.selectBox}
          onClick={() => this.toggle()}
          role={"presentation"}
        >
          <div className={styles.currentOption}>
            <DropdownPrettyOptionItem
              option={this.selectedOption}
              onClick={null}
              selected={true}
            />
          </div>
        </div>
        {this.containerRef.current && (
          <DropdownPrettyOptions
            open={this.state.isOpen}
            currentValue={this.state.currentValue}
            triggerClientRect={this.containerRef.current.getBoundingClientRect()}
            options={this.props.options}
            onOptionClick={this.onOptionClick}
          />
        )}
      </div>
    );
  }

  private get selectedOption() {
    let selectedOption = this.props.options.find(
      (a) => a.value === this.state.currentValue
    );
    if (!selectedOption) {
      selectedOption = this.props.options[0];
    }

    return selectedOption;
  }

  private readonly close = () => this.toggle(false);

  private readonly closeOnClick = (e: MouseEvent) => {
    this.close();
    try {
      const rootNode = ReactDOM.findDOMNode(this);
      if (
        rootNode.contains(e.target as Node) ||
        (this.containerRef?.current &&
          this.containerRef?.current?.contains(e.target as Node))
      ) {
        return false;
      }
    } catch (e) {
      // ignore
    }
  };

  private toggle(force?: boolean) {
    const updatedIsOpen = force !== undefined ? force : !this.state.isOpen;

    this.setState(
      {
        isOpen: updatedIsOpen,
      },
      () => {
        if (this.state.isOpen) {
          document.addEventListener("click", this.closeOnClick);
        } else {
          document.removeEventListener("click", this.closeOnClick);
        }
      }
    );
  }

  private readonly onOptionClick = (value: string) => {
    this.setState({
      currentValue: value,
    });
    this.close();
    this.props.onChange && this.props.onChange(value);
  };

  public updateIfNeeded() {
    const selectedValue = this.props.selectedValue;
    const currentValue = this.state.currentValue;

    if (!selectedValue || !currentValue) {
      return;
    }

    if (selectedValue !== currentValue) {
      this.setState({
        currentValue: selectedValue,
      });
    }
  }
}
