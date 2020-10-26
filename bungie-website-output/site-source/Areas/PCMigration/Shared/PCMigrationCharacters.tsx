import React from "react";
import styles from "./PCMigrationModal.module.scss";
import * as Globals from "@Enum";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import classNames from "classnames";
import { Localizer } from "@Global/Localizer";
import { IPCMigrationCharacterDisplay } from "@UI/User/PCMigrationUserDataStore";

interface IPCMigrationCharactersProps {
  characterDisplays: IPCMigrationCharacterDisplay[];
}

export class PCMigrationCharacters extends React.Component<
  IPCMigrationCharactersProps
> {
  constructor(props) {
    super(props);
  }

  public render() {
    const charactersHeaderLabel = Localizer.Pcmigration.characters;
    const charactersHeaderSubtitleLabel =
      Localizer.Pcmigration.yourcharactersgearhistory;
    const noCharactersHeaderSubtitleLabel = Localizer.Pcmigration.noCharacters;

    if (this.props.characterDisplays.length > 0) {
      return (
        <React.Fragment>
          <div
            className={classNames(
              styles.detailContainer,
              styles.characterDetail
            )}
          >
            <h4 className="section-header">{charactersHeaderLabel}</h4>
            <p className={styles.subtitle}>{charactersHeaderSubtitleLabel}</p>
            <div className="destinyCharacters">
              {this.renderTheCharacters()}
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div
            className={classNames(
              styles.detailContainer,
              styles.characterDetail
            )}
          >
            <h4 className="section-header">{charactersHeaderLabel}</h4>
            <p className={styles.subtitle}>{noCharactersHeaderSubtitleLabel}</p>
          </div>
        </React.Fragment>
      );
    }
  }

  private renderTheCharacters() {
    const platformCharacters = this.props.characterDisplays;

    return (
      <React.Fragment>
        {platformCharacters.map((character, index) => (
          <OneLineItem
            key={index}
            itemTitle={character.title}
            size={BasicSize.Small}
            flair={character.level}
            icon={<IconCoin iconImageUrl={character.iconPath} />}
          />
        ))}
      </React.Fragment>
    );
  }
}
