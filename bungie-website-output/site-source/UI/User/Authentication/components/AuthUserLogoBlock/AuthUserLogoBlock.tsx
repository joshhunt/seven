import React, { FC, ReactNode } from "react";
import { Typography } from "plxp-web-ui/components/base";
import classNames from "classnames";
import { BungieCredentialType } from "@Enum";
import { CREDENTIAL_CONTENT_MAP } from "../../constants/PlatformLabels";
import styles from "./AuthUserLogoBlock.module.scss";

interface AuthUserLogoBlockProps {
  avatarUrl?: string;
  credentialType: any;
  displayName: string;
  row?: boolean;
  caption?: string;
  classes?: {
    wrapper: string;
  };
}

const AuthUserLogoBlock: FC<AuthUserLogoBlockProps> = ({
  displayName,
  credentialType,
  row,
  caption,
  avatarUrl,
  classes,
}) => {
  const WrapperElement: FC<{ children: ReactNode }> = ({ children }) =>
    row ? <div>{children}</div> : <>{children}</>;

  return (
    <div
      className={classNames(
        {
          [styles.userLogoBlockContainer]: !row,
          [styles.userLogoRowContainer]: row,
        },
        classes?.wrapper
      )}
    >
      {avatarUrl ? (
        <img src={avatarUrl} className={styles.logo} />
      ) : (
        CREDENTIAL_CONTENT_MAP?.[credentialType].logo
      )}
      <WrapperElement>
        <Typography
          variant={!row ? "h5" : "body2"}
          component={!row ? "h2" : "p"}
          sx={{ marginBottom: ".25rem" }}
        >
          {displayName}
        </Typography>
        <Typography
          variant={"caption"}
          sx={{
            marginBottom: row ? "0.5rem" : "1.5rem",
            textTransform: "capitalize",
            color: "#CBCCCD",
          }}
        >
          {CREDENTIAL_CONTENT_MAP?.[credentialType].accountLabel}
        </Typography>
        {caption && (
          <Typography variant={"caption2"} color={"#23B2FF"}>
            {caption}
          </Typography>
        )}
      </WrapperElement>
    </div>
  );
};

export default AuthUserLogoBlock;
