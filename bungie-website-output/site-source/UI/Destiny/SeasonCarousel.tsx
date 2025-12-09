import * as React from "react";
import styles from "./SeasonCarousel.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import classNames from "classnames";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ISeasonCarouselProps {
  children: React.ReactNode[];
  topLabel?: React.ReactNode;
  bottomLabel?: React.ReactNode;
  showProgress: boolean;
  startAtPosition?: number;
  className?: string;
}

interface ISeasonCarouselState {
  position: number;
  direction: "next" | "prev";
}

/**
 * Carousel - Reusable carousel component to show images or divs
 *  *
 * @param {ISeasonCarouselProps} props
 * @returns
 */
export class SeasonCarousel extends React.Component<
  ISeasonCarouselProps,
  ISeasonCarouselState
> {
  constructor(props: ISeasonCarouselProps) {
    super(props);

    this.state = {
      position: this.props.startAtPosition ?? 0,
      direction: null,
    };
  }

  public componentDidUpdate(prevProps: ISeasonCarouselProps) {
    if (prevProps.startAtPosition !== this.props.startAtPosition) {
      this.setState({
        position: this.props.startAtPosition,
      });
    }
  }

  private readonly nextSlide = () => {
    const { position } = this.state;
    const { children } = this.props;
    const numItems = children.length || 1;
    this.doSliding("next", position === numItems - 1 ? 0 : position + 1);
  };

  private readonly prevSlide = () => {
    const { position } = this.state;
    const { children } = this.props;
    const numItems = children.length;
    this.doSliding("prev", position === 0 ? numItems - 1 : position - 1);
  };

  private readonly doSliding = (
    direction: "next" | "prev",
    position: number
  ) => {
    this.setState({
      direction,
      position,
    });
  };

  public render() {
    const {
      children,
      topLabel,
      bottomLabel,
      showProgress,
      className,
    } = this.props;

    const { position } = this.state;

    return (
      <React.Fragment>
        {topLabel && topLabel}
        <div
          className={classNames(styles.buttonAndCarouselContainer, {
            [className]: className !== "",
          })}
        >
          <Button
            className={styles.prevButton}
            onClick={() => this.prevSlide()}
            buttonType={position === 0 ? "disabled" : "white"}
          >
            <IoChevronBack />
          </Button>
          <Wrapper showProgress={showProgress}>
            <CarouselContainer position={position}>
              {children.map((child, index) => (
                <div
                  key={index}
                  style={{
                    width: `${100 / children.length}%`,
                    margin: "0 0.5rem",
                  }}
                >
                  {child}
                </div>
              ))}
            </CarouselContainer>
          </Wrapper>
          <Button
            className={styles.nextButton}
            onClick={() => this.nextSlide()}
            buttonType={position === children.length - 1 ? "disabled" : "white"}
          >
            <IoChevronForward />
          </Button>
        </div>
        {bottomLabel && bottomLabel}
        <Indicator length={children.length} position={position} />
      </React.Fragment>
    );
  }
}

interface ICarouselContainerProps {
  children: React.ReactNode[];
  position: number;
}

const CarouselContainer = ({ children, position }: ICarouselContainerProps) => {
  const transform = `translateX(${(position * -100) / children.length}%)`;
  const width = `calc(${children.length * 100}% - ${children.length / 2}rem)`;

  return (
    <div
      style={{
        display: "flex",
        transition: "transform .5s ease",
        transform,
        width,
      }}
    >
      {children}
    </div>
  );
};

interface IWrapperProps {
  children: React.ReactNode;
  showProgress: boolean;
}

const Wrapper = (props: IWrapperProps) => {
  return (
    <div
      className={classNames({ [styles.withProgress]: props.showProgress })}
      style={{ width: "calc(100% - 6rem)", overflow: "hidden" }}
    >
      {props.children}
    </div>
  );
};

interface IIndicatorProps {
  length: number;
  position: number;
}

class Indicator extends React.Component<IIndicatorProps> {
  public render() {
    const { length, position } = this.props;

    return (
      <IndicatorContainer className={styles.indicatorContainer}>
        {Array.from({ length }, (pip, i) => (
          <Pip key={i} isCurrent={i === position} />
        ))}
      </IndicatorContainer>
    );
  }
}

interface IIndicatorContainer {
  children: React.ReactNode;
  className: string;
}

const IndicatorContainer = (props: IIndicatorContainer) => {
  return <div className={props.className}>{props.children}</div>;
};

interface IPipProps {
  isCurrent: boolean;
}

const Pip = (props: IPipProps) => {
  const pipColor = props.isCurrent
    ? "rgb(245, 245, 245)"
    : "rgb(245, 245, 245, 0.2)";

  return <span className={styles.pip} style={{ background: pipColor }} />;
};
