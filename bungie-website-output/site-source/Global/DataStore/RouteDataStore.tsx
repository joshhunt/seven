import { DataStore } from "@Global/DataStore";

export interface IRouteUpdate {
  currentPath: string;
}

export class RouteDataStore extends DataStore<IRouteUpdate> {
  public static Instance = new RouteDataStore({
    currentPath: null,
  });

  public actions = this.createActions({
    /**
     * Set the current URL path
     * @param currentPath
     */
    setCurrentPath: (currentPath: string) => ({ currentPath }),
  });
}
