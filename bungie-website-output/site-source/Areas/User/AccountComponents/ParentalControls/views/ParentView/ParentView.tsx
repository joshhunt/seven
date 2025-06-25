import React, { FC, Fragment, useEffect, useState } from "react";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Typography } from "plxp-web-ui/components/base";
import { useHistory, useLocation } from "react-router-dom";
import {
  ParentOrGuardianAssignmentStatusEnum,
  ResponseStatusEnum,
} from "@Enum";
import { Platform } from "@Platform";
import { WarningRounded } from "@mui/icons-material";
import { Localizer } from "@bungie/localization";
import { usePlayerContext } from "@Areas/User/AccountComponents/ParentalControls/lib";
import { LinkedUser, LinkedUserAccordion } from "../../components/LinkedUser";
import { PageTemplate, AlertNotification, CopyBlock } from "../../components";
import { removePendingChildCookie } from "../../lib";

interface ParentViewProps {}

const ParentView: FC<ParentViewProps> = () => {
  const {
    IfYouAreAParentRequestInvite,
    ManageFamily,
    MyFamilyMembers,
    RequestInvite,
    EmailVerificationRequired,
    VerifyEmailMessage,
  } = Localizer.parentalcontrols;
  const [pendingChildData, setPendingChildData] = useState(null);
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
    if (pendingChildId) {
      Platform.PnpService.GetPlayerContextWithEncodedMembershipId(
        pendingChildId
      )
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
    }
  }, [pendingChildId]);

  const hasLinkedChildAccounts =
    Array.isArray(assignedChildren) && assignedChildren?.length > 0;

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
        {(hasLinkedChildAccounts || pendingChildData) && (
          <Typography component={"h2"} variant={"h6"}>
            {MyFamilyMembers}
          </Typography>
        )}
        <div>
          {pendingChildData && (
            <LinkedUser
              currentUserType={playerContext?.ageCategory}
              assignedAccount={pendingChildData}
            />
          )}
          {hasLinkedChildAccounts &&
            assignedChildren?.map((child, i) => (
              <Fragment key={`${i}-${child?.membershipId}`}>
                {child?.parentOrGuardianAssignmentStatus ===
                  ParentOrGuardianAssignmentStatusEnum.Pending && (
                  <LinkedUser
                    currentUserType={playerContext?.ageCategory}
                    assignedAccount={child}
                  />
                )}
                {child?.parentOrGuardianAssignmentStatus ===
                  ParentOrGuardianAssignmentStatusEnum.Assigned && (
                  <LinkedUserAccordion
                    currentUserType={playerContext?.ageCategory}
                    assignedAccount={child}
                  />
                )}
              </Fragment>
            ))}
        </div>

        {!hasLinkedChildAccounts && !pendingChildId && (
          <CopyBlock heading={MyFamilyMembers} subheading={RequestInvite} />
        )}
      </PageTemplate>
    </>
  ) : null;
};

export default ParentView;
