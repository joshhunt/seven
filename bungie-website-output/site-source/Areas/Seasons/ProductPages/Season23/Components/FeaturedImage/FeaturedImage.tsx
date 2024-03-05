import React, { useCallback, memo } from "react";
import classNames from "classnames";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PmpSectionHeader } from "@UI/Marketing/Fragments/PmpSectionHeader";
import {
  BnetStackFile,
  BnetStackPmpSectionHeader,
  BnetStackTopBg,
} from "../../../../../../Generated/contentstack-types";

import styles from "./FeaturedImage.module.scss";

type FeaturedImageProps = {
  image?: BnetStackFile;
  content: BnetStackPmpSectionHeader;
};

type TResponsiveBg = BnetStackTopBg;

const FeaturedImage: React.FC<FeaturedImageProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { image, content } = props ?? {};

  const getResponsiveImg = useCallback(
    (bg: TResponsiveBg): string => {
      const img = mobile ? bg?.mobile_bg : bg?.desktop_bg;

      return img?.url || undefined;
    },
    [mobile]
  );

  return content?.heading && content?.blurb ? (
    <div className={styles.featuredContainer}>
      <img src={image?.url} />
      <PmpSectionHeader
        data={content}
        classes={{
          root: styles.sectionHeaderRoot,
          lowerContent: styles.centerItems,
          headingsFlexWrapper: styles.centerItems,
          heading: styles.sectionHeaderHeading,
          blurb: classNames(styles.centerItems, styles.blurb),
        }}
      />
    </div>
  ) : null;
};

export default memo(FeaturedImage);
