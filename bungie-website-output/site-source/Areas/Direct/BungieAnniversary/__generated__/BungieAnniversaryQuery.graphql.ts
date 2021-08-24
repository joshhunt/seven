/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BungieAnniversaryQueryVariables = {
  locale: string;
};
export type BungieAnniversaryQueryResponse = {
  readonly bungie_30th_anniversary: {
    readonly title: string | null;
    readonly meta_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly hero: {
      readonly hero_logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_logo_alt_text: string | null;
      readonly hero_bg_image_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly hero_bg_image_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly first_section: {
      readonly headline: string | null;
      readonly main_heading: string | null;
      readonly main_blurb: string | null;
      readonly secondary_heading: string | null;
      readonly secondary_blurb: string | null;
      readonly trailer_id: {
        readonly title: string | null;
        readonly href: string | null;
      } | null;
      readonly bungie_fist_logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_bottom_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_bottom_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_top_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_top_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly anniversary_pack_section: {
      readonly section_top_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_top_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly vintage_bungie_logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_heading: string | null;
      readonly text_image_group: ReadonlyArray<{
        readonly blurb_heading: string | null;
        readonly blurb_text: string | null;
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly screenshotConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
      readonly section_bottom_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly section_bottom_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly collection_section: {
      readonly headline: string | null;
      readonly section_heading: string | null;
      readonly section_blurb: string | null;
      readonly learn_more_btn: {
        readonly title: string | null;
        readonly href: string | null;
      } | null;
      readonly collection_carousel_slide: ReadonlyArray<{
        readonly slide_heading: string | null;
        readonly slide_imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
    } | null;
    readonly editions_section_title: string | null;
    readonly editions_section_bg_desktopConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly editions_section_bg_mobileConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly bundle_edition_tab: string | null;
    readonly pack_edition_tab: string | null;
    readonly media_section_small_title_one: string | null;
    readonly media_section_small_title_two: string | null;
  } | null;
};
export type BungieAnniversaryQuery = {
  readonly response: BungieAnniversaryQueryResponse;
  readonly variables: BungieAnniversaryQueryVariables;
};

/*
query BungieAnniversaryQuery(
  $locale: String!
) {
  bungie_30th_anniversary(uid: "blt31e725130b182abf", locale: $locale) {
    title
    meta_imageConnection {
      edges {
        node {
          url
        }
      }
    }
    hero {
      hero_logoConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_logo_alt_text
      hero_bg_image_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      hero_bg_image_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    first_section {
      headline
      main_heading
      main_blurb
      secondary_heading
      secondary_blurb
      trailer_id {
        title
        href
      }
      bungie_fist_logoConnection {
        edges {
          node {
            url
          }
        }
      }
      section_bottom_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      section_bottom_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      section_top_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      section_top_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    anniversary_pack_section {
      section_top_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      section_top_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      vintage_bungie_logoConnection {
        edges {
          node {
            url
          }
        }
      }
      section_heading
      text_image_group {
        blurb_heading
        blurb_text
        thumbnailConnection {
          edges {
            node {
              url
            }
          }
        }
        screenshotConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      section_bottom_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      section_bottom_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    collection_section {
      headline
      section_heading
      section_blurb
      learn_more_btn {
        title
        href
      }
      collection_carousel_slide {
        slide_heading
        slide_imageConnection {
          edges {
            node {
              url
            }
          }
        }
      }
    }
    editions_section_title
    editions_section_bg_desktopConnection {
      edges {
        node {
          url
        }
      }
    }
    editions_section_bg_mobileConnection {
      edges {
        node {
          url
        }
      }
    }
    bundle_edition_tab
    pack_edition_tab
    media_section_small_title_one
    media_section_small_title_two
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
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "title",
      storageKey: null,
    } as any,
    v2 = [
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
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "headline",
      storageKey: null,
    } as any,
    v4 = [
      v1 /*: any*/,
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "href",
        storageKey: null,
      } as any,
    ],
    v5 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_bottom_bg_desktopConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_bottom_bg_mobileConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_top_bg_desktopConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_top_bg_mobileConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_heading",
      storageKey: null,
    } as any,
    v10 = [
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
            value: "blt31e725130b182abf",
          },
        ],
        concreteType: "Bungie30thAnniversary",
        kind: "LinkedField",
        name: "bungie_30th_anniversary",
        plural: false,
        selections: [
          v1 /*: any*/,
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "meta_imageConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryHero",
            kind: "LinkedField",
            name: "hero",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_logoConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hero_logo_alt_text",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_image_desktopConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_image_mobileConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryFirstSection",
            kind: "LinkedField",
            name: "first_section",
            plural: false,
            selections: [
              v3 /*: any*/,
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "main_heading",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "main_blurb",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "secondary_heading",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "secondary_blurb",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "Link",
                kind: "LinkedField",
                name: "trailer_id",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bungie_fist_logoConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              v5 /*: any*/,
              v6 /*: any*/,
              v7 /*: any*/,
              v8 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryAnniversaryPackSection",
            kind: "LinkedField",
            name: "anniversary_pack_section",
            plural: false,
            selections: [
              v7 /*: any*/,
              v8 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "vintage_bungie_logoConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              v9 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryAnniversaryPackSectionTextImageGroup",
                kind: "LinkedField",
                name: "text_image_group",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "blurb_heading",
                    storageKey: null,
                  },
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
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "thumbnailConnection",
                    plural: false,
                    selections: v2 /*: any*/,
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "screenshotConnection",
                    plural: false,
                    selections: v2 /*: any*/,
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              v5 /*: any*/,
              v6 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryCollectionSection",
            kind: "LinkedField",
            name: "collection_section",
            plural: false,
            selections: [
              v3 /*: any*/,
              v9 /*: any*/,
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "section_blurb",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "Link",
                kind: "LinkedField",
                name: "learn_more_btn",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryCollectionSectionCollectionCarouselSlide",
                kind: "LinkedField",
                name: "collection_carousel_slide",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "slide_heading",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "slide_imageConnection",
                    plural: false,
                    selections: v2 /*: any*/,
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
            name: "editions_section_title",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "editions_section_bg_desktopConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "editions_section_bg_mobileConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "bundle_edition_tab",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "pack_edition_tab",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "media_section_small_title_one",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "media_section_small_title_two",
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
      name: "BungieAnniversaryQuery",
      selections: v10 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "BungieAnniversaryQuery",
      selections: v10 /*: any*/,
    },
    params: {
      cacheID: "705c966d4c8dc1223c94ccd0cdedf97b",
      id: null,
      metadata: {},
      name: "BungieAnniversaryQuery",
      operationKind: "query",
      text:
        'query BungieAnniversaryQuery(\n  $locale: String!\n) {\n  bungie_30th_anniversary(uid: "blt31e725130b182abf", locale: $locale) {\n    title\n    meta_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    hero {\n      hero_logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_logo_alt_text\n      hero_bg_image_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_bg_image_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    first_section {\n      headline\n      main_heading\n      main_blurb\n      secondary_heading\n      secondary_blurb\n      trailer_id {\n        title\n        href\n      }\n      bungie_fist_logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bottom_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bottom_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_top_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_top_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    anniversary_pack_section {\n      section_top_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_top_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      vintage_bungie_logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_heading\n      text_image_group {\n        blurb_heading\n        blurb_text\n        thumbnailConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        screenshotConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      section_bottom_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bottom_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    collection_section {\n      headline\n      section_heading\n      section_blurb\n      learn_more_btn {\n        title\n        href\n      }\n      collection_carousel_slide {\n        slide_heading\n        slide_imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n    }\n    editions_section_title\n    editions_section_bg_desktopConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    editions_section_bg_mobileConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    bundle_edition_tab\n    pack_edition_tab\n    media_section_small_title_one\n    media_section_small_title_two\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "d0404dc0c86f7680aad9610f7855114f";
export default node;
