import ScheduledListingCard from "@Areas/FireteamFinder/Components/Dashboard/ScheduledListings/ScheduledListingCard";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import styles from "./ScheduledListings.module.scss";

interface ScheduledListingProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderConstantsDefinition"
    | "DestinyFireteamFinderActivitySetDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  className?: string;
  playerLobbies: FireteamFinder.DestinyFireteamFinderLobbyResponse[];
}

const ScheduledListings: React.FC<ScheduledListingProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;

  const NoScheduledListings = (
    <>
      {Localizer.FormatReact(fireteamsLoc.dashboardEmptyPlayerLobbies, {
        search: (
          <Anchor url={RouteHelper.FireteamFinderBrowse()} sameTab={true}>
            {Localizer.Fireteams.BrowseLinkLabel}
          </Anchor>
        ),
        create: (
          <Anchor url={RouteHelper.FireteamFinderCreate()} sameTab={false}>
            {Localizer.Fireteams.CreateLinkLabel}
          </Anchor>
        ),
      })}
    </>
  );

  return (
    <div className={styles.wrapper}>
      <h3>{fireteamsLoc.myScheduledListings}</h3>
      {props?.playerLobbies?.length > 0 ? (
        <div>
          {props?.playerLobbies?.map((listing, index) => (
            <ScheduledListingCard key={index} listingId={listing.listingId} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyPlayerLobbies}>{NoScheduledListings}</div>
      )}
    </div>
  );
};

export default withDestinyDefinitions(ScheduledListings, {
  types: [
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivitySetDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyFireteamFinderOptionDefinition",
  ],
});
