// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import Helmet from "react-helmet";

export const GoogleTagManagerLoader = () => {
  if (
    !UserUtils.CookieConsentIsEnabled() ||
    !UserUtils.CookieConsentIsCurrent()
  ) {
    return null;
  }

  const googleTagManagerFunction = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','GTM-MQ5FZJQ');`;

  return (
    <>
      <Helmet>
        <script>{googleTagManagerFunction}</script>
      </Helmet>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-MQ5FZJQ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
};
