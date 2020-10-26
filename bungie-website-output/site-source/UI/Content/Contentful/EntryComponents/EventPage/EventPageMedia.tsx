import { IContentfulEntryProps } from "../../ContentfulUtils";
import { IEventPageSectionMediaFields } from "../../Contracts/EventPageContracts";
import newsMediaStyles from "./DestinyNewsAndMedia.module.scss";
import React, { useState } from "react";
import classNames from "classnames";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Asset } from "contentful";

type Tab = "screenshots" | "wallpapers" | "videos";

export const EventPageMedia: React.FC<IContentfulEntryProps<
  IEventPageSectionMediaFields
>> = ({ entry, entryCollection }) => {
  const {
    screenshots,
    wallpapers,
    title,
    videos,
    videoThumbnails,
  } = entry.fields;

  const tabs: Tab[] = [
    videos && "videos",
    wallpapers && "wallpapers",
    screenshots && "screenshots",
  ].filter((v) => !!v) as Tab[];

  const [tab, setTab] = useState<Tab>(tabs[0]);

  const sectionClasses = classNames(
    newsMediaStyles.sectionMedia,
    newsMediaStyles.section,
    newsMediaStyles.center
  );
  let media: Asset[] = [];
  let thumbnailSource: Asset[] = [];

  switch (tab) {
    case "screenshots":
      media = screenshots;
      thumbnailSource = screenshots;
      break;

    case "videos":
      media = videos;
      thumbnailSource = videoThumbnails;
      break;

    case "wallpapers":
      media = wallpapers;
      thumbnailSource = wallpapers;
      break;
  }

  return (
    <div>
      <div className={sectionClasses}>
        <div className={newsMediaStyles.sectionContent}>
          <div className={newsMediaStyles.sectionTextContent}>
            <div className={newsMediaStyles.sectionTitle}>{title}</div>
            <div
              className={classNames(
                newsMediaStyles.tabs,
                newsMediaStyles.media
              )}
            >
              {tabs.map((t) => (
                <Button key={t} buttonType={"text"} onClick={() => setTab(t)}>
                  {`#` + t}
                </Button>
              ))}
            </div>
          </div>
          <div
            className={classNames(
              newsMediaStyles.mediaContainer,
              newsMediaStyles.four
            )}
          >
            {media.map((mediaItem, i) => (
              <Button
                key={i}
                className={classNames(newsMediaStyles.thumbnail)}
                url={mediaItem.fields.file.url}
              >
                <img
                  src={thumbnailSource[i].fields.file.url}
                  className={classNames(newsMediaStyles.mediaBg)}
                />
                {mediaItem.fields.file.contentType.includes("video") && (
                  <div className={newsMediaStyles.playButton} />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPageMedia;
