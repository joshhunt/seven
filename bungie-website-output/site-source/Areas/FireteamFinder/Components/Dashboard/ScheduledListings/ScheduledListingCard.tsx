import React, { useEffect, useState } from "react";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { FireteamFinder, Platform } from "@Platform";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import FireteamListingCard from "@Areas/FireteamFinder/Components/Shared/FireteamListingCard";

interface ActiveLobbyProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  listingId: string;
}

/*
 * Displays Scheduled Fireteam Listing Card
 * */

const ScheduledListingCard: React.FC<ActiveLobbyProps> = (props) => {
  const { listingId } = props;
  const [listingData, setListingData] = useState<
    FireteamFinder.DestinyFireteamFinderListing
  >();

  /* Get and set Fireteam listing, update when current lobby changes */
  useEffect(() => {
    if (listingId) {
      Platform.FireteamfinderService.GetListing(listingId)
        .then((res) => {
          setListingData(res);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  }, [listingId]);

  return listingData?.listingId ? (
    <FireteamListingCard fireteam={listingData} linkToDetails={true} />
  ) : null;
};

export default withDestinyDefinitions(ScheduledListingCard, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
