import styles from "@Areas/Legal/LegalArea.module.scss";
import { LegalDetail } from "@Areas/Legal/LegalDetail";
import { LegalSubnav } from "@Areas/Legal/LegalSubnav";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React, { useRef } from "react";

const LegalArea: React.FC = () => {
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
          <LegalSubnav />
        </div>
        <div className={styles.legalContent}>
          <LegalDetail bannerRef={bannerRef} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default LegalArea;
