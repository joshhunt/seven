// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { BnetStackFile } from "Generated/contentstack-types";
import React, { useMemo } from "react";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";
import styles from "./PmpCallToAction.module.scss";
import classNames from "classnames";
import { ButtonTypes } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";

type PmpCallToActionProps = {
  data?: {
    /** Logo */
    logo?: BnetStackFile;
    /** Buttons */
    buttons?: {
      uid: string;
      label?: string;
      function: "Link" | "Store Modal" | "Buy Page";
      url?: string;
      skuTag?: string;
      productFamilyTag?: string;
      button_type?: ButtonTypes;
      size?: keyof typeof BasicSize;
    }[];
    bg?: {
      /** Desktop Bg */
      desktop_bg?: BnetStackFile;
      /** Mobile Bg */
      mobile_bg?: BnetStackFile;
    };
  };
  classes?: {
    root?: string;
    logo?: string;
    buttonsWrap?: string;
    button?: string;
  };
};

export const PmpCallToAction: React.FC<PmpCallToActionProps> = (props) => {
  const { data, classes } = props;
  const { logo, buttons = [], bg } = data || {};

  const responsive = useDataStore(Responsive);

  const images = useCSWebpImages(
    useMemo(
      () => ({
        logo: logo?.url,
        bg: responsive.mobile ? bg?.mobile_bg?.url : bg?.desktop_bg?.url,
      }),
      [responsive.mobile, logo?.url, bg?.mobile_bg?.url, bg?.desktop_bg?.url]
    )
  );

  return (
    <div
      className={classNames(styles.root, classes?.root)}
      style={{ backgroundImage: images?.bg && `url(${images.bg})` }}
    >
      <img
        className={classNames(styles.logo, classes?.logo)}
        src={images.logo}
        alt={logo?.title}
      />

      <div className={classNames(styles.buttonsWrap, classes?.buttonsWrap)}>
        {buttons.map(({ uid, ...button }) => {
          return (
            <PmpButton
              key={uid}
              className={classNames(styles.button, classes?.button)}
              {...button}
            >
              {button.label}
            </PmpButton>
          );
        })}
      </div>
    </div>
  );
};
