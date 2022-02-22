import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BnetStackPmpAnchor } from "Generated/contentstack-types";
import React from "react";

type Props = DataReference<"pmp_anchor", BnetStackPmpAnchor>;

export const PmpAnchor: React.FC<Props> = ({ data }) => {
  return <a id={data?.title} />;
};
