import React, { useEffect } from "react";
import styles from "./Season11.module.scss";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { useDataStore } from "@Global/DataStore";
import { Season11DataStore } from "./Season11DataStore";
import { Season11Hero } from "./Sections/Season11Hero";
import { Localizer } from "@Global/Localization/Localizer";
import { Season11Story } from "./Sections/Season11Story";
import { Season11Dungeon } from "./Sections/Season11Dungeon";
import { Season11Exotics } from "./Sections/Season11Exotics";
import { Season11Gear } from "./Sections/Season11Gear";
import { Season11Progression } from "@Areas/Seasons/ProductPages/Season11/Sections/Season11Progression";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { RouteHelper } from "@Routes/RouteHelper";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Season11Calendar } from "@Areas/Seasons/ProductPages/Season11/Sections/Season11Calendar";
import { Season11Faq } from "@Areas/Seasons/ProductPages/Season11/Sections/Season11Faq";
import { Responsive, ResponsiveContext } from "@Boot/Responsive";

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const Season11 = () => {
  const s11Data = useDataStore(Season11DataStore);
  const responsive = useDataStore(Responsive);

  const { title, image } = SeasonsDefinitions.season11;

  useEffect(() => {
    Season11DataStore.initialize();
  }, []);

  return (
    <ResponsiveContext.Provider value={responsive}>
      <BungieHelmet title={title} image={image}>
        <body
          className={SpecialBodyClasses(
            BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
          )}
        />
      </BungieHelmet>
      <div className={styles.wrapper}>
        <Season11Hero />
        <MarketingSubNav
          idToElementsMapping={idToElementsMapping}
          relockUnder={s11Data.heroRef}
          stringFinder={(id) => Localizer.Season11[`id-${id}`]}
          primaryColor={"darkgray"}
          accentColor={"teal"}
          buttonProps={{
            children: Localizer.Seasons.MenuCTALabel,
            url: RouteHelper.DestinyBuy(),
            buttonType: "teal",
          }}
        />
        <Season11Story
          inputRef={(ref) => (idToElementsMapping["story"] = ref)}
        />
        <Season11Dungeon
          inputRef={(ref) => (idToElementsMapping["dungeon"] = ref)}
        />
        <Season11Exotics
          inputRef={(ref) => (idToElementsMapping["exotics"] = ref)}
        />
        <Season11Gear inputRef={(ref) => (idToElementsMapping["gear"] = ref)} />
        <Season11Progression
          inputRef={(ref) => (idToElementsMapping["progression"] = ref)}
        />
        <Season11Calendar />
        <div id={"media"} className={styles.newsMedia}>
          <FirehoseNewsAndMedia tag={"S11_product_page_media"} />
        </div>
        <Season11Faq />
      </div>
    </ResponsiveContext.Provider>
  );
};

export default Season11;
