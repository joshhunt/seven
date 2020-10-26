// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { RegistrationContentItem } from "@Areas/Registration/Shared/RegistrationContentItem";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import styles from "./Apps.module.scss";
import { PlatformError } from "@CustomErrors";
import { Localizer } from "@Global/Localizer";
import { Content, Platform } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";

interface AppsProps {}

interface AppsState {
  contentRenderable: Content.ContentItemPublicContract;
}

export class Apps extends React.Component<AppsProps, AppsState> {
  public componentDidMount() {
    //load the content set
    Platform.ContentService.GetContentByTagAndType(
      "apps-content-set",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    )
      .then((response) =>
        this.setState({
          contentRenderable: response,
        })
      )
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  }

  constructor(props: AppsProps) {
    super(props);

    this.state = {
      contentRenderable: null,
    };
  }

  public render() {
    if (this.state.contentRenderable === null) {
      return <SpinnerContainer loading={true} />;
    }

    const registrationLoc = Localizer.Registration;

    const content = this.state.contentRenderable.properties;

    const pageHasContent = content["ContentItems"]?.length > 0;

    const pageHasNoContent = registrationLoc.ThereWasAProblemLoading;

    const metaImage = "/7/ca/bungie/bgs/header_benefits.png";
    const metaTitle = Localizer.Registration.BungieCompanionApps;
    const metaSubtitle = Localizer.Registration.BungieCompanionApps;

    return (
      <React.Fragment>
        <BungieHelmet
          title={metaTitle}
          image={metaImage}
          description={metaSubtitle}
        />
        <Grid className={styles.bodyContent}>
          <GridCol cols={12}>
            {!pageHasContent && <p>{pageHasNoContent}</p>}
            {pageHasContent && (
              <RegistrationContentItem
                contentItem={this.state.contentRenderable}
              />
            )}
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}
