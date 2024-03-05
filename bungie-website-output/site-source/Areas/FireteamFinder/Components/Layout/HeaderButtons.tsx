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
import { DestinyFireteamFinderLobbyState } from "@Enum";
import { Platform } from "@Platform";
import { FaPlus } from "@react-icons/all-files/fa/FaPlus";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { useContext } from "react";
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

interface HeaderButtonsProps {
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
    if (context?.fireteamListing?.lobbyId) {
      Platform.FireteamfinderService.ApplyToListing(
        context?.fireteamListing?.listingId,
        0,
        fireteamDestinyData?.selectedMembership?.membershipType,
        fireteamDestinyData?.selectedMembership?.membershipId,
        fireteamDestinyData?.selectedCharacter?.characterId ?? "0"
      )
        .then(() => {
          //reload the page
          window.location.reload();
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  };

  const cancelApplication = () => {
    if (context?.fireteamListing?.lobbyId) {
      Platform.FireteamfinderService.LeaveApplication(
        context?.applicationId,
        fireteamDestinyData?.selectedMembership?.membershipType,
        fireteamDestinyData?.selectedMembership?.membershipId,
        fireteamDestinyData?.selectedCharacter?.characterId ?? "0"
      )
        .then(() => {
          contextDispatch.updateApplicationId(null);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  };

  const closeFireteam = () => {
    Platform.FireteamfinderService.LeaveLobby(
      context?.fireteamLobby?.lobbyId,
      fireteamDestinyData?.selectedMembership?.membershipType,
      fireteamDestinyData?.selectedMembership?.membershipId,
      fireteamDestinyData?.selectedCharacter?.characterId ?? "0"
    )
      .then(() => {
        window.location.reload();
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
        onClick: closeFireteam,
      },
    });
  };

  const activateFireteam = () => {
    if (context?.fireteamLobby) {
      Platform.FireteamfinderService.ActivateLobby(
        context?.fireteamLobby?.lobbyId,
        fireteamDestinyData?.selectedMembership?.membershipType,
        fireteamDestinyData?.selectedMembership?.membershipId,
        fireteamDestinyData?.selectedCharacter?.characterId ?? "0",
        false
      )
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  };

  const modalRef = React.useRef(null);
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

  const isApplicationRequired =
    context?.fireteamListing?.settings?.listingValues?.find(
      (listingVal) =>
        listingVal?.valueType?.toString() ===
        FireteamFinderValueTypes.applicationRequirement
    )?.values?.[0] === 1;
  const applyLabel = isApplicationRequired
    ? fireteamsLoc.ApplyToJoin
    : fireteamsLoc.Join;

  const dashboardButtons = () => {
    return (
      <>
        <Button
          size={BasicSize.Small}
          icon={<FaSearch />}
          buttonType={"gold"}
          url={RouteHelper.FireteamFinderBrowse()}
        >
          {fireteamsLoc.FindFireteam}
        </Button>
        <Button
          size={BasicSize.Small}
          icon={<FaPlus />}
          buttonType={"white"}
          url={RouteHelper.FireteamFinderCreate()}
        >
          {fireteamsLoc.createListing}
        </Button>
      </>
    );
  };

  const browseButtons = () => {
    return (
      <>
        <FireteamHelpButton size={BasicSize.Small} />
        <Button
          size={BasicSize.Small}
          icon={<FaPlus />}
          buttonType={"gold"}
          url={RouteHelper.FireteamFinderCreate()}
        >
          {fireteamsLoc.createFireteam}
        </Button>
      </>
    );
  };

  const memberButtons = () => {
    return (
      <>
        <Button
          size={BasicSize.Small}
          buttonType={"white"}
          onClick={() => copyToClipboard()}
        >
          {fireteamsLoc.Share}
        </Button>
        <Button
          size={BasicSize.Small}
          buttonType={"red"}
          onClick={() => closeFireteam()}
        >
          {fireteamsLoc.Leave}
        </Button>
      </>
    );
  };

  const detailButtons = () => {
    return context?.fireteamLobby && context?.fireteamListing ? (
      <>
        <Button
          size={BasicSize.Small}
          buttonType={"white"}
          onClick={() => copyToClipboard()}
        >
          {fireteamsLoc.Share}
        </Button>
        <Button
          size={BasicSize.Small}
          buttonType={"gold"}
          onClick={() => openCharacterSelect()}
        >
          {applyLabel}
        </Button>
      </>
    ) : null;
  };

  const detailAppliedButtons = () => {
    return context?.fireteamLobby && context?.fireteamListing ? (
      <>
        <Button
          size={BasicSize.Small}
          buttonType={"white"}
          onClick={() => copyToClipboard()}
        >
          {fireteamsLoc.Share}
        </Button>
        {context?.applicationId && (
          <Button
            size={BasicSize.Small}
            buttonType={"gold"}
            onClick={() => cancelApplication()}
          >
            {fireteamsLoc.CancelApplication}
          </Button>
        )}
      </>
    ) : null;
  };

  const adminButtons = () => {
    return (
      <>
        <Button
          size={BasicSize.Small}
          buttonType={"red"}
          onClick={() => openCloseModal()}
        >
          {fireteamsLoc.CloseFireteam}
        </Button>
        <Button
          size={BasicSize.Small}
          buttonType={"white"}
          onClick={() => copyToClipboard()}
        >
          {fireteamsLoc.Share}
        </Button>
        <Button
          size={BasicSize.Small}
          buttonType={"gold"}
          onClick={() => activateFireteam()}
          disabled={isActive}
        >
          {fireteamsLoc.Activate}
        </Button>
      </>
    );
  };

  const buttons = () => {
    switch (props.buttonConfig) {
      case "admin":
        return adminButtons();
      case "browse":
        return browseButtons();
      case "member":
        return memberButtons();
      case "detail-applied":
        return detailAppliedButtons();
      case "detail":
        return detailButtons();
      case "dashboard":
        return dashboardButtons();
      default:
        return null;
    }
  };

  return <div className={styles.buttons}>{buttons()}</div>;
};
