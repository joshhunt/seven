import { DataStore } from "@bungie/datastore";
import { BroadcasterObserver } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { DefinitionNotFoundError, InvalidPropsError } from "@CustomErrors";
import { DestinyDatabase } from "@Database/Database";
import { DestinyDefinitionsWorkerMessages } from "@Database/DestinyDefinitions/DestinyDefinitionsWorkerMessages";
import {
  DestinyWorldDefinitionsGenerated,
  DestinyWorldDefinitionsTypeMap,
} from "@Definitions";
import { RendererLogLevel } from "@Enum";
import { BaseLogger } from "@Global/BaseLogger";
import { Logger } from "@Global/Logger";
import { Config, Platform } from "@Platform";
import React from "react";
// @ts-ignore
import MyWorker from "./DestinyDefinitions.worker";

const logger = new BaseLogger("[DESTINY_DEFINITIONS]");

interface IMessageEventData<T> {
  name: string;
  detail: T;
}

type DefinitionsDetail = {
  definitions: string;
};

type WorkerDefinitionsEvent = IMessageEventData<DefinitionsDetail>;

type WorkerUpdateManifestEvent = IMessageEventData<boolean>;

// Rather than putting all definitions in memory, we will use these functions to get them
export type DefinitionsFetcherized<T extends DestinyDefinitionType> = {
  /**
   *  Get a specific definition by its hash
   * @param hash
   */
  get(hash: string | number): DestinyWorldDefinitionsTypeMap[T];
  /** Get all definitions for this type */
  all: () => { [key: string]: DestinyWorldDefinitionsTypeMap[T] };
};

// All available definition types with the fetcherization
export type AllDefinitionsFetcherized = {
  [K in keyof DestinyWorldDefinitionsGenerated]: DefinitionsFetcherized<K>;
};

/** All valid definition types */
export type DestinyDefinitionType = keyof DestinyWorldDefinitionsGenerated;

/** Observer props for the DataStore */
export interface IDestinyDefinitionsObserverProps<
  T extends DestinyDefinitionType
> {
  types: T[];
}

/** The payload received by observers */
export interface ManifestPayload {
  /** If true, we are loading */
  isLoading: boolean;

  /** If true, loading is finished */
  isLoaded: boolean;

  locale: string;

  /** If true, an error has occured */
  hasError?: boolean;
}

export class DestinyDefinitionsObserver extends BroadcasterObserver<
  ManifestPayload,
  IDestinyDefinitionsObserverProps<DestinyDefinitionType>
> {}

type ManifestResult = {
  isCurrent: boolean;
  manifest: Config.DestinyManifest;
  locale: string;
};

/**
 * Determines whether the client has existing definitions loaded, whether they are up-to-date, etc.
 * If they need new definitions, it calls into DestinyDefinitions.worker
 * */
class DestinyDefinitionsInternal extends DataStore<
  ManifestPayload,
  IDestinyDefinitionsObserverProps<DestinyDefinitionType>,
  DestinyDefinitionsObserver
