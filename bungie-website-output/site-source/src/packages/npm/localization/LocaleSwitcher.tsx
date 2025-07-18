import classNames from "classnames";
import React from "react";
import { MdLanguage } from "react-icons/md";
import LocalizationState from "./LocalizationState";
import { Localizer } from "./Localizer";

// todo jlauer - This needs to import the scss module
const styles = {} as any;

interface ILocaleSwitcherClassNames {
  /** The Switcher wrapper */
  wrapper?: string;
  /** The trigger portion of container */
  trigger?: string;
  /** The options portion of the menu */
  options?: string;
  /** Present if the wrapper is visible */
  wrapperOpen?: string;
}

interface ILocaleSwitcherProps {
  /** Optional classnames for the toast components */
  classes?: ILocaleSwitcherClassNames;

  onLocaleSwitch?: (newLocale: string | null) => void;
}

interface ILocaleSwitcherState {
  open: boolean;
  reloads: number; // purely exists so I can update state and force a re-render without using forceUpdate()
}

/**
 * Renders the locale switcher
 *  *
 * @param {ILocaleSwitcherProps} props
 * @returns
 */
export class LocaleSwitcherInternal extends React.Component<
  ILocaleSwitcherProps,
  ILocaleSwitcherState
> {
  private readonly wrapperRef = React.createRef<HTMLDivElement>();

  constructor(props: ILocaleSwitcherProps) {
    super(props);

    this.state = {
      reloads: 0,
      open: false,
    };
  }

  public componentDidMount() {
    this.reconcileCookieAndUrlLocales();

    document.documentElement.addEventListener("click", this.onBodyClick);
  }

  public componentDidUpdate() {
    this.reconcileCookieAndUrlLocales();
  }

  public componentWillUnmount() {
    document.documentElement.removeEventListener("click", this.onBodyClick);
  }

  private readonly onBodyClick = (e: MouseEvent) => {
    const clickTargetInsideSwitcher = this.wrapperRef.current?.contains(
      e.target as Node
    );

    if (clickTargetInsideSwitcher) {
      return;
    }

    this.state.open && this.toggleOpen(false);
  };

  private toggleOpen(open?: boolean) {
    const newOpen = open !== undefined ? open : !this.state.open;

    this.setState({
      open: newOpen,
    });
  }

  public render() {
    const validLocales = Localizer.validLocales;

    const options = validLocales.map((locale, i) => {
      const optionClasses = classNames(styles.option, {
        [styles.current]: LocalizationState.currentCultureName === locale.name,
      });

      return (
        <div
          key={i}
          className={optionClasses}
          onClick={() => this.onChange(locale.name)}
          data-locale={locale.name}
          data-testid={locale.name + "-test"}
        >
          {Localizer.Languages[locale.locKey]}
        </div>
      );
    });

    const wrapperOpenClass = this.props.classes?.wrapperOpen
      ? { [this.props.classes.wrapperOpen]: this.state.open }
      : null;

    const wrapperClasses = classNames(
      styles.wrapper,
      this.props.classes?.wrapper,
      {
        [styles.open]: this.state.open,
      },
      wrapperOpenClass
    );

    const triggerClasses = classNames(
      styles.trigger,
      this.props.classes?.trigger
    );
    const optionsClasses = classNames(
      styles.options,
      this.props.classes?.options
    );

    return (
      <div
        ref={this.wrapperRef}
        className={wrapperClasses}
        onClick={() => this.toggleOpen()}
      >
        <div className={triggerClasses}>
          <MdLanguage />
        </div>
        <div className={optionsClasses}>{options}</div>
      </div>
    );
  }

  private reconcileCookieAndUrlLocales() {
    const cookieLocale = LocalizationState.cookieLocale;
    const urlLocale = LocalizationState.urlLocale;

    if (urlLocale !== cookieLocale) {
      this.props.onLocaleSwitch?.(cookieLocale);

      if (cookieLocale) {
        LocalizationState.setLocale(cookieLocale);
      } else if (urlLocale) {
        LocalizationState.setLocale(urlLocale);
      }
    }
  }

  private readonly onChange = (value: string) => {
    this.toggleOpen(false);

    LocalizationState.setLocale(value);

    // Rather than set the locale here, we set another property. That way, we can compare the current cookie value to the dropdown's value.
    // If they are different, we reload/redirect.
    this.setState({
      reloads: this.state.reloads + 1,
    });
  };
}

export default LocaleSwitcherInternal;
