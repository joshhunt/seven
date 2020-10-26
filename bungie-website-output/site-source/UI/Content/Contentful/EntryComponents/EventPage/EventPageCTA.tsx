import { IContentfulEntryProps } from "../../ContentfulUtils";
import { IEventPageSectionCTAFields } from "../../Contracts/EventPageContracts";
import React from "react";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import styles from "../../../../Content/EventPage.module.scss";
import { ContentfulEntry } from "../../ContentfulEntry";

export const EventPageCTA: React.FC<IContentfulEntryProps<
  IEventPageSectionCTAFields
>> = (props) => {
  const {
    callToActionBackground,
    callToActionButton,
    callToActionLogo,
    callToActionTitle,
  } = props.entry.fields;

  return (
    <div className={styles.CTA}>
      <ContentfulEntry entry={callToActionBackground} entryCollection={null} />

      {callToActionLogo && (
        <div
          className={styles.CTALogo}
          style={{
            backgroundImage: `url(${callToActionLogo.fields.file.url})`,
          }}
        />
      )}
      {callToActionTitle && (
        <div className={styles.CTATitle}>{callToActionTitle}</div>
      )}

      <BuyButton
        className={styles.buyButton}
        buttonType={"gold"}
        url={callToActionButton.fields.buttonUrl}
        sheen={0.2}
      >
        {callToActionButton.fields.buttonText}
      </BuyButton>
    </div>
  );
};

export default EventPageCTA;
