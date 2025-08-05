import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import SelectActivity, {
  SelectActivityType,
} from "@Areas/FireteamFinder/Components/Shared/SelectActivity";
import { Localizer } from "@bungie/localization/Localizer";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import React, { useState } from "react";
import styles from "./BrowseActivities.module.scss";
import {
  parseParams,
  useFireteamSearchParams,
} from "./Components/CoreBrowse/Helpers/Hooks";

export const BrowseActivities: React.FC = () => {
  const { params } = useFireteamSearchParams();
  const selectLink = (activityGraphIdHash: number): IMultiSiteLink => {
    const search = {
      ...params,
      activityGraphId: activityGraphIdHash.toString(),
    };
    // RouteHelper functions do not support arrays in the url query params so the link is made manually here.
    return {
      legacy: false,
      url:
        RouteHelper.FireteamFinder().url + "?" + parseParams(search).toString(),
    };
  };

  const [activityFilterBrowse, setActivityFilterBrowse] = useState("");

  return (
    <Layout
      activityFilterString={activityFilterBrowse}
      setActivityFilterString={setActivityFilterBrowse}
      className={styles.background}
      breadcrumbConfig={"browse-select"}
      buttonConfig={"none"}
      title={Localizer.Fireteams.BrowseTitle}
      subtitle={Localizer.Fireteams.FirstSelectTheActivity}
    >
      <SelectActivity
        linkClick={selectLink}
        activityType={SelectActivityType.BROWSE}
        activityFilterString={activityFilterBrowse}
        setActivityFilterString={setActivityFilterBrowse}
      />
    </Layout>
  );
};
