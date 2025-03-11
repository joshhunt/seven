import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Select,
  Checkbox,
  Button,
  TextField,
} from "plxp-web-ui/components/base";
import { DateTime } from "luxon";
import { FormControlLabel } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import * as Globals from "@Enum";
import { AuthUserLogoBlock } from "@UI/User/Authentication/components";
import { Localizer } from "@bungie/localization";
import {
  updateAgeGate,
  goBack,
  selectAgeGateData,
} from "@Global/Redux/slices/authenticationSlice";
import useFlowStateAuthStep from "@UI/User/hooks/useFlowStateAuthStep";
import UseCountriesObject from "./Helpers/useCountriesObject";
import MonthsObject from "./Helpers/MonthsObject";
import { computeAge, validateMonthAndDay } from "./Helpers/formValidation";
import styles from "./AuthAgeGate.module.scss";

/* for some reason the prepend icon is not behaving correctly when supplied 
an icon from a different library
looks fine in storybook with third-party svg, not great in application here. */
interface AuthAgeGateProps {}

interface Birthdate {
  month: number;
  day: number;
  year: number;
}

const AuthAgeGate: FC<AuthAgeGateProps> = ({}) => {
  const dispatch = useDispatch();
  const ageGateData = useSelector(selectAgeGateData);
  const { birthDate, country, isValid } = ageGateData;

  const [year, month, day] = birthDate ? birthDate.split("-") : ["", "", ""];
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false);
  const currentYear = DateTime.now().year;
  const countries = UseCountriesObject();

  /* Handle changes to the territory select. */
  const handleTerritoryChange = (value: string) => {
    dispatch(updateAgeGate({ country: value }));
  };

  /* Handle changes to the birthdate fields. */
  const handleBirthdateChange = (field: keyof Birthdate, value: string) => {
    let updatedBirthdate = birthDate.split("-");

    if (field === "year") updatedBirthdate[0] = value;
    if (field === "month") updatedBirthdate[1] = value.padStart(2, "0"); // Ensure 2 digits for month, per format in user_countrybirthday.ts
    if (field === "day") updatedBirthdate[2] = value.padStart(2, "0"); // Ensure 2 digits for day, per format in user_countrybirthday.ts

    /* Only update the birthdate when it's fully formed */
    const fullBirthdate = updatedBirthdate.join("-");
    const format = "yyyy-MM-dd";
    const date = DateTime.fromFormat(fullBirthdate, format);

    dispatch(
      updateAgeGate({
        birthDate: fullBirthdate,
        isValid:
          date?.isValid &&
          validateMonthAndDay(fullBirthdate)?.isValidDay &&
          validateMonthAndDay(fullBirthdate)?.isValidYear,
        childStatus: computeAge(fullBirthdate)?.age,
      })
    );

    /* Note: Reference use_countrybirthday.ts */
  };

  const {
    IConfirmThatIAmAgeYears,
    PleaseEnterValidBirthday,
    ProvideTerritoryAndBirthDate,
    TerritoryLabel,
    MonthLabel,
    DayLabel,
    YearLabel,
    GoBack,
    Continue,
    DateOfBirthMmDdYyyy,
  } = Localizer.webauth;

  const IConfirmThatIAmAgeYearsLabel = Localizer.Format(
    IConfirmThatIAmAgeYears,
    { age: computeAge(birthDate)?.age }
  );
  const handleSubmit = () => {
    try {
      useFlowStateAuthStep();
    } catch (err) {
      /*		const errorState = handleAuthError(err);
			dispatch(setError(errorState));*/
    }
  };

  const handleBack = () => {
    dispatch(goBack());
  };

  return (
    <>
      <AuthUserLogoBlock
        displayName={"ClarifiedButter"}
        credentialType={Globals.BungieCredentialType.Psnid}
      />
      <Typography
        variant={"body1"}
        sx={{
          marginBottom: "1.75rem",
        }}
      >
        {ProvideTerritoryAndBirthDate}
      </Typography>
      <div className={styles.territoryContainer}>
        <Select
          labelArea={{
            labelString: TerritoryLabel,
          }}
          selectProps={{
            displayEmpty: true,
            placeholder: TerritoryLabel,
            required: true,
            onChange: (e) => handleTerritoryChange(e?.target?.value as string),
            className: styles.territory,
          }}
          menuOptions={countries}
          prependIcon={<LanguageIcon fontSize={"large"} />}
        />
      </div>

      <div className={styles.birthdateElements}>
        <div className={styles.monthContainer}>
          <Typography variant={"body2"} sx={{ marginBottom: "0.25rem" }}>
            {DateOfBirthMmDdYyyy}
          </Typography>
          <Select
            labelArea={{
              labelString: MonthLabel,
              screenReaderOnly: true,
            }}
            selectProps={{
              displayEmpty: true,
              placeholder: MonthLabel,
              required: true,
              onChange: (e) =>
                handleBirthdateChange("month", e?.target?.value as string),
              className: styles.month,
            }}
            menuOptions={MonthsObject}
          />
        </div>
        <div className={styles.dateYearContainer}>
          <TextField
            labelArea={{
              labelString: DayLabel,
              screenReaderOnly: true,
            }}
            inputProps={{
              required: true,
              id: "outlined-required",
              placeholder: DayLabel,
              type: "number",
              onChange: (e) => handleBirthdateChange("day", e?.target?.value),
              name: DayLabel,
              className: styles.date,
              inputProps: {
                min: 1,
                max: 31,
              },
              error:
                day?.length > 0 && month?.length > 0
                  ? !validateMonthAndDay(birthDate)?.isValidDay
                  : false,
            }}
            accessibilityID={DayLabel}
          />

          <TextField
            labelArea={{
              labelString: YearLabel,
              screenReaderOnly: true,
            }}
            inputProps={{
              required: true,
              id: "outlined-required",
              placeholder: YearLabel,
              type: "number",
              onChange: (e) => handleBirthdateChange("year", e?.target?.value),
              name: YearLabel,
              className: styles.year,
              inputProps: {
                min: currentYear - 100,
                max: currentYear,
              },
              error:
                day?.length > 0 && month?.length > 0
                  ? !validateMonthAndDay(birthDate)?.isValidYear
                  : false,
            }}
            accessibilityID={YearLabel}
          />
        </div>
      </div>

      {year && month && day ? (
        <>
          {isValid ? (
            <FormControlLabel
              control={
                <Checkbox
                  required
                  disabled={!isValid}
                  size="small"
                  name={"ageValidation"}
                  onChange={(e) => setAgeConfirmed(e?.target?.checked)}
                />
              }
              label={
                <Typography variant={"caption"}>
                  {IConfirmThatIAmAgeYearsLabel}
                </Typography>
              }
              sx={{
                marginBottom: isValid ? "1.5rem" : 0,
                opacity: isValid ? "1" : 0,
                maxHeight: isValid ? "40px" : "0px",
                height: isValid ? "auto" : "0px",
                transition: "all 0.25s ease-in",
              }}
            />
          ) : (
            <Typography
              variant={"caption"}
              color={"error"}
              sx={{
                marginBottom: "0.25rem",
                textAlign: "center",
              }}
            >
              {PleaseEnterValidBirthday}
            </Typography>
          )}
        </>
      ) : null}

      <Button
        variant={"contained"}
        disabled={!(isValid && country && ageConfirmed)}
        sx={{ marginBottom: "1rem" }}
        onClick={() => handleSubmit()}
      >
        {Continue}
      </Button>
      <Button
        variant={"contained"}
        color={"secondary"}
        onClick={() => handleBack()}
      >
        {GoBack}
      </Button>
    </>
  );
};

export default AuthAgeGate;
