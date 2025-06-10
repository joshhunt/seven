import React, { useEffect } from "react";
import { themes } from "plxp-web-ui/themes/theme";
import { ThemeProvider } from "@mui/material";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { setPendingChildCookie } from "./ParentalControls/lib";
import { PlayerContextProvider } from "@Areas/User/AccountComponents/ParentalControls/lib/usePlayerContext";
import { ParentalControlView } from "./ParentalControls/views";

interface ParentalControlsProps {}

export const ParentalControls: React.FC<ParentalControlsProps> = (props) => {
  const activeThemeName = "bungie-core";
  const theme = themes[activeThemeName];
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    /*If URL includes the invite param, we set the cookie. */
    setPendingChildCookie();
  }, [globalState.loggedInUser]);

  return (
    <ThemeProvider theme={theme}>
      <PlayerContextProvider
        membershipId={globalState?.loggedInUser?.user?.membershipId}
      >
        <ParentalControlView />
      </PlayerContextProvider>
    </ThemeProvider>
  );
};
