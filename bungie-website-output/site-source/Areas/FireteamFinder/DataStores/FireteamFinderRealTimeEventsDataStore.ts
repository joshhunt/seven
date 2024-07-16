// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { RealTimeEventing } from "@Platform";

export interface FireteamFinderRealTimeEventsDataStorePayload {
  eventData: RealTimeEventing.EventChannelResponse;
}

class _FireteamFinderRealTimeEventsDataStore extends DataStore<
  FireteamFinderRealTimeEventsDataStorePayload
> {
  private static readonly emptyPayload: FireteamFinderRealTimeEventsDataStorePayload = {
    eventData: null,
  };
  public static Instance = new _FireteamFinderRealTimeEventsDataStore(
    this.emptyPayload
  );

  public actions = this.createActions({
    setEventData: (
      state,
      eventData: RealTimeEventing.EventChannelResponse
    ) => ({ eventData }),
    clearEventData: (state) =>
      _FireteamFinderRealTimeEventsDataStore.emptyPayload,
  });
}

/**
 * Holds filters for the Fireteam Finder even if activity is changed
 */
export const FireteamFinderRealTimeEventsDataStore =
  _FireteamFinderRealTimeEventsDataStore.Instance;
