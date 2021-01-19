import { BroadcasterObserver } from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import { createContext } from "react";

export interface ResponsiveUpdatedDat {
  ResponsiveSize: ResponsiveSize;
  mediaQueryTest: boolean;
}

export enum ResponsiveSize {
  max,
  gridmax,
  large,
  medium,
  mobile,
  tiny,
  pico,
}

export interface IResponsiveState {
  max: boolean;
  gridmax: boolean;
  large: boolean;
  medium: boolean;
  mobile: boolean;
  tiny: boolean;
  pico: boolean;
}

export class ResponsiveMonitor extends BroadcasterObserver<IResponsiveState> {}

class ResponsiveMediaQuery {
  public name: ResponsiveSize;
  private readonly query: string;

  constructor(name: ResponsiveSize, query: string) {
    this.name = name;
    this.query = query;
  }

  public test(): boolean {
    if (!window.matchMedia) {
      window.matchMedia = () => null;
    }

    const mm = window.matchMedia(this.query);
    if (mm !== null) {
      return !!mm.matches;
    }

    return false;
  }
}

class ResponsiveInternal extends DataStore<
  IResponsiveState,
  ResponsiveMonitor
> {
  public static max = new ResponsiveMediaQuery(
    ResponsiveSize.max,
    "only screen"
  );
  public static gridmax = new ResponsiveMediaQuery(
    ResponsiveSize.gridmax,
    "only screen and (max-width : 1664px)"
  );
  public static large = new ResponsiveMediaQuery(
    ResponsiveSize.large,
    "only screen and (max-width : 1200px)"
  );
  public static medium = new ResponsiveMediaQuery(
    ResponsiveSize.medium,
    "only screen and (max-width : 992px)"
  );
  public static mobile = new ResponsiveMediaQuery(
    ResponsiveSize.mobile,
    "only screen and (max-width : 768px)"
  );
  public static tiny = new ResponsiveMediaQuery(
    ResponsiveSize.tiny,
    "only screen and (max-width : 480px)"
  );
  public static pico = new ResponsiveMediaQuery(
    ResponsiveSize.pico,
    "only screen and (max-width : 350px)"
  );

  public static Instance = new ResponsiveInternal();

  private static readonly InitialState: IResponsiveState = {
    gridmax: false,
    large: false,
    max: false,
    medium: false,
    mobile: false,
    tiny: false,
    pico: false,
  };

  public ResponsiveState: ResponsiveSize[];

  private readonly mediaQueries: ResponsiveMediaQuery[] = [];

  private constructor() {
    super(ResponsiveInternal.InitialState, ResponsiveMonitor);

    this.mediaQueries = [
      ResponsiveInternal.max,
      ResponsiveInternal.gridmax,
      ResponsiveInternal.large,
      ResponsiveInternal.medium,
      ResponsiveInternal.mobile,
      ResponsiveInternal.tiny,
      ResponsiveInternal.pico,
    ];
  }

  public initialize() {
    this.determineMq();
    this.addListeners();

    return this.state;
  }

  private addListeners() {
    window.addEventListener("resize", this.determineMq);
    window.addEventListener("load", this.determineMq);
  }

  private readonly determineMq = () => {
    const mediaQueries = this.mediaQueries;
    for (
      let i = 0, mediaQueriesLength = mediaQueries.length;
      i < mediaQueriesLength;
      i++
    ) {
      const mediaQuery = mediaQueries[i];
      const mediaQueryTest: boolean = mediaQuery.test();

      this.updateCurrentResponsiveState(
        ResponsiveSize[ResponsiveSize[mediaQuery.name]],
        mediaQueryTest
      );
    }
  };

  public getResponsiveClasses(): string[] {
    const classes: string[] = [];
    const state = this.state;

    for (const key in state) {
      if (state[key]) {
        classes.push(`r-${key}`);
      }
    }

    return classes;
  }

  private updateCurrentResponsiveState(
    responsiveSize: ResponsiveSize,
    isAdded: boolean
  ): void {
    if (typeof this.ResponsiveState === "undefined") {
      this.ResponsiveState = [];
    }

    if (this.ResponsiveState.indexOf(responsiveSize) === -1) {
      if (isAdded) {
        this.ResponsiveState.push(responsiveSize);
      }
    } else {
      if (!isAdded) {
        this.ResponsiveState.splice(
          this.ResponsiveState.indexOf(responsiveSize),
          1
        );
      }
    }

    const newSubscriptionState: IResponsiveState = {
      ...ResponsiveInternal.InitialState,
    };

    this.ResponsiveState.forEach((state) => {
      newSubscriptionState[ResponsiveSize[state]] = true;
    });

    this.update(newSubscriptionState);
  }
}

export const Responsive = ResponsiveInternal.Instance;
export const ResponsiveContext = createContext(Responsive.state);
