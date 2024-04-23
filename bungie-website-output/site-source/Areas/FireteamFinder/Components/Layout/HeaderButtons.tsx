// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FireteamHelpButton } from "@Areas/FireteamFinder/Components/Shared/FireteamHelpButton";
import { FireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import {
  PlayerFireteamContext,
  PlayerFireteamDispatchContext,
} from "@Areas/FireteamFinder/Detail";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  DestinyFireteamFinderApplicationType,
  DestinyFireteamFinderLobbyState,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { FireteamFinder, Platform } from "@Platform";
import { FaPlus } from "@react-icons/all-files/fa/FaPlus";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/RouteParams";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import modalStyles from "../Dashboard/CharacterSelect/CharacterSelect.module.scss";
import styles from "./HeaderButtons.module.scss";

export type ButtonConfiguration =
  | "none"
  | "dashboard"
  | "browse"
  | "member"
  | "detail"
  | "detail-applied"
  | "admin";
export type CloseFireteamType = "close" | "leave";

interface HeaderButtonsProps {
  className?: string;
  buttonConfig: ButtonConfiguration;
  isLoggedIn?: boolean;
}

export const HeaderButtons: React.FC<HeaderButtonsProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const fireteamDestinyData = useDataStore(FireteamsDestinyMembershipDataStore);
  const context = useContext(PlayerFireteamContext);
  const contextDispatch = useContext(PlayerFireteamDispatchContext);
  const isActive =
    context &&
    context?.fireteamLobby?.state === DestinyFireteamFinderLobbyState.Active;
  const { lobbyId } = useParams<IFireteamFinderParams>();
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const [pendingApplications, setPendingApplications] = useState<
    FireteamFinder.DestinyFireteamFinderApplication[]
  >();
  const [
    buttonInteractionDisabled,
    setButtonInteractionDisabled,
  ] = React.useState(false);
  const history = useHistory();

  useEffect(() => {
    if (context?.fireteamListing?.listingId) {
      Platform.FireteamfinderService.GetListingApplications(
        context?.fireteamListing?.listingId,
        destinyMembership?.selectedMembership?.membershipType,
        destinyMembership?.selectedMembership?.membershipId,
        destinyMembership?.selectedCharacter?.characterId,
        100,
        "",
        "0"
      ).then((result) => {
        // this will exclude accepted and declined applications, only those waiting on owner to accept or decline will show
        setPendingApplications(
          result?.applications.filter((app) => app?.state === 2)
        );
      });
    }
  }, [context?.fireteamListing?.listingId]);

  const copyToClipboard = () => {
    //copy url to clipboard and show success toast

    navigator.clipboard.writeText(window.location.href).then(
      function () {
        Toast.show(Localizer.fireteams.copied, {
          position: "tr",
        });
      },
      function () {
        Modal.open(Localizer.fireteams.ThereWasAProblemCopying);
      }
    );
  };

  const joinFireteam = () => {
    if (context?.fireteamListing?.listingId) {
      setButtonInteractionDisabled(true);
      Platform.FireteamfinderService.GetLobby(
        lobbyId,
        fireteamDestinyData?.selectedMembership?.membershipType,
        fireteamDestinyData?.selectedMembership?.membershipId,
        fireteamDestinyData?.selectedCharacter?.characterId
      ).then((lobby) => {
        // I don't know why I wrote this, I think it should still apply even if it is active, but I must have had a reason so I am leaving it here for a second to rollback if I am wrong
        // if (lobby?.state === DestinyFireteamFinderLobbyState.Active)
        // {
        // 	Modal.error(Localizer.fireteams.LobbyAlreadyActive);
        //
        // 	return;
        // }
        Platform.FireteamfinderService.ApplyToListing(
          lobby?.listingId,
          DestinyFireteamFinderApplicationType.Search,
          fireteamDestinyData?.selectedMembership?.membershipType,
          fireteamDestinyData?.selectedMembership?.membershipId,
          fireteamDestinyData?.selectedCharacter?.characterId
        )
          .then(() => {
            //reload the page
            window.location.reload();
          })
          .catch(ConvertToPlatformError)
          .catch((e) => {
            Modal.error(e);
          })
          .catch(ConvertToPlatformError)
          .catch((e) => {
            Modal.error(e);
          })
          .finally(() => {
            setButtonInteractionDisabled(false);
          });
      });
    }
  };

  const cancelApplication = () => {
    if (context?.fireteamListing?.lobbyId) {
      Platform.FireteamfinderService.LeaveApplication(
        context?.matchingApplication?.applicationId,
        fireteamDestinyData?.selectedMembership?.membershipType,
        fireteamDestinyData?.selectedMembership?.membershipId,
        fireteamDestinyData?.selectedCharacter?.characterId
      )
        .then(() => {
          contextDispatch.updateMatchingApplication(null);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  };

  const closeFireteam = (closingType: CloseFireteamType) => {
    Platform.FireteamfinderService.LeaveLobby(
      context?.fireteamLobby?.lobbyId,
      fireteamDestinyData?.selectedMembership?.membershipType,
      fireteamDestinyData?.selectedMembership?.membershipId,
      fireteamDestinyData?.selectedCharacter?.characterId
    )
      .then(() => {
        closingType === "close"
          ? history.push(
              RouteDefs.Areas.FireteamFinder.getAction("Index").resolve().url
            )
          : window.location.reload();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      });

    return true;
  };

  const openCloseModal = () => {
    ConfirmationModal.show({
      title: fireteamsLoc.CloseFireteam,
      type: "warning",
      children: fireteamsLoc.CloseFireteamConfirm,
      confirmButtonProps: {
        labelOverride: fireteamsLoc.CloseFireteam,
        buttonType: "gold",
        onClick: () => closeFireteam("close"),
      },
    });
  };

  const openLeaveModal = () => {
    ConfirmationModal.show({
      title: fireteamsLoc.Leave,
      type: "warning",
      children: fireteamsLoc.LeaveFireteamConfirm,
      confirmButtonProps: {
        labelOverride: fireteamsLoc.Leave,
        buttonType: "gold",
        onClick: () => closeFireteam("leave"),
      },
    });
  };

  const activateFireteam = async () => {
    setButtonInteractionDisabled(true);

    Platform.FireteamfinderService.ActivateLobby(
      context?.fireteamLobby?.lobbyId,
      fireteamDestinyData?.selectedMembership?.membershipType,
      fireteamDestinyData?.selectedMembership?.membershipId,
      fireteamDestinyData?.selectedCharacter?.characterId,
      true
    )
      .then(() => {
        // get new lobby so we can update the listing value
        Platform.FireteamfinderService.GetLobby(
          context?.fireteamLobby?.lobbyId,
          fireteamDestinyData?.selectedMembership?.membershipType,
          fireteamDestinyData?.selectedMembership?.membershipId,
          fireteamDestinyData?.selectedCharacter?.characterId
        ).then((result) => {
          Platform.FireteamfinderService.GetListing(result?.listingId)
            .then((listing) => {
              contextDispatch.updateListing(listing);
            })
            .catch(ConvertToPlatformError)
            .catch((e) => {
              Modal.error(e);
            });
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      })
      .finally(() => {
        setButtonInteractionDisabled(false);
      });
  };

  const handleActivateFireteam = () => {
    if (context?.fireteamLobby && pendingApplications.length > 0) {
      ConfirmationModal.show({
        title: fireteamsLoc.ThereArePendingApplicants,
        type: "warning",
        children: fireteamsLoc.DeclinePendingApplications,
        confirmButtonProps: {
          labelOverride: fireteamsLoc.Proceed,
          buttonType: "gold",
          onClick: () => {
            activateFireteam();

            return true;
          },
        },
      });
    }

    if (context?.fireteamLobby && pendingApplications.length === 0) {
      activateFireteam();
    }
  };

  const CharacterModal: React.FC = () => {
    return (
      <div className={modalStyles.selectModalWrapper}>
        <DestinyAccountWrapper
          membershipDataStore={FireteamsDestinyMembershipDataStore}
          showCrossSaveBanner={false}
        >
          {({ platformSelector, characterCardSelector }: IAccountFeatures) => (
            <div>
              {platformSelector}
              <div className={modalStyles.cardWrapper}>
                {characterCardSelector}
              </div>
            </div>
          )}
        </DestinyAccountWrapper>
      </div>
    );
  };

  const openCharacterSelect = () => {
    ConfirmationModal.show({
      title: Localizer.fireteams.SelectCharacterAndPlatform,
      type: "none",
      children: <CharacterModal />,
      confirmButtonProps: {
        labelOverride: fireteamsLoc.applyToJoin,
        buttonType: "gold",
        onClick: () => {
          joinFireteam();

          return true;
        },
      },
    });
  };

  const isAutoJoin =
    context?.fireteamLobby?.settings?.listingValues?.find(
      (v) =>
        v.valueType.toString() ===
        FireteamFinderValueTypes.applicationRequirement
    )?.values?.[0] === 0;
  const applyLabel = isAutoJoin ? fireteamsLoc.Join : fireteamsLoc.ApplyToJoin;
  const BrowseButton = () => (
    <Button
      className={styles.headerButton}
      icon={<FaSearch />}
      buttonType={"gold"}
      url={RouteHelper.FireteamFinderBrowse()}
    >
      {fireteamsLoc.searchlistings}
    </Button>
  );
  const CreateListingButton = () => (
    <Button
      className={styles.headerButton}
      icon={<FaPlus />}
      buttonType={"white"}
      url={RouteHelper.FireteamFinderCreate()}
    >
      {fireteamsLoc.createListing}
    </Button>
  );
  const CreateFireteamButton = () => (
    <Button
      className={styles.headerButton}
      icon={<FaPlus />}
      buttonType={"gold"}
      url={RouteHelper.FireteamFinderCreate()}
    >
      {fireteamsLoc.createFireteam}
    </Button>
  );
  const ShareButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"white"}
      onClick={() => copyToClipboard()}
    >
      {fireteamsLoc.Share}
    </Button>
  );
  const LeaveButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"red"}
      onClick={() => openLeaveModal()}
    >
      {fireteamsLoc.Leave}
    </Button>
  );
  const CloseButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"red"}
      onClick={() => openCloseModal()}
    >
      {fireteamsLoc.CloseFireteam}
    </Button>
  );
  const ApplyOrJoinButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"gold"}
      disabled={buttonInteractionDisabled}
      onClick={() => openCharacterSelect()}
    >
      {applyLabel}
    </Button>
  );
  const CancelApplicationButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"gold"}
      onClick={() => cancelApplication()}
    >
      {fireteamsLoc.CancelApplication}
    </Button>
  );
  const ActivateButton = () => (
    <Button
      className={styles.headerButton}
      buttonType={"gold"}
      onClick={() => handleActivateFireteam()}
      disabled={isActive || buttonInteractionDisabled}
    >
      {fireteamsLoc.Activate}
    </Button>
  );
  const DashboardButtons = () => (
    <>
      <BrowseButton />
      <CreateListingButton />
    </>
  );
  const BrowseButtons = () => (
    <>
      <FireteamHelpButton />
      <CreateFireteamButton />
    </>
  );
  const MemberButtons = () => (
    <>
      <ShareButton />
      <LeaveButton />
    </>
  );

  const ApplicationButtons = () => (
    <>
      <ShareButton />
      <CancelApplicationButton />
    </>
  );

  const SeekerButtons = () => (
    <>
      <ShareButton />
      <ApplyOrJoinButton />
    </>
  );
  const OwnerButtons = () => (
    <>
      <CloseButton />
      <ActivateButton />
    </>
  );

  const isMember = props.buttonConfig === "member";
  const isOwner = props.buttonConfig === "admin";
  const hasApplied =
    context?.matchingApplication &&
    context?.fireteamLobby?.lobbyId === lobbyId &&
    context?.fireteamLobby?.listingId ===
      context?.matchingApplication?.listingId;

  const buttonGroups = [
    {
      component: DashboardButtons,
      condition: props.buttonConfig === "dashboard",
    },
    { component: BrowseButtons, condition: props.buttonConfig === "browse" },
    { component: MemberButtons, condition: isMember },
    {
      component: ApplicationButtons,
      condition: lobbyId && !isMember && !isOwner && hasApplied,
    },
    {
      component: SeekerButtons,
      condition: lobbyId && !isMember && !isOwner && !hasApplied,
    },
    { component: OwnerButtons, condition: isOwner },
  ];

  return (
    <div className={props.className}>
      {buttonGroups.map(({ component: Component, condition }, index) =>
        condition ? <Component key={index} /> : null
      )}
    </div>
  );
};