> {
  public static Instance = new DestinyDefinitionsInternal();
  public definitions: Partial<AllDefinitionsFetcherized> = {};
  public requestedTypes: (keyof AllDefinitionsFetcherized)[] = [];
  public actions = this.createActions({
    /**
     * Set the error value
     * @param error
     */
    setError: (error: any) => {
      Logger.logToServer(error, RendererLogLevel.Error);

      return {
        hasError: true,
      };
    },
    /**
     * Check the currently loaded state and update it
     */
    updateLoadingState: () => {
      const allRequestedTypesLoaded = this.typesAreLoaded(this.requestedTypes);

      // Only say we're done loading if everything that requires definitions has them
      return {
        isLoading: !allRequestedTypesLoaded,
        isLoaded: allRequestedTypesLoaded,
      };
    },
  });

  private readonly worker = new MyWorker() as Worker;
  private loadRequestsPendingManifestUpdate: (() => Promise<void>)[] = [];
  private cachedManifestResult: ManifestResult | null = null;
  private manifestLoadStarted = false;
  private manifestIsUpdating = false;

  constructor() {
    super({
      isLoading: false,
      isLoaded: false,
      locale: Localizer.CurrentCultureName,
    });

    this.worker.onerror = this.actions.setError;

    this.worker.addEventListener("error", this.actions.setError, false);

    // Listen for anytime the worker sends definitions and put them in state
    this.worker.onmessage = this.onWorkerMessage;
  }

  public observe(
    callback: (newData: ManifestPayload) => void,
    props?: IDestinyDefinitionsObserverProps<DestinyDefinitionType>,
    updateImmediately = true
  ) {
    if (!props) {
      throw new InvalidPropsError("Props are required for DestinyDefinitions");
    }

    this.load(props);

    return super.observe(callback, props, updateImmediately);
  }

  /** Used as a last resort if things are busted. Only to be called on error. */
  public async scorchedEarth() {
    const db = await DestinyDatabase;
    await db.delete();

    window.location.reload();
  }

  public typesAreLoaded(types: (keyof DestinyWorldDefinitionsGenerated)[]) {
    return types.every((type) => Object.keys(this.definitions).includes(type));
  }

  // We need to make sure we only update observers whose definitions are fully loaded
  protected getObserversToUpdate() {
    return this.allObservers.filter((observer: DestinyDefinitionsObserver) => {
      // Allow something to subscribe to no types, but still get udpates
      if (!observer.params.types) {
        return true;
      }

      const requestedTypes = observer.params.types;
      const loadedDefinitions = Object.keys(
        this.definitions
      ) as (keyof DestinyWorldDefinitionsGenerated)[];

      // Check to see if the definitions object includes all the definitions requested in this observer
      return requestedTypes.every((key) => loadedDefinitions.includes(key));
    });
  }

  /**
   * Load the manifest data.
   */
  private async load(
    props: IDestinyDefinitionsObserverProps<DestinyDefinitionType>
  ) {
    if (!props.types) {
      return;
    }

    const loadRequest = () => {
      logger.logVerbose("Running request");

      return this.loadOrFetchDb(props);
    };

    // We haven't loaded the manifest before now, but requests might come in while it is loading
    if (!this.cachedManifestResult) {
      // If the manifest has been requested for the first time, but we're still loading it, store the requests for later.
      if (this.manifestLoadStarted) {
        logger.logVerbose("WAITING UNTIL MANIFEST IS LOADED");
        this.loadRequestsPendingManifestUpdate.push(loadRequest);
      } else {
        logger.logVerbose("MANIFEST NEVER LOADED, EXECUTING");
        await loadRequest();
      }
    }
    // In this case, the manifest has been loaded, but it may need to be updated
    else {
      // If the manifest is in the middle of being updated and the DB may be temporarily closed. Store the requests for later.
      if (this.manifestIsUpdating) {
        logger.logVerbose("WAITING UNTIL MANIFEST IS FINISHED UPDATING");
        this.loadRequestsPendingManifestUpdate.push(loadRequest);
      } else {
        logger.logVerbose("MANIFEST IS LOADED AND CURRENT, EXECUTING");
        await loadRequest();
      }
    }
  }

  private async processPendingUpdates() {
    logger.logVerbose(
      "MANIFEST UPDATED, LOADING ALL PENDING REQUESTS",
      this.loadRequestsPendingManifestUpdate
    );

    // Grab all promises inside the pending updates
    const promises = this.loadRequestsPendingManifestUpdate.map((cb) => cb());

    // Wait for finished (ignoring errors)
    await Promise.allSettled(promises);

    // Clear the queue after they've all run
    this.loadRequestsPendingManifestUpdate = [];
  }

  /**
   * Attempt to grab the DB from the user's browser. If it doesn't exist, or if it's old, fetch a new one.
   * @param props
   */
  private async loadOrFetchDb(
    props: IDestinyDefinitionsObserverProps<DestinyDefinitionType>
  ) {
    const localeUpdated = this.state.locale !== Localizer.CurrentCultureName;

    // Don't request types that have already been requested
    const filteredTypes = props.types.filter(
      (type) => !this.requestedTypes.includes(type)
    );

    if (filteredTypes.length === 0 && !localeUpdated) {
      // All these types have already been requested!

      return;
    }

    // Add new types to requested types
    this.requestedTypes.push(...filteredTypes);

    // This has to come after requestedTypes is updated
    this.actions.updateLoadingState();

    const manifestData = await this.loadManifest();

    this.worker.postMessage({
      name: "load",
      detail: {
        manifest: manifestData,
        types: filteredTypes,
        locale: Localizer.CurrentCultureName,
        mock: false,
      },
    });
  }

  /**
   * Runs when the worker sends a message back to this thread
   * @param event
   */
  private readonly onWorkerMessage = (event: MessageEvent) => {
    const name: string = event.data.name;

    // The data we got back from the worker

    switch (name) {
      case DestinyDefinitionsWorkerMessages.LOADED_DEFINITIONS:
        this.onDefinitionsMessage(
          (event.data as WorkerDefinitionsEvent).detail
        );
        break;

      case DestinyDefinitionsWorkerMessages.UPDATING_MANIFEST:
        this.onUpdatingManifestMessage(
          (event.data as WorkerUpdateManifestEvent).detail
        );
        break;
    }
  };

  private onUpdatingManifestMessage(isUpdating: boolean) {
    const finishedUpdating = this.manifestIsUpdating && !isUpdating;

    this.manifestIsUpdating = isUpdating;

    if (finishedUpdating) {
      this.processPendingUpdates();
    }
  }

  /**
   * Called when DestinyDefinitions.worker.js sends the "definitions" message containing a stringified definitions object
   * @param eventDetailData Stringified definitions
   * @private
   */
  private onDefinitionsMessage(eventDetailData: DefinitionsDetail) {
    // We know in this case the detail data is definitions
    // If 'definitionsAreUpdated' is true, that means these are new definitions, and they should replace existing ones
    const { definitions: defString } = eventDetailData;

    const definitions = JSON.parse(defString) as Record<
      keyof DestinyWorldDefinitionsTypeMap,
      any
    >;

    logger.logVerbose("Received definitions", Object.keys(definitions));

    // Instead of exposing all the definitions all the time, it's safer to expose them as closures (for memory consumption)
    const fetcherize = (
      type: string,
      defs: Record<string, { hash: any; def: any }>
    ) => {
      return {
        get: (hash: string | number) => {
          if (hash in defs) {
            return defs[hash].def;
          }

          throw new DefinitionNotFoundError(hash, type);
        },
        all: () => {
          const defHashTable: Record<string, any> = {};

          Object.keys(defs).forEach(
            (hash) => (defHashTable[hash] = defs[hash].def)
          );

          return defHashTable;
        },
      };
    };

    /** Multiple things will request definitions, so we need to keep adding to this object over time */
    const fetcherized: Partial<AllDefinitionsFetcherized> = this.definitions;

    Object.keys(definitions)
      .filter((k: keyof DestinyWorldDefinitionsGenerated) => !fetcherized[k])
      .forEach((k: keyof DestinyWorldDefinitionsGenerated) => {
        fetcherized[k] = fetcherize(k, definitions[k]);
      });

    // Note - I originally had this in the payload, along with isLoading/isLoaded etc, but that broke every time
    // a hot reload happened locally because of the closures (i.e. it's not just raw data). Having it as a property avoids that.
    this.definitions = fetcherized;

    this.actions.updateLoadingState();
  }

  /**
   * Attempt to grab the DB from the user's browser. If it doesn't exist, or if it's old, fetch a new one.
   */
  private async loadManifest(): Promise<ManifestResult> {
    if (
      this.cachedManifestResult &&
      this.cachedManifestResult?.locale === Localizer.CurrentCultureName
    ) {
      return this.cachedManifestResult;
    }

    this.manifestLoadStarted = true;

    const manifest: Config.DestinyManifest = await Platform.Destiny2Service.GetDestinyManifest();

    let isCurrent = false;

    const locale = Localizer.CurrentCultureName;

    const db = await DestinyDatabase;

    const manifestTable = db.table("manifest");
    if (manifestTable) {
      try {
        const existingVersion = await manifestTable.toCollection().first();

        isCurrent =
          existingVersion !== undefined &&
          manifest.version === existingVersion.version &&
          locale === existingVersion.locale;
      } catch (e) {
        console.warn(e);
        // unable to get existing version - ignore
      }
    }

    /** If we already have definitions loaded in memory, but the manifest is updated, force update the definitions and let the user know this will take a minute. */
    const existingDefinitionKeys = Object.keys(this.definitions);
    if (existingDefinitionKeys.length > 0 && !isCurrent) {
      window.location.href = window.location.href + "?newManifest=true";
      window.location.reload();

      return;
    }

    const result = {
      isCurrent,
      manifest,
      locale,
    };

    this.cachedManifestResult = result;

    // If we have any requests that came in while we were loading the manifest, make sure they go through
    if (result.isCurrent) {
      this.processPendingUpdates();
    }

    return result;
  }
}

export const DestinyDefinitions = DestinyDefinitionsInternal.Instance;
