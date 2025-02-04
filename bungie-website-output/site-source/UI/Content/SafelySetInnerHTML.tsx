// Created by larobinson, 2021
// Copyright Bungie, Inc.

import React, { JSXElementConstructor } from "react";
import domPurify from "dompurify";

/**
 * A function for use with React's "dangerouslySetInnerHTML" prop to sanitize html content before render.
 *
 * e.g. {
 		<div dangerouslySetInnerHTML={sanitizeHTML(html)} />
 * }
 * */

export const sanitizeHTML = (html: string) => {
  const sanitizedHtml = domPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"],
  });

  return { __html: sanitizedHtml };
};

export interface SafelySetInnerHTMLProps {
  html: string;
}

/** Always use this component when using React's "dangerouslySetInnerHTML" prop to sanitize any xss that has been potentially injected */
export const SafelySetInnerHTML: React.FC<
  SafelySetInnerHTMLProps & React.HTMLProps<HTMLDivElement>
> = (props) => {
  return (
    <span
      data-testid={"sanitized-html-renderer"}
      dangerouslySetInnerHTML={sanitizeHTML(props.html)}
    />
  );
};
