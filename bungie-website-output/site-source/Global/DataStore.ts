import { DetailedError } from "@CustomErrors";
import {
  Broadcaster,
  BroadcasterObserver,
  DestroyCallback,
  ParameterlessConstructor,
} from "@Global/Broadcaster/Broadcaster";
import { useState, useEffect } from "react";
import deepEqual from "deep-equal";

export class DataStore<
  TDataType extends object,
  TObserverProps = any,
  TObserverType extends BroadcasterObserver<
    TDataType,
    TObserverProps
  > = BroadcasterObserver<TDataType>
> extends Broadcaster<TDataType, TObserverProps, TObserverType> {
  protected _internalState: TDataType = null;

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
    subscriptionConstructor: ParameterlessConstructor<
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
   * Update the store with new data, and update subscribers.
   * @param data
   */
  public update(data: Partial<TDataType>) {
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
    const { destroy, observer } = this.storeObserver(callback, props);

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
