import React, { useState } from "react";
import styles from "./SeasonSelect.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Select } from "plxp-web-ui/components/base";
import { SelectChangeEvent } from "@mui/material";
import { UrlUtils } from "@Utilities/UrlUtils";
import { useHistory } from "react-router-dom";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import { ReactComponent as CurrentSeasonIcon } from "@Areas/Seasons/assets/season27/seasonicon_27.svg";

// Required props
interface ISeasonSelectProps
  extends D2DatabaseComponentProps<
    | "DestinyInventoryItemLiteDefinition"
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
  > {
  isCurrentSeason: boolean;
}

/**
 * SeasonSelect - Dropdown to move between current and previous season views
 *  *
 * @param {ISeasonSelectProps} props
 * @returns {React.ReactElement}
 */
const SeasonSelect: React.FC<ISeasonSelectProps> = (props) => {
  const { isCurrentSeason } = props;

  const [selectedTabOption, setSelectedTabOption] = useState<string>(
    isCurrentSeason ? "current" : "previous"
  );

  const history = useHistory();

  const handleTabChange = (e: SelectChangeEvent<{ value: string }>) => {
    const value = e?.target?.value as string;
    setSelectedTabOption(value);

    if (value === "previous") {
      history.push(
        UrlUtils.resolveUrlFromMultiLink(RouteHelper.PreviousSeason())
      );
    } else {
      history.push(
        UrlUtils.resolveUrlFromMultiLink(RouteHelper.SeasonProgress())
      );
    }
  };

  const renderSeasonTabs = () => {
    const seasonTabOptions = [
      {
        value: "previous",
        label:
          SeasonsDefinitions?.previousSeason?.label ||
          SeasonsDefinitions?.previousSeason.title,
        icon: <CurrentSeasonIcon width={"2rem"} height={"2rem"} />,
      },
      {
        value: "current",
        label:
          SeasonsDefinitions?.currentSeason?.label ||
          SeasonsDefinitions?.currentSeason.title,
        icon: <CurrentSeasonIcon width={"2rem"} height={"2rem"} />,
      },
    ];

    const selectedIcon = seasonTabOptions?.find(
      (opt) => opt.value === selectedTabOption
    )?.icon;

    return (
      <div className={styles.seasonTabsContainer}>
        <Select
          menuOptions={seasonTabOptions}
          selectProps={{
            value: selectedTabOption,
            onChange: handleTabChange,
            displayEmpty: true,
          }}
          labelArea={{
            labelString: "Season",
            screenReaderOnly: true,
          }}
          prependIcon={selectedIcon}
        />
      </div>
    );
  };

  return renderSeasonTabs();
};

export default withDestinyDefinitions(SeasonSelect, {
  types: [
    "DestinyInventoryItemLiteDefinition",
    "DestinySeasonDefinition",
    "DestinySeasonPassDefinition",
    "DestinyProgressionDefinition",
  ],
});
