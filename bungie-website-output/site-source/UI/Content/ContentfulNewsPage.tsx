// Created by jlauer, 2020
// Copyright Bungie, Inc.

import { ContentfulEntry } from "@Contentful/ContentfulEntry";
import { ContentfulFetch } from "@Contentful/ContentfulFetch";
import { IEventPageFields } from "@Contentful/Contracts/EventPageContracts";
import { NotFoundError } from "@CustomErrors";
import { ErrorDisplay } from "@UI/Errors/ErrorDisplay";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { EntryCollection } from "contentful";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useParams } from "react-router";
import { INewsArticleFields } from "../../../types/generated/contentful";

interface IContentfulNewsPageProps {}

interface IContentfulNewsPageState {
  entryCollection: EntryCollection<IEventPageFields>;
}

/**
 * ContentfulNewsPage - Replace this description
 *  *
 * @param {IContentfulNewsPageProps} props
 * @returns
 */
export const ContentfulNewsPage = () => {
  const [entryCollection, setEntryCollection] = useState<EntryCollection<
    INewsArticleFields
  > | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    ContentfulFetch.fetchBySlug("newsArticle", params.slug)
      .then(setEntryCollection)
      .catch(setError);
  }, [params.slug]);

  const entry = entryCollection?.items?.[0];

  if (!entryCollection) {
    return <SpinnerContainer loading={true} />;
  }

  if ((entryCollection?.items?.length ?? 0) === 0) {
    throw new NotFoundError();
  }

  const { title } = entry.fields;

  return (
    <div>
      <Helmet>
        <title>{title}</title>
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
