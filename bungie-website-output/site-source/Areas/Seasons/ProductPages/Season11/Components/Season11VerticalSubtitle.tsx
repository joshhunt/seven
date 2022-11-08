import { ResponsiveContext } from "@Boot/Responsive";
import classNames from "classnames";
import React from "react";
import styles from "./Season11VerticalSubtitle.module.scss";

interface Season11VerticalSubtitleProps {
  className?: string;
  separator: string;
  children: string;
}

export const Season11VerticalSubtitle: React.FC<Season11VerticalSubtitleProps> = (
  props
) => {
  const { children, separator, className } = props;

  const separatorColor = "#24ca44";
  const pieces = children.split(separator);

  return (
    <ResponsiveContext.Consumer>
      {(responsive) =>
        !responsive.mobile && (
          <div className={classNames(styles.wrapper, className)}>
            <div className={styles.subtitle}>
              {pieces.map((piece, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span
                      className={styles.separator}
                      style={{ color: separatorColor }}
                    >
                      {separator}
                    </span>
                  )}
                  <span className={styles.piece}>{piece}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      }
    </ResponsiveContext.Consumer>
  );
};

interface Season11MobileSubtitleProps {
  className?: string;
  separator: string;
  children: string;
}

export const Season11MobileSubtitle: React.FC<Season11MobileSubtitleProps> = (
  props
) => {
  const { children, separator, className } = props;

  const pieces = children.split(separator);

  return (
    <ResponsiveContext.Consumer>
      {(responsive) =>
        responsive.mobile && (
          <div className={classNames(styles.wrapper, className)}>
            <div className={styles.subtitle}>
              <span>{pieces[1]}</span>
            </div>
          </div>
        )
      }
    </ResponsiveContext.Consumer>
  );
};
