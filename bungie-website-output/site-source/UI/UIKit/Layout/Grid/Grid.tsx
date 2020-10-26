import classNames from "classnames";
import React, { DOMAttributes } from "react";
import styles from "./Grid.module.scss";

export type ValidCols = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface IGridColProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  /** Number of columns by default. 0 = hidden. */
  cols: ValidCols;
  /** Number of columns to show at pico size. 0 = hidden. */
  pico?: ValidCols;
  /** Number of columns to show at tiny size. 0 = hidden. */
  tiny?: ValidCols;
  /** Number of columns to show at mobile size. 0 = hidden. */
  mobile?: ValidCols;
  /** Number of columns to show at medium size. 0 = hidden. */
  medium?: ValidCols;
  /** Number of columns to show at large size. 0 = hidden. */
  large?: ValidCols;
  /** Number of columns to show at maximum size. 0 = hidden. */
  gridmax?: ValidCols;
}

export interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** If true, this grid will contain a large text body (like an article). The max-width will be narrower to allow for easier reading. */
  isTextContainer?: boolean;
  /** If true, this grid will take up the full width of its container instead of including gutters on either side */
  noPadding?: boolean;
}

interface DefaultGridProps {
  /** If true, columns will not expand to fill the grid. They will respect the column size. */
  strictMode: boolean;
}

/** A 12-column container. Use <GridCol> in children for sizing. */
export class Grid extends React.Component<IGridProps & DefaultGridProps> {
  public static defaultProps: DefaultGridProps = {
    strictMode: false,
  };

  public render() {
    const {
      className,
      isTextContainer,
      strictMode,
      noPadding,
      ...rest
    } = this.props;

    const classes = classNames(className || "", styles.grid, {
      [styles.textMode]: isTextContainer,
      [styles.strictMode]: strictMode,
      [styles.nopadding]: noPadding,
    });

    return (
      <div {...rest} className={classes}>
        {this.props.children}
      </div>
    );
  }
}

/** Used inside a <Grid> */
export class GridCol extends React.Component<IGridColProps> {
  private static readonly GRID_COLS_MIN = 0;
  private static readonly GRID_COLS_MAX = 12;

  public render() {
    const {
      cols,
      tiny,
      mobile,
      medium,
      large,
      gridmax,
      className,
      ...rest
    } = this.props;

    const colsOrDefault = cols || GridCol.GRID_COLS_MAX;
    const gridCols = styles[`gridCol${colsOrDefault}`];
    const picoCols = GridCol.getGridColClass("pico", this.props.pico);
    const tinyCols = GridCol.getGridColClass("tiny", this.props.tiny);
    const mobileCols = GridCol.getGridColClass("mobile", this.props.mobile);
    const mediumCols = GridCol.getGridColClass("medium", this.props.medium);
    const largeCols = GridCol.getGridColClass("large", this.props.large);
    const gridmaxCols = GridCol.getGridColClass("gridmax", this.props.gridmax);

    const classes = classNames([
      styles.gridColumn,
      className || "",
      gridCols,
      picoCols,
      tinyCols,
      mobileCols,
      mediumCols,
      largeCols,
      gridmaxCols,
    ]);

    return (
      <div {...rest} className={classes}>
        {this.props.children || <span>&nbsp;</span>}
      </div>
    );
  }

  private static getGridColClass(prefix: string, cols?: number) {
    if (
      cols !== undefined &&
      (cols > GridCol.GRID_COLS_MAX || cols < GridCol.GRID_COLS_MIN)
    ) {
      throw new Error(
        `Column count must be between ${GridCol.GRID_COLS_MIN} and ${GridCol.GRID_COLS_MAX}`
      );
    }

    if (cols === 0) {
      return styles[`gridColsHide${prefix}`];
    }

    return cols ? styles[`gridCol${cols}${prefix}`] : "";
  }
}
