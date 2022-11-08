// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import styles from "./BeyondLightHero.module.scss";

interface BeyondLightHeroProps {
  data: any;
  inputRef: LegacyRef<HTMLDivElement>;
}

export const BeyondLightHero: React.FC<BeyondLightHeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const data = props?.data;

  const bgImg = mobile
    ? data?.background.mobile
    : data?.background.desktop?.url;
  const heroBg = bgImg ? `url(${bgImg})` : undefined;

  const showTrailer = () => {
    YoutubeModal.show({ videoId: data?.trailer_btn.video_id });
  };

  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: heroBg }}
      ref={props.inputRef}
    >
      <img src={data?.logo?.url} className={styles.logo} />
      <div className={styles.btns}>
        <Button
          onClick={showTrailer}
          buttonType={"white"}
          className={classNames(styles.btn, styles.trailer)}
        >
          {data?.trailer_btn.btn_title}
        </Button>
        <Button
          url={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "BeyondLight",
          })}
          buttonType={"blue"}
          className={styles.btn}
        >
          {data?.buy_btn.btn_title}
        </Button>
      </div>
    </div>
  );
};
