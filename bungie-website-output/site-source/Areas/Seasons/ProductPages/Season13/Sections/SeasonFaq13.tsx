// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "./SeasonFaq13.module.scss";
import { Localizer } from "@bungie/localization";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { LegacyRef } from "react";

interface Faq13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Faq13: React.FC<Faq13Props> = (props) => {
  const faq = ConfigUtils.GetParameter("CoreAreaSeasons", "D2SeasonsFAQ", 0);
  const notSpanish =
    Localizer.CurrentCultureName !== "es" &&
    Localizer.CurrentCultureName !== "es-mx";

  return (
    <div id={"faq"} ref={notSpanish ? props.inputRef : null}>
      <Grid isTextContainer={true}>
        <GridCol cols={12} className={styles.FAQ}>
          <div className={styles.smallTitle}>{Localizer.Seasons.FAQTitle}</div>
          <InnerErrorBoundary>
            <InfoBlock articleId={faq} ignoreStyles={true} />
          </InnerErrorBoundary>
        </GridCol>
      </Grid>
    </div>
  );
};
