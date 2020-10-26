import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document, INLINES } from "@contentful/rich-text-types";
import { Entry, RichTextDataTarget } from "contentful";
import React from "react";
import { ContentfulAsset } from "./ContentfulAsset";
import { ContentfulEntry } from "./ContentfulEntry";
import { TypedEntryCollection } from "./Contracts/BasicContracts";

export interface IContentfulEntryProps<T extends object, U = any>
  extends React.PropsWithChildren<{}> {
  className?: string;
  style?: React.CSSProperties;
  entry: Entry<T>;
  /** Must be provided if linked entries need to be found */
  entryCollection: TypedEntryCollection<U> | undefined;
}

export interface IContentfulAssetProps<T extends object, U = any>
  extends React.PropsWithChildren<{}> {
  className?: string;
  style?: React.CSSProperties;
  asset: RichTextDataTarget;
  /** Must be provided if linked entries need to be found */
  entryCollection: TypedEntryCollection<U> | undefined;
}

export type ReactContentfulComponent =
  | React.FunctionComponent<IContentfulEntryProps<any>>
  | React.ComponentClass<IContentfulEntryProps<any>>;

export class ContentfulUtils {
  /**
   * Given an entry ID, find that entry in a given entry collection
   * @param id
   * @param entryCollection
   */
  public static getLinkedEntry<T>(
    id: string,
    entryCollection: TypedEntryCollection<any>
  ): Entry<T> {
    return entryCollection.includes.Entry.find((i) => i.sys.id === id);
  }

  /**
   * Given rich text from an entry, render all of the embedded entries
   * @param richText
   * @param entryCollection
   */
  public static renderRichText(
    richText: Document,
    entryCollection: TypedEntryCollection<any> | undefined
  ) {
    return documentToReactComponents(richText, {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          return (
            <ContentfulAsset
              asset={node.data.target}
              entryCollection={entryCollection}
            />
          );
        },
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          return (
            <ContentfulEntry
              entry={node.data.target}
              entryCollection={entryCollection}
            />
          );
        },
        [INLINES.EMBEDDED_ENTRY]: (node) => {
          return (
            <ContentfulEntry
              entry={node.data.target}
              entryCollection={entryCollection}
            />
          );
        },
      },
    });
  }
}
