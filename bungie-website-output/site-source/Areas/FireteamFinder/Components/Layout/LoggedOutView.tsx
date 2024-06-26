import { FireteamFinderErrorViewType } from "@Areas/FireteamFinder/Components/Layout/Layout";
import { FireteamHelpButton } from "@Areas/FireteamFinder/Components/Shared/FireteamHelpButton";
import { FireteamLegacyExperienceButton } from "@Areas/FireteamFinder/Components/Shared/FireteamLegacyExperienceButton";
import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { Img } from "@Helpers";
import { FaRegCalendar } from "@react-icons/all-files/fa/FaRegCalendar";
import { IoPeople } from "@react-icons/all-files/io5/IoPeople";
import { IoSettingsSharp } from "@react-icons/all-files/io5/IoSettingsSharp";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import classNames from "classnames";
import React from "react";

import styles from "./LoggedOutView.module.scss";

interface LoggedOutViewProps {
  errorType: FireteamFinderErrorViewType;
  className?: string;
}

export const LoggedOutView: React.FC<LoggedOutViewProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;

  const errorCopy: Record<FireteamFinderErrorViewType, string> = {
    NoCharacter: "",
    None: "",
    NotGuardianRankFive: "",
    SignedOut: "",
  };
  errorCopy["SignedOut"] = fireteamsLoc.loggedOutError as string;
  errorCopy["NoCharacter"] = Localizer.clans
    .ADestiny2CharacterIsRequired as string;
  errorCopy[
    "NotGuardianRankFive"
  ] = fireteamsLoc.RequiresGuardianRankFive as string;

  const fireteamFinder = fireteamsLoc.FireteamFinder;
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
      <h1>
        {fireteamFinder}
        <span className={styles.beta}>{Localizer.fireteams.beta}</span>
      </h1>
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
