import { Localizer } from "@bungie/localization/Localizer";
import {
  FireteamFinderValueTypes,
  ValidFireteamFinderValueTypes,
} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { UrlUtils } from "@Utilities/UrlUtils";
import { IOptionCategory } from "@Areas/FireteamFinder/Constants/FireteamOptions"; // Adjust path as needed

export class FireteamFilterManager {
  private static readonly IGNORE_VALUE = "-1";

  private static readonly FILTER_ANY_LABELS: Record<string, string> = {
    [FireteamFinderValueTypes.mic]: Localizer.fireteams.AnyMicPreference,
    [FireteamFinderValueTypes.applicationRequirement]:
      Localizer.fireteams.AnyApplicationType,
    [FireteamFinderValueTypes.minGuardianRank]:
      Localizer.fireteams.AnyGuardianRank,
    [FireteamFinderValueTypes.joinSetting]: Localizer.fireteams.AnyJoinSetting,
  };

  /**
   * Gets the list of filters that need "Any" options
   */
  private static get filtersNeedingAnyOption(): string[] {
    return Object.keys(this.FILTER_ANY_LABELS);
  }

  /**
   * Determines if a filter key needs an "Any" ignore value option
   */
  private static needsIgnoreValue(key: string): boolean {
    return this.filtersNeedingAnyOption.includes(key);
  }

  /**
   * Gets the specific "Any" label for a filter type
   */
  private static getAnyLabelForFilter(filterKey: string): string {
    return this.FILTER_ANY_LABELS[filterKey] || Localizer.fireteams.Any;
  }

  /**
   * Creates initial filter values with defaults, "Any" options, and URL parameter overrides
   */
  static createInitialFilters(
    browseFilterDefinitionTree: Record<string, IOptionCategory>,
    selectorFilterTypes: ValidFireteamFinderValueTypes[]
  ): Record<string, string> {
    // Set default values
    const initialFilters = this.setDefaultFilterValues(
      browseFilterDefinitionTree,
      selectorFilterTypes
    );

    // Process options that need "Any" value
    this.addAnyOptionsToFilters(
      browseFilterDefinitionTree,
      selectorFilterTypes,
      initialFilters
    );

    // Apply URL parameters
    return this.applyUrlParameters(initialFilters);
  }

  /**
   * Sets default filter values from the definition tree
   */
  private static setDefaultFilterValues(
    browseFilterDefinitionTree: Record<string, IOptionCategory>,
    selectorFilterTypes: ValidFireteamFinderValueTypes[]
  ): Record<string, string> {
    const initialFilters: Record<string, string> = {};

    selectorFilterTypes.forEach((key: string) => {
      initialFilters[key] =
        browseFilterDefinitionTree[key]?.defaultBrowseValue || "";
    });

    return initialFilters;
  }

  /**
   * Adds specific "Any" option to filters that need ignore values
   * 1983949452
   */
  private static addAnyOptionsToFilters(
    browseFilterDefinitionTree: Record<string, IOptionCategory>,
    selectorFilterTypes: ValidFireteamFinderValueTypes[],
    initialFilters: Record<string, string>
  ): void {
    Object.keys(browseFilterDefinitionTree)
      .filter((hash) =>
        selectorFilterTypes.includes(hash as ValidFireteamFinderValueTypes)
      )
      .forEach((key) => {
        const optionCategory = browseFilterDefinitionTree[key];

        // Special handling for "All Languages" locale setting - we want to show ALL listings
        if (key === FireteamFinderValueTypes.locale) {
          const ALL_LANGUAGES_VALUE = "1983949452"; // Value of 'All Languages'
          const allLanguagesOption = optionCategory.options.find(
            (option) => option.value === ALL_LANGUAGES_VALUE
          );

          if (allLanguagesOption) {
            allLanguagesOption.value = "-1";
            initialFilters[key] = "-1";
            return;
          }
        }

        if (this.needsIgnoreValue(key)) {
          // Add specific "Any" option if it doesn't already exist
          if (
            !optionCategory.options.some(
              (option) => option.value === this.IGNORE_VALUE
            )
          ) {
            optionCategory.options.push({
              label: this.getAnyLabelForFilter(key),
              value: this.IGNORE_VALUE,
            });
          }
          initialFilters[key] = this.IGNORE_VALUE;
        }
      });
  }

  /**
   * Applies URL parameters to override default filter values
   */
  private static applyUrlParameters(
    initialFilters: Record<string, string>
  ): Record<string, string> {
    const paramsObject = UrlUtils.QueryToObject(window.location.search);

    Object.keys(paramsObject).forEach((key) => {
      if (key in initialFilters) {
        initialFilters[key] = paramsObject[key];
      }
    });

    return initialFilters;
  }

  /**
   * Checks if a filter value should be ignored in API requests
   */
  static shouldIgnoreFilterValue(value: string | number | any[]): boolean {
    return (
      value === this.IGNORE_VALUE ||
      value === -1 ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  /**
   * Parses string to integer and validates it's a number
   */
  static parseIntAndValidate(value: string): number | null {
    if (!value) return null;
    const parsed = parseInt(value);
    return !isNaN(parsed) ? parsed : null;
  }

  /**
   * Validates if a filter key is a valid selector filter type
   */
  static isValidSelectorFilter(
    key: string,
    selectorFilterTypes: ValidFireteamFinderValueTypes[]
  ): boolean {
    return selectorFilterTypes.includes(key as ValidFireteamFinderValueTypes);
  }

  /**
   * Gets the display label for a filter's "Any" option
   */
  static getFilterAnyLabel(filterKey: string): string {
    return this.getAnyLabelForFilter(filterKey);
  }

  /**
   * Gets all filters that have "Any" options
   */
  static getFiltersWithAnyOptions(): string[] {
    return this.filtersNeedingAnyOption;
  }

  /**
   * Builds URL parameters object from filter values, excluding ignored values
   */
  static buildUrlParams(
    filterValues: Record<string, string>
  ): Record<string, string> {
    const params: Record<string, string> = {};

    Object.entries(filterValues).forEach(([key, value]) => {
      if (!this.shouldIgnoreFilterValue(value)) {
        params[key] = value;
      }
    });

    return params;
  }

  /**
   * Updates URL with new filter parameters without page refresh
   */
  static updateUrlWithFilters(filterValues: Record<string, string>): void {
    const params = this.buildUrlParams(filterValues);
    const queryString = UrlUtils.ObjectToQuery(params);
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, null, newUrl);
  }

  /**
   * Resets filters to their default values
   */
  static resetFilters(
    browseFilterDefinitionTree: Record<string, IOptionCategory>,
    selectorFilterTypes: ValidFireteamFinderValueTypes[]
  ): Record<string, string> {
    const defaultFilters = this.setDefaultFilterValues(
      browseFilterDefinitionTree,
      selectorFilterTypes
    );

    // Set filters that need "Any" option to ignore value
    selectorFilterTypes.forEach((key) => {
      if (this.needsIgnoreValue(key)) {
        defaultFilters[key] = this.IGNORE_VALUE;
      }
    });

    return defaultFilters;
  }

  /**
   * Creates a mapping of filter keys to their "Any" labels
   */
  static getFilterAnyLabelsMap(): Record<string, string> {
    const labelsMap: Record<string, string> = {};

    this.filtersNeedingAnyOption.forEach((filterKey) => {
      labelsMap[filterKey] = this.getAnyLabelForFilter(filterKey);
    });

    return labelsMap;
  }
}
