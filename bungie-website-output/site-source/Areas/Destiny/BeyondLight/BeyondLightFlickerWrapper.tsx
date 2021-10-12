import {
  BeyondLightMainNav,
  BeyondLightPage,
} from "@Areas/Destiny/BeyondLight/BeyondLightMainNav";
import { BeyondLightUpdateDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { BeyondLightPhaseTwoDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseTwoDataStore";
import { BeyondLightPhaseThreeDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseThreeDataStore";
import { BeyondLightPhaseFourDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseFourDataStore";

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { AsyncRoute } from "@Routes/AsyncRoute";
import { RouteDefs } from "@Routes/RouteDefs";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import React from "react";
import { useHistory } from "react-router";

export const BeyondLightFlickerWrapper = React.memo(() => {
  const beyondlightLoc = Localizer.Beyondlight;
  const beyondLightUpdateData = useDataStore(BeyondLightUpdateDataStore);
  const beyondLightPhaseTwoData = useDataStore(BeyondLightPhaseTwoDataStore);
  const beyondLightPhaseThreeData = useDataStore(
    BeyondLightPhaseThreeDataStore
  );
  const beyondLightPhaseFourData = useDataStore(BeyondLightPhaseFourDataStore);

  return (
    <>
      <BungieHelmet
        title={beyondlightLoc.BeyondLight}
        description={beyondlightLoc.gobeyondDesc}
        image={
          "/7/ca/destiny/products/beyondlight/bungie_net_metadata_beyondlight_1920x1080.jpg"
        }
      >
        <body
          className={SpecialBodyClasses(
            BodyClasses.HideServiceAlert |
              BodyClasses.NoSpacer |
              BodyClasses.HideMainNav
          )}
        />
      </BungieHelmet>
      <NavWrapper
        phaseOneActive={beyondLightUpdateData.phaseOneActive}
        phaseTwoActive={beyondLightPhaseTwoData.phaseTwoActive}
        phaseThreeActive={
          ConfigUtils.SystemStatus("BeyondLightPhase3") &&
          beyondLightPhaseThreeData.phaseThreeActive
        }
        phaseFourActive={
          ConfigUtils.SystemStatus("BeyondLightPhase4") &&
          beyondLightPhaseFourData.phaseFourActive
        }
      />
      <AsyncRoute
        component={() =>
          import(
            "@Areas/Destiny/BeyondLight/BeyondLight" /* webpackChunkName: "Destiny-BeyondLight" */
          )
        }
      />
    </>
  );
});

interface INavWrapperProps {
  phaseOneActive: boolean;
  phaseTwoActive?: boolean;
  phaseThreeActive?: boolean;
  phaseFourActive?: boolean;
}

const NavWrapper: React.FC<INavWrapperProps> = ({
  phaseOneActive,
  phaseTwoActive,
  phaseThreeActive,
  phaseFourActive,
}) => {
  const history = useHistory();
  const beyondLightPhase1 = RouteDefs.Areas.Destiny.getAction("PhaseOne").path;
  const beyondLightPhase2 = RouteDefs.Areas.Destiny.getAction("PhaseTwo").path;
  const beyondLightPhase3 = RouteDefs.Areas.Destiny.getAction("PhaseThree")
    .path;
  const beyondLightPhase4 = RouteDefs.Areas.Destiny.getAction(
    "BeyondLightPhaseFour"
  ).path;
  const beyondLightPath = RouteDefs.Areas.Destiny.getAction("BeyondLight").path;
  const beyondLightMediaPath = RouteDefs.Areas.Destiny.getAction("Media").path;

  const pagePaths: { [page in BeyondLightPage]: string } = {
    index: beyondLightPath,
    media: beyondLightMediaPath,
    stasis: beyondLightPhase1,
    europa: beyondLightPhase2,
    gear: beyondLightPhase3,
    story: beyondLightPhase4,
  };

  const matchingPath: BeyondLightPage = Object.keys(
    pagePaths
  ).find((p: BeyondLightPage) =>
    UrlUtils.UrlMatchesPath(pagePaths[p])
  ) as BeyondLightPage;

  return (
    <BeyondLightMainNav
      page={matchingPath}
      phaseOne={phaseOneActive}
      phaseTwo={phaseTwoActive}
      phaseThree={phaseThreeActive}
      phaseFour={phaseFourActive}
      history={history}
    />
  );
};
