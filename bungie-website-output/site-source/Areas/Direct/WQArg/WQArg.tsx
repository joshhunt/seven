// Created by a-bphillips, 2022
// Copyright Bungie, Inc.
// tslint:disable: jsx-use-translation-function

import { BeyondLightArgSelfTyper } from "@Areas/Direct/BeyondLightArg/BeyondLightArgSelfTyper";
import {
  ArgData,
  BeyondLightArgUtils,
} from "@Areas/Direct/BeyondLightArg/BeyondLightArgUtils";
import { Responsive } from "@Boot/Responsive";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConfigUtils } from "../../../Utilities/ConfigUtils";
import styles from "./WQArg.module.scss";

interface WQArgProps {}

const bgImg = "/7/ca/destiny/bgs/wq_arg/ce_bg.jpg";
const fxBorderImg = "/7/ca/destiny/bgs/wq_arg/ce_bg_screen_fx_border.png";
const logoImg = "/7/ca/destiny/bgs/wq_arg/ce_logo.png";

// yes this typo is also in the file name.
const screenImg = "/7/ca/destiny/bgs/wq_arg/ce_sreen.png";
const grainVideo = "/7/ca/destiny/bgs/wq_arg/ce_grain.mp4";
const bgRed = "/7/ca/destiny/bgs/wq_arg/ce_bg_red.jpg";
const terminalBg = "/7/ca/destiny/bgs/wq_arg/ce_bg_terminal.jpg";

const title = "DESTINY 2 THE WITCH QUEEN | COLLECTOR’S EDITION";
const submitBtnText = "SUBMIT";

const word = "Choose";
const ErrorWord = "ERROR";

const validPasswordLines = [
  "//AUTHENTICATION/security token recognized.",
  "Welcome, User ERROR/$$ROOTUSER",
  '//input received/"Redir Sanitation"',
  "Accessing...",
  "Welcome to Vanguard Automated Sanitation Service.",
  '//input received/"search IKO-006"',
  "Retrieving...",
  "(1) items found=IKO-006-XX750210p",
  "STATUS=collect#COMPLETE",
  "STATUS=shred#COMPLETE",
  "STATUS=incinerate#PENDING",
  '//input received/"Cancel incinerate"',
  "Processing...",
  "ERROR: You have insufficient permissions for this task.",
  '//input received/"Reroute IKO-006-XX750210p"',
  "Processing...",
  "ERROR: You have insufficient permissions for this task.",
  '//input received/"Append IKO-006-XX750210p : UnknownHazard"',
  "Processing...",
  "PRIORITY.",
  "Sample of IKO-006-XX750210p rerouted to ERROR for Hazardous Material Analysis.",
  "{{INSERT IMAGE}}",
  '//input received/"Hold IKO-006-XX750210p"',
  "Processing...",
  "ERROR: You have insufficient permissions for this task.",
  "ALERT: THIS ACCOUNT HAS PERFORMED TOO MANY ILLEGAL REQUESTS. 24 HOUR LOCK-OUT INITIATED.",
];

