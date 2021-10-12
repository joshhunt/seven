/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PmpCallToActionFragment = {
  readonly buttons: ReadonlyArray<{
    readonly button_type: ReadonlyArray<string | null> | null;
    readonly label: string | null;
    readonly url: string | null;
  } | null> | null;
  readonly fileConnection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly url: string | null;
      } | null;
    } | null> | null;
  } | null;
  readonly title: string | null;
  readonly " $refType": "PmpCallToActionFragment";
};
export type PmpCallToActionFragment$data = PmpCallToActionFragment;
export type PmpCallToActionFragment$key = {
  readonly " $data"?: PmpCallToActionFragment$data;
  readonly " $fragmentRefs": FragmentRefs<"PmpCallToActionFragment">;
};

const node: ReaderFragment = (function () {
  var v0 = {
    alias: null,
    args: null,
    kind: "ScalarField",
    name: "url",
    storageKey: null,
  } as any;
  return {
    argumentDefinitions: [],
    kind: "Fragment",
    metadata: null,
    name: "PmpCallToActionFragment",
    selections: [
      {
        alias: null,
        args: null,
        concreteType: "Button",
        kind: "LinkedField",
        name: "buttons",
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "button_type",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "label",
            storageKey: null,
          },
          v0 /*: any*/,
        ],
        storageKey: null,
      },
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "fileConnection",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "SysAssetEdge",
            kind: "LinkedField",
            name: "edges",
            plural: true,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "SysAsset",
                kind: "LinkedField",
                name: "node",
                plural: false,
                selections: [v0 /*: any*/],
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
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
    type: "PmpCallToAction",
    abstractKey: null,
  } as any;
})();
(node as any).hash = "bf6a5dda9c3996bac60bd97928c392c5";
export default node;
