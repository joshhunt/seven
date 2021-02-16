import React from "react";
import styles from "./Season11Hero.module.scss";
import {
  Season11DataStore,
  Season11DataStorePayload,
} from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Img } from "@Helpers";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { Season11PlayButton } from "@Areas/Seasons/ProductPages/Season11/Components/Season11PlayButton";

interface Season11HeroState {
  season11Data: Season11DataStorePayload;
}

export class Season11Hero extends React.Component<{}, Season11HeroState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      season11Data: Season11DataStore.state,
    };
  }

  private readonly showVideo = (id: string) => {
    YoutubeModal.show({
      videoId: id,
    });
  };

  public componentDidMount(): void {
    Season11DataStore.observe((season11Data) =>
      this.setState({ season11Data })
    );
  }

  public render() {
    const { season11Data } = this.state;

    const heroLogo = Img(
      `/destiny/bgs/season11/S11_hero_logo_${Localizer.CurrentCultureName}.png`
    );

    return (
      <div
        className={styles.hero}
        ref={(ref) => ref && Season11DataStore.actions.setHeroRef(ref)}
      >
        {season11Data.heroTrailerYoutubeId && (
          <Season11PlayButton
            onClick={() => this.showVideo(season11Data.heroTrailerYoutubeId)}
          />
        )}

        <div
          className={styles.heroLogo}
          style={{ backgroundImage: `url(${heroLogo})` }}
        />

        <div className={styles.date}>{Localizer.Season11.Date}</div>
      </div>
    );
  }
}
