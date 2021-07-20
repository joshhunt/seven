/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LegalV2SubnavQueryVariables = {};
export type LegalV2SubnavQueryResponse = {
  readonly all_legal_page: {
    readonly items: ReadonlyArray<{
      readonly title: string | null;
      readonly url: string | null;
      readonly order: number | null;
    } | null> | null;
  } | null;
};
export type LegalV2SubnavQuery = {
  readonly response: LegalV2SubnavQueryResponse;
  readonly variables: LegalV2SubnavQueryVariables;
};

/*
query LegalV2SubnavQuery {
  all_legal_page {
    items {
      title
      url
      order
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: "AllLegalPage",
      kind: "LinkedField",
      name: "all_legal_page",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "LegalPage",
          kind: "LinkedField",
          name: "items",
          plural: true,
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
              kind: "ScalarField",
              name: "url",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "order",
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
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "LegalV2SubnavQuery",
      selections: v0 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "LegalV2SubnavQuery",
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: "6ae29e54adb8b2940ac2560021ee6442",
      id: null,
      metadata: {},
      name: "LegalV2SubnavQuery",
      operationKind: "query",
      text:
        "query LegalV2SubnavQuery {\n  all_legal_page {\n    items {\n      title\n      url\n      order\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "29c76f55e4d29369c44dd2b30f4abe53";
export default node;
