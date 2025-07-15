import "@Styles/site.scss";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { App } from "./App";
import "./polyfills";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container!);
root.render(<App />);
