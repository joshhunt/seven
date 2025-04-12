import React, { useMemo } from "react";
import { Button } from "plxp-web-ui/components/base";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import {
  BnetStackFile,
  BnetStackLink,
  BnetStackResponsiveBgImages,
} from "../../../../Generated/contentstack-types";
import styles from "./CallToAction.module.scss";

interface CareersSectionProps {
  sectionLabel?: string;
  heading?: string;
  buttons?: {
    primary?: { link?: BnetStackLink };
    secondary?: { link?: BnetStackLink };
  };
  logoImage?: BnetStackFile;
  backgroundImages: BnetStackResponsiveBgImages;
}

const CallToAction: React.FC<CareersSectionProps> = ({
  backgroundImages,
  buttons,
  heading,
  logoImage,
  sectionLabel,
}) => {
  const { mobile } = useDataStore(Responsive);
  const image = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile
          ? backgroundImages?.mobile_bg?.url ??
            backgroundImages?.desktop_bg?.url
          : backgroundImages?.desktop_bg?.url,
      }),
      [backgroundImages, mobile]
    )
  )?.background;

  const sectionBackground = image
    ? {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return heading || buttons?.primary?.link?.title ? (
    <Grid>
      {sectionLabel && (
        <GridCol cols={12}>
          <div className={styles.header}>
            <span>{sectionLabel}</span>
          </div>
        </GridCol>
      )}
      <GridCol
        cols={12}
        className={styles.container}
        style={{ ...sectionBackground }}
      >
        <div className={styles.content}>
          <GridCol cols={12}>
            {logoImage?.url && (
              <img className={styles.logo} src={logoImage?.url} />
            )}
            {heading && <div className={styles.sectionTitle}>{heading}</div>}
            {(buttons?.primary?.link?.title ||
              buttons?.secondary?.link?.title) && (
              <div className={styles.buttons}>
                {buttons?.primary?.link && (
                  <Button
                    themeVariant="bungie-core"
                    variant="contained"
                    size={"medium"}
                    href={buttons?.primary?.link?.href}
                  >
                    {buttons?.primary?.link?.title}
                  </Button>
                )}
                {buttons?.secondary?.link && (
                  <Button
                    themeVariant="bungie-core"
                    variant="contained"
                    size={"medium"}
                    className={styles.secondaryBlue}
                    href={buttons?.secondary?.link?.href}
                  >
                    {buttons?.secondary?.link?.title}
                  </Button>
                )}
              </div>
            )}
          </GridCol>
        </div>
      </GridCol>
    </Grid>
  ) : null;
};

export default CallToAction;
