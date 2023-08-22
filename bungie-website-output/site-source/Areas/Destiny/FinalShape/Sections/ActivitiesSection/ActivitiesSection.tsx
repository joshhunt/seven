import React from "react";
import { CopyBlock } from "@Areas/Destiny/FinalShape/Sections/Components/CopyBlock/CopyBlock";
import { ThumbnailRiver } from "@Areas/Destiny/FinalShape/Sections/Components/ThumbnailRiver/ThumbnailRiver";
import styles from "./ActivitiesSection.module.scss";

interface ActivitiesSectionProps {
  data?: any;
  ctaBtnText?: string;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = (props) => {
  const { data } = props;
  const { copy, content } = data ?? {};

  return (
    <section id="activities" className={styles.section}>
      <div className={styles.sectionContent}>
        <CopyBlock
          {...copy}
          bodyCopy={copy?.body_copy}
          classes={{
            root: styles.header,
            content: styles.content,
            title: styles.title,
          }}
        />

        {Array.isArray(content) && content?.length > 0 && (
          <ThumbnailRiver data={content?.[0]} />
        )}
      </div>
    </section>
  );
};
