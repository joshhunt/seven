import React from "react";
import styles from "../../../../Content/EventPage.module.scss";
import { ContentfulUtils, IContentfulEntryProps } from "../../ContentfulUtils";
import { IEventPageSectionBannerFields } from "../../Contracts/EventPageContracts";
import { EventPageContext } from "./EventPage";

export const EventPageBanner: React.FC<IContentfulEntryProps<
  IEventPageSectionBannerFields
>> = (props) => {
  const { bannerText, borderColor, background } = props.entry.fields;

  const backgroundImage = background?.fields?.file?.url;

  return (
    <EventPageContext.Consumer>
      {(context) => (
        <div
          style={{
            backgroundColor: context.fields.accentColor,
            zIndex: 100,
            borderTop: `4px solid ${borderColor}`,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
          }}
          className={styles.banner}
        >
          <div>
            {ContentfulUtils.renderRichText(bannerText, props.entryCollection)}
          </div>
        </div>
      )}
    </EventPageContext.Consumer>
  );
};

export default EventPageBanner;
