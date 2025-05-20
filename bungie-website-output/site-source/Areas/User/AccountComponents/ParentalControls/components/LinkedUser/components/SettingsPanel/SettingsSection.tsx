import React, { FC, ReactNode } from "react";
import { Typography } from "plxp-web-ui/components/base";
import { Divider } from "@mui/material";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  heading: string;
  subheading?: string;
  children?: ReactNode;
  subSection?: boolean;
}

const SettingsSection: FC<SettingsPanelProps> = ({
  heading,
  subheading,
  subSection,
  children,
}) => {
  const headingVariant = subSection ? "caption" : "body1";

  return (
    <div className={styles.sectionContainer}>
      <Typography variant={headingVariant} sx={{ fontWeight: 700 }}>
        {heading}
      </Typography>
      {!subSection && (
        <Divider
          sx={(theme) => ({
            borderColor: theme.palette.custom.dividerSecondary,
            borderWidth: "1px",
          })}
        />
      )}
      {subheading && (
        <p
          className={styles.sectionCopy}
          dangerouslySetInnerHTML={sanitizeHTML(subheading)}
        />
      )}
      {children ? children : null}
    </div>
  );
};

export default SettingsSection;
