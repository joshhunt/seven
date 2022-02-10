/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type FreeToPlayQueryVariables = {
  locale: string;
};
export type FreeToPlayQueryResponse = {
  readonly free_to_play_product_page: {
    readonly title: string | null;
    readonly meta_imgConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly section_dividerConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly platform_imagesConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly star_bgConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly sub_nav: {
      readonly btn_text: string | null;
      readonly labels: ReadonlyArray<{
        readonly label: string | null;
        readonly label_id: string | null;
      } | null> | null;
    } | null;
    readonly hero: {
      readonly bg: {
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
      readonly btn_text: string | null;
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly story_section: {
      readonly bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly bottom_text: string | null;
      readonly info_thumb: ReadonlyArray<{
        readonly blurb: string | null;
        readonly heading: string | null;
        readonly imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
      readonly section_title: string | null;
      readonly small_title: string | null;
    } | null;
    readonly heroes_cta_section: {
      readonly btn_text: string | null;
      readonly logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly text_gradient_bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly logo_bgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly subtitle: string | null;
      readonly title: string | null;
    } | null;
    readonly guardians_section: {
      readonly small_title: string | null;
      readonly blurb: string | null;
      readonly bg: {
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
      readonly section_title: string | null;
      readonly guardians: ReadonlyArray<{
        readonly blurb: string | null;
        readonly imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly mobile_imageConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly logoConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly title: string | null;
      } | null> | null;
    } | null;
    readonly supers_section: {
      readonly bg: {
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
      readonly blurb: string | null;
      readonly section_title: string | null;
      readonly thumbnail_imagesConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly gear_section: {
      readonly section_title: string | null;
      readonly blurb: string | null;
      readonly thumbnail_imagesConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly bottom_cta: {
      readonly bg: {
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
      readonly btn_text: string | null;
      readonly title: string | null;
    } | null;
    readonly guide_section: {
      readonly bg: {
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
      readonly blurb: string | null;
      readonly section_title: string | null;
    } | null;
  } | null;
};
export type FreeToPlayQuery = {
  readonly response: FreeToPlayQueryResponse;
  readonly variables: FreeToPlayQueryVariables;
};

/*
query FreeToPlayQuery(
  $locale: String!
) {
  free_to_play_product_page(uid: "blt95d601ea2e2125c0", locale: $locale) {
    title
    meta_imgConnection {
      edges {
        node {
          url
        }
      }
    }
    section_dividerConnection {
      edges {
        node {
          url
        }
      }
    }
    platform_imagesConnection {
      edges {
        node {
          url
        }
      }
    }
    star_bgConnection {
      edges {
        node {
          url
        }
      }
    }
    sub_nav {
      btn_text
      labels {
        label
        label_id
      }
    }
    hero {
      bg {
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
      btn_text
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    story_section {
      bgConnection {
        edges {
          node {
            url
          }
        }
      }
      bottom_text
      info_thumb {
        blurb
        heading
        imageConnection {
          edges {
            node {
              url
            }
          }
        }
      }
      section_title
      small_title
    }
    heroes_cta_section {
      btn_text
      logoConnection {
        edges {
          node {
            url
          }
        }
      }
      text_gradient_bgConnection {
        edges {
          node {
            url
          }
        }
      }
      logo_bgConnection {
        edges {
          node {
            url
          }
        }
      }
      subtitle
      title
    }
    guardians_section {
      small_title
      blurb
      bg {
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
      section_title
      guardians {
        blurb
        imageConnection {
          edges {
            node {
              url
            }
          }
        }
        mobile_imageConnection {
          edges {
            node {
              url
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
        title
      }
    }
    supers_section {
      bg {
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
      blurb
      section_title
      thumbnail_imagesConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    gear_section {
      section_title
      blurb
      thumbnail_imagesConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    bottom_cta {
      bg {
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
      btn_text
      title
    }
    guide_section {
      bg {
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
      blurb
      section_title
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
      name: "btn_text",
      storageKey: null,
    } as any,
    v4 = [
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "desktopConnection",
        plural: false,
        selections: v2 /*: any*/,
        storageKey: null,
      } as any,
      {
        alias: null,
        args: null,
        concreteType: "SysAssetConnection",
        kind: "LinkedField",
        name: "mobileConnection",
        plural: false,
        selections: v2 /*: any*/,
        storageKey: null,
      } as any,
    ],
    v5 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "logoConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v6 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "blurb",
      storageKey: null,
    } as any,
    v7 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "imageConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v8 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_title",
      storageKey: null,
    } as any,
    v9 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "small_title",
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "thumbnail_imagesConnection",
      plural: false,
      selections: v2 /*: any*/,
      storageKey: null,
    } as any,
    v11 = [
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
            value: "blt95d601ea2e2125c0",
          },
        ],
        concreteType: "FreeToPlayProductPage",
        kind: "LinkedField",
        name: "free_to_play_product_page",
        plural: false,
        selections: [
          v1 /*: any*/,
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "meta_imgConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "section_dividerConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "platform_imagesConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "star_bgConnection",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageSubNav",
            kind: "LinkedField",
            name: "sub_nav",
            plural: false,
            selections: [
              v3 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageSubNavLabels",
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
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageHero",
            kind: "LinkedField",
            name: "hero",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageHeroBg",
                kind: "LinkedField",
                name: "bg",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              v3 /*: any*/,
              v5 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageStorySection",
            kind: "LinkedField",
            name: "story_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bgConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "bottom_text",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageStorySectionInfoThumb",
                kind: "LinkedField",
                name: "info_thumb",
                plural: true,
                selections: [
                  v6 /*: any*/,
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "heading",
                    storageKey: null,
                  },
                  v7 /*: any*/,
                ],
                storageKey: null,
              },
              v8 /*: any*/,
              v9 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageHeroesCtaSection",
            kind: "LinkedField",
            name: "heroes_cta_section",
            plural: false,
            selections: [
              v3 /*: any*/,
              v5 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "text_gradient_bgConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "logo_bgConnection",
                plural: false,
                selections: v2 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "subtitle",
                storageKey: null,
              },
              v1 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageGuardiansSection",
            kind: "LinkedField",
            name: "guardians_section",
            plural: false,
            selections: [
              v9 /*: any*/,
              v6 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageGuardiansSectionBg",
                kind: "LinkedField",
                name: "bg",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              v8 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageGuardiansSectionGuardians",
                kind: "LinkedField",
                name: "guardians",
                plural: true,
                selections: [
                  v6 /*: any*/,
                  v7 /*: any*/,
                  {
                    alias: null,
                    args: null,
                    concreteType: "SysAssetConnection",
                    kind: "LinkedField",
                    name: "mobile_imageConnection",
                    plural: false,
                    selections: v2 /*: any*/,
                    storageKey: null,
                  },
                  v5 /*: any*/,
                  v1 /*: any*/,
                ],
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageSupersSection",
            kind: "LinkedField",
            name: "supers_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageSupersSectionBg",
                kind: "LinkedField",
                name: "bg",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              v6 /*: any*/,
              v8 /*: any*/,
              v10 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageGearSection",
            kind: "LinkedField",
            name: "gear_section",
            plural: false,
            selections: [v8 /*: any*/, v6 /*: any*/, v10 /*: any*/],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageBottomCta",
            kind: "LinkedField",
            name: "bottom_cta",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageBottomCtaBg",
                kind: "LinkedField",
                name: "bg",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              v3 /*: any*/,
              v1 /*: any*/,
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "FreeToPlayProductPageGuideSection",
            kind: "LinkedField",
            name: "guide_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "FreeToPlayProductPageGuideSectionBg",
                kind: "LinkedField",
                name: "bg",
                plural: false,
                selections: v4 /*: any*/,
                storageKey: null,
              },
              v6 /*: any*/,
              v8 /*: any*/,
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
      name: "FreeToPlayQuery",
      selections: v11 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "FreeToPlayQuery",
      selections: v11 /*: any*/,
    },
    params: {
      cacheID: "f2bb0a7079f64e585f036f64c7fb44e7",
      id: null,
      metadata: {},
      name: "FreeToPlayQuery",
      operationKind: "query",
      text:
        'query FreeToPlayQuery(\n  $locale: String!\n) {\n  free_to_play_product_page(uid: "blt95d601ea2e2125c0", locale: $locale) {\n    title\n    meta_imgConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    section_dividerConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    platform_imagesConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    star_bgConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    sub_nav {\n      btn_text\n      labels {\n        label\n        label_id\n      }\n    }\n    hero {\n      bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      btn_text\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    story_section {\n      bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      bottom_text\n      info_thumb {\n        blurb\n        heading\n        imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      section_title\n      small_title\n    }\n    heroes_cta_section {\n      btn_text\n      logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      text_gradient_bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      logo_bgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      subtitle\n      title\n    }\n    guardians_section {\n      small_title\n      blurb\n      bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      section_title\n      guardians {\n        blurb\n        imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobile_imageConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        logoConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        title\n      }\n    }\n    supers_section {\n      bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      blurb\n      section_title\n      thumbnail_imagesConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    gear_section {\n      section_title\n      blurb\n      thumbnail_imagesConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    bottom_cta {\n      bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      btn_text\n      title\n    }\n    guide_section {\n      bg {\n        desktopConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        mobileConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n      }\n      blurb\n      section_title\n    }\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "879f7e3c302121f837227f393a596c56";
export default node;
