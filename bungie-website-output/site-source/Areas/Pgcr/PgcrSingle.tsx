// Created by larobinson, 2022
// Copyright Bungie, Inc.

import Pgcr from "@Areas/Pgcr/Pgcr";
import { IPgcrParams } from "@Routes/RouteParams";
import React from "react";
import { useLocation, useParams } from "react-router";

export const PgcrSingle: React.FC = () => {
  const { id } = useParams<IPgcrParams>();
  const location = useLocation();
  const urlParams = new URLSearchParams(location?.search);

  return (
    <Pgcr
      activityId={id}
      singleton={true}
      character={urlParams.get("character")}
    />
  );
};
