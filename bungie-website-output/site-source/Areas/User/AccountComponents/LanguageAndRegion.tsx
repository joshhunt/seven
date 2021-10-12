// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import React, { useContext, useEffect, useState } from "react";
import accountStyles from "../Account.module.scss";

interface LanguageAndRegionProps {}

export const LanguageAndRegion: React.FC<LanguageAndRegionProps> = (props) => {
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [selectedLocale, setSelectedLocale] = useState("");
  const [inherit, setInherit] = useState(true);
  const localeOnRender = loggedInUser?.user?.locale ?? "en";

  useEffect(() => {
    if (isAdmin) {
      Platform.UserService.GetMembershipDataById(
        membershipIdFromQuery,
        BungieMembershipType.BungieNext
      )
        .then((data) => {
          setSelectedLocale(data.bungieNetUser?.locale ?? "en");
          setInherit(data.bungieNetUser?.localeInheritDefault ?? true);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
    } else {
      setSelectedLocale(localeOnRender);
      setInherit(loggedInUser?.user?.localeInheritDefault ?? true);
    }
  }, [membershipIdFromQuery, isSelf, isAdmin, loggedInUserId]);

  const dropdownOptions: IDropdownOption[] = Localizer.validLocales.map(
    (locale) => ({
      label: Localizer.Languages[locale.locKey],
      value: locale.name,
    })
  );

  if (!loggedInUser) {
    return null;
  }

  /* Functions */
  const updateSettings = (
    newLocale: string = selectedLocale,
    newLocaleInherit: boolean = inherit
  ) => {
    if (
      (isSelf && newLocale !== (loggedInUser?.user?.locale ?? "en")) ||
      newLocaleInherit !== inherit
    ) {
      const request: Contract.UserEditRequest = {
        membershipId: loggedInUser.user.membershipId,
        displayName: null,
        about: null,
        emailAddress: null,
        locale: newLocale,
        localeInheritDefault: newLocaleInherit,
        statusText: null,
      };

      Platform.UserService.UpdateUser(request)
        .then(() => {
          GlobalStateDataStore.actions
            .refreshCurrentUser(true)
            .async.then(showSettingsChangedToast);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
    }
  };

  const showSettingsChangedToast = () => {
    Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
      position: "br",
    });
  };

  return (
    <div>
      <GridCol cols={12}>
        <h3>{Localizer.account.languageRegion}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        <Dropdown
          options={dropdownOptions}
          onChange={(value: string) => {
            setSelectedLocale(value);
            updateSettings(value);
          }}
          selectedValue={selectedLocale}
        />

        <Checkbox
          checked={inherit}
          label={Localizer.HelpText.ToggleDisplayUntranslated}
          disabled={selectedLocale === "en"}
          onChecked={(checked: boolean) => {
            setInherit(checked);
            updateSettings(selectedLocale, checked);
          }}
        />
      </GridCol>
    </div>
  );
};
