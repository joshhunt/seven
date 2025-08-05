import React, { FC, useMemo } from "react";
import { ValidFireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { ReactHookFormSelect } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormSelect";
import { UseFormReturn } from "react-hook-form";
import styles from "./FilterFireteamOptions.module.scss";
import { IOptionCategory } from "@Areas/FireteamFinder/Constants/FireteamOptions";

interface FilterFireteamOptionsProps {
  browseFilterDefinitionTree: Record<string, IOptionCategory>;
  selectedFilterHashes: Record<string, string>;
  selectorFilterTypes: ValidFireteamFinderValueTypes[];
  formMethods: UseFormReturn;
  handleUrlUpdate: (key: string, value: string) => void;
}

const FilterFireteamOptions: FC<FilterFireteamOptionsProps> = ({
  browseFilterDefinitionTree,
  selectedFilterHashes,
  selectorFilterTypes,
  formMethods,
  handleUrlUpdate,
}) => {
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
            <ReactHookFormSelect
              options={optionCategory.options}
              className={styles.filterMenu}
              name={key}
              selectedValue={selectedFilterHashes[key]}
              onChange={(value) => {
                handleUrlUpdate(key, value);
                formMethods.setValue(key, value);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FilterFireteamOptions;
