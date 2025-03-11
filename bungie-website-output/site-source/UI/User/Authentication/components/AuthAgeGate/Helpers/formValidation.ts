import { DateTime } from "luxon";

/* Validate days/years provided */
export const validateMonthAndDay = (dateStr: string) => {
  const format = "yyyy-MM-dd";
  const date = DateTime.fromFormat(dateStr, format);

  let isValidYear;
  let isValidDay;
  if (date.isValid) {
    const today = DateTime.now();
    const hundredYearsAgo = today.minus({ years: 100 });

    /* The year provided should be less than 100 years ago, less than today */
    if (date && date?.year) {
      isValidYear =
        date.year !== today.year &&
        date.year < today.year - 1 &&
        date.year > hundredYearsAgo.year;
    }

    /* The day provided should be valid for the month that was picked */
    if (date && date?.day) {
      const daysInMonth = DateTime.local(date.year, date.month).daysInMonth;
      isValidDay = date?.day >= 1 || date?.day <= daysInMonth;
    }

    return { isValidDay, isValidYear };
  } else {
    return { isValidDay: true, isValidYear: true };
  }
};

/* Calculate the age, adjust for leap years */
export const computeAge = (dateStr: string) => {
  const format = "yyyy-MM-dd";
  const date = DateTime.fromFormat(dateStr, format);

  if (date.isValid) {
    const today = DateTime.now();
    let adjustedBirthdate = date;

    /* Handle leap year birthdays (Feb 29) */
    if (date.month === 2 && date.day === 29) {
      const currentYearHasFeb29 = DateTime.local(today.year, 2, 29).isValid;
      adjustedBirthdate = date.set({
        year: today.year,
        day: currentYearHasFeb29 ? 29 : 28,
      });
    }

    /* Calculate age */
    let age = today.diff(date, "years").years;

    /* If birthday hasn't occurred yet this year, subtract 1 */
    if (today < adjustedBirthdate) {
      age -= 1;
    }

    return { age: Math.floor(age) };
  }
};
