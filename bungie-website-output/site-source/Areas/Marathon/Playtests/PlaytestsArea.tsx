import * as React from "react";
import { Route } from "react-router-dom";
import { RouteHelper } from "@Routes/RouteHelper";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { PlaytestsGate } from "./Components/PlaytestsGate";
import pageStyles from "./PlaytestsPage.module.scss";
import { Img } from "@Helpers";

interface IPlaytestsAreaProps {
  // Add any props if needed
}

export class PlaytestsArea extends React.Component<IPlaytestsAreaProps> {
  public render() {
    const playtestsTitle = "Marathon Technical Test";

    return (
      <React.Fragment>
        <BungieHelmet
          title={playtestsTitle}
          description={"Playtest hub page for Bungie's Marathon Playtests"}
        >
          <body className={pageStyles.body} />
        </BungieHelmet>
        <div className={pageStyles.header}>
          <img src={Img("/marathon/logos/marathon_logo_splash_reversed.jpg")} />
        </div>
        <div className={pageStyles.page}>
          <SwitchWithErrors>
            <Route
              path={RouteHelper.MarathonPlaytests().url}
              component={PlaytestsGate}
              exact
            />
          </SwitchWithErrors>
        </div>
      </React.Fragment>
    );
  }
}
