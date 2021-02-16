// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { CodesDataStore } from "@Areas/Codes/CodesDataStore";
import { BungieMembershipType } from "@Enum";
import { Localizer } from "@Global/Localization/Localizer";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { useDataStore } from "@Utilities/ReactUtils";
import React from "react";
import styles from "./CodesHistoryForm.module.scss";

interface CodesPlatformSelectorProps {
  twoLineItem: React.ReactElement;
}

const _convertMembershipsToOptions = (memberships: BungieMembershipType[]) => {
  const platformOptions: IDropdownOption[] = memberships.map((value) => {
    const membershipString = EnumUtils.getStringValue(
      value,
      BungieMembershipType
    );

    return {
      label: Localizer.Platforms[membershipString],
      value: membershipString,
    };
  });

  return platformOptions;
};

export const CodesPlatformSelector: React.FC<CodesPlatformSelectorProps> = (
  props
) => {
  const codesDatastore = useDataStore(CodesDataStore);

  return (
    <div className={styles.redemptionModal}>
      {props.twoLineItem && props.twoLineItem}
      <p>{Localizer.UserPages.SelectWhichPlatformToApply}</p>
      <Dropdown
        options={_convertMembershipsToOptions(codesDatastore.userMemberships)}
        onChange={(value: keyof typeof BungieMembershipType) => {
          CodesDataStore.actions.updateSelectedMembership(
            BungieMembershipType[value]
          );
        }}
      />
    </div>
  );
};
