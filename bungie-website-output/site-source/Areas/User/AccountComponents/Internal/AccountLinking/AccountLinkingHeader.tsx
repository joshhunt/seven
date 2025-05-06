import React from "react";
import accountStyles from "@Areas/User/Account.module.scss";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";

interface AccountLinkingHeaderProps {
  heading: string;
  subheading: string;
}

export const AccountLinkingHeader: React.FC<AccountLinkingHeaderProps> = ({
  heading,
  subheading,
}) => {
  return (
    <>
      <GridCol cols={12}>
        <h3>{heading}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.sectionDivider} />
      <GridCol cols={12}>
        <p
          className={accountStyles.sectionSubheader}
          dangerouslySetInnerHTML={sanitizeHTML(subheading)}
        />
      </GridCol>
    </>
  );
};
