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
  /** If you want to set an initial value but have the dropdown control updating the selected value, populate this prop */
  initialValue?: string;
  /** If you want to show a placeholder value that isn't an option, populate this prop */
  placeholderValue?: string;
  /** If you need access to the name of the inner <select> (like for form data submission), set this */
  name?: string;
  /** Triggered when dropdown is changed */
  onChange?: (value: string) => void;
  className?: string;
  isOpenClassName?: string;
  selectBoxClassName?: string;
  currentOptionClassName?: string;
  optionItemClassName?: string;
  optionsClassName?: string;
  childrenClassName?: string;
  /** Icon for the overall dropdown - shown only on the visible selected option **/
  iconPath?: string;
  iconOnly?: boolean;
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
  /** Set as disabled */
  disabled?: boolean;
}

interface IDropdownState {
  isOpen: boolean;
  currentValue: string;
  typedCharacters: string;
  pendingValue: string;
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
      currentValue: props.placeholderValue
        ? null
        : props.selectedValue || props.options[0].value,
      typedCharacters: "",
      pendingValue: "",
    };
  }

  public componentDidMount() {
    //listener for keydown that updates the typed characters
    document.addEventListener("keydown", this.onKeyDown);
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  public render() {
    const name = this.props.name || "";

    const classes = classNames(styles.dropdownItem, this.props.className, {
      [styles.open]: this.state.isOpen,
      [this.props.isOpenClassName]: this.state.isOpen,
    });

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
              disabled={a.disabled}
              key={i}
              value={a.value}
            >
              {typeof a.mobileLabel !== "undefined" ? a.mobileLabel : a.label}
            </option>
          ))}
        </select>
        <div
          className={classNames(
            styles.selectBox,
            this.props.selectBoxClassName
          )}
          onClick={() => this.toggle()}
          role={"presentation"}
        >
          <div
            className={classNames(
              styles.currentOption,
              this.props.currentOptionClassName
            )}
          >
            {this.props.placeholderValue && !this.state.currentValue ? (
              <DropdownPrettyOptionItem
                iconOnly={this.props.iconOnly}
                iconPath={this.props.iconPath}
                className={this.props.optionItemClassName}
                option={{
                  label: this.props.placeholderValue,
                  value: "",
                }}
                onClick={null}
                selected={true}
              />
            ) : (
              <DropdownPrettyOptionItem
                iconOnly={this.props.iconOnly}
                iconPath={this.props.iconPath}
                className={this.props.optionItemClassName}
                option={this.selectedOption}
                onClick={null}
                selected={true}
              />
            )}
          </div>
        </div>
        {this.containerRef.current && (
          <DropdownPrettyOptions
            className={this.props.optionsClassName}
            childrenClassName={this.props.childrenClassName}
            optionItemClassName={this.props.optionItemClassName}
            open={this.state.isOpen}
            currentValue={this.state.currentValue}
            triggerClientRect={this.containerRef.current.getBoundingClientRect()}
            options={this.props.options}
            onOptionClick={this.onOptionClick}
            hoveredValue={this.state.pendingValue}
          />
        )}
      </div>
    );
  }

  public onKeyDown = (e: KeyboardEvent) => {
    if (this.state.isOpen) {
      if (e.key === "Escape") {
        this.close();
      } else if (e.key === "Enter") {
        this.state.pendingValue?.length > 0 &&
          this.onOptionClick(this.state.pendingValue);

        this.setState({
          typedCharacters: "",
          pendingValue: "",
        });

        this.close();
      } else if (e.key.length === 1) {
        e.preventDefault();
        const newTypedCharacters = this.state.typedCharacters + e.key;
        const matchingOption = this.props.options.find(
          (option) =>
            option.label
              .toString()
              .toLowerCase()
              .startsWith(newTypedCharacters.toLowerCase()) ||
            option.value
              .toString()
              .toLowerCase()
              .startsWith(newTypedCharacters.toLowerCase())
        );

        if (matchingOption) {
          this.setState({
            typedCharacters: newTypedCharacters,
            pendingValue: matchingOption.value,
          });
        } else {
          this.setState({ typedCharacters: newTypedCharacters });
        }
      }
    }
  };

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

  private readonly closeOnOutsideClick = (e: MouseEvent) => {
    try {
      const rootNode = ReactDOM.findDOMNode(this);
      if (
        rootNode.contains(e.target as Node) ||
        (this.containerRef?.current &&
          this.containerRef?.current?.contains(e.target as Node))
      ) {
        return false;
      } else {
        this.close();
      }
    } catch (e) {
      return true;
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
          document.addEventListener("click", this.closeOnOutsideClick);
          this.setState({
            typedCharacters: "",
            pendingValue: "",
          });
        } else {
          document.removeEventListener("click", this.closeOnOutsideClick);
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
}
