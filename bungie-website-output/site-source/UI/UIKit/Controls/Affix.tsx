// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./Affix.module.scss";
import classNames from "classnames";

type ScrollDirection = "up" | "down";

export interface IAffixProps {
  /** Required. This is the only way to access styling for your affix item. */
  className: string;
  /** Limit to only one child, which is required */
  children: React.ReactNode;
  /** Which element should we lock under? */
  to: React.RefObject<HTMLElement> | HTMLElement;
  /** The ref to the place we want to relock the item */
  from: React.RefObject<HTMLElement> | HTMLElement;
}

interface IAffixState {
  isFixed: boolean;
  scrollDirection: ScrollDirection;
}

interface DefaultProps {
  /** Runs when fixed changes */
  onChange: (fixed: boolean) => void;
  /** Runs when scroll events are fired */
  onScroll: (scrollDirection: ScrollDirection) => void;
  /** The class given to the child when it is fixed */
  fixedAttributes: { [key: string]: string };
  /** If specified, state can't update more than once in this time amount. Use this to account for CSS transitions and stuff that can mess with the calculations */
  throttleMs: number;
}

type Props = IAffixProps & DefaultProps;

/**
 * Affix - Locks a component at a certain scroll position
 *  *
 * @param {Props} props
 * @returns
 */
export class Affix extends React.Component<Props, IAffixState> {
  private ref: HTMLElement;
  private lastScrollY = window.scrollY;
  private throttleTimer: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      scrollDirection: "up",
      isFixed: false,
    };
  }

  public static readonly defaultProps: DefaultProps = {
    onScroll: () => null,
    onChange: () => null,
    fixedAttributes: {},
    throttleMs: 0,
  };

  public componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  private setRef(ref: HTMLElement) {
    if (ref && ref.parentNode && !this.ref) {
      this.ref = ref;
    }
  }

  public componentDidUpdate() {
    if (this.ref) {
      // Global class so we can get it from elsewhere
      this.ref.classList.add("affix");
      this.ref.classList.add(styles.affix);
      this.ref.classList.add(this.props.className);
    }
  }

  private readonly onScroll = (e: Event) => {
    if (!this.ref) {
      return;
    }

    const scrollDirection = window.scrollY > this.lastScrollY ? "down" : "up";

    this.setState({
      scrollDirection,
    });

    this.lastScrollY = window.scrollY;

    this.props.onScroll(scrollDirection);
    this.updateLocking();
  };

  private getElementFromUnknownRef(
    ref: React.RefObject<HTMLElement> | HTMLElement
  ) {
    return (
      ((ref ?? {}) as React.RefObject<HTMLElement>).current ??
      (ref as HTMLElement)
    );
  }

  private updateLocking() {
    if (this.throttleTimer || !this.ref) {
      return;
    }

    const to = this.getElementFromUnknownRef(this.props.to);
    const from = this.getElementFromUnknownRef(this.props.from);
    if (!to || !from || !this.ref) {
      return;
    }

    const toBounding = to.getBoundingClientRect();
    const thisBounding = this.ref.getBoundingClientRect();
    const lockUnderBounding = from.getBoundingClientRect();

    const newFixed = this.state.isFixed
      ? thisBounding.top > lockUnderBounding.bottom
      : thisBounding.top < toBounding.bottom;

    if (this.state.isFixed !== newFixed) {
      this.setState({
        isFixed: newFixed,
      });

      this.props.onChange(newFixed);

      if (this.props.throttleMs) {
        this.throttleTimer = setTimeout(() => {
          this.throttleTimer = null;
        }, this.props.throttleMs);
      }
    }
  }

  public render() {
    const { children, fixedAttributes } = this.props;

    const childElement = React.Children.only(children) as React.ReactElement;

    // Get a reference to the child node so we can do stuff to it
    const cloned = React.cloneElement(childElement, {
      ref: (el: HTMLElement) => this.setRef(el),
    });

    if (this.ref) {
      if (this.state.isFixed) {
        this.ref.setAttribute("data-fixed", "true");
        Object.keys(fixedAttributes).forEach((key) => {
          this.ref.setAttribute(key, fixedAttributes[key]);
        });
      }

      if (!this.state.isFixed) {
        this.ref.setAttribute("data-fixed", "false");
        Object.keys(fixedAttributes).forEach((key) => {
          if (this.ref.getAttribute(key)) {
            this.ref.removeAttribute(key);
          }
        });
      }
    }

    return cloned;
  }
}
