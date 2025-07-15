import { Typography } from "plxp-web-ui/components/base";
import React, { FC } from "react";
import { Localizer } from "@bungie/localization";
import { ParentOrGuardianAssignmentStatusEnum } from "@Enum";
import { usePlayerContext } from "@Areas/User/AccountComponents/ParentalControls/lib";
import { CopyBlock, GuardianInvite, PageTemplate } from "../../components";
import { LinkedUser } from "../../components/LinkedUser";

interface ChildViewProps {}

const ChildView: FC<ChildViewProps> = () => {
  const { ParentOrGuardian, CreateALink } = Localizer.parentalcontrols;

  const { playerContext } = usePlayerContext();

  const hasAdult =
    playerContext.parentOrGuardianAssignmentStatus !==
      ParentOrGuardianAssignmentStatusEnum.None &&
    playerContext.parentOrGuardianAssignmentStatus !==
      ParentOrGuardianAssignmentStatusEnum.Unassigned &&
    playerContext.parentOrGuardianAssignmentStatus !==
      ParentOrGuardianAssignmentStatusEnum.Pending;

  return playerContext?.membershipId ? (
    <PageTemplate faqEntryId={"blte68395781113b3b8"}>
      {hasAdult && (
        <Typography component={"h2"} variant={"h6"}>
          {ParentOrGuardian}
        </Typography>
      )}
      {hasAdult ? (
        <LinkedUser assignedAccount={playerContext} />
      ) : (
        <>
          <CopyBlock heading={ParentOrGuardian} subheading={CreateALink} />
          <GuardianInvite childAccount={playerContext} />
        </>
      )}
    </PageTemplate>
  ) : null;
};

export default ChildView;
