// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { HTMLAttributes } from "react";

export interface BasicImageConnection {
  readonly edges: ReadonlyArray<{
    readonly node: Partial<{
      readonly filename: string | null;
      readonly url: string | null;
    }> | null;
  } | null> | null;
}

export const imageFromConnection = <T extends BasicImageConnection>(
  connection: T
) => {
  return connection?.edges?.[0]?.node ?? {};
};

// Due to lack of _content_type_uid field in generated typings, we have to manually add it :(
export type HasContentTypeUid = { _content_type_uid: string };
export type WithContentTypeUids<
  T extends any[]
> = T[number] extends HasContentTypeUid ? T : (T[number] & HasContentTypeUid)[];

// Due to lack of uid field in generated typings, we have to manually add it :(
export type HasUid = { uid: string };
export type WithUids<T extends any[]> = T[number] extends HasUid
  ? T
  : (T[number] & HasUid)[];
