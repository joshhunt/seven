// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import * as React from "react";
import { InvalidPropsError } from "@CustomErrors";
import YouTube from "react-youtube";
import type { Options } from "youtube-player/dist/types";
import styles from "./YoutubeModal.module.scss";
import { createCustomModal, CustomModalProps } from "./CreateCustomModal";
import { ReactUtils } from "@Utilities/ReactUtils";
import { Responsive } from "@Boot/Responsive";

export interface IYoutubeModalBaseProps {
  /** The ID of a video on YouTube */
  videoId?: string;
  youtubeUrl?: string;
  /** The ID of a playlist on YouTube */
  playlistId?: string;
}

export type IYoutubeModalProps = CustomModalProps & IYoutubeModalBaseProps;

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
      (!this.props.playlistId && !this.props.videoId && !this.props.youtubeUrl)
    ) {
      throw new InvalidPropsError(
        "Please provide either a playlistId, youtubeUrl or videoId, but not all"
      );
    }
  }

  private static getYoutubeId(url?: string) {
    const youtubeIdRegex = /[a-zA-Z0-9\-\_]{11}/gi;

    return url?.match(youtubeIdRegex)?.[0];
  }

  public render() {
    const { videoId, playlistId, youtubeUrl } = this.props;

    const youtubeId = videoId ?? YoutubeModal.getYoutubeId(youtubeUrl);

    if (youtubeId) {
      const opts: Options = {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
        },
      };

      return (
        <YouTube
          className={styles.youtubeWrapper}
          videoId={youtubeId}
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
      window.location.href =
        props.youtubeUrl ?? `https://www.youtube.com/watch?v=${props.videoId}`;

      return false;
    }

    return true;
  }
);
