// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./Tooltip.module.scss";
import ReactDOM from "react-dom";
import classNames from "classnames";

interface XY {
  x: number;
  y: number;
}

export type TooltipPosition = "l" | "tl" | "t" | "tr" | "r" | "br" | "b" | "bl";

interface ClassNames {
  tooltip: string;
  container: string;
}

interface ITooltipProps {
  /** Whether the tooltip is visible */
  visible: boolean;

  /** If provided, anchor the tooltip to this element instead of the cursor */
  anchor?: React.RefObject<any>;

  /** If provided, allows for custom positioning of the tooltip */
  customPosition?: (e?: MouseEvent) => XY;

  children?: React.ReactNode;
}

interface DefaultProps {
  /** Positioning for tooltip. t = top, b = bottom, l = left, r = right */
  position: TooltipPosition;

  /** Custom className for the tooltip itself */
  classNames: Partial<ClassNames>;

  /** Pixels away from the anchor to put the tooltip (in the direction specified) */
  distance: number;
}

type Props = ITooltipProps & DefaultProps;

interface ITooltipState {
  tipPosition: XY;
}

/**
 * Tooltip - Shows a tooltip. You can anchor the tooltip to another component or to the cursor.
 *  *
 * @param {ITooltipProps} props
 * @returns
 */
export class Tooltip extends React.Component<Props, ITooltipState> {
  private readonly tipRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      tipPosition: { x: 0, y: 0 },
    };
  }

  public static defaultProps: DefaultProps = {
    position: "t",
    classNames: {},
    distance: 0,
  };

  private get base(): "anchor" | "cursor" {
    return this.props.anchor ? "anchor" : "cursor";
  }

  private get anchorPos(): ClientRect {
    if (this.props.anchor) {
      const anchorNode = ReactDOM.findDOMNode(
        this.props.anchor.current
      ) as Element;

      return anchorNode.getBoundingClientRect();
    }
  }

  public componentDidMount() {
    if (this.base === "cursor") {
      window.addEventListener("mousemove", this.onMouseMove);
    } else {
      this.positionTip();
    }
  }

  public componentWillUnmount() {
    if (this.base === "cursor") {
      window.removeEventListener("mousemove", this.onMouseMove);
    }
  }

  private readonly onMouseMove = (e: MouseEvent) => {
    this.positionTip(e);
  };

  private getTipPosition(e?: MouseEvent) {
    const { position, distance } = this.props;

    const base = this.base;

    const newPos: XY = {
      x: 0,
      y: 0,
    };

    const childPos = this.anchorPos;
    const tipPos = this.tipRef.current.getBoundingClientRect();

    switch (position) {
      case "bl":
      case "tl":
      case "l":
        newPos.x =
          e && base === "cursor"
            ? e.clientX - tipPos.width
            : childPos.left - tipPos.width;
        newPos.x += -distance;
        break;
    }

    switch (position) {
      case "tr":
      case "r":
      case "br":
        newPos.x = e && base === "cursor" ? e.clientX : childPos.right;
        newPos.x += distance;
        break;
    }

    switch (position) {
      case "tr":
      case "t":
      case "tl":
        newPos.y =
          e && base === "cursor"
            ? e.clientY - tipPos.height
            : childPos.top - tipPos.height;
        newPos.y += -distance;
        break;
    }

    switch (position) {
      case "br":
      case "b":
      case "bl":
        newPos.y = e && base === "cursor" ? e.clientY : childPos.top;
        newPos.y += distance;
        break;
    }

    switch (position) {
      case "t":
      case "b":
        newPos.x =
          e && base === "cursor"
            ? e.clientX - tipPos.width / 2
            : childPos.left + childPos.width / 2 - tipPos.width / 2;
        break;
    }

    switch (position) {
      case "l":
      case "r":
        newPos.y =
          e && base === "cursor"
            ? e.clientY - tipPos.height / 2
            : childPos.top + childPos.height / 2 - tipPos.height / 2;
        break;
    }

    return newPos;
  }

  private positionTip(e?: MouseEvent) {
    if (!this.props.visible) {
      return;
    }

    const newPos = this.props.customPosition
      ? this.props.customPosition(e)
      : this.getTipPosition(e);

    this.setState({
      tipPosition: newPos,
    });
  }

  public render() {
    const base = this.base;

    const { container, tooltip } = this.props.classNames;

    const classes = classNames(
      styles.tooltip,
      tooltip,
      styles[this.props.position],
      {
        [styles.visible]: this.props.visible,
        [styles.textOnly]: typeof this.props.children === "string",
      }
    );

    const { x, y } = this.state.tipPosition;

    const transform = `translateX(${x}px) translateY(${y}px)`;

    return (
      <div className={classNames(styles.tooltipContainer, container)}>
        <div className={classes} style={{ transform }} ref={this.tipRef}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
