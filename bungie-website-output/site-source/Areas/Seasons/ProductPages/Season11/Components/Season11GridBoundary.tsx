import classNames from "classnames";
import styles from "@Areas/Seasons/ProductPages/Season11/Components/Season11GridBoundary.module.scss";
import { Grid, GridCol, ValidCols } from "@UIKit/Layout/Grid/Grid";
import React from "react";

interface Season11GridBoundaryProps
  extends React.DOMAttributes<HTMLDivElement> {
  className?: string;
  classes?: {
    grid?: string;
    gridCol?: string;
  };
  size: ValidCols;
}

export const Season11GridBoundary: React.FC<Season11GridBoundaryProps> = (
  props
) => {
  const { children, className, classes, size, ...rest } = props;

  return (
    <Grid
      className={classNames(className, classes?.grid, styles.wrapper)}
      strictMode={true}
      {...rest}
    >
      <GridCol cols={size} className={classes?.gridCol}>
        {children}
      </GridCol>
    </Grid>
  );
};
