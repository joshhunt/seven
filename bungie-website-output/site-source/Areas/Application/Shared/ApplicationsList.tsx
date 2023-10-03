// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { Applications, Queries } from "@Platform";
import { FaRocket } from "@react-icons/all-files/fa/FaRocket";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import styles from "./ApplicationsList.module.scss";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import React from "react";

interface ApplicationsListProps {
  applicationsSearchResult: Queries.SearchResultApplication;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = (props) => {
  const appItem = (app: Applications.Application) => {
    return (
      <li>
        <Anchor
          url={RouteHelper.ApplicationDetailReact({
            appId: app.applicationId.toString(),
          })}
        >
          <TwoLineItem
            icon={<FaRocket />}
            itemTitle={app.name}
            itemSubtitle={ApplicationUtils.statusFormat(app)}
          />
        </Anchor>
      </li>
    );
  };

  return (
    <ul className={styles.applicationsList}>
      {props.applicationsSearchResult?.results?.map((a) => appItem(a))}
    </ul>
  );
};
