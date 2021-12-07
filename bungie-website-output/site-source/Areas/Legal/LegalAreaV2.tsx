import styles from "@Areas/Legal/LegalArea.module.scss";
import { LegalV2Detail } from "@Areas/Legal/LegalV2Detail";
import { LegalV2Subnav } from "@Areas/Legal/LegalV2Subnav";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
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
        <div className={styles.subNav}>
          <LegalV2Subnav />
        </div>
        <div className={styles.legalContent}>
          <LegalV2Detail bannerRef={bannerRef} />
        </div>
      </div>
    </React.Fragment>
  );
};
