import React from "react";
import { PmpButtonProps } from "@UI/Marketing/FragmentComponents/PmpButton";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import styles from "./ThumbnailButton.module.scss";

interface ThumbnailButtonProps extends PmpButtonProps {
  label?: string;
  bg: string;
}

export const ThumbnailButton: React.FC<ThumbnailButtonProps> = ({
  bg,
  label,
  url,
  function: functionality,
}) => {
  const background = `url(${bg})`;

  return functionality === "Youtube Modal" ? (
    <div
      className={classNames(styles.heroBtn, styles.videoBtn)}
      onClick={() => YoutubeModal.show({ youtubeUrl: url })}
    >
      <div
        className={styles.heroBtnBg}
        style={{ backgroundImage: background }}
      />
      <div className={styles.heroBtnContent}>
        <Icon
          className={styles.playIcon}
          iconType={"material"}
          iconName={"play_arrow"}
        />
        <p className={styles.btnText}>{label}</p>
      </div>
    </div>
  ) : (
    <Anchor
      url={url}
      className={classNames(styles.heroBtn, styles.preOrderBtn)}
    >
      <div
        className={styles.heroBtnBg}
        style={{ backgroundImage: background }}
      />
      <div className={styles.heroBtnContent}>
        <div className={styles.arrowsTextWrapper}>
          <p className={styles.btnText}>{label}</p>
        </div>
      </div>
    </Anchor>
  );
};
