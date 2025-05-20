import React, { FC, Fragment, useEffect, useState } from "react";
import { WarningRounded } from "@mui/icons-material";
import { Localizer } from "@bungie/localization";
import { LinkedUser, LinkedUserAccordion } from "../../components/LinkedUser";
import { PageTemplate, AlertNotification, CopyBlock } from "../../components";
import { EXAMPLE_CHILD_WITHOUT_ADULT } from "../../MOCK_DATA";
import { ParentalControls } from "@Platform";
import cookie from "js-cookie";
import { removePendingChildCookie } from "@Areas/User/AccountComponents/ParentalControls/utils";

interface ParentViewProps {
  parentAccount: any;
}

const ParentView: FC<ParentViewProps> = ({ parentAccount }) => {
  const {
    IfYouAreAParentRequestInvite,
    ManageFamily,
    MyFamilyMembers,
    RequestInvite,
    EmailVerificationRequired,
    VerifyEmailMessage,
  } = Localizer.parentalcontrols;
  const { playerContext, assignedChildren } = parentAccount;
  const [pendingChildData, setPendingChildData] = useState();

  /*
   * TODO:
   *  - Add state control for email verification popup
   * */

  /* - Notes:
   * parentOrGuardianAssignmentStatus:
   * 1 Pending
   * 2 Assigned
   *
   * */

  /* TO DO: We have to decode the child id*/
  /* rename the cookie ?*/
  const url = new URL(window.location.href);
  const requestingChildIdfromParam = url.searchParams.get("playerId");
  const childIdCookie = cookie.get("playerId");
  const requestingChildId = childIdCookie ?? requestingChildIdfromParam;
  const hasPendingChild = requestingChildId && playerContext.ageCategory === 3;

  useEffect(() => {
    /* Check if the child already exists as an assigned child of the guardian */
    /* If the child connection exists, clear the cookie and do not render the "accept" flow */
    /* If the child conneection does not exist, pull the child data and render the "accept" flow */
    if (hasPendingChild) {
      const exists = assignedChildren.some(
        (child) => child.membershipId === parseInt(requestingChildId)
      );

      if (exists) {
        removePendingChildCookie();
      } else {
        /* getPlayerContext(requestingChildId)*/
        setPendingChildData(EXAMPLE_CHILD_WITHOUT_ADULT.playerContext);
      }
    }
  }, []);

  const heroData = {
    heading: IfYouAreAParentRequestInvite,
    subheading: ManageFamily,
  };

  const hasLinkedChildAccounts =
    Array.isArray(assignedChildren) && assignedChildren?.length > 0;

  return playerContext?.membershipId && playerContext?.ageCategory === 3 ? (
    <>
      {!playerContext?.IsEmailVerified && (
        <AlertNotification
          alertTitle={EmailVerificationRequired}
          alertMessage={VerifyEmailMessage}
          icon={<WarningRounded />}
          bottomMargin={"2rem"}
        />
      )}
      <PageTemplate hero={heroData} faqEntryId={"blte68395781113b3b8"}>
        <div>
          {hasPendingChild && pendingChildData && (
            <LinkedUser
              currentUserType={playerContext?.ageCategory}
              assignedAccount={pendingChildData}
            />
          )}
          {hasLinkedChildAccounts &&
            assignedChildren?.map((child) => (
              <Fragment key={child.PlayerId}>
                {child?.parentOrGuardianAssignmentStatus === 1 && (
                  <LinkedUser
                    currentUserType={playerContext?.ageCategory}
                    assignedAccount={child}
                  />
                )}
                {child?.parentOrGuardianAssignmentStatus === 2 && (
                  <LinkedUserAccordion
                    currentUserType={playerContext?.ageCategory}
                    assignedAccount={child}
                  />
                )}
              </Fragment>
            ))}
        </div>

        {!hasLinkedChildAccounts && !hasPendingChild && (
          <CopyBlock heading={MyFamilyMembers} subheading={RequestInvite} />
        )}
      </PageTemplate>
    </>
  ) : null;
};

export default ParentView;
