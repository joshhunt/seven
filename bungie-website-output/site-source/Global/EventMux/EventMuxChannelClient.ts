import { EventMuxStorage } from "@Global/EventMux/EventMuxStorage";
import { Logger } from "@Global/Logger";
import { Platform, RealTimeEventing } from "@Platform";
import { DateTime } from "luxon";
import { EventMux } from "./EventMuxBase";

export class EventMuxChannelClient {
  /********
	 PUBLIC VARS
	 ********/

  public requestTimeout = 90; // in seconds

  /********
	 PRIVATE VARS
	 ********/

  private ackNext = 0;
  private failures = 0;
  private getRequested = false;
  private isReplaced = false;
  private readonly errorTimeoutLeeway = 5; // in seconds
  private readonly errorTimeoutReductionAmount = 10; // in seconds

  private pendingGets = 0;
  private failureTimer: number = null;
  private errorGetTimeout: number = null;

  /**
   * ChannelClient - Handles real-time get requests
   * @param tabId Id of the current tab
   * @param tabReplacedCallback Callback called when the current tab gets replaced
   * @returns {}
   */
  constructor(
    public tabId: number,
    private readonly tabReplacedCallback: Function
  ) {}

  /**
   * Begins the real-time GET process
   * @returns {void}
   */
  public startGets() {
    if (this.getRequested) {
      return;
    }

    this.getRequested = true;
    this.performRealTimeGet();
  }

  /**
   * If true, Channel Client is currently active and polling
   * @returns {}
   */
  public isActive(): boolean {
    return (
      EventMux.storage.getItem(EventMuxStorage.storageKeys.IsActive) === "true"
    );
  }

  private performRealTimeGet() {
    if (!EventMux.isCurrentTabOverlord()) {
      Logger.errorVerbose(
        "[ChannelClient] Something tried to run a GET, but this tab isn't the overlord!"
      );

      return;
    }

    if (this.isReplaced) {
      Logger.errorVerbose(
        "[ChannelClient] Something tried to run a GET, but this tab was replaced!"
      );

      return;
    }

    clearTimeout(this.errorGetTimeout);

    if (EventMux.isAuthed) {
      Logger.logVerbose(
        `[ChannelClient][${DateTime.now().toFormat(
          "HH:mm:ss"
        )}] Performing GET from Tab ${this.tabId}`
      );

      this.toggleActive(true);

      this.setFailureTimer();

      this.pendingGets++;

      Platform.NotificationService.GetRealTimeEvents(
        this.ackNext,
        this.tabId,
        this.requestTimeout
      )
        .then((response) => {
          this.pendingGets--;
          if (!EventMux.isCurrentTabOverlord) {
            Logger.warnVerbose(
              `[ChannelClient][${DateTime.now().toFormat(
                "HH:mm:ss"
              )}] Get succeeded, but this tab is no longer overlord! Throwing out results...`
            );

            return;
          }

          Logger.logVerbose(
            `[ChannelClient][${DateTime.now().toFormat(
              "HH:mm:ss"
            )}] GET Succeeded`,
            response
          );

          // Tab limit reached, ditch this tab
          if (response.replaced) {
            Logger.warnVerbose(
              "[ChannelClient] This channel was replaced! Refresh to establish a new channel."
            );
            this.onTabReplaced();

            return;
          }

          this.onGetSuccess(response);
        })
        .catch((error) => {
          this.pendingGets--;

          this.clearFailureTimer();

          if (!EventMux.isCurrentTabOverlord) {
            Logger.warnVerbose(
              `[ChannelClient][${DateTime.now().toFormat(
                "HH:mm:ss"
              )}] Get failed, but this tab is no longer overlord! Throwing out results...`
            );

            return;
          }
          this.onGetFailure(error);
        });
    } else {
      this.toggleActive(false);
      Logger.warnVerbose(
        "[ChannelClient] Real time events are disabled or user is not authenticated!"
      );
    }
  }

  private onTabReplaced() {
    this.isReplaced = true;
    this.tabReplacedCallback();
  }

