// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { ReportButton } from "@Areas/User/AccountComponents/Internal/ReportButton";
import { BlockButton } from "@Areas/User/ProfileComponents/BlockButton";
import { BungieFriend } from "@Areas/User/ProfileComponents/BungieFriend";
import { InviteToClanButton } from "@Areas/User/ProfileComponents/InviteToClanButton";
import { ProfileHeader } from "@Areas/User/ProfileComponents/ProfileHeader";
import { ProfileUserSummary } from "@Areas/User/ProfileComponents/ProfileUserSummary";
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
import { SystemNames } from "@Global/SystemNames";
import { sortUsingFilterArray } from "@Helpers";
import { GroupsV2, Platform, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IProfileParams } from "@Routes/RouteParams";
import { Error404 } from "@UI/Errors/Error404";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Auth } from "@UI/User/Auth";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Profile.module.scss";

interface ProfileProps {
  // Anything passed in as a child to Profile, will replace the user summary section
  children: React.ReactNode;
}

const Profile: React.FC<ProfileProps> = (props) => {
  const params = useParams<IProfileParams>();
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);

  const membershipFilterArray = [
    (groupInfoCard: GroupsV2.GroupUserInfoCard) => {
      return groupInfoCard.membershipType === BungieMembershipType.TigerPsn;
    },
    (groupInfoCard: GroupsV2.GroupUserInfoCard) => {
      return groupInfoCard.membershipType === BungieMembershipType.TigerXbox;
    },
    (groupInfoCard: GroupsV2.GroupUserInfoCard) => {
      return groupInfoCard.membershipType === BungieMembershipType.TigerSteam;
    },
    (groupInfoCard: GroupsV2.GroupUserInfoCard) => {
      return groupInfoCard.membershipType === BungieMembershipType.TigerEgs;
    },
  ];

  // Only ever get membershipId and membershipType from the URL
  const membershipId = params.mid ?? "";
  const membershipType =
    BungieMembershipType[params.mtype as keyof typeof BungieMembershipType] ??
    BungieMembershipType.None;

  const isLoggedIn = UserUtils.isAuthenticated(globalState);
  const loggedInUserMembershipId = UserUtils.loggedInUserMembershipId(
    globalState
  );
  const isSelf = UserUtils.IsViewingSelf(
    membershipId,
    globalState,
    destinyMembership
  );

  const isCrossSaved = isSelf
    ? globalState.crossSavePairingStatus?.primaryMembershipType !== undefined
    : destinyMembership?.isCrossSaved;

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
  const [sanitizedProfileNames, setSanitizedProfileNames] = useState<
    Record<string, string>
  >(null);
  const [showMessageModal, toggleShowMessageModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(true);
  //only used to keep track of pushing the send friend request button if not logged in
  const [sendingFriendRequest, updateSendingFriendRequest] = useState<boolean>(
    false
  );

  const loadDestinyMembership = () => {
    ProfileDestinyMembershipDataStore.actions.loadUserData(
      membershipId && membershipType
        ? {
            membershipId,
            membershipType,
          }
        : null,
      true
    );
  };

  //Profile Flow
  // all redirects are handled within this page
  // redirects on other pages are handled by updated the destinyMembership

  //1. always load fresh on mount
  useEffect(() => {
    loadDestinyMembership();
  }, []);

  //2. if the params.mid or user login state changes get a fresh destinyMembership
  useEffect(() => {
    if (!params?.mid && isLoggedIn) {
      //clear everything before getting a new destinyMembership
      destinyMembership?.loaded &&
        ProfileDestinyMembershipDataStore.actions.resetMembership();
      setDestinyProfileResponse(null);
      loadDestinyMembership();
    }
  }, [params?.mid, isLoggedIn]);

  //3. set up redirects after destinyMembership has loaded
  useEffect(() => {
    if (destinyMembership.loaded) {
      setIsLoading(false);
    }

    //always redirect if the membershipType has changed
    if (
      destinyMembership?.selectedMembership &&
      !EnumUtils.looseEquals(
        destinyMembership.selectedMembership.membershipType,
        membershipType,
        BungieMembershipType
      )
    ) {
      if (
        bungieGlobalNameObject?.bungieGlobalName &&
        bungieGlobalNameObject?.bungieGlobalName !== "null"
      ) {
        updateUrlWithAllParams(bungieGlobalNameObject.bungieGlobalName);
      }
    }

    //only load destiny profile if user has destiny memberships, remove it for users that don't have a destiny membership so that they don't use the prev users version
    if (destinyMembership?.selectedMembership) {
      loadExtendedDestinyProfileData(); // Has potential to fire off multiple times
    } else {
      setDestinyProfileResponse(null);
    }
  }, [destinyMembership, destinyMembership?.selectedMembership]);

  //4. error state for when everything has loaded and this is an invalid user
  useEffect(() => {
    if (!isLoggedIn) {
      //error state for not logged in and no wanted user
      const haveMID = params?.mid && params.mid !== "";

      if ((!haveMID && !loggedInUserMembershipId) || !membershipType) {
        setIsLoading(false);
        setIsValidUser(false);
      }
    }
  }, [membershipType, membershipId, isLoggedIn]);

  useEffect(() => {
    if (membershipId !== "") {
      Platform.UserService.GetSanitizedPlatformDisplayNames(membershipId)
        .then((names) =>
          setSanitizedProfileNames(
            UserUtils.getStringKeyedMapForSanitizedCredentialNames(names)
          )
        )
        .catch((e) => {
          // If we error, we don't want to block the UI with the loader element
          setIsLoading(false);
        });
    }
  }, [membershipId]);

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

  //we want the requested user, not the destinyMembership that was previously loaded; the params.mid is the source of truth
  const profileInDataStoreMatchesUrl = () => {
    return (
      destinyMembership?.membershipData?.destinyMemberships?.find(
        (d) => d.membershipId === params?.mid
      ) ||
      (destinyMembership?.membershipData?.bungieNetUser?.membershipId &&
        destinyMembership?.membershipData?.bungieNetUser?.membershipId ===
          params?.mid)
    );
  };

  const updateUrlWithAllParams = (bungieName: string) => {
    //after the bungienet user info has loaded we can update the url with the username
    const encodedUserName = encodeURIComponent(bungieName);
    document.title =
      encodedUserName &&
      Localizer.Format(Localizer.Userpages.BungieProfilePageTitle, {
        displayname: encodedUserName,
      });

    if (history.location.pathname.toLowerCase().includes("profile")) {
      updateProfileUrl(
        makeMTypeNumericString(
          destinyMembership?.selectedMembership?.membershipType
        ),
        destinyMembership?.selectedMembership?.membershipId,
        encodedUserName
      );
    }

    if (history.location.pathname.toLowerCase().includes("gamehistory")) {
      updateGameHistoryUrl(
        makeMTypeNumericString(
          destinyMembership?.selectedMembership?.membershipType
        ),
        destinyMembership?.selectedMembership?.membershipId,
        encodedUserName
      );
    }
  };

  const makeMTypeNumericString = (memType: BungieMembershipType) =>
    EnumUtils.getNumberValue(memType, BungieMembershipType).toString();

  const updateProfileUrl = (mType: string, mId: string, bungieName: string) => {
    history.replace(
      RouteHelper.NewProfile({
        mid: mId,
        mtype: mType,
      }).url + `?bgn=${bungieName}`
    );
  };

  const updateGameHistoryUrl = (
    mType: string,
    mId: string,
    bungieName: string
  ) => {
    history.replace(
      RouteHelper.NewGameHistory({
        mid: mId,
        mtype: mType,
      }).url + `?bgn=${bungieName}`
    );
  };

  const loadExtendedDestinyProfileData = async () => {
    if (destinyMembership?.selectedMembership) {
      try {
        const destinyResponse: Responses.DestinyProfileResponse = await Platform.Destiny2Service.GetProfile(
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
            DestinyComponentType.ProfileProgression,
          ]
        );
        setDestinyProfileResponse(destinyResponse);
      } catch {
        //couldn't load destiny profile
      }
    }
  };

  //the page requested did not have a mId in the Url and there is no loggedInUser -> prompt for signin
  if (
    membershipId === "" &&
    membershipType === BungieMembershipType.None &&
    typeof globalState.loggedInUser === "undefined"
  ) {
    return <RequiresAuth onSignIn={null} />;
  }

  if (
    !isLoggedIn &&
    !isValidUser &&
    ConfigUtils.SystemStatus(SystemNames.AccountServices)
  ) {
    return <Error404 />;
  }

  const status = bungieNetUser?.statusText ?? "";
  const joinDate = bungieNetUser?.firstAccess ?? "";
  const profileLoc = Localizer.Profile;
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
    <SystemDisabledHandler systems={[SystemNames.AccountServices]}>
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
                    className={styles.sendMessageContainer}
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
                <div>
                  <h3>{profileLoc.AboutMe}</h3>
                  <p>{bungieNetUser.about}</p>
                </div>
              )}

              {destinyMembership?.membershipData?.destinyMemberships && (
                <div>
                  <h3>{profileLoc.LinkedAccounts}</h3>
                  <ul>
                    {sortUsingFilterArray(
                      destinyMembership.membershipData.destinyMemberships,
                      membershipFilterArray
                    ).map((value, index) => {
                      const credentialName = UserUtils.getCredentialTypeFromMembershipType(
                        value.membershipType
                      );
                      const credentialString = EnumUtils.getStringValue(
                        credentialName,
                        BungieCredentialType
                      );
                      if (
                        value.membershipType !==
                          BungieMembershipType.BungieNext &&
                        value.membershipType !==
                          BungieMembershipType.TigerStadia
                      ) {
                        return (
                          <li
                            key={value.membershipId}
                            className={styles.linkedAccount}
                          >
                            <img
                              src={value.iconPath}
                              alt={
                                sanitizedProfileNames &&
                                sanitizedProfileNames[credentialString]
                              }
                            />{" "}
                            {sanitizedProfileNames &&
                              sanitizedProfileNames[credentialString]}
                          </li>
                        );
                      }
                    })}
                    {sanitizedProfileNames &&
                      sanitizedProfileNames[
                        EnumUtils.getStringValue(
                          BungieCredentialType.TwitchId,
                          BungieCredentialType
                        )
                      ] && (
                        <li className={styles.linkedAccount}>
                          <img
                            src={"/7/ca//bungie/icons/logos/twitch/icon.png"}
                            alt={
                              sanitizedProfileNames[
                                EnumUtils.getStringValue(
                                  BungieCredentialType.TwitchId,
                                  BungieCredentialType
                                )
                              ]
                            }
                          />{" "}
                          {
                            sanitizedProfileNames[
                              EnumUtils.getStringValue(
                                BungieCredentialType.TwitchId,
                                BungieCredentialType
                              )
                            ]
                          }
                        </li>
                      )}
                  </ul>
                </div>
              )}
            </GridCol>
            <GridCol cols={9} className={styles.profileMain}>
              {props.children || (
                <ProfileUserSummary
                  bungieNetUser={bungieNetUser}
                  isCrossSaved={isCrossSaved}
                  membershipId={membershipId}
                  membershipType={membershipType}
                  isSelf={isSelf}
                  destinyProfileResponse={destinyProfileResponse}
                />
              )}
            </GridCol>
          </Grid>
        </SpinnerContainer>
      </div>
    </SystemDisabledHandler>
  );
};

export default Profile;
