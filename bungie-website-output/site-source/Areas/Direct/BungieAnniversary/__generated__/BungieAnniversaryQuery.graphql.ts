/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BungieAnniversaryQueryVariables = {
  locale: string;
};
export type BungieAnniversaryQueryResponse = {
  readonly bungie_30th_anniversary_v2: {
    readonly title: string | null;
    readonly meta_imageConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly subnav_btn_text: string | null;
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
      readonly trailer_btn: {
        readonly title: string | null;
        readonly trailer_id: string | null;
      } | null;
      readonly buy_btn: {
        readonly title: string | null;
        readonly url: string | null;
      } | null;
      readonly availability_text: string | null;
    } | null;
    readonly dungeon_section: {
      readonly subnav_detail: {
        readonly subnav_label: string | null;
        readonly section_id: string | null;
      } | null;
      readonly small_title: string | null;
      readonly section_title: string | null;
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
      readonly main_blurb: string | null;
      readonly info_block: ReadonlyArray<{
        readonly imgConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly title: string | null;
        readonly blurb: string | null;
      } | null> | null;
    } | null;
    readonly bungie_logoConnection: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly url: string | null;
        } | null;
      } | null> | null;
    } | null;
    readonly requirement_headline: string | null;
    readonly gjallarhorn_section: {
      readonly subnav_detail: {
        readonly section_label: string | null;
        readonly section_id: string | null;
      } | null;
      readonly bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly gjallarhorn_logoConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly blurb: string | null;
      readonly weapon_imgConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly rewards_section: {
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
      readonly small_title: string | null;
      readonly section_title: string | null;
      readonly blurb: string | null;
      readonly text_image_group: ReadonlyArray<{
        readonly imgConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly blurb_heading: string | null;
        readonly blurb: string | null;
      } | null> | null;
    } | null;
    readonly free_to_play_section: {
      readonly subnav_detail: {
        readonly subnav_label: string | null;
        readonly section_id: string | null;
      } | null;
      readonly top_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly top_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly small_title: string | null;
      readonly section_title: string | null;
      readonly secondary_heading: string | null;
      readonly text_image_group: ReadonlyArray<{
        readonly imgConnection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly url: string | null;
            } | null;
          } | null> | null;
        } | null;
        readonly blurb_heading: string | null;
        readonly blurb: string | null;
      } | null> | null;
      readonly bottom_bg_desktopConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly bottom_bg_mobileConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
    readonly rewards_list_section: {
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
      readonly crestConnection: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly url: string | null;
          } | null;
        } | null> | null;
      } | null;
      readonly pack_owners_heading: string | null;
      readonly free_heading: string | null;
      readonly disclaimer: string | null;
      readonly rewards_table: {
        readonly reward_group: ReadonlyArray<{
          readonly group_name: string | null;
          readonly is_free: boolean | null;
          readonly rows: ReadonlyArray<{
            readonly reward_name: string | null;
            readonly is_free: boolean | null;
          } | null> | null;
        } | null> | null;
      } | null;
    } | null;
    readonly celebration_section: {
      readonly subnav_detail: {
        readonly subnav_label: string | null;
        readonly section_id: string | null;
      } | null;
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
      readonly trailer_id: string | null;
      readonly section_title: string | null;
      readonly blurb: string | null;
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
  bungie_30th_anniversary_v2(uid: "blt94f096071905697b", locale: $locale) {
    title
    meta_imageConnection {
      edges {
        node {
          url
        }
      }
    }
    subnav_btn_text
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
      trailer_btn {
        title
        trailer_id
      }
      buy_btn {
        title
        url
      }
      availability_text
    }
    dungeon_section {
      subnav_detail {
        subnav_label
        section_id
      }
      small_title
      section_title
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
      main_blurb
      info_block {
        imgConnection {
          edges {
            node {
              url
            }
          }
        }
        title
        blurb
      }
    }
    bungie_logoConnection {
      edges {
        node {
          url
        }
      }
    }
    requirement_headline
    gjallarhorn_section {
      subnav_detail {
        section_label
        section_id
      }
      bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      gjallarhorn_logoConnection {
        edges {
          node {
            url
          }
        }
      }
      blurb
      weapon_imgConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    rewards_section {
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
      small_title
      section_title
      blurb
      text_image_group {
        imgConnection {
          edges {
            node {
              url
            }
          }
        }
        blurb_heading
        blurb
      }
    }
    free_to_play_section {
      subnav_detail {
        subnav_label
        section_id
      }
      top_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      top_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
      small_title
      section_title
      secondary_heading
      text_image_group {
        imgConnection {
          edges {
            node {
              url
            }
          }
        }
        blurb_heading
        blurb
      }
      bottom_bg_desktopConnection {
        edges {
          node {
            url
          }
        }
      }
      bottom_bg_mobileConnection {
        edges {
          node {
            url
          }
        }
      }
    }
    rewards_list_section {
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
      crestConnection {
        edges {
          node {
            url
          }
        }
      }
      pack_owners_heading
      free_heading
      disclaimer
      rewards_table {
        reward_group {
          group_name
          is_free
          rows {
            reward_name
            is_free
          }
        }
      }
    }
    celebration_section {
      subnav_detail {
        subnav_label
        section_id
      }
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
      trailer_id
      section_title
      blurb
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
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
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
            selections: [v2 /*: any*/],
            storageKey: null,
          },
        ],
        storageKey: null,
      } as any,
    ],
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "trailer_id",
      storageKey: null,
    } as any,
    v5 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "section_id",
      storageKey: null,
    } as any,
    v6 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "subnav_label",
        storageKey: null,
      } as any,
      v5 /*: any*/,
    ],
    v7 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "small_title",
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
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_bg_desktopConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v10 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "section_bg_mobileConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v11 = {
      alias: null,
      args: null,
      concreteType: "SysAssetConnection",
      kind: "LinkedField",
      name: "imgConnection",
      plural: false,
      selections: v3 /*: any*/,
      storageKey: null,
    } as any,
    v12 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "blurb",
      storageKey: null,
    } as any,
    v13 = [
      v11 /*: any*/,
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "blurb_heading",
        storageKey: null,
      } as any,
      v12 /*: any*/,
    ],
    v14 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "is_free",
      storageKey: null,
    } as any,
    v15 = [
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
            value: "blt94f096071905697b",
          },
        ],
        concreteType: "Bungie30thAnniversaryV2",
        kind: "LinkedField",
        name: "bungie_30th_anniversary_v2",
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
            selections: v3 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "subnav_btn_text",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2Hero",
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
                selections: v3 /*: any*/,
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
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "hero_bg_image_mobileConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "Bungie30thAnniversaryV2HeroTrailerBtn",
                kind: "LinkedField",
                name: "trailer_btn",
                plural: false,
                selections: [v1 /*: any*/, v4 /*: any*/],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "Bungie30thAnniversaryV2HeroBuyBtn",
                kind: "LinkedField",
                name: "buy_btn",
                plural: false,
                selections: [v1 /*: any*/, v2 /*: any*/],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "availability_text",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2DungeonSection",
            kind: "LinkedField",
            name: "dungeon_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2DungeonSectionSubnavDetail",
                kind: "LinkedField",
                name: "subnav_detail",
                plural: false,
                selections: v6 /*: any*/,
                storageKey: null,
              },
              v7 /*: any*/,
              v8 /*: any*/,
              v9 /*: any*/,
              v10 /*: any*/,
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
                concreteType: "Bungie30thAnniversaryV2DungeonSectionInfoBlock",
                kind: "LinkedField",
                name: "info_block",
                plural: true,
                selections: [v11 /*: any*/, v1 /*: any*/, v12 /*: any*/],
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "bungie_logoConnection",
            plural: false,
            selections: v3 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "requirement_headline",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2GjallarhornSection",
            kind: "LinkedField",
            name: "gjallarhorn_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2GjallarhornSectionSubnavDetail",
                kind: "LinkedField",
                name: "subnav_detail",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "section_label",
                    storageKey: null,
                  },
                  v5 /*: any*/,
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bg_desktopConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bg_mobileConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "gjallarhorn_logoConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              v12 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "weapon_imgConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2RewardsSection",
            kind: "LinkedField",
            name: "rewards_section",
            plural: false,
            selections: [
              v9 /*: any*/,
              v10 /*: any*/,
              v7 /*: any*/,
              v8 /*: any*/,
              v12 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2RewardsSectionTextImageGroup",
                kind: "LinkedField",
                name: "text_image_group",
                plural: true,
                selections: v13 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2FreeToPlaySection",
            kind: "LinkedField",
            name: "free_to_play_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2FreeToPlaySectionSubnavDetail",
                kind: "LinkedField",
                name: "subnav_detail",
                plural: false,
                selections: v6 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "top_bg_desktopConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "top_bg_mobileConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              v7 /*: any*/,
              v8 /*: any*/,
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
                concreteType:
                  "Bungie30thAnniversaryV2FreeToPlaySectionTextImageGroup",
                kind: "LinkedField",
                name: "text_image_group",
                plural: true,
                selections: v13 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bottom_bg_desktopConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "bottom_bg_mobileConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2RewardsListSection",
            kind: "LinkedField",
            name: "rewards_list_section",
            plural: false,
            selections: [
              v9 /*: any*/,
              v10 /*: any*/,
              {
                alias: null,
                args: null,
                concreteType: "SysAssetConnection",
                kind: "LinkedField",
                name: "crestConnection",
                plural: false,
                selections: v3 /*: any*/,
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "pack_owners_heading",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "free_heading",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "disclaimer",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2RewardsListSectionRewardsTable",
                kind: "LinkedField",
                name: "rewards_table",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType:
                      "Bungie30thAnniversaryV2RewardsListSectionRewardsTableRewardGroup",
                    kind: "LinkedField",
                    name: "reward_group",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "group_name",
                        storageKey: null,
                      },
                      v14 /*: any*/,
                      {
                        alias: null,
                        args: null,
                        concreteType:
                          "Bungie30thAnniversaryV2RewardsListSectionRewardsTableRewardGroupRows",
                        kind: "LinkedField",
                        name: "rows",
                        plural: true,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "reward_name",
                            storageKey: null,
                          },
                          v14 /*: any*/,
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
          {
            alias: null,
            args: null,
            concreteType: "Bungie30thAnniversaryV2CelebrationSection",
            kind: "LinkedField",
            name: "celebration_section",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType:
                  "Bungie30thAnniversaryV2CelebrationSectionSubnavDetail",
                kind: "LinkedField",
                name: "subnav_detail",
                plural: false,
                selections: v6 /*: any*/,
                storageKey: null,
              },
              v9 /*: any*/,
              v10 /*: any*/,
              v4 /*: any*/,
              v8 /*: any*/,
              v12 /*: any*/,
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
            selections: v3 /*: any*/,
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "SysAssetConnection",
            kind: "LinkedField",
            name: "editions_section_bg_mobileConnection",
            plural: false,
            selections: v3 /*: any*/,
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
      selections: v15 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "BungieAnniversaryQuery",
      selections: v15 /*: any*/,
    },
    params: {
      cacheID: "fc6ec66f92ecd7f9101cfd20e764ff9a",
      id: null,
      metadata: {},
      name: "BungieAnniversaryQuery",
      operationKind: "query",
      text:
        'query BungieAnniversaryQuery(\n  $locale: String!\n) {\n  bungie_30th_anniversary_v2(uid: "blt94f096071905697b", locale: $locale) {\n    title\n    meta_imageConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    subnav_btn_text\n    hero {\n      hero_logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_logo_alt_text\n      hero_bg_image_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      hero_bg_image_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      trailer_btn {\n        title\n        trailer_id\n      }\n      buy_btn {\n        title\n        url\n      }\n      availability_text\n    }\n    dungeon_section {\n      subnav_detail {\n        subnav_label\n        section_id\n      }\n      small_title\n      section_title\n      section_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      main_blurb\n      info_block {\n        imgConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        title\n        blurb\n      }\n    }\n    bungie_logoConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    requirement_headline\n    gjallarhorn_section {\n      subnav_detail {\n        section_label\n        section_id\n      }\n      bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      gjallarhorn_logoConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      blurb\n      weapon_imgConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    rewards_section {\n      section_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      small_title\n      section_title\n      blurb\n      text_image_group {\n        imgConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        blurb_heading\n        blurb\n      }\n    }\n    free_to_play_section {\n      subnav_detail {\n        subnav_label\n        section_id\n      }\n      top_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      top_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      small_title\n      section_title\n      secondary_heading\n      text_image_group {\n        imgConnection {\n          edges {\n            node {\n              url\n            }\n          }\n        }\n        blurb_heading\n        blurb\n      }\n      bottom_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      bottom_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n    }\n    rewards_list_section {\n      section_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      crestConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      pack_owners_heading\n      free_heading\n      disclaimer\n      rewards_table {\n        reward_group {\n          group_name\n          is_free\n          rows {\n            reward_name\n            is_free\n          }\n        }\n      }\n    }\n    celebration_section {\n      subnav_detail {\n        subnav_label\n        section_id\n      }\n      section_bg_desktopConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      section_bg_mobileConnection {\n        edges {\n          node {\n            url\n          }\n        }\n      }\n      trailer_id\n      section_title\n      blurb\n    }\n    editions_section_title\n    editions_section_bg_desktopConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    editions_section_bg_mobileConnection {\n      edges {\n        node {\n          url\n        }\n      }\n    }\n    bundle_edition_tab\n    pack_edition_tab\n    media_section_small_title_one\n    media_section_small_title_two\n  }\n}\n',
    },
  } as any;
})();
(node as any).hash = "c5a25b5c499466275f7348722a4f2ee0";
export default node;
