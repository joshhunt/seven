// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { ReportButton } from "@Areas/User/AccountComponents/Internal/ReportButton";
import { BlockButton } from "@Areas/User/ProfileComponents/BlockButton";
import { BungieFriend } from "@Areas/User/ProfileComponents/BungieFriend";
import { BungieView } from "@Areas/User/ProfileComponents/BungieView";
import { DestinyView } from "@Areas/User/ProfileComponents/DestinyView";
import { InviteToClanButton } from "@Areas/User/ProfileComponents/InviteToClanButton";
import { ProfileHeader } from "@Areas/User/ProfileComponents/ProfileHeader";
import { SendMessage } from "@Areas/User/ProfileComponents/SendMessage";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import {
  BungieCredentialType,
  BungieMembershipType,
  DestinyComponentType,
  IgnoredItemType,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IProfileParams } from "@Routes/RouteParams";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { Error404 } from "@UI/Errors/Error404";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Auth } from "@UI/User/Auth";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Profile.module.scss";

interface ProfileProps {}

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

  const isLoggedIn = UserUtils.isAuthenticated(globalState);
  const loggedInMIDIsCurrentMembershipMID =
    loggedInUserMembershipId === membershipId;
  const loggedInMIDIsPlatformMID = destinyMembership?.memberships?.some(
    (m) => m.membershipId === loggedInUserMembershipId
  );
  const loggedInMIDIsBNetMID =
    destinyMembership?.membershipData?.bungieNetUser?.membershipId ===
    loggedInUserMembershipId;
  // check mid against the bungienet account and the platform accounts
  const isSelf =
    isLoggedIn &&
    (loggedInMIDIsCurrentMembershipMID ||
      loggedInMIDIsPlatformMID ||
      loggedInMIDIsBNetMID);

  const isCrossSaved = isSelf
    ? globalState.crossSavePairingStatus?.primaryMembershipType !== undefined
    : destinyMembership.isCrossSaved;

  const [twitchCred, setTwitchCred] = useState<
    Contract.GetCredentialTypesForAccountResponse
  >(undefined);

  const getCredentialTypesForUser = () => {
    //only used looking at someone elses profile and only for twitch
    Platform.UserService.GetCredentialTypesForTargetAccount(membershipId).then(
      (data) => {
        setTwitchCred(
          data.find((cred) => {
            return cred.credentialType === BungieCredentialType.TwitchId;
          })
        );
      }
    );
  };

  const bungieNetUser = destinyMembership?.membershipData?.bungieNetUser;
  const bungieGlobalNameObject = bungieNetUser
    ? UserUtils.getBungieNameFromBnetGeneralUser(bungieNetUser)
    : UserUtils.getBungieNameFromGroupUserInfoCard(
        destinyMembership?.selectedMembership ??
          destinyMembership?.membershipData?.destinyMemberships[0]
      );

  const [destinyProfileResponse, setDestinyProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >(null);

  const [showMessageModal, toggleShowMessageModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isValidUser, setIsValidUser] = useState(true);

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
      history.replace(
        RouteHelper.NewProfile({
          mid: globalState.loggedInUser.user.membershipId,
          mtype: EnumUtils.getNumberValue(
            BungieMembershipType.BungieNext,
            BungieMembershipType
          ).toString(),
        }).url
      );
    }
  }, [globalState.loggedInUser, params]);

  useEffect(() => {
    if (membershipId && membershipType) {
      setIsLoading(true);

      ProfileDestinyMembershipDataStore.actions.loadUserData(
        {
          membershipId,
          membershipType,
        },
        true
      );
    }

    if (membershipId !== "" && membershipType === BungieMembershipType.None) {
      //example: /profile/jibberish
      setIsValidUser(false);
    }
  }, [membershipType, membershipId]); // Triggered when either of these changes

  // destinyMembership has been updated -> load all the other user data
  useEffect(() => {
    if (destinyMembership?.loaded && !destinyMembership?.membershipData) {
      setIsValidUser(false);
    }

    if (destinyMembership?.membershipData) {
      updateUrlWithAllParams(bungieGlobalNameObject.bungieGlobalName);
      loadDestinyProfileData();
      //destiny data has its own loading spinner so stop the profile loading spinner
      setIsLoading(false);
    }
  }, [destinyMembership, isLoading]);

  useEffect(() => {
    getCredentialTypesForUser();
  }, [membershipId]);

  if (!isValidUser) {
    return <Error404 />;
  }

  //the page requested did not have a mId in the Url and there is no loggedInUser -> prompt for signin
  if (
    membershipId === "" &&
    membershipType === BungieMembershipType.None &&
    typeof globalState.loggedInUser === "undefined"
  ) {
    return <RequiresAuth onSignIn={null} />;
  }

  const sendFriendRequest = () => {
    Platform.SocialService.IssueFriendRequest(membershipId)
      .then((response: boolean) => {
        updateSendingFriendRequest(false);
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

  const updateUrlWithAllParams = (userName: string) => {
    //after the bungienet user info has loaded we can update the url with the username
    document.title = Localizer.Format(
      Localizer.Userpages.BungieProfilePageTitle,
      { displayname: userName }
    );

    history.replace(
      RouteHelper.NewProfile({
        mid: membershipId,
        mtype: EnumUtils.getNumberValue(
          membershipType,
          BungieMembershipType
        ).toString(),
      }).url + `/${userName}`
    );
  };

  const loadDestinyProfileData = () => {
    if (destinyMembership.selectedMembership) {
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
    }
  };

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
  const joinDate = bungieNetUser?.firstAccess ?? "";

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
      <SpinnerContainer
        loading={isLoading}
        mode={SpinnerDisplayMode.fullPage}
        delayRenderUntilLoaded={true}
      >
        {bungieGlobalNameObject && (
          <ProfileHeader
            bungieDisplayName={bungieGlobalNameObject.bungieGlobalName}
            bungieGlobalCodeWithHash={
              bungieGlobalNameObject.bungieGlobalCodeWithHashtag
            }
            profileThemePath={
              bungieNetUser?.profileThemeName
                ? `url(/img/UserThemes/${bungieNetUser.profileThemeName}/header.jpg)`
                : ""
            }
            avatarPath={
              bungieNetUser?.profilePicturePath
                ? bungieNetUser.profilePicturePath
                : ""
            }
            status={status}
            joinDate={joinDate}
          />
        )}
        <Grid className={styles.profileBody}>
          <GridCol cols={3} className={styles.profileSidebar}>
            {!isSelf && bungieNetUser && bungieGlobalNameObject && (
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
                  recipientsBnetMembershipId={bungieNetUser.membershipId}
                  showModal={showMessageModal}
                  onClose={() => toggleShowMessageModal(false)}
                />
                <BlockButton
                  bungieGlobalNameObject={bungieGlobalNameObject}
                  membershipId={membershipId}
                />
                <ReportButton
                  ignoredItemId={membershipId}
                  itemContextType={IgnoredItemType.UserProfile}
                />
              </>
            )}
            {bungieNetUser && (
              <div className={styles.aboutMe}>
                <h3>{profileLoc.AboutMe}</h3>
                <p>{bungieNetUser.about}</p>
              </div>
            )}

            {destinyMembership?.membershipData?.destinyMemberships && (
              <div className={styles.linked}>
                <h3>{profileLoc.LinkedAccounts}</h3>
                <ul>
                  {destinyMembership.membershipData.destinyMemberships.map(
                    (value, index) => {
                      if (
                        value.membershipType !== BungieMembershipType.BungieNext
                      ) {
                        return (
                          <li
                            key={value.membershipId}
                            className={styles.linkedAccount}
                          >
                            <img src={value.iconPath} alt={value.displayName} />{" "}
                            {value.displayName}
                          </li>
                        );
                      }
                    }
                  )}
                  {twitchCred && (
                    <li className={styles.linkedAccount}>
                      <img
                        src={"/7/ca//bungie/icons/logos/twitch/icon.png"}
                        alt={twitchCred.credentialDisplayName}
                      />{" "}
                      {twitchCred.credentialDisplayName}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </GridCol>
          <GridCol cols={9} className={styles.profileMain}>
            {bungieNetUser && (
              <div className={styles.tabs}>
                <div
                  onClick={() => updateView(pageView.destiny)}
                  className={
                    showView === pageView.destiny ? styles.selected : ``
                  }
                >
                  <Icon iconType={"bungle"} iconName={"logodestiny"} />
                  {destinyTab}
                </div>
                <div
                  onClick={() => updateView(pageView.bungie)}
                  className={
                    showView === pageView.bungie ? styles.selected : ``
                  }
                >
                  <Icon iconType={"bungle"} iconName={"logoseventhcolumn"} />
                  {bungieTab}
                </div>
              </div>
            )}
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
            {bungieNetUser && showView === pageView.bungie && (
              <BungieView bungieNetUser={bungieNetUser} />
            )}
          </GridCol>
        </Grid>
      </SpinnerContainer>
    </div>
  );
};

export default Profile;
