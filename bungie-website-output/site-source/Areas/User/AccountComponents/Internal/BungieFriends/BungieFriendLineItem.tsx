// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { RemoveFriendModal } from "@Areas/User/AccountComponents/Internal/BungieFriends/RemoveFriendModal";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, PlatformErrorCodes } from "@Enum";
import { Friends, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import {
  FriendLineItem,
  LineItemRelevantProps,
} from "@UIKit/Companion/FriendLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useState } from "react";
import styles from "../../BungieFriends.module.scss";
import { BungieFriendsSectionType } from "./BungieFriendsSection";

interface BungieFriendLineItemProps extends LineItemRelevantProps {
  bungieFriend: Friends.BungieFriend;
  section: BungieFriendsSectionType;
}

export const BungieFriendLineItem: React.FC<BungieFriendLineItemProps> = (
  props
) => {
  const { bungieFriend, section } = props;
  const friendsLoc = Localizer.friends;
  const [buttonRecentlyClicked, setButtonRecentlyClicked] = useState(false);

  /** PendingRecentlyAccepted indicates that the pending friend request has been recently clicked and was to accept, if null: has not been recently clicked, if false: has been clicked and was concel action */
  const [pendingRecentlyAccepted, setPendingRecentlyAccepted] = useState<
    boolean
  >(null);
  const [error, setError] = useState<PlatformError>(null);
  const membershipId = bungieFriend?.bungieNetUser?.membershipId;
  const membershipIdForProfile =
    membershipId || bungieFriend?.lastSeenAsMembershipId;

  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);

  const removedFriend = () => {
    setError(null);
    setButtonRecentlyClicked(true);
    setShowRemoveFriendModal(false);
  };

  const errorRemovingFriend = (e: PlatformError) => {
    setShowRemoveFriendModal(false);
    Modal.open(friendsLoc.RemovingFriendFailed);
    setError(e);
  };

  const removeFriendRequest = () => {
    const cancelFunction =
      section === "pendingRequests"
        ? Platform.SocialService.DeclineFriendRequest
        : Platform.SocialService.RemoveFriendRequest;

    if (section === "pendingRequests" || section === "outgoingRequests") {
      return cancelFunction(membershipId)
        .then((response) => {
          setError(null);

          if (section === "pendingRequests") {
            setPendingRecentlyAccepted(false);
          }
          // this runs even if it is a pending request even though that value is not used in pending requests, because it should still be kept up to date if it is used in the future
          // the reason we don't check both is to avoid a situation where the check happens before recently clicked or recently accepted has updated on the state
          setButtonRecentlyClicked(true);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          if (
            e.errorCode ===
            PlatformErrorCodes.ErrorBungieFriendsUnableToRemoveRequest
          ) {
            Modal.open(<p>{friendsLoc.WeWereUnableToProcess}</p>);
          }
          setError(e);
        });
    }
  };

  const acceptFriendRequest = () => {
    return Platform.SocialService.AcceptFriendRequest(membershipId)
      .then((response) => {
        setError(null);
        if (section === "pendingRequests") {
          setPendingRecentlyAccepted(true);
        }
        // this runs even if it is a pending request even though that value is not used in pending requests, because it should still be kept up to date if it is used in the future
        // the reason we don't check both is to avoid a situation where the check happens before recently clicked or recently accepted has updated on the state
        setButtonRecentlyClicked(true);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.open(friendsLoc.FriendRequestFailed);
        setError(e);
      });
  };

  let flair: React.ReactNode | null;

  switch (section) {
    case "pendingRequests": {
      if (pendingRecentlyAccepted === null) {
        flair = (
          <>
            <Button
              key={membershipId || 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                acceptFriendRequest();
              }}
              buttonType={error ? "red" : "gold"}
              className={styles.acceptButton}
            >
              {Localizer.Actions.Accept}
            </Button>
            <Button
              key={membershipId || 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                removeFriendRequest();
              }}
              buttonType={error ? "red" : "white"}
            >
              {Localizer.Actions.CancelRequest}
            </Button>
          </>
        );
      } else if (pendingRecentlyAccepted) {
        flair = (
          <p>{`${Localizer.profile.SuccessfullyAccepted}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
        );
      } else if (!pendingRecentlyAccepted) {
        flair = (
          <p>{`${friendsLoc.FriendRequestDeclined}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
        );
      }
      break;
    }
    case "friends": {
      if (buttonRecentlyClicked) {
        flair = <p>{friendsLoc.successDesc}</p>;
      } else {
        flair = (
          <Button
            key={membershipId || 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setShowRemoveFriendModal(true);
            }}
            buttonType={error ? "red" : "white"}
          >
            {friendsLoc.removebutton}
          </Button>
        );
      }
      break;
    }
    default:
      if (buttonRecentlyClicked) {
        flair = (
          <p>{`${friendsLoc.FriendRequestRemoved}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
        );
      } else {
        flair = (
          <Button
            key={membershipId || 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              removeFriendRequest();
            }}
            buttonType={error ? "red" : "white"}
          >
            {friendsLoc.removebutton}
          </Button>
        );
      }
      break;
  }

  return (
    <>
      <RemoveFriendModal
        bungieFriend={bungieFriend}
        openModal={showRemoveFriendModal}
        onRemove={() => removedFriend()}
        onErrorRemovingFriend={(e) => errorRemovingFriend(e)}
        onClose={() => setShowRemoveFriendModal(false)}
      />
      <Anchor
        className={styles.friendLine}
        url={RouteHelper.TargetProfile(
          membershipIdForProfile,
          BungieMembershipType.BungieNext
        )}
      >
        <hr />
        <FriendLineItem
          membershipId={
            bungieFriend?.bungieNetUser?.membershipId ??
            bungieFriend?.lastSeenAsMembershipId
          }
          bungieName={
            UserUtils.getBungieNameFromBnetBungieFriend(bungieFriend)
              ?.bungieGlobalName
          }
          itemSubtitle={props.itemSubtitle}
          icon={
            <IconCoin
              iconImageUrl={UserUtils.bungieFriendProfilePicturePath(
                bungieFriend
              )}
            />
          }
          flair={flair}
        />
      </Anchor>
    </>
  );
};
