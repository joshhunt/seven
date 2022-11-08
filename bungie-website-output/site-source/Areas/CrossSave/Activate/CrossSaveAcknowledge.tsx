import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useState } from "react";
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
import { Redirect } from "react-router-dom";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";

/**
 * The screen to acknowledge the terms of Cross Save
 *  *
 * @returns
 */
export const CrossSaveAcknowledge = () => {
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const [acknowledged, setAcknowledged] = useState(flowState.acknowledged);

  const changeAcknowledge = (checked: boolean) => {
    setAcknowledged(checked);

    CrossSaveFlowStateDataStore.actions.updateAcknowledged(checked);
  };

  const linkStep = RouteDefs.Areas.CrossSave.resolve<ICrossSaveActivateParams>(
    "Activate",
    {
      step: "Link",
    }
  );

  const userAgreementTag = ConfigUtils.GetParameter(
    "CrossSave",
    "CrossSaveUserAgreementTag",
    "cross save agreement"
  );

  if (flowState.isActive) {
    return <Redirect to={linkStep.url} />;
  }

  const faqArticleId = ConfigUtils.GetParameter(
    SystemNames.CrossSave,
    "FaqFirehoseArticleId",
    0
  );
  const faqLink = RouteHelper.HelpArticle(faqArticleId);

  const faqText = (
    <>
      {Localizer.FormatReact(
        Localizer.Crosssave.CrossSaveAcknowledgementLabel,
        {
          faqLink: (
            <Anchor url={faqLink} className={styles.faqLink}>
              {Localizer.Crosssave.FAQLinkLabel}
            </Anchor>
          ),
        }
      )}
    </>
  );

  return (
    <>
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
            checked={acknowledged}
            onChecked={(checked) => changeAcknowledge(checked)}
            label={Localizer.Crosssave.AcknowledgementCheckboxText}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            url={linkStep}
            buttonType={"gold"}
            disabled={!acknowledged}
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
    </>
  );
};
