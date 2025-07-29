import { EnumUtils } from "@Utilities/EnumUtils";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Localizer } from "@bungie/localization";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import cookie from "js-cookie";
import { Platform, PnP } from "@Platform";
import {
  AgeCategoriesEnum,
  ChildPermissionEnum,
  ChildPreferenceEnum,
  ResponseStatusEnum,
} from "@Enum";

import { ConvertToPlatformError } from "@ApiIntermediary";

type Child = PnP.GetPlayerContextResponse["assignedChildren"][number];

interface PlayerContextValue {
  playerContext: PnP.GetPlayerContextResponse["playerContext"] | null;
  assignedChildren: Child[] | null;
  loading: boolean;
  error: unknown;
  refreshPlayerContext: () => void;
  pendingChildId: string;
}

const PlayerContextContext = createContext<PlayerContextValue | undefined>(
  undefined
);

export function PlayerContextProvider({
  membershipId,
  children,
}: {
  membershipId: string;
  children: ReactNode;
}) {
  const value = useProvidePlayerContext(membershipId);
  return (
    <PlayerContextContext.Provider value={value}>
      {children}
    </PlayerContextContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContextContext);
  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContextProvider"
    );
  }
  return context;
}

/**
 * Internal hook: fetches and manages the player context state.
 * Called by the Provider, not directly by consumers.
 */
function useProvidePlayerContext(membershipId: string): PlayerContextValue {
  const [playerContext, setPlayerContext] = useState<
    PnP.GetPlayerContextResponse["playerContext"] | null
  >(null);
  const [childrenById, setChildrenById] = useState<Child[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchContext = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Platform.PnpService.GetPlayerContext(membershipId);

      if (res.responseStatus !== ResponseStatusEnum.Success) {
        Modal.error({
          name: ResponseStatusEnum[res.responseStatus],
          message: `${Localizer.errors.UnhandledError} Error: ${
            ResponseStatusEnum[res.responseStatus]
          }`,
        });
      } else {
        setPlayerContext(res.playerContext);
        setChildrenById(res.assignedChildren);
      }
    } catch (err) {
      ConvertToPlatformError(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [membershipId]);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  /**
   * pendingChildId
   * The encoded ID that is being stored in the browser or in a cookie.
   */
  const url = new URL(window.location.href);
  const requestingChildIdfromParam = url.searchParams.get("playerId");
  const childIdCookie = cookie.get("playerId");
  const requestingChildId = childIdCookie ?? requestingChildIdfromParam;
  const hasPendingChild =
    requestingChildId &&
    EnumUtils.looseEquals(
      playerContext?.ageCategory,
      AgeCategoriesEnum.Adult,
      AgeCategoriesEnum
    );

  return {
    playerContext,
    assignedChildren: childrenById?.sort(
      (a, b) =>
        parseInt(a?.parentOrGuardianMembershipId || "0", 10) -
        parseInt(b?.parentOrGuardianMembershipId || "0", 10)
    ),
    loading,
    error,
    refreshPlayerContext: fetchContext,
    pendingChildId: hasPendingChild ? requestingChildId : null,
  };
}

/**
 * Example usage:
 *
 * // Wrap in the parent file:
 * <PlayerContextProvider membershipId="12345">
 *   <App />
 * </PlayerContextProvider>
 *
 * // Then in any child file:
 * function Dashboard() {
 *   const {
 *     playerContext,
 *     assignedChildren,
 *     loading,
 *     error,
 *     refreshPlayerContext,
 *     updatePreferences,
 *     updatePermissions,
 *   } = usePlayerContext();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return (
 *     <div>
 *       <h1>{playerContext.username}'s Dashboard</h1>
 *       {Object.values(assignedChildren || {}).map((child) => (
 *         <ChildSettingsPanel
 *           key={child.membershipId}
 *           child={child}
 *           onSave={(prefs, perms) => {
 *             updatePreferences(child.membershipId, prefs);
 *             updatePermissions(child.membershipId, perms);
 *           }}
 *         />
 *       ))}
 *       <button onClick={refreshPlayerContext}>Reload</button>
 *     </div>
 *   );
 * }
 */
