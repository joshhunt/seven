import { PmpAnchorFragment$key } from "@UI/Marketing/Fragments/__generated__/PmpAnchorFragment.graphql";
import React from "react";
import { graphql, useFragment } from "react-relay";

interface Props {
  $key: PmpAnchorFragment$key;
}

export const PmpAnchor: React.FC<Props> = ({ $key }) => {
  const data = useFragment(
    graphql`
      fragment PmpAnchorFragment on PmpAnchor {
        __typename
        title
      }
    `,
    $key
  );

  return <a id={data?.title} />;
};
