// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { PlatformError } from "@CustomErrors";
import { Localizer } from "@bungie/localization";
import { Friends, Platform } from "@Platform";
import { Auth } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface BungieFriendProps {
  isAuthed: boolean;
  mId: string;
  //bungieDisplayNameCode is used when users do not have a bungieNetUser defined on the BungieFriend
  bungieGlobalDisplaynameCode: number;
}

export const BungieFriend: React.FC<BungieFriendProps> = (props) => {
  const profileLoc = Localizer.Profile;

  //mid of the friend, pendingIncoming or pendingOutgoing requested user
  const [isFriend, setIsFriend] = useState(false);
  const [isPendingIncomingRequest, setIsPendingIncomingRequest] = useState(
    false
  );
  const [isPendingOutgoingRequest, setIsPendingOutgoingRequest] = useState(
    false
  );

  //only used to keep track of pushing the send friend request button if not logged in
  const [sendingFriendRequest, setSendingFriendRequest] = useState(false);

  const userFound = (friends: Friends.BungieFriend[]) => {
    return (
      friends.find(
        (value: Friends.BungieFriend) =>
          value.bungieNetUser?.membershipId === props.mId
      ) !== undefined
    );
  };

  const getFriend = () => {
    setIsFriend(false);

    //get friends
    Platform.SocialService.GetFriendList().then((response) => {
      setIsFriend(userFound(response.friends));
    });
  };

  const getPendingFriends = () => {
    setIsPendingOutgoingRequest(false);
    setIsPendingIncomingRequest(false);

    Platform.SocialService.GetFriendRequestList().then((response) => {
      setIsPendingOutgoingRequest(userFound(response?.outgoingRequests));
      setIsPendingIncomingRequest(userFound(response?.incomingRequests));
    });
  };

  const updateFriendsLists = () => {
    getFriend();
    getPendingFriends();
  };

  const sendFriendRequest = () => {
    Platform.SocialService.IssueFriendRequest(props.mId)
      .then((response: boolean) => {
        setSendingFriendRequest(false);

        if (!response) {
          Modal.open(profileLoc.ThereWasAProblemSending);
        }

        setIsPendingOutgoingRequest(true);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setSendingFriendRequest(false);

        Modal.error(e);
      });
  };

  const acceptFriendRequest = () => {
    //accept
    Platform.SocialService.AcceptFriendRequest(props.mId)
      .then((response) => {
        if (!response) {
          Modal.open(profileLoc.ThereWasAProblemAccepting);
        }

        setIsFriend(true);
        setIsPendingIncomingRequest(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const cancelFriendRequest = () => {
    //outgoing
    Platform.SocialService.RemoveFriendRequest(props.mId)
      .then((response) => {
        if (!response) {
          Modal.open(profileLoc.ThereWasAProblemCancelling);
        }

        setIsPendingOutgoingRequest(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const declineFriendRequest = () => {
    //incoming
    Platform.SocialService.DeclineFriendRequest(props.mId)
      .then((response) => {
        if (!response) {
          Modal.open(profileLoc.ThereWasAProblemDeclining);
        }

        setIsPendingIncomingRequest(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const removeFriend = () => {
    //remove
    Platform.SocialService.RemoveFriend(props.mId)
      .then((response) => {
        if (!response) {
          Modal.open(profileLoc.ThereWasAProblemDeclining);
        }

        setIsFriend(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  useEffect(() => {
    if (props.isAuthed) {
      updateFriendsLists();
    }
  }, [props.mId]);

  //prompt anonymous users to login if attempt to friend request
  if (!props.isAuthed && sendingFriendRequest) {
    return (
      <Auth
        onSignIn={(temporaryGlobalState) => sendFriendRequest()}
        onClose={() => setSendingFriendRequest(false)}
        preventModalClose={false}
      />
    );
  }

  return (
    <>
      {!isFriend && !isPendingIncomingRequest && !isPendingOutgoingRequest && (
        //not a friend
        <Button
          buttonType={"darkblue"}
          className={classNames(styles.button, styles.btnSendFriend)}
          onClick={() => {
            if (props.isAuthed) {
              sendFriendRequest();
            } else {
              setSendingFriendRequest(true);
            }
          }}
        >
          {profileLoc.SendFriendRequest}
        </Button>
      )}
      {isPendingIncomingRequest && (
        //friend incoming
        <>
          <Button
            buttonType={"darkblue"}
            className={classNames(styles.button, styles.btnSendFriend)}
            onClick={() => {
              acceptFriendRequest();
            }}
          >
            {profileLoc.AcceptRequest}
          </Button>

          <Button
            buttonType={"darkblue"}
            className={classNames(styles.button, styles.btnSendFriend)}
            onClick={() => {
              declineFriendRequest();
            }}
          >
            {profileLoc.DeclineFriendRequest}
          </Button>
        </>
      )}
      {isPendingOutgoingRequest && (
        <Button
          buttonType={"darkblue"}
          className={classNames(styles.button, styles.btnSendFriend)}
          onClick={() => {
            cancelFriendRequest();
          }}
        >
          {profileLoc.CancelFriendRequest}
        </Button>
      )}
      {isFriend && (
        <Button
          buttonType={"darkblue"}
          className={classNames(styles.button, styles.btnSendFriend)}
          onClick={() => {
            removeFriend();
          }}
        >
          {profileLoc.RemoveFriend}
        </Button>
      )}
    </>
  );
};
