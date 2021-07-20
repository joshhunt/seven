import styles from "@Areas/Legal/LegalArea.module.scss";
import { LegalV2Detail } from "@Areas/Legal/LegalV2Detail";
import { LegalV2Subnav } from "@Areas/Legal/LegalV2Subnav";
import { Localizer } from "@Global/Localization/Localizer";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useRef } from "react";

export const LegalAreaV2: React.FC = () => {
  // We'll pass this into the detail page so it can create a portal to this element for the title
  const bannerRef = useRef<HTMLDivElement | null>(null);

  return (
    <React.Fragment>
      <BungieHelmet
        title={Localizer.Helptext.BungieLegal}
        image={BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.headerBungie} ref={bannerRef} />
      <div className={styles.container}>
        <Grid className={styles.subNav}>
          <GridCol cols={12}>
            <LegalV2Subnav />
          </GridCol>
        </Grid>
        <Grid className={styles.legalContent}>
          <GridCol cols={12}>
            <LegalV2Detail bannerRef={bannerRef} />
          </GridCol>
        </Grid>
      </div>
    </React.Fragment>
  );
};
