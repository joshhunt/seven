import React, { useMemo } from "react";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import { Responsive } from "@Boot/Responsive";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import styles from "./EpisodesSection.module.scss";

interface BorderMapProps {
  [key: string]: string;
}

interface StorySectionProps {
  data?: any;
}

export const EpisodesSection: React.FC<StorySectionProps> = (props) => {
  const { data } = props;
  const { copy, bg, thumbnails } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? bg?.mobile_bg?.url : bg?.desktop_bg?.url,
      }),
      [data, mobile]
    )
  );

  const borderColorMap: BorderMapProps = {
    FF5768: styles.red,
    "85C6FF": styles.blue,
    "828841": styles.green,
  };

  const imgBorderColorMap: BorderMapProps = {
    FF5768: styles.redBorder,
    "85C6FF": styles.blueBorder,
    "828841": styles.greenBorder,
  };

  return (
    <section
      id="episodes"
      className={styles.section}
      style={{ backgroundImage: `url(${imgs.background})` }}
    >
      <div className={styles.sectionContent}>
        {copy?.eyebrow && <p className={styles.eyebrow}>{copy.eyebrow}</p>}
        {copy?.heading && <p className={styles.title}>{copy.heading}</p>}
        {Array.isArray(thumbnails) && thumbnails?.length > 0 && (
          <div className={styles.thumbnails}>
            {thumbnails?.map((thumbItm) => {
              const borderStyles = borderColorMap[thumbItm?.border_color];
              const imageBorderStyles =
                imgBorderColorMap[thumbItm?.border_color];

              return (
                <div key={thumbItm?.label} className={styles.thumbnailblock}>
                  {thumbItm?.label && (
                    <p className={styles.label}>{thumbItm.label}</p>
                  )}
                  {thumbItm?.title && (
                    <div
                      className={classNames(styles.thumbnailItm, borderStyles)}
                    >
                      <img
                        src={thumbItm?.image?.url}
                        className={imageBorderStyles}
                      />
                      <p className={styles.thumbTitle}>{thumbItm.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {copy?.body_copy && (
          <p className={styles.bodyCopy}>
            <SafelySetInnerHTML html={copy?.body_copy} />
          </p>
        )}
      </div>
    </section>
  );
};
