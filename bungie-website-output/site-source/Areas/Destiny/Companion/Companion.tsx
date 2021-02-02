// Created by larobinson, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localization/Localizer";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { RegistrationContentItem } from "@Areas/Registration/Shared/RegistrationContentItem";
import styles from "./Companion.module.scss";
import { StringUtils } from "@Utilities/StringUtils";
import { Img } from "@Helpers";

// Required props
interface ICompanionProps {}

// Default props - these will have values set in Companion.defaultProps
interface DefaultProps {}

export type CompanionProps = ICompanionProps & DefaultProps;

interface ICompanionState {
  appIcon512: string;
  contentSet: Content.ContentItemPublicContract;
}

/**
 * Companion - Replace this description
 *  *
 * @param {ICompanionProps} props
 * @returns
 */
export class Companion extends React.Component<
  CompanionProps,
  ICompanionState
> {
  constructor(props: CompanionProps) {
    super(props);

    this.state = {
      appIcon512: "",
      contentSet: null,
    };
  }

  private readonly companionAppId = ConfigUtils.GetParameter(
    "CompanionFeaturePage",
    "AppId",
    ""
  );

  public componentDidMount() {
    Platform.ContentService.GetContentByTagAndType(
      "companion-features",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    )
      .then((response) =>
        this.setState({
          contentSet: response,
        })
      )
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });

    this.getIconFromAppStore(this.companionAppId);
  }

  public getIconFromAppStore = async (appId: string) => {
    const appUrl =
      "https://itunes.apple.com/search?media=software&country=us&term=" + appId;

    await fetch(appUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        this.setState({ appIcon512: data?.results?.[0]?.artworkUrl512 });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ appIcon512: Img("/destiny/logos/tricorn_2_icon.svg") });
      });
  };

  public render() {
    const { appIcon512, contentSet } = this.state;

    return (
      contentSet && (
        <>
          <div className={styles.background} />
          <Grid strictMode={true} isTextContainer={true}>
            <div className={styles.header}>
              {!StringUtils.isNullOrWhiteSpace(appIcon512) && (
                <img src={appIcon512} />
              )}
              <h3>{contentSet.properties["Title"]}</h3>
              <p>{contentSet.properties["Summary"]}</p>
              <div className={styles.appLinks}>
                <div>
                  <a
                    href={
                      "http://itunes.apple.com/us/app/bungie-mobile/" +
                      this.companionAppId
                    }
                    className={styles.btnAppStore}
                    style={{
                      backgroundImage: `url("/img/theme/bungienet/btns/app-store-badges/app-store-badge-${Localizer.CurrentCultureName}.svg")`,
                    }}
                  >
                    {Localizer.Actions.DownloadOnAppStore}
                  </a>
                  <a
                    href="http://play.google.com/store/apps/details?id=com.bungieinc.bungiemobile"
                    className={styles.btnGooglePlay}
                    style={{
                      backgroundImage: `url("/img/theme/bungienet/btns/google-play-badges/google-play-badge-${Localizer.CurrentCultureName}-1.png")`,
                    }}
                  >
                    {Localizer.Actions.GetItOnGooglePlay}
                  </a>
                </div>
              </div>
            </div>
            {contentSet.properties["ContentItems"].map((contentItem) => (
              <GridCol
                cols={4}
                medium={6}
                mobile={12}
                key={`${contentItem.contentId}-${Date.UTC}`}
                className={styles.feature}
              >
                <RegistrationContentItem contentItem={contentItem} />
              </GridCol>
            ))}
          </Grid>
        </>
      )
    );
  }
}
