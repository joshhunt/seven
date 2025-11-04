import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { useEffect, useState } from "react";
import styles from "./Destiny2Apps.module.scss";
import { ContentStackClient } from "Platform/ContentStack/ContentStackClient";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";

import { Button } from "@UI/UIKit/Controls/Button/Button";
import { UrlUtils } from "@Utilities/UrlUtils";

interface D2CompanionApp {
  title: string;
  subtitle: string;
  link?: {
    title: string;
    href: string;
  };
  image?: {
    url: string;
  };
}

export function Destiny2Apps() {
  const [contentRenderable, setContentRenderable] = useState<D2CompanionApp[]>(
    []
  );

  useEffect(() => {
    const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
    ContentStackClient()
      .ContentType("destiny_apps")
      .Entry("bltb7f3954c5cbc5ead")
      .language(locale)
      .toJSON()
      .fetch()
      .then((data: { app: D2CompanionApp[] }) =>
        setContentRenderable(data.app)
      );
  }, []);

  if (!contentRenderable) {
    return <SpinnerContainer loading={true} />;
  }

  const registrationLoc = Localizer.Registration;
  const pageHasNoContent = registrationLoc.ThereWasAProblemLoading;
  const metaImage = "/7/ca/bungie/bgs/header_benefits.png";
  const metaTitle = Localizer.Registration.BungieCompanionApps;
  const metaSubtitle = Localizer.Registration.BungieCompanionApps;

  return (
    <React.Fragment>
      <BungieHelmet
        title={metaTitle}
        image={metaImage}
        description={metaSubtitle}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <div className={styles.header}>
        <div className={styles.devices} />
        <div className={styles.heroContent}>
          <img
            className={styles.logo}
            src={Img("/destiny/bgs/third_party_apps/destiny2logo.png")}
          />
          <img
            className={styles.line}
            src={Img("/destiny/bgs/third_party_apps/hr.png")}
          />
          <div className={styles.title}>{Localizer.Apps.HeroTitle}</div>
          <div className={styles.subtitle}>{Localizer.Apps.HeroSubtitle}</div>
        </div>
      </div>

      <div className={styles.grid}>
        {contentRenderable.length === 0 ? (
          <p>{pageHasNoContent}</p>
        ) : (
          contentRenderable.map((a) => <AppEntry key={a.title} {...a} />)
        )}
      </div>
    </React.Fragment>
  );
}

function AppEntry({ title, subtitle, link, image }: D2CompanionApp) {
  const hyperlinkHost =
    link?.href?.split("//")[1]?.split("/")[0]?.replace("www.", "") ?? "";
  const analyticsId =
    hyperlinkHost && !UrlUtils.isBungieNetUrl(hyperlinkHost)
      ? `registration-${hyperlinkHost}`
      : "";
  console.log(image);
  return (
    <div className={styles.appEntry}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${image.url})` }}
      ></div>
      <div className={styles.content}>
        <strong>{title}</strong>
        <p>{subtitle}</p>
        {link && (
          <Button url={link.href} analyticsId={analyticsId} buttonType={"gold"}>
            {link.title}
          </Button>
        )}
      </div>
    </div>
  );
}
