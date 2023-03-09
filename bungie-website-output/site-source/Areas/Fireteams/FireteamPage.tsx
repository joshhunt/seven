// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import styles from "@Areas/Fireteams/Fireteam.module.scss";
import { FireteamClanTags } from "@Areas/Fireteams/Shared/FireteamClanTags";
import { FireteamCreationTime } from "@Areas/Fireteams/Shared/FireteamCreationTime";
import { FireteamJoin } from "@Areas/Fireteams/Shared/FireteamJoin";
import { FireteamPlatformTag } from "@Areas/Fireteams/Shared/FireteamPlatformTag";
import tagStyles from "@Areas/Fireteams/Shared/FireteamTags.module.scss";
import { FireteamTimeTag } from "@Areas/Fireteams/Shared/FireteamTimeTag";
import { FireteamUser } from "@Areas/Fireteams/Shared/FireteamUser";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { AclEnum, IgnoredItemType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Fireteam, Platform } from "@Platform";
import { BiRefresh } from "@react-icons/all-files/bi/BiRefresh";
import { IoMdLink } from "@react-icons/all-files/io/IoMdLink";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamParams } from "@Routes/RouteParams";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { ReportItem } from "@UI/Report/ReportItem";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface FireteamProps {
  /* modal fireteams need these */
  groupId?: string;
  fireteamId?: string;
  closeFn?: () => void;
  fireteamUpdatedFc?: () => void;
}

