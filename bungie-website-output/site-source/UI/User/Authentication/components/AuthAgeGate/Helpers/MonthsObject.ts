import { Localizer } from "@bungie/localization";
import { DateTime } from "luxon";

interface MonthsObjectProps {
  label: string;
  value: string;
}

/* Define the month labels. */
const {
  MonthFull1,
  MonthFull2,
  MonthFull3,
  MonthFull4,
  MonthFull5,
  MonthFull6,
  MonthFull7,
  MonthFull8,
  MonthFull9,
  MonthFull10,
  MonthFull11,
  MonthFull12,
} = Localizer.time;

const MONTHS_MAP = [
  MonthFull1,
  MonthFull2,
  MonthFull3,
  MonthFull4,
  MonthFull5,
  MonthFull6,
  MonthFull7,
  MonthFull8,
  MonthFull9,
  MonthFull10,
  MonthFull11,
  MonthFull12,
];

/* Create the object of months with the value being the numeric month vs string label. */
const MonthsObject = MONTHS_MAP.map(
  (month, index): MonthsObjectProps => ({
    label: month,
    value: String(index + 1).padStart(2, "0"), // Ensure single digits have a leading "0"
  })
);

export default MonthsObject;
