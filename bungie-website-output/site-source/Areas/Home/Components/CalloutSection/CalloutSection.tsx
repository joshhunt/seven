// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, {
  FC,
  memo,
  useMemo,
  ReactNode,
  useRef,
  useEffect,
  useState,
  forwardRef,
} from "react";
import { Typography, Button } from "plxp-web-ui/components/base";

import classNames from "classnames";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";

import styles from "./CalloutSection.module.scss";
import {
  BnetStackFile,
  BnetStackLink,
} from "../../../../Generated/contentstack-types";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";

interface GameRatingProps {
  game_rating_image?: BnetStackFile;
  game_rating_tags?: string;
  game_rating_url?: string;
}

interface ButtonsProps {
  button_theme: "destiny-core" | "bungie-core";
  primary_button: BnetStackLink;
  secondary_button: BnetStackLink;
}

interface GameRatingWrapperProps {
  href?: IMultiSiteLink | string;
  children?: ReactNode;
}

interface Props {
  sectionTitle?: any;
  logoImage?: string;
  primaryImage?: string;
  buttonData?: ButtonsProps;
  gameRatingData?: GameRatingProps;
}

const GameRatingWrapper: FC<GameRatingWrapperProps> = ({ children, href }) =>
  href ? (
    <Anchor className={styles.gameRatingLogo} url={href}>
      {children}
    </Anchor>
  ) : (
    <div className={styles.gameRatingLogo}>{children}</div>
  );

const CalloutSection: FC<Props> = ({
  buttonData,
  sectionTitle,
  logoImage,
  gameRatingData,
  primaryImage,
}) => {
  const buttonTheme = buttonData?.button_theme
    ?.toLowerCase()
    .includes("marathon")
    ? "bungie-core"
    : buttonData?.button_theme;
  const { mobile } = useDataStore(Responsive);
  const {
    game_rating_image,
    game_rating_tags,
    game_rating_url,
  } = gameRatingData;
  const gameRatingLabels =
    game_rating_tags?.length && game_rating_tags?.split(",");
  const composedButtonClass = useMemo(
    () =>
      classNames({
        [styles.marathonButton]: buttonData?.button_theme
          ?.toLowerCase()
          .includes("marathon"),
      }),
    [buttonData]
  );

  const wordmarkLogo = useCSWebpImages(
    useMemo(
      () => ({
        img: logoImage ?? null,
      }),
      [logoImage, mobile]
    )
  );

  const primaryImg = useCSWebpImages(
    useMemo(
      () => ({
        img: primaryImage ?? null,
      }),
      [primaryImage, mobile]
    )
  );

  return logoImage || sectionTitle ? (
    <div className={styles.calloutBlocks}>
      {primaryImage && (
        <img className={styles.primaryImage} src={primaryImg?.img} />
      )}

      {logoImage && (
        <>
          <img className={styles.logo} src={wordmarkLogo?.img} />
          <Typography component={"h2"} className={styles.srOnly}>
            {sectionTitle}
          </Typography>
        </>
      )}

      {sectionTitle && !logoImage ? <h2>{sectionTitle}</h2> : null}

      {(buttonData?.primary_button?.title ||
        buttonData?.secondary_button?.title) && (
        <div className={styles.buttonContainer}>
          {buttonData?.primary_button?.title &&
            buttonData?.primary_button?.href && (
              <Button
                themeVariant={buttonTheme}
                href={buttonData?.primary_button?.href}
                className={composedButtonClass}
                variant={"contained"}
                size={"large"}
              >
                {buttonData?.primary_button?.title}
              </Button>
            )}
          {buttonData?.secondary_button?.title &&
            buttonData?.secondary_button?.href && (
              <Button
                themeVariant={buttonTheme}
                href={buttonData?.secondary_button?.href}
                color={"secondary"}
                variant={"contained"}
                size={"large"}
              >
                {buttonData?.secondary_button?.title}
              </Button>
            )}
          {game_rating_image?.url && (
            <GameRatingWrapper href={game_rating_url}>
              {game_rating_image?.url && <img src={game_rating_image?.url} />}
              {Array.isArray(gameRatingLabels) && gameRatingLabels?.length > 0 && (
                <ul>
                  {gameRatingLabels?.map((itm) => (
                    <li key={itm}>{itm?.trim()}</li>
                  ))}
                </ul>
              )}
            </GameRatingWrapper>
          )}
        </div>
      )}
    </div>
  ) : null;
};

export default memo(CalloutSection);
