import { DataStore } from "@bungie/datastore";

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
    setCurrentPath: (state, currentPath: string) => ({ currentPath }),
  });
}
