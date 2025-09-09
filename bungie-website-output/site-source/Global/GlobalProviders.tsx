import React from "react";
import { PropsWithChildren } from "react";
import { GameDataProvider } from "./Context/GameDataProvider";
import { ProfileDataProvider } from "./Context/ProfileDataProvider";
import { UserProvider } from "./Context/UserProvider";

export function GlobalProviders({ children }: PropsWithChildren<unknown>) {
  return (
    <GameDataProvider>
      <ProfileDataProvider>
        <UserProvider>{children}</UserProvider>
      </ProfileDataProvider>
    </GameDataProvider>
  );
}
