import styles from "./Season11OverlapAsset.module.scss";
import React from "react";
import classNames from "classnames";
import { Season11GridBoundary } from "@Areas/Seasons/ProductPages/Season11/Components/Season11GridBoundary";
import { ResponsiveContext } from "@Boot/Responsive";
import { Season11MobileSubtitle } from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";
import { Localizer } from "@Global/Localization/Localizer";

interface DefaultProps {
  size?: "large" | "small";
}

export interface Season11OverlapAssetProps {
  className?: string;
  classes?: {
    mediaWrapper?: string;
    overlap?: string;
  };
  title: React.ReactNode;
  mobileSubtitle?: string;
  asset: React.ReactNode;
  disableOverlap?: boolean;
  fade?: boolean;
  hideLine?: boolean;
}

export const Season11OverlapItem: React.FC<
  Season11OverlapAssetProps & DefaultProps
> = ({
  classes,
  className,
  asset,
  title,
  children,
  size,
  disableOverlap,
  fade,
  hideLine,
  mobileSubtitle,
}) => {
  return (
    <ResponsiveContext.Consumer>
      {(responsive) => (
        <div
          className={classNames(className, styles[size], {
            [styles.fade]: fade,
          })}
        >
          <Season11GridBoundary
            size={12}
            className={classNames(styles.mediaWrapper, classes?.mediaWrapper)}
          >
            <div
              className={classNames(styles.media, {
                [styles.hideLine]: hideLine,
              })}
            >
              <div className={styles.asset}>{asset}</div>
            </div>
          </Season11GridBoundary>
          <Season11GridBoundary
            size={responsive.mobile ? 12 : 7}
            className={classNames(styles.overlap, classes?.overlap, {
              [styles.noOverlap]: disableOverlap,
            })}
          >
            <div className={styles.below}>
              {mobileSubtitle && (
                <Season11MobileSubtitle separator={"//"}>
                  {mobileSubtitle}
                </Season11MobileSubtitle>
              )}
              <div className={styles.title}>{title}</div>
              <div className={styles.children}>{children}</div>
            </div>
          </Season11GridBoundary>
        </div>
      )}
    </ResponsiveContext.Consumer>
  );
};

Season11OverlapItem.defaultProps = {
  size: "large",
};

interface ImageAssetProps {
  className?: string;
  url: string;
}

export const Season11OverlapImageAsset: React.FC<ImageAssetProps> = (props) => {
  return (
    <div
      className={classNames(styles.imageAsset, props.className)}
      style={{ backgroundImage: `url(${props.url})` }}
    />
  );
};
