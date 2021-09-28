// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Icon } from "@UIKit/Controls/Icon";
import {
  createCustomModal,
  CustomModalProps,
} from "@UIKit/Controls/Modal/CreateCustomModal";
import classNames from "classnames";
import styles from "./ImagePaginationModal.module.scss";
import React, { KeyboardEventHandler } from "react";

interface ImagePaginationModalProps extends CustomModalProps {
  /* all images user can paginate through */
  images: string[];
  /* index of image to open up in modal */
  imgIndex: number;
}

interface ImagePaginationModalState {
  currentImageIndex: number;
}

/**
 * Opens an image in a modal with arrows to paginate between a list of images
 */
class ImagePaginationModal extends React.Component<
  ImagePaginationModalProps,
  ImagePaginationModalState
> {
  constructor(props: ImagePaginationModalProps) {
    super(props);

    this.state = {
      currentImageIndex: props.imgIndex,
    };
  }

  public componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  public componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress.bind(this));
  }

  private handleKeyPress(e: KeyboardEvent): void {
    switch (e.key.toLowerCase()) {
      case "arrowleft":
        this.changeImage(this.state.currentImageIndex - 1);
        break;
      case "arrowright":
        this.changeImage(this.state.currentImageIndex + 1);
        break;
    }
  }

  private changeImage(imgIndex: number) {
    if (imgIndex < 0) {
      this.setState({ currentImageIndex: this.props.images.length - 1 });
    } else if (imgIndex >= this.props.images.length) {
      this.setState({ currentImageIndex: 0 });
    } else {
      this.setState({ currentImageIndex: imgIndex });
    }
  }

  public render() {
    return (
      <>
        <img
          className={styles.img}
          src={this.props.images[this.state.currentImageIndex]}
        />
        {(this.props.images?.length ?? 0) > 1 && (
          <>
            <button
              className={classNames(styles.arrow, styles.left)}
              onClick={() => this.changeImage(this.state.currentImageIndex - 1)}
            >
              <Icon
                className={styles.arrowIcon}
                iconName={"arrow_left"}
                iconType={"material"}
              />
            </button>
            <button
              className={classNames(styles.arrow, styles.right)}
              onClick={() => this.changeImage(this.state.currentImageIndex + 1)}
            >
              <Icon
                className={styles.arrowIcon}
                iconName={"arrow_right"}
                iconType={"material"}
              />
            </button>
          </>
        )}
      </>
    );
  }
}

export default createCustomModal<ImagePaginationModalProps>(
  ImagePaginationModal,
  {
    className: styles.paginationModal,
    contentClassName: styles.content,
  },
  (props) => {
    return true;
  }
);
