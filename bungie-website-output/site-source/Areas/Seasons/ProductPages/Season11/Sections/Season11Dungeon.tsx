import {
  Season11OverlapImageAsset,
  Season11OverlapItem,
} from "../Components/Season11OverlapItem";
import React, { LegacyRef } from "react";
import { Season11DataStore } from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { Localizer } from "@bungie/localization";
import styles from "./Season11Dungeon.module.scss";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import { Season11PotentialVideo } from "@Areas/Seasons/ProductPages/Season11/Components/Season11PotentialVideo";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Season11VerticalSubtitle } from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";
import { Season11AvailableToAll } from "@Areas/Seasons/ProductPages/Season11/Components/Season11AvailableToAll";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";

interface Season11DungeonProps {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Season11Dungeon: React.FC<Season11DungeonProps> = (props) => {
  const season11Data = useDataStore(Season11DataStore);

  return (
    <div id={"dungeon"} ref={props.inputRef}>
      <div
        className={styles.wrapper}
        style={{
          backgroundImage: `url(${Season11Image(
            "S11_Dungeon_Armor_Background.jpg"
          )})`,
        }}
      >
        <Season11VerticalSubtitle separator={"//"}>
          {Localizer.Season11.S11Dungeon}
        </Season11VerticalSubtitle>
        <Season11OverlapItem
          classes={{
            overlap: styles.prochecyWrapper,
          }}
          asset={
            <Season11PotentialVideo
              videoId={season11Data.prophecyTrailerYoutubeId}
            >
              <Season11OverlapImageAsset
                url={Season11Image("S11_Dungeon_video_FPO_desktop.jpg")}
              />
            </Season11PotentialVideo>
          }
          title={Localizer.Season11.DungeonTitle}
          mobileSubtitle={Localizer.Season11.S11Dungeon}
        >
          <Season11AvailableToAll />
          <div>{Localizer.Season11.DungeonDesc}</div>
        </Season11OverlapItem>
        <div className={styles.daitoBoxWrapper}>
          <div
            className={styles.daito}
            style={{
              backgroundImage: `url(${Season11Image(
                "S11_Dungeon_Guardians.png"
              )})`,
            }}
          >
            <div className={styles.daitoBox}>
              <div className={styles.line1}>{Localizer.Season11.Daito1}</div>
              <div className={styles.line2}>{Localizer.Season11.Daito2}</div>
              <div className={styles.line3}>{Localizer.Season11.Daito3}</div>
            </div>
          </div>
        </div>
        <div className={styles.daitoBoxWrapper}>
          <div className={styles.rewards}>
            <div className={styles.rewardsBox}>
              <div className={styles.rewardsLogo} />
              <Anchor
                url={RouteHelper.Rewards()}
                className={styles.rewardsImage}
              >
                <div className={styles.innerImage} />
              </Anchor>
              <div className={styles.rewardsDesc}>
                {Localizer.Season11.BungieRewardsDesc}
              </div>
              <div className={styles.gradient} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
