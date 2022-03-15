// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayQuery } from "@Areas/Destiny/FreeToPlay/__generated__/FreeToPlayQuery.graphql";
import { FreeHero } from "@Areas/Destiny/FreeToPlay/Components/FreeHero/FreeHero";
import { FreeSection } from "@Areas/Destiny/FreeToPlay/Components/FreeSection/FreeSection";
import { FreeTripleImageSet } from "@Areas/Destiny/FreeToPlay/Components/FreeTripleImageSet/FreeTripleImageSet";
import { ThreeGuardiansGraphic } from "@Areas/Destiny/FreeToPlay/Components/ThreeGuardiansGraphic/ThreeGuardiansGraphic";
import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import {
  BasicImageConnection,
  imageFromConnection,
} from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./FreeToPlay.module.scss";

interface FreeToPlayProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const FreeToPlay: React.FC<FreeToPlayProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const [wrapperRef, setWrapperRef] = useState(null);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<FreeToPlayQuery>(
    graphql`
      query FreeToPlayQuery($locale: String!) {
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
              ... on FreeToPlayProductPageSubNavLabels {
                label
                label_id
              }
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
              ... on FreeToPlayProductPageStorySectionInfoThumb {
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
              ... on FreeToPlayProductPageGuardiansSectionGuardians {
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
    `,
    { locale }
  );

  const {
    title,
    hero,
    bottom_cta,
    gear_section,
    guardians_section,
    guide_section,
    heroes_cta_section,
    meta_imgConnection,
    section_dividerConnection,
    story_section,
    supers_section,
    platform_imagesConnection,
    star_bgConnection,
    sub_nav,
  } = data.free_to_play_product_page ?? {};

  const dividerImg = bgImageFromConnection(section_dividerConnection);
  const heroesWelcomeLogo = imageFromConnection(
    heroes_cta_section?.logoConnection
  )?.url;
  const heroesWelcomeBg = imageFromConnection(
    heroes_cta_section?.logo_bgConnection
  )?.url;

  return (
    <div className={styles.freeToPlayContent}>
      <BungieHelmet
        title={title}
        image={imageFromConnection(meta_imgConnection)?.url}
      >
        <body
          className={classNames(
            styles.freeToPlay,
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <FreeHero
        data={hero}
        PlatformList={() =>
          FreePlatformList({ platforms: platform_imagesConnection })
        }
      />

      <MarketingSubNav
        ids={Object.keys(idToElementsMapping)}
        renderLabel={(id) => {
          return sub_nav?.labels.find((l) => l.label_id === `${id}_nav_label`)
            ?.label;
        }}
        primaryColor={"darkgray"}
        accentColor={"hotPink"}
        buttonProps={{
          children: sub_nav?.btn_text,
          onClick: () =>
            DestinySkuSelectorModal.show({
              skuTag: DestinySkuTags.NewLightDetail,
            }),
          buttonType: "hotPink",
        }}
        withGutter={true}
      />

      <div
        className={styles.lowerContentWrapper}
        ref={(ref) => setWrapperRef(ref)}
      >
        <div
          className={styles.tileBg}
          style={{ backgroundImage: bgImageFromConnection(star_bgConnection) }}
        />

        <FreeSection
          smallTitle={story_section?.small_title}
          sectionId={"game"}
          inputRef={(ref) => (idToElementsMapping["game"] = ref)}
          classes={{
            section: styles.storySection,
            sectionBg: styles.sectionBg,
          }}
          title={story_section?.section_title}
          bg={{
            desktopConnection: story_section?.bgConnection,
            mobileConnection: story_section?.bgConnection,
          }}
        >
          <FreeTripleImageSet
            thumbnails={story_section?.info_thumb.map((t) => ({
              image: imageFromConnection(t.imageConnection)?.url,
              blurb: t.blurb,
              heading: t.heading,
            }))}
          />
          <p className={styles.lowerText}>{story_section?.bottom_text}</p>
          <DestinyArrows classes={{ root: styles.arrows }} />
        </FreeSection>

        <div className={styles.welcomeSection}>
          <img
            className={classNames(styles.divider, styles.top)}
            style={{ backgroundImage: dividerImg }}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.logoWrapper}>
              <img
                src={heroesWelcomeLogo ?? heroesWelcomeBg}
                className={styles.logo}
              />
              {/* if no localized logo, manually place logo text on top of logo background */}
              {!heroesWelcomeLogo && (
                <h2
                  className={styles.title}
                  dangerouslySetInnerHTML={sanitizeHTML(
                    heroes_cta_section?.title
                  )}
                  style={{
                    backgroundImage: bgImageFromConnection(
                      heroes_cta_section?.text_gradient_bgConnection
                    ),
                  }}
                />
              )}
            </div>
            <div className={styles.lowerContent}>
              <p className={styles.subtitle}>{heroes_cta_section?.subtitle}</p>
              <FreeToPlayBuyBtn btn_text={heroes_cta_section?.btn_text} />
            </div>
          </div>
          <img
            className={classNames(styles.divider, styles.bottom)}
            style={{ backgroundImage: dividerImg }}
          />
        </div>

        <FreeSection
          smallTitle={guardians_section?.small_title}
          sectionId={"guardians"}
          inputRef={(ref) => (idToElementsMapping["guardians"] = ref)}
          blurb={guardians_section?.blurb}
          classes={{
            section: styles.guardiansSection,
            sectionBg: styles.sectionBg,
          }}
          title={guardians_section?.section_title}
          bg={{
            desktopConnection: guardians_section?.bg.desktopConnection,
            mobileConnection: guardians_section?.bg.mobileConnection,
          }}
        >
          <ThreeGuardiansGraphic guardians={guardians_section?.guardians} />
        </FreeSection>

        <div className={styles.superGearWrapper}>
          <FreeSection
            sectionId={"supers"}
            inputRef={(ref) => (idToElementsMapping["supers"] = ref)}
            classes={{
              section: styles.supersSection,
              sectionBg: styles.sectionBg,
              idAnchor: styles.sectionIdAnchor,
            }}
            title={supers_section?.section_title}
            blurb={supers_section?.blurb}
            bg={{
              desktopConnection: supers_section?.bg.desktopConnection,
              mobileConnection: supers_section?.bg.mobileConnection,
            }}
          >
            <FreeTripleImageSet
              thumbnails={supers_section?.thumbnail_imagesConnection.edges.map(
                (t) => ({
                  image: t.node.url,
                })
              )}
              classes={{
                wrapper: styles.thumbnails,
                thumbnailWrapper: styles.thumbnailWrapper,
              }}
            />
          </FreeSection>

          <FreeSection
            sectionId={"gear"}
            inputRef={(ref) => (idToElementsMapping["gear"] = ref)}
            classes={{
              section: styles.gearSection,
              sectionBg: styles.sectionBg,
            }}
            title={gear_section?.section_title}
            blurb={gear_section?.blurb}
          >
            <FreeTripleImageSet
              thumbnails={gear_section?.thumbnail_imagesConnection.edges.map(
                (t) => ({
                  image: t.node.url,
                })
              )}
              classes={{
                wrapper: styles.thumbnails,
                thumbnailWrapper: styles.thumbnailWrapper,
              }}
            />
          </FreeSection>
        </div>

        <div
          className={styles.ctaSection}
          style={{
            backgroundImage: bgImageFromConnection(
              bottom_cta?.bg.desktopConnection
            ),
          }}
        >
          <img
            className={classNames(styles.divider, styles.top)}
            style={{ backgroundImage: dividerImg }}
          />
          <h2 className={styles.heading}>{bottom_cta?.title}</h2>
          <div className={styles.btnWrapper}>
            <FreeToPlayBuyBtn btn_text={bottom_cta?.btn_text} />
          </div>
          <FreePlatformList platforms={platform_imagesConnection} />
          <img
            className={classNames(styles.divider, styles.bottom)}
            style={{ backgroundImage: dividerImg }}
          />
        </div>

        <FreeSection
          sectionId={"guide"}
          inputRef={(ref) => (idToElementsMapping["guide"] = ref)}
          classes={{
            section: styles.guideSection,
            sectionBg: styles.sectionBg,
          }}
          blurb={guide_section?.blurb}
          bg={guide_section?.bg}
        >
          <div className={styles.guideBtnWrapper}>
            <Button
              buttonType={"gold"}
              className={styles.guideBtn}
              url={`/${Localizer.CurrentCultureName}/Guide/Destiny2`}
            >
              {guide_section?.section_title}
            </Button>
          </div>
        </FreeSection>

        <div className={styles.bgGradient} />
      </div>
    </div>
  );
};

export const FreeToPlayBuyBtn: React.FC<{
  btn_text: string;
  className?: string;
}> = ({ btn_text, className }) => {
  return (
    <BuyButton
      children={btn_text}
      className={classNames(styles.buyBtn, className)}
      buttonType={"hotPink"}
      onClick={() =>
        DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.NewLightDetail })
      }
    />
  );
};

const bgImageFromConnection = (img: BasicImageConnection) => {
  const bg = imageFromConnection(img)?.url;

  if (bg) {
    return `url(${bg})`;
  }
};

export const FreeToPlayResponsiveBg = (
  desktopImg: BasicImageConnection,
  mobileImg: BasicImageConnection,
  mobile: boolean
) => {
  return bgImageFromConnection(mobile ? mobileImg : desktopImg);
};

export const FreePlatformList: React.FC<{ platforms: BasicImageConnection }> = (
  props
) => {
  const platforms: string[] = [];

  props.platforms?.edges.forEach((e) => platforms.push(e.node.url));

  return (
    <div className={styles.platformsWrapper}>
      {platforms.map((p, i) => {
        return <img key={i} src={p} className={styles.icon} />;
      })}
    </div>
  );
};

export default FreeToPlay;
