import { DataStore } from "@Global/DataStore";
import { RefObject } from "react";

export interface IGlobalElement {
  guid: number;
  el: JSX.Element;
  ref: RefObject<any>;
}

export interface IGlobalElementDataStorePayload {
  elements: IGlobalElement[];
}

class GlobalElementDataStoreInternal extends DataStore<
  IGlobalElementDataStorePayload
> {
  public static Instance = new GlobalElementDataStoreInternal({
    elements: [],
  });

  public addElement(ref: RefObject<any>, guid: number, el: JSX.Element) {
    const elements = [
      ...this.state.elements,
      {
        ref,
        guid,
        el,
      },
    ];

    this.update({
      elements,
    });
  }

  public removeModal(guid: number) {
    const elements = this.state.elements.filter((m) => m.guid !== guid);

    this.update({
      elements,
    });
  }
}

/** A datastore to put elements at the root of the app, outside of the rest of the content */
export const GlobalElementDataStore = GlobalElementDataStoreInternal.Instance;
