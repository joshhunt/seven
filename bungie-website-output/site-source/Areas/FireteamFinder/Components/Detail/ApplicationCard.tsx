// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { InspectPendingPlayer } from "@Areas/FireteamFinder/Components/Detail/InspectPendingPlayer";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { FireteamFinder, Platform, User } from "@Platform";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./ApplicationCard.module.scss";

interface ApplicationCardProps {
  lobbyId: string;
  application: FireteamFinder.DestinyFireteamFinderApplication;
  memberCard: React.ReactNode;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  lobbyId,
  memberCard,
}) => {
  const [user, setUser] = useState<User.GeneralUser>();

  const inspectUser = () => {
    const inspectModal = Modal.open(
      <InspectPendingPlayer
        memberHasJoined={false}
        memberCard={memberCard}
        submitterId={application?.submitterId?.membershipId}
        submitterBungieName={
          user && UserUtils?.getBungieNameFromBnetGeneralUser(user)
        }
        applicationId={application?.applicationId}
        lobbyId={lobbyId}
        closeFunction={() => inspectModal.current.close()}
      />
    );
  };

  useEffect(() => {
    if (application.applicationId) {
      Platform.UserService.GetMembershipDataById(
        application?.submitterId?.membershipId,
        BungieMembershipType.All
      ).then((userData) => {
        userData && setUser(userData.bungieNetUser);
      });
    }
  }, []);

  return (
    <OneLineItem
      itemTitle={<p>{user?.uniqueName}</p>}
      icon={<FaArrowRight className={styles.arrow} />}
      style={{
        backgroundColor: "rgba(245, 245, 245, 0.1)",
        marginBottom: "1rem",
      }}
      flair={
        <Button onClick={inspectUser}>
          {Localizer.Fireteams.InspectButton}
        </Button>
      }
    />
  );
};
