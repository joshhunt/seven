// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface FooterLinkProps {
  url: IMultiSiteLink | string;
  label: string;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ url, label }) => {
  return (
    <li>
      <Anchor url={url}>{label}</Anchor>
    </li>
  );
};
