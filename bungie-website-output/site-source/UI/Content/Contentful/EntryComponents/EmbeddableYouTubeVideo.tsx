import YouTube from "react-youtube";
import { IContentfulEntryProps } from "../ContentfulUtils";
import React from "react";
import { IEmbeddableYouTubeVideoFields } from "../Contracts/NewsArticleContracts";

export const EmbeddableYouTubeVideo: React.FC<IContentfulEntryProps<
  IEmbeddableYouTubeVideoFields
>> = (props) => {
  return (
    <YouTube
      containerClassName={"embeddable-youtube-video"}
      videoId={props.entry.fields.youTubeVideoLink}
      opts={{
        width: "100%",
        height: "600",
      }}
    />
  );
};

export default EmbeddableYouTubeVideo;
