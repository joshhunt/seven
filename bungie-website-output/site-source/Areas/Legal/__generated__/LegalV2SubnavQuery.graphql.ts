/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LegalV2SubnavQueryVariables = {
  locale: string;
};
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
query LegalV2SubnavQuery(
  $locale: String!
) {
  all_legal_page(locale: $locale, fallback_locale: true) {
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
            kind: "Literal",
            name: "fallback_locale",
            value: true,
          },
          {
            kind: "Variable",
            name: "locale",
            variableName: "locale",
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
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "LegalV2SubnavQuery",
      selections: v1 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "LegalV2SubnavQuery",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "dc88c671596dabe3e5866ca871900584",
      id: null,
      metadata: {},
      name: "LegalV2SubnavQuery",
      operationKind: "query",
      text:
        "query LegalV2SubnavQuery(\n  $locale: String!\n) {\n  all_legal_page(locale: $locale, fallback_locale: true) {\n    items {\n      title\n      url\n      order\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "9c4ef66b8b52469d6e9d1ff3630bfb90";
export default node;
