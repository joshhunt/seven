import { AgeCategoriesEnum, ParentOrGuardianAssignmentStatusEnum } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { FC } from "react";
import { SettingsPanel, UserPanel } from "../components";

interface LinkedUserProps {
  assignedAccount: any;
}

const LinkedUser: FC<LinkedUserProps> = ({ assignedAccount }) => {
  const isAssigned = EnumUtils.looseEquals(
    assignedAccount?.parentOrGuardianAssignmentStatus,
    ParentOrGuardianAssignmentStatusEnum.Assigned,
    ParentOrGuardianAssignmentStatusEnum
  );

  return (
    <div>
      <UserPanel assignedAccount={assignedAccount} asContainer />
      {isAssigned && (
        <SettingsPanel assignedAccount={assignedAccount} asContainer />
      )}
    </div>
  );
};

export default LinkedUser;
