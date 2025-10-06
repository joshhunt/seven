import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { ClientDeviceType } from "@Enum";
import { FaMicrosoft } from "@react-icons/all-files/fa/FaMicrosoft";
import { FaSteam } from "@react-icons/all-files/fa/FaSteam";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";
import { SiPlaystation } from "@react-icons/all-files/si/SiPlaystation";
import { EnumUtils } from "@Utilities/EnumUtils";
import { Button, Typography } from "plxp-web-ui/components/base";
import React, { useState } from "react";
import styles from "./GameCodesSection.module.scss";

interface CodeRowProps {
  title: string;
  platform: keyof typeof ClientDeviceType;
  code: string;
}

export const CodeRow: React.FC<CodeRowProps> = ({ title, platform, code }) => {
  const [copied, setCopied] = useState(false);
  const { tiny } = useDataStore(Responsive);
  const fetchIcon = () => {
    const platformEnum = EnumUtils.getNumberValue(platform, ClientDeviceType);

    switch (platformEnum) {
      case ClientDeviceType.Playstation3:
        return <SiPlaystation />;
      case ClientDeviceType.Playstation4:
        return <SiPlaystation />;
      case ClientDeviceType.Playstation5:
        return <SiPlaystation />;
      case ClientDeviceType.Steam:
        return <FaSteam />;
      case ClientDeviceType.Xbox360:
        return <FaXbox />;
      case ClientDeviceType.XboxOne:
        return <FaXbox />;
      case ClientDeviceType.XboxSeries:
        return <FaXbox />;
      case ClientDeviceType.Egs:
        return <SiEpicgames />;
      case ClientDeviceType.MicrosoftStore:
        return <FaMicrosoft />;
      default:
        return null;
    }
  };

  const handleCopy = () => {
    if (!navigator.clipboard) {
      // This is undefined on non-https sites
      return;
    }
    navigator.clipboard.writeText(code).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 2000);
  };

  const CodeText = () => (
    <Typography
      className={styles.code}
      align="left"
      color="textPrimary"
      themeVariant="bungie-core"
      variant="body2"
    >
      {code}
    </Typography>
  );

  const CodeButton = () => (
    <Button
      className={styles.copyButton}
      color="primary"
      onClick={handleCopy}
      themeVariant="bungie-core"
      variant="contained"
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Typography
          align="left"
          color="textPrimary"
          themeVariant="bungie-core"
          variant="body1"
        >
          {title}
        </Typography>
        {fetchIcon()}
      </div>
      <div className={styles.content}>
        <span className={styles.platform}>
          Redeem this code in the {Localizer.platforms[platform]} store to claim
          your copy of Marathon.
        </span>
        <div className={styles.codeContainer}>
          {tiny ? (
            <CodeText />
          ) : (
            <>
              <CodeText />
              <CodeButton />
            </>
          )}
        </div>
        {tiny ? <CodeButton /> : null}
      </div>
    </div>
  );
};
