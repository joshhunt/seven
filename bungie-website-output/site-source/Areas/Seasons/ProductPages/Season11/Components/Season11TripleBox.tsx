import React from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import styles from "./Season11TripleBox.module.scss";
import classNames from "classnames";
import { ResponsiveContext } from "@Boot/Responsive";

export interface Season11TripleBoxItem {
  title: string;
  description?: React.ReactNode;
  backgroundImage?: string;
  onItemClick?: () => void;
}

export interface Season11TripleBoxProps {
  classes?: {
    box?: string;
    root?: string;
    description?: string;
    title?: string;
  };
  items: Season11TripleBoxItem[];
  render?: (index: number, children: React.ReactNode) => React.ReactNode;
}

export const Season11TripleBox: React.FC<Season11TripleBoxProps> = ({
  items,
  classes,
  render,
}) => {
  return (
    <ResponsiveContext.Consumer>
      {(responsive) => (
        <Grid
          strictMode={true}
          className={classNames(styles.wrapper, classes?.root)}
        >
          <GridCol
            cols={responsive.mobile ? 12 : 9}
            className={styles.boxContainer}
          >
            {items.map((item, i) =>
              render(
                i,
                <div
                  key={i}
                  style={{ backgroundImage: item.backgroundImage }}
                  className={classNames(styles.box, classes?.box, {
                    [styles.clickable]: !!item.onItemClick,
                  })}
                  onClick={() => item.onItemClick?.()}
                >
                  <div className={classNames(styles.title, classes?.title)}>
                    {item.title}
                  </div>
                  {item.description && (
                    <div
                      className={classNames(
                        styles.description,
                        classes?.description
                      )}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              )
            )}
          </GridCol>
        </Grid>
      )}
    </ResponsiveContext.Consumer>
  );
};

Season11TripleBox.defaultProps = {
  render: (i, children) => children,
};