const WQArg: React.FC<WQArgProps> = (props) => {
  const [focusedInput, setFocusedInput] = useState(0);
  const inputRefs = useRef<Record<number, HTMLInputElement>>({});
  const [inputValues, setInputValues] = useState<string[]>(
    Array(word.length).fill("")
  );
  const [eleTransforms, setEleTransforms] = useState({
    logo: "",
    fx: "",
    grid: "",
  });
  const [argData, setArgData] = useState<ArgData | null>(null);
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isTypingErrPhrase, setIsTypingErrPhrase] = useState(false);
  const [hideWarningText, setHideWarningText] = useState(false);

  useEffect(() => {
    if (!Responsive.state.mobile) {
      document.addEventListener("mousemove", handleMouseMove);

      return cleanup;
    }
  }, []);

  const cleanup = () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRefs.current?.[focusedInput]?.focus();
    });
  }, [focusedInput]);

  useEffect(() => {
    if (!isInputValid) {
      setTimeout(() => {
        setIsTypingErrPhrase(true);
      }, 1000);

      setTimeout(() => {
        setInputsDisabled(false);
        setIsInputValid(true);
      }, 4000);
    }
  }, [isInputValid]);

  useEffect(() => {
    if (isTypingErrPhrase) {
      // generate error phrase to display in input fields
      const errPhrase = Array(inputValues.length)
        .fill("")
        .map((_, i) => ErrorWord[i] || "7");

      // find next letter in user's input to be replaced with letter from error phrase
      const nextChar = inputValues.findIndex(
        (v, i) => v.toLowerCase() !== errPhrase[i].toLowerCase()
      );

      if (nextChar === -1) {
        setIsTypingErrPhrase(false);
        setFocusedInput(5);
      } else {
        const newInput = [...inputValues];
        newInput[nextChar] = errPhrase[nextChar];

        setTimeout(() => {
          setInputValues(newInput);
        }, 250);
      }
    }
  }, [isTypingErrPhrase, inputValues]);

  useEffect(() => {
    if (argData?.Exception) {
      setTimeout(() => {
        setHideWarningText(true);

        setTimeout(() => {
          setArgData(null);
          setHideWarningText(false);
        }, 500);
      }, (argData?.Exception?.split("~").length ?? 0) * 2000 + 4000);
    }
  }, [argData]);

  const handleMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      // get transform strings for each element
      const logo = getParallaxTransform(e, 1);
      const fx = getParallaxTransform(e, 2);
      const grid = getParallaxTransform(e, 3);

      setEleTransforms({ logo, fx, grid });
    });
  };

  const getParallaxTransform = (e: MouseEvent, factor: number) => {
    const { clientY, clientX } = e;

    // mid points of viewport
    const viewMidX = document.body.clientWidth / 2;
    const viewMidY = window.innerHeight / 2;

    const offsetX = clientX - viewMidX;
    const offsetY = viewMidY - clientY;

    // base amount of pixels to move element per px mouse is moved
    const baseParallax = 0.01;

    return `translate(${offsetX * baseParallax * factor * -1}px, ${
      offsetY * factor * baseParallax
    }px)`;
  };

  const handleInputChange = (index: number, value: any) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;

    setInputValues(newInputValues);
  };

  const submit = async () => {
    const inputValue = inputValues
      .filter((v) => !!v)
      .join("")
      .toUpperCase();

    if (StringUtils.isNullOrWhiteSpace(inputValue)) {
      return;
    }

    setInputsDisabled(true);

    setTimeout(async () => {
      const hash = await BeyondLightArgUtils.hash(inputValue);

      try {
        const result = await BeyondLightArgUtils.doFetch(hash, inputValue);

        const isValid = !result.Exception;
        setIsInputValid(isValid);

        setArgData(result);
      } catch (e) {
        alert("err");
        setInputsDisabled(false);
        Modal.error(e);
      }
    }, 500);
  };

  const handleInputKeyPress = (index: number, key: string) => {
    if (key === "backspace" && index > 0) {
      setFocusedInput(index - 1);
    } else if (key !== "backspace" && index < word.length - 1) {
      setFocusedInput(index + 1);
    } else if (key === "enter") {
      submit();
    }
  };

  return (
    <div className={styles.wqArg}>
      <BungieHelmet>
        <body
          className={SpecialBodyClasses(
            BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
          )}
        />
      </BungieHelmet>

      <div
        className={classNames(styles.bgWrapper, styles.back)}
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      <div
        className={classNames(styles.bgWrapper, styles.error, {
          [styles.show]: !isInputValid,
        })}
        style={{ backgroundImage: `url(${bgRed})` }}
      />
      <div
        className={classNames(styles.bgWrapper, styles.terminal, {
          [styles.show]: argData && !argData?.Exception,
        })}
        style={{ backgroundImage: `url(${terminalBg})` }}
      />

      <div className={classNames(styles.bgWrapper, styles.logoWrapper)}>
        <img
          src={logoImg}
          className={styles.logo}
          style={{ transform: eleTransforms.logo }}
        />
      </div>

      <div className={classNames(styles.bgWrapper, styles.textWrapper)}>
        <p className={styles.title}>{title}</p>
      </div>

      <div className={classNames(styles.gridWrapper, styles)}>
        <div
          className={classNames(styles.bgWrapper, styles.grid)}
          style={{
            backgroundImage: `url(${screenImg})`,
            transform: eleTransforms.grid,
          }}
        />
      </div>

      <div className={classNames(styles.grainVideoWrapper, styles.bgWrapper)}>
        <video
          className={styles.grainVideo}
          autoPlay={true}
          loop={true}
          controls={false}
        >
          <source src={grainVideo} />
        </video>
      </div>

      <div className={classNames(styles.bgWrapper, styles.lowerContentWrapper)}>
        <div
          className={classNames(styles.bgWrapper, styles.inputOuterWrapper, {
            [styles.show]: !argData || argData?.Exception,
          })}
        >
          <div className={styles.inputWrapper}>
            {inputValues.map((value, i) => {
              return (
                <input
                  autoFocus={i === 0}
                  key={i}
                  maxLength={1}
                  placeholder={"•"}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  onKeyDown={(e) =>
                    handleInputKeyPress(i, e?.code.toLowerCase())
                  }
                  value={value}
                  ref={(el) =>
                    !inputRefs.current[i] && (inputRefs.current[i] = el)
                  }
                  className={classNames(styles.charInput, styles.glowText)}
                  disabled={inputsDisabled}
                />
              );
            })}
          </div>

          {argData?.Exception && (
            <WQArgWarningText
              fadeOut={hideWarningText}
              msg={argData?.Exception}
            />
          )}

          <button
            className={styles.submitBtn}
            onClick={submit}
            disabled={inputsDisabled}
          >
            {submitBtnText}
            <span className={styles.arrowWrapper}>
              <Icon
                className={styles.arrow}
                iconType={"material"}
                iconName={"play_arrow"}
              />
            </span>
          </button>
        </div>

        {isInputValid && argData && !argData?.Exception && (
          <WQArgValidPasswordText argData={argData} />
        )}
      </div>

      <div className={classNames(styles.bgWrapper, styles.fxWrapper)}>
        <div
          className={classNames(styles.bgWrapper, styles.fx)}
          style={{
            backgroundImage: `url(${fxBorderImg})`,
            transform: eleTransforms.fx,
          }}
        />
      </div>
    </div>
  );
};

