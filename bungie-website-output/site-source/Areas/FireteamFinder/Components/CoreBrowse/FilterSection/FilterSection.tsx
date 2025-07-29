import React, { FC } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import {
  AccordionSummary,
  Accordion,
  AccordionDetails,
  ThemeProvider,
} from "@mui/material";
import { Button } from "@UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@bungie/localization/Localizer";
import {
  FilterFireteamOptions,
  FilterFireteamTags,
  CharacterSelect,
} from "./Components";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";
import { themes } from "plxp-web-ui/themes/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import styles from "./FilterSection.module.scss";

interface FilterSectionProps {
  formMethods: UseFormReturn;
  handleSubmit: (data: FieldValues) => void;
  tagsProps: {
    definitions: Pick<
      AllDefinitionsFetcherized,
      | "DestinyFireteamFinderLabelDefinition"
      | "DestinyFireteamFinderLabelGroupDefinition"
    >;
    savedTags: string[];
    tagHashesUpdated: (tagHashes: string[]) => void;
  };
  optionsProps: {
    browseFilterDefinitionTree: any;
    selectorFilterTypes: any;
    formMethods: UseFormReturn;
    handleUrlUpdate: (key: string, value: string) => void;
  };
}

const FilterSection: FC<FilterSectionProps> = ({
  formMethods,
  handleSubmit,
  optionsProps,
  tagsProps,
}) => {
  const fireteamsLoc = Localizer.Fireteams;
  const isMobile = useDataStore(Responsive)?.mobile;
  const activeThemeName = "destiny-core";
  const theme = themes[activeThemeName];

  const Filters: FC = () => (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <div className={styles.buttonContainer}>
          <Button buttonType={"white"} url={RouteHelper.FireteamFinderBrowse()}>
            {Localizer.fireteams.AllActivities}
          </Button>
        </div>
        <CharacterSelect />
        <div className={styles.title}>{fireteamsLoc.filters}</div>
        <FilterFireteamOptions {...optionsProps} />
        <FilterFireteamTags {...tagsProps} />
      </form>
    </FormProvider>
  );

  return isMobile ? (
    <ThemeProvider theme={theme}>
      <Accordion
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper3,
          boxShadow: "0px 4px 4px 0px #00000040",
          marginBottom: "1rem",
        })}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={(theme) => ({
                color: theme.palette.common.white,
              })}
            />
          }
        >
          Filters
        </AccordionSummary>
        <AccordionDetails>
          <Filters />
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  ) : (
    <Filters />
  );
};

export default FilterSection;
