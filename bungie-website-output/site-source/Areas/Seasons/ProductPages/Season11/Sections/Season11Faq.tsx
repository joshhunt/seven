import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Localizer } from "@Global/Localization/Localizer";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { Button } from "@UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { LegacyRef } from "react";
import styles from "./Season11Faq.module.scss";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface Season11FaqProps {}

export const Season11Faq: React.FC<Season11FaqProps> = (props) => {
  const faq = ConfigUtils.GetParameter("CoreAreaSeasons", "D2SeasonsFAQ", 0);

  return (
    <div className={styles.wrapper} id={"faq"}>
      <Grid isTextContainer={true}>
        <GridCol cols={12} className={styles.FAQ}>
          <div className={styles.smallTitle}>{Localizer.Seasons.FAQTitle}</div>
          <InnerErrorBoundary>
            <InfoBlock articleId={Number(faq)} ignoreStyles={true} />
          </InnerErrorBoundary>
        </GridCol>
      </Grid>
      <div className={styles.buyButton}>
        <Button
          className={styles.seasonsButtonMore}
          url={RouteHelper.NewsArticle(48105)}
          buttonType="teal"
          size={BasicSize.Large}
        >
          {Localizer.Seasons.SeasonsButtonMore}
        </Button>
      </div>
    </div>
  );
};
