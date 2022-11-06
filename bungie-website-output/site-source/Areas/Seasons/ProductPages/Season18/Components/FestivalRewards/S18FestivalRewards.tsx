import React, { useMemo } from "react";
import styles from "./S18FestivalRewards.module.scss";
import { BnetStackS18ProductPage } from "../../../../../../Generated/contentstack-types";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";

type S18FestivalRewardsProps = {
  data?: BnetStackS18ProductPage["festival"]["rewards"];
};

const S18FestivalRewards: React.FC<S18FestivalRewardsProps> = ({ data }) => {
  const { title, blurb, image } = data ?? {};

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        image: image?.url,
      }),
      [data]
    )
  );

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(blurb)}
        />
      </div>
      <div className={styles.imgWrap}>
        <img
          src={imgs.image}
          className={styles.img}
          loading={"lazy"}
          alt={blurb}
          title={title}
        />
      </div>
    </div>
  );
};

export default S18FestivalRewards;
