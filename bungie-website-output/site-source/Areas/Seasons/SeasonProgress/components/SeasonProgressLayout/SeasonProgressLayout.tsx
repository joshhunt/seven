import styles from "./SeasonProgressLayout.module.scss";
import { SeasonDefinition } from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React from "react";

interface SeasonProgressLayoutProps {
  seasonDefinition: SeasonDefinition;
}

const SeasonProgressLayout: React.FC<SeasonProgressLayoutProps> = ({
  children,
  seasonDefinition,
}) => {
  const metaTitle = seasonDefinition.title;
  const metaDesc = seasonDefinition.title;
  const metaImage = seasonDefinition.image;

  return (
    <>
      <BungieHelmet title={metaTitle} description={metaDesc} image={metaImage}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.wrapper}>
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${seasonDefinition.progressPageImage})`,
          }}
        />
        <div className={styles.seasonProgressDisplay}>{children}</div>
      </div>
    </>
  );
};

export default SeasonProgressLayout;
