// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season14/Components/LazyLoadWrapper";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { useDataStore } from "@bungie/datastore/DataStore";
import * as React from "react";
import styles from "./ScrollingSeasonCarousel.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";

interface IScrollingSeasonCarouselProps {
  children: React.ReactNode[];
  topLabel?: React.ReactNode;
  bottomLabel?: React.ReactNode;
  showProgress: boolean;
  startAtPosition?: number;
  className?: string;
}

interface ISeasonCarouselState {
  position: number;
  sliding: boolean;
  direction: "next" | "prev";
  responsive: IResponsiveState;
}

interface DefaultProps {}

type Props = IScrollingSeasonCarouselProps & DefaultProps;

/**
 * Carousel - Reusable carousel component to show images or divs
 *  *
 * @param {IScrollingSeasonCarouselProps} props
 * @returns
 */
export class ScrollingSeasonCarousel extends React.Component<
  IScrollingSeasonCarouselProps,
  ISeasonCarouselState
> {
  constructor(props: IScrollingSeasonCarouselProps) {
    super(props);

    this.state = {
      position:
        typeof this.props.startAtPosition !== "undefined" &&
        this.props.startAtPosition !== 0
          ? this.props.startAtPosition
          : 0,
      sliding: false,
      direction: null,
      responsive: Responsive.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
  }

  public componentDidUpdate(prevProps: IScrollingSeasonCarouselProps) {
    if (prevProps.startAtPosition !== this.props.startAtPosition) {
      this.setState({
        position: this.props.startAtPosition,
      });
    }
  }

  private readonly getOrder = (itemIndex: number) => {
    const { position } = this.state;
    const { children } = this.props;
    const numItems = children.length || 1;
    if (itemIndex - position < 0) {
      return numItems - Math.abs(itemIndex - position);
    }

    return itemIndex - position;
  };

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
      sliding: true,
      direction,
      position,
    });
    setTimeout(() => {
      this.setState({
        sliding: false,
      });
    }, 50);
  };

  public render() {
    const {
      children,
      topLabel,
      bottomLabel,
      showProgress,
      className,
    } = this.props;

    const { sliding, direction, position } = this.state;

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
            <Icon iconType={"material"} iconName={"arrow_left"} />
          </Button>
          <Wrapper showProgress={showProgress}>
            <CarouselContainer
              sliding={sliding}
              direction={direction}
              length={children.length}
            >
              {children.map((child, index) => (
                <CarouselSlot
                  key={index}
                  order={this.getOrder(index)}
                  length={children.length}
                >
                  {child}
                </CarouselSlot>
              ))}
            </CarouselContainer>
          </Wrapper>
          <Button
            className={styles.nextButton}
            onClick={() => this.nextSlide()}
            buttonType={position === children.length - 1 ? "disabled" : "white"}
          >
            <Icon iconType={"material"} iconName={"arrow_right"} />
          </Button>
        </div>
        {bottomLabel && bottomLabel}
        <Indicator length={children.length} position={position} />
      </React.Fragment>
    );
  }
}

interface ICarouselContainerProps {
  children: React.ReactNode;
  sliding: boolean;
  direction: "next" | "prev";
  length: number;
}

const CarouselContainer = (props: ICarouselContainerProps) => {
  const responsive = useDataStore(Responsive);

  const transition = props.sliding ? "none" : "transform .5s ease";
  let transform = "";

  const slideNext = (-100 / props.length).toString() + "%";
  const slidePrev = (-200 / props.length).toString() + "%";

  if (responsive.mobile) {
    transform = "";
  } else if (!props.sliding) {
    transform = `translateX(${slideNext})`;
  } else if (props.direction === "prev") {
    transform = `translateX(${slidePrev})`;
  } else {
    transform = "translateX(0%)";
  }

  const width = `calc(${props.length * 100}% - ${props.length / 2}rem)`;

  const padding = responsive.mobile ? "0 3rem" : null;

  return (
    <LazyLoadWrapper
      className={styles.carouselLazyLoader}
      useCustomEffect={true}
      shownClassName={styles.isLoaded}
    >
      <div style={{ display: "flex", transition, transform, width, padding }}>
        {props.children}
      </div>
    </LazyLoadWrapper>
  );
};

interface IWrapperProps {
  children: React.ReactNode;
  showProgress: boolean;
}

const Wrapper = (props: IWrapperProps) => {
  const responsive = useDataStore(Responsive);

  const overflow = responsive.mobile ? "auto" : "hidden";
  const width = responsive.mobile ? "100%" : "calc(100% - 6rem)";

  return (
    <div
      className={classNames(
        { [styles.withProgress]: props.showProgress },
        styles.carouselWrapper
      )}
      style={{ width: width, overflow: overflow }}
    >
      {props.children}
    </div>
  );
};

interface ICarouselSlotProps {
  children: React.ReactNode;
  order: number;
  length: number;
}

const CarouselSlot = (props: ICarouselSlotProps) => {
  const responsive = useDataStore(Responsive);

  const adjustedOrder = responsive.mobile
    ? null
    : (props.order + 1) % props.length;
  const width = responsive.mobile ? "100%" : `calc(100% / ${props.length})`;
  const margin = responsive.mobile ? "0 0.04%" : "0 0.5rem";

  return (
    <div
      style={{ order: adjustedOrder, width: width, margin: margin }}
      className={styles.carouselSlot}
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
