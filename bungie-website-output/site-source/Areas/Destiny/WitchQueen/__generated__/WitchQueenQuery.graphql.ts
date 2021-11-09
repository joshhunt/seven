/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type WitchQueenQueryVariables = {
  locale: string;
};
export type WitchQueenQueryResponse = {
  readonly nova_product_page: {
    readonly title: string | null;
    readonly meta_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly hero: {
      readonly hero_date_text: string | null;
    } | null;
    readonly page_bottom_img_desktopConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly page_bottom_img_mobileConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly section_heading_wq_text: string | null;
    readonly editions_section_title: string | null;
    readonly editions_tab_anniversary_bundle: string | null;
    readonly editions_tab_standard: string | null;
    readonly editions_tab_deluxe: string | null;
    readonly editions_section_bg_desktopConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly collectors_edition_bg_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly locale_supports_gradient_font: boolean | null;
    readonly sticky_buy_nav: {
      readonly buy_btn_text: string | null;
      readonly dropdown_title: string | null;
      readonly wq_logo_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly wq_logo_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly mobile_dropdown_label: string | null;
    } | null;
    readonly sticky_nav_skus: ReadonlyArray<{
      readonly wq_sku?: {
        readonly label: string | null;
        readonly sku_tag: string | null;
      } | null;
    } | null> | null;
    readonly section_blocks: ReadonlyArray<{
      readonly section_content?: {
        readonly section: string | null;
        readonly section_class: string | null;
        readonly section_bg_desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly section_bg_mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly img_above_headingConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly section_heading: string | null;
        readonly primary_section_blurbs: ReadonlyArray<{
          readonly blurb_text: string | null;
          readonly uses_special_font: boolean | null;
        } | null> | null;
        readonly clickable_thumbnails: ReadonlyArray<{
          readonly thumbnail_imgConnection: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly url: string | null;
              } | null;
            } | null> | null;
          } | null;
          readonly screenshot_imgConnection: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly url: string | null;
              } | null;
            } | null> | null;
          } | null;
          readonly img_caption: string | null;
          readonly bottom_caption: string | null;
          readonly video_id: string | null;
        } | null> | null;
        readonly image_and_text_blocks: ReadonlyArray<{
          readonly blurb: string | null;
          readonly blurb_heading: string | null;
          readonly thumbnail_imgConnection: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly url: string | null;
              } | null;
            } | null> | null;
          } | null;
          readonly screenshot_imgConnection: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly url: string | null;
              } | null;
            } | null> | null;
          } | null;
          readonly caption: string | null;
        } | null> | null;
      } | null;
    } | null> | null;
  } | null;
};
export type WitchQueenQuery = {
  readonly response: WitchQueenQueryResponse;
  readonly variables: WitchQueenQueryVariables;
};

