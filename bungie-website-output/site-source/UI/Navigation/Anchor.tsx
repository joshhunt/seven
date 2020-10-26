import * as React from "react";
import { Link } from "react-router-dom";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { UrlUtils } from "@Utilities/UrlUtils";

export interface IAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Local or external are both allowed */
  url: string | IMultiSiteLink;

  /** Use 'url' instead */
  href?: undefined;

  /** If true AND if external, we will open this link in the same tab. Otherwise, it'll be a new tab. */
  sameTab?: boolean;

  /** If true, treat as an <a /> */
  legacy?: boolean;
}

interface IAnchorState {
  shouldOpenNewTab: boolean;
  resolvedUrl: string;
  isLegacy: boolean;
}

/**
 * A smart component that will conditionally render an <a> or a <Link> depending on the URL
 *  *
 * @param {IAnchorProps} props
 * @returns
 */
export class Anchor extends React.Component<IAnchorProps, IAnchorState> {
  constructor(props: IAnchorProps) {
    super(props);

    this.state = Anchor.getDerivedStateFromProps(props);
  }

  private static getDerivedStateFromProps(props: IAnchorProps): IAnchorState {
    const urlAsString = UrlUtils.getUrlAsString(props.url);
    const anchorUrl = UrlUtils.getHrefAsLocation(urlAsString);
    const isBungieNet = UrlUtils.isBungieNet(anchorUrl);
    const shouldOpenNewTab = UrlUtils.shouldOpenNewTab(
      isBungieNet,
      props.sameTab
    );
    const urlAsMultiLink = UrlUtils.getUrlAsMultiLink(props.url, props.legacy);
    const isLegacy = urlAsMultiLink.legacy;
    const resolvedUrl = UrlUtils.resolveUrl(anchorUrl, isLegacy, isBungieNet);

    return {
      shouldOpenNewTab,
      resolvedUrl,
      isLegacy,
    };
  }

  public render() {
    const { children, legacy, url, sameTab, ...rest } = this.props;

    const { shouldOpenNewTab, resolvedUrl, isLegacy } = this.state;

    let target, rel;

    // Render a span as if it is a link, if the URL was made null on purpose
    if (!resolvedUrl) {
      return <span {...rest}>{children}</span>;
    }

    if (shouldOpenNewTab) {
      target = "_blank";
      rel = "noreferrer";
    }

    if (isLegacy) {
      return (
        <a
          href={resolvedUrl}
          target={target}
          rel={rel}
          {...rest}
          data-component={"a"}
          data-legacy={isLegacy}
        >
          {children}
        </a>
      );
    } else {
      return (
        <Link
          to={resolvedUrl}
          {...rest}
          data-component={"Link"}
          data-legacy={isLegacy}
        >
          {children}
        </Link>
      );
    }
  }
}
