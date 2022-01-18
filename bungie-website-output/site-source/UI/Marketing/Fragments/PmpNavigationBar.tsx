import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BnetStackPmpNavigationBar } from "Generated/contentstack-types";
import React from "react";
import { useLocation } from "react-router";
import { MarketingSubNav } from "../MarketingSubNav";

type Props = DataReference<"pmp_navigation_bar", BnetStackPmpNavigationBar>;

export const PmpNavigationBar: React.FC<Props> = ({ data }) => {
  const { hash } = useLocation();

  if (!data?.links) {
    return null;
  }

  const ids = data.links?.map((l) => l.anchor_id);

  return (
    <MarketingSubNav
      ids={ids}
      renderLabel={(_, idIndex) => data.links[idIndex].label}
    />
  );
};