  private resetChannelClient() {
    Logger.logVerbose(
      "[ChannelClient] Server sequence reset, resetting channel client..."
    );
    this.ackNext = 0;
    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.StoredResponse,
      JSON.stringify({})
    );
    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.LastSeqStored,
      String(0)
    );
    EventMux.lastSeqStored = 0;
  }

  private onGetSuccess(response: RealTimeEventing.EventChannelResponse) {
    if (this.ackNext > response.seq) {
      // Looks like the server has restarted the sequence. Clear our shared storage to
      // logic related to finding the oldest message works.
      this.resetChannelClient();
    }

    this.ackNext = response.seq;
    this.tabId = response.tab || this.tabId;

    Logger.logVerbose("[ChannelClient] Storing GET results...");

    // Delete the oldest response out of the current object
    const storedResponse = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.StoredResponse
    );
    const storedResponseParsed = storedResponse
      ? JSON.parse(storedResponse)
      : {};
    const storedResponseSeqs = Object.keys(storedResponseParsed);
    const storedResponseSeqsLength = storedResponseSeqs.length;
    if (storedResponseSeqsLength > 2) {
      let minimumKey = 9007199254740991;
      for (let i = 0; i < storedResponseSeqsLength; i++) {
        const storedResponseSeq = parseInt(storedResponseSeqs[i]);
        minimumKey =
          storedResponseSeq < minimumKey ? storedResponseSeq : minimumKey;
      }
      delete storedResponseParsed[minimumKey];
    }

    // Add new response data
    const newResponse = storedResponseParsed;
    const newResponseSeq = response.seq;
    newResponse[newResponseSeq] = response;

    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.LastSeqStored,
      newResponseSeq.toString()
    );
    EventMux.lastSeqStored = newResponseSeq;
    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.StoredResponse,
      JSON.stringify(newResponse),
      true
    );

    if (this.pendingGets === 0) {
      this.performRealTimeGet();
    }
  }

  private onGetFailure(error: any) {
    let shouldTryAgain = true;

    switch (error.errorCode) {
      case 2: // TransportException
        switch (error.status) {
          case 0:
            shouldTryAgain = false;
            error.abort();
            Logger.error(
              "[ChannelClient] Request failed, event request cancelled."
            );
            break;

          case 524:
            shouldTryAgain = true;
            this.reduceTimerDueToTimeout();
        }
        break;
      case 5: // System Disabled
      case 99: // Not authenticated
        shouldTryAgain = false;
        Logger.error("[ChannelClient] Events suspended.");
        break;
      case 51: // PerEndpointRequestThrottleExceeded
        shouldTryAgain = false;
        Logger.logVerbose(
          "[ChannelClient] Throttle Exceeded, Events suspended."
        );
        break;
      default:
        Logger.error(
          `[ChannelClient] GET failed, code ${error.errorCode}: "${error.errorMessage}"`
        );
    }

    if (shouldTryAgain) {
      const secondsToWait = Math.max(Math.pow(2, this.failures), 10);
      const msToWait = secondsToWait * 1000;

      Logger.logVerbose(
        `[ChannelClient] GET will try again in ${secondsToWait} seconds.`
      );

      this.errorGetTimeout = setTimeout(() => {
        this.performRealTimeGet();
      }, msToWait);
    } else {
      this.toggleActive(false);
    }

    this.failures++;
  }

  private toggleActive(isActive: string | boolean) {
    const isActiveString = isActive.toString();

    if (this.isActive().toString() !== isActiveString) {
      Logger.logVerbose(
        `[ChannelClient] Toggling active state to ${isActiveString}`
      );
    }

    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.IsActive,
      isActiveString
    );
  }

  private setFailureTimer() {
    this.clearFailureTimer();
    this.failureTimer = setTimeout(() => {
      this.reduceTimerDueToTimeout();
      this.performRealTimeGet();
    }, (this.requestTimeout + this.errorTimeoutLeeway) * 1000);
  }

  private clearFailureTimer() {
    clearTimeout(this.failureTimer);
  }

  private reduceTimerDueToTimeout() {
    this.requestTimeout = Math.max(
      15,
      this.requestTimeout - this.errorTimeoutReductionAmount
    );
  }
}
