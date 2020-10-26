import { DetailedError } from "@CustomErrors";
import { useState, useEffect } from "react";
import deepEqual from "deep-equal";

export type DestroyCallback = () => void;

interface ParameterlessConstructor<
  ConstructorType,
  TDataType,
  TObserverProps = any
> {
  new (
    callback: (newData: TDataType) => void,
    input: TObserverProps
  ): ConstructorType;
}

export class DataStoreObserver<TDataType, TInputType = any> {
  private updateTimer = null;
  protected updateDelayMs = 1000 / 60;

  private readonly callback: (newData: TDataType) => void;
  public readonly params: TInputType;

  constructor(callback: (newData: TDataType) => void, params: TInputType) {
    this.callback = callback;
    this.params = params;
  }

  public update(newData: TDataType) {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      this.callback(newData);
    }, this.updateDelayMs);
  }
}

export class DataStore<
  TDataType extends object,
  TObserverProps = any,
  TObserverType extends DataStoreObserver<
    TDataType,
    TObserverProps
  > = DataStoreObserver<TDataType>
> {
  protected _internalState: TDataType = null;
  protected readonly observers: { [key: string]: TObserverType } = {};
  public get state() {
    return this._internalState;
  }

  /**
   * Creates a DataStore
   * @param initialData The starting data (can be null)
   * @param subscriptionConstructor A constructor for the subscription, if it is not the default (just pass the class itself)
   * @param propsRequired If true, subscribing will require params
   */
  constructor(
    initialData: TDataType,
    private readonly subscriptionConstructor: ParameterlessConstructor<
      TObserverType,
      TDataType,
      TObserverProps
    > = null,
    protected readonly propsRequired = false
  ) {
    if (initialData) {
      this._internalState = initialData;
    }
  }

  /**
   * Update the store with new data, and update subscribers.
   * @param data
   */
  public update(data: Partial<TDataType>) {
    const newState = { ...(this._internalState ?? {}), ...data } as TDataType;
    const equal = deepEqual(newState, this._internalState);

    if (equal) {
      return false;
    }

    this._internalState = {
      ...(this._internalState ?? {}),
      ...data,
    } as TDataType;

    this.updateObservers(data);

    return true; //
  }

  protected get allObservers(): TObserverType[] {
    return Object.keys(this.observers).map((guid) => this.observers[guid]);
  }

  public broadcast(observersToUpdate?: TObserverType[]) {
    const broadcastTo = observersToUpdate
      ? observersToUpdate
      : this.allObservers;

    broadcastTo.forEach((observer) => observer.update(this._internalState));
  }

  /**
   * Observe this data store. Call the returned callback to destroy.
   * @param updateImmediately (default = true) If true, the callback will be called immediately on creation, with current data.
   * @param props The further input about the observer, if any
   * @param callback
   */
  public observe(
    callback: (newData: TDataType) => void,
    props?: TObserverProps,
    updateImmediately = true
  ): DestroyCallback {
    if (this.propsRequired && props === undefined) {
      throw new DetailedError(
        "Props cannot be null",
        "This data store requires props parameters for each subscription"
      );
    }

    const subscription: TObserverType = this.subscriptionConstructor
      ? new this.subscriptionConstructor(callback, props)
      : (new DataStoreObserver(callback, props) as TObserverType);

    const guid = this.guid();

    this.observers[guid] = subscription;

    if (updateImmediately) {
      subscription.update(this._internalState);
    }

    return () => delete this.observers[guid];
  }

  private guid() {
    return (new Date().getTime() * Math.random()).toString(36);
  }

  protected getObserversToUpdate(update: Partial<TDataType>) {
    return this.allObservers;
  }

  private updateObservers(update: Partial<TDataType>) {
    const toUpdate = this.getObserversToUpdate(update);

    this.broadcast(toUpdate);
  }

  public static destroyAll(...destroyCallbacks: DestroyCallback[]) {
    destroyCallbacks.forEach((u) => u());
  }
}

/**
 * Subscribe to a data store such that the data is always up-to-date.
 * @param ds
 */
export const useDataStore = <
  TData extends object,
  TObserverProps extends object
>(
  ds: DataStore<TData, TObserverProps>,
  props?: TObserverProps,
  updateImmediately = true
) => {
  const [current, setCurrent] = useState(ds.state);

  useEffect(() => {
    const destroy = ds.observe(setCurrent, props, updateImmediately);

    return () => destroy();
  });

  return current;
};
