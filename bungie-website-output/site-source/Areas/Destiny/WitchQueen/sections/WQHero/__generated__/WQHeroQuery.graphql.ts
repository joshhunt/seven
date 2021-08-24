/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type WQHeroQueryVariables = {
  locale: string;
};
export type WQHeroQueryResponse = {
  readonly nova_product_page: {
    readonly hero: {
      readonly hero_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_trailer_btn_bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_logo_imgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_pre_order_btn_bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_pre_order_btn_text: string | null;
      readonly hero_trailer_btn_text: string | null;
      readonly hero_trailer_id: string | null;
      readonly hero_date_text: string | null;
      readonly hero_bg_desktop_videoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
  } | null;
};
export type WQHeroQuery = {
  readonly response: WQHeroQueryResponse;
  readonly variables: WQHeroQueryVariables;
};

/*
query WQHeroQuery(
  $locale: String!
) {
  nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {
    hero {
      hero_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_trailer_btn_bgConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_logo_imgConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_pre_order_btn_bgConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_pre_order_btn_text
      hero_trailer_btn_text
      hero_trailer_id
      hero_date_text
      hero_bg_desktop_videoConnection {
        edges {
          node {
            url
          }
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
      } as any,
    ],
    v2 = [
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
            concreteType: "NovaProductPageHero",
            kind: "LinkedField",
            name: "hero",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_desktopConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_mobileConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_trailer_btn_bgConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_logo_imgConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_pre_order_btn_bgConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hero_pre_order_btn_text",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hero_trailer_btn_text",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hero_trailer_id",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hero_date_text",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_desktop_videoConnection",
                plural: false,
                selections: v1 /*: any*/,
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
      name: "WQHeroQuery",
      selections: v2 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "WQHeroQuery",
      selections: v2 /*: any*/,
    },
    params: {
      cacheID: "9ef78741a28cc72a5d71ea5b6ea64111",
      id: null,
      metadata: {},
      name: "WQHeroQuery",
      operationKind: "query",
      text:
        'query WQHeroQuery(\n  $locale: String!\n) {\n  nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {\n    hero {\n      hero_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_trailer_btn_bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_logo_imgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_pre_order_btn_bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_pre_order_btn_text\n      hero_trailer_btn_text\n      hero_trailer_id\n      hero_date_text\n      hero_bg_desktop_videoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "708ba9a59a028292d555142bbe69b112";
export default node;
