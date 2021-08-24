import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import * as React from "react";
import { DetailedError } from "@CustomErrors";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import styles from "./ErrorDisplay.module.scss";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FetchUtils } from "@Utilities/FetchUtils";

interface IErrorDisplayProps {
  error: Error;
}

interface IErrorDisplayState {}

/**
 * Displays an error
 *  *
 * @param {IErrorDisplayProps} props
 * @returns
 */
export class ErrorDisplay extends React.Component<
  IErrorDisplayProps,
  IErrorDisplayState
> {
  constructor(props: IErrorDisplayProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const error = this.props.error;

    let title = "Error";
    let message = <p>{error.message}</p>;
    let detail = null;
    if (error instanceof DetailedError) {
      title = error.title;
      message = <p dangerouslySetInnerHTML={sanitizeHTML(error.message)} />;

      if (!ConfigUtils.EnvironmentIsProduction) {
        detail = error.detail.map((a, i) => {
          const errorInfo =
            a instanceof Request ? FetchUtils.RequestToObject(a) : a;

          return <Monospace key={i} message={errorInfo} />;
        });
      }
    }

    return (
      <Grid>
        <GridCol cols={12}>
          <div className={styles.errorContent}>
            <h1>{title}</h1>
            {message}
            <br />
            <br />
            {detail}
            <br />
            <br />

            {!ConfigUtils.EnvironmentIsProduction && error.stack && (
              <Monospace message={error.stack.replace("\\n", "\r\n")} />
            )}
          </div>
        </GridCol>
      </Grid>
    );
  }
}

const Monospace = (props: { message: string }) => {
  return (
    <pre
      style={{ whiteSpace: "pre-wrap", textAlign: "left" }}
      dangerouslySetInnerHTML={sanitizeHTML(
        JSON.stringify(props.message, null, 2)
      )}
    />
  );
};
