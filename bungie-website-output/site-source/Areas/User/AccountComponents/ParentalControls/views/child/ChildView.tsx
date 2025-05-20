import React, { FC } from "react";
import { PageTemplate, GuardianInvite, CopyBlock } from "../../components";
import { Localizer } from "@bungie/localization";
import { LinkedUser } from "../../components/LinkedUser";
import { ParentalControls } from "@Platform";

interface ChildViewProps {
  childAccount: any;
}

const ChildView: FC<ChildViewProps> = ({ childAccount }) => {
  const {
    ChildViewSubheading,
    ParentOrGuardian,
    CreateALink,
  } = Localizer.parentalcontrols;
  const hasAdult =
    childAccount.playerContext.parentOrGuardianAssignmentStatus !== 0 &&
    childAccount?.playerContext.parentOrGuardianAssignmentStatus !== 3;

  return childAccount?.playerContext ? (
    <PageTemplate
      hero={{ subheading: ChildViewSubheading }}
      faqEntryId={"blte68395781113b3b8"}
    >
      {hasAdult ? (
        <LinkedUser
          currentUserType={childAccount.playerContext.ageCategory}
          assignedAccount={childAccount?.playerContext}
        />
      ) : (
        <>
          <CopyBlock heading={ParentOrGuardian} subheading={CreateALink} />
          <GuardianInvite childAccount={childAccount.playerContext} />
        </>
      )}
    </PageTemplate>
  ) : null;
};

export default ChildView;
