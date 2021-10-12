import { PmpNavigationBarFragment$key } from "@UI/Marketing/Fragments/__generated__/PmpNavigationBarFragment.graphql";
import React from "react";
import { graphql, useFragment } from "react-relay";
import { useLocation } from "react-router";
import { MarketingSubNav } from "../MarketingSubNav";

interface Props {
  $key: PmpNavigationBarFragment$key;
}

export const PmpNavigationBar: React.FC<Props> = ({ $key }) => {
  const { hash } = useLocation();

  const data = useFragment(
    graphql`
      fragment PmpNavigationBarFragment on PmpNavigationBar {
        __typename
        links {
          label
          anchor_id
        }
        max_width
        primary_color
        secondary_color
        title
      }
    `,
    $key
  );

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
