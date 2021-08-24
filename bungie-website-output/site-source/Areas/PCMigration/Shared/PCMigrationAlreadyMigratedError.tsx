// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import {
  GlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { User } from "@Platform";
import styles from "./PCMigrationAlreadyUsedError.module.scss";
import * as Globals from "@Enum";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";

export type AlreadyTransferredErrorType = "None" | "Blizzard" | "Steam";

interface IPCMigrationAlreadyMigratedErrorProps
  extends GlobalStateComponentProps {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  errorType: AlreadyTransferredErrorType;
  isComplete: boolean;
  statusResponse: User.BlizzardToSteamMigrationStatusResponse;
  fromHomePage: boolean;
}

interface IPCMigrationAlreadyMigratedErrorState {}

/**
 * PCMigrationAlreadyMigratedError - The error view that displays specifically when a source or destination account was already used in pcmigration
 *  *
 * @param {IPCMigrationAlreadyMigratedErrorProps} props
 * @returns
 */
export class PCMigrationAlreadyMigratedError extends React.Component<
  IPCMigrationAlreadyMigratedErrorProps,
  IPCMigrationAlreadyMigratedErrorState
> {
  private readonly pcmigrationLoc = Localizer.PCMigration;

  constructor(props: IPCMigrationAlreadyMigratedErrorProps) {
    super(props);

    this.state = {};
  }

  public render() {
    if (typeof this.props.globalState.credentialTypes === "undefined") {
      //if users log out and credentialTypes becomes undefined

      return null;
    }

    const currentBlizzardCred = this.props.globalState.credentialTypes.find(
      (c) => c.credentialType === Globals.BungieCredentialType.BattleNetId
    );
    const currentSteamCred = this.props.globalState.credentialTypes.find(
      (c) => c.credentialType === Globals.BungieCredentialType.SteamId
    );

    const alreadyUsedHeader = this.props.fromHomePage
      ? "ACCOUNT ERROR"
      : this.pcmigrationLoc.TransferError;
    const gotoLinking = this.pcmigrationLoc.AccountLinking;
    const alreadyUsedSteam =
      typeof currentBlizzardCred !== "undefined"
        ? this.pcmigrationLoc.ThisSteamAccountHasAlready
        : this.pcmigrationLoc.ThisSteamAccountHasAlreadyGeneric;
    const alreadyUsedBlizzard =
      typeof currentSteamCred !== "undefined"
        ? this.pcmigrationLoc.ThisBattleNetHasAlready
        : this.pcmigrationLoc.ThisBattleNetAccountHasGeneric;

    const currentBlizzardUser =
      typeof currentBlizzardCred !== "undefined" &&
      currentBlizzardCred.credentialDisplayName !== "" ? (
        <span className={styles.currentBlizzardUser}>
          {currentBlizzardCred.credentialDisplayName}
        </span>
      ) : (
        this.pcmigrationLoc.AccountWithoutBattletag
      );

    const currentSteamUser =
      typeof currentSteamCred !== "undefined"
        ? currentSteamCred.credentialDisplayName
        : "";
    const currentSteamUserLink: React.ReactNode =
      currentSteamUser !== ""
        ? this.steamProfileAnchor(
            currentSteamUser,
            currentSteamCred.credentialAsString,
            true
          )
        : null;

    const resolveThisBy = this.pcmigrationLoc.YouCanResolveThisBy;

    let useUnlinkingInstructions = false;

    let instructions: React.ReactNode[] = [];
    let resolveInstructions: React.ReactNode[] = [];

    // these are the instructions if user has not linked both Blizzard and Steam yet
    if (
      typeof currentBlizzardCred === "undefined" ||
      typeof currentSteamCred === "undefined"
    ) {
      if (this.props.errorType === "Blizzard") {
        const steamUserUsedLink = this.steamProfileAnchor(
          this.props.statusResponse.DestinationSteamDisplayName,
          this.props.statusResponse.DestinationSteamId,
          false
        );

        if (this.props.isComplete) {
          instructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardComplete2,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
                steamUserUsed: steamUserUsedLink,
              }
            ),
          ];

          resolveInstructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardComplete3,
              { steamUserUsed: steamUserUsedLink }
            ),
          ];
        } else {
          instructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardIncomplete1,
              { steamUserUsed: steamUserUsedLink }
            ),
          ];

          resolveInstructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardIncomplete3,
              { steamUserUser: steamUserUsedLink }
            ),
          ];
        }
      }

      if (this.props.errorType === "Steam") {
        const steamUserUsedLink = this.steamProfileAnchor(
          this.props.statusResponse.DestinationSteamDisplayName,
          this.props.statusResponse.DestinationSteamId,
          true
        );

        if (this.props.isComplete) {
          instructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.UsedblizzarduserAlready,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
              }
            ),
          ];

          resolveInstructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardComplete3,
              { steamUserUsed: steamUserUsedLink }
            ),
          ];
        } else {
          instructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveSteamIncomplete2,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
              }
            )
          );

          resolveInstructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveSteamIncomplete4,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
              }
            )
          );
        }
      }
    } else {
      if (this.props.errorType === "Blizzard") {
        const steamUserUsedLink = this.steamProfileAnchor(
          this.props.statusResponse.DestinationSteamDisplayName,
          this.props.statusResponse.DestinationSteamId,
          false
        );

        if (this.props.isComplete) {
          //You are currently logged into your {currentSteamUser} Steam account.

          //You have already moved the contents of this Blizzard account to your {steamUserUsed} Steam account.

          //Log into {steamUserUsed} Steam account and start playing.

          if (currentSteamUserLink !== null) {
            instructions.push(
              Localizer.FormatReact(
                Localizer.Pcmigration.resolveBlizzardComplete1,
                { currentSteamUser: currentSteamUserLink }
              )
            );
          }

          instructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardComplete2,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
                steamUserUsed: steamUserUsedLink,
              }
            )
          );

          resolveInstructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardComplete3,
              { steamUserUsed: steamUserUsedLink }
            ),
          ];
        } else {
          useUnlinkingInstructions = true;

          //This Blizzard account has already initiated a transfer to your {steamUserUsed} Steam account but it is incomplete.

          //Unlink the current {currentSteamUser} Account.

          //Relink {steamUserUser} Steam Account and try again.

          instructions = [
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardIncomplete1,
              { steamUserUsed: steamUserUsedLink }
            ),
          ];

          if (currentSteamUserLink !== null) {
            resolveInstructions.push(
              Localizer.FormatReact(
                Localizer.Pcmigration.resolveBlizzardIncomplete2,
                { currentSteamUser: currentSteamUserLink }
              )
            );
          }

          resolveInstructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveBlizzardIncomplete3,
              { steamUserUser: steamUserUsedLink }
            )
          );
        }
      } else if (this.props.errorType === "Steam") {
        if (this.props.isComplete) {
          //Unlink Steam User {currentSteamUser}

          //Create a new Steam Account

          //Migrate {currentBlizzardUser} to your new Steam Account

          if (currentSteamUserLink !== null) {
            resolveInstructions.push(
              Localizer.FormatReact(
                Localizer.Pcmigration.resolveSteamComplete1,
                { currentSteamUser: currentSteamUserLink }
              )
            );
          }

          resolveInstructions.push(Localizer.Pcmigration.resolveSteamComplete2);
          resolveInstructions.push(
            Localizer.FormatReact(Localizer.Pcmigration.resolveSteamComplete3, {
              currentBlizzardUser: currentBlizzardUser,
            })
          );
        } else {
          useUnlinkingInstructions = true;

          //You are currently logged into your {currentBlizzardUser} Blizzard account

          //You have already initiated a transfer to the current Steam account from {usedBlizzardUser} Blizzard account but it is incomplete.

          //Unlink Blizzard User {currentBlizzardUser}

          //Relink Blizzard User {usedBlizzardUser} and try again.

          if (currentBlizzardUser !== "") {
            instructions.push(
              Localizer.FormatReact(
                Localizer.Pcmigration.resolveSteamIncomplete1,
                { currentBlizzardUser: currentBlizzardUser }
              )
            );
          }

          instructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveSteamIncomplete2,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
              }
            )
          );

          if (currentBlizzardUser !== "") {
            resolveInstructions.push(
              Localizer.FormatReact(
                Localizer.Pcmigration.resolveSteamIncomplete3,
                { currentBlizzardUser: currentBlizzardUser }
              )
            );
          }

          resolveInstructions.push(
            Localizer.FormatReact(
              Localizer.Pcmigration.resolveSteamIncomplete4,
              {
                usedBlizzardUser: (
                  <span className={styles.sourceBlizzardUser}>
                    {this.props.statusResponse.SourceBlizzardUniqueDisplayName}
                  </span>
                ),
              }
            )
          );
        }
      }
    }

    return (
      <div className={styles.alreadyUsedErrorView}>
        <Icon iconName="warning" iconType="material" />
        <h2 className="section-header">{alreadyUsedHeader}</h2>
        <p>
          {this.props.errorType === "Steam"
            ? alreadyUsedSteam
            : alreadyUsedBlizzard}
        </p>
        <div className={styles.resolve}>
          <div className={styles.instructionsIntro}>
            {this.renderInstructions(instructions)}
          </div>
          <strong>{resolveThisBy}</strong>
          <div className={styles.unlinkInstructions}>
            {this.renderInstructions(resolveInstructions)}
          </div>
          {useUnlinkingInstructions && (
            <Button
              buttonType={"gold"}
              url={RouteHelper.Settings({
                membershipId: this.props.globalState.loggedInUser.user
                  .membershipId,
                membershipType: 254,
                category: "Accounts",
              })}
            >
              {gotoLinking}
            </Button>
          )}
        </div>
      </div>
    );
  }

  private renderInstructions(
    instructionP: React.ReactNode[]
  ): React.ReactElement[] {
    return instructionP.map((value: React.ReactNode, index: number) => {
      return <p key={index}>{value}</p>;
    });
  }

  private steamProfileAnchor(
    steamDisplayName: string,
    steamId: string,
    isLoggedInUser: boolean
  ): React.ReactNode {
    const steamProfileUrl = `https://steamcommunity.com/profiles/${encodeURIComponent(
      steamId
    )}`;

    const displayName = `${steamDisplayName}(${steamId})`;

    return (
      <Anchor
        className={classNames({
          [styles.steamCurrentUser]: isLoggedInUser,
          [styles.steamDestinationUser]: !isLoggedInUser,
        })}
        url={steamProfileUrl}
      >
        {displayName}
      </Anchor>
    );
  }
}
