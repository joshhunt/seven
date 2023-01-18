// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useMemo } from "react";
import styles from "./LightfallGuardiansSection.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";
import { LightfallAnimatedText } from "@Areas/Destiny/Lightfall/components/LightfallAnimatedText/LightfallAnimatedText";
import { LightfallGuardian } from "@Areas/Destiny/Lightfall/components/LightfallGuardian/LightfallGuardian";

interface LightfallGuardiansSectionProps {
  data?: any;
}

export const LightfallGuardiansSection: React.FC<LightfallGuardiansSectionProps> = (
  props
) => {
  const { data } = props;
  const { guardians = [] } = data ?? {};

  return (
    <div className={styles.section}>
      {guardians.map(({ guardian }: any, index: number) => (
        <LightfallGuardian
          key={guardian.uid}
          {...guardian}
          flip={index % 2 === 1}
        />
      ))}
    </div>
  );
};
