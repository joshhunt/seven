// Created by jlauer, 2020
// Copyright Bungie, Inc.

import { GetContentfulComponentForEntry } from "@Contentful/ContentfulTypeMap";
import * as React from "react";
import { IContentfulEntryProps } from "./ContentfulUtils";

interface IContentfulEntryState {}

/**
 * ContentfulEntry - Renders any Contentful entry type
 *  *
 * @param {IContentfulEntryProps} props
 * @returns
 */
export class ContentfulEntry<T extends object> extends React.Component<
  IContentfulEntryProps<T>,
  IContentfulEntryState
> {
  constructor(props: IContentfulEntryProps<T>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { entry, entryCollection, children } = this.props;

    const Component = GetContentfulComponentForEntry(this.props.entry);

    return (
      <React.Suspense fallback={<div />}>
        <Component entry={entry} entryCollection={entryCollection}>
          {children}
        </Component>
      </React.Suspense>
    );
  }
}
