import { ResponsiveDataStore } from "@bungie/responsive";
import { createContext } from "react";

export const Responsive = new ResponsiveDataStore();

export const ResponsiveContext = createContext(Responsive.state);
