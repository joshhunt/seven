import React, { FC } from "react";
import { AccordionSummary, Accordion, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserPanel, SettingsPanel } from "../components";
import {
  ParentalControlsCategoryType,
  PlayerContextProps,
} from "@Areas/User/ParentalControls/types";
import { ParentalControls } from "@Platform";

interface LinkedUserAccordionProps extends ParentalControlsCategoryType {
  linkedAccount?: ParentalControls.ParentalControlsPlayerContext;
  assignedAccount?: any;
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
          linkedAccount={linkedAccount}
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
