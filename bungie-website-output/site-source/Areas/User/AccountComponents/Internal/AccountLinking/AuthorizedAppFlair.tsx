// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import React from "react";
import { Button } from "../../../../../UI/UIKit/Controls/Button/Button";
import ConfirmationModal from "../../../../../UI/UIKit/Controls/Modal/ConfirmationModal";
import { BasicSize } from "../../../../../UI/UIKit/UIKitUtils";

interface AuthorizedAppFlairProps {
  id: string;
  name: string;
  unlinkedRecently: boolean;
  revoked: boolean;
  error: boolean;
  unlink: (appId: string) => void;
}

export const AuthorizedAppFlair: React.FC<AuthorizedAppFlairProps> = ({
  id,
  name,
  unlink,
  unlinkedRecently,
  revoked,
  error,
}) => {
  if (unlinkedRecently) {
    return <p>{Localizer.friends.successDesc}</p>;
  } else if (error) {
    return <p>{Localizer.Userpages.SomethingWentWrong}</p>;
  } else if (!revoked) {
    return (
      <Button
        buttonType={"red"}
        size={BasicSize.Small}
        onClick={() =>
          ConfirmationModal.show({
            children: (
              <p>
                {Localizer.Format(Localizer.AccountLinking.UnlinkWarning, {
                  appName: name,
                })}
              </p>
            ),
            title: Localizer.accountLinking.unlinkApplication,
            type: "warning",
            cancelButtonProps: {
              buttonType: "white",
              labelOverride: Localizer.AccountLinking.Nevermind,
            },
            confirmButtonProps: {
              buttonType: "gold",
              onClick: () => {
                unlink(id);

                return true;
              },
            },
          })
        }
      >
        {Localizer.Userpages.Unlink}
      </Button>
    );
  } else {
    return null;
  }
};
