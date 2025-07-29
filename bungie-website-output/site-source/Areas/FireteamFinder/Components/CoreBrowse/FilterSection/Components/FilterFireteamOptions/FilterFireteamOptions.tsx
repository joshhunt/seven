import React, { FC } from "react";
import {
  FireteamFinderValueTypes,
  FireteamFinderValueTypesKeys,
  ValidFireteamFinderValueTypes,
} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { Localizer } from "@bungie/localization/Localizer";
import { ReactHookFormSelect } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormSelect";
import { UseFormReturn } from "react-hook-form";
import styles from "./FilterFireteamOptions.module.scss";
import { IOptionCategory } from "@Areas/FireteamFinder/Constants/FireteamOptions";

interface FilterFireteamOptionsProps {
  browseFilterDefinitionTree: Record<string, IOptionCategory>;
  selectorFilterTypes: ValidFireteamFinderValueTypes[];
  formMethods: UseFormReturn;
  handleUrlUpdate: (key: string, value: string) => void;
}

const FilterFireteamOptions: FC<FilterFireteamOptionsProps> = ({
  browseFilterDefinitionTree,
  selectorFilterTypes,
  formMethods,
  handleUrlUpdate,
}) => {
  return (
    <div className={styles.selects}>
      {Object.keys(browseFilterDefinitionTree)
        .filter((hash) =>
          selectorFilterTypes.includes(hash as ValidFireteamFinderValueTypes)
        )
        .map((key) => {
          const optionCategory = browseFilterDefinitionTree[key];

          return (
            <div key={key} className={styles.labelAndSelector}>
              <ReactHookFormSelect
                options={optionCategory.options}
                className={styles.filterMenu}
                name={key}
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
