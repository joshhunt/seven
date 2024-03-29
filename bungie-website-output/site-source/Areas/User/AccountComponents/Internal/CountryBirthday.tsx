// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformErrorCodes } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Contract, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { useEffect, useState } from "react";
import styles from ".././IdentitySettings.module.scss";

interface UserBirthdayOrCountryEditRequest {
  country: string;
  birthday: string;
}

interface CountryBirthdayProps {
  onPageMembershipId: string;
}

const CountryBirthday: React.FC<CountryBirthdayProps> = (props) => {
  const [countries, setCountries] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [initialCountry, setInitialCountry] = useState<string>(""); // we'll need this to check if the country has changed before updating
  const [birthday, setBirthday] = useState<string>("yyyy-MM-dd");
  const [initialBirthday, setInitialBirthday] = useState<string>(""); // we'll need this to check if the birthday has changed before updating
  const [adminCountryChanges, setAdminCountryChanges] = useState(0);
  const [adminBirthDateChanges, setAdminBirthdateChanges] = useState(0);
  const [isChild, setIsChild] = useState(true);
  const testString =
    "This will delete the country and birthdate values for the user completely.";
  const deleteFieldsEnabled = ConfigUtils.SystemStatus(
    SystemNames.RemoveBirthdayAndCountry
  );
  const countryArray = Object.entries(countries);

  const updateStateWithResponse = (
    data: Contract.UserBirthdayAndCountryResponse
  ) => {
    setIsChild(data.isChild);
    setBirthday(data?.birthday?.slice(0, 10));
    setInitialBirthday(data?.birthday?.slice(0, 10));
    setSelectedCountry(data.country);
    setInitialCountry(data.country);
    setAdminCountryChanges(data.adminCountryChanges);
    setAdminBirthdateChanges(data.adminBirthDateChanges);
  };

  useEffect(() => {
    !!props.onPageMembershipId &&
      props.onPageMembershipId.length > 0 &&
      Platform.UserService.GetUserBirthdayAndCountryAdmin(
        props.onPageMembershipId
      )
        .then((data: any) => {
          updateStateWithResponse(data);
        })
        .catch(ConvertToPlatformError)
        .catch((e: Error) => Modal.error(e));
  }, [props.onPageMembershipId]);

  useEffect(() => {
    Platform.CoreService.GetCountryDisplayNames(false, true)
      .then((data: any) => {
        setCountries(data);
      })
      .catch(ConvertToPlatformError)
      .catch((e: Error) => Modal.error(e));
  }, [props.onPageMembershipId]);

  const handleUpdate = () => {
    if (selectedCountry === initialCountry && birthday === initialBirthday) {
      Modal.open(Localizer.UserTools.NoUpdatesWereMade);

      return;
    }

    const input: UserBirthdayOrCountryEditRequest = {
      country: selectedCountry !== initialCountry ? selectedCountry : "",
      birthday: birthday !== initialBirthday ? birthday : null,
    };

    Platform.UserService.EditBirthdayOrCountryAdmin(
      input,
      props.onPageMembershipId
    )
      .then((response: number) => {
        if (
          EnumUtils.looseEquals(
            response,
            PlatformErrorCodes.Success,
            PlatformErrorCodes
          )
        ) {
          Modal.open(Localizer.clans.ChangesHaveBeenSuccessfully);

          !!props.onPageMembershipId &&
            props.onPageMembershipId.length > 0 &&
            Platform.UserService.GetUserBirthdayAndCountryAdmin(
              props.onPageMembershipId
            )
              .then((data: any) => {
                updateStateWithResponse(data);
              })
              .catch(ConvertToPlatformError)
              .catch((e: Error) => Modal.error(e));
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: Error) => Modal.error(e));
  };

  const handleDelete = () => {
    Platform.UserService.RemoveBirthdayAndCountryAdmin(props.onPageMembershipId)
      .then((response: number) => {
        if (response === 1) {
          Modal.open(Localizer.clans.ChangesHaveBeenSuccessfully);

          !!props.onPageMembershipId &&
            props.onPageMembershipId.length > 0 &&
            Platform.UserService.GetUserBirthdayAndCountryAdmin(
              props.onPageMembershipId
            )
              .then((data: any) => {
                updateStateWithResponse(data);
              })
              .catch(ConvertToPlatformError)
              .catch((e: Error) => Modal.error(e));
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: Error) => Modal.error(e));
  };

  return (
    <div>
      <label>{Localizer.Usertools.Country}</label>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">{Localizer.Usertools.Country}</option>
        {countryArray.map((country: any) => {
          return (
            <option key={country[0]} value={country[0]}>
              {country[1]}
            </option>
          );
        })}
      </select>
      <h4>
        {Localizer.Usertools.NumberOfUpdates}
        <span>{adminCountryChanges ?? 0}</span>
      </h4>
      <div>
        <label>{Localizer.Usertools.Birthday}</label>
        <input
          value={birthday}
          type="date"
          onChange={(e) => setBirthday(e.target.value)}
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
      <div className={styles.buttonContainer}>
        <Button
          className={styles.updateButton}
          onClick={handleUpdate}
          size={BasicSize.Small}
        >
          {Localizer.Usertools.Update}
        </Button>
        {deleteFieldsEnabled && (
          <Button
            className={styles.deleteButton}
            onClick={handleDelete}
            size={BasicSize.Small}
            buttonType={"red"}
          >
            {Localizer.Actions.Delete}
          </Button>
        )}
      </div>
      {deleteFieldsEnabled && <div>{testString}</div>}
    </div>
  );
};

export default CountryBirthday;
