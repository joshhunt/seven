// Created by jlauer, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import { IContentfulEntryProps, ContentfulUtils } from "../../ContentfulUtils";
import { ContentfulEntry } from "../../ContentfulEntry";
import { IEventPageFields } from "../../Contracts/EventPageContracts";

interface IEventPageContext {
  fields: IEventPageFields;
}

export const EventPageContext = React.createContext<IEventPageContext>({
  fields: null,
});

export const EventPageEntry: React.FC<IContentfulEntryProps<
  IEventPageFields
>> = ({ entry, entryCollection }) => {
  const sectionEntries = entry.fields.sections.map((section) =>
    ContentfulUtils.getLinkedEntry<any>(section.sys.id, entryCollection)
  );

  return (
    <div>
      <EventPageContext.Provider value={{ fields: entry.fields }}>
        {sectionEntries.map((section, i) => (
          <ContentfulEntry
            key={i}
            entry={section}
            entryCollection={entryCollection}
          />
        ))}
      </EventPageContext.Provider>
    </div>
  );
};

export default EventPageEntry;
