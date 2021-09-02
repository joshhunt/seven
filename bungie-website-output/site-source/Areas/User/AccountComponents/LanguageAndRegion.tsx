// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform, User } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { Grid, GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import React, { useContext, useEffect, useState } from "react";
import accountStyles from "../Account.module.scss";

interface LanguageAndRegionProps {}

export const LanguageAndRegion: React.FC<LanguageAndRegionProps> = (props) => {
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const [onPageUser, setOnPageUser] = useState<User.GeneralUser>();
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [selectedLocale, setSelectedLocale] = useState(
    onPageUser?.locale ?? "en"
  );
  const [inherit, setInherit] = useState(
    onPageUser?.localeInheritDefault ?? true
  );

  useEffect(() => {
    setSelectedLocale(onPageUser?.locale ?? "en");
  }, [onPageUser]);

  useEffect(() => {
    setInherit(onPageUser?.localeInheritDefault ?? true);
  }, [onPageUser]);

  useEffect(() => {
    updateSettings();
  }, [selectedLocale, inherit]);

  useEffect(() => {
    if (isSelf) {
      setOnPageUser(loggedInUser.user);
    } else if (isAdmin) {
      Platform.UserService.GetMembershipDataById(
        membershipIdFromQuery,
        BungieMembershipType.BungieNext
      )
        .then((data) => {
          setOnPageUser(data.bungieNetUser);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
    }
  }, [membershipIdFromQuery, isSelf, loggedInUserId]);

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
  const updateSettings = () => {
    if (isSelf) {
      const request: Contract.UserEditRequest = {
        membershipId: loggedInUser.user.membershipId,
        displayName: null,
        about: null,
        emailAddress: null,
        locale: selectedLocale,
        localeInheritDefault: inherit,
        statusText: null,
      };

      Platform.UserService.UpdateUser(request)
        .then(() => {
          GlobalStateDataStore.actions
            .refreshCurrentUser(true)
            .promise.then(showSettingsChangedToast);
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

  return onPageUser ? (
    <div>
      <GridCol cols={12}>
        <h3>{Localizer.account.languageRegion}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        <Dropdown
          options={dropdownOptions}
          selectedValue={onPageUser?.locale}
          onChange={setSelectedLocale}
        />

        <Checkbox
          checked={onPageUser?.localeInheritDefault}
          label={Localizer.HelpText.ToggleDisplayUntranslated}
          disabled={onPageUser?.locale === "en"}
          onChange={(e) => setInherit(e.target.checked)}
        />
      </GridCol>
    </div>
  ) : null;
};
