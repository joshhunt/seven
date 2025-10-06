import * as React from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { useQualtricsEmbed } from "@Areas/Marathon/Playtests/utils/useQualtricsEmbed";
import styles from "./PlaytestsSurvey.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";

interface PlaytestsSurveyProps {}

export const PlaytestsSurvey: React.FC<PlaytestsSurveyProps> = () => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "credentialTypes",
  ]);
  const surveySrc = useQualtricsEmbed(globalState);

  return (
    <>
      <BungieHelmet>
        <script>
          {`(function () {
				  	var ALLOWED_QUALTRICS_ORIGINS = [
					  'https://yul1.qualtrics.com',
					  'https://playstationresearch.qualtrics.com'
					  ];
					  var iframe = document.getElementById('surveyFrame');
			
					  function isAllowedQualtricsOrigin(origin) {
						  return ALLOWED_QUALTRICS_ORIGINS.indexOf(origin) !== -1;
				  	}
			
				  	window.addEventListener('message', function (e) {
					  	if (!iframe || e.source !== iframe.contentWindow) return;
					  	if (!isAllowedQualtricsOrigin(e.origin)) return;
			
					  	var data = e.data || {};
			
					  	if (data.type === 'qualtrics-resize') {
						  	var h = Math.max(0, Math.ceil(Number(data.height) || 0));
						  	iframe.style.height = h + 'px';
						  	iframe.style.border = '0';
						  	iframe.style.overflow = 'hidden';
						  	iframe.setAttribute('scrolling', 'no');
					  	} else if (data.type === 'qualtrics-scroll-top') {
						  	window.scrollTo(0, 0);
						  	document.documentElement.scrollTop = 0;
						  	document.body.scrollTop = 0;
					  	}
				  	});
			  	})();`}
        </script>
      </BungieHelmet>
      <div className={styles.container}>
        <iframe
          className={styles.iframe}
          id="surveyFrame"
          title="Playtests Survey"
          src={surveySrc}
        />
      </div>
    </>
  );
};
