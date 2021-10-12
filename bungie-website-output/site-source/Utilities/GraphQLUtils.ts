// Created by jlauer, 2021
// Copyright Bungie, Inc.

interface BasicImageConnection {
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
