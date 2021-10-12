/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PmpNavigationBarFragment = {
  readonly links: ReadonlyArray<{
    readonly label: string | null;
    readonly anchor_id: string | null;
  } | null> | null;
  readonly max_width: number | null;
  readonly primary_color: string | null;
  readonly secondary_color: string | null;
  readonly title: string | null;
  readonly __typename: "PmpNavigationBar";
  readonly " $refType": "PmpNavigationBarFragment";
};
export type PmpNavigationBarFragment$data = PmpNavigationBarFragment;
export type PmpNavigationBarFragment$key = {
  readonly " $data"?: PmpNavigationBarFragment$data;
  readonly " $fragmentRefs": FragmentRefs<"PmpNavigationBarFragment">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "PmpNavigationBarFragment",
  selections: [
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      concreteType: "PmpNavigationBarLinks",
      kind: "LinkedField",
      name: "links",
      plural: true,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "label",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "anchor_id",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "max_width",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "primary_color",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "secondary_color",
      storageKey: null,
    },
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    },
  ],
  type: "PmpNavigationBar",
  abstractKey: null,
} as any;
(node as any).hash = "720cde206456de5742b644737f4c540c";
export default node;
