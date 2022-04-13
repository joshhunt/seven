/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LegalSubnavQueryVariables = {
  locale: string;
};
export type LegalSubnavQueryResponse = {
  readonly all_legal_page: {
    readonly items: ReadonlyArray<{
      readonly title: string | null;
      readonly url: string | null;
      readonly order: number | null;
    } | null> | null;
  } | null;
};
export type LegalSubnavQuery = {
  readonly response: LegalSubnavQueryResponse;
  readonly variables: LegalSubnavQueryVariables;
};

/*
query LegalSubnavQuery(
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
      name: "LegalSubnavQuery",
      selections: v1 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "LegalSubnavQuery",
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: "6208ff5a866f3aeab58b5f1b9ca463b0",
      id: null,
      metadata: {},
      name: "LegalSubnavQuery",
      operationKind: "query",
      text:
        "query LegalSubnavQuery(\n  $locale: String!\n) {\n  all_legal_page(locale: $locale, fallback_locale: true) {\n    items {\n      title\n      url\n      order\n    }\n  }\n}\n",
    },
  } as any;
})();
(node as any).hash = "c449734d576a41796ade9d6e77b2986f";
export default node;
