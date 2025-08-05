import { UrlUtils } from "@Utilities/UrlUtils";
import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

export interface SearchParams {
  activityGraphId?: string;
  lobbyState?: string;
  tags: string[];
  filters: Record<string, string>;
}

const searchParamNames: (keyof SearchParams)[] = [
  "activityGraphId",
  "lobbyState",
  "tags",
  "filters",
] as const;
function parseSearch(search: string): SearchParams {
  const urlParams = new URLSearchParams(search);

  const entireObject = UrlUtils.QueryToObject(search);
  // filters are set up like &{categoryHash}={valueHash}
  // What this loop does is remove the other, non-filters from the search params. Leaving just the filters behind.
  const filters = Object.keys(UrlUtils.QueryToObject(search))
    .filter((key) => !searchParamNames.includes(key as keyof SearchParams))
    .reduce((obj, key) => {
      if (!searchParamNames.includes(key as keyof SearchParams)) {
        obj[key] = entireObject[key];
      }
      return obj;
    }, {} as Record<string, string>);

  return {
    activityGraphId: urlParams.get("activityGraphId"),
    lobbyState: urlParams.get("lobbyState"),
    tags: [...new Set(urlParams.getAll("tags"))],
    filters: filters,
  };
}

export function useFireteamSearchParams() {
  const history = useHistory();
  const search = useLocation().search;
  const params = useMemo(() => parseSearch(search), [search]);

  const setParams = useCallback(
    (newParams: Partial<SearchParams>) => {
      history.push({
        search: parseParams(newParams).toString(),
      });
    },
    [history]
  );

  return {
    params,
    setParams,
  };
}

export function parseParams(params: Partial<SearchParams>) {
  const urlParams = new URLSearchParams(params.filters ?? {});
  if (params.activityGraphId) {
    urlParams.append("activityGraphId", params.activityGraphId);
  }
  if (params.lobbyState) {
    urlParams.append("lobbyState", params.lobbyState);
  }
  for (const tag of params.tags ?? []) {
    urlParams.append("tags", tag);
  }
  return urlParams;
}
