import React, { useMemo } from "react";
import styles from "./S18FestivalGuns.module.scss";
import { BnetStackS18ProductPage } from "../../../../../../Generated/contentstack-types";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";

type S18FestivalGunsProps = {
  data?: BnetStackS18ProductPage["festival"]["gun_holder"];
};

const S18FestivalGuns: React.FC<S18FestivalGunsProps> = ({ data }) => {
  const { title, blurb, image, bg } = data ?? {};

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        image: image?.url,
        bg: bg?.url,
      }),
      [data]
    )
  );

  return (
    <div className={styles.root}>
      <img src={imgs.bg} className={styles.bg} loading={"lazy"} alt={""} />
      <img
        src={imgs.image}
        className={styles.img}
        loading={"lazy"}
        alt={blurb}
        title={title}
      />
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

export default S18FestivalGuns;
