import styles from "@Areas/Emails/Emails.module.scss";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { createAsyncComponent } from "../../Global/Routes/AsyncRoute";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";

class EmailsArea extends React.Component<RouteComponentProps> {
  public render() {
    const unsubscribePath = RouteDefs.Areas.Emails.getAction("Unsubscribe")
      .path;
    const verifyPath = RouteDefs.Areas.Emails.getAction("Verify").path;

    return (
      <React.Fragment>
        <Grid className={styles.pageContent}>
          <GridCol cols={12}>
            <SwitchWithErrors>
              <Route
                path={unsubscribePath}
                exact={true}
                component={createAsyncComponent(
                  () =>
                    import(
                      "@Areas/Emails/Unsubscribe" /* webpackChunkName: "Emails-Unsubscribe" */
                    )
                )}
              />
              <Route
                path={verifyPath}
                component={createAsyncComponent(
                  () =>
                    import(
                      "@Areas/Emails/Verify" /* webpackChunkName: "Emails-Verify" */
                    )
                )}
              />
            </SwitchWithErrors>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

export default EmailsArea;
