// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { LegalRouteParams } from "@Routes/RouteParams";
import { Error404 } from "@UI/Errors/Error404";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Timestamp } from "@UI/Utility/Timestamp";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./LegalDetail.module.scss";

interface LegalDetailProps {
  bannerRef: React.MutableRefObject<HTMLDivElement | null>;
}

/**
 * Show the details of the legal page in question
 * @param children
 * @param bannerRef
 * @constructor
 */
export const LegalDetail: React.FC<LegalDetailProps> = ({ bannerRef }) => {
  const params = useParams<LegalRouteParams>();

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [data, setData] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("legal_page")
      .Query()
      .where("url", `/${params.pageName.toLowerCase()}`)
      .language(locale)
      .toJSON()
      .find()
      .then(setData);
  }, [locale, params]);

  // Assume there's only one match because otherwise we have a URL collision
  const legalPageDetail = data?.[0]?.[0];

  if (!legalPageDetail) {
    return null;
  }

  const { title, last_updated_date, content } = legalPageDetail;

  // Convert the date to a nice string
  const updatedTimePretty = <Timestamp time={last_updated_date} />;
  const lastUpdatedLabel = Localizer.FormatReact(
    Localizer.Time.LastUpdatedTimeago,
    { timeAgo: updatedTimePretty }
  );

  // Don't attempt to render if we have no bannerRef yet. This happens on first render usually.
  if (!bannerRef?.current) {
    return <SpinnerContainer loading={true} />;
  }

  if (legalPageDetail.url === "/paymentservicesact") {
    return <Error404 />;
  }

  return (
    <>
      <BungieHelmet title={title} />
      <div className={styles.wrapper}>
        <LegalBanner bannerRef={bannerRef}>
          <h2>{Localizer.Nav.legal}</h2>
        </LegalBanner>
        <h3>
          <span>{title}</span>
          <time>{lastUpdatedLabel}</time>
        </h3>
        <div dangerouslySetInnerHTML={sanitizeHTML(content)} />
      </div>
    </>
  );
};

/**
 * This creates a portal that will render inside the bannerRef that was passed in
 * @param bannerRef The place to render this content
 * @param children Content to render
 * @constructor
 */
const LegalBanner: React.FC<PropsWithChildren<LegalDetailProps>> = ({
  bannerRef,
  children,
}) => {
  return ReactDOM.createPortal(children, bannerRef?.current);
};
