import {
  BungieMembershipType,
  DestinyComponentType,
  PlatformErrorCodes,
} from "@Enum";
import {
  generateProfileCacheKey,
  ProfileCacheContext,
  ProfileCacheContextDispatch,
  ProfileData,
  ProfileDataContextType,
} from "../ProfileDataProvider";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Platform, Responses } from "@Platform";
import { DateTime } from "luxon";
import { SystemNames } from "@Global/SystemNames";

const DEFAULT_CACHE_DURATION = 10;

export type UseProfileDataRequest = {
  membershipType: BungieMembershipType;
  membershipId: string;
  components: DestinyComponentType[];
  /**
   * How many minutes before the cached profile is considered stale. Defaults to 10
   */
  cacheMinutes?: number;
};

type UseProfileDataResponse = {
  isLoading: boolean;
  error?: unknown;
  profile?: Responses.DestinyProfileResponse;
};

/**
 * Loads multiple profiles at once from a cache.
 * @returns An array of profiles with their components.
 */
export function useMultipleProfileData(
  profileRequests: UseProfileDataRequest[]
) {
  const profileData = useContext(ProfileCacheContext);
  const profileDataDispatch = useContext(ProfileCacheContextDispatch);

  // This is memoized in case the consumer of this hook does not memoize the `profileRequests` and cause the useEffect to run on every render.
  const memoizedProfileRequests = useMemo(() => {
    return profileRequests.flat().join();
  }, [profileRequests]);

  const [results, setResults] = useState<UseProfileDataResponse[]>(
    profileRequests.map(() => ({
      isLoading: true,
    }))
  );

  useEffect(() => {
    if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
      throw new Error("Destiny 2 system is not available");
    }
    const getData = async () => {
      const cachedData: ProfileDataContextType = {};
      const missingData: UseProfileDataRequest[] = [];
      for (const request of profileRequests) {
        const cacheKey = generateProfileCacheKey(
          request.membershipType,
          request.membershipId
        );
        const cachedEntry = profileData[cacheKey];
        if (
          cachedEntry &&
          DateTime.now().diff(cachedEntry.loadedTimestamp).as("minutes") <
            (request.cacheMinutes ?? DEFAULT_CACHE_DURATION)
        ) {
          // Check if loaded components satisfy this request
          if (
            request.components.every((c) => cachedEntry.components.includes(c))
          ) {
            cachedData[cacheKey] = cachedEntry;
            continue;
          }
        }
        missingData.push(request);
      }
      setResults(
        profileRequests.map(() => ({
          isLoading: true,
        }))
      );
      const promises = missingData.map(async (r) => {
        try {
          const profile = await Platform.Destiny2Service.GetProfile(
            r.membershipType,
            r.membershipId,
            r.components
          );
          return {
            isLoading: false,
            profile,
          };
        } catch (e) {
          return {
            isLoading: false,
            error: e,
          };
        }
      });
      const results = await Promise.all(promises);
      const retrievedData = missingData.reduce((acc, r, i) => {
        if (results[i].profile) {
          const cacheKey = generateProfileCacheKey(
            r.membershipType,
            r.membershipId
          );
          acc[cacheKey] = {
            data: results[i].profile,
            membershipId: r.membershipId,
            membershipType: r.membershipType,
            components: r.components,
            loadedTimestamp: DateTime.now(),
          };
        }
        return acc;
      }, {} as ProfileDataContextType);
      // Update the cache so we don't have to fetch this every time.
      profileDataDispatch((curr) => ({
        ...curr,
        ...cachedData,
        ...retrievedData,
      }));
      setResults(results);
    };
    getData();
  }, [ConfigUtils.SystemStatus(SystemNames.Destiny2), memoizedProfileRequests]);

  return results;
}

/**
 * Gets profile data from a cache for a membership.
 */
export function useProfileData({
  membershipType,
  membershipId,
  components,
  cacheMinutes = DEFAULT_CACHE_DURATION,
}: UseProfileDataRequest) {
  const profileData = useContext(ProfileCacheContext);
  const profileDataDispatch = useContext(ProfileCacheContextDispatch);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [profile, setProfile] = useState<Responses.DestinyProfileResponse>();

  useEffect(() => {
    if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
      throw new Error("Destiny 2 system is not available");
    }
    if (!membershipType || !membershipId) {
      return;
    }
    const cacheKey = generateProfileCacheKey(membershipType, membershipId);
    const cachedEntry = profileData[cacheKey];
    if (
      cachedEntry &&
      DateTime.now().diff(cachedEntry.loadedTimestamp).as("minutes") <
        cacheMinutes
    ) {
      // Check if cache already satisfies this request
      if (components.every((c) => cachedEntry.components.includes(c))) {
        setProfile(cachedEntry.data);
        return;
      }
    }
    const getProfile = async () => {
      setIsLoading(true);
      try {
        const response = await Platform.Destiny2Service.GetProfile(
          membershipType,
          membershipId,
          components
        );
        const cacheKey = generateProfileCacheKey(membershipType, membershipId);
        // Update the global component so we don't have to fetch this every time.
        profileDataDispatch((curr) => ({
          ...curr,
          [cacheKey]: {
            data: response,
            membershipId,
            membershipType,
            components,
            loadedTimestamp: DateTime.now(),
          },
        }));
        setProfile(response);
        setError(undefined);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, [
    ConfigUtils.SystemStatus(SystemNames.Destiny2),
    membershipType,
    membershipId,
    components.join(),
  ]);

  /**
   * Used to reset all the profile data, like if the user logs out.
   */
  const resetProfiles = useCallback(() => {
    profileDataDispatch((_curr) => ({}));
  }, []);

  return {
    profile,
    isLoading,
    error,
    resetProfiles,
  };
}
