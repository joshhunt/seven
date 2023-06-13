// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { Platform, User } from "@Platform";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface InviteModalProps {
  clanId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  inviteSent: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const [userDestinyInfo, setUserDestinyInfo] = useState<
    User.UserMembershipData
  >();

  const getDestinyInfoForInvited = () => {
    Platform.UserService.GetMembershipDataById(
      props.membershipId,
      props.membershipType
    ).then((result) => {
      setUserDestinyInfo(result);
    });
  };

  const sendInvite = (mtype: BungieMembershipType, mid: string) => {
    Platform.GroupV2Service.IndividualGroupInvite(
      { message: "" },
      props.clanId,
      mtype,
      mid
    )
      .then((result) => {
        //update
        props.inviteSent();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  useEffect(() => {
    getDestinyInfoForInvited();
  }, []);

  if (!userDestinyInfo) {
    return null;
  }

  if (userDestinyInfo.destinyMemberships?.length === 0) {
    return <p>{clansLoc.CannotInviteThisUserTo}</p>;
  }

  const bungieName = userDestinyInfo?.bungieNetUser
    ? UserUtils.getBungieNameFromBnetGeneralUser(userDestinyInfo.bungieNetUser)
    : UserUtils.getBungieNameFromGroupUserInfoCard(
        userDestinyInfo.destinyMemberships[0]
      );

  const bungieNameWithCode =
    bungieName.bungieGlobalName + bungieName.bungieGlobalCodeWithHashtag;

  const crossSavedPrimary = userDestinyInfo?.primaryMembershipId;

  return (
    <div>
      <h3>
        {Localizer.Format(clansLoc.InviteDisplaynameToClan, {
          displayName: bungieNameWithCode,
        })}
      </h3>
      <ul className={styles.listCards}>
        <li className={styles.inviteModalHeader}>
          <OneLineItem
            itemTitle={
              bungieName
                ? `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`
                : ""
            }
            icon={
              <IconCoin
                iconImageUrl={
                  userDestinyInfo.bungieNetUser?.profilePicturePath ??
                  userDestinyInfo?.destinyMemberships?.[0]?.iconPath ??
                  ""
                }
              />
            }
          />
        </li>
      </ul>
      <ul className={classNames(styles.listCards, styles.inviteCards)}>
        {userDestinyInfo.destinyMemberships
          .filter(
            (d) => !d.crossSaveOverride || d.membershipId === crossSavedPrimary
          )
          ?.map((m) => {
            const isCrossSavedPrimary =
              m.crossSaveOverride === m.membershipType;

            return (
              <li key={m.membershipId} className={styles.platformCard}>
                <TwoLineItem
                  itemTitle={
                    isCrossSavedPrimary
                      ? Localizer.UserPages.CrossSave
                      : Localizer.Platforms[
                          EnumUtils.getStringValue(
                            m.membershipType,
                            BungieMembershipType
                          )
                        ]
                  }
                  itemSubtitle={m.displayName}
                  icon={
                    <IconCoin
                      iconImageUrl={
                        isCrossSavedPrimary
                          ? "/img/theme/bungienet/icons/icon_cross_save_light.png"
                          : m.iconPath
                      }
                    />
                  }
                />
                <Button
                  buttonType={"gold"}
                  size={BasicSize.Small}
                  onClick={() => sendInvite(m.membershipType, m.membershipId)}
                >
                  {clansLoc.Invite}
                </Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
