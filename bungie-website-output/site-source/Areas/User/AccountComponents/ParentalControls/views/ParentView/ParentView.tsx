import React, { FC, Fragment, useEffect, useState } from "react";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Typography } from "plxp-web-ui/components/base";
import { useHistory, useLocation } from "react-router-dom";
import {
  ParentOrGuardianAssignmentStatusEnum,
  ResponseStatusEnum,
} from "@Enum";
import { Platform, PnP } from "@Platform";
import { WarningRounded } from "@mui/icons-material";
import { Localizer } from "@bungie/localization";
import { usePlayerContext } from "@Areas/User/AccountComponents/ParentalControls/lib";
import { LinkedUser, LinkedUserAccordion } from "../../components/LinkedUser";
import { PageTemplate, AlertNotification, CopyBlock } from "../../components";
import { removePendingChildCookie } from "../../lib";

interface ParentViewProps {}

const ParentView: FC<ParentViewProps> = () => {
  const {
    MyFamilyMembers,
    RequestInvite,
    EmailVerificationRequired,
    VerifyEmailMessage,
  } = Localizer.parentalcontrols;
  const [pendingChildData, setPendingChildData] = useState<
    PnP.PlayerContextData
  >();
  const {
    pendingChildId,
    assignedChildren,
    playerContext,
  } = usePlayerContext();

  const history = useHistory();
  const location = useLocation();

  const clearParams = () => {
    history.replace(location.pathname);
  };

  useEffect(() => {
    if (!pendingChildId) {
      return;
    }
    Platform.PnpService.GetPlayerContextWithEncodedMembershipId(pendingChildId)
      .then((r) => {
        if (r?.responseStatus !== ResponseStatusEnum.Success) {
          Modal.error({
            name: ResponseStatusEnum[r?.responseStatus],
            message: `${Localizer.errors.UnhandledError} Error: ${
              ResponseStatusEnum[r?.responseStatus]
            }`,
          });
        } else {
          if (r?.playerContext?.profilePicturePath) {
            setPendingChildData(r?.playerContext);
          } else {
            /* if the call fails silently because it couldn't decode the param
             * remove the cookie, clear the params, ask user to ask child to redo the invite :)
             * */
            removePendingChildCookie();
            clearParams();
            setPendingChildData(null);
          }
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
        console.log(e);
      });
  }, [pendingChildId]);

  const assignedAndPendingChildAccounts = assignedChildren.filter(
    (c) =>
      c.parentOrGuardianAssignmentStatus ===
        ParentOrGuardianAssignmentStatusEnum.Assigned ||
      c.parentOrGuardianAssignmentStatus ===
        ParentOrGuardianAssignmentStatusEnum.Pending
  );

  return playerContext?.membershipId ? (
    <>
      {!playerContext?.isEmailVerified && (
        <AlertNotification
          alertTitle={EmailVerificationRequired}
          alertMessage={VerifyEmailMessage}
          icon={<WarningRounded />}
          bottomMargin={"2rem"}
        />
      )}
      <PageTemplate faqEntryId={"blte68395781113b3b8"}>
        {(assignedAndPendingChildAccounts.length > 0 || pendingChildData) && (
          <Typography component={"h2"} variant={"h6"}>
            {MyFamilyMembers}
          </Typography>
        )}
        <div>
          {pendingChildData &&
            !assignedAndPendingChildAccounts.some(
              (c) => c.membershipId === pendingChildData.membershipId
            ) && <LinkedUser assignedAccount={pendingChildData} />}
          {assignedAndPendingChildAccounts.map((child) => {
            if (
              child.parentOrGuardianAssignmentStatus ===
              ParentOrGuardianAssignmentStatusEnum.Assigned
            ) {
              return (
                <LinkedUserAccordion
                  key={child.membershipId}
                  assignedAccount={child}
                />
              );
            } else {
              return (
                <LinkedUser key={child.membershipId} assignedAccount={child} />
              );
            }
          })}
        </div>

        {assignedAndPendingChildAccounts.length === 0 && !pendingChildId && (
          <CopyBlock heading={MyFamilyMembers} subheading={RequestInvite} />
        )}
      </PageTemplate>
    </>
  ) : null;
};

export default ParentView;
