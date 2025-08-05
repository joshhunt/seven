import React, { Fragment, useMemo } from "react";
import { CustomLobbyState } from "../../../Helpers/LobbyStateManager";
import { IOptionCategory } from "@Areas/FireteamFinder/Constants/FireteamOptions";
import { DestinyDefinitions } from "@Definitions";
import styles from "./AppliedFilters.module.scss";

export interface AppliedFiltersProps {
  selectedActivity?: string;
  lobbyState: CustomLobbyState;
  filterDefinitions: Record<string, IOptionCategory>;
  selectedFilterHashes: Record<string, string>;
  tagDefinitions: Record<
    string,
    DestinyDefinitions.DestinyFireteamFinderLabelDefinition
  >;
  selectedTagHashes: string[];
  onClear: () => void;
}

export function AppliedFilters({
  selectedActivity,
  lobbyState,
  filterDefinitions,
  selectedFilterHashes,
  tagDefinitions,
  selectedTagHashes,
  onClear,
}: AppliedFiltersProps) {
  const selectedTagsNames = useMemo(() => {
    return selectedTagHashes
      .map((st) => tagDefinitions[st]?.displayProperties?.name)
      .filter((v) => !!v);
  }, [selectedTagHashes, tagDefinitions]);
  const selectedFilterNames = useMemo(() => {
    return Object.keys(selectedFilterHashes)
      .map((key) =>
        filterDefinitions[key]?.options.find(
          (o) => o.value === selectedFilterHashes[key]
        )
      )
      .filter((v) => !!v);
  }, [selectedFilterHashes, filterDefinitions]);

  const shouldShow =
    // Clan and Mine tabs do not have filters applied so this component should not show for those tabs
    (lobbyState === CustomLobbyState.Active ||
      lobbyState === CustomLobbyState.Inactive) &&
    (selectedActivity ||
      selectedTagsNames.length > 0 ||
      selectedFilterNames.length > 0);
  if (!shouldShow) {
    return <></>;
  }

  return (
    <div className={styles.list}>
      <strong>
        Viewing:&nbsp;
        {selectedActivity}
        {selectedFilterNames.map((sf, i) => (
          <Fragment key={`${sf.label}-${sf.value}`}>
            {(selectedActivity || i !== 0) && ", "}
            {sf.label}
          </Fragment>
        ))}
        {selectedTagsNames.map((st, i) => (
          <Fragment key={st}>
            {(selectedActivity || selectedFilterNames.length > 0 || i !== 0) &&
              ", "}
            {st}
          </Fragment>
        ))}
      </strong>
      &nbsp;-&nbsp;
      <button onClick={onClear} className={styles.clearButton}>
        Clear All
      </button>
    </div>
  );
}
