import React, { useEffect, useState } from "react";
import styles from "./BeyondLightARG.module.scss";

interface Props {
  children: string[] | string;
  speedInMs?: number;
  delayAtStart?: number;
  onComplete?: () => void;
}

export const BeyondLightArgSelfTyper: React.FC<Props> = ({
  children,
  speedInMs,
  delayAtStart,
  onComplete,
}) => {
  const normalizedChildren =
    typeof children === "string" ? [children] : children;
  const joinedChildren = [...normalizedChildren].join("");
  const [typed, setTyped] = useState("");

  const typeNext = () => {
    const newLength = Math.min(typed.length + 1, joinedChildren.length);
    setTyped(joinedChildren.slice(0, newLength));
  };

  useEffect(() => {
    if (typed.length < joinedChildren.length) {
      const delay = typed.length === 0 ? speedInMs + delayAtStart : speedInMs;
      setTimeout(typeNext, delay);
    } else {
      onComplete?.();
    }
  }, [typed]);

  return <div className={styles.selfTyper}>{typed}</div>;
};

BeyondLightArgSelfTyper.defaultProps = {
  speedInMs: 33,
  delayAtStart: 0,
};
