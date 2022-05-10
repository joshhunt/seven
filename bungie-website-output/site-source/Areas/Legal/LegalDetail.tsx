// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { LegalDetailQuery } from "@Areas/Legal/__generated__/LegalDetailQuery.graphql";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { NotFoundError } from "@CustomErrors";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { LegalRouteParams } from "@Routes/RouteParams";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useParams } from "react-router";
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
  const data = useLazyLoadQuery<LegalDetailQuery>(
    graphql`
      query LegalDetailQuery($url: String!, $locale: String!) {
        all_legal_page(
          where: { url: $url }
          locale: $locale
          fallback_locale: true
        ) {
          items {
            title
            content
            last_updated_date
          }
        }
      }
    `,
    {
      url: `/${params.url.toLowerCase()}`,
      locale,
    }
  );

  const matchingLegalPages = data.all_legal_page.items;

  if (!matchingLegalPages?.length) {
    throw new NotFoundError();
  }

  // Assume there's only one match because otherwise we have a URL collision
  const legalPageDetail = matchingLegalPages[0];

  const { title, last_updated_date, content } = legalPageDetail;

  // Convert the date to a nice string
  const updatedTimePretty = moment(last_updated_date).fromNow();
  const lastUpdatedLabel = Localizer.Format(Localizer.Time.LastUpdatedTimeago, {
    timeAgo: updatedTimePretty,
  });

  // Don't attempt to render if we have no bannerRef yet. This happens on first render usually.
  if (!bannerRef?.current) {
    return <SpinnerContainer loading={true} />;
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
const LegalBanner: React.FC<LegalDetailProps> = ({ bannerRef, children }) => {
  return ReactDOM.createPortal(children, bannerRef?.current);
};
