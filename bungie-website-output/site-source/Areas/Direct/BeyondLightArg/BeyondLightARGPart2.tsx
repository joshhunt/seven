// tslint:disable: jsx-use-translation-function

import { BeyondLightArgSelfTyper } from "@Areas/Direct/BeyondLightArg/BeyondLightArgSelfTyper";
import { ArgData } from "@Areas/Direct/BeyondLightArg/BeyondLightArgUtils";
import { useDataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Img } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "./BeyondLightARG.module.scss";

const pad = (str: string | number) => String(str).padStart(2, "0");

interface Part2Props {
  data: ArgData | null;
}

export const BeyondLightARGPart2: React.FC<Part2Props> = ({ data }) => {
  const [showing, setShowing] = useState(false);
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

  const pathTemplate = ConfigUtils.GetParameter(
    "DestinyArg",
    "ArgImageUrlTemplate",
    "[[REPLACE_ME]]"
  );
  const imagePath = pathTemplate.replace("[[REPLACE_ME]]", data.Image);

  return (
    <div className={styles.part2wrapper}>
      <div>
        <BeyondLightArgSelfTyper delayAtStart={1000}>
          Remote archive database classified search initiated.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={3000}>
          Welcome, User $nullStringRef.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={5000}>
          Analyzing…
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={7000}>
          Analyzing…
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={9000}>
          Files found are corrupted or heavily encrypted.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={11000}>
          Would you like to attempt decryption process?
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={13000}>
          //input received/"yes"
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={15000}>
          Initiating…
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={17000}>
          Decrypting…
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={19000}>
          Sequence data fragment found.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={21000}>
          Display fragment?
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={23000}>
          //input received/"yes"
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper
          delayAtStart={25000}
          onComplete={() => setShowing(true)}
        >
          Displaying…
        </BeyondLightArgSelfTyper>
        <div className={classNames(styles.image, { [styles.show]: showing })}>
          <img src={imagePath} alt={data.Image} />
        </div>
        <BeyondLightArgSelfTyper delayAtStart={27000}>
          ALERT: There may be additional SEQ data at other locations.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={29000}>
          Attempt further analysis?
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={31000}>
          //input received/"yes"
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={33000}>
          ERROR: Access denied. Data stream corrupted. Observer locked out.
        </BeyondLightArgSelfTyper>
        <BeyondLightArgSelfTyper delayAtStart={35000}>
          ALERT: OBSERVER VIOLATION DETECTED. 24 HOUR LOCK-OUT INITIATED. NEW
          ACCESS ID REQUIRED.
        </BeyondLightArgSelfTyper>
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