export const FireteamPage: React.FC<FireteamProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInClans",
  ]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const params = useParams<IFireteamParams>();
  const isModal = !!props.fireteamId;

  const fireteamsLoc = Localizer.Fireteams;

  const [fireteam, setFireteam] = useState<Fireteam.FireteamResponse>();

  const host = fireteam?.Members?.find(
    (m) =>
      m.destinyUserInfo?.membershipId === fireteam?.Summary?.ownerMembershipId
  );
  const viewerIsHost = destinyMembership?.memberships.some(
    (m) => m.membershipId === fireteam?.Summary?.ownerMembershipId
  );
  const isMember = fireteam?.Members?.find(
    (m) =>
      !!destinyMembership?.memberships?.find(
        (dm) => dm.membershipId === m.destinyUserInfo.membershipId
      )
  );
  //destiny membershipIds that have been loaded are pushed into array
  const [loadedMember, setLoadedMember] = useState<string[]>([]);
  const [loadedHost, setLoadedHost] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [allHaveBeenInvited, setAllHaveBeenInvited] = useState(false);

  const isAdmin = globalState.loggedInUser?.userAcls.some((u) => {
    return (
      u === AclEnum.BNextFounderInAllGroups || u === AclEnum.BNextForumNinja
    );
  });

  const canEditFireteam = isAdmin || viewerIsHost;

  const fireteamActivity = globalState.coreSettings.fireteamActivities.find(
    (a) => a.identifier === fireteam?.Summary?.activityType.toString()
  );

  const getFireteam = () => {
    //use the props one by default (modal)
    const fireteamId = props.fireteamId ?? params?.fireteamId;

    Platform.FireteamService.GetClanFireteam("0", fireteamId).then((result) => {
      setIsReloading(false);
      setFireteam(result);
    });
  };

  useEffect(() => {
    if (!destinyMembership.loaded) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }

    getFireteam();

    return () => {
      setLoadedHost(false);
      setLoadedMember([]);
    };
  }, []);

  useEffect(() => {
    getFireteam();
  }, [params?.fireteamId]);

  const availableSlots = (availableNumSlots: number) => {
    const slots = [];

    for (let i = 0; i < availableNumSlots; i++) {
      if (viewerIsHost) {
        slots.push(
          <div key={i} className={classNames(styles.emptyUser, styles.user)}>
            {fireteamsLoc.WaitingForMemberToJoin}
          </div>
        );
      } else {
        slots.push(
          <Button
            buttonType={"clear"}
            size={BasicSize.FullSize}
            key={i}
            className={classNames(styles.emptyUser, styles.user, styles.button)}
            onClick={() => openJoinFireteam()}
          >
            {fireteamsLoc.JoinFireteamUserCard}
          </Button>
        );
      }
    }

    return slots.length ? slots : null;
  };

  const openJoinFireteam = () => {
    const joinModal = Modal.open(
      <FireteamJoin
        fireteam={fireteam.Summary}
        refreshFireteam={() => {
          props.fireteamUpdatedFc && props.fireteamUpdatedFc();

          getFireteam();

          joinModal.current.close();
        }}
      />
    );
  };

  const inviteAll = () => {
    Platform.FireteamService.InviteToDestiny2Fireteam(
      "0",
      fireteam?.Summary?.fireteamId,
      false
    ).then(() => {
      setAllHaveBeenInvited(true);

      getFireteam();
    });
  };

  const closeFireteam = () => {
    Platform.FireteamService.CloseFireteam(
      fireteam?.Summary?.groupId,
      fireteam?.Summary?.fireteamId
    ).then(() => {
      props.fireteamUpdatedFc && props.fireteamUpdatedFc();

      getFireteam();
    });
  };

  const leaveFireteam = () => {
    Platform.FireteamService.LeaveClanFireteam(
      fireteam?.Summary?.groupId,
      fireteam?.Summary?.fireteamId
    ).then(() => {
      props.fireteamUpdatedFc && props.fireteamUpdatedFc();

      getFireteam();
    });
  };

  const reportFireteam = () => {
    const reportModal = Modal.open(
      <ReportItem
        ignoredItemId={fireteam?.Summary.fireteamId}
        reportType={IgnoredItemType.Fireteam}
        title={Localizer.Fireteams.WhyAreYouReportingThis}
        onReset={() => reportModal.current.close()}
      />
    );
  };

  const fireteamDirectLink = RouteHelper.NewFireteam({
    fireteamId: fireteam?.Summary?.fireteamId ?? "",
  });

  const addToLoaded = (id: string) => {
    if (!loadedMember.includes(id)) {
      setLoadedMember([...loadedMember, id]);
    }
  };

  const activityTypeString = globalState.coreSettings.fireteamActivities.find(
    (a) => a.identifier === fireteam?.Summary.activityType.toString()
  )?.displayName;

  return (
    <SystemDisabledHandler
      systems={[SystemNames.Destiny2, SystemNames.Fireteams]}
    >
      <BungieHelmet
        title={fireteamsLoc.Fireteams}
        description={fireteamsLoc.Fireteams}
      >
        <body className={isModal && SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <RequiresAuth
        onSignIn={() => {
          FireteamsDestinyMembershipDataStore.actions.loadUserData();
          getFireteam();
        }}
      >
        <SpinnerContainer loading={!fireteam || isReloading}>
          {fireteam && (
            <div
              className={classNames(
                styles.fireteamPage,
                !isModal && styles.nonModal
              )}
            >
              <div className={styles.header}>
                <Grid
                  className={styles.headerGrid}
                  style={{
                    backgroundImage: `url(${
                      fireteamActivity?.childSettings?.find(
                        (c) => c.identifier === "widebackground"
                      )?.imagePath
                    })`,
                  }}
                >
                  <div className={styles.creationTime}>
                    <FireteamCreationTime
                      fireteamSummary={fireteam?.Summary}
                      showScheduledTimeOverride={true}
                    />
                    <Anchor
                      className={styles.directLink}
                      url={fireteamDirectLink}
                      legacy={false}
                      onClick={() => isModal && props.closeFn()}
                    >
                      <IoMdLink />
                    </Anchor>
                    <BiRefresh
                      className={styles.refreshIcon}
                      onClick={() => {
                        setIsReloading(true);
                        getFireteam();
                      }}
                    />
                  </div>
                  <GridCol className={styles.headerContent} cols={12}>
                    <div className={styles.headerTop}>
                      <div
                        className={styles.activityIcon}
                        style={{
                          backgroundImage: `url(${fireteamActivity?.imagePath})`,
                        }}
                      />
                    </div>
                    {fireteam?.Summary &&
                      fireteam?.Summary?.title !== activityTypeString && (
                        <h2 className={styles.activity}>
                          {activityTypeString ?? ""}
                        </h2>
                      )}
                    <h3 className={styles.title}>
                      {StringUtils.decodeHtmlEntities(fireteam?.Summary.title)}
                    </h3>
                    <div className={styles.tags}>
                      {!fireteam?.Summary.isValid && (
                        <div
                          className={classNames(
                            styles.closedTag,
                            tagStyles.tag
                          )}
                        >
                          {fireteamsLoc.ClosedFireteam}
                        </div>
                      )}
                      <FireteamPlatformTag
                        fireteamSummary={fireteam?.Summary}
                      />
                      <FireteamTimeTag
                        fireteamSummary={fireteam?.Summary}
                        addToCalendarAvailable={true}
                      />
                      <FireteamClanTags fireteamSummary={fireteam?.Summary} />
                    </div>
                  </GridCol>
                </Grid>
              </div>
              <Grid className={styles.body}>
                {canEditFireteam && fireteam?.Summary?.isValid && (
                  <div className={styles.buttons}>
                    {isAdmin && <span>{fireteamsLoc.ModActions}</span>}
                    <Button
                      buttonType={"gold"}
                      className={styles.goldButton}
                      size={BasicSize.Small}
                      onClick={() => inviteAll()}
                    >
                      {fireteamsLoc.InviteAll}
                    </Button>
                    <Button
                      onClick={() => closeFireteam()}
                      buttonType={"none"}
                      size={BasicSize.Small}
                    >
                      {fireteamsLoc.CloseFireteam}
                    </Button>
                    {/*<Button onClick={() => closeChat()}>{fireteamsLoc.CloseChatAndOpenFireteam}</Button>*/}
                  </div>
                )}
                {!viewerIsHost && fireteam?.Summary?.isValid && (
                  <div className={styles.buttons}>
                    {!isMember && (
                      <Button
                        buttonType={"gold"}
                        size={BasicSize.Small}
                        className={styles.goldButton}
                        onClick={() => openJoinFireteam()}
                      >
                        {fireteamsLoc.JoinFireteam}
                      </Button>
                    )}
                    {isMember && (
                      <Button
                        buttonType={"gold"}
                        size={BasicSize.Small}
                        className={styles.goldButton}
                        onClick={() => leaveFireteam()}
                      >
                        {fireteamsLoc.LeaveFireteam}
                      </Button>
                    )}
                    <Button
                      size={BasicSize.Small}
                      buttonType={"none"}
                      onClick={() => reportFireteam()}
                    >
                      {fireteamsLoc.ReportFireteam}
                    </Button>
                  </div>
                )}
                <div className={styles.members}>
                  <h4>{fireteamsLoc.Host}</h4>
                  <FireteamUser
                    member={host}
                    isHost={viewerIsHost}
                    fireteam={fireteam?.Summary}
                    invited={false}
                    isAdmin={isAdmin}
                    isSelf={viewerIsHost}
                  />
                  <h4>
                    {fireteam?.Summary.availablePlayerSlotCount === 1
                      ? Localizer.Format(
                          fireteamsLoc.LookingForNumberMemberSingle,
                          { number: fireteam?.Summary.availablePlayerSlotCount }
                        )
                      : Localizer.Format(fireteamsLoc.LookingForNumberMembers, {
                          number: fireteam?.Summary.availablePlayerSlotCount,
                        })}
                  </h4>
                  {fireteam?.Members?.filter(
                    (m) =>
                      m.destinyUserInfo.membershipId !==
                      host.destinyUserInfo.membershipId
                  ).map((m) => {
                    const isSelf = !!destinyMembership.memberships?.find(
                      (dm) =>
                        dm.membershipId === m.destinyUserInfo?.membershipId
                    );

                    return (
                      <FireteamUser
                        key={m.destinyUserInfo.membershipId}
                        isHost={viewerIsHost}
                        invited={allHaveBeenInvited}
                        isSelf={isSelf}
                        isAdmin={isAdmin}
                        member={m}
                        fireteam={fireteam?.Summary}
                        refreshFireteam={() => getFireteam()}
                      />
                    );
                  })}
                  {availableSlots(fireteam?.Summary.availablePlayerSlotCount)}
                </div>
              </Grid>
            </div>
          )}
        </SpinnerContainer>
      </RequiresAuth>
    </SystemDisabledHandler>
  );
};
