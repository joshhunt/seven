import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import React, { useMemo } from "react";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { CopyBlock } from "@Areas/Destiny/FinalShape/Sections/Components/CopyBlock/CopyBlock";
import styles from "./CollectorsEditionSection.module.scss";

interface ActivitiesSectionProps {
  data?: any;
  ctaBtnText?: string;
}

export const CollectorsEditionSection: React.FC<ActivitiesSectionProps> = (
  props
) => {
  const { data } = props;
  const { heading, bg, blurb, feature_image, buy_button } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? bg?.mobile_bg?.url : bg?.desktop_bg?.url,
      }),
      [data, mobile]
    )
  );

  return (
    <div
      id={"collectors"}
      className={styles.ce}
      style={{ backgroundImage: `url(${imgs.background})` }}
    >
      {feature_image?.url && (
        <div className={styles.featureImageContainer}>
          <img src={feature_image.url} alt={""} />
        </div>
      )}
      <div className={styles.sectionContent}>
        <CopyBlock heading={heading} bodyCopy={blurb} />
        {Array.isArray(buy_button) &&
          buy_button?.length > 0 &&
          buy_button.map((b: any) => (
            <PmpButton key={b.uid} className={styles.buyBtn} {...b}>
              {b.label}
            </PmpButton>
          ))}
      </div>
    </div>
  );
};
