import { DestinyAccountComponent } from "@UI/Destiny/DestinyAccountComponent";
import React from "react";
import styles from "../SeasonHeaderLayout.module.scss";
import { PassToggle } from "../PassToggle";

interface AccountSelectProps {
  isCurrent: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = ({ isCurrent }) => {
  return (
    <div className={styles.selects}>
      <PassToggle isCurrent={!!isCurrent} />
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
