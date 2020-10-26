import {
  Season11OverlapImageAsset,
  Season11OverlapItem,
} from "../Components/Season11OverlapItem";
import React from "react";
import { SubNavSection } from "@UI/Marketing/MarketingSubNav";
import { Season11DataStore } from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { Localizer } from "@Global/Localizer";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import styles from "./Season11Exotics.module.scss";
import { Season11VerticalSubtitle } from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";
import { Season11AvailableToAll } from "@Areas/Seasons/ProductPages/Season11/Components/Season11AvailableToAll";

export const Season11Exotics = () => {
  return (
    <SubNavSection
      id={"exotics"}
      useRef={Season11DataStore.addIdElementMapping}
    >
      <div className={styles.wrapper}>
        <Season11VerticalSubtitle separator={"//"}>
          {Localizer.Season11.S11ExoticGear}
        </Season11VerticalSubtitle>
        <Season11OverlapItem
          mobileSubtitle={Localizer.Season11.S11ExoticGear}
          size={"small"}
          className={styles.witherhoardWrapper}
          hideLine={true}
          asset={
            <Season11OverlapImageAsset
              className={styles.witherhoard}
              url={Season11Image("S11_ExoticGear_Witherhoard_hero.png")}
            />
          }
          title={Localizer.Season11.ExoticsTitle}
        >
          {Localizer.Season11.ExoticsDesc}
        </Season11OverlapItem>
        <div className={styles.artifactWrapper}>
          <Season11VerticalSubtitle separator={"//"}>
            {Localizer.Season11.S11Artifact}
          </Season11VerticalSubtitle>
          <div
            className={styles.artifactImage}
            style={{
              backgroundImage: `url(${Season11Image(
                "S11_Artfiact_hero_desktop.png"
              )})`,
            }}
          />
          <Season11OverlapItem
            hideLine={true}
            classes={{
              overlap: styles.artifactOverlap,
            }}
            size={"small"}
            asset={null}
            title={Localizer.Season11.ArtifactTitle}
          >
            <Season11AvailableToAll />
            {Localizer.Season11.ArtifactDesc}
          </Season11OverlapItem>
        </div>
      </div>
    </SubNavSection>
  );
};
