import { FlowState } from "@UI/User/types/authTypes";

export const GetAuthStepFromCookie = () => {
  const flowCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("bungie_auth_flow="));

  if (flowCookie) {
    try {
      return JSON.parse(
        decodeURIComponent(flowCookie.split("=")[1])
      ) as FlowState;
    } catch (e) {
      return null;
    }
  }
};
