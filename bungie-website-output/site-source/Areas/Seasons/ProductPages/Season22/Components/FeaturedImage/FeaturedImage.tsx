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
  image: {
    /** Desktop Bg */
    desktop_bg?: BnetStackFile;
    /** Mobile Bg */
    mobile_bg?: BnetStackFile;
  };
  content: BnetStackPmpSectionHeader;
  candy?: BnetStackFile;
};

type TResponsiveBg = BnetStackTopBg;

const FeaturedImage: React.FC<FeaturedImageProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { image, content, candy } = props ?? {};

  const getResponsiveImg = useCallback(
    (bg: TResponsiveBg): string => {
      const img = mobile ? bg?.mobile_bg : bg?.desktop_bg;

      return img?.url || undefined;
    },
    [mobile]
  );

  return content?.heading && content?.blurb ? (
    <div
      id="weapon"
      style={{ backgroundImage: `url(${getResponsiveImg(image)})` }}
      className={styles.featuredContainer}
    >
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
      {candy && <img src={candy?.url} className={styles.candy} />}
    </div>
  ) : null;
};

export default memo(FeaturedImage);
