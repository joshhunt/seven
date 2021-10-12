import * as React from "react";
import { Localizer } from "@bungie/localization";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  ICrossSaveFlowState,
  CrossSaveFlowStateDataStore,
} from "../Shared/CrossSaveFlowStateDataStore";
import styles from "./CrossSaveAcknowledge.module.scss";
import { RouteDefs } from "@Routes/RouteDefs";
import { ICrossSaveActivateParams } from "../CrossSaveActivate";
import { Redirect, Link } from "react-router-dom";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface ICrossSaveAcknowledgeProps {
  flowState: ICrossSaveFlowState;
}

interface ICrossSaveAcknowledgeState {
  acknowledged: boolean;
}

/**
 * The screen to acknowledge the terms of Cross Save
 *  *
 * @param {ICrossSaveAcknowledgeProps} props
 * @returns
 */
export class CrossSaveAcknowledge extends React.Component<
  ICrossSaveAcknowledgeProps,
  ICrossSaveAcknowledgeState
> {
  constructor(props: ICrossSaveAcknowledgeProps) {
    super(props);

    this.state = {
      acknowledged: props.flowState.acknowledged,
    };
  }

  private readonly changeAcknowledge = (acknowledged: boolean) => {
    this.setState({
      acknowledged,
    });

    CrossSaveFlowStateDataStore.actions.updateAcknowledged(acknowledged);
  };

  private readonly checkAcknowledgeStatus = () => {
    return this.state.acknowledged;
  };

  public render() {
    const linkStep = RouteDefs.Areas.CrossSave.resolve<
      ICrossSaveActivateParams
    >("Activate", {
      step: "Link",
    });

    const userAgreementTag = ConfigUtils.GetParameter(
      "CrossSave",
      "CrossSaveUserAgreementTag",
      "cross save agreement"
    );

    if (this.props.flowState.isActive) {
      return <Redirect to={linkStep.url} />;
    }

    const faqArticleId = ConfigUtils.GetParameter(
      SystemNames.CrossSave,
      "FaqFirehoseArticleId",
      0
    );
    const faqLink = RouteHelper.HelpArticle(faqArticleId);

    const faqText = Localizer.FormatReact(
      Localizer.Crosssave.CrossSaveAcknowledgementLabel,
      {
        faqLink: (
          <Anchor url={faqLink} className={styles.faqLink}>
            {Localizer.Crosssave.FAQLinkLabel}
          </Anchor>
        ),
      }
    );

    return (
      <React.Fragment>
        <CrossSaveStaggerPose index={0}>
          <CrossSaveActivateStepInfo
            title={Localizer.Crosssave.AcknowledgeTitle}
            desc={Localizer.Crosssave.AcknowledgeDesc}
          />
        </CrossSaveStaggerPose>

        <div className={styles.container}>
          <div className={styles.userAgreementBorder}>
            <div className={styles.userAgreement}>
              <InfoBlock
                tagAndType={{ tag: userAgreementTag, type: "InformationBlock" }}
                ignoreStyles={true}
              />
            </div>
          </div>
          <div className={styles.checkboxContainer}>
            <Checkbox
              checked={this.state.acknowledged}
              onChecked={(checked) => this.changeAcknowledge(checked)}
              label={Localizer.Crosssave.AcknowledgementCheckboxText}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              url={linkStep}
              buttonType={"gold"}
              disabled={!this.state.acknowledged}
              caps={true}
              className={styles.buttonNext}
            >
              {Localizer.Crosssave.AcknowledgeButtonLabel}
            </Button>
          </div>
          <div className={styles.faqContainer}>
            <p>{faqText}</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
