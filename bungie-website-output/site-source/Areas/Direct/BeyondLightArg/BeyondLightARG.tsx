// Created by jlauer, 2020
// Copyright Bungie, Inc.
// tslint:disable: jsx-use-translation-function

import { BeyondLightARGPart2 } from "@Areas/Direct/BeyondLightArg/BeyondLightARGPart2";
import { BeyondLightArgSelfTyper } from "@Areas/Direct/BeyondLightArg/BeyondLightArgSelfTyper";
import {
  ArgData,
  BeyondLightArgUtils,
} from "@Areas/Direct/BeyondLightArg/BeyondLightArgUtils";
import { Img } from "@Helpers";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import styles from "./BeyondLightARG.module.scss";

interface BeyondLightARGProps {}

let animationId: number | null = null;

const BeyondLightARG: React.FC<BeyondLightARGProps> = () => {
  const [value, setValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [valid, setValid] = useState(undefined);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [argData, setArgData] = useState<ArgData | null>(null);
  const inputRef = useRef<HTMLInputElement>();

  const updateVal = (newValue: string) => {
    if (valid) {
      return;
    }

    setValue(newValue);
    clearStatus();
  };

  const clearStatus = () => {
    setValid(undefined);
    setArgData(null);
  };

  const submit = async () => {
    if (StringUtils.isNullOrWhiteSpace(value)) {
      return;
    }

    setButtonDisabled(true);

    setTimeout(async () => {
      updateVal("");

      const upperValue = value.toUpperCase();

      const hash = await BeyondLightArgUtils.hash(upperValue);
      try {
        const result = await BeyondLightArgUtils.doFetch(hash, upperValue);
        setArgData(result);

        const isValid = !result.Exception;
        setValid(isValid);

        if (isValid) {
          inputRef.current?.blur();
        } else {
          setDisplayValue("");
          setButtonDisabled(false);
        }
      } catch (e) {
        setButtonDisabled(false);

        Modal.error(e);
      }
    }, 2000);
  };

  // randomize letters
  useEffect(() => {
    cancelAnimationFrame(animationId);

    if (valid) {
      return;
    }

    const animate = () => {
      const letters = BeyondLightArgUtils.getRandomLetters(12 - value.length);
      setDisplayValue(value + letters);

      animationId = requestAnimationFrame(animate);
    };
    animate();
  }, [value, valid]);

  // note - `valid` is boolean|null, which is why this looks weird.
  const bodyClass = classNames(
    SpecialBodyClasses(BodyClasses.NoSpacer | BodyClasses.HideServiceAlert),
    {
      [styles.valid]: valid === true,
      [styles.invalid]: valid === false,
    }
  );

  return (
    <SystemDisabledHandler systems={["DestinyArg"]}>
      <div
        className={styles.argWrapper}
        onClick={() => inputRef.current?.focus()}
        role={"button"}
      >
        <BungieHelmet>
          <body className={bodyClass} />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
            rel="stylesheet"
          />
        </BungieHelmet>
        <div className={styles.bgWrapper}>
          <video muted autoPlay loop src={Img("destiny/videos/analyze.mp4")} />
        </div>
        <div className={styles.inputWrapper}>
          {argData?.Exception ? (
            <>
              <div className={styles.exception}>
                <BeyondLightArgSelfTyper>
                  FAILURE // {argData?.Exception}
                </BeyondLightArgSelfTyper>
              </div>
              <div className={styles.buttonWrap}>
                <Button onClick={clearStatus}>Reset</Button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.innerInputWrapper}>
                <input
                  style={{ display: buttonDisabled ? "none" : "block" }}
                  type={"text"}
                  className={styles.fakeInput}
                  value={displayValue}
                />
                <input
                  autoFocus
                  ref={inputRef}
                  maxLength={12}
                  type={"text"}
                  className={styles.input}
                  placeholder={""}
                  onKeyDown={(e) => e.which === 13 && submit()}
                  onChange={(e) => updateVal(e.currentTarget.value)}
                />
              </div>
              <div className={styles.buttonWrap}>
                <Button
                  onClick={submit}
                  disabled={buttonDisabled}
                  loading={buttonDisabled}
                >
                  Analyze
                </Button>
              </div>
              <div className={styles.typer}>
                {buttonDisabled && (
                  <BeyondLightArgSelfTyper>
                    ANALYZE // Authenticating...
                  </BeyondLightArgSelfTyper>
                )}
              </div>
            </>
          )}
        </div>

        {valid && <BeyondLightARGPart2 data={argData} />}
      </div>
    </SystemDisabledHandler>
  );
};

export default BeyondLightARG;
