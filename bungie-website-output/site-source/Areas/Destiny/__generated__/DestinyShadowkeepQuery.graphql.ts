/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type DestinyShadowkeepQueryVariables = {
  locale: string;
};
export type DestinyShadowkeepQueryResponse = {
  readonly shadowkeep_product_page: {
    readonly title: string | null;
    readonly meta_imgConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly hero: {
      readonly btn_title: string | null;
      readonly background: {
        readonly mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly subnav: {
      readonly btn_title: string | null;
      readonly labels: ReadonlyArray<{
        readonly label_id: string | null;
        readonly label: string | null;
      } | null> | null;
    } | null;
    readonly gear_section: {
      readonly section_bg: {
        readonly desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly small_title: string | null;
      readonly section_title: string | null;
      readonly info_blocks: ReadonlyArray<{
        readonly blurb: string | null;
        readonly heading: string | null;
        readonly imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly video_id: string | null;
      } | null> | null;
    } | null;
    readonly story_section: {
      readonly section_bg: {
        readonly desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly mobile_flames_bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly small_title: string | null;
      readonly section_title: string | null;
      readonly blurb: string | null;
      readonly thumbnailConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly thumbnail_blurb: string | null;
      readonly thumb_video_id: string | null;
      readonly thumbnail_heading: string | null;
    } | null;
    readonly endgame_section: {
      readonly section_bg: {
        readonly desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly eris_iconConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly small_title: string | null;
      readonly section_title: string | null;
      readonly info_blocks: ReadonlyArray<{
        readonly blurb: string | null;
        readonly heading: string | null;
        readonly imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly video_id: string | null;
      } | null> | null;
    } | null;
    readonly cta: {
      readonly section_bg: {
        readonly mobileConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly desktopConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      readonly btn_title: string | null;
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly media: {
      readonly screenshot: ReadonlyArray<{
        readonly screenshotConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
      readonly video: ReadonlyArray<{
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly video_id: string | null;
      } | null> | null;
      readonly wallpaper: ReadonlyArray<{
        readonly wallpaperConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};
export type DestinyShadowkeepQuery = {
  readonly response: DestinyShadowkeepQueryResponse;
  readonly variables: DestinyShadowkeepQueryVariables;
};

/*
query DestinyShadowkeepQuery(
  $locale: String!
) {
  shadowkeep_product_page(uid: "blt844464dc79de73b7", locale: $locale) {
    title
    meta_imgConnection {
      edges {
        node {
          url
        }
      }
    }
    hero {
      btn_title
      background {
        mobileConnection {
          edges {
            node {
              url
            }
          }
        }
        desktopConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    subnav {
      btn_title
      labels {
        label_id
        label
      }
    }
    gear_section {
      section_bg {
        desktopConnection {
          edges {
            node {
              url
            }
          }
        }
        mobileConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      small_title
      section_title
      info_blocks {
        blurb
        heading
        imageConnection {
          edges {
            node {
              url
            }
          }
        }
        video_id
      }
    }
    story_section {
      section_bg {
        desktopConnection {
          edges {
            node {
              url
            }
          }
        }
        mobileConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      mobile_flames_bgConnection {
        edges {
          node {
            url
          }
        }
      }
      small_title
      section_title
      blurb
      thumbnailConnection {
        edges {
          node {
            url
          }
        }
      }
      thumbnail_blurb
      thumb_video_id
      thumbnail_heading
    }
    endgame_section {
      section_bg {
        desktopConnection {
          edges {
            node {
              url
            }
          }
        }
        mobileConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      eris_iconConnection {
        edges {
          node {
            url
          }
        }
      }
      small_title
      section_title
      info_blocks {
        blurb
        heading
        imageConnection {
          edges {
            node {
              url
            }
          }
        }
        video_id
      }
    }
    cta {
      section_bg {
        mobileConnection {
          edges {
            node {
              url
            }
          }
        }
        desktopConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      btn_title
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    media {
      screenshot {
        screenshotConnection {
          edges {
            node {
              url
            }
          }
        }
        thumbnailConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      video {
        thumbnailConnection {
          edges {
            node {
              url
            }
          }
        }
        video_id
      }
      wallpaper {
        wallpaperConnection {
          edges {
            node {
              url
            }
          }
        }
        thumbnailConnection {
          edges {
            node {
              url
            }
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
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "btn_title",
      storageKey: null,
    } as any,
    v3 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "mobileConnection",
      plural: false,
      selections: v1 /*: any*/,
      storageKey: null,
    } as any,
    v4 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "desktopConnection",
      plural: false,
      selections: v1 /*: any*/,
      storageKey: null,
    } as any,
    v5 = [v3 /*: any*/, v4 /*: any*/],
    v6 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "logoConnection",
      plural: false,
      selections: v1 /*: any*/,
      storageKey: null,
    } as any,
    v7 = [v4 /*: any*/, v3 /*: any*/],
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "small_title",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_title",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "blurb",
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "video_id",
      storageKey: null,
    } as any,
    v12 = [
      v10 /*: any*/,
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "heading",
        storageKey: null,
      } as any,
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "imageConnection",
        plural: false,
        selections: v1 /*: any*/,
        storageKey: null,
      } as any,
      v11 /*: any*/,
    ],
    v13 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "thumbnailConnection",
      plural: false,
      selections: v1 /*: any*/,
      storageKey: null,
    } as any,
    v14 = [
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
            value: "blt844464dc79de73b7",
          },
        ],
        concreteType: "ShadowkeepProductPage",
        kind: "LinkedField",
        name: "shadowkeep_product_page",
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
            name: "meta_imgConnection",
            plural: false,
            selections: v1 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageHero",
            kind: "LinkedField",
            name: "hero",
            plural: false,
            selections: [
              v2 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageHeroBackground",
                kind: "LinkedField",
                name: "background",
                plural: false,
                selections: v5 /*: any*/,
                storageKey: null,
              },
              v6 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageSubnav",
            kind: "LinkedField",
            name: "subnav",
            plural: false,
            selections: [
              v2 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageSubnavLabels",
                kind: "LinkedField",
                name: "labels",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "label_id",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "label",
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
            concreteType: "ShadowkeepProductPageGearSection",
            kind: "LinkedField",
            name: "gear_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageGearSectionSectionBg",
                kind: "LinkedField",
                name: "section_bg",
                plural: false,
                selections: v7 /*: any*/,
                storageKey: null,
              },
              v8 /*: any*/,
              v9 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageGearSectionInfoBlocks",
                kind: "LinkedField",
                name: "info_blocks",
                plural: true,
                selections: v12 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageStorySection",
            kind: "LinkedField",
            name: "story_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageStorySectionSectionBg",
                kind: "LinkedField",
                name: "section_bg",
                plural: false,
                selections: v7 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "mobile_flames_bgConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              v8 /*: any*/,
              v9 /*: any*/,
              v10 /*: any*/,
              v13 /*: any*/,
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "thumbnail_blurb",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "thumb_video_id",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "thumbnail_heading",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageEndgameSection",
            kind: "LinkedField",
            name: "endgame_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageEndgameSectionSectionBg",
                kind: "LinkedField",
                name: "section_bg",
                plural: false,
                selections: v7 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "eris_iconConnection",
                plural: false,
                selections: v1 /*: any*/,
                storageKey: null,
              },
              v8 /*: any*/,
              v9 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageEndgameSectionInfoBlocks",
                kind: "LinkedField",
                name: "info_blocks",
                plural: true,
                selections: v12 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageCta",
            kind: "LinkedField",
            name: "cta",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageCtaSectionBg",
                kind: "LinkedField",
                name: "section_bg",
                plural: false,
                selections: v5 /*: any*/,
                storageKey: null,
              },
              v2 /*: any*/,
              v6 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "ShadowkeepProductPageMedia",
            kind: "LinkedField",
            name: "media",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageMediaScreenshot",
                kind: "LinkedField",
                name: "screenshot",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "screenshotConnection",
                    plural: false,
                    selections: v1 /*: any*/,
                    storageKey: null,
                  },
                  v13 /*: any*/,
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageMediaVideo",
                kind: "LinkedField",
                name: "video",
                plural: true,
                selections: [v13 /*: any*/, v11 /*: any*/],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "ShadowkeepProductPageMediaWallpaper",
                kind: "LinkedField",
                name: "wallpaper",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "wallpaperConnection",
                    plural: false,
                    selections: v1 /*: any*/,
                    storageKey: null,
                  },
                  v13 /*: any*/,
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
      name: "DestinyShadowkeepQuery",
      selections: v14 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "DestinyShadowkeepQuery",
      selections: v14 /*: any*/,
    },
    params: {
      cacheID: "5ba0ff96d9332f09e162d43ff3f14cbc",
      id: null,
      metadata: {},
      name: "DestinyShadowkeepQuery",
      operationKind: "query",
      text:
        'query DestinyShadowkeepQuery(\n  $locale: String!\n) {\n  shadowkeep_product_page(uid: "blt844464dc79de73b7", locale: $locale) {\n    title\n    meta_imgConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    hero {\n      btn_title\n      background {\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    subnav {\n      btn_title\n      labels {\n        label_id\n        label\n      }\n    }\n    gear_section {\n      section_bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      small_title\n      section_title\n      info_blocks {\n        blurb\n        heading\n        imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        video_id\n      }\n    }\n    story_section {\n      section_bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      mobile_flames_bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      small_title\n      section_title\n      blurb\n      thumbnailConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      thumbnail_blurb\n      thumb_video_id\n      thumbnail_heading\n    }\n    endgame_section {\n      section_bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      eris_iconConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      small_title\n      section_title\n      info_blocks {\n        blurb\n        heading\n        imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        video_id\n      }\n    }\n    cta {\n      section_bg {\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      btn_title\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    media {\n      screenshot {\n        screenshotConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        thumbnailConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      video {\n        thumbnailConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        video_id\n      }\n      wallpaper {\n        wallpaperConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        thumbnailConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "8df11d6be839d22bba43ad244569c598";
export default node;
