import { Season11OverlapItem } from "../Components/Season11OverlapItem";
import React, { LegacyRef } from "react";
import { Season11TripleBox } from "@Areas/Seasons/ProductPages/Season11/Components/Season11TripleBox";
import { Season11DataStore } from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { Localizer } from "@bungie/localization";
import styles from "./Season11Gear.module.scss";
import { Season11PotentialVideo } from "@Areas/Seasons/ProductPages/Season11/Components/Season11PotentialVideo";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Season11VerticalSubtitle } from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Responsive } from "@Boot/Responsive";

interface Season11GearProps {}

export const Season11Gear: React.FC<Season11GearProps> = (props) => {
  const season11Data = useDataStore(Season11DataStore);
  const responsive = useDataStore(Responsive);

  const ShowImageModal = (imagePath: string, alt: string) => {
    if (!responsive.mobile) {
      Modal.open(
        <img
          src={imagePath}
          alt={alt}
          style={{ display: "block", maxWidth: "100%" }}
        />,
        {
          isFrameless: true,
        }
      );
    } else {
      window.open(imagePath);
    }
  };

  return (
    <div id={"gear"}>
      <div className={styles.gearWrapper}>
        <Season11VerticalSubtitle separator={"//"}>
          {Localizer.Season11.S11GearRewards}
        </Season11VerticalSubtitle>
        <Season11OverlapItem
          mobileSubtitle={Localizer.Season11.S11GearRewards}
          asset={null}
          title={
            <span className={styles.gearTitle}>
              {Localizer.Season11.GearTitle}
            </span>
          }
          className={styles.gear}
          disableOverlap={true}
          classes={{
            mediaWrapper: styles.gearMedia,
          }}
        >
          {Localizer.Season11.GearDesc}
        </Season11OverlapItem>
      </div>
      <div className={styles.tripleBoxWrapper}>
        <Season11TripleBox
          classes={{
            root: styles.tripleBox,
            box: styles.tbBox,
            title: styles.tbTitle,
            description: styles.tbDesc,
          }}
          items={[
            {
              title: Localizer.Season11.GearBox1Title,
              description: (
                <span className={styles.tbDescSpan}>
                  <i className={styles.passIcon} />{" "}
                  {Localizer.Seasonoftheworthy.RequiresPass}
                </span>
              ),
              onItemClick: () =>
                ShowImageModal(
                  Season11Image("S11_ExoticTraceRifle.jpg"),
                  Localizer.Season11.GearBox1Title
                ),
            },
            {
              backgroundImage: `url(${Season11Image(
                "S11_GearRewards_boost_thumbnail_progression.jpg"
              )})`,
              title: Localizer.Season11.GearBox2Title,
              description: (
                <span className={styles.tbDescSpan}>
                  <i className={styles.passIcon} />{" "}
                  {Localizer.Seasonoftheworthy.RequiresPass}
                </span>
              ),
              onItemClick: () =>
                ShowImageModal(
                  Season11Image("S11_Progression_Boost_Engrams.jpg"),
                  Localizer.Season11.GearBox1Title
                ),
            },
            {
              backgroundImage: `url(${Season11Image(
                "S11_GearRewards_rifle_thumbnail_seasona_armor.jpg"
              )})`,
              title: Localizer.Season11.GearBox3Title,
              description: (
                <span className={styles.tbDescSpan}>
                  <i className={styles.freeIcon} />{" "}
                  {Localizer.Seasonoftheworthy.FreeToAll}
                </span>
              ),
              onItemClick: () =>
                ShowImageModal(
                  Season11Image("S11_SeasonalArmor.jpg"),
                  Localizer.Season11.GearBox1Title
                ),
            },
          ]}
          render={(i, children) =>
            i === 0 ? (
              <Season11PotentialVideo
                key={i}
                videoId={season11Data.exoticTrailerYoutubeId}
                className={styles.videoBox}
                nonVideoClick={() =>
                  ShowImageModal(
                    Season11Image("S11_ExoticTraceRifle.jpg"),
                    Localizer.Season11.GearBox1Title
                  )
                }
                playButtonClasses={{
                  root: styles.videoButton,
                }}
              >
                {children}
              </Season11PotentialVideo>
            ) : (
              children
            )
          }
        />
      </div>
    </div>
  );
};
