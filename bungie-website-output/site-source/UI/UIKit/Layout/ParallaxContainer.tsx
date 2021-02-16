import React, { DOMAttributes } from "react";
import classNames from "classnames";
import styles from "./ParallaxContainer.module.scss";

interface ParallaxDomProps extends DOMAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  parallaxSpeed: number;
  fadeOutSpeed: number;
  isFadeEnabled?: boolean;
  backgroundOffset: number;
}

/**
 * Parallaxes the children inside
 * */
export class ParallaxContainer extends React.Component<ParallaxDomProps> {
  public state = {
    offset: 0,
  };

  public componentDidMount() {
    window.addEventListener("scroll", this.parallax);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.parallax);
  }

  private readonly parallax = () => {
    this.setState({
      offset: window.pageYOffset,
    });
  };

  public render() {
    let style: React.CSSProperties = this.props.isFadeEnabled
      ? {
          backgroundPositionY: this.state.offset / this.props.parallaxSpeed,
          opacity:
            1 -
            this.state.offset / this.props.fadeOutSpeed +
            this.props.backgroundOffset,
        }
      : {
          backgroundPositionY:
            this.state.offset / this.props.parallaxSpeed +
            this.props.backgroundOffset,
        };

    style = {
      ...style,
      ...this.props.style,
    };

    return (
      <div
        className={classNames(styles.parallaxContainer, this.props.className)}
        style={style}
      >
        {this.props.children}
      </div>
    );
  }
}
