import React, { FC } from "react";
import { SettingsPanel, UserPanel } from "../components";

interface LinkedUserProps {
  assignedAccount: any;
  currentUserType?: any;
}

const LinkedUser: FC<LinkedUserProps> = ({
  currentUserType,
  assignedAccount,
}) => (
  <div>
    <UserPanel
      assignedAccount={assignedAccount}
      currentUserType={currentUserType}
      asContainer
    />
    {assignedAccount?.parentOrGuardianAssignmentStatus === 2 && (
      <SettingsPanel
        currentUserType={currentUserType}
        assignedAccount={assignedAccount}
        asContainer
      />
    )}
  </div>
);

export default LinkedUser;
