// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BnetStackPmpCallToAction } from "Generated/contentstack-types";
import React from "react";

type Props = DataReference<"pmp_call_to_action", BnetStackPmpCallToAction>;

export const PmpCallToAction: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ height: "50vh", background: "rgba(0,0,120,0.5)" }}>
      {data.title}
    </div>
  );
};
