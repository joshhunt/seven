import "./polyfills";
import "@Styles/site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const renderApp = () => {
  ReactDOM.hydrate(
    <App />,
    document.getElementById("root"),
    () => setTimeout(() => require("./unhide.scss"), 250) // prevent FOUC
  );
};

renderApp();

if (module.hot) {
  module.hot.accept();
}
