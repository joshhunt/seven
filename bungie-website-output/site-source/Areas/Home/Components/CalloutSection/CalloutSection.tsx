// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { FC, memo, useMemo, ReactNode } from "react";
import classNames from "classnames";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import Button from "../Button";

import styles from "./CalloutSection.module.scss";

interface Classes {
  logoClass?: string;
  buttonContainer?: string;
}

interface GameRatingProps {
  img: string;
  alt?: string;
  note?: string[];
  href?: IMultiSiteLink | string;
}

interface GameRatingWrapperProps {
  href?: IMultiSiteLink | string;
  alt?: string;
  children?: ReactNode;
}

interface Props {
  sectionTitle?: any;
  logoImage?: {
    alt?: string;
    img: string;
  };
  buttonData?: {
    label: any;
    buttonColor?: "blue" | "grey" | "green";
    href?: IMultiSiteLink | string;
  }[];
  esrbLogo?: GameRatingProps;
  classes?: Classes;
}

const GameRatingWrapper: FC<GameRatingWrapperProps> = ({
  alt,
  children,
  href,
}) =>
  href ? (
    <Anchor url={href} aria-label={alt} className={styles.esrbLogo}>
      {children}
    </Anchor>
  ) : (
    <div className={styles.esrbLogo}>{children}</div>
  );

const CalloutSection: FC<Props> = ({
  buttonData,
  sectionTitle,
  logoImage,
  classes,
  esrbLogo,
}) => {
  const composedLogoClass = useMemo(
    () =>
      classNames({
        [styles.logo]: !classes?.logoClass,
        [classes?.logoClass]: classes?.logoClass,
      }),
    [classes?.logoClass]
  );

  const composedButtonContainerClass = useMemo(
    () =>
      classNames(styles.buttonContainer, {
        [styles.logo]: !classes?.buttonContainer,
        [classes?.buttonContainer]: classes?.buttonContainer,
      }),
    [classes?.buttonContainer]
  );

  return logoImage || sectionTitle ? (
    <div className={styles.calloutBlocks}>
      <GameRatingWrapper>
        {esrbLogo?.img && <img src={esrbLogo.img} alt={esrbLogo.alt} />}
        {Array.isArray(esrbLogo?.note) && esrbLogo?.note?.length > 0 && (
          <ul>
            {esrbLogo?.note?.map((itm) => (
              <li key={itm}>{itm}</li>
            ))}
          </ul>
        )}
      </GameRatingWrapper>
      {logoImage?.img && (
        <img className={composedLogoClass} src={logoImage.img} alt={""} />
      )}
      {sectionTitle ? (
        <h2>{sectionTitle}</h2>
      ) : (
        <>
          {logoImage?.alt && <h2 className={styles.srOnly}>{logoImage.alt}</h2>}
        </>
      )}
      {Array.isArray(buttonData) && buttonData?.length > 0 && (
        <div className={composedButtonContainerClass}>
          {buttonData?.map((data) => (
            <Button key={data?.label} {...data} />
          ))}
        </div>
      )}
    </div>
  ) : null;
};

export default memo(CalloutSection);
