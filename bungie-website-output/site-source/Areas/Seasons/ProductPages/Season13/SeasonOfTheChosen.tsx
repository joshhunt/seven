// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Activity13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Activity13";
import { BungieRewards13 } from "@Areas/Seasons/ProductPages/Season13/Sections/BungieRewards13";
import { Calendar13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Calendar13";
import { Exotics13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Exotics13";
import { Helm13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Helm13";
import { Hero13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Hero13";
import { Faq13 } from "@Areas/Seasons/ProductPages/Season13/Sections/SeasonFaq13";
import { SeasonPass13 } from "@Areas/Seasons/ProductPages/Season13/Sections/SeasonPass13";
import { SeasonPassList13 } from "@Areas/Seasons/ProductPages/Season13/Sections/SeasonPassList13";
import { SilverBundle13 } from "@Areas/Seasons/ProductPages/Season13/Sections/SilverBundle13";
import { Story13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Story13";
import { Strikes13 } from "@Areas/Seasons/ProductPages/Season13/Sections/Strikes13";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import { Localizer } from "@Global/Localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./SeasonOfTheChosen.module.scss";

interface SeasonOfTheChosenProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const SeasonOfTheChosen: React.FC<SeasonOfTheChosenProps> = (props) => {
  const [heroRef, setHeroRef] = useState(null);
  const navButtonAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season13Page,
    "Season13NavBuyAnalyticsId",
    ""
  );

  return (
    <div className={styles.all}>
      <BungieHelmet
        title={SeasonsDefinitions.seasonOfTheChosen.title}
        image={SeasonsDefinitions.seasonOfTheChosen.image}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.SolidMainNav),
            SpecialBodyClasses(BodyClasses.NoSpacer),
            SpecialBodyClasses(BodyClasses.HideServiceAlert)
          )}
        />
      </BungieHelmet>
      <Hero13 inputRef={(ref) => setHeroRef(ref)} />
      <MarketingSubNav
        idToElementsMapping={idToElementsMapping}
        stringFinder={(id) => Localizer.Destiny[`Submenu_${id}`]}
        relockUnder={heroRef}
        primaryColor={"ash"}
        accentColor={"teal"}
        buttonProps={{
          children: Localizer.Seasons.MenuCTALabel,
          url: RouteHelper.DestinyBuy(),
          buttonType: "teal",
          analyticsId: navButtonAnalyticsId,
        }}
        withGutter={true}
      />
      <Story13 inputRef={(ref) => (idToElementsMapping["storyOnly"] = ref)} />
      <Helm13 />
      <Activity13
        inputRef={(ref) => (idToElementsMapping["activities"] = ref)}
      />
      <Strikes13 inputRef={(ref) => (idToElementsMapping["strikes"] = ref)} />
      <Exotics13
        inputRef={(ref) => (idToElementsMapping["exoticsGear"] = ref)}
      />
      <SeasonPass13
        inputRef={(ref) => (idToElementsMapping["seasonPass"] = ref)}
      />
      <SeasonPassList13 />
      <BungieRewards13 />
      <SilverBundle13 inputRef={(ref) => ref} />
      <Calendar13 inputRef={(ref) => (idToElementsMapping["calendar"] = ref)} />
      <div className={styles.finalElements}>
        <FirehoseNewsAndMedia tag={"season-13-media"} />
        <Faq13 inputRef={(ref) => (idToElementsMapping["faq"] = ref)} />
      </div>
    </div>
  );
};

export default SeasonOfTheChosen;
