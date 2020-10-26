// tslint:disable: jsx-use-translation-function

import { BeyondLightArgSelfTyper } from "@Areas/Direct/BeyondLightArg/BeyondLightArgSelfTyper";
import { ArgData } from "@Areas/Direct/BeyondLightArg/BeyondLightArgUtils";
import { useDataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Img } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "./BeyondLightARG.module.scss";

const pad = (str: string | number) => String(str).padStart(2, "0");

interface Part2Props {
  data: ArgData | null;
}

export const BeyondLightARGPart2: React.FC<Part2Props> = ({ data }) => {
  const timerDateString = ConfigUtils.GetParameter(
    "DestinyArg",
    "PuzzleGateDate",
    ""
  );
  if (!timerDateString) {
    throw new Error("Fatal Error // Timer not present");
  }

  const releaseGateDate = moment(timerDateString);
  const now = moment();
  const gated = now.isBefore(releaseGateDate);
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  if (gated) {
    return <Timer releaseGateDate={releaseGateDate} />;
  }

  if (!data.Image) {
    return (
      <div className={styles.part2wrapper}>
        <div className={styles.exception}>
          <BeyondLightArgSelfTyper>
            FAILURE // Analysis successful. Unknown error occured. Contact
            system architect.
          </BeyondLightArgSelfTyper>
        </div>
      </div>
    );
  }

  const imagePath = Img(`destiny/bgs/bl_arg/${data.Image}.gif`);

  return (
    <div className={styles.part2wrapper}>
      <div>
        <BeyondLightArgSelfTyper delayAtStart={2000}>
          ANALYZE // User {loggedInUser.user.membershipId} access granted.
          Analysis complete.
        </BeyondLightArgSelfTyper>
      </div>
      <div className={styles.image}>
        <img src={imagePath} alt={data.Image} />
      </div>
    </div>
  );
};

interface TimerProps {
  releaseGateDate: moment.Moment;
}

const Timer: React.FC<TimerProps> = ({ releaseGateDate }) => {
  const [now, setNow] = useState(moment());

  useEffect(() => {
    setTimeout(() => setNow(moment()), 1000);
  }, [now]);

  const diff = releaseGateDate.diff(now);
  const duration = moment.duration(diff);
  const timer = {
    days: duration.days() === 0 ? duration.months() * 31 : duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  } as const;

  const timeRemaining = `${pad(timer.days)}:${pad(timer.hours)}:${pad(
    timer.minutes
  )}:${pad(timer.seconds)}`;

  return (
    <div className={styles.part2wrapper}>
      <div className={styles.timer}>
        {timeRemaining.split("").map((val, i) => (
          <span key={i} className={val === ":" ? styles.colon : undefined}>
            {val}
          </span>
        ))}
      </div>
      <div className={styles.bottomLabel}>
        <BeyondLightArgSelfTyper delayAtStart={2000}>
          ANALYZING // Analysis in progress...
        </BeyondLightArgSelfTyper>
      </div>
    </div>
  );
};
