/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PmpAnchorFragment = {
  readonly title: string | null;
  readonly __typename: "PmpAnchor";
  readonly " $refType": "PmpAnchorFragment";
};
export type PmpAnchorFragment$data = PmpAnchorFragment;
export type PmpAnchorFragment$key = {
  readonly " $data"?: PmpAnchorFragment$data;
  readonly " $fragmentRefs": FragmentRefs<"PmpAnchorFragment">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "PmpAnchorFragment",
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
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    },
  ],
  type: "PmpAnchor",
  abstractKey: null,
} as any;
(node as any).hash = "72dced64f37b975a90ce1dc1e6d7f33c";
export default node;
