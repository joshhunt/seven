import { IContentfulEntryProps } from "../ContentfulUtils";
import { IMobileDesktopBackgroundFields } from "../Contracts/BasicContracts";
import { useDataStore } from "@Global/DataStore";
import { Responsive } from "@Boot/Responsive";
import styles from "./MobileDesktopBackgroundEntry.module.scss";
import classNames from "classnames";
import React from "react";

export const MobileDesktopBackgroundEntry: React.FC<IContentfulEntryProps<
  IMobileDesktopBackgroundFields
>> = ({ className, style, entry }) => {
  const responsive = useDataStore(Responsive);

  const { backgroundColor, desktopBackground, mobileBackground } = entry.fields;

  const bgAtSize = responsive.mobile ? mobileBackground : desktopBackground;
  const isVideo = bgAtSize.fields.file.contentType.includes("video");

  const classes = classNames(className, styles.container, {
    [styles.backgroundVideo]: isVideo,
  });

  return (
    <div className={classes} style={style}>
      {isVideo ? (
        <video autoPlay={true} muted={true} loop={true}>
          <source
            src={bgAtSize.fields.file.url}
            type={bgAtSize.fields.file.contentType}
          />
        </video>
      ) : (
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${bgAtSize.fields.file.url})` }}
        />
      )}
    </div>
  );
};

export default MobileDesktopBackgroundEntry;
