import { IContentfulEntryProps, ContentfulUtils } from "../../ContentfulUtils";
import { IEventPageSectionContentBlockFields } from "../../Contracts/EventPageContracts";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import React from "react";
import { useDataStore } from "@Global/DataStore";
import { Responsive } from "@Boot/Responsive";
import { ContentfulEntry } from "../../ContentfulEntry";

export const EventPageContentBlock: React.FC<IContentfulEntryProps<
  IEventPageSectionContentBlockFields
>> = ({ entry, entryCollection }) => {
  const {
    alignment,
    background,
    blurb,
    callout,
    sectionTitle,
    smallTitle,
  } = entry.fields;

  const { backgroundColor } = background.fields;

  const responsive = useDataStore(Responsive);
  let margin = "27rem auto 0px";

  if (!responsive.mobile) {
    switch (alignment) {
      case "left":
        margin = "19rem auto 19rem 10%";
        break;
      case "right":
        margin = "19rem 10% 19rem auto";
        break;
      case "center":
        margin = "37rem auto 3rem";
        break;
    }
  }

  return (
    <MarketingContentBlock
      alignment={alignment}
      sectionTitle={sectionTitle}
      smallTitle={ContentfulUtils.renderRichText(smallTitle, entryCollection)}
      bgColor={backgroundColor}
      bgs={
        <ContentfulEntry entry={background} entryCollection={entryCollection} />
      }
      mobileBg={
        <ContentfulEntry entry={background} entryCollection={entryCollection} />
      }
      blurb={ContentfulUtils.renderRichText(blurb, entryCollection)}
      callout={callout}
      margin={margin}
    />
  );
};

export default EventPageContentBlock;
