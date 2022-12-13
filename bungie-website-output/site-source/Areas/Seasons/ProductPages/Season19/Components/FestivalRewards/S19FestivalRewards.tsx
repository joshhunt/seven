import React, { useMemo } from "react";
import styles from "./S19FestivalRewards.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";

type S19FestivalRewardsProps = {
  data?: any;
};

const S19FestivalRewards: React.FC<S19FestivalRewardsProps> = ({ data }) => {
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
      <div className={styles.imgWrap}>
        <img
          src={imgs.image}
          className={styles.img}
          loading={"lazy"}
          alt={blurb}
          title={title}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(blurb)}
        />
      </div>
    </div>
  );
};

export default S19FestivalRewards;
