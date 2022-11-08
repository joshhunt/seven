import classNames from "classnames";
import * as React from "react";
import styles from "./Spinner.module.scss";
import { Img } from "@Helpers";

export enum SpinnerDisplayMode {
  /** Displays as normal */
  none,
  /** Fixed position over the page */
  fullPage,
  /** Absolutely positioned in its container */
  cover,
}

interface ISpinnerContainerProps {
  /** If true, displays spinner */
  loading: boolean;
  /** Changes the font size of the loading icon */
  iconFontSize?: string;
  /** When provided, adds text below the spinner */
  loadingLabel?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Optional styles */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface ISpinnerContainerState {}

interface DefaultProps {
  /** Sets the display mode (default is none) */
  mode: SpinnerDisplayMode;

  /** If true, spinner won't show for a second */
  delayLoadingState: boolean;

  /** If true, children will not render until loading is false. Default is false. */
  delayRenderUntilLoaded: boolean;

  /** Determines which loader to use */
  type: "hexagon" | "guardians";
}

export class SpinnerContainer extends React.Component<
  ISpinnerContainerProps & DefaultProps,
  ISpinnerContainerState
> {
  constructor(props: ISpinnerContainerProps & DefaultProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {
    delayRenderUntilLoaded: false,
    mode: SpinnerDisplayMode.none,
    delayLoadingState: false,
    type: "hexagon",
  };

  private get showChildrenWhileLoading() {
    return (
      (this.props.delayRenderUntilLoaded && !this.props.loading) ||
      !this.props.delayRenderUntilLoaded
    );
  }

  public render() {
    const {
      loading,
      mode,
      loadingLabel,
      className,
      style,
      type,
      children,
    } = this.props;

    const containerClasses = classNames(
      styles.spinnerContainer,
      {
        [styles.loading]: loading,
        [styles.fullPage]: mode === SpinnerDisplayMode.fullPage && loading,
        [styles.cover]: mode === SpinnerDisplayMode.cover,
      },
      className
    );

    const innerClasses = classNames(styles.spinnerInner, {
      [styles.delayLoadingState]: this.props.delayLoadingState,
    });

    if (!this.props.loading && this.props.delayRenderUntilLoaded) {
      return children;
    }

    return (
      <div className={containerClasses} style={style}>
        {this.showChildrenWhileLoading && children}
        <div className={styles.spinnerOverlay}>
          <div className={innerClasses}>
            {type === "hexagon" && <Spinner on={this.props.loading} />}
            {type === "guardians" && (
              <video
                src={Img("destiny/videos/loading.webm")}
                autoPlay
                loop
                muted
                style={{ filter: "invert(1) blur(0.25px)" }}
              />
            )}
            {loading && loadingLabel && (
              <div className={classNames(styles.loadingLabel, "loading-label")}>
                {loadingLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

interface ISpinnerProps {
  /** No children allowed - use SpinnerContainer  */
  children?: undefined;
}

interface ISpinnerState {}

interface DefaultSpinnerProps {
  on?: boolean;

  /** If true, will size itself based on font size */
  inline: boolean;

  /** Provide styles here */
  style: React.CSSProperties;
}

export class Spinner extends React.Component<
  ISpinnerProps & DefaultSpinnerProps,
  ISpinnerState
> {
  public static defaultProps: DefaultSpinnerProps = {
    on: true,
    inline: false,
    style: null,
  };

  public render() {
    return (
      <div
        className={classNames(styles.spinner, {
          [styles.on]: this.props.on,
          [styles.inline]: this.props.inline,
        })}
        style={this.props.style}
      >
        <svg
          className={styles.outer}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 93.12 107.52"
        >
          <polygon
            className={classNames(styles.step, styles.step0)}
            points="1.4993555928857774,25.70919947248558 16.29799608155895,34.255527834132636 45.040645234973454,17.657660176081663 45.040645234973454,0.5799999237060547 1.4993555928857774,25.70919947248558 "
          />
          <polygon
            className={classNames(styles.step, styles.step1)}
            points="14.798639163130133,70.04514361060887 14.798639163130133,36.84941215063213 0,28.303083788985077 0,78.57647357327482 14.798639163130133,70.04514361060887 "
          />
          <polygon
            className={classNames(styles.step, styles.step2)}
            points="45.040645234973454,89.22190104230344 16.29799608155895,72.63902792710837 1.4993555928857774,81.18535821681803 45.040645234973454,106.31455390947235 45.040645234973454,89.22190104230344 "
          />
          <polygon
            className={classNames(styles.step, styles.step3)}
            points="91.58064449628182,81.18535821681803 76.76700789820188,72.63902792710837 48.03935328764328,89.22190104230344 48.03935328764328,106.31455390947235 91.58064449628182,81.18535821681803 "
          />
          <polygon
            className={classNames(styles.step, styles.step4)}
            points="78.2663619245368,36.84941215063213 78.2663619245368,70.04514361060887 93.07999852261673,78.57647357327482 93.07999852261673,28.303083788985077 78.2663619245368,36.84941215063213 "
          />
          <polygon
            className={classNames(styles.step, styles.step5)}
            points="48.03935328764328,0.5799999237060547 48.03935328764328,17.657660176081663 76.76700789820188,34.255527834132636 91.58064449628182,25.70919947248558 48.03935328764328,0.5799999237060547 "
          />
        </svg>
        <svg
          className={styles.inner}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 93.12 107.52"
        >
          <polygon
            className={classNames(styles.step, styles.step5)}
            points="32.685951708002904,43.71646161198646 45.040645234973454,36.579529659851914 45.040645234973454,21.181146379706433 19.34168583473388,36.00977173645447 32.685951708002904,43.71646161198646 "
          />
          <polygon
            className={classNames(styles.step, styles.step4)}
            points="31.18659575360539,60.58420983275505 31.18659575360539,46.31034592848596 17.842331808398967,38.61865252387247 17.842331808398967,68.27590709349374 31.18659575360539,60.58420983275505 "
          />
          <polygon
            className={classNames(styles.step, styles.step3)}
            points="45.040645234973454,70.3150261013891 32.685951708002904,63.17809800537975 19.34168583473388,70.88478402478654 45.040645234973454,85.71341323765978 45.040645234973454,70.3150261013891 "
          />
          <polygon
            className={classNames(styles.step, styles.step2)}
            points="60.394042958488626,63.17809800537975 48.03935328764328,70.3150261013891 48.03935328764328,85.71341323765978 73.72331428890175,70.88478402478654 60.394042958488626,63.17809800537975 "
          />
          <polygon
            className={classNames(styles.step, styles.step1)}
            points="61.89339698482354,46.31034592848596 61.89339698482354,60.58420983275505 75.22266831523666,68.27590709349374 75.22266831523666,38.61865252387247 61.89339698482354,46.31034592848596 "
          />
          <polygon
            className={classNames(styles.step, styles.step0)}
            points="48.03935328764328,21.181146379706433 48.03935328764328,36.579529659851914 60.394042958488626,43.71646161198646 73.72331428890175,36.00977173645447 48.03935328764328,21.181146379706433 "
          />
        </svg>
      </div>
    );
  }
}
