import { DefinitionNotFoundError, InvalidPropsError } from "@CustomErrors";
import { DestinyDatabase } from "@Database/Database";
import {
  DestinyWorldDefinitionsGenerated,
  DestinyWorldDefinitionsTypeMap,
} from "@Definitions";
import { RendererLogLevel } from "@Enum";
import { BroadcasterObserver } from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Logger } from "@Global/Logger";
import { Config, Platform } from "@Platform";
import ConfirmationModal from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import React from "react";
// @ts-ignore
import MyWorker from "./DestinyDefinitions.worker";

interface IMessageEventData<T> {
  name: string;
  detail: T;
}

type WorkerDefinitionsEvent = IMessageEventData<{
  definitions: string;
}>;

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

  /** If true, an error has occured */
  hasError?: boolean;
}

export class DestinyDefinitionsObserver extends BroadcasterObserver<
  ManifestPayload,
  IDestinyDefinitionsObserverProps<DestinyDefinitionType>
> {}

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

  private readonly worker = new MyWorker() as Worker;
  public definitions: Partial<AllDefinitionsFetcherized> = {};
  public requestedTypes: (keyof AllDefinitionsFetcherized)[] = [];

  constructor() {
    super({
      isLoading: false,
      isLoaded: false,
    });

    this.worker.onerror = this.actions.setError;

    this.worker.addEventListener("error", this.actions.setError, false);

    // Listen for anytime the worker sends definitions and put them in state
    this.worker.onmessage = this.onWorkerMessage;
  }

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

  private readonly onWorkerMessage = (event: MessageEvent) => {
    // The data we got back from the worker
    const eventData = event.data as WorkerDefinitionsEvent;

    if (eventData.name === "definitions") {
      // We know in this case the detail data is definitions
      // If 'definitionsAreUpdated' is true, that means these are new definitions, and they should replace existing ones
      const { definitions: defString } = eventData.detail;

      const definitions = JSON.parse(defString) as Record<
        keyof DestinyWorldDefinitionsTypeMap,
        any
      >;

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
  };

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

  /** Used as a last resort if things are busted. Only to be called on error. */
  public async scorchedEarth() {
    const db = await DestinyDatabase;
    await db.delete();

    window.location.reload();
  }

  public typesAreLoaded(types: (keyof DestinyWorldDefinitionsGenerated)[]) {
    return types.every((type) => Object.keys(this.definitions).includes(type));
  }

  private showUpdateModal() {
    ConfirmationModal.show(
      {
        type: "warning",
        cancelButtonProps: {
          disable: true,
        },
        confirmButtonProps: {
          buttonType: "gold",
          labelOverride: Localizer.Destiny.BungieNetUpdateButtonLabel,
          onClick: () => {
            location.reload();

            return false;
          },
        },
        title: Localizer.Destiny.DefinitionsUpdateRequired,
        children: <div>{Localizer.Destiny.DefinitionsUpdateMessage}</div>,
      },
      {
        preventUserClose: true,
      }
    );
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

    await this.loadOrFetchDb(props);
  }

  /**
   * Attempt to grab the DB from the user's browser. If it doesn't exist, or if it's old, fetch a new one.
   * @param props
   */
  private async loadOrFetchDb(
    props: IDestinyDefinitionsObserverProps<DestinyDefinitionType>
  ) {
    // Don't request types that have already been requested
    const filteredTypes = props.types.filter(
      (type) => !this.requestedTypes.includes(type)
    );

    if (filteredTypes.length === 0) {
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
      },
    });
  }

  /**
   * Attempt to grab the DB from the user's browser. If it doesn't exist, or if it's old, fetch a new one.
   */
  private async loadManifest() {
    // We keep the current manifest version in LocalStorage because we can quickly and synchronously retrieve it
    const manifest: Config.DestinyManifest = await Platform.Destiny2Service.GetDestinyManifest();
    let isCurrent = false;

    const db = await DestinyDatabase;

    const manifestTable = db.table("manifest");
    if (manifestTable) {
      try {
        const existingVersion = await manifestTable.toCollection().first();
        isCurrent =
          existingVersion !== undefined &&
          manifest.version === existingVersion.version &&
          Localizer.CurrentCultureName === existingVersion.locale;
      } catch (e) {
        console.warn(e);
        // unable to get existing version - ignore
      }
    }

    /** If we already have definitions loaded in memory, but the manifest is updated, show a force update modal. */
    const existingDefinitionKeys = Object.keys(this.definitions);
    if (existingDefinitionKeys.length > 0 && !isCurrent) {
      this.showUpdateModal();

      return;
    }

    return {
      isCurrent,
      manifest,
    };
  }
}

export const DestinyDefinitions = DestinyDefinitionsInternal.Instance;
