import React, { useMemo } from "react";
import { Responsive } from "@Boot/Responsive";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { CopyBlock } from "@Areas/Destiny/FinalShape/Sections/Components/CopyBlock/CopyBlock";
import styles from "./StorySection.module.scss";

interface StorySectionProps {
  data?: any;
}

export const StorySection: React.FC<StorySectionProps> = (props) => {
  const { data } = props;
  const { copy, bg } = data ?? {};

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
      id="story"
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
      </div>
    </section>
  );
};
