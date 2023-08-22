// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React from "react";
import styles from "./IconActionCard.module.scss";

export interface IconActionCardProps {
  classes?: {
    root?: string;
    background?: string;
    icon?: string;
    textWrapper?: string;
    title?: string;
    subtitle?: string;
    bottomShade?: string;
  };
  cardTitle: string;
  cardSubtitle?: string;
  backgroundImage: string;
  action: string | IMultiSiteLink | (() => void);
  analyticsId?: string;
  icon?: React.ReactNode;
}

export const IconActionCard: React.FC<IconActionCardProps> = (props) => {
  const {
    root,
    background,
    icon: iconClass,
    textWrapper,
    title,
    subtitle,
    bottomShade,
  } = props.classes ?? {};

  const actionAsLink =
    typeof props.action !== "function" ? props.action : undefined;
  const actionAsFunction =
    typeof props.action === "function" ? props.action : undefined;

  const linkIcon = actionAsLink && (
    <img
      src={"/7/ca/destiny/bgs/season14/link_arrow.svg"}
      className={classNames(styles.btnIcon, styles.arrow, iconClass)}
    />
  );
  const functionIcon = actionAsFunction && (
    <Icon
      iconType={"material"}
      iconName={"add"}
      className={classNames(styles.btnIcon, iconClass)}
    />
  );

  const icon = props.icon ?? linkIcon ?? functionIcon;

  const inner = (
    <React.Fragment>
      <div
        className={classNames(styles.btnBg, background)}
        style={{
          backgroundImage:
            props.backgroundImage && `url(${props.backgroundImage})`,
        }}
      />

      {icon}

      <div className={classNames(styles.textContent, textWrapper)}>
        {props.cardSubtitle && (
          <p className={classNames(styles.smallTitle, subtitle)}>
            {props.cardSubtitle}
          </p>
        )}
        <p className={classNames(styles.title, title)}>{props.cardTitle}</p>
      </div>
      <div className={classNames(styles.bottomShade, bottomShade)} />
    </React.Fragment>
  );

  return actionAsLink ? (
    <Anchor
      data-analytics-id={props.analyticsId}
      url={actionAsLink}
      className={classNames(styles.iconActionCard, root)}
    >
      {inner}
    </Anchor>
  ) : (
    <div
      data-analytics-id={props.analyticsId}
      onClick={actionAsFunction}
      className={classNames(styles.iconActionCard, root)}
    >
      {inner}
    </div>
  );
};
