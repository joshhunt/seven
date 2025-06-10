import React, { FC } from "react";
import { AccordionSummary, Accordion, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserPanel, SettingsPanel } from "../components";

import { PnP } from "@Platform";

interface LinkedUserAccordionProps {
  linkedAccount?: PnP.GetPlayerContextResponse;
  assignedAccount?: PnP.GetPlayerContextResponse["assignedChildren"][number];
  currentUserType?: any;
}

const LinkedUserAccordion: FC<LinkedUserAccordionProps> = ({
  currentUserType,
  assignedAccount,
  linkedAccount,
}) => {
  return (
    <Accordion
      sx={(theme) => ({
        backgroundColor: "#181E24",
        borderRadius: theme.borderRadius.card.medium,
        boxShadow: "0px 4px 4px 0px #00000040",
        marginTop: "8px",
      })}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={(theme) => ({
              color: theme.palette.common.white,
            })}
          />
        }
      >
        <UserPanel
          assignedAccount={assignedAccount}
          currentUserType={currentUserType}
        />
      </AccordionSummary>
      <AccordionDetails>
        <SettingsPanel
          assignedAccount={assignedAccount}
          currentUserType={currentUserType}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default LinkedUserAccordion;
