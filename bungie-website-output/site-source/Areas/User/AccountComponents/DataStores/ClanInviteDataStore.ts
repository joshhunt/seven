// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { DataStore } from "@bungie/datastore";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";
import { EnumUtils } from "@Utilities/EnumUtils";

export interface ClanInviteDataStorePayload {
  initialClanSettings: { [p: string]: boolean };
  clanInviteSettings: { [p: string]: boolean };
}

class _ClanInviteDataStore extends DataStore<ClanInviteDataStorePayload> {
  public static Instance = new _ClanInviteDataStore({
    /* function that can be called in Privacy settings to update clan invite settings if possible */
    initialClanSettings: null,
    clanInviteSettings: null,
  });

  public actions = this.createActions({
    updateInitialSettings: (
      state,
      initialClanSettings: { [p: string]: boolean }
    ) => ({ initialClanSettings }),
    updateCurrentSettings: (
      state,
      clanInviteSettings: { [p: string]: boolean }
    ) => ({ clanInviteSettings }),
  });

  public updateClans = () => {
    const promises = Object.keys(this.state.initialClanSettings).reduce(
      (acc: Promise<number>[], membershipType: string) => {
        const isActive =
          !this.state.initialClanSettings[membershipType] &&
          this.state.clanInviteSettings[membershipType];
        const isDeactive =
          this.state.initialClanSettings[membershipType] &&
          !this.state.clanInviteSettings[membershipType];

        if (isActive || isDeactive) {
          acc.push(
            Platform.GroupV2Service.SetUserClanInviteSetting(
              BungieMembershipType[
                EnumUtils.getStringValue(membershipType, BungieMembershipType)
              ],
              isActive
            )
          );
        }

        return acc;
      },
      [] as Promise<number>[]
    );

    Promise.all(promises)
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };
}

/**
 * This houses the function that updates clan settings, clan settings before any change, and clan settings after a change on privacy settings page
 * actions: updateInitialSettings, updateCurrentSettings
 */
export const ClanInviteDataStore = _ClanInviteDataStore.Instance;
