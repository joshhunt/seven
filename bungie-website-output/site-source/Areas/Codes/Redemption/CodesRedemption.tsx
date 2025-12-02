import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { usePrevious } from "@Utilities/ReactUtils";
import React, { useEffect } from "react";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import CodesRedemptionForm from "./CodesRedemptionForm";
import { UserUtils } from "@Utilities/UserUtils";
import { CodesDataStore } from "../CodesDataStore";

interface ICodesRedemptionProps
  extends GlobalStateComponentProps<"loggedInUser"> {}

/**
 * CodesRedemption - Replace this description
 *  *
 * @param {ICodesRedemptionProps} props
 * @returns
 */
export const CodesRedemption: React.FC<ICodesRedemptionProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const prevGlobalState = usePrevious(globalState);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      const userIsCrossSaved = !!globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
      GlobalStateDataStore?.actions?.refreshCurrentUser(true);
    }
  }, []);

  useEffect(() => {
    const wasAuthed = UserUtils.isAuthenticated(prevGlobalState);
    const isNowAuthed = UserUtils.isAuthenticated(globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      const userIsCrossSaved = !!globalState?.loggedInUser
        ?.crossSaveCredentialTypes?.length;

      CodesDataStore.initialize(userIsCrossSaved);
    }
  }, [globalState]);

  return (
    <RequiresAuth>
      <CodesRedemptionForm />
    </RequiresAuth>
  );
};
