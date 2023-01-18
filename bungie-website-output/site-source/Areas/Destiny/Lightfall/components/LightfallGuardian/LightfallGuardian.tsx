// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useMemo } from "react";
import styles from "./LightfallGuardian.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";
import { LightfallAnimatedText } from "@Areas/Destiny/Lightfall/components/LightfallAnimatedText/LightfallAnimatedText";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import classNames from "classnames";
import { ImageThumbBtn } from "@UI/Marketing/ImageThumb";
import ImagePaginationModal, {
  getScreenshotPaginationData,
} from "@UIKit/Controls/Modal/ImagePaginationModal";

interface LightfallGuardianProps {
  class?: string;
  heading?: string;
  blurb?: string;
  desktop_bg?: BnetStackFile;
  thumbs?: BnetStackFile[];
  flip?: boolean;
  abilities_title?: string;
  abilities?: {
    ability: {
      title?: string;
      blurb?: string;
      icon?: BnetStackFile;
    };
  }[];
}

export const LightfallGuardian: React.FC<LightfallGuardianProps> = (props) => {
  const {
    class: guardianClass,
    heading,
    blurb,
    thumbs = [],
    abilities_title,
    abilities = [],
    desktop_bg,
    flip,
  } = props;

  const { mobile } = useDataStore(Responsive);
  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        bg: mobile ? null : desktop_bg?.url,
      }),
      [props, mobile]
    )
  );

  const handleImageThumbClick = (imgUrl: string) => {
    const { imgIndex, images } = getScreenshotPaginationData(
      thumbs,
      imgUrl,
      (thumbObj: BnetStackFile) => thumbObj?.url
    );

    ImagePaginationModal.show({ imgIndex, images });
  };

  return (
    <div
      className={classNames([styles.section, flip && styles.flip])}
      style={{ backgroundImage: imgs.bg && `url(${imgs.bg})` }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            {guardianClass ? (
              <h4 className={styles.guardianClass}>{guardianClass}</h4>
            ) : null}
            {heading ? <h3 className={styles.heading}>{heading}</h3> : null}
            {blurb ? <div className={styles.blurb}>{blurb}</div> : null}

            {thumbs.length > 0 ? (
              <div className={styles.thumbs}>
                {thumbs.map((thumb) => {
                  console.log(thumb);
                  if (thumb.content_type.includes("video")) {
                    return (
                      <div className={styles.thumbWrap}>
                        <video
                          className={styles.thumb}
                          src={thumb.url}
                          autoPlay
                          muted
                          playsInline
                          loop
                          controls={false}
                        />
                      </div>
                    );
                  }

                  return (
                    <ImageThumbBtn
                      key={thumb.uid}
                      classes={{ imageContainer: styles.thumb }}
                      image={thumb.url}
                      onClick={() => handleImageThumbClick(thumb.url)}
                    />
                  );
                })}
              </div>
            ) : null}

            <h4 className={styles.abilitiesTitle}>{abilities_title}</h4>

            <div className={styles.abilities}>
              {abilities.map(({ ability }) => (
                <div
                  key={ability.title}
                  className={ability?.icon && styles.abilityLayout}
                >
                  {ability?.icon ? (
                    <img
                      className={styles.abilityIcon}
                      src={`${ability?.icon?.url}?width=80&height=80`}
                      alt={ability.blurb}
                      title={ability.title}
                    />
                  ) : null}
                  <div>
                    <h5 className={styles.abilityTitle}>{ability.title}</h5>
                    <div className={styles.abilityBlurb}>{ability.blurb}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
