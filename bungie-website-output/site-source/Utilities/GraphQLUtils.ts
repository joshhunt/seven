// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { HTMLAttributes } from "react";
import { BnetStackFile } from "../Generated/contentstack-types";

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

export const bgImageFromConnection = (connection: BasicImageConnection) => {
  const img = imageFromConnection(connection)?.url;

  return img ? `url(${img})` : undefined;
};

export const bgImage = (img?: string) => {
  return img ? `url(${img})` : undefined;
};

export const responsiveBgImage = (
  desktopImg: string,
  mobileImg: string,
  mobile: boolean
) => {
  const image = mobile ? mobileImg : desktopImg;

  return bgImage(image);
};

export const responsiveBgImageFromConnection = (
  desktopConnection: BasicImageConnection,
  mobileConnection: BasicImageConnection,
  mobile: boolean
) => {
  const img = imageFromConnection(mobile ? mobileConnection : desktopConnection)
    ?.url;

  return img ? `url(${img})` : undefined;
};

export const bgImageFromStackFile = (file: { url: string }) => {
  const img = file?.url;

  return img ? `url(${img})` : undefined;
};

export const responsiveBgImageFromStackFile = (
  desktopFile: BnetStackFile,
  mobileFile: BnetStackFile,
  mobile: boolean
) => {
  const img = mobile ? mobileFile?.url : desktopFile?.url;

  return img ? `url(${img})` : undefined;
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