/*
query WitchQueenQuery(
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
    hero {
      hero_date_text
    }
    page_bottom_img_desktopConnection {
      edges {
        node {
          url
        }
      }
    }
    page_bottom_img_mobileConnection {
      edges {
        node {
          url
        }
      }
    }
    section_heading_wq_text
    editions_section_title
    editions_tab_anniversary_bundle
    editions_tab_standard
    editions_tab_deluxe
    editions_section_bg_desktopConnection {
      edges {
        node {
          url
        }
      }
    }
    collectors_edition_bg_imageConnection {
      edges {
        node {
          url
        }
      }
    }
    locale_supports_gradient_font
    sticky_buy_nav {
      buy_btn_text
      dropdown_title
      wq_logo_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      wq_logo_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      mobile_dropdown_label
    }
    sticky_nav_skus {
      __typename
      ... on NovaProductPageStickyNavSkusWqSku {
        wq_sku {
          label
          sku_tag
        }
      }
    }
    section_blocks {
      __typename
      ... on NovaProductPageSectionBlocksSectionContent {
        section_content {
          section
          section_class
          section_bg_desktopConnection {
            edges {
              node {
                url
              }
            }
          }
          section_bg_mobileConnection {
            edges {
              node {
                url
              }
            }
          }
          img_above_headingConnection {
            edges {
              node {
                url
              }
            }
          }
          section_heading
          primary_section_blurbs {
            blurb_text
            uses_special_font
          }
          clickable_thumbnails {
            thumbnail_imgConnection {
              edges {
                node {
                  url
                }
              }
            }
            screenshot_imgConnection {
              edges {
                node {
                  url
                }
              }
            }
            img_caption
            bottom_caption
            video_id
          }
          image_and_text_blocks {
            blurb
            blurb_heading
            thumbnail_imgConnection {
              edges {
                node {
                  url
                }
              }
            }
            screenshot_imgConnection {
              edges {
                node {
                  url
                }
              }
            }
            caption
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
        kind: "Variable",
        name: "locale",
        variableName: "locale",
      } as any,
      {
        kind: "Literal",
        name: "uid",
        value: "blt6927482d223d0222",
      } as any,
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    } as any,
    v3 = [
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
    v4 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "meta_imageConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v5 = {
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
          kind: "ScalarField",
          name: "hero_date_text",
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "page_bottom_img_desktopConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "page_bottom_img_mobileConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_heading_wq_text",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "editions_section_title",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "editions_tab_anniversary_bundle",
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "editions_tab_standard",
      storageKey: null,
    } as any,
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "editions_tab_deluxe",
      storageKey: null,
    } as any,
    v13 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "editions_section_bg_desktopConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v14 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "collectors_edition_bg_imageConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v15 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "locale_supports_gradient_font",
      storageKey: null,
    } as any,
    v16 = {
      alias: null,
      args: null,
      concreteType: "NovaProductPageStickyBuyNav",
      kind: "LinkedField",
      name: "sticky_buy_nav",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "buy_btn_text",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "dropdown_title",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "SysAssetConnection",
          kind: "LinkedField",
          name: "wq_logo_desktopConnection",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "SysAssetConnection",
          kind: "LinkedField",
          name: "wq_logo_mobileConnection",
          plural: false,
          selections: v3 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "mobile_dropdown_label",
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v17 = {
      kind: "InlineFragment",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "NovaProductPageStickyNavSkusWqSkuBlock",
          kind: "LinkedField",
          name: "wq_sku",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "label",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "sku_tag",
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "NovaProductPageStickyNavSkusWqSku",
      abstractKey: null,
    } as any,
    v18 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "thumbnail_imgConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v19 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "screenshot_imgConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v20 = {
      kind: "InlineFragment",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "NovaProductPageSectionBlocksSectionContentBlock",
          kind: "LinkedField",
          name: "section_content",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "section",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "section_class",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "section_bg_desktopConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "section_bg_mobileConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "img_above_headingConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "section_heading",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType:
                "NovaProductPageSectionBlocksSectionContentBlockPrimarySectionBlurbs",
              kind: "LinkedField",
              name: "primary_section_blurbs",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "blurb_text",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "uses_special_font",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType:
                "NovaProductPageSectionBlocksSectionContentBlockClickableThumbnails",
              kind: "LinkedField",
              name: "clickable_thumbnails",
              plural: true,
              selections: [
                v18 /*: any*/,
                v19 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "img_caption",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "bottom_caption",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "video_id",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType:
                "NovaProductPageSectionBlocksSectionContentBlockImageAndTextBlocks",
              kind: "LinkedField",
              name: "image_and_text_blocks",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "blurb",
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "blurb_heading",
                  storageKey: null,
                },
                v18 /*: any*/,
                v19 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: "ScalarField",
                  name: "caption",
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "NovaProductPageSectionBlocksSectionContent",
      abstractKey: null,
    } as any,
    v21 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    } as any;
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "WitchQueenQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "NovaProductPage",
          kind: "LinkedField",
          name: "nova_product_page",
          plural: false,
          selections: [
            v2 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            v10 /*: any*/,
            v11 /*: any*/,
            v12 /*: any*/,
            v13 /*: any*/,
            v14 /*: any*/,
            v15 /*: any*/,
            v16 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "sticky_nav_skus",
              plural: true,
              selections: [v17 /*: any*/],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "section_blocks",
              plural: true,
              selections: [v20 /*: any*/],
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
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "WitchQueenQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "NovaProductPage",
          kind: "LinkedField",
          name: "nova_product_page",
          plural: false,
          selections: [
            v2 /*: any*/,
            v4 /*: any*/,
            v5 /*: any*/,
            v6 /*: any*/,
            v7 /*: any*/,
            v8 /*: any*/,
            v9 /*: any*/,
            v10 /*: any*/,
            v11 /*: any*/,
            v12 /*: any*/,
            v13 /*: any*/,
            v14 /*: any*/,
            v15 /*: any*/,
            v16 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "sticky_nav_skus",
              plural: true,
              selections: [v21 /*: any*/, v17 /*: any*/],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "section_blocks",
              plural: true,
              selections: [v21 /*: any*/, v20 /*: any*/],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "1da3c1ec71e3895d2f92cfef90901fa3",
      id: null,
      metadata: {},
      name: "WitchQueenQuery",
      operationKind: "query",
      text:
        'query WitchQueenQuery(\n  $locale: String!\n) {\n  nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {\n    title\n    meta_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    hero {\n      hero_date_text\n    }\n    page_bottom_img_desktopConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    page_bottom_img_mobileConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    section_heading_wq_text\n    editions_section_title\n    editions_tab_anniversary_bundle\n    editions_tab_standard\n    editions_tab_deluxe\n    editions_section_bg_desktopConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    collectors_edition_bg_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    locale_supports_gradient_font\n    sticky_buy_nav {\n      buy_btn_text\n      dropdown_title\n      wq_logo_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      wq_logo_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      mobile_dropdown_label\n    }\n    sticky_nav_skus {\n      __typename\n      ... on NovaProductPageStickyNavSkusWqSku {\n        wq_sku {\n          label\n          sku_tag\n        }\n      }\n    }\n    section_blocks {\n      __typename\n      ... on NovaProductPageSectionBlocksSectionContent {\n        section_content {\n          section\n          section_class\n          section_bg_desktopConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          section_bg_mobileConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          img_above_headingConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          section_heading\n          primary_section_blurbs {\n            blurb_text\n            uses_special_font\n          }\n          clickable_thumbnails {\n            thumbnail_imgConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n            screenshot_imgConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n            img_caption\n            bottom_caption\n            video_id\n          }\n          image_and_text_blocks {\n            blurb\n            blurb_heading\n            thumbnail_imgConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n            screenshot_imgConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n            caption\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "d8cb6cab4d0c42792832eee66c893d78";
export default node;
