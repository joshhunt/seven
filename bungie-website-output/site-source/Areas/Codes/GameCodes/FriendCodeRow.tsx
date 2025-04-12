// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { Button, Typography } from "plxp-web-ui/components/base";
import React, { useState } from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { FiCheck, FiLink } from "react-icons/fi";
import styles from "./FriendCodes.module.scss";

interface FriendCodeRowProps {
  code: string;
  index: number;
}
export const FriendCodeRow: React.FC<FriendCodeRowProps> = ({
  code,
  index,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const { mobile } = useDataStore(Responsive);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className={`${styles.codeCard}`}>
      <div className={styles.codeHeader}>
        <Typography
          align="left"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="body1"
          className={styles.codeTitle}
        >
          Marathon Alpha Invite Link
        </Typography>
      </div>

      <div className={styles.codeContent}>
        <div className={styles.codeDetails}>
          <div className={styles.codeValue}>
            <Typography
              align="left"
              color="textPrimary"
              themeVariant="bungie-core"
              variant="body2"
              className={styles.codeText}
            >
              {`Invite #${index + 1}`}
            </Typography>
            <Button
              className={styles.copyLinkButton}
              color="primary"
              onClick={handleCopyLink}
              themeVariant="bungie-core"
              variant="contained"
              startIcon={copiedLink ? <FiCheck /> : <FiLink />}
            >
              {copiedLink
                ? "Copied!"
                : mobile
                ? "Copy Link"
                : "Copy Invite Link"}
            </Button>
          </div>
          <div className={styles.codeActions}></div>
        </div>
      </div>
    </div>
  );
};
