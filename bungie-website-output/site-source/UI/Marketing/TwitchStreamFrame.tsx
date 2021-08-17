// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import React from "react";

interface TwitchStreamFrameProps {
  className?: string;
  streamChannel: string;
}

/**
 * iframe with embedded twitch stream for a given twitch channel
 * @param props
 * @constructor
 */
export const TwitchStreamFrame: React.FC<TwitchStreamFrameProps> = (props) => {
  return (
    <iframe
      title={props.streamChannel}
      className={props.className}
      src={`https://player.twitch.tv/?channel=${props.streamChannel}&parent=${location.hostname}&muted=true&autoplay=true`}
      frameBorder={"0"}
      scrolling={"no"}
      allowFullScreen={true}
    />
  );
};
