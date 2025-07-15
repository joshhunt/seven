import { SeasonSelect } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/SeasonSelect";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { DestinyAccountComponent } from "@UI/Destiny/DestinyAccountComponent";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import styles from "../SeasonHeaderLayout.module.scss";

interface AccountSelectProps {
  isCurrentSeason: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = ({ isCurrentSeason }) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  if (!UserUtils.isAuthenticated(globalState)) {
    return <SeasonSelect isCurrentSeason={isCurrentSeason} />;
  }

  return (
    <div className={styles.selects}>
      <SeasonSelect isCurrentSeason={isCurrentSeason} />
      <DestinyAccountComponent
        showCrossSaveBanner={true}
        showAllPlatformCharacters={true}
      >
        {(props) => (
          <div>
            <div className={styles.characterSelection}>
              {props.characterSelector}
            </div>
          </div>
        )}
      </DestinyAccountComponent>
    </div>
  );
};

export default AccountSelect;
