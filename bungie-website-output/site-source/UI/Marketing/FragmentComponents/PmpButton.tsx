import React from "react";
import {
  Button,
  ButtonProps,
  ButtonTypes,
} from "@UI/UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BnetStackFile } from "../../../Generated/contentstack-types";

export interface PmpButtonProps
  extends Omit<ButtonProps, "buttonType" | "size" | "analyticsId" | "sameTab"> {
  function?: "Link" | "Store Modal" | "Buy Page" | "Youtube Modal";
  url?: string;
  sku_tag?: string;
  product_family_tag?: string;
  /** Button types */
  button_type?: ButtonProps["buttonType"];
  /** Button size */
  size?: keyof typeof BasicSize;
  same_tab?: ButtonProps["sameTab"];
  analytics_id?: ButtonProps["analyticsId"];
  icon?: React.ReactElement | BnetStackFile;
}

export const PmpButton: React.FC<PmpButtonProps> = (props) => {
  const {
    className,
    same_tab: sameTab,
    analytics_id: analyticsId,
    children,
    function: functionality,
    url,
    sku_tag: skuTag,
    product_family_tag: productFamilyTag,
    button_type: buttonType,
    size,
    icon,
  } = props;

  const sharedProps = {
    className,
    sameTab,
    analyticsId,
    buttonType,
    size: BasicSize[size],
    icon,
  };

  if (functionality === "Youtube Modal") {
    return (
      <Button
        onClick={() => YoutubeModal.show({ youtubeUrl: url })}
        {...sharedProps}
      >
        {children}
      </Button>
    );
  }

  if (functionality === "Link" && url) {
    return (
      <Button url={url} {...sharedProps}>
        {children}
      </Button>
    );
  }

  if (functionality === "Buy Page" && productFamilyTag) {
    const link = RouteHelper.DestinyBuyDetail({ productFamilyTag });

    return (
      <Button url={link} {...sharedProps}>
        {children}
      </Button>
    );
  }

  if (functionality === "Store Modal" && skuTag) {
    return (
      <Button
        {...sharedProps}
        onClick={() => {
          DestinySkuSelectorModal.show({ skuTag });
        }}
      >
        {children}
      </Button>
    );
  }

  return <Button {...sharedProps}>{children}</Button>;
};
