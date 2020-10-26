import { DataStore } from "@Global/DataStore";

export interface IRouteUpdate {
  currentPath: string;
}

export class RouteDataStore extends DataStore<IRouteUpdate> {
  public static Instance = new RouteDataStore({
    currentPath: null,
  });
}
