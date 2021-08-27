// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { ActionSuccessModal } from "@Areas/User/AccountComponents/Internal/ActionSuccessModal";
import { ReportButton } from "@Areas/User/AccountComponents/Internal/ReportButton";
import { BungieFriend } from "@Areas/User/ProfileComponents/BungieFriend";
import { BungieView } from "@Areas/User/ProfileComponents/BungieView";
import { DestinyView } from "@Areas/User/ProfileComponents/DestinyView";
import { InviteToClanButton } from "@Areas/User/ProfileComponents/InviteToClanButton";
import { SendMessage } from "@Areas/User/ProfileComponents/SendMessage";
import { useDataStore } from "@bungie/datastore/DataStore";
import { PlatformError } from "@CustomErrors";
import {
  BungieMembershipType,
  DestinyComponentType,
  IgnoredItemType,
  ModeratorRequestedPunishment,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Contracts, Platform, Responses, User } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Auth } from "@UI/User/Auth";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Profile.module.scss";

interface ProfileProps {}

export interface IProfileParams {
  mid?: string;
  mtype?: string;
}

const Profile: React.FC<ProfileProps> = (props) => {
  const params = useParams<IProfileParams>();
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);

  // Only ever get membershipId and membershipType from the URL
  const membershipId = params.mid ?? "";
  const membershipType =
    BungieMembershipType[params.mtype as keyof typeof BungieMembershipType] ??
    BungieMembershipType.None;
  const loggedInUserMembershipId = UserUtils.loggedInUserMembershipId(
    globalState
  );

  // check mid against the bungienet account and the platform accounts
  const isSelf =
    UserUtils.isAuthenticated(globalState) &&
    (loggedInUserMembershipId === membershipId || //mid match
      destinyMembership?.memberships?.some(
        (m) => m.membershipId === loggedInUserMembershipId
      ) || // logged in mid is one of the platform accounts
      destinyMembership?.membershipData?.bungieNetUser.membershipId ===
        loggedInUserMembershipId); //logged in mid is the bungienet user

  const isCrossSaved = isSelf
    ? globalState.crossSavePairingStatus?.primaryMembershipType !== undefined
    : destinyMembership.isCrossSaved;

  const [bungieNetUser, setUser] = useState<User.GeneralUser>(null);
  const [destinyProfileResponse, setDestinyProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >(null);

  const [showMessageModal, toggleShowMessageModal] = useState<boolean>(false);

  enum pageView {
    destiny,
    bungie,
  }
  const [showView, updateView] = useState<pageView>(pageView.destiny);

  //only used to keep track of pushing the send friend request button if not logged in
  const [sendingFriendRequest, updateSendingFriendRequest] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (globalState.loggedInUser && !params.mid) {
      // Redirect to the current user if we have one and the URL didn't specify one
      history.push(
        RouteHelper.NewProfile({
          mid: globalState.loggedInUser.user.membershipId,
          mtype: EnumUtils.getNumberValue(
            BungieMembershipType.BungieNext,
            BungieMembershipType
          ).toString(),
        }).url
      );
    }
  }, [globalState.loggedInUser, params.mid]);

  useEffect(() => {
    //different mid or mtype

    const selectedDestinyMembershipIsCurrentlyUsedForView =
      destinyMembership?.selectedMembership?.membershipId === membershipId;

    const membershipTypeIsBungieNext = EnumUtils.looseEquals(
      membershipType,
      BungieMembershipType.BungieNext,
      BungieMembershipType
    );

    const isCurrentlyUsingBNetAsSelectedMembership =
      membershipTypeIsBungieNext &&
      destinyMembership?.membershipData?.bungieNetUser?.membershipId ===
        membershipId;

    //updating the url because the platform was updated, but its the exact same view, for example going from bungie profile to platform profile when only one account linked
    if (
      membershipId !== "" &&
      (selectedDestinyMembershipIsCurrentlyUsedForView ||
        isCurrentlyUsingBNetAsSelectedMembership)
    ) {
      loadUser();
    } else {
      if (membershipId && membershipType) {
        // Load the membership data using the values from the URL
        //setting to null allows user data to fully refresh
        setDestinyProfileResponse(null);
        setUser(null);

        ProfileDestinyMembershipDataStore.actions.loadUserData(
          {
            membershipId,
            membershipType,
          },
          true
        );
      }
    }
  }, [membershipType, membershipId]); // Triggered when either of these changes

  // destinyMembership has been updated -> load all the other user data
  useEffect(() => {
    const notTheSameUser =
      !isSelf &&
      destinyMembership?.membershipData !== null &&
      destinyMembership?.membershipData.destinyMemberships[0]?.membershipId !==
        membershipId;

    if (
      (isSelf && bungieNetUser === null) ||
      notTheSameUser ||
      (isSelf && bungieNetUser?.membershipId !== membershipId)
    ) {
      loadUser();
    }

    if (
      destinyProfileResponse === null &&
      destinyMembership?.selectedMembership !== null
    ) {
      loadDestinyProfileData();
    }
  }, [destinyMembership]);

  //the page requested did not have a mId in the Url and there is no loggedInUser -> prompt for signin
  if (membershipId === "" && typeof globalState.loggedInUser === "undefined") {
    return <RequiresAuth onSignIn={null} />;
  }

  const sendFriendRequest = () => {
    Platform.SocialService.IssueFriendRequest(membershipId)
      .then((response: boolean) => {
        updateSendingFriendRequest(false);

        const message = response ? (
          <ActionSuccessModal />
        ) : (
          profileLoc.ThereWasAProblemSending
        );
        Modal.open(message);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        updateSendingFriendRequest(false);

        Modal.error(e);
      });
  };

  //prompt anonymous users to login if attempt to friend request
  if (typeof globalState.loggedInUser === "undefined" && sendingFriendRequest) {
    return (
      <Auth
        onSignIn={(temporaryGlobalState) => sendFriendRequest()}
        onClose={() => updateSendingFriendRequest(false)}
        preventModalClose={false}
      />
    );
  }

  const blockUser = () => {
    //Reason and ItemContextId are set to their defaults here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
    const ignoreItemRequest = {
      ignoredItemId: membershipId,
      ignoredItemType: IgnoredItemType.User,
      comment: "",
      reason: "0",
      itemContextId: "0",
      itemContextType: 0,
      requestedPunishment: ModeratorRequestedPunishment.Unknown,
      requestedBlastBan: false,
    } as Contracts.IgnoreItemRequest;

    Platform.IgnoreService.IgnoreItem(ignoreItemRequest)
      .then((response: Contracts.IgnoreDetailResponse) => {
        const message = response ? (
          <ActionSuccessModal />
        ) : (
          profileLoc.ThereWasAProblemBlocking
        );

        Modal.open(message);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const loadUser = () => {
    //bungie user data here
    let userName = "";

    //use the platform display names when appropriate - shows up in the title and the url
    if (isSelf) {
      userName = !EnumUtils.looseEquals(
        membershipType,
        BungieMembershipType.BungieNext,
        BungieMembershipType
      )
        ? destinyMembership?.selectedMembership?.displayName ||
          globalState.loggedInUser.user.displayName
        : globalState.loggedInUser.user.displayName;
      setUser(globalState.loggedInUser.user);
    } else {
      userName = !EnumUtils.looseEquals(
        membershipType,
        BungieMembershipType.BungieNext,
        BungieMembershipType
      )
        ? destinyMembership?.selectedMembership?.displayName ||
          destinyMembership.membershipData.bungieNetUser.displayName
        : destinyMembership.membershipData.bungieNetUser.displayName;
      setUser(destinyMembership.membershipData.bungieNetUser);
    }

    updateUrlWithAllParams(userName);
  };

  const updateUrlWithAllParams = (userName: string) => {
    //after the bungienet user info has loaded we can update the url with the username
    const newTitle = Localizer.Format(
      Localizer.Userpages.BungieProfilePageTitle,
      { displayname: userName }
    );

    window.history.replaceState(
      null,
      newTitle,
      `/7/${
        Localizer.CurrentCultureName
      }/User/Profile/${EnumUtils.getNumberValue(
        membershipType,
        BungieMembershipType
      )}/${membershipId}/${userName}`
    );
  };

  const loadDestinyProfileData = () => {
    Platform.Destiny2Service.GetProfile(
      destinyMembership.selectedMembership.membershipType,
      destinyMembership.selectedMembership.membershipId,
      [
        DestinyComponentType.Profiles,
        DestinyComponentType.CharacterProgressions,
        DestinyComponentType.Characters,
        DestinyComponentType.PresentationNodes,
        DestinyComponentType.Records,
        DestinyComponentType.Collectibles,
        DestinyComponentType.Metrics,
      ]
    ).then((destinyResponse: Responses.DestinyProfileResponse) => {
      const hasCharacterData =
        typeof destinyResponse.characters !== "undefined" &&
        typeof destinyResponse.characters.data !== "undefined";

      let targetCharacterId = "";

      if (hasCharacterData) {
        targetCharacterId = Object.keys(destinyResponse.characters.data)[0];
      }

      setDestinyProfileResponse(destinyResponse);
    });
  };

  // $todo atseng - replace with empty string when confirm this is user status
  const status = bungieNetUser?.statusText ?? "";

  const useBungieNetUserForName = bungieNetUser !== null;
  const useDestinyMembershipForName =
    typeof destinyMembership?.memberships[0] !== "undefined";

  const bungieName = useBungieNetUserForName
    ? UserUtils.getBungieNameFromBnetGeneralUser(bungieNetUser)
    : useDestinyMembershipForName
    ? UserUtils.getBungieNameFromGroupUserInfoCard(
        destinyMembership.memberships[0]
      )
    : null;

  //appends the unique part to the displayName for css purposes
  const bungieDisplayName = bungieName?.bungieGlobalName;
  const completeBungieIdSuffix = bungieName?.bungieGlobalCodeWithHashtag;

  const profileLoc = Localizer.Profile;

  const bungieTab = profileLoc.Bungie;
  const destinyTab = profileLoc.Destiny;

  const pageTitle = Localizer.Format(
    Localizer.Userpages.BungieProfilePageTitle,
    {
      displayname:
        bungieNetUser?.displayName ??
        destinyMembership?.memberships[0]?.displayName ??
        "",
    }
  );

  return (
    <div className={styles.destinyFont}>
      <BungieHelmet title={pageTitle} description={pageTitle}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      {bungieNetUser !== null && (
        <div
          className={styles.profileBanner}
          style={{
            backgroundImage: `url(/img/UserThemes/${bungieNetUser.profileThemeName}/header.jpg)`,
          }}
        >
          <Grid>
            <GridCol cols={12} className={styles.userSection}>
              <img
                src={bungieNetUser.profilePicturePath}
                alt={bungieNetUser.displayName}
              />
              <h2>
                {bungieDisplayName}
                <span className={styles.uniqueName}>
                  {completeBungieIdSuffix}
                </span>
              </h2>
              <p>{status}</p>
            </GridCol>
          </Grid>
        </div>
      )}
      <Grid className={styles.profileBody}>
        <GridCol cols={3} className={styles.profileSidebar}>
          {bungieNetUser !== null && (
            <>
              {!isSelf && (
                <>
                  <BungieFriend
                    mId={membershipId}
                    isAuthed={UserUtils.isAuthenticated(globalState)}
                    bungieGlobalDisplaynameCode={
                      bungieNetUser?.cachedBungieGlobalDisplayNameCode ?? 0
                    }
                  />
                  <InviteToClanButton
                    onPageUserDestinyMembership={destinyMembership}
                    loggedInUserClans={globalState.loggedInUserClans}
                  />
                  <Button
                    buttonType={"white"}
                    className={classNames(styles.button, styles.btnSendMessage)}
                    onClick={() => toggleShowMessageModal(true)}
                  >
                    {profileLoc.SendMessage}
                  </Button>
                  <SendMessage
                    recipientsMembershipId={membershipId}
                    showModal={showMessageModal}
                    onClose={() => toggleShowMessageModal(false)}
                  />
                  <Button
                    buttonType={"white"}
                    className={classNames(styles.button, styles.btnBlock)}
                    onClick={blockUser}
                  >
                    {profileLoc.Block}
                  </Button>
                  <ReportButton
                    ignoredItemId={membershipId}
                    itemContextType={IgnoredItemType.UserProfile}
                  />
                </>
              )}
              <div className={styles.aboutMe}>
                <h3>{profileLoc.AboutMe}</h3>
                <p>{bungieNetUser.about}</p>
              </div>
              {destinyMembership?.membershipData?.destinyMemberships && (
                <div className={styles.linked}>
                  <h3>{profileLoc.LinkedAccounts}</h3>
                  <ul>
                    {destinyMembership.membershipData.destinyMemberships.map(
                      (value, index) => {
                        if (
                          value.membershipType !==
                          BungieMembershipType.BungieNext
                        ) {
                          return (
                            <li
                              key={value.membershipId}
                              className={styles.linkedAccount}
                            >
                              <img
                                src={value.iconPath}
                                alt={value.displayName}
                              />{" "}
                              {value.displayName}
                            </li>
                          );
                        }
                      }
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </GridCol>
        <GridCol cols={9} className={styles.profileMain}>
          <div className={styles.tabs}>
            <div
              onClick={() => updateView(pageView.destiny)}
              className={showView === pageView.destiny ? styles.selected : ``}
            >
              <Icon iconType={"bungle"} iconName={"logodestiny"} />
              {destinyTab}
            </div>
            <div
              onClick={() => updateView(pageView.bungie)}
              className={showView === pageView.bungie ? styles.selected : ``}
            >
              <Icon iconType={"bungle"} iconName={"logoseventhcolumn"} />
              {bungieTab}
            </div>
          </div>
          {destinyMembership?.membershipData?.destinyMemberships.length > 1 &&
            !isCrossSaved && (
              <div className={styles.platformSelector}>
                <DestinyPlatformSelector
                  userMembershipData={destinyMembership.membershipData}
                  onChange={(value: string) => {
                    if (
                      !EnumUtils.looseEquals(
                        value,
                        membershipType,
                        BungieMembershipType
                      )
                    ) {
                      history.push(
                        RouteHelper.NewProfile({
                          mid: destinyMembership.membershipData.destinyMemberships.find(
                            (memberships) =>
                              EnumUtils.looseEquals(
                                value,
                                memberships.membershipType,
                                BungieMembershipType
                              )
                          ).membershipId,
                          mtype: value,
                        }).url
                      );
                    }
                  }}
                  defaultValue={membershipType}
                  crossSavePairingStatus={
                    isSelf ? globalState.crossSavePairingStatus : null
                  }
                />
              </div>
            )}
          {showView === pageView.destiny && (
            <DestinyView
              coreSettings={globalState.coreSettings}
              destinyMembership={destinyMembership}
              destinyProfileResponse={destinyProfileResponse}
              loggedInUserClans={globalState.loggedInUserClans}
              membershipType={membershipType}
              membershipId={membershipId}
              isSelf={isSelf}
            />
          )}
          {showView === pageView.bungie && (
            <BungieView bungieNetUser={bungieNetUser} />
          )}
        </GridCol>
      </Grid>
    </div>
  );
};

export default Profile;
