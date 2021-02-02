import * as React from "react";
import styles from "./Checkbox.module.scss";
import classNames from "classnames";
import { Icon } from "../Controls/Icon";

interface ICheckboxProps {
  checked: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<any>;
  onMouseEnter?: React.MouseEventHandler<any>;
  onMouseLeave?: React.MouseEventHandler<any>;
  onKeyPress?: React.KeyboardEventHandler<any>;
  onKeyDown?: React.KeyboardEventHandler<any>;
  tabIndex?: number;
  name?: string;
}

interface ICheckboxState {
  checked: boolean;
}

/**
 * Form checkbox
 *  *
 * @param {ICheckboxProps} props
 * @returns
 */
export class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {
  private readonly refToCheckbox: React.RefObject<HTMLInputElement>;

  constructor(props: ICheckboxProps) {
    super(props);

    this.state = {
      checked: this.props.checked,
    };

    this.handleClick = this.handleClick.bind(this);

    this.refToCheckbox = React.createRef<HTMLInputElement>();
  }

  public componentDidUpdate() {
    //if (this.state.checked !== this.props.checked)
    //{
    //	this.setState({
    //		checked: this.props.checked
    //	});
    //}
  }

  public render() {
    const {
      checked,
      disabled,
      label,
      onChange,
      onKeyDown,
      onKeyPress,
      className,
      ...rest
    } = this.props;

    const checkboxClasses = classNames(styles.checkbox, {
      [styles.checked]: this.state.checked,
      [styles.disabled]: disabled,
    });

    const wrapperClasses = classNames(styles.checkboxWrapper, className);

    return (
      <div className={wrapperClasses} {...rest} onClick={this.handleClick}>
        <div className={checkboxClasses}>
          <div className={styles.check}>
            <input
              type="checkbox"
              disabled={disabled}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onKeyPress={onKeyPress}
              checked={this.state.checked}
            />
            <Icon iconType={"material"} iconName={"done"} />
          </div>
        </div>
        <div
          className={styles.label}
          dangerouslySetInnerHTML={{ __html: label.toString() }}
        />
      </div>
    );
  }

  private handleClick(e: React.MouseEvent) {
    if (this.props.disabled) {
      return;
    }

    if (typeof this.props.onClick !== "undefined") {
      this.props.onClick(e);
    }

    this.toggle();
  }

  private toggle() {
    this.setState({
      checked: !this.state.checked,
    });
  }
}
