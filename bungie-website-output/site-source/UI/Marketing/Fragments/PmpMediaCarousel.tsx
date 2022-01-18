import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BnetStackPmpMediaCarousel } from "Generated/contentstack-types";
import React from "react";

type Props = DataReference<"pmp_media_carousel", BnetStackPmpMediaCarousel>;

export const PmpMediaCarousel: React.FC<Props> = ({ data }) => {
  return <a id={data?.title} />;
};
