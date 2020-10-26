import {
  Season11OverlapImageAsset,
  Season11OverlapItem,
} from "../Components/Season11OverlapItem";
import React from "react";
import { Season11TripleBox } from "../Components/Season11TripleBox";
import { Season11DataStore } from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { SubNavSection } from "@UI/Marketing/MarketingSubNav";
import styles from "./Season11Story.module.scss";
import { Localizer } from "@Global/Localizer";
import { Season11GridBoundary } from "@Areas/Seasons/ProductPages/Season11/Components/Season11GridBoundary";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import { Season11VerticalSubtitle } from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";

export const Season11Story = () => {
  return (
    <SubNavSection
      className={styles.wrapper}
      id={"story"}
      useRef={Season11DataStore.addIdElementMapping}
    >
      <Season11VerticalSubtitle separator={"//"} className={styles.subtitle}>
        {Localizer.Season11.S11StoryActivities}
      </Season11VerticalSubtitle>
      <Season11OverlapItem
        title={Localizer.Season11.Story1Title}
        mobileSubtitle={Localizer.Season11.S11StoryActivities}
        fade={true}
        className={styles.story1}
        asset={
          <Season11OverlapImageAsset
            url={Season11Image("S11_Story_EyesUp_desktop.jpg")}
          />
        }
      >
        {Localizer.Season11.Season1Desc}
      </Season11OverlapItem>
      <Season11GridBoundary size={12}>
        <div
          className={styles.tree}
          style={{
            backgroundImage: `url(${Season11Image(
              "S11_Story_Jupiter_middle_desktop.jpg"
            )})`,
          }}
        />
      </Season11GridBoundary>
      <Season11OverlapItem
        title={Localizer.Season11.Story2Title}
        fade={true}
        className={styles.story2}
        asset={
          <Season11OverlapImageAsset
            url={Season11Image("S11_Story_shadow_desktop.jpg")}
          />
        }
      >
        {Localizer.Season11.Story2Desc}
      </Season11OverlapItem>
      <Season11TripleBox
        classes={{
          box: styles.storyBox,
        }}
        items={[
          {
            title: Localizer.Season11.Story2Box1Title,
            description: Localizer.Season11.Story2Box1Desc,
            backgroundImage: `url(${Season11Image(
              "S11_Story_Darkness_Desktop.jpg"
            )})`,
          },
          {
            title: Localizer.Season11.Story2Box2Title,
            description: Localizer.Season11.Story2Box2Desc,
            backgroundImage: `url(${Season11Image(
              "S11_Story_Interference_Desktop.jpg"
            )})`,
          },
          {
            title: Localizer.Season11.Story2Box3Title,
            description: Localizer.Season11.Story2Box3Desc,
            backgroundImage: `url(${Season11Image(
              "S11_Story_Contact_Desktop.jpg"
            )})`,
          },
        ]}
      />
    </SubNavSection>
  );
};
