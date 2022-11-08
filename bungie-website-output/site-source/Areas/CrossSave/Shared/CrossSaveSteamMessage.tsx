// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CrossSaveSteamMessage.module.scss";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemNames } from "@Global/SystemNames";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";

// Required props
interface ICrossSaveSteamMessageProps {}

// Default props - these will have values set in CrossSaveSteamMessage.defaultProps
interface DefaultProps {}

type Props = ICrossSaveSteamMessageProps & DefaultProps;

interface ICrossSaveSteamMessageState {}

/**
 * CrossSaveSteamMessage - Replace this description
 *  *
 * @param {ICrossSaveSteamMessageProps} props
 * @returns
 */
export class CrossSaveSteamMessage extends React.Component<
  Props,
  ICrossSaveSteamMessageState
> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const faqArticleId = ConfigUtils.GetParameter(
      SystemNames.CrossSave,
      "FaqFirehoseArticleId",
      0
    );
    const faqLink = RouteHelper.HelpArticle(faqArticleId);
    const message = (
      <>
        {Localizer.FormatReact(Localizer.Crosssave.CrossSaveSteamMessage, {
          learnMoreLink: (
            <Anchor
              className={styles.learnMoreLink}
              onClick={(e) => e.stopPropagation()}
              url={faqLink}
              sameTab={false}
            >
              {Localizer.Crosssave.LearnMore}
            </Anchor>
          ),
        })}
      </>
    );

    return (
      <div className={styles.wrapper}>
        <div className={styles.message}>{message}</div>
        <div className={styles.logos}>
          <div className={styles.iconBattleNet} />
          <Icon
            iconType={"material"}
            iconName={"arrow_right_alt"}
            className={styles.arrowIcon}
          />
          <div className={styles.iconSteam} />
        </div>
      </div>
    );
  }
}
