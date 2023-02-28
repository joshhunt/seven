// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import Helmet from "react-helmet";

interface IBungieHelmetProps {
  /** Sets <title> */
  title?: string;
  /** Sets og:description, and twitter:description */
  description?: string;
}

interface DefaultProps {
  /** Sets og:image and twitter:image (defaults to Bungie logo) */
  image: string;
  children?: React.ReactNode;
}

interface IBungieHelmetState {}

/**
 * BungieHelmet - Wrapper for Helmet that handles more complex stuff
 *  *
 * @param {IBungieHelmetProps} props
 * @returns
 */
export class BungieHelmet extends React.Component<
  IBungieHelmetProps & DefaultProps,
  IBungieHelmetState
> {
  /** Use this if you know you want the Bungie logo as the meta image, because it'll get rid fo the Toast */
  public static readonly DefaultBoringMetaImage =
    "/img/theme/bungienet/logo-share-large.png?on-purpose=true";

  constructor(props: IBungieHelmetProps & DefaultProps) {
    super(props);

    this.state = {};
  }

  public static defaultProps = {
    image: BungieHelmet.DefaultBoringMetaImage,
  };

  public render() {
    const { title, description, children } = this.props;

    const image = this.props.image
      ? this.props.image
      : BungieHelmet.DefaultBoringMetaImage;

    let imageWithHostname = image;

    // don't reconstruct the image URL if it starts with an HTTP scheme
    if (!image.startsWith("http://") && !image.startsWith("https://")) {
      if (image.indexOf(location.hostname) === -1) {
        const slash = image.startsWith("/") ? "" : "/";
        imageWithHostname = `${location.protocol}//${location.hostname}${slash}${image}`;
      }
    }

    return (
      <Helmet>
        {title && <title>{title}</title>}
        {title && <meta property={"og:title"} content={title} />}
        {title && <meta property={"twitter:title"} content={title} />}
        {image && <meta property={"og:image"} content={imageWithHostname} />}
        {image && (
          <meta property={"twitter:image"} content={imageWithHostname} />
        )}
        {description && (
          <meta property={"og:description"} content={description} />
        )}
        {description && (
          <meta property={"twitter:description"} content={description} />
        )}

        {children}
      </Helmet>
    );
  }
}
