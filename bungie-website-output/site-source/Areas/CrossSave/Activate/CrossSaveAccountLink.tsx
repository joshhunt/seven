import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { useState } from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@bungie/localization";
import styles from "../CrossSaveActivate.module.scss";
import { CrossSaveUtils } from "../Shared/CrossSaveUtils";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
} from "../Shared/CrossSaveFlowStateDataStore";
import { PlatformError } from "@CustomErrors";
import { CrossSaveVerifyAllAccounts } from "../Shared/CrossSaveVerifyAllAccounts";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";

interface ICrossSaveAccountLinkProps {
  deactivating: boolean;
  onAccountLinked: (isVerify: boolean) => Promise<any | PlatformError>;
  excludeUnlinked?: boolean;
}

/**
 * The steps to pair your accounts in Cross-Save
 *  *
 * @returns
 */
export const CrossSaveAccountLink: React.FC<ICrossSaveAccountLinkProps> = (
  props
) => {
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
  ]);

  const nextPrevSteps = CrossSaveUtils.getNextPrevStepPaths(flowState, "Link");

  const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
    flowState
  );

  if (!props.deactivating) {
    pairableMembershipTypes.filter(
      (mt) =>
        !EnumUtils.looseEquals(
          BungieMembershipType[mt],
          BungieMembershipType.TigerStadia,
          BungieMembershipType
        )
    );
  }

  const canProceed =
    CrossSaveUtils.allAccountsAuthVerified(
      globalState.loggedInUser,
      flowState
    ) &&
    pairableMembershipTypes.length > 1 &&
    globalState.loggedInUser.crossSaveCredentialTypes.length > 1;

  return (
    <div className={styles.accountPair}>
      <CrossSaveStaggerPose index={0}>
        <CrossSaveActivateStepInfo
          title={Localizer.Crosssave.LinkStepTitle}
          desc={Localizer.Crosssave.LinkStepDescription}
        />
      </CrossSaveStaggerPose>

      <CrossSaveStaggerPose index={1}>
        <CrossSaveVerifyAllAccounts
          flowState={flowState}
          loggedInUser={globalState.loggedInUser}
          onAccountLinked={props.onAccountLinked}
          isDeactivateFlow={false}
        />
      </CrossSaveStaggerPose>

      {!props.deactivating && (
        <CrossSaveStaggerPose index={2}>
          {!canProceed && (
            <div className={styles.buttonDisabledDesc}>
              {Localizer.Crosssave.ButtonDisabledDescAuthenticate}
            </div>
          )}
          <div className={styles.buttonContainer}>
            <Button
              className={styles.buttonNext}
              url={nextPrevSteps.nextPath}
              buttonType={"gold"}
              disabled={!canProceed}
              caps={true}
            >
              {Localizer.Crosssave.CharactersButtonLabel}{" "}
              <Icon iconType={"material"} iconName={`arrow_forward`} />
            </Button>
          </div>
        </CrossSaveStaggerPose>
      )}
    </div>
  );
};
