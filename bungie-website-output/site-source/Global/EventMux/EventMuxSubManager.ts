import * as Globals from "@Enum";
import { BroadcasterObserver } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { EventMuxStorage } from "@Global/EventMux/EventMuxStorage";
import { Logger } from "@Global/Logger";
import { Notifications, RealTimeEventing } from "@Platform";
import { EventMux } from "./EventMuxBase";

export interface IEventMuxSubscriptionParams {
  eventType: Globals.RealTimeEventType;
}

export class EventMuxMonitor extends BroadcasterObserver<
  Notifications.RealTimeEventData,
  IEventMuxSubscriptionParams
> {
  constructor(
    callback: (newData: Notifications.RealTimeEventData) => void,
    params: IEventMuxSubscriptionParams
  ) {
    super(callback, params);
  }
}

export class EventMuxSubManager extends DataStore<
  Notifications.RealTimeEventData,
  IEventMuxSubscriptionParams,
  EventMuxMonitor
> {
  private lastSeqParsed = 0;

  constructor() {
    super(null, {
      observerClassConstructor: EventMuxMonitor,
    });

    EventMux.storage.addCallback(() => {
      this.sendUpdates();
    });
  }

  public actions = this.createActions({});

  public sendUpdates(): any[] {
    const storedResponseString = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.StoredResponse
    );
    const storedResponse: RealTimeEventing.EventChannelResponse[] = JSON.parse(
      storedResponseString
    );

    const lastSeqStored = EventMux.lastSeqStored;

    if (this.lastSeqParsed === lastSeqStored) {
      return [];
    }

    if (this.lastSeqParsed === 0 || this.lastSeqParsed > lastSeqStored) {
      this.lastSeqParsed = lastSeqStored - 1;
    }

    // Check the response for each possible seq that has been stored since the last one we parsed
    for (let seq = this.lastSeqParsed + 1; seq <= lastSeqStored; seq++) {
      // Check if there is a response with this seq
      if (storedResponse && storedResponse.length && seq in storedResponse) {
        const responseAtSeq = storedResponse[seq];

        // Check if there are any events in that one
        if ("events" in responseAtSeq) {
          const eventsLength = responseAtSeq.events.length;
          for (let i = 0; i < eventsLength; i++) {
            const event = responseAtSeq.events[i];

            const matchingSubs = Object.keys(this.observers)
              .map((a) => this.observers[a])
              .filter((a) => a.params.eventType === event.eventType);

            matchingSubs.forEach((sub) => sub.update(event));

            const eventName = Globals.RealTimeEventType[event.eventType];
            Logger.logVerbose(
              `[EventMuxSubscription] Update found for [${eventName}] at seq ${seq}`
            );
          }
        }
      }

      this.lastSeqParsed = seq;
    }
  }
}
