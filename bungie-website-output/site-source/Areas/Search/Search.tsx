import {
  SearchDataStore,
  SearchTabContentProps,
  SearchType,
} from "@Areas/Search/DataStores/SearchDataStore";
import { SearchTab } from "@Areas/Search/Shared/SearchTab";
import { SearchTabContent } from "@Areas/Search/Shared/SearchTabContent";
import styles from "@Areas/Search/search.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { ISearchParams } from "@Routes/Definitions/RouteParams";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import { Form, Formik } from "formik";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useHistory, useParams } from "react-router";

interface SearchProps {}

interface SearchFormValues {
  searchTerm: string;
}

const Search: React.FC<SearchProps> = () => {
  const history = useHistory();
  const params = useParams<ISearchParams>();
  const queryString = UrlUtils.QueryToObject(window.location.search);
  const urlQuery = params?.query ?? queryString?.["query"] ?? "";
  const lastSearchedTerm = useRef<string>("");

  const searchLoc = Localizer.Search;

  const [activeTab, setActiveTab] = useState<SearchType>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [orderedTabs, setOrderedTabs] = useState([]);
  const searchDataStorePayload = useDataStore(SearchDataStore);

  useEffect(() => {
    const order = ["users", "items", "news", "destinyusers", "clans"];

    // First, get tabs with results
    const tabsWithResults = order
      .map((searchType) =>
        searchDataStorePayload?.searchTabContentProps?.find(
          (tab) => tab.searchType === searchType
        )
      )
      .filter((tab) => tab?.searchItems?.length > 0);

    // Then get tabs without results
    const tabsWithoutResults = order
      .map((searchType) =>
        searchDataStorePayload?.searchTabContentProps?.find(
          (tab) => tab.searchType === searchType
        )
      )
      .filter((tab) => tab && !tab.searchItems?.length);

    // Combine them
    setOrderedTabs([...tabsWithResults, ...tabsWithoutResults]);

    // Set active tab if needed and we have tabs with results
    if (activeTab === "none" && tabsWithResults.length > 0) {
      setActiveTab(tabsWithResults[0].searchType);
    }
  }, [searchDataStorePayload?.searchTabContentProps]);
  const performSearch = async (searchTerm: string) => {
    const trimmedSearchTerm = searchTerm?.trim() || "";

    // If empty search, reset everything and return
    if (!trimmedSearchTerm) {
      resetPage();
      history.push(RouteHelper.Search().url);
      return;
    }

    // Rest of validation
    if (trimmedSearchTerm.length < 3) {
      return;
    }

    // Don't search if the term hasn't changed
    if (trimmedSearchTerm === lastSearchedTerm.current) {
      return;
    }

    setIsLoading(true);
    resetPage();

    try {
      // Update the last searched term
      lastSearchedTerm.current = trimmedSearchTerm;

      await SearchDataStore.actions.setSearchTerm(trimmedSearchTerm);

      await Promise.all([
        SearchDataStore.actions.doPagedItemSearch(trimmedSearchTerm),
        SearchDataStore.actions.doPagedUserSearch(trimmedSearchTerm),
        SearchDataStore.actions.doPagedNewsSearch(trimmedSearchTerm),
        SearchDataStore.actions.doPagedClanSearch(trimmedSearchTerm),
        SearchDataStore.actions.doPagedDestinyUserSearch(trimmedSearchTerm),
      ]);

      // Get final ordered state and find first tab with results
      const finalState = SearchDataStore.state;
      const firstTabWithResults = finalState.searchTabContentProps.find(
        (tab) => tab?.searchItems?.length > 0
      );

      if (firstTabWithResults) {
        setActiveTab(firstTabWithResults.searchType);
      }

      history.push(RouteHelper.Search({ query: trimmedSearchTerm }).url);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPage = () => {
    setActiveTab("none");
    SearchDataStore.actions.reset();
    lastSearchedTerm.current = "";
  };

  const initialValues: SearchFormValues = {
    searchTerm: urlQuery,
  };

  return (
    <>
      <BungieHelmet
        title={Localizer.pagetitles.Search}
        image={Img("/ca/destiny/bgs/new_light/newlight_pvp_1_16x9.jpg")}
      />
      <Grid>
        <GridCol cols={12} className={styles.searchContainer}>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await performSearch(values.searchTerm);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit}>
                <div
                  className={classNames(styles.inputBoxItemSearch, {
                    [styles.focused]: isFocused,
                  })}
                >
                  <FormikTextInput
                    name="searchTerm"
                    type="text"
                    placeholder={searchLoc.SearchLabel}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        formikProps.handleSubmit();
                      }
                    }}
                    aria-label={searchLoc.SearchLabel}
                  />
                  <button
                    type="submit"
                    onClick={() => {
                      formikProps.resetForm({
                        values: { searchTerm: "" },
                      });
                      history.push(RouteHelper.Search().url);
                      resetPage();
                    }}
                    className={styles.closeXButton}
                    aria-label={searchLoc.ClearSearch ?? "Clear search"}
                  >
                    <AiOutlineClose className={styles.closeX} />
                  </button>
                </div>
                <div className={styles.searchControls}>
                  <Button
                    submit={true}
                    buttonType={"gold"}
                    className={styles.searchButton}
                    disabled={
                      formikProps.isSubmitting || !formikProps.values.searchTerm
                    }
                    aria-label={searchLoc.SearchLabel ?? "Search"}
                  >
                    {formikProps.isSubmitting
                      ? "Searching..."
                      : searchLoc.SearchLabel ?? "Search"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className={styles.tabContainer}>
            {orderedTabs.map((item, index) => (
              <SearchTab
                key={`${item.searchType}-${index}`}
                label={item.tabLabel}
                resultNumber={item.searchItems?.length}
                hasMore={item.hasMore}
                isActive={activeTab === item.searchType}
                setActive={() => setActiveTab(item.searchType)}
              />
            ))}
          </div>

          <div className={styles.results}>
            <SpinnerContainer loading={isLoading}>
              {(() => {
                const activeItem = searchDataStorePayload?.searchTabContentProps?.find(
                  (item) => item.searchType === activeTab
                );
                if (!activeItem) return null;

                return (
                  <div key={`${activeItem.searchType}-content`}>
                    {activeItem.searchItems?.length > 0 ? (
                      <SearchTabContent
                        tabLabel={activeItem.tabLabel}
                        searchItems={activeItem.searchItems}
                        searchType={activeItem.searchType}
                        page={activeItem.page}
                        hasMore={activeItem.hasMore}
                        nextPageFunction={() => activeItem.nextPageFunction()}
                      />
                    ) : (
                      <div className={styles.empty} role="alert">
                        {searchLoc.NoResults}
                      </div>
                    )}
                  </div>
                );
              })()}
            </SpinnerContainer>
          </div>
        </GridCol>
      </Grid>
    </>
  );
};

export default Search;
