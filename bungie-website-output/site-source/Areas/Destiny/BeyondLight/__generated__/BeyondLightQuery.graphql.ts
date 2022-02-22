/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BeyondLightQueryVariables = {
  locale: string;
};
export type BeyondLightQueryResponse = {
  readonly beyond_light: {
    readonly title: string | null;
    readonly meta_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly subnav: {
      readonly btn_text: string | null;
      readonly labels: ReadonlyArray<{
        readonly label: string | null;
        readonly label_id: string | null;
      } | null> | null;
    } | null;
    readonly hero: {
      readonly background: {
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
      readonly buy_btn: {
        readonly btn_title: string | null;
        readonly btn_url: string | null;
      } | null;
      readonly trailer_btn: {
        readonly btn_title: string | null;
        readonly video_id: string | null;
      } | null;
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly interactive_section: {
      readonly header: {
        readonly backgroundConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly heading: string | null;
      } | null;
      readonly interactive_guardian: ReadonlyArray<{
        readonly modal_body: string | null;
        readonly modal_eyebrow: string | null;
        readonly modal_first_caption: string | null;
        readonly modal_first_subheading: string | null;
        readonly modal_second_caption: string | null;
        readonly modal_second_subheading: string | null;
        readonly modal_title: string | null;
        readonly subtitle: string | null;
        readonly title: string | null;
      } | null> | null;
      readonly mobile_accordion: ReadonlyArray<{
        readonly caption_one: string | null;
        readonly caption_two: string | null;
        readonly eyebrow: string | null;
        readonly subheading_one: string | null;
        readonly subheading_two: string | null;
        readonly summary: string | null;
        readonly title: string | null;
      } | null> | null;
    } | null;
    readonly sections: ReadonlyArray<{
      readonly page_section?: {
        readonly background: {
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
        readonly section_id: string | null;
        readonly blurb: string | null;
        readonly section_title: string | null;
        readonly small_title: string | null;
        readonly info_blocks: ReadonlyArray<{
          readonly image_text_info_block?: {
            readonly blurb: string | null;
            readonly heading: string | null;
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
            readonly video_id: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null> | null;
    readonly cta: {
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly btn_text: string | null;
      readonly background: {
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
    } | null;
    readonly media: ReadonlyArray<{
      readonly screenshot?: {
        readonly imageConnection: {
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
      } | null;
      readonly video?: {
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly video_id: string | null;
      } | null;
      readonly wallpaper?: {
        readonly thumbnailConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly wallpaperConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};
export type BeyondLightQuery = {
  readonly response: BeyondLightQueryResponse;
  readonly variables: BeyondLightQueryVariables;
};

/*
query BeyondLightQuery(
  $locale: String!
) {
  beyond_light(uid: "bltfb9ac20b6ec799ea", locale: $locale) {
    title
    meta_imageConnection {
      edges {
        node {
          url
        }
      }
    }
    subnav {
      btn_text
      labels {
        label
        label_id
      }
    }
    hero {
      background {
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
      buy_btn {
        btn_title
        btn_url
      }
      trailer_btn {
        btn_title
        video_id
      }
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    interactive_section {
      header {
        backgroundConnection {
          edges {
            node {
              url
            }
          }
        }
        heading
      }
      interactive_guardian {
        modal_body
        modal_eyebrow
        modal_first_caption
        modal_first_subheading
        modal_second_caption
        modal_second_subheading
        modal_title
        subtitle
        title
      }
      mobile_accordion {
        caption_one
        caption_two
        eyebrow
        subheading_one
        subheading_two
        summary
        title
      }
    }
    sections {
      __typename
      ... on BeyondLightSectionsPageSection {
        page_section {
          background {
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
          section_id
          blurb
          section_title
          small_title
          info_blocks {
            __typename
            ... on BeyondLightSectionsPageSectionBlockInfoBlocksImageTextInfoBlock {
              image_text_info_block {
                blurb
                heading
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
                video_id
              }
            }
          }
        }
      }
    }
    cta {
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
      btn_text
      background {
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
    }
    media {
      __typename
      ... on BeyondLightMediaScreenshot {
        screenshot {
          imageConnection {
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
      ... on BeyondLightMediaVideo {
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
      }
      ... on BeyondLightMediaWallpaper {
        wallpaper {
          thumbnailConnection {
            edges {
              node {
                url
              }
            }
          }
          wallpaperConnection {
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
        value: "bltfb9ac20b6ec799ea",
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
      kind: "ScalarField",
      name: "btn_text",
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      concreteType: "BeyondLightSubnav",
      kind: "LinkedField",
      name: "subnav",
      plural: false,
      selections: [
        v5 /*: any*/,
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightSubnavLabels",
          kind: "LinkedField",
          name: "labels",
          plural: true,
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
              name: "label_id",
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v7 = [
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "desktopConnection",
        plural: false,
        selections: v3 /*: any*/,
        storageKey: null,
      } as any,
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "mobileConnection",
        plural: false,
        selections: v3 /*: any*/,
        storageKey: null,
      } as any,
    ],
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "btn_title",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "video_id",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "logoConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      concreteType: "BeyondLightHero",
      kind: "LinkedField",
      name: "hero",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightHeroBackground",
          kind: "LinkedField",
          name: "background",
          plural: false,
          selections: v7 /*: any*/,
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightHeroBuyBtn",
          kind: "LinkedField",
          name: "buy_btn",
          plural: false,
          selections: [
            v8 /*: any*/,
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "btn_url",
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightHeroTrailerBtn",
          kind: "LinkedField",
          name: "trailer_btn",
          plural: false,
          selections: [v8 /*: any*/, v9 /*: any*/],
          storageKey: null,
        },
        v10 /*: any*/,
      ],
      storageKey: null,
    } as any,
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "heading",
      storageKey: null,
    } as any,
    v13 = {
      alias: null,
      args: null,
      concreteType: "BeyondLightInteractiveSection",
      kind: "LinkedField",
      name: "interactive_section",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightInteractiveSectionHeader",
          kind: "LinkedField",
          name: "header",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "backgroundConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            v12 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightInteractiveSectionInteractiveGuardian",
          kind: "LinkedField",
          name: "interactive_guardian",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_body",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_eyebrow",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_first_caption",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_first_subheading",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_second_caption",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_second_subheading",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "modal_title",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "subtitle",
              storageKey: null,
            },
            v2 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightInteractiveSectionMobileAccordion",
          kind: "LinkedField",
          name: "mobile_accordion",
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "caption_one",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "caption_two",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "eyebrow",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "subheading_one",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "subheading_two",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "summary",
              storageKey: null,
            },
            v2 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v14 = {
      alias: null,
      args: null,
      concreteType: "BeyondLightSectionsPageSectionBlockBackground",
      kind: "LinkedField",
      name: "background",
      plural: false,
      selections: v7 /*: any*/,
      storageKey: null,
    } as any,
    v15 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_id",
      storageKey: null,
    } as any,
    v16 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "blurb",
      storageKey: null,
    } as any,
    v17 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_title",
      storageKey: null,
    } as any,
    v18 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "small_title",
      storageKey: null,
    } as any,
    v19 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "thumbnailConnection",
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
          concreteType:
            "BeyondLightSectionsPageSectionBlockInfoBlocksImageTextInfoBlockBlock",
          kind: "LinkedField",
          name: "image_text_info_block",
          plural: false,
          selections: [
            v16 /*: any*/,
            v12 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "screenshotConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            v19 /*: any*/,
            v9 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      type: "BeyondLightSectionsPageSectionBlockInfoBlocksImageTextInfoBlock",
      abstractKey: null,
    } as any,
    v21 = {
      alias: null,
      args: null,
      concreteType: "BeyondLightCta",
      kind: "LinkedField",
      name: "cta",
      plural: false,
      selections: [
        v10 /*: any*/,
        v5 /*: any*/,
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightCtaBackground",
          kind: "LinkedField",
          name: "background",
          plural: false,
          selections: v7 /*: any*/,
          storageKey: null,
        },
      ],
      storageKey: null,
    } as any,
    v22 = {
      kind: "InlineFragment",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightMediaScreenshotBlock",
          kind: "LinkedField",
          name: "screenshot",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "imageConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            v19 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      type: "BeyondLightMediaScreenshot",
      abstractKey: null,
    } as any,
    v23 = {
      kind: "InlineFragment",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightMediaVideoBlock",
          kind: "LinkedField",
          name: "video",
          plural: false,
          selections: [v19 /*: any*/, v9 /*: any*/],
          storageKey: null,
        },
      ],
      type: "BeyondLightMediaVideo",
      abstractKey: null,
    } as any,
    v24 = {
      kind: "InlineFragment",
      selections: [
        {
          alias: null,
          args: null,
          concreteType: "BeyondLightMediaWallpaperBlock",
          kind: "LinkedField",
          name: "wallpaper",
          plural: false,
          selections: [
            v19 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: "SysAssetConnection",
              kind: "LinkedField",
              name: "wallpaperConnection",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: "BeyondLightMediaWallpaper",
      abstractKey: null,
    } as any,
    v25 = {
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
      name: "BeyondLightQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "BeyondLight",
          kind: "LinkedField",
          name: "beyond_light",
          plural: false,
          selections: [
            v2 /*: any*/,
            v4 /*: any*/,
            v6 /*: any*/,
            v11 /*: any*/,
            v13 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "sections",
              plural: true,
              selections: [
                {
                  kind: "InlineFragment",
                  selections: [
                    {
                      alias: null,
                      args: null,
                      concreteType: "BeyondLightSectionsPageSectionBlock",
                      kind: "LinkedField",
                      name: "page_section",
                      plural: false,
                      selections: [
                        v14 /*: any*/,
                        v15 /*: any*/,
                        v16 /*: any*/,
                        v17 /*: any*/,
                        v18 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          concreteType: null,
                          kind: "LinkedField",
                          name: "info_blocks",
                          plural: true,
                          selections: [v20 /*: any*/],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                  ],
                  type: "BeyondLightSectionsPageSection",
                  abstractKey: null,
                },
              ],
              storageKey: null,
            },
            v21 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "media",
              plural: true,
              selections: [v22 /*: any*/, v23 /*: any*/, v24 /*: any*/],
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
      name: "BeyondLightQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "BeyondLight",
          kind: "LinkedField",
          name: "beyond_light",
          plural: false,
          selections: [
            v2 /*: any*/,
            v4 /*: any*/,
            v6 /*: any*/,
            v11 /*: any*/,
            v13 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "sections",
              plural: true,
              selections: [
                v25 /*: any*/,
                {
                  kind: "InlineFragment",
                  selections: [
                    {
                      alias: null,
                      args: null,
                      concreteType: "BeyondLightSectionsPageSectionBlock",
                      kind: "LinkedField",
                      name: "page_section",
                      plural: false,
                      selections: [
                        v14 /*: any*/,
                        v15 /*: any*/,
                        v16 /*: any*/,
                        v17 /*: any*/,
                        v18 /*: any*/,
                        {
                          alias: null,
                          args: null,
                          concreteType: null,
                          kind: "LinkedField",
                          name: "info_blocks",
                          plural: true,
                          selections: [v25 /*: any*/, v20 /*: any*/],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                  ],
                  type: "BeyondLightSectionsPageSection",
                  abstractKey: null,
                },
              ],
              storageKey: null,
            },
            v21 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: null,
              kind: "LinkedField",
              name: "media",
              plural: true,
              selections: [
                v25 /*: any*/,
                v22 /*: any*/,
                v23 /*: any*/,
                v24 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: "26d9627eabd7765474f4f8f2d6f306cd",
      id: null,
      metadata: {},
      name: "BeyondLightQuery",
      operationKind: "query",
      text:
        'query BeyondLightQuery(\n  $locale: String!\n) {\n  beyond_light(uid: "bltfb9ac20b6ec799ea", locale: $locale) {\n    title\n    meta_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    subnav {\n      btn_text\n      labels {\n        label\n        label_id\n      }\n    }\n    hero {\n      background {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      buy_btn {\n        btn_title\n        btn_url\n      }\n      trailer_btn {\n        btn_title\n        video_id\n      }\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    interactive_section {\n      header {\n        backgroundConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        heading\n      }\n      interactive_guardian {\n        modal_body\n        modal_eyebrow\n        modal_first_caption\n        modal_first_subheading\n        modal_second_caption\n        modal_second_subheading\n        modal_title\n        subtitle\n        title\n      }\n      mobile_accordion {\n        caption_one\n        caption_two\n        eyebrow\n        subheading_one\n        subheading_two\n        summary\n        title\n      }\n    }\n    sections {\n      __typename\n      ... on BeyondLightSectionsPageSection {\n        page_section {\n          background {\n            desktopConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n            mobileConnection {\n              edges {\n                node {\n                  url\n                }\n              }\n            }\n          }\n          section_id\n          blurb\n          section_title\n          small_title\n          info_blocks {\n            __typename\n            ... on BeyondLightSectionsPageSectionBlockInfoBlocksImageTextInfoBlock {\n              image_text_info_block {\n                blurb\n                heading\n                screenshotConnection {\n                  edges {\n                    node {\n                      url\n                    }\n                  }\n                }\n                thumbnailConnection {\n                  edges {\n                    node {\n                      url\n                    }\n                  }\n                }\n                video_id\n              }\n            }\n          }\n        }\n      }\n    }\n    cta {\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      btn_text\n      background {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n    }\n    media {\n      __typename\n      ... on BeyondLightMediaScreenshot {\n        screenshot {\n          imageConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          thumbnailConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n        }\n      }\n      ... on BeyondLightMediaVideo {\n        video {\n          thumbnailConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          video_id\n        }\n      }\n      ... on BeyondLightMediaWallpaper {\n        wallpaper {\n          thumbnailConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n          wallpaperConnection {\n            edges {\n              node {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "8d1c8e41e8f714fd5aa8418698cf565b";
export default node;
