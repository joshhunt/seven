export type DestroyCallback = () => void;

export interface CustomObserverClass<
  ConstructorType,
  TDataType,
  TObserverProps = any
> {
  new (
    callback: (newData: TDataType) => void,
    input: TObserverProps
  ): ConstructorType;
}

export class BroadcasterObserver<TDataType, TInputType = any> {
  private updateTimer: number = null;
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

export class Broadcaster<
  TDataType,
  TObserverProps = any,
  TObserverType extends BroadcasterObserver<
    TDataType,
    TObserverProps
  > = BroadcasterObserver<TDataType>
> {
  protected readonly observers: { [key: string]: TObserverType } = {};

  /**
   * Creates a Broadcaster
   * @param observerClassConstructor A constructor for the observer, if it is not the default (just pass the class itself)
   * @param propsRequired If true, observing will require params
   */
  constructor(
    protected readonly observerClassConstructor: CustomObserverClass<
      TObserverType,
      TDataType,
      TObserverProps
    > = null,
    protected readonly propsRequired = false
  ) {}

  protected get allObservers(): TObserverType[] {
    return Object.values(this.observers);
  }

  public broadcast(data: TDataType) {
    const broadcastTo = this.getObserversToUpdate(data);

    broadcastTo.forEach((observer) => observer.update(data));
  }

  protected buildObserver(
    callback: (newData: TDataType) => void,
    props?: TObserverProps
  ) {
    if (this.propsRequired && props === undefined) {
      throw new Error(
        "Props cannot be null, this data store requires props parameters for each observer"
      );
    }

    const observer: TObserverType = this.observerClassConstructor
      ? new this.observerClassConstructor(callback, props)
      : (new BroadcasterObserver(callback, props) as TObserverType);

    return observer;
  }

  protected saveObserver(
    callback: (newData: TDataType) => void,
    props?: TObserverProps
  ): { destroy: DestroyCallback; observer: TObserverType } {
    const observer = this.buildObserver(callback, props);
    const guid = Broadcaster.guid();

    this.observers[guid] = observer;

    return {
      destroy: () => delete this.observers[guid],
      observer: observer,
    };
  }

  /**
   * Observe this broadcaster. Call the returned callback to destroy.
   * @param props The further input about the observer, if any
   * @param callback
   */
  public observe(
    callback: (newData: TDataType) => void,
    props?: TObserverProps
  ) {
    const { destroy } = this.saveObserver(callback, props);

    return destroy;
  }

  protected static guid() {
    return (new Date().getTime() * Math.random()).toString(36);
  }

  /**
   * Returns a list of observers, optional update parameter can be use to filter the observer list
   * @param data
   * @protected
   */
  protected getObserversToUpdate(data: TDataType) {
    return this.allObservers;
  }

  public static destroyAll(...destroyCallbacks: DestroyCallback[]) {
    destroyCallbacks.forEach((u) => u());
  }
}
