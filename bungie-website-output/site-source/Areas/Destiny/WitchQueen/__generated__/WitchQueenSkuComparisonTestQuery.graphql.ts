/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type WitchQueenSkuComparisonTestQueryVariables = {
  locale: string;
};
export type WitchQueenSkuComparisonTestQueryResponse = {
  readonly nova_product_page: {
    readonly title: string | null;
    readonly meta_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};
export type WitchQueenSkuComparisonTestQuery = {
  readonly response: WitchQueenSkuComparisonTestQueryResponse;
  readonly variables: WitchQueenSkuComparisonTestQueryVariables;
};

/*
query WitchQueenSkuComparisonTestQuery(
  $locale: String!
) {
  nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {
    title
    meta_imageConnection {
      edges {
        node {
          url
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "locale",
      } as any,
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "locale",
            variableName: "locale",
          },
          {
            kind: "Literal",
            name: "uid",
            value: "blt6927482d223d0222",
          },
        ],
        concreteType: "NovaProductPage",
        kind: "LinkedField",
        name: "nova_product_page",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "title",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "meta_imageConnection",
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
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "url",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      } as any,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "WitchQueenSkuComparisonTestQuery",
      selections: v1 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "WitchQueenSkuComparisonTestQuery",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "e6694039556923883ebb94214db8a9cd",
      id: null,
      metadata: {},
      name: "WitchQueenSkuComparisonTestQuery",
      operationKind: "query",
      text:
        'query WitchQueenSkuComparisonTestQuery(\n  $locale: String!\n) {\n  nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {\n    title\n    meta_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "0f3e768c5ad95c6bc4aec76e51cdec56";
export default node;
