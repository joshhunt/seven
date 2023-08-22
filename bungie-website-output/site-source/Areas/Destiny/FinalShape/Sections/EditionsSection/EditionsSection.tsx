import React from "react";
import EditionsBlock from "@Areas/Destiny/FinalShape/Sections/Components/EditionsBlock/EditionsBlock";

import styles from "./EditionsSection.module.scss";

interface EditionsSectionProps {
  data?: any;
}

export const EditionsSection: React.FC<EditionsSectionProps> = (props) => {
  const { edition_block, heading } = props.data ?? {};

  return (
    <div id={"editions"} className={styles.section}>
      <div>
        {heading && <h2 className={styles.title}>{heading}</h2>}
        <div className={styles.editions}>
          <EditionsBlock data={edition_block} isStandard />
          <EditionsBlock data={edition_block} />
        </div>
      </div>
    </div>
  );
};
