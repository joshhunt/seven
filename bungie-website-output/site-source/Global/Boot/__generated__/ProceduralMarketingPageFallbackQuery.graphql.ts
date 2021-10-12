/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ProceduralMarketingPageFallbackQueryVariables = {
  slug: string;
  locale: string;
};
export type ProceduralMarketingPageFallbackQueryResponse = {
  readonly all_procedural_marketing_page: {
    readonly items: ReadonlyArray<{
      readonly title: string | null;
      readonly url: string | null;
      readonly seo_description: string | null;
      readonly social_media_preview_imageConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly contentConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly __typename: string;
            readonly " $fragmentRefs": FragmentRefs<
              | "PmpAnchorFragment"
              | "PmpNavigationBarFragment"
              | "PmpCallToActionFragment"
            >;
          } | null;
        } | null> | null;
      } | null;
    } | null> | null;
  } | null;
};
export type ProceduralMarketingPageFallbackQuery = {
  readonly response: ProceduralMarketingPageFallbackQueryResponse;
  readonly variables: ProceduralMarketingPageFallbackQueryVariables;
};

/*
query ProceduralMarketingPageFallbackQuery(
  $slug: String!
  $locale: String!
) {
  all_procedural_marketing_page(where: {url: $slug, locale: $locale}) {
    items {
      title
      url
      seo_description
      social_media_preview_imageConnection {
        edges {
          node {
            url
          }
        }
      }
      contentConnection {
        edges {
          node {
            __typename
            ...PmpAnchorFragment
            ...PmpNavigationBarFragment
            ...PmpCallToActionFragment
          }
        }
      }
    }
  }
}

fragment PmpAnchorFragment on PmpAnchor {
  __typename
  title
}

fragment PmpCallToActionFragment on PmpCallToAction {
  buttons {
    button_type
    label
    url
  }
  fileConnection {
    edges {
      node {
        url
      }
    }
  }
  title
}

fragment PmpNavigationBarFragment on PmpNavigationBar {
  __typename
  links {
    label
    anchor_id
  }
  max_width
  primary_color
  secondary_color
  title
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
      name: "slug",
    } as any,
    v2 = [
      {
        fields: [
          {
            kind: "Variable",
            name: "locale",
            variableName: "locale",
          },
          {
            kind: "Variable",
            name: "url",
            variableName: "slug",
          },
        ],
        kind: "ObjectValue",
        name: "where",
      } as any,
    ],
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    } as any,
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    } as any,
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "seo_description",
      storageKey: null,
    } as any,
    v6 = [
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
            selections: [v4 /*: any*/],
            storageKey: null,
          },
        ],
        storageKey: null,
      } as any,
    ],
    v7 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "social_media_preview_imageConnection",
      plural: false,
      selections: v6 /*: any*/,
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "label",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "ProceduralMarketingPageFallbackQuery",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "AllProceduralMarketingPage",
          kind: "LinkedField",
          name: "all_procedural_marketing_page",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "ProceduralMarketingPage",
              kind: "LinkedField",
              name: "items",
              plural: true,
              selections: [
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v7 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ProceduralMarketingPageContentConnection",
                  kind: "LinkedField",
                  name: "contentConnection",
                  plural: false,
                  selections: [
                    {
                      alias: null,
                      args: null,
                      concreteType: "ProceduralMarketingPageContentEdge",
                      kind: "LinkedField",
                      name: "edges",
                      plural: true,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: null,
                          kind: "LinkedField",
                          name: "node",
                          plural: false,
                          selections: [
                            v8 /*: any*/,
                            {
                              args: null,
                              kind: "FragmentSpread",
                              name: "PmpAnchorFragment",
                            },
                            {
                              args: null,
                              kind: "FragmentSpread",
                              name: "PmpNavigationBarFragment",
                            },
                            {
                              args: null,
                              kind: "FragmentSpread",
                              name: "PmpCallToActionFragment",
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
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "ProceduralMarketingPageFallbackQuery",
      selections: [
        {
          alias: null,
          args: v2 /*: any*/,
          concreteType: "AllProceduralMarketingPage",
          kind: "LinkedField",
          name: "all_procedural_marketing_page",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "ProceduralMarketingPage",
              kind: "LinkedField",
              name: "items",
              plural: true,
              selections: [
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v7 /*: any*/,
                {
                  alias: null,
                  args: null,
                  concreteType: "ProceduralMarketingPageContentConnection",
                  kind: "LinkedField",
                  name: "contentConnection",
                  plural: false,
                  selections: [
                    {
                      alias: null,
                      args: null,
                      concreteType: "ProceduralMarketingPageContentEdge",
                      kind: "LinkedField",
                      name: "edges",
                      plural: true,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          concreteType: null,
                          kind: "LinkedField",
                          name: "node",
                          plural: false,
                          selections: [
                            v8 /*: any*/,
                            {
                              kind: "InlineFragment",
                              selections: [v3 /*: any*/],
                              type: "PmpAnchor",
                              abstractKey: null,
                            },
                            {
                              kind: "InlineFragment",
                              selections: [
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: "PmpNavigationBarLinks",
                                  kind: "LinkedField",
                                  name: "links",
                                  plural: true,
                                  selections: [
                                    v9 /*: any*/,
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
                                v3 /*: any*/,
                              ],
                              type: "PmpNavigationBar",
                              abstractKey: null,
                            },
                            {
                              kind: "InlineFragment",
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
                                    v9 /*: any*/,
                                    v4 /*: any*/,
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
                                  selections: v6 /*: any*/,
                                  storageKey: null,
                                },
                                v3 /*: any*/,
                              ],
                              type: "PmpCallToAction",
                              abstractKey: null,
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
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "663b3bb71a1cf5087b531299f1adeaba",
      id: null,
      metadata: {},
      name: "ProceduralMarketingPageFallbackQuery",
      operationKind: "query",
      text:
        "query ProceduralMarketingPageFallbackQuery(\n  $slug: String!\n  $locale: String!\n) {\n  all_procedural_marketing_page(where: {url: $slug, locale: $locale}) {\n    items {\n      title\n      url\n      seo_description\n      social_media_preview_imageConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      contentConnection {\n        edges {\n          node {\n            __typename\n            ...PmpAnchorFragment\n            ...PmpNavigationBarFragment\n            ...PmpCallToActionFragment\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment PmpAnchorFragment on PmpAnchor {\n  __typename\n  title\n}\n\nfragment PmpCallToActionFragment on PmpCallToAction {\n  buttons {\n    button_type\n    label\n    url\n  }\n  fileConnection {\n    edges {\n      node {\n        url\n      }\n    }\n  }\n  title\n}\n\nfragment PmpNavigationBarFragment on PmpNavigationBar {\n  __typename\n  links {\n    label\n    anchor_id\n  }\n  max_width\n  primary_color\n  secondary_color\n  title\n}\n",
    },
  } as any;
})();
(node as any).hash = "11da1049d3c4c1c52f6c3d87ddb6ed02";
export default node;
