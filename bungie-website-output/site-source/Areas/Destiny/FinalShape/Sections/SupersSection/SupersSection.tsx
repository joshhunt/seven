import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import React, { useMemo } from "react";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { CopyBlock } from "@Areas/Destiny/FinalShape/Sections/Components/CopyBlock/CopyBlock";
import styles from "./SupersSection.module.scss";

interface ActivitiesSectionProps {
  data?: any;
  ctaBtnText?: string;
}

export const SupersSection: React.FC<ActivitiesSectionProps> = (props) => {
  const { data } = props;
  const { copy, bg, content } = data ?? {};

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
    <section
      id="supers"
      className={styles.section}
      style={{ backgroundImage: `url(${imgs.background})` }}
    >
      <div className={styles.sectionContent}>
        <CopyBlock
          {...copy}
          bodyCopy={copy?.body_copy}
          classes={{
            root: styles.header,
            content: styles.content,
          }}
        />

        {Array.isArray(content) && content?.length > 0 && (
          <PmpInfoThumbnailGroup
            data={content?.[0]}
            classes={{
              thumbBg: styles.thumbnailbg,
              thumbBlockWrapper: styles.thumbBlockWrapper,
            }}
          />
        )}
      </div>
    </section>
  );
};
