// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import sharedStyles from "@Areas/User/Account.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { FriendsImportUtils } from "@Areas/User/AccountComponents/Internal/BungieFriends/FriendsImportUtils";
import { ConfirmPlatformLinkingModal } from "@Areas/User/AccountComponents/Internal/ConfirmPlatformLinkingModal";
import { PlatformError } from "@CustomErrors";
import {
  BungieCredentialType,
  PlatformErrorCodes,
  PlatformFriendType,
} from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Friends, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Spinner } from "@UIKit/Controls/Spinner";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import ReactPaginate from "react-paginate";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { ActionSuccessModal } from "./Internal/ActionSuccessModal";

export interface PlatformFriendsResponsePlatform {
  platform: PlatformFriendType;
  friendsResponse: Friends.PlatformFriendResponse;
  isLoaded: boolean;
  error?: PlatformError;
}

interface PlatformFriendsTotalPages {
  platform: PlatformFriendType;
  totalPages: number;
}

interface FriendsImportProps {
  bungieFriends: Friends.BungieFriend[];
  platform?: PlatformFriendType;
}

export const FriendsImport: React.FC<FriendsImportProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(AccountDestinyMembershipDataStore);

  const friendsLoc = Localizer.Friends;
  const [openPlatformList, updateOpenPlatformList] = useState<
    PlatformFriendType[]
  >([PlatformFriendType.Unknown]);

  const [allPlatformFriendsResponse, setPlatformFriends] = useState<
    PlatformFriendsResponsePlatform[]
  >([]);
  const [incomingRequests, setIncomingRequests] = useState<
    Friends.BungieFriend[]
  >([]);
  const [outgoingRequests, setOutgoingRequests] = useState<
    Friends.BungieFriend[]
  >([]);
  const [
    friendMembershipIdsWithError,
    setFriendMembershipIdsWithError,
  ] = useState<string[]>([]);

  const [linkingModalOpen, setLinkingModalOpen] = useState(false);
  const [platformToLink, setPlatformToLink] = useState<PlatformFriendType>(
    PlatformFriendType.Unknown
  );

  const [validPlatformsToLink, setValidPlatformsToLink] = useState<
    PlatformFriendType[]
  >([]);
  const [validPlatformsLinked, setValidPlatformsLinked] = useState<
    PlatformFriendType[]
  >([]);

  const getValidPlatforms = () => {
    const _validPlatformsToLink: PlatformFriendType[] = [];
    const _validPlatformsLinked: PlatformFriendType[] = [];

    EnumUtils.getStringKeys(BungieCredentialType).forEach((cred) => {
      try {
        const credEnum =
          BungieCredentialType[cred as keyof typeof BungieCredentialType];
        const platformFriendType = UserUtils.getPlatformTypeFromTypeFromCredentialType(
          credEnum
        );

        if (globalState.loggedInUser.publicCredentialTypes.includes(credEnum)) {
          _validPlatformsLinked.push(platformFriendType);
        } else {
          _validPlatformsToLink.push(platformFriendType);
        }
      } catch {
        //skipped - not valid credentialType
      }
    });

    setValidPlatformsLinked(_validPlatformsLinked);
    setValidPlatformsToLink(_validPlatformsToLink);
  };

  //default is 10 total pages per platform, but we have no idea so total pages will probably change
  const [friendsTotalPages, updateFriendsTotalPages] = useState<
    PlatformFriendsTotalPages[]
  >([
    {
      platform: PlatformFriendType.Steam,
      totalPages: 10,
    },
    {
      platform: PlatformFriendType.PSN,
      totalPages: 10,
    },
    {
      platform: PlatformFriendType.Xbox,
      totalPages: 10,
    },
  ]);

  const sendFriendRequest = (mId: string) => {
    Platform.SocialService.IssueFriendRequest(mId)
      .then((response) => {
        //remove this user from errorList if present
        setFriendMembershipIdsWithError((oldArray) => [
          ...oldArray.filter((value) => value !== mId),
        ]);

        if (!response) {
          Modal.open(Localizer.Friends.FriendRequestFailed);
        }

        //update the list
        getBungieFriendRequests();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const cancelFriendRequest = (mId: string) => {
    //use decline for incoming
    if (FriendsImportUtils.isInFriendArray(incomingRequests, mId)) {
      //use decline for incoming
      Platform.SocialService.DeclineFriendRequest(mId)
        .then((response) => {
          if (!response) {
            Modal.open(Localizer.Friends.DecliningFriendRequest);
          }

          //update the list
          getBungieFriendRequests();
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }

    if (FriendsImportUtils.isInFriendArray(outgoingRequests, mId)) {
      //use remove for outgoing
      Platform.SocialService.RemoveFriendRequest(mId)
        .then((response) => {
          if (!response) {
            Modal.open(Localizer.Friends.DecliningFriendRequest);
          }

          //update the list
          getBungieFriendRequests();
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
  };

  const getPlatformFriends = (platform: PlatformFriendType, page: number) => {
    Platform.SocialService.GetPlatformFriendList(platform, page.toString())
      .then((response: Friends.PlatformFriendResponse) => {
        if (response) {
          updateTotalPages(platform, response.currentPage, response.hasMore);

          setPlatformFriends((oldArray) => [
            ...oldArray.filter((value) => value.platform !== platform),
            {
              platform: platform,
              friendsResponse: response,
              isLoaded: true,
            },
          ]);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setPlatformFriends((oldArray) => [
          ...oldArray.filter((value) => value.platform !== platform),
          {
            platform: platform,
            friendsResponse: null,
            isLoaded: true,
            error: e,
          },
        ]);
      });
  };

  const updateTotalPages = (
    platform: PlatformFriendType,
    currentPage: number,
    hasMore: boolean
  ) => {
    const newFriendsTotalPages = friendsTotalPages.filter(
      (value) => value.platform !== platform
    );

    if (!hasMore) {
      newFriendsTotalPages.push({
        platform: platform,
        totalPages: currentPage + 1,
      });

      updateFriendsTotalPages(newFriendsTotalPages);
    } else if (
      hasMore &&
      currentPage ===
        friendsTotalPages.filter((value) => value.platform === platform)[0]
          .totalPages -
          1
    ) {
      newFriendsTotalPages.push({
        platform: platform,
        totalPages: currentPage + 2,
      });

      updateFriendsTotalPages(newFriendsTotalPages);
    }
  };

  const getAllPlatformFriends = () => {
    validPlatformsLinked.forEach((value) => {
      getPlatformFriends(value, 0);
    });
  };

  const getBungieFriendRequests = () => {
    Platform.SocialService.GetFriendRequestList()
      .then((response: Friends.BungieFriendRequestListResponse) => {
        setIncomingRequests(response.incomingRequests);
        setOutgoingRequests(response.outgoingRequests);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const togglePlatformList = (platform: PlatformFriendType) => {
    let updatedPlatformList = [...openPlatformList];

    if (updatedPlatformList.includes(platform)) {
      updatedPlatformList = updatedPlatformList.filter(
        (value) => value !== platform
      );
    } else {
      updatedPlatformList.push(platform);
    }

    updateOpenPlatformList(updatedPlatformList);
  };

  const showSendButtonForUser = (
    platformFriend: Friends.PlatformFriend
  ): boolean => {
    //friend does not have a bungie account
    if (!FriendsImportUtils.hasBungieAccount(platformFriend)) {
      return false;
    }

    //no incoming and no outgoing requests
    return !FriendsImportUtils.isPendingFriend(
      incomingRequests,
      outgoingRequests,
      platformFriend
    );
  };

  const showCancelButtonForUser = (
    platformFriend: Friends.PlatformFriend
  ): boolean => {
    //incoming or outgoing request
    return FriendsImportUtils.isPendingFriend(
      incomingRequests,
      outgoingRequests,
      platformFriend
    );
  };

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      getValidPlatforms();
    }
  }, [globalState.loggedInUser]);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      getAllPlatformFriends();
      getBungieFriendRequests();
    }
  }, [validPlatformsLinked]);

  const handleRequestsPageChange = (
    pageNumber: { selected: number },
    platform: PlatformFriendType
  ) => {
    getPlatformFriends(platform, pageNumber.selected);
    getBungieFriendRequests();
  };

  const inviteAll = async (platformFriends: Friends.PlatformFriend[]) => {
    //empty the error list we are retrying
    setFriendMembershipIdsWithError([]);

    const sendFriendRequestPromises: Promise<boolean>[] = [];
    const requestedMembershipIdList: string[] = [];
    platformFriends.forEach((friend) => {
      //only friends that arent friends, or pending

      if (
        FriendsImportUtils.hasBungieAccount(friend) &&
        !FriendsImportUtils.isPendingFriend(
          incomingRequests,
          outgoingRequests,
          friend
        ) &&
        !FriendsImportUtils.isAlreadyFriend(props.bungieFriends, friend)
      ) {
        requestedMembershipIdList.push(friend.bungieNetMembershipId);
        sendFriendRequestPromises.push(
          Platform.SocialService.IssueFriendRequest(
            friend.bungieNetMembershipId
          )
        );
      }
    });

    await Promise.all(sendFriendRequestPromises)
      .then((promiseResults: boolean[]) => {
        const failedRequestsMemebershipIds: string[] = [];
        //mark the ones that had errors
        promiseResults.forEach((response, index) => {
          if (!response) {
            failedRequestsMemebershipIds.push(requestedMembershipIdList[index]);
          }
        });

        setFriendMembershipIdsWithError(failedRequestsMemebershipIds);

        if (failedRequestsMemebershipIds.length === 0) {
          Modal.open(<ActionSuccessModal />);
        } else {
          Modal.open(friendsLoc.ThereWereSomeRequests);
        }

        //update the list
        getBungieFriendRequests();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const expandablePlatformList = (
    platform: PlatformFriendType,
    title: string
  ) => {
    const foundPlatform = allPlatformFriendsResponse.find(
      (p) => p.platform === platform
    );

    const isLoaded = foundPlatform?.isLoaded ?? false;
    const isError = foundPlatform?.error ?? false;

    const platformFriendsResponse = foundPlatform?.friendsResponse ?? null;
    const platformFriends = platformFriendsResponse?.platformFriends ?? [];
    const hasMoreThanOnePage =
      platformFriendsResponse !== null &&
      (platformFriendsResponse.hasMore ||
        platformFriendsResponse.currentPage > 0);

    const friendsCount = platformFriendsResponse
      ? platformFriendsResponse.platformFriends.length
      : 0;
    const friendsCountString = Localizer.Format(friendsLoc.NumberFriends, {
      number: hasMoreThanOnePage ? "100+" : friendsCount.toString(),
    });

    const classes = classNames(styles.platformHeader, {
      [styles.noFriendsPlatform]: !isError && isLoaded && friendsCount === 0,
      [styles.loading]: !isLoaded,
      [styles.isError]: isError,
    });

    let subtitle = !isLoaded
      ? friendsLoc.Loading
      : friendsCount === 0
      ? friendsLoc.NoFriendsOnThisPlatform
      : null;

    if (isError) {
      subtitle = foundPlatform.error.message;
    }

    let flair = !isLoaded ? (
      <Spinner />
    ) : friendsCount > 0 ? (
      <span className={styles.friendsCount}>
        {friendsCountString}
        <CgChevronDown />
      </span>
    ) : null;
    const isReAuthNeeded =
      isError &&
      isError.errorCode === PlatformErrorCodes.UserFriendsTokenNeedsRefresh;

    if (isReAuthNeeded) {
      flair = (
        <div className={styles.twoButtons}>
          <Button
            buttonType={"gold"}
            onClick={() => FriendsImportUtils.reAuth(platform)}
          >
            {Localizer.Accountlinking.Reauthorize}
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.friendsImportContainer}>
        <TwoLineItem
          className={classes}
          itemTitle={title}
          itemSubtitle={subtitle}
          icon={FriendsImportUtils.platformReactIcon(platform)}
          flair={flair}
          onClick={() => togglePlatformList(platform)}
        />
        {openPlatformList.includes(platform) && platformFriends && (
          <>
            {ConfigUtils.SystemStatus("PlatformFriendBulkImporter") && (
              <div className={styles.batchAddHeader}>
                <h3>{friendsLoc.BungieAccounts}</h3>
                <Button
                  buttonType={"text"}
                  className={styles.inviteAllButton}
                  onClick={() => inviteAll(platformFriends)}
                >
                  {friendsLoc.InviteAllOnThisPage}
                </Button>
              </div>
            )}
            <ul className={styles.platformFriends}>
              {platformFriends.map((friend) => {
                const noBungieAccount = !FriendsImportUtils.hasBungieAccount(
                  friend
                );
                const isBungieFriend = FriendsImportUtils.isAlreadyFriend(
                  props.bungieFriends,
                  friend
                );
                const errorDuringRequest = friendMembershipIdsWithError.includes(
                  friend.bungieNetMembershipId
                );

                if (noBungieAccount) {
                  return (
                    <li
                      className={styles.platformFriend}
                      key={friend.bungieNetMembershipId}
                    >
                      <OneLineItem
                        className={styles.noBungieAccount}
                        itemTitle={Localizer.Format(
                          friendsLoc.UserDoesNotHaveABungie,
                          { user: friend.platformDisplayName }
                        )}
                        title={friend.platformDisplayName}
                      />
                    </li>
                  );
                }

                return (
                  <li
                    className={styles.platformFriend}
                    key={friend.bungieNetMembershipId}
                  >
                    <TwoLineItem
                      key={friend.bungieNetMembershipId}
                      itemTitle={friend.bungieGlobalDisplayName}
                      itemSubtitle={<p>{friend.platformDisplayName}</p>}
                      icon={FriendsImportUtils.platformReactIcon(platform)}
                      flair={
                        <div className={styles.twoButtons}>
                          {!isBungieFriend && showCancelButtonForUser(friend) && (
                            <Button
                              size={BasicSize.Small}
                              onClick={() =>
                                cancelFriendRequest(
                                  friend.bungieNetMembershipId
                                )
                              }
                            >
                              {Localizer.Actions.CancelRequest}
                            </Button>
                          )}
                          {!isBungieFriend && showSendButtonForUser(friend) && (
                            <Button
                              buttonType={errorDuringRequest ? "red" : "gold"}
                              size={BasicSize.Small}
                              onClick={() =>
                                sendFriendRequest(friend.bungieNetMembershipId)
                              }
                            >
                              {errorDuringRequest
                                ? friendsLoc.ErrorRetry
                                : Localizer.Actions.SendRequest}
                            </Button>
                          )}
                          {isBungieFriend && (
                            <Button
                              buttonType={"disabled"}
                              size={BasicSize.Small}
                            >
                              {friendsLoc.AlreadyFriends}
                            </Button>
                          )}
                          {StringUtils.isNullOrWhiteSpace(
                            friend.bungieNetMembershipId
                          ) && (
                            <Button buttonType={"disabled"}>
                              {Localizer.Actions.SendRequest}
                            </Button>
                          )}
                        </div>
                      }
                    />
                  </li>
                );
              })}
            </ul>
            {platformFriendsResponse &&
              (platformFriendsResponse.hasMore ||
                platformFriendsResponse.currentPage > 0) && (
                <ReactPaginate
                  onPageChange={(e) => handleRequestsPageChange(e, platform)}
                  pageCount={
                    friendsTotalPages.filter(
                      (value) => value.platform === platform
                    )[0].totalPages
                  }
                  pageRangeDisplayed={0}
                  forcePage={platformFriendsResponse.currentPage}
                  marginPagesDisplayed={0}
                  previousLabel={Localizer.usertools.previousPage}
                  nextLabel={Localizer.usertools.nextPage}
                  containerClassName={sharedStyles.paginateInterface}
                  activeClassName={sharedStyles.active}
                  previousClassName={sharedStyles.prev}
                  nextClassName={sharedStyles.next}
                  disabledClassName={sharedStyles.disabled}
                  breakClassName={styles.paginateBreak}
                />
              )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.friendsImport}>
      <div className={styles.linkedPlatforms}>
        {validPlatformsLinked.map((platform) => {
          const strings = FriendsImportUtils.getStringsForPlatformList(
            platform
          );

          return expandablePlatformList(platform, strings.title);
        })}
      </div>
      <div className={styles.unlinkedPlatforms}>
        {validPlatformsToLink.map((platform, index) => {
          const strings = FriendsImportUtils.getStringsForPlatformList(
            platform
          );

          return (
            <div className={styles.friendsImportContainer} key={index}>
              <TwoLineItem
                className={classNames(
                  styles.platformHeader,
                  styles.linkPlatform
                )}
                itemTitle={LocalizerUtils.getPlatformAbbrForMembershipType(
                  UserUtils.getBungieMembershipTypeFromPlatformFriendType(
                    platform
                  )
                )}
                itemSubtitle={Localizer.Format(
                  Localizer.Friends.LinkPlatformToImportFriends,
                  { platform: strings.title }
                )}
                icon={FriendsImportUtils.platformReactIcon(platform)}
                flair={
                  <Button
                    className={styles.linkButton}
                    buttonType={"gold"}
                    size={BasicSize.Small}
                    onClick={() => {
                      setPlatformToLink(platform);
                      setLinkingModalOpen(true);
                    }}
                  >
                    {Localizer.Format(Localizer.Friends.LinkPlatform, {
                      platform: strings.title,
                    })}
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>

      {platformToLink !== PlatformFriendType.Unknown && (
        <ConfirmPlatformLinkingModal
          open={linkingModalOpen}
          onClose={() => setLinkingModalOpen(false)}
          platform={platformToLink}
        />
      )}
    </div>
  );
  // tslint:disable-next-line: max-file-line-count
};
