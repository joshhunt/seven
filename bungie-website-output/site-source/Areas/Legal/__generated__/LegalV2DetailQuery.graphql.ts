/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LegalV2DetailQueryVariables = {
  url: string;
};
export type LegalV2DetailQueryResponse = {
  readonly all_legal_page: {
    readonly items: ReadonlyArray<{
      readonly title: string | null;
      readonly content: string | null;
      readonly last_updated_date: unknown | null;
    } | null> | null;
  } | null;
};
export type LegalV2DetailQuery = {
  readonly response: LegalV2DetailQueryResponse;
  readonly variables: LegalV2DetailQueryVariables;
};

/*
query LegalV2DetailQuery(
  $url: String!
) {
  all_legal_page(where: {url: $url}) {
    items {
      title
      content
      last_updated_date
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "url",
      } as any,
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            fields: [
              {
                kind: "Variable",
                name: "url",
                variableName: "url",
              },
            ],
            kind: "ObjectValue",
            name: "where",
          },
        ],
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
                name: "content",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "last_updated_date",
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
      name: "LegalV2DetailQuery",
      selections: v1 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "LegalV2DetailQuery",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "c7a1199b90aecd14ee8f4e529f466797",
      id: null,
      metadata: {},
      name: "LegalV2DetailQuery",
      operationKind: "query",
      text:
        "query LegalV2DetailQuery(\n  $url: String!\n) {\n  all_legal_page(where: {url: $url}) {\n    items {\n      title\n      content\n      last_updated_date\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "c3c78d9839b2ed5bf3863b41b5becf8a";
export default node;
