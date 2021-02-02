import {
  Broadcaster,
  BroadcasterObserver,
  CustomObserverClass,
  DestroyCallback,
} from "@Global/Broadcaster/Broadcaster";
import deepEqual from "deep-equal";
import { useEffect, useState } from "react";

type DataStoreActionReturn<TDataType> =
  | Partial<TDataType>
  | Promise<Partial<TDataType>>;
type DataStoreActions<TDataType> = Record<
  any,
  (...args: any[]) => DataStoreActionReturn<TDataType>
>;

export abstract class DataStore<
  TDataType extends object,
  TObserverProps = any,
  TObserverType extends BroadcasterObserver<
    TDataType,
    TObserverProps
  > = BroadcasterObserver<TDataType>
> extends Broadcaster<TDataType, TObserverProps, TObserverType> {
  protected _internalState: TDataType = null;

  public actions;

  public get state() {
    return this._internalState;
  }

  /**
   * Creates a DataStore
   * @param initialData The starting data (can be null)
   * @param subscriptionConstructor
   * @param propsRequired
   */
  constructor(
    initialData: TDataType,
    subscriptionConstructor: CustomObserverClass<
      TObserverType,
      TDataType,
      TObserverProps
    > = null,
    propsRequired = false
  ) {
    super(subscriptionConstructor, propsRequired);
    if (initialData) {
      this._internalState = initialData;
    }
  }

  /**
   * Creates a helper function for actions which updates the data store when the action returns
   * @param actions An object of functions which return data that updates the store
   */
  protected readonly createActions = <T extends DataStoreActions<TDataType>>(
    actions: T
  ): T => {
    return Object.keys(actions).reduce((acc, item) => {
      const action = actions[item];

      acc[item] = async (...args: any[]) => {
        // Call it, with the given arguments
        const result = action.apply(this, [...args]);

        // Determine whether the result is a promise
        const isAsync = result instanceof Promise;

        // If the result is a promise, await it
        const outputData = isAsync ? await result : result;

        // update the data store with the new data
        this.update(outputData);

        // Return an empty object, because there's no reason to use this anyway
        return {};
      };

      return acc;
    }, {} as DataStoreActions<TDataType>) as T;
  };

  /**
   * Update the store with new data, and update subscribers.
   * @param data
   */
  private update(data: Partial<TDataType> = {}) {
    const newState = { ...(this._internalState ?? {}), ...data };
    const equal = deepEqual(newState, this._internalState);

    if (equal) {
      return false;
    }

    this._internalState = {
      ...(this._internalState ?? {}),
      ...data,
    } as TDataType;

    this.broadcast(this._internalState);

    return true;
  }

  /**
   * Observe this data store. Call the returned callback to destroy.
   * @param updateImmediately (default = true) If true, the callback will be called immediately on creation, with current data.
   * @param props The further input about the observer, if any
   * @param callback
   */
  public observe(
    callback: (newData: TDataType) => void,
    props?: any,
    updateImmediately = true
  ): DestroyCallback {
    const { destroy, observer } = this.saveObserver(callback, props);

    if (updateImmediately) {
      observer.update(this._internalState);
    }

    return destroy;
  }
}

/**
 * Subscribe to a data store such that the data is always up-to-date.
 * @param ds
 * @param props
 * @param updateImmediately
 */
export const useDataStore = <
  TData extends object,
  TObserverProps extends object
>(
  ds: DataStore<TData>,
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
