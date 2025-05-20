import React, { useState, useEffect, Fragment } from "react";
import { Button } from "plxp-web-ui/components/base";
import { themes } from "plxp-web-ui/themes/theme";
import { ThemeProvider } from "@mui/material";
import { ChildView, TeenView, ParentView } from "./ParentalControls/views";
import {
  // new
  PARENT_WITH_ASSIGNED_CHILDREN,
  PARENT_WITH_NO_ASSIGNED_CHILDREN,
  EXAMPLE_CHILD_WITH_ADULT,
  EXAMPLE_CHILD_WITHOUT_ADULT,
} from "@Areas/User/AccountComponents/ParentalControls/MOCK_DATA";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { setPendingChildCookie } from "./ParentalControls/utils";
import { useHistory } from "react-router-dom";

interface ParentalControlsProps {}

/**
 * Parental Controls - Settings page in User Account Center with displayName, avatar and theme
 *  *
 * @param {ParentalControlsProps} props
 * @returns
 */
/**
 * ============================
 * TO DOS:
 * Typing!
 * Kill off Mock data
 * Hook up real info
 * ============================
 * **/

export const ParentalControls: React.FC<ParentalControlsProps> = (props) => {
  const activeThemeName = "bungie-core";
  const theme = themes[activeThemeName];
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  /*  const { playerContext, assignedChildren, error, loading } = usePlayerContext();*/

  useEffect(() => {
    /*If URL includes the invite param, we set the cookie. */
    setPendingChildCookie();
  }, [globalState.loggedInUser]);

  /* TODO: When pulling PlayerContext, the "ageCategory" will determine the view they see.
   *   The category should replace all logic set by the userJourney items
   *   ageCategory:
   *   1 Child
   *   2 Teen
   *   3 Adult
   *  In the event that there is NO USER DATA when hitting the API, we probably want a message instead of rendering anything.
   * */

  /* PLACEHOLDER FOR TESTING VIEWS BEGIN*/
  const [userJourney, setUserJourney] = useState({ path: null });
  const path = RouteHelper.ParentalControlsWithId("1010101");

  const history = useHistory();
  const setPendingState = () => {
    history.push(path);
    setUserJourney({ path: "guardianPending" });
  };

  const setClearState = () => {
    //history.push(`/en/User/Account/ParentalControls`)
    setUserJourney({ path: null });
  };
  /* PLACEHOLDER FOR TESTING VIEWS END*/

  /*    const renderByAgeCategory = (playerContext) => {
        switch (playerContext.ageCategory) {
            case 1:
                return <ChildView childAccount={playerContext}/>
            case 2:
                return <TeenView/>;
            case 3:
                return <ParentView parentAccount={{...playerContext, ...assignedChildren}} />;
            default:
                return null;
        }
    };*/

  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" onClick={() => setClearState()}>
        Reset
      </Button>

      {!userJourney?.path && (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <p style={{ maxWidth: "80%", margin: "0 auto", textAlign: "center" }}>
            This is a placeholder for the Parental Controls views - select if
            you are a Guardian or Child below to see the views. Just refresh the
            page to reset your state!
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => setUserJourney({ path: "childWith" })}
            >
              Child with Guardian
            </Button>
            <Button
              variant="contained"
              onClick={() => setUserJourney({ path: "childWithout" })}
            >
              Child without Guardian
            </Button>
            <Button
              variant="contained"
              onClick={() => setUserJourney({ path: "guardianWith" })}
            >
              Guardian with Children
            </Button>
            <Button variant="contained" onClick={() => setPendingState()}>
              Guardian with Pending States
            </Button>
            <Button
              variant="contained"
              onClick={() => setUserJourney({ path: "guardianWithout" })}
            >
              Guardian with no Children
            </Button>
            <Button
              variant="contained"
              onClick={() => setUserJourney({ path: "teen" })}
            >
              Teen
            </Button>
          </div>
        </div>
      )}
      {/* This Switch Case will be refined when player data is present to just feature Child, Teen, and Adult */}
      {/*PlayerContext - 1 = child, 2 = teen, 3 = addy*/}
      {Object?.values(userJourney)?.map(
        (type, i) =>
          type && (
            <Fragment key={i}>
              {(() => {
                switch (type) {
                  case "childWith":
                    return (
                      <ChildView childAccount={EXAMPLE_CHILD_WITH_ADULT} />
                    );
                  case "childWithout":
                    return (
                      <ChildView childAccount={EXAMPLE_CHILD_WITHOUT_ADULT} />
                    );
                  case "guardianWith":
                    return (
                      <ParentView
                        parentAccount={PARENT_WITH_ASSIGNED_CHILDREN}
                      />
                    );
                  case "guardianPending":
                    return (
                      <ParentView
                        parentAccount={PARENT_WITH_NO_ASSIGNED_CHILDREN}
                      />
                    );
                  case "guardianWithout":
                    return (
                      <ParentView
                        parentAccount={PARENT_WITH_NO_ASSIGNED_CHILDREN}
                      />
                    );
                  case "teen":
                    return <TeenView />;
                  default:
                    return "";
                }
              })()}

              {/*
                        {renderByAgeCategory(data)}
                    */}
            </Fragment>
          )
      )}
    </ThemeProvider>
  );
};
