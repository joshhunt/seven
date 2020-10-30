// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ConfigUtils } from "@Utilities/ConfigUtils";
import * as React from "react";
import {
  Button,
  ButtonProps,
  ButtonTypes,
} from "@UI/UIKit/Controls/Button/Button";
import { useDataStore } from "@Global/DataStore";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import styles from "./DestinyBuyDetailItem.module.scss";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import { IDestinyProductDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { IMarketingMediaAsset } from "@Utilities/ContentUtils";

export type DetailItemOrientations =
  | "vertical"
  | "textblock-media"
  | "media-textblock";

interface IDestinyBuyDetailItemProps {
  item?: IMarketingMediaAsset;
  skuItem?: IDestinyProductDefinition;
  orientation: DetailItemOrientations;
  collectorsEdition?: boolean;
  strangerEdition?: boolean;
}

interface IDestinyBuyDetailItemState {
  selectedSku: string;
}

/**
 * DestinyBuyDetailItem - Replace this description
 *  *
 * @param {IDestinyBuyDetailItemProps} props
 * @returns
 */
export class DestinyBuyDetailItem extends React.Component<
  IDestinyBuyDetailItemProps,
  IDestinyBuyDetailItemState
> {
  constructor(props: IDestinyBuyDetailItemProps) {
    super(props);

    this.state = {
      selectedSku: null,
    };
  }

  public render() {
    const {
      item,
      orientation,
      skuItem,
      collectorsEdition,
      strangerEdition,
    } = this.props;

    return item || skuItem ? (
      <div className={classNames(styles.container, styles[orientation])}>
        <MediaSection
          videoId={item ? item.videoId : null}
          imageThumbnail={item ? item.imageThumbnail : skuItem.imagePath}
          videoThumbnail={item ? item.videoThumbnail : skuItem.imagePath}
          videoTitle={
            item
              ? item.videoTitle
              : (collectorsEdition || strangerEdition) && skuItem.disclaimer
          }
          orientation={orientation}
        />
        <TextSection
          title={item ? item.title : skuItem.edition}
          blurb={
            <div
              dangerouslySetInnerHTML={{
                __html: item ? item.textBlock : skuItem.blurb,
              }}
            />
          }
          buttonLabel={
            item
              ? item.buttonLabel
              : skuItem?.soldOutButtonLabel || skuItem.buttonLabel
          }
          buttonSku={item ? item.buttonSku : null}
          buttonUrl={
            item
              ? item.buttonLink
              : (collectorsEdition || strangerEdition) && skuItem.relatedPage
          }
          buttonType={skuItem?.buyButtonDisabled ? "disabled" : "gold"}
          orientation={orientation}
        />
      </div>
    ) : null;
  }
}

interface ITextSectionProps {
  title: string;
  blurb: React.ReactNode;
  buttonLabel?: string;
  buttonSku?: string;
  buttonUrl?: string;
  buttonType?: ButtonTypes;
  orientation: DetailItemOrientations;
}

const TextSection = (props: ITextSectionProps) => {
  const {
    title,
    blurb,
    buttonLabel,
    buttonSku,
    buttonUrl,
    buttonType,
    orientation,
  } = props;

  return (
    <div className={classNames(styles.textSection, styles[orientation])}>
      <div className={styles.textTitle}>{title}</div>
      <div className={styles.textBlurb}>{blurb}</div>
      {buttonLabel && (
        <PotentialSkuButton
          className={styles.button}
          url={buttonUrl}
          sku={buttonSku}
          buttonType={buttonType}
        >
          {buttonLabel}
        </PotentialSkuButton>
      )}
    </div>
  );
};

export interface IPotentialSkuButtonProps extends ButtonProps {
  sku: string;
}

export const PotentialSkuButton: React.FC<IPotentialSkuButtonProps> = (
  props
) => {
  const skuConfig = useDataStore(DestinySkuConfigDataStore);

  const { sku, url, children, buttonType } = props;

  // These might change
  let fixedOnClick = null;
  let fixedUrl = url;

  if (sku) {
    // If we have a valid sku, replace the URL with the SKU selector modal
    const skuIsValid = DestinySkuUtils.productExists(sku, skuConfig);
    if (skuIsValid) {
      fixedUrl = undefined;
      fixedOnClick = () => {
        DestinySkuSelectorModal.show({
          skuTag: sku,
        });
      };
    }
  } else if (!url) {
    // If we don't have a URL or a valid SKU, just make the button do nothing
    fixedUrl = "#";
  }

  return (
    <Button
      url={fixedUrl}
      onClick={fixedOnClick}
      size={BasicSize.Small}
      buttonType={buttonType}
    >
      {children}
    </Button>
  );
};

interface IMediaSectionProps {
  videoId?: string;
  videoThumbnail?: string;
  imageThumbnail?: string;
  videoTitle?: string;
  orientation: DetailItemOrientations;
}

const MediaSection = (props: IMediaSectionProps) => {
  const {
    videoId,
    videoThumbnail,
    imageThumbnail,
    videoTitle,
    orientation,
  } = props;

  const isVideo = !StringUtils.isNullOrWhiteSpace(videoId);

  return (
    <div className={classNames(styles.mediaSection, styles[orientation])}>
      <div
        className={classNames(styles.thumbnail, { [styles.static]: !isVideo })}
        style={{ backgroundImage: `url(${imageThumbnail || videoThumbnail})` }}
        onClick={isVideo ? () => YoutubeModal.show({ videoId }) : null}
      >
        {isVideo && <div className={styles.thumbnailPlayButton} />}
      </div>
      {videoTitle && <div className={styles.videoTitle}>{videoTitle}</div>}
    </div>
  );
};
