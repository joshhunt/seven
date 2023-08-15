// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import "flatpickr/dist/themes/material_blue.css";
import React, { useState } from "react";

interface UserBirthdayOrCountryEditRequest {
  country: string;
  birthday: string;
}

const CountryBirthday: React.FC = () => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [selectedCountry, setSelectedCountry] = useState(
    globalState?.loggedInUser?.countryOfResidence ?? ""
  );
  const [birthday, setBirthday] = useState(
    globalState?.loggedInUser?.birthDate ?? ""
  );

  const handleUpdate = () => {
    const input: UserBirthdayOrCountryEditRequest = {
      country: selectedCountry || "",
      birthday,
    };

    Platform.UserService.EditBirthdayOrCountryAdmin(
      input,
      globalState?.loggedInUser?.user?.membershipId
    )
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  return (
    <div>
      <label>{Localizer.Usertools.Country}</label>
      <input
        name="country"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      />
      <div>
        <label>{Localizer.Usertools.Birthday}</label>
        <input value={birthday} onChange={(e) => setBirthday(e.target.value)} />
      </div>
      <Button
        className="update-button"
        onClick={handleUpdate}
        size={BasicSize.Small}
      >
        {Localizer.Usertools.Update}
      </Button>
    </div>
  );
};

export default CountryBirthday;
