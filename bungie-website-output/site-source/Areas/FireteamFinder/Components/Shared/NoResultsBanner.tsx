// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import styles from "./NoResultsBanner.module.scss";
import React from "react";

interface NoResultsBannerProps {}

export const NoResultsBanner = ({
  clearSearch,
}: {
  clearSearch: () => void;
}) => {
  return (
    <span className={styles.noResultsBanner}>
      <svg
        className={styles.warningIcon}
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
      >
        <path
          d="M6.51828 30.6249H28.4808C30.7266 30.6249 32.1266 28.1895 31.0037 26.2499L20.0224 7.27695C18.8995 5.33737 16.0995 5.33737 14.9766 7.27695L3.99536 26.2499C2.87244 28.1895 4.27244 30.6249 6.51828 30.6249ZM17.4995 20.4165C16.6974 20.4165 16.0412 19.7603 16.0412 18.9582V16.0415C16.0412 15.2395 16.6974 14.5832 17.4995 14.5832C18.3016 14.5832 18.9579 15.2395 18.9579 16.0415V18.9582C18.9579 19.7603 18.3016 20.4165 17.4995 20.4165ZM18.9579 26.2499H16.0412V23.3332H18.9579V26.2499Z"
          fill="white"
        />
      </svg>
      <div>
        <p className={styles.resetStr}>
          {Localizer.FormatReact(Localizer.Fireteams.ActivityNoResults, {
            viewAll: (
              <span onClick={clearSearch} className={styles.resetStrBtn}>
                {Localizer.fireteams.clickhere}
              </span>
            ),
          })}
        </p>
      </div>
    </span>
  );
};
