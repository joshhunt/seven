// Created by atseng, 2022
// Copyright Bungie, Inc.

import {
  SearchDataStore,
  SearchType,
} from "@Areas/Search/DataStores/SearchDataStore";
import { SearchTab } from "@Areas/Search/Shared/SearchTab";
import { SearchTabContent } from "@Areas/Search/Shared/SearchTabContent";
import styles from "@Areas/Search/search.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { ISearchParams } from "@Routes/RouteParams";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useHistory, useParams } from "react-router";

interface SearchProps {}

export interface SearchViewProps {}

const Search: React.FC<SearchProps> = (props) => {
  const history = useHistory();
  //url params way /Search/searchTerm
  const params = useParams<ISearchParams>();
  //querystring way /Search?query=searchTerm
  const queryString = UrlUtils.QueryToObject(window.location.search);
  const urlQuery = params?.query ?? queryString?.["query"] ?? "";

  const searchLoc = Localizer.Search;

  const [inputString, setInputString] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<SearchType>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchDataStorePayload = useDataStore(SearchDataStore);

  const search = () => {
    setIsLoading(true);

    resetPage();

    searchSeparately();

    history.push(RouteHelper.Search({ query: inputString }).url);
  };

  const searchSeparately = () => {
    SearchDataStore.actions.doPagedItemSearch(inputString);
    SearchDataStore.actions.doPagedUserSearch(inputString);
    SearchDataStore.actions.doPagedNewsSearch(inputString);
    SearchDataStore.actions.doPagedClanSearch(inputString);
    SearchDataStore.actions.doPagedDestinyUserSearch(inputString);
  };

  const resetPage = () => {
    setActiveTab("none");
    SearchDataStore.actions.reset();
  };

  useEffect(() => {
    if (activeTab === "none") {
      const visibleTabsArray = searchDataStorePayload.visibleTabs
        ? [...searchDataStorePayload?.visibleTabs]
        : [];

      const noSearchResultsFound =
        visibleTabsArray[0] ||
        (searchDataStorePayload.searchTerm && !visibleTabsArray.length);

      if (noSearchResultsFound) {
        setIsLoading(false);
      }

      //set the first tab available as the active tab
      setActiveTab(visibleTabsArray?.[0] ?? "none");
    }
  }, [searchDataStorePayload]);

  useEffect(() => {
    let searchTimer: number;

    if (inputString.length > 1) {
      //only submit 500ms after the last key press and only if longer than 1 character
      searchTimer = setTimeout(() => {
        search();
      }, 500);
    }

    return () => {
      clearTimeout(searchTimer);
    };
  }, [inputString]);

  return (
    <>
      <BungieHelmet
        title={Localizer.pagetitles.Search}
        image={Img("/ca/destiny/bgs/new_light/newlight_pvp_1_16x9.jpg")}
      />
      <Grid>
        <GridCol cols={12} className={styles.searchContainer}>
          <Formik
            initialValues={{
              searchTerm: urlQuery,
            }}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              //do nothing here
            }}
          >
            {(formikProps) => {
              if (
                formikProps?.values?.searchTerm &&
                formikProps.values.searchTerm !== inputString
              ) {
                //this will trigger the submit because the inputString will change
                setInputString(formikProps.values.searchTerm);
              }

              return (
                <Form>
                  <div
                    className={classNames(styles.inputBoxItemSearch, {
                      [styles.focused]: isFocused,
                    })}
                  >
                    <FormikTextInput
                      name={"searchTerm"}
                      type={"text"}
                      placeholder={searchLoc.SearchLabel}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    <AiOutlineClose
                      className={styles.closeX}
                      onClick={(e) => {
                        //clear x button
                        formikProps.resetForm({
                          values: {
                            searchTerm: "",
                          },
                        });

                        history.push(RouteHelper.Search().url);
                        resetPage();
                      }}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
          <div className={styles.tabContainer}>
            {searchDataStorePayload?.searchTabContentProps.map(
              (item, index) => {
                if (searchDataStorePayload.visibleTabs.has(item.searchType)) {
                  return (
                    <SearchTab
                      label={item.tabLabel}
                      resultNumber={item.searchItems?.length}
                      hasMore={item.hasMore}
                      isActive={activeTab === item.searchType}
                      setActive={() => setActiveTab(item.searchType)}
                    />
                  );
                }
              }
            )}
          </div>
          <div className={styles.results}>
            <SpinnerContainer loading={isLoading}>
              {searchDataStorePayload?.searchTabContentProps?.map(
                (item, index) => {
                  if (
                    searchDataStorePayload.visibleTabs.has(item.searchType) &&
                    item.searchType === activeTab
                  ) {
                    return (
                      <SearchTabContent
                        tabLabel={item.tabLabel}
                        key={index}
                        searchItems={item.searchItems}
                        searchType={item.searchType}
                        page={item.page}
                        hasMore={item.hasMore}
                        nextPageFunction={() => item.nextPageFunction()}
                      />
                    );
                  }
                }
              )}

              {searchDataStorePayload?.searchTerm?.length > 1 &&
                searchDataStorePayload?.visibleTabs?.has("none") && (
                  <div className={styles.empty}>
                    {searchLoc.SearchNoResults}
                  </div>
                )}
            </SpinnerContainer>
          </div>
        </GridCol>
      </Grid>
    </>
  );
};

export default Search;
