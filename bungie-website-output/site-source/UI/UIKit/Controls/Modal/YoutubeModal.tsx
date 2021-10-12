// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import * as React from "react";
import { InvalidPropsError } from "@CustomErrors";
import YouTube, { Options } from "react-youtube";
import styles from "./YoutubeModal.module.scss";
import { createCustomModal, CustomModalProps } from "./CreateCustomModal";
import { ReactUtils } from "@Utilities/ReactUtils";
import { Responsive } from "@Boot/Responsive";

interface IYoutubeModalProps extends CustomModalProps {
  /** The ID of a video on YouTube */
  videoId?: string;
  /** The ID of a playlist on YouTube */
  playlistId?: string;
}

interface IYoutubeModalState {}

/**
 * YoutubeModal - Replace this description
 *  *
 * @param {IYoutubeModalProps} props
 * @returns
 */
class YoutubeModal extends React.Component<
  IYoutubeModalProps,
  IYoutubeModalState
> {
  constructor(props: IYoutubeModalProps) {
    super(props);

    this.rejectInvalidProps();

    this.state = {};
  }

  public shouldComponentUpdate(): boolean {
    this.rejectInvalidProps();

    return ReactUtils.shouldComponentUpdate(this, arguments);
  }

  private rejectInvalidProps() {
    if (
      (this.props.playlistId && this.props.videoId) ||
      (!this.props.playlistId && !this.props.videoId)
    ) {
      throw new InvalidPropsError(
        "Please provide either a playlistId or videoId, but not both"
      );
    }
  }

  public render() {
    const { videoId, playlistId } = this.props;

    if (videoId) {
      const opts: Options = {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
        },
      };

      return (
        <YouTube
          containerClassName={styles.youtubeWrapper}
          videoId={videoId}
          opts={opts}
        />
      );
    } else if (playlistId) {
      let listId = playlistId;
      if (!listId.toLowerCase().startsWith("pl")) {
        listId = "PL" + listId;
      }

      const url = `https://www.youtube.com/embed?listType=playlist&list=${listId}&origin=https://www.bungie.net`;

      return <iframe id="ytplayer" src={url} />;
    }
  }
}

export default createCustomModal<IYoutubeModalProps>(
  YoutubeModal,
  {
    className: styles.youtubeModal,
    contentClassName: styles.content,
  },
  (props) => {
    if (Responsive.state.mobile) {
      window.location.href = `https://www.youtube.com/watch?v=${props.videoId}`;

      return false;
    }

    return true;
  }
);
