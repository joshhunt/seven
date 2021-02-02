import { StringFetcher } from "@Global/Localization/StringFetcher";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Localizer } from "@Global/Localization/Localizer";
import styles from "./LocaleSwitcher.module.scss";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";

interface ILocaleSwitcherClassNames {
  /** The Switcher wrapper */
  wrapper?: string;
  /** The trigger portion of container */
  trigger?: string;
  /** The options portion of the menu */
  options?: string;
}

interface ILocaleSwitcherProps extends RouteComponentProps {
  /** Optional classnames for the toast components */
  classes?: ILocaleSwitcherClassNames;
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
class LocaleSwitcher extends React.Component<
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
    if (this.wrapperRef.current.contains(e.target as Node)) {
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

    const options = validLocales.map((a) => {
      const optionClasses = classNames(styles.option, {
        [styles.current]: LocalizerUtils.currentCultureName === a.name,
      });

      return (
        <div
          key={a.name}
          className={optionClasses}
          onClick={() => this.onChange(a.name)}
        >
          {Localizer.Languages[a.locKey]}
        </div>
      );
    });

    const wrapperClasses = classNames(
      styles.wrapper,
      {
        [styles.open]: this.state.open,
      },
      this.props.classes?.wrapper
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
          <Icon iconType="material" iconName="language" />
        </div>
        <div className={optionsClasses}>{options}</div>
      </div>
    );
  }

  private reconcileCookieAndUrlLocales() {
    const cookieLocale = LocalizerUtils.cookieLocale;
    const urlLocale = LocalizerUtils.urlLocale;

    if (urlLocale && !cookieLocale) {
      LocalizerUtils.updateCookieLocale(urlLocale);
    } else if (cookieLocale && urlLocale !== cookieLocale) {
      this.redirectToLocale(urlLocale, cookieLocale);
    }
  }

  private redirectToLocale(urlLocale: string, locale: string) {
    const oldPath = this.props.location.pathname;
    const newPath = oldPath.replace(`/${urlLocale}/`, `/${locale}/`);
    if (newPath !== oldPath) {
      this.props.history.push(newPath);
      BrowserUtils.scrollTo(0);
      StringFetcher.fetch(true);
    }
  }

  private readonly onChange = (value) => {
    this.toggleOpen(false);

    LocalizerUtils.updateCookieLocale(value);

    // Rather than set the locale here, we set another property. That way, we can compare the current cookie value to the dropdown's value.
    // If they are different, we reload/redirect.
    this.setState({
      reloads: this.state.reloads + 1,
    });
  };
}

export default withRouter(LocaleSwitcher);