interface ValidReturnProps {
  argData: ArgData;
}

const WQArgValidPasswordText: React.FC<ValidReturnProps> = ({ argData }) => {
  // duration in ms to type out each line of text
  const [typeDurations, setTypeDurations] = useState<number[] | null>(null);
  const [showImg, setShowImg] = useState(false);

  useEffect(() => {
    const durations = [1000];
    let timeElapsed = 1000;

    validPasswordLines.forEach((line) => {
      const isImgLine = line === "{{INSERT IMAGE}}";

      if (isImgLine) {
        // begin animating img after all lines before it have been typed out
        setTimeout(() => {
          setShowImg(true);
        }, timeElapsed);
      }

      timeElapsed = isImgLine
        ? // .3s img animation + .5s delay before typing next line
          timeElapsed + 500 + 500
        : // .033s per character + .5s delay before typing next line
          timeElapsed + line.length * 33 + 500;

      durations.push(timeElapsed);
    });

    setTypeDurations(durations);
  }, []);

  if (!typeDurations) {
    return null;
  }

  const pathTemplate = ConfigUtils.GetParameter(
    "DestinyArg",
    "ArgImageUrlTemplate",
    "[[REPLACE_ME]]"
  );
  const imagePath = pathTemplate.replace("[[REPLACE_ME]]", argData.Image);

  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.typingTextWrapper}>
        {!argData.Image ? (
          <BeyondLightArgSelfTyper>
            FAILURE // Analysis successful. Unknown error occured. Contact
            system architect.
          </BeyondLightArgSelfTyper>
        ) : (
          validPasswordLines.map((line, i) => {
            const lineContent: ReactNode =
              line === "{{INSERT IMAGE}}" ? (
                <img
                  src={imagePath}
                  className={classNames(styles.loreStrip, {
                    [styles.show]: showImg,
                  })}
                />
              ) : (
                <div
                  className={classNames({
                    [styles.inputLine]: line.includes("//input"),
                  })}
                >
                  <BeyondLightArgSelfTyper
                    key={i}
                    delayAtStart={typeDurations[i]}
                  >
                    {line}
                  </BeyondLightArgSelfTyper>
                </div>
              );

            return lineContent;
          })
        )}
      </div>
    </div>
  );
};

const WQArgWarningText: React.FC<{ fadeOut: boolean; msg: string }> = ({
  fadeOut,
  msg,
}) => {
  return (
    <div
      className={classNames(styles.warningTextWrapper, {
        [styles.fadeOut]: fadeOut,
      })}
    >
      {msg.split("~")?.map((line, i) => {
        return (
          <BeyondLightArgSelfTyper key={i} delayAtStart={i * 2000 + 1000}>
            {line}
          </BeyondLightArgSelfTyper>
        );
      })}
    </div>
  );
};

export default WQArg;
