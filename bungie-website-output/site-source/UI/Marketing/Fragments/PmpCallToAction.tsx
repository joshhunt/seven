// Created by jlauer, 2021
// Copyright Bungie, Inc.

import React from "react";
import { graphql, useFragment } from "react-relay";
import { PmpCallToActionFragment$key } from "./__generated__/PmpCallToActionFragment.graphql";

interface PMPCallToActionProps {
  $key: PmpCallToActionFragment$key;
}

export const PmpCallToAction: React.FC<PMPCallToActionProps> = (props) => {
  const data = useFragment(
    graphql`
      fragment PmpCallToActionFragment on PmpCallToAction {
        buttons {
          button_type
          label
          url
        }
        fileConnection {
          edges {
            node {
              url
            }
          }
        }
        title
      }
    `,
    props.$key
  );

  return (
    <div style={{ height: "50vh", background: "rgba(0,0,120,0.5)" }}>
      {data.title}
    </div>
  );
};
