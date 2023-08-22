// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { Contract, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import "flatpickr/dist/themes/material_blue.css";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

interface UserBirthdayOrCountryEditRequest {
  country: string;
  birthday: string;
}

interface CountryBirthdayProps {
  onPageMembershipId: string;
}

const CountryBirthday: React.FC<CountryBirthdayProps> = (props) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [birthday, setBirthday] = useState<DateTime>(null);
  const [adminCountryChanges, setAdminCountryChanges] = useState(0);
  const [adminBirthDateChanges, setAdminBirthdateChanges] = useState(0);
  const [isChild, setIsChild] = useState(true);

  const updateStateWithResponse = (
    data: Contract.UserBirthdayAndCountryResponse
  ) => {
    setIsChild(data.isChild);
    setBirthday(DateTime.fromISO(data.birthday));
    setSelectedCountry(data.country);
    setAdminCountryChanges(data.adminCountryChanges);
    setAdminBirthdateChanges(data.adminBirthDateChanges);
  };

  useEffect(() => {
    !!props.onPageMembershipId &&
      props.onPageMembershipId.length > 0 &&
      Platform.UserService.GetUserBirthdayAndCountryAdmin(
        props.onPageMembershipId
      )
        .then((data) => {
          updateStateWithResponse(data);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
  }, [props.onPageMembershipId]);

  const handleUpdate = () => {
    const input: UserBirthdayOrCountryEditRequest = {
      country: selectedCountry,
      birthday: birthday.toISODate(),
    };

    Platform.UserService.EditBirthdayOrCountryAdmin(
      input,
      props.onPageMembershipId
    )
      .then((response) => {
        if (response === 0) {
          Modal.open(Localizer.awa.ItemActionSuccess);

          !!props.onPageMembershipId &&
            props.onPageMembershipId.length > 0 &&
            Platform.UserService.GetUserBirthdayAndCountryAdmin(
              props.onPageMembershipId
            )
              .then((data) => {
                updateStateWithResponse(data);
              })
              .catch(ConvertToPlatformError)
              .catch((e) => Modal.error(e));
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: Error) => Modal.error(e));
  };

  return (
    <div>
      <label>{Localizer.Usertools.Country}</label>
      <input
        name="country"
        value={selectedCountry}
        type="text"
        placeholder={Localizer.Usertools.PlaceholderForCountry}
        onChange={(e) => setSelectedCountry(e.target.value.toUpperCase())}
      />
      <h4>
        {Localizer.Usertools.NumberOfUpdates}
        <span>{adminCountryChanges ?? 0}</span>
      </h4>
      <div>
        <label>{Localizer.Usertools.Birthday}</label>
        <input
          value={
            birthday && birthday.isValid
              ? birthday.toISODate()
              : Localizer.WebAuth.PleaseEnterValidBirthday
          }
          type="date"
          onChange={(e) => setBirthday(DateTime.fromISO(e.target.value))}
        />
        <h4>
          {Localizer.Usertools.NumberOfUpdates}
          <span>{adminBirthDateChanges ?? 0}</span>
        </h4>
        {isChild ? (
          <p>{Localizer.Usertools.IsChild}</p>
        ) : (
          <p>{Localizer.Usertools.IsNotChild}</p>
        )}
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
