import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { RouteHelper } from "@Routes/RouteHelper";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { Localizer } from "@bungie/localization";
import { PlaytestsApplication } from "./Components/PlaytestsApplication";
import { PlaytestsStatusLoader } from "./Components/PlaytestsStatus";
import { PlaytestsSurveyLoader } from "./Components/PlaytestsSurvey";

interface IPlaytestsAreaProps {
  // Add any props if needed
}

export class PlaytestsArea extends React.Component<IPlaytestsAreaProps> {
  public render() {
    const playtestsTitle = Localizer.Playtests.Title;

    const statusPath = RouteHelper.MarathonPlaytestsStatus().url;
    const surveyPath = RouteHelper.MarathonPlaytestsSurvey().url;

    return (
      <React.Fragment>
        <BungieHelmet
          title={playtestsTitle}
          description={Localizer.Playtests.Description}
        ></BungieHelmet>

        <div
          className="playtests-area"
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <SwitchWithErrors>
            <Route
              path={RouteHelper.MarathonPlaytests().url}
              render={(props) => (
                <PlaytestsApplication
                  {...props}
                  onContinue={() => {
                    props.history.push(surveyPath);
                  }}
                />
              )}
              exact
            />

            {/* Survey route */}
            <Route
              path={surveyPath}
              render={(props) => <PlaytestsSurveyLoader {...props} />}
              exact
            />

            {/* Status route */}
            <Route
              path={statusPath}
              render={(props) => <PlaytestsStatusLoader {...props} />}
              exact
            />
          </SwitchWithErrors>
        </div>
      </React.Fragment>
    );
  }
}
