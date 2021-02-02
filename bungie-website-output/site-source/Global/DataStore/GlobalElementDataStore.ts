import { DataStore } from "@Global/DataStore";
import { RefObject } from "react";

export interface IGlobalElement {
  guid: string;
  el: JSX.Element;
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

  public actions = this.createActions({
    /**
     * Remove an element using the GUID used in `addElement()`
     * @param guid
     */
    removeElementByGuid: (guid: string) => {
      const elements = this.state.elements.filter((m) => m.guid !== guid);

      return {
        elements,
      };
    },
    /**
     * Add an element to global elements
     * @param ref The element reference
     * @param guid A unique ID that we can use to store the item and find it later
     * @param el The element
     */
    addElement: (guid: string, el: JSX.Element) => {
      const elements = [
        ...this.state.elements,
        {
          guid,
          el,
        },
      ];

      return {
        elements,
      };
    },
  });
}

/**
 *
 */
export const GlobalElementDataStore = GlobalElementDataStoreInternal.Instance;
