// Created by atseng, 2023
// Copyright Bungie, Inc.

import stylesHistory from "@Areas/Clan/Shared/ClanHistory.module.scss";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { Localizer } from "@bungie/localization/Localizer";
import { Platform, Queries } from "@Platform";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface EditHistoryProps {}

export const EditHistory: React.FC<EditHistoryProps> = (props) => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const clanId = params?.clanId ?? "0";
  const [editHistory, setEditHistory] = useState<
    Queries.SearchResultGroupEditHistory
  >();
  const currentPage = editHistory?.query?.currentPage;

  const getEditHistory = (page = 1) => {
    Platform.GroupV2Service.GetGroupEditHistory(clanId, page).then((result) => {
      setEditHistory(result);
    });
  };

  const gotoPage = (newPage: number) => {
    getEditHistory(newPage);
  };

  useEffect(() => {
    getEditHistory();
  }, []);

  return (
    <SettingsWrapper>
      <h6 className={stylesHistory.sectionHeader}>{clansLoc.EditHistory}</h6>
      {editHistory?.results?.length === 0 && (
        <p>{clansLoc.ThereWereNoResults}</p>
      )}
      <ul className={stylesHistory.historyList}>
        {editHistory?.results?.map((a, index) => {
          const user = a.groupEditors?.[0];

          const bungieGlobalName = UserUtils.getBungieNameFromUserInfoCard(
            user
          );

          const displayNameString =
            user &&
            `${user.displayName} (${
              bungieGlobalName.bungieGlobalCode
                ? bungieGlobalName.bungieGlobalName +
                  bungieGlobalName.bungieGlobalCodeWithHashtag
                : user.supplementalDisplayName
            })`;

          return (
            <li key={index}>
              <TwoLineItem
                itemTitle={!user ? clansLoc.ModeratorBungie : displayNameString}
                itemSubtitle={!user ? "" : user.membershipId}
                icon={
                  <IconCoin
                    iconImageUrl={
                      !user
                        ? "/img/profile/avatars/disembodied_soul.gif"
                        : user.iconPath
                    }
                  />
                }
                flair={
                  <span className={stylesHistory.date}>
                    {DateTime.fromISO(a.editDate).toFormat("yyyy LLL dd f")}
                  </span>
                }
              />
              <div className={stylesHistory.extraContent}>
                {!StringUtils.isNullOrWhiteSpace(a.name) && (
                  <div>
                    <p>
                      <strong>{clansLoc.NameChanged}</strong>
                    </p>
                    <p>
                      <em>{a.name}</em>
                    </p>
                  </div>
                )}
                {!StringUtils.isNullOrWhiteSpace(a.motto) && (
                  <div>
                    <p>
                      <strong>{clansLoc.MottoChanged}</strong>
                    </p>
                    <p>
                      <em>{a.motto}</em>
                    </p>
                  </div>
                )}
                {!StringUtils.isNullOrWhiteSpace(a.clanCallsign) && (
                  <div>
                    <p>
                      <strong>{clansLoc.CallsignChanged}</strong>
                    </p>
                    <p>
                      <em>{a.clanCallsign}</em>
                    </p>
                  </div>
                )}
                {!StringUtils.isNullOrWhiteSpace(a.about) && (
                  <div>
                    <p>
                      <strong>{clansLoc.AboutChanged}</strong>
                    </p>
                    <p>
                      <em>{a.about}</em>
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className={stylesHistory.simplePager}>
        {currentPage > 1 && (
          <Button
            buttonType={"clear"}
            onClick={() => gotoPage(currentPage - 1)}
          >
            {Localizer.Actions.Prev}
          </Button>
        )}
        {editHistory?.hasMore && (
          <Button
            buttonType={"clear"}
            onClick={() => gotoPage(currentPage + 1)}
          >
            {Localizer.Actions.Next}
          </Button>
        )}
      </div>
    </SettingsWrapper>
  );
};
