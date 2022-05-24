import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BnetStackPmpNavigationBar } from "Generated/contentstack-types";
import React from "react";
import { IMarketingSubNavProps, MarketingSubNav } from "../MarketingSubNav";

type Props = DataReference<"pmp_navigation_bar", BnetStackPmpNavigationBar> &
  Omit<IMarketingSubNavProps, "ids" | "renderLabel"> & {};

export const PmpNavigationBar: React.FC<Props> = (props) => {
  const { data, _content_type_uid, ...rest } = props;

  if (!data?.links) {
    return null;
  }

  const ids = data.links?.map((l) => l.anchor_id);

  return (
    <MarketingSubNav
      {...rest}
      ids={ids}
      renderLabel={(_, idIndex) => data.links[idIndex].label}
    />
  );
};
