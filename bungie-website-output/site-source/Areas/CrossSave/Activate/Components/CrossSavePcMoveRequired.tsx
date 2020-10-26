// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CrossSavePcMoveRequired.module.scss";
import { Localizer } from "@Global/Localizer";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { Modal, ModalOverflowTypes } from "@UI/UIKit/Controls/Modal/Modal";
import { Anchor } from "@UI/Navigation/Anchor";

// Required props
interface ICrossSavePcMoveRequiredProps {}

// Default props - these will have values set in CrossSavePcMoveRequired.defaultProps
interface DefaultProps {}

type Props = ICrossSavePcMoveRequiredProps & DefaultProps;

interface ICrossSavePcMoveRequiredState {}

/**
 * CrossSavePcMoveRequired - Shows if PC Move is required for Cross Save
 *  *
 * @param {ICrossSavePcMoveRequiredProps} props
 * @returns
 */
export class CrossSavePcMoveRequired extends React.Component<
  Props,
  ICrossSavePcMoveRequiredState
> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const description = Localizer.Format(
      Localizer.Crosssave.PCMoveModalChoice,
      {
        timeOfMigration: Localizer.Pcmigration.HeaderTimeMoving,
      }
    );

    return (
      <Modal
        className={styles.modal}
        open={true}
        preventUserClose={true}
        isFrameless={true}
        overflowType={ModalOverflowTypes.scrolloutsidemodal}
      >
        <div className={styles.header}>
          <div className={styles.steamImage} />
        </div>
        <div className={styles.pcMoveRequired}>
          <h2>{Localizer.Crosssave.PCMoveModalTitle}</h2>
          <p className={styles.description}>{description}</p>
          <Button
            caps={true}
            buttonType={"gold"}
            url={RouteHelper.PCMigration({ crossSavePrompt: "true" })}
          >
            {Localizer.Crosssave.PCMoveModalMigrateButton}
          </Button>
          <p>{Localizer.Crosssave.PCMoveModalOr}</p>
          <Button
            caps={true}
            buttonType={"white"}
            url={RouteHelper.Settings({ category: "Accounts" })}
          >
            {Localizer.Crosssave.PCMoveUnlinkButton}
          </Button>
          <div className={styles.learnMoreLink}>
            <Anchor url={RouteHelper.PCMigration()}>
              {Localizer.Crosssave.PCMoveLearnMore}
            </Anchor>
          </div>
        </div>
      </Modal>
    );
  }
}
