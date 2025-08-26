import React, { FC, useMemo } from "react";
import { ValidFireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import styles from "./FilterFireteamOptions.module.scss";
import { IOptionCategory } from "@Areas/FireteamFinder/Constants/FireteamOptions";
import { FireteamFilterManager } from "../../../Helpers/FireteamFilterManager";
import { Dropdown } from "@UI/UIKit/Forms/Dropdown";

interface FilterFireteamOptionsProps {
  browseFilterDefinitionTree: Record<string, IOptionCategory>;
  selectedFilterHashes: Record<string, string>;
  selectorFilterTypes: ValidFireteamFinderValueTypes[];
  handleUrlUpdate: (key: string, value: string) => void;
}

const FilterFireteamOptions: FC<FilterFireteamOptionsProps> = ({
  browseFilterDefinitionTree,
  selectedFilterHashes,
  selectorFilterTypes,
  handleUrlUpdate,
}) => {
  const initialFilters = useMemo(() => {
    return FireteamFilterManager.createInitialFilters(
      browseFilterDefinitionTree,
      selectorFilterTypes
    );
  }, [browseFilterDefinitionTree, selectorFilterTypes]);
  const optionKeys = useMemo(() => {
    return Object.keys(browseFilterDefinitionTree).filter((hash) =>
      selectorFilterTypes.includes(hash as ValidFireteamFinderValueTypes)
    );
  }, [selectorFilterTypes, browseFilterDefinitionTree]);

  return (
    <div className={styles.selects}>
      {optionKeys.map((key) => {
        const optionCategory = browseFilterDefinitionTree[key];

        return (
          <div key={key} className={styles.labelAndSelector}>
            <Dropdown
              options={optionCategory.options}
              className={styles.filterMenu}
              name={key}
              selectedValue={selectedFilterHashes[key] ?? initialFilters[key]}
              onChange={(value) => {
                handleUrlUpdate(key, value);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FilterFireteamOptions;
