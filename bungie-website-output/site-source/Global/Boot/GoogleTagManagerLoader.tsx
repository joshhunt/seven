// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { CompanionPermission } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";

export const GoogleTagManagerLoader = () => {
  const [isChild, setIsChild] = useState(true); // Assume true unless otherwise

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const loggedInUser = globalState.loggedInUser;

  useEffect(() => {
    if (loggedInUser) {
      Platform.CompanionpermissionService.GetPermission(
        CompanionPermission.NotAChild
      )
        .then((result) => {
          // If state is changing from not a child to is a child, the only way to remove google analytics is to reload the browser
          if (!isChild && !result) {
            return window.location.reload();
          }
          setIsChild(!result);
        })
        .catch((e) => {
          setIsChild(false); // All errors will assume is not a child
        });
    } else {
      setIsChild(false); // User is not logged in, allow analytics
    }
  }, [loggedInUser]);

  if (
    !UserUtils.CookieConsentIsEnabled() ||
    !UserUtils.CookieConsentIsCurrent() ||
    isChild
  ) {
    return null;
  }
  const googleTagManagerFunction = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','GTM-MQ5FZJQ');`;

  const googleTagManagerDatalayerReserveFunction = `window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'TAG_ID');`;

  return (
    <>
      <Helmet>
        <script>{googleTagManagerDatalayerReserveFunction}</script>
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
