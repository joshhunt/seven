import { useEffect, useState } from "react";
import { Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";

interface CountriesObjectProps {
  label: string | undefined | unknown;
  value: string;
}

/* Grab the countries and return them in the shape that the select will support. */

function UseCountriesObject() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    Platform.CoreService.GetCountryDisplayNames(false, true)
      .then((data: any) => {
        const getCountryOptions = (data: any) => {
          return Object.entries(data).map(
            ([code, name]): CountriesObjectProps => ({
              label: name,
              value: code,
            })
          );
        };

        setCountries(getCountryOptions(data));
      })
      .catch(ConvertToPlatformError)
      .catch((e: Error) => Modal.error(e));
  }, []);

  return countries;
}

export default UseCountriesObject;
