import {
  IEventPageSectionLinksFields,
  IEventPageLinkSquareFields,
} from "../../Contracts/EventPageContracts";
import { IContentfulEntryProps } from "../../ContentfulUtils";
import { DestinyNewsCallout } from "@Areas/Destiny/Shared/DestinyNewsCallout";
import newsMediaStyles from "./DestinyNewsAndMedia.module.scss";
import React from "react";
import classNames from "classnames";
import { Entry } from "contentful";

export const EventPageLinks: React.FC<IContentfulEntryProps<
  IEventPageSectionLinksFields
>> = ({ entry, entryCollection }) => {
  const { links, title } = entry.fields;

  const sectionClasses = classNames(
    newsMediaStyles.sectionLatestNews,
    newsMediaStyles.section,
    newsMediaStyles.center
  );

  return (
    <div>
      <div className={sectionClasses}>
        <div className={newsMediaStyles.sectionContent}>
          <div className={newsMediaStyles.sectionTextContent}>
            <div className={newsMediaStyles.sectionTitle}>{title}</div>
          </div>
          <div className={newsMediaStyles.newsContainer}>
            {links.map((link) => (
              <EventPageLinkSquare key={link.sys.id} entry={link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventPageLinkSquare: React.FC<{
  entry: Entry<IEventPageLinkSquareFields>;
}> = ({ entry }) => {
  const { link, thumbnail, title } = entry.fields;

  return (
    <DestinyNewsCallout
      key={entry.sys.id}
      bgPath={thumbnail.fields.file.url}
      newsCalloutTitle={title}
      newsCalloutLink={{
        legacy: true,
        url: link,
      }}
    />
  );
};

export default EventPageLinks;
