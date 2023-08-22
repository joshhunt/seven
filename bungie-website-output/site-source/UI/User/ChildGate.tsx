// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { CompanionPermission } from "@Enum";
import { Platform } from "@Platform";
import React, { useEffect, useState } from "react";

interface ChildGateProps {
  childMessageClassName?: string;
}

export const ChildGate: React.FC<ChildGateProps> = (props) => {
  const [isChild, setIsChild] = useState(false);

  useEffect(() => {
    Platform.CompanionpermissionService.GetPermission(
      CompanionPermission.NotAChild
    ).then((result) => {
      setIsChild(!result);
    });
  }, []);

  return (
    <>
      {isChild ? (
        <p className={props.childMessageClassName}>
          {Localizer.Format(Localizer.Userpages.Settingsarenotavailable, {
            BungieHelpLink: Localizer.destiny.ServiceOfflinePage_HelpLinkText,
          })}
        </p>
      ) : (
        props.children
      )}
    </>
  );
};
