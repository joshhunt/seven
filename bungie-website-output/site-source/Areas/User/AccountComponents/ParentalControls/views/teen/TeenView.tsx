import React, { FC } from "react";
import { PageTemplate, AlertNotification } from "../../components";
import { WarningRounded } from "@mui/icons-material";
import { Localizer } from "@bungie/localization";

const TeenView: FC = () => {
  /* Loc Strings*/
  const ParentalControlsLoc = Localizer.parentalcontrols;
  const alertTitle = ParentalControlsLoc.TeenAlertTitle;
  const alertMessage = ParentalControlsLoc.TeenNotificationMessage;

  return (
    <PageTemplate faqEntryId={"blte68395781113b3b8"}>
      <AlertNotification
        alertTitle={alertTitle}
        alertMessage={alertMessage}
        icon={<WarningRounded />}
      />
    </PageTemplate>
  );
};

export default TeenView;
