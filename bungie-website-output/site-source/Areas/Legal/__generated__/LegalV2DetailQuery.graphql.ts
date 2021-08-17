/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LegalV2DetailQueryVariables = {
  url: string;
  locale: string;
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
  $locale: String!
) {
  all_legal_page(where: {url: $url}, locale: $locale, fallback_locale: true) {
    items {
      title
      content
      last_updated_date
    }
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "locale",
    } as any,
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "url",
    } as any,
    v2 = [
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
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "LegalV2DetailQuery",
      selections: v2 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "LegalV2DetailQuery",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "21df225cef0fe47b51213b8baceb3c7f",
      id: null,
      metadata: {},
      name: "LegalV2DetailQuery",
      operationKind: "query",
      text:
        "query LegalV2DetailQuery(\n  $url: String!\n  $locale: String!\n) {\n  all_legal_page(where: {url: $url}, locale: $locale, fallback_locale: true) {\n    items {\n      title\n      content\n      last_updated_date\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "58c26fdcd611dc4006bc27a7bb12ecfe";
export default node;
