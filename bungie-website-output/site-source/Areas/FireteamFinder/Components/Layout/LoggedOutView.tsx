import { FireteamFinderErrorViewType } from "@Areas/FireteamFinder/Components/Layout/Layout";
import { FireteamHelpButton } from "@Areas/FireteamFinder/Components/Shared/FireteamHelpButton";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { FaRegCalendar } from "@react-icons/all-files/fa/FaRegCalendar";
import { IoPeople } from "@react-icons/all-files/io5/IoPeople";
import { IoSettingsSharp } from "@react-icons/all-files/io5/IoSettingsSharp";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";

import styles from "./LoggedOutView.module.scss";

interface LoggedOutViewProps {
  errorType: FireteamFinderErrorViewType;
  className?: string;
}

export const LoggedOutView: React.FC<LoggedOutViewProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const MinimumLifetimeGuardianRank = ConfigUtils.GetParameter(
    "FireteamFinderCreationGuardianRankRequirement",
    "MinimumLifetimeGuardianRank",
    3
  );

  const errorCopy: Record<FireteamFinderErrorViewType, string> = {
    NoCharacter: "",
    NotHighEnoughRank: "",
    SignedOut: "",
  };
  errorCopy["SignedOut"] = fireteamsLoc.loggedOutError as string;
  errorCopy["NoCharacter"] = Localizer.clans
    .ADestiny2CharacterIsRequired as string;
  errorCopy[
    "NotHighEnoughRank"
  ] = Localizer.Format(fireteamsLoc.NotHighEnoughRank, {
    minimumRank: MinimumLifetimeGuardianRank,
  }) as string;

  const signIn = Localizer.Registration.SignIn;
  const signInClick = () => {
    const signInModal = Modal.signIn(() => {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
      signInModal.current.close();
    });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const iconBlocks = [
    {
      icon: <IoPeople />,
      copy: fireteamsLoc.findPlayersValueProp,
    },
    {
      icon: <FaRegCalendar />,
      copy: fireteamsLoc.scheduleEventsValueProp,
    },
    {
      icon: <IoSettingsSharp />,
      copy: fireteamsLoc.manageEventsValueProp,
    },
  ];

  return (
    <div className={classNames(styles.layout, props.className)}>
      <p className={styles.label}>{errorCopy[props.errorType]}</p>
      <div className={styles.buttonContainer}>
        {props.errorType === "SignedOut" ? (
          <Button
            buttonType={"gold"}
            onClick={() => signInClick()}
            className={styles.loggedOutViewButton}
          >
            {signIn}
          </Button>
        ) : (
          <Button
            buttonType={"gold"}
            onClick={() => refreshPage()}
            className={styles.loggedOutViewButton}
          >
            {fireteamsLoc.refreshPage}
          </Button>
        )}
        <FireteamHelpButton />
      </div>
      <div className={styles.blockContainer}>
        {iconBlocks?.map((block) => (
          <div className={styles.block} key={block.copy}>
            {block.icon}
            <p>{block.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
