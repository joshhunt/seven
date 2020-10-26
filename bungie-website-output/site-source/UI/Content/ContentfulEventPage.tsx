// Created by jlauer, 2020
// Copyright Bungie, Inc.

import { ContentfulEntry } from "@Contentful/ContentfulEntry";
import { ContentfulFetch } from "@Contentful/ContentfulFetch";
import { IEventPageFields } from "@Contentful/Contracts/EventPageContracts";
import { Error404 } from "@UI/Errors/Error404";
import { ErrorDisplay } from "@UI/Errors/ErrorDisplay";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { EntryCollection } from "contentful";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useHistory, useParams } from "react-router";

/**
 * Renders a Contentful entry
 * @constructor
 */
export const ContentfulEventPage = () => {
  const [entryCollection, setEntryCollection] = useState<EntryCollection<
    IEventPageFields
  > | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const params = useParams<{ slug: string }>();
  const history = useHistory();

  useEffect(() => {
    ContentfulFetch.fetchBySlug("eventPage", params.slug)
      .then(setEntryCollection)
      .catch(setError);
  }, [params.slug]);

  const pageTitle = entryCollection?.items?.[0]?.fields?.pageTitle ?? "";

  if (!entryCollection && !error) {
    return <SpinnerContainer loading={true} />;
  }

  const totalInCollection = entryCollection?.total ?? 0;
  if (totalInCollection === 0) {
    return <Error404 />;
  }

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      {error && <ErrorDisplay error={error} />}

      {entryCollection && (
        <ContentfulEntry
          entry={entryCollection.items[0]}
          entryCollection={entryCollection}
        />
      )}
    </div>
  );
};
