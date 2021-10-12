// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import * as React from "react";
import {
  Button,
  ButtonProps,
  ButtonTypes,
} from "@UI/UIKit/Controls/Button/Button";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
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
  /* all images user can paginate through when image is opened in modal */
  imagesForPagination?: string[] | string;
  imgIndexInPagination?: number;
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

    let buttonLabel = item ? item.buttonLabel : skuItem?.buttonLabel;
    if (!item && skuItem && skuItem.buyButtonDisabled) {
      buttonLabel = skuItem.soldOutButtonLabel;
    }

    return item || skuItem ? (
      <div className={classNames(styles.container, styles[orientation])}>
        <MediaSection
          singleOrAllScreenshots={this.props.imagesForPagination}
          screenshotIndex={this.props.imgIndexInPagination}
          videoId={item ? item.videoId : null}
          thumbnail={
            item
              ? item.imageThumbnail || item.videoThumbnail
              : skuItem.imagePath
          }
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
              dangerouslySetInnerHTML={sanitizeHTML(
                item ? item.textBlock : skuItem.blurb
              )}
            />
          }
          buttonLabel={buttonLabel}
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
      {((buttonLabel && buttonUrl) || buttonSku) && (
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

interface IMediaSectionProps extends ClickableMediaThumbnailProps {
  videoTitle?: string;
  orientation: DetailItemOrientations;
}

const MediaSection = (props: IMediaSectionProps) => {
  const { videoTitle, orientation, ...rest } = props;

  return (
    <div className={classNames(styles.mediaSection, styles[orientation])}>
      <ClickableMediaThumbnail
        classes={{ btnWrapper: styles.thumbnail, btnBg: styles.img }}
        showShadowBehindPlayIcon={true}
        {...rest}
      />
      {videoTitle && <div className={styles.videoTitle}>{videoTitle}</div>}
    </div>
  );
};
