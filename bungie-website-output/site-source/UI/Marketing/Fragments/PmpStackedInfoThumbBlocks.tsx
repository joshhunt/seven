// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ImageThumbBtn,
  ImageThumbProps,
  ImageVideoThumb,
} from "@UI/Marketing/ImageThumb";
import ImagePaginationModal, {
  getScreenshotPaginationData,
} from "@UIKit/Controls/Modal/ImagePaginationModal";
import { bgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpStackedInfoThumbBlocks } from "../../../Generated/contentstack-types";
import styles from "./PmpStackedInfoThumbBlocks.module.scss";

type PmpStackedInfoThumbBlocksProps = DataReference<
  "pmp_stacked_info_thumb_blocks",
  BnetStackPmpStackedInfoThumbBlocks
> & {
  classes?: {
    root?: string;
    blockWrapper?: string;
    textWrapper?: string;
    heading?: string;
    blurb?: string;
    thumbWrapper?: string;
    thumb?: string;
    thumbImg?: string;
  };
  /** Reverses the alignment of the text and image for each block */
  reverseAlignment?: boolean;
};

export const PmpStackedInfoThumbBlocks: React.FC<PmpStackedInfoThumbBlocksProps> = (
  props
) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes, reverseAlignment } = props;

  const getBlockItem = (
    item: BnetStackPmpStackedInfoThumbBlocks["info_blocks"][number]
  ) => {
    return item?.image_info_block ?? item.video_info_block;
  };

  return (
    <div className={classNames(styles.blocksFlexWrapper, classes?.root)}>
      {data?.info_blocks?.map((block, i) => {
        const blockItem = getBlockItem(block);

        let isReverseFlex = i % 2 === 0;

        reverseAlignment && (isReverseFlex = !isReverseFlex);

        const blockClasses = classNames(
          styles.infoThumbBlock,
          { [styles.reverse]: isReverseFlex },
          classes?.blockWrapper
        );

        const imgBehindThumb = mobile
          ? bgImageFromStackFile(getBlockItem(block)?.img_behind_thumb)
          : undefined;

        return (
          <div className={blockClasses} key={i}>
            <div
              className={classNames(styles.textWrapper, classes?.textWrapper)}
            >
              <p
                className={classNames(styles.heading, classes?.heading)}
                dangerouslySetInnerHTML={sanitizeHTML(blockItem?.heading)}
              />
              <p
                className={classNames(styles.blurb, classes?.blurb)}
                dangerouslySetInnerHTML={sanitizeHTML(blockItem?.blurb)}
              />
            </div>
            <div
              className={classNames(styles.thumbWrapper, classes?.thumbWrapper)}
            >
              <div
                className={styles.imgBehindThumb}
                style={{ backgroundImage: imgBehindThumb }}
              />
              <PmpStackedBlockThumb
                blockItem={block}
                allBlocks={data?.info_blocks}
                classes={{
                  imageContainer: classNames(classes?.thumb),
                  image: classNames(classes?.thumbImg),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface PmpStackedBlockThumbProps {
  blockItem: BnetStackPmpStackedInfoThumbBlocks["info_blocks"][number];
  allBlocks: BnetStackPmpStackedInfoThumbBlocks["info_blocks"];
  classes: ImageThumbProps["classes"];
}

const PmpStackedBlockThumb: React.FC<PmpStackedBlockThumbProps> = ({
  blockItem,
  allBlocks,
  classes,
}) => {
  const { image_info_block, video_info_block } = blockItem;

  const handleImgThumbClick = (imgUrl: string) => {
    const { images, imgIndex } = getScreenshotPaginationData(
      allBlocks,
      imgUrl,
      (imgObj: typeof blockItem) => imgObj?.image_info_block?.screenshot?.url
    );

    ImagePaginationModal.show({ imgIndex, images });
  };

  const imageThumbProps: ImageThumbProps = {
    image:
      image_info_block?.thumbnail?.url ??
      image_info_block?.screenshot?.url ??
      video_info_block?.thumbnail?.url,
    classes: {
      imageContainer: classNames(styles.thumb, classes.imageContainer),
      image: classNames(styles.thumbImg, classes?.image),
    },
  };

  if (image_info_block) {
    return (
      <ImageThumbBtn
        {...imageThumbProps}
        onClick={() =>
          handleImgThumbClick(blockItem?.image_info_block?.screenshot?.url)
        }
      />
    );
  } else if (video_info_block) {
    return (
      <ImageVideoThumb
        {...imageThumbProps}
        youtubeUrl={video_info_block?.youtube_url}
      />
    );
  }
};
