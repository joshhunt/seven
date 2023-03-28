// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import { FireteamPage } from "@Areas/Fireteams/FireteamPage";
import { CreateFireteam } from "@Areas/Fireteams/Shared/CreateFireteam";
import { FireteamListItem } from "@Areas/Fireteams/Shared/FireteamListItem";
import { FireteamUtils } from "@Areas/Fireteams/Shared/FireteamUtils";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  FireteamDateRange,
  FireteamPlatform,
  FireteamPublicSearchOption,
  FireteamSlotSearch,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Queries } from "@Platform";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router";
import styles from "./Fireteams.module.scss";

export interface IClanFireteamsAvailable {
  groupId: string;
  numberOfAvailable: number;
}

export const Fireteams: React.FC = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInClans",
  ]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const history = useHistory();
  const urlParams = new URLSearchParams(window.location.search);

  const clansLoc = Localizer.Clans;
  const fireteamsLoc = Localizer.Fireteams;

  const canCreateFireteam =
    destinyMembership?.characters &&
    Object.keys(destinyMembership?.characters).length > 0;

  const fireteamDateRange = FireteamDateRange.All;
  const fireteamActivityType = urlParams.get("activityType")
    ? parseInt(urlParams.get("activityType"))
    : 0;
  const fireteamPlatform = urlParams.get("platform")
    ? FireteamPlatform[
        urlParams.get("platform") as keyof typeof FireteamPlatform
      ]
    : FireteamPlatform.Any;
  const fireteamSlotSearch = urlParams.get("slotSearch")
    ? FireteamSlotSearch[
        urlParams.get("slotSearch") as keyof typeof FireteamSlotSearch
      ]
    : FireteamSlotSearch.HasOpenPlayerSlots;
  const page = urlParams.get("page") ? parseInt(urlParams.get("page"), 10) : 0;
  const fireteamGroupId = urlParams.get("groupId")
    ? urlParams.get("groupId")
    : "0";
  const langFilter = urlParams.get("lang") ?? "";
  const isMine =
    urlParams.get("isMine") && UserUtils.isAuthenticated(globalState)
      ? urlParams.get("isMine") === "1"
      : false;
  const isScheduled = urlParams.get("isScheduled") === "1";

  const isClanView = fireteamGroupId !== "0";

  const updateResults = (
    lang: string,
    activity: string,
    platform: string,
    groupId: string,
    pageNumber: number,
    mine: boolean,
    scheduled: boolean
  ) => {
    history.push(
      RouteHelper.NewFireteams({
        platform: platform,
        lang: lang,
        activityType: activity,
        groupId: groupId,
        page: pageNumber.toString(),
        isMine: mine ? "1" : "0",
        isScheduled: scheduled ? "1" : "0",
      }).url
    );
  };

  if (!isMine && urlParams.get("isMine") === "1") {
    //change the url to match the results, since this is not users personal list of fireteams
    updateResults(
      langFilter,
      fireteamActivityType.toString(),
      EnumUtils.getNumberValue(fireteamPlatform, FireteamPlatform).toString(),
      fireteamGroupId,
      page,
      false,
      isScheduled
    );
  }

  const [fireteamSearchResponse, setFireteamSearchResponse] = useState<
    Queries.SearchResultFireteamSummary
  >();
  const [myFireteamsSearchResponse, setMyFireteamsSearchResponse] = useState<
    Queries.SearchResultFireteamResponse
  >();
  const [showMyFireteams, setShowMyFireteams] = useState(isMine);
  const [openFilters, setOpenFilters] = useState(false);
  const [availableFireteamsPerClan, setAvailableFireteamsPerClan] = useState<
    IClanFireteamsAvailable[]
  >();

  const getAvailableFireteams = (
    lang: string,
    activity: string,
    platform: string,
    groupId: string,
    pageNumber: number,
    scheduled: boolean
  ) => {
    setMyFireteamsSearchResponse(null);

    if (groupId && groupId !== "0") {
      //clan hosted
      Platform.FireteamService.GetAvailableClanFireteams(
        groupId,
        FireteamPlatform[platform as keyof typeof FireteamPlatform],
        parseInt(activity, 10),
        fireteamDateRange,
        fireteamSlotSearch,
        FireteamPublicSearchOption.PublicAndPrivate,
        pageNumber,
        lang,
        isScheduled
      ).then((result) => {
        setFireteamSearchResponse(result);
      });
    } else {
      //public
      Platform.FireteamService.SearchPublicAvailableClanFireteams(
        FireteamPlatform[platform as keyof typeof FireteamPlatform],
        parseInt(activity, 10),
        fireteamDateRange,
        fireteamSlotSearch,
        pageNumber,
        lang,
        isScheduled
      ).then((result) => {
        setFireteamSearchResponse(result);
      });
    }
  };

  const getClanFireteamsForUser = (
    lang: string,
    activity: string,
    platform: string,
    pageNumber: number
  ) => {
    if (globalState.loggedInUserClans?.results) {
      Promise.allSettled(
        globalState.loggedInUserClans?.results?.map((c) =>
          Platform.FireteamService.GetAvailableClanFireteams(
            c.group.groupId,
            FireteamPlatform[platform as keyof typeof FireteamPlatform],
            parseInt(activity, 10),
            fireteamDateRange,
            fireteamSlotSearch,
            FireteamPublicSearchOption.PublicAndPrivate,
            pageNumber,
            lang,
            false
          )
        )
      ).then((results) => {
        const settledPromiseResultsArray: Queries.SearchResultFireteamSummary[] = results.map(
          (r) => r.status === "fulfilled" && r.value
        );

        setAvailableFireteamsPerClan(
          settledPromiseResultsArray.map((r) => {
            return {
              groupId: r.results[0]?.groupId,
              numberOfAvailable: r.results?.length ?? 0,
            };
          })
        );
      });
    }
  };

  const getMyFireteams = (
    lang: string,
    platform: string,
    groupId: string,
    pageNumber: number
  ) => {
    setFireteamSearchResponse(null);

    Platform.FireteamService.GetMyClanFireteams(
      groupId,
      FireteamPlatform[platform as keyof typeof FireteamPlatform],
      true,
      pageNumber,
      false,
      lang
    ).then((result) => {
      setMyFireteamsSearchResponse(result);
    });
  };

  const getFireteams = (forceRefresh: boolean) => {
    if (forceRefresh) {
      if (isMine) {
        setMyFireteamsSearchResponse(undefined);
      } else {
        setFireteamSearchResponse(undefined);
      }
    }

    if (!isMine) {
      getAvailableFireteams(
        langFilter,
        fireteamActivityType.toString(),
        EnumUtils.getNumberValue(fireteamPlatform, FireteamPlatform).toString(),
        fireteamGroupId,
        page,
        isScheduled
      );
    }

    if (UserUtils.isAuthenticated(globalState) && isMine) {
      getMyFireteams(
        langFilter,
        EnumUtils.getNumberValue(fireteamPlatform, FireteamPlatform).toString(),
        fireteamGroupId,
        page
      );
    }
  };

  useEffect(() => {
    if (!destinyMembership.loaded) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }

    getFireteams(false);
  }, []);

  useEffect(() => {
    getFireteams(true);
  }, [window.location.search]);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    } else {
      FireteamsDestinyMembershipDataStore.actions.resetMembership();
    }
  }, [UserUtils.isAuthenticated(globalState)]);

  useEffect(() => {
    getClanFireteamsForUser(
      langFilter,
      fireteamActivityType.toString(),
      EnumUtils.getNumberValue(fireteamPlatform, FireteamPlatform).toString(),
      page
    );
  }, [globalState.loggedInUserClans?.results]);

  useEffect(() => {
    if (!ConfigUtils.SystemStatus(SystemNames.ReactFireteamUI)) {
      window.location.href =
        "/en/ClanV2/FireteamSearch?activityType=0&platform=0";
    }
  }, []);

  const handleCreateFireteamButton = () => {
    if (UserUtils.isAuthenticated(globalState)) {
      const createModal = Modal.open(
        <CreateFireteam
          groupId={fireteamGroupId}
          onCreate={(groupId, fireteamId) => {
            Modal.open(
              <FireteamPage fireteamId={fireteamId} groupId={groupId} />,
              {
                contentClassName: styles.modalContentClass,
                onClose: () => {
                  getFireteams(true);
                  createModal?.current?.close();
                },
              }
            );
          }}
        />,
        { contentClassName: styles.modalContentClass }
      );
    } else {
      //not logged in
      const signInModal = Modal.signIn(() => {
        FireteamsDestinyMembershipDataStore.actions.loadUserData();
        signInModal.current.close();
      });
    }
  };

  const noFireteamResults =
    (!fireteamSearchResponse?.results ||
      fireteamSearchResponse?.results?.length === 0) &&
    (!myFireteamsSearchResponse?.results ||
      myFireteamsSearchResponse?.results.length === 0);
  const noAdditionalAllFireteamResults =
    fireteamSearchResponse &&
    fireteamSearchResponse?.query?.currentPage === 0 &&
    !fireteamSearchResponse?.hasMore;
  const noAdditionalSelfFireteamResults =
    myFireteamsSearchResponse &&
    myFireteamsSearchResponse.query.currentPage === 0 &&
    !myFireteamsSearchResponse.hasMore;

  const clanInView = globalState?.loggedInUserClans?.results?.find(
    (c) => c.group?.groupId === fireteamGroupId
  );

  const pageLabel = () => {
    if (clanInView) {
      return Localizer.Format(fireteamsLoc.ClannameFireteams, {
        clanname: clanInView?.group?.name,
      });
    } else {
      if (showMyFireteams) {
        return fireteamsLoc.MyFireteams;
      } else {
        return isScheduled ? fireteamsLoc.Scheduled : fireteamsLoc.PlayingNow;
      }
    }
  };

  return (
    <SystemDisabledHandler
      systems={[SystemNames.Destiny2, SystemNames.Fireteams]}
    >
      <BungieHelmet
        title={fireteamsLoc.Fireteams}
        description={fireteamsLoc.Fireteams}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.fireteamsSearchPage}>
        <div
          className={styles.header}
          style={{
            backgroundImage: `url(${SeasonsDefinitions.currentSeason.progressPageImage})`,
          }}
          onClick={() =>
            updateResults(
              langFilter,
              fireteamActivityType.toString(),
              EnumUtils.getNumberValue(
                fireteamPlatform,
                FireteamPlatform
              ).toString(),
              fireteamGroupId,
              0,
              isMine,
              isScheduled
            )
          }
        >
          <Grid className={styles.headerGrid}>
            <GridCol className={styles.headerContent} cols={12}>
              <h2 className={styles.findFireteam}>
                {fireteamsLoc.FindFireteam}
              </h2>
              <p>{fireteamsLoc.FindPlayersAndInviteThem}</p>
            </GridCol>
          </Grid>
        </div>
        <Grid className={styles.body}>
          {globalState.responsive.mobile && (
            <GridCol
              cols={12}
              mobile={12}
              className={styles.mobileResultsHeader}
            >
              <div className={styles.resultsHeader}>
                <p className={styles.resultsHeaderLabel}>
                  {!isMine && (
                    <Dropdown
                      className={classNames(
                        styles.filterDropdown,
                        styles.activityDropdown
                      )}
                      options={FireteamUtils.activityOptions(
                        globalState.coreSettings,
                        false
                      )}
                      iconPath={
                        "/7/ca/destiny/bgs/fireteams/icon_fireteamActivities.svg"
                      }
                      selectedValue={fireteamActivityType.toString()}
                      onChange={(value) =>
                        updateResults(
                          langFilter,
                          value,
                          EnumUtils.getNumberValue(
                            fireteamPlatform,
                            FireteamPlatform
                          ).toString(),
                          fireteamGroupId,
                          page,
                          isMine,
                          isScheduled
                        )
                      }
                    />
                  )}
                </p>
                <Button
                  onClick={handleCreateFireteamButton}
                  className={classNames(styles.buttonCreateFireteam, {
                    [styles.fakeDisable]: !canCreateFireteam,
                  })}
                  buttonType={canCreateFireteam ? "gold" : "clear"}
                >
                  {Localizer.Clans.CreateFireteam}
                </Button>
              </div>
            </GridCol>
          )}
          {globalState.responsive.mobile && (
            <GridCol
              cols={12}
              mobile={12}
              className={styles.mobileFiltersHeader}
            >
              <div
                className={classNames(
                  styles.myFireteamContainer,
                  styles.sidebarContainer,
                  styles.tabButtons
                )}
              >
                <div
                  className={styles.openFilter}
                  onClick={() => setOpenFilters(!openFilters)}
                >
                  <IoMdArrowDropdown />
                  {openFilters
                    ? fireteamsLoc.HideFilters
                    : fireteamsLoc.ShowFilters}
                </div>
              </div>
            </GridCol>
          )}
          <GridCol
            cols={3}
            medium={5}
            mobile={12}
            className={classNames(styles.fireteamsMobileSidebar, {
              [styles.open]: openFilters,
            })}
          >
            <div className={styles.fireteamsSidebar}>
              {UserUtils.isAuthenticated(globalState) && (
                <div
                  className={classNames(
                    styles.myFireteamContainer,
                    styles.sidebarContainer,
                    styles.tabButtons
                  )}
                >
                  <Button
                    className={
                      !showMyFireteams &&
                      !isClanView &&
                      !isScheduled &&
                      styles.active
                    }
                    buttonType={
                      !showMyFireteams && !isClanView && !isScheduled
                        ? "disabled"
                        : "white"
                    }
                    onClick={() => {
                      updateResults(
                        langFilter,
                        fireteamActivityType.toString(),
                        EnumUtils.getNumberValue(
                          fireteamPlatform,
                          FireteamPlatform
                        ).toString(),
                        "0",
                        0,
                        false,
                        false
                      );
                      setShowMyFireteams(false);
                    }}
                  >
                    {fireteamsLoc.PlayingNow}
                  </Button>
                  <Button
                    className={
                      !showMyFireteams &&
                      !isClanView &&
                      isScheduled &&
                      styles.active
                    }
                    buttonType={
                      !showMyFireteams && !isClanView && isScheduled
                        ? "disabled"
                        : "white"
                    }
                    onClick={() => {
                      updateResults(
                        langFilter,
                        fireteamActivityType.toString(),
                        EnumUtils.getNumberValue(
                          fireteamPlatform,
                          FireteamPlatform
                        ).toString(),
                        "0",
                        0,
                        false,
                        true
                      );
                      setShowMyFireteams(false);
                    }}
                  >
                    {fireteamsLoc.Scheduled}
                  </Button>
                  {UserUtils.isAuthenticated(globalState) && (
                    <>
                      <Button
                        className={
                          showMyFireteams && !isClanView && styles.active
                        }
                        buttonType={
                          showMyFireteams && !isClanView ? "disabled" : "white"
                        }
                        onClick={() => {
                          updateResults(
                            langFilter,
                            fireteamActivityType.toString(),
                            EnumUtils.getNumberValue(
                              fireteamPlatform,
                              FireteamPlatform
                            ).toString(),
                            "0",
                            0,
                            true,
                            isScheduled
                          );
                          setShowMyFireteams(true);
                        }}
                      >
                        {fireteamsLoc.MyFireteams}
                      </Button>
                      {globalState?.loggedInUserClans?.results.map((c) => {
                        const availableClanFireteams = availableFireteamsPerClan?.find(
                          (f) =>
                            f.groupId === c.group.groupId &&
                            f.numberOfAvailable > 0
                        )?.numberOfAvailable;

                        return (
                          <Button
                            key={c.group?.groupId}
                            className={
                              !showMyFireteams &&
                              isClanView &&
                              fireteamGroupId === c.group?.groupId &&
                              styles.active
                            }
                            buttonType={
                              !showMyFireteams && isClanView
                                ? "disabled"
                                : "white"
                            }
                            onClick={() => {
                              updateResults(
                                langFilter,
                                fireteamActivityType.toString(),
                                EnumUtils.getNumberValue(
                                  fireteamPlatform,
                                  FireteamPlatform
                                ).toString(),
                                c.group?.groupId,
                                0,
                                false,
                                isScheduled
                              );
                              setShowMyFireteams(false);
                            }}
                          >
                            {Localizer.Format(fireteamsLoc.ClannameFireteams, {
                              clanname: c.group.name,
                            })}
                            {availableClanFireteams > 0 && (
                              <span className={styles.pip}>
                                {
                                  availableFireteamsPerClan?.find(
                                    (f) =>
                                      f.groupId === c.group.groupId &&
                                      f.numberOfAvailable > 0
                                  )?.numberOfAvailable
                                }
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
              <div
                className={classNames(
                  styles.optionsContainer,
                  styles.sidebarContainer
                )}
              >
                <h4>{fireteamsLoc.Filters}</h4>
                <Dropdown
                  className={classNames(
                    styles.filterDropdown,
                    styles.platformDropdown
                  )}
                  options={FireteamUtils.platformOptions()}
                  iconPath={
                    "/7/ca/destiny/bgs/fireteams/icon_fireteamPlatforms.svg"
                  }
                  selectedValue={EnumUtils.getNumberValue(
                    fireteamPlatform,
                    FireteamPlatform
                  ).toString()}
                  onChange={(value) =>
                    updateResults(
                      langFilter,
                      fireteamActivityType.toString(),
                      value,
                      fireteamGroupId,
                      page,
                      isMine,
                      isScheduled
                    )
                  }
                />
                <Dropdown
                  className={classNames(
                    styles.filterDropdown,
                    styles.langDropdown
                  )}
                  options={FireteamUtils.langOptions()}
                  iconPath={
                    "/7/ca/destiny/bgs/fireteams/icon_fireteamLanguages.svg"
                  }
                  selectedValue={langFilter}
                  onChange={(value) =>
                    updateResults(
                      value,
                      fireteamActivityType.toString(),
                      EnumUtils.getNumberValue(
                        fireteamPlatform,
                        FireteamPlatform
                      ).toString(),
                      fireteamGroupId,
                      page,
                      isMine,
                      isScheduled
                    )
                  }
                />
              </div>
              <div
                className={classNames(
                  styles.helpContainer,
                  styles.sidebarContainer
                )}
              >
                <h4>{fireteamsLoc.Help}</h4>
                <Anchor url={RouteHelper.Help()}>
                  {fireteamsLoc.MyInviteIsnTWorking}
                </Anchor>
                <Anchor url={RouteHelper.Help()}>
                  {fireteamsLoc.ReportingSpam}
                </Anchor>
              </div>
            </div>
          </GridCol>
          <GridCol cols={9} medium={7} mobile={12}>
            {!globalState.responsive.mobile && (
              <div className={styles.resultsHeader}>
                {!isMine && (
                  <Dropdown
                    className={classNames(
                      styles.filterDropdown,
                      styles.activityDropdown
                    )}
                    options={FireteamUtils.activityOptions(
                      globalState.coreSettings,
                      false
                    )}
                    iconPath={
                      "/7/ca/destiny/bgs/fireteams/icon_fireteamActivities.svg"
                    }
                    selectedValue={fireteamActivityType.toString()}
                    onChange={(value) =>
                      updateResults(
                        langFilter,
                        value,
                        EnumUtils.getNumberValue(
                          fireteamPlatform,
                          FireteamPlatform
                        ).toString(),
                        fireteamGroupId,
                        page,
                        isMine,
                        isScheduled
                      )
                    }
                  />
                )}
                <Button
                  onClick={handleCreateFireteamButton}
                  className={classNames(styles.buttonCreateFireteam, {
                    [styles.fakeDisable]: !canCreateFireteam,
                  })}
                  buttonType={canCreateFireteam ? "gold" : "clear"}
                >
                  {Localizer.Clans.CreateFireteam}
                </Button>
              </div>
            )}
            {fireteamSearchResponse?.results &&
              fireteamSearchResponse?.results?.length > 0 && (
                <>
                  <ul className={styles.resultsSearchFireteams}>
                    {fireteamSearchResponse?.results?.map((fs) => (
                      <FireteamListItem
                        key={fs.fireteamId}
                        fireteamSummary={fs}
                        fireteamModalClosedFn={() => {
                          getFireteams(true);
                        }}
                      />
                    ))}
                  </ul>
                  {!noAdditionalAllFireteamResults && (
                    <ReactPaginate
                      onPageChange={(value) =>
                        updateResults(
                          langFilter,
                          fireteamActivityType.toString(),
                          EnumUtils.getNumberValue(
                            fireteamPlatform,
                            FireteamPlatform
                          ).toString(),
                          fireteamGroupId,
                          value.selected,
                          false,
                          isScheduled
                        )
                      }
                      pageCount={
                        fireteamSearchResponse.query.currentPage > 3 &&
                        fireteamSearchResponse.hasMore
                          ? fireteamSearchResponse.query.currentPage + 5
                          : 5
                      }
                      forcePage={page}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      previousLabel={Localizer.usertools.previousPage}
                      nextLabel={Localizer.usertools.nextPage}
                      containerClassName={styles.paginateInterface}
                      activeClassName={styles.active}
                      previousClassName={styles.prev}
                      nextClassName={styles.next}
                      disabledClassName={styles.disabled}
                    />
                  )}
                </>
              )}
            {myFireteamsSearchResponse?.results &&
              myFireteamsSearchResponse?.results?.length > 0 && (
                <>
                  <ul className={styles.resultsSearchFireteams}>
                    {myFireteamsSearchResponse?.results?.map((fs) => (
                      <FireteamListItem
                        key={fs.Summary.fireteamId}
                        fireteamSummary={fs.Summary}
                        fireteamModalClosedFn={() => getFireteams(true)}
                        fireteamHostMembershipType={
                          fs.Members.find(
                            (m) =>
                              m.destinyUserInfo.membershipId ===
                              fs.Summary.ownerMembershipId
                          )?.destinyUserInfo.membershipType
                        }
                      />
                    ))}
                  </ul>
                  {!noAdditionalSelfFireteamResults && (
                    <ReactPaginate
                      onPageChange={(value) =>
                        updateResults(
                          langFilter,
                          fireteamActivityType.toString(),
                          EnumUtils.getNumberValue(
                            fireteamPlatform,
                            FireteamPlatform
                          ).toString(),
                          fireteamGroupId,
                          value.selected,
                          true,
                          isScheduled
                        )
                      }
                      pageCount={
                        myFireteamsSearchResponse.query.currentPage > 3 &&
                        myFireteamsSearchResponse.hasMore
                          ? myFireteamsSearchResponse.query.currentPage + 5
                          : 5
                      }
                      forcePage={page}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      previousLabel={Localizer.usertools.previousPage}
                      nextLabel={Localizer.usertools.nextPage}
                      containerClassName={styles.paginateInterface}
                      activeClassName={styles.active}
                      previousClassName={styles.prev}
                      nextClassName={styles.next}
                      disabledClassName={styles.disabled}
                    />
                  )}
                </>
              )}
            {noFireteamResults && (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateIcon} />
                <h4
                  className={classNames(
                    styles.emptyHeader,
                    styles.sectionHeader
                  )}
                >
                  {clansLoc.NoFireteamsFound}
                </h4>
                <p>{clansLoc.CreateOneOrTryChanging}</p>
              </div>
            )}
          </GridCol>
        </Grid>
      </div>
    </SystemDisabledHandler>
  );
};
