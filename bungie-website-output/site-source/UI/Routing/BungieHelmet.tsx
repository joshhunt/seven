// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import Helmet from "react-helmet";

interface IBungieHelmetProps {
  title?: string;
  description?: string;
  url?: string;
  /** Sets og:type */
  type?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  meta?: Array<{ name?: string; property?: string; content: string }>;
}

interface DefaultProps {
  /** Sets og:image and twitter:image (defaults to Bungie logo) */
  image: string;
  type: string;
  twitterCard: "summary" | "summary_large_image" | "app" | "player";
  children?: React.ReactNode;
}

type BungieHelmetPropsWithDefaults = IBungieHelmetProps & DefaultProps;

/**
 * BungieHelmet - Wrapper for Helmet that handles more complex stuff
 *
 * @param {IBungieHelmetProps & DefaultProps} props
 * @returns {JSX.Element}
 */
export class BungieHelmet extends React.Component<
  IBungieHelmetProps & Partial<DefaultProps>
> {
  /** Use this if you know you want the Bungie logo as the meta image, because it'll get rid of the Toast */
  public static readonly DefaultBoringMetaImage =
    "/img/theme/bungienet/logo-share-large.png?on-purpose=true";

  public static defaultProps: DefaultProps = {
    image: BungieHelmet.DefaultBoringMetaImage,
    type: "website",
    twitterCard: "summary_large_image",
  };

  public render(): JSX.Element {
    const props = {
      ...BungieHelmet.defaultProps,
      ...this.props,
    } as BungieHelmetPropsWithDefaults;

    const {
      title,
      description,
      url,
      type,
      twitterCard,
      meta,
      children,
    } = props;

    const image = props.image || BungieHelmet.DefaultBoringMetaImage;

    const imageWithHostname = this.getAbsoluteUrl(image);

    const canonicalUrl = url
      ? this.getAbsoluteUrl(url)
      : typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : "";

    return (
      <Helmet>
        {title && <title>{title}</title>}

        {/* Basic Meta Tags */}
        {description && <meta name="description" content={description} />}

        {/* Canonical URL - Improvements for Google Search Console */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph */}
        <meta property="og:site_name" content="Bungie.net" />
        {title && <meta property="og:title" content={title} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {type && <meta property="og:type" content={type} />}
        {imageWithHostname && (
          <meta property="og:image" content={imageWithHostname} />
        )}
        {imageWithHostname && (
          <meta property="og:image:secure_url" content={imageWithHostname} />
        )}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:site" content="@Bungie" />
        {title && <meta name="twitter:title" content={title} />}
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {imageWithHostname && (
          <meta name="twitter:image" content={imageWithHostname} />
        )}

        {/* Additional meta tags */}
        {meta && meta.map((tag, index) => <meta key={index} {...tag} />)}

        {children}
      </Helmet>
    );
  }

  private getAbsoluteUrl(url: string): string {
    // Return if it's already an absolute URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Return if it already contains the hostname (and we're in a browser context)
    if (
      typeof window !== "undefined" &&
      window.location.hostname &&
      url.includes(window.location.hostname)
    ) {
      return url;
    }

    // Otherwise, build absolute URL
    const slash = url.startsWith("/") ? "" : "/";

    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.hostname}${slash}${url}`;
    }

    // Fallback for server-side rendering
    return `https://www.bungie.net${slash}${url}`;
  }
}
