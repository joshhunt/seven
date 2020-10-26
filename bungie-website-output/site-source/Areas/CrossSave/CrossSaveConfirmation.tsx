import * as React from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Localizer } from "@Global/Localizer";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteDefs } from "@Routes/RouteDefs";
import styles from "./CrossSaveConfirmation.module.scss";

interface ICrossSaveConfirmationProps {}

interface ICrossSaveConfirmationState {}

/**
 * Cross-Save's confirmation page
 *  *
 * @param {ICrossSaveConfirmationProps} props
 * @returns
 */
export class CrossSaveConfirmation extends React.Component<
  ICrossSaveConfirmationProps,
  ICrossSaveConfirmationState
> {
  constructor(props: ICrossSaveConfirmationProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const recapPath = RouteDefs.Areas.CrossSave.resolve("Recap");

    return (
      <Grid>
        <GridCol cols={12}>
          <div className={styles.container}>
            <div className={styles.logo} />
            <div>
              <p className={styles.header}>
                {Localizer.Crosssave.ConfirmationHeader}
              </p>
              <p className={styles.subheader}>
                {Localizer.Crosssave.ConfirmationSubHeader}
              </p>
            </div>
            <div>
              <Button url={recapPath} caps={true}>
                {Localizer.Crosssave.ViewYourSetup}
              </Button>
            </div>
          </div>
        </GridCol>
      </Grid>
    );
  }
}
