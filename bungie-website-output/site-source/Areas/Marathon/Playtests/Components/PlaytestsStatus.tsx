import React, { FC } from "react";
import { ClientDeviceType } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import styles from "./PlaytestsStatus.module.scss";
import sharedStyles from "./PlaytestSharedStyles.module.scss";
import { CodeRow } from "@Areas/Codes/GameCodes/CodeRowItem";
import { useMarketplaceCodes } from "@Areas/Marathon/Playtests/utils/useMarketplaceCodes";
import { Img } from "@Helpers";

export const PlaytestsStatus: FC = () => {
  const { codes, loading, error } = useMarketplaceCodes();
  const NoCodesMessage = () => (
    <div className={styles.noCodesMessage}>
      You don't have any game codes available.
    </div>
  );

  return (
    <div className={sharedStyles.container}>
      <img
        className={sharedStyles.img}
        src={Img("/marathon/icons/check.svg")}
        alt="You’ve Been Selected"
      />
      <h1 className={sharedStyles.title}>You’ve Been Selected</h1>
      {loading && (
        <div className={styles.loadingContainer}>Loading game codes...</div>
      )}
      {!loading && error && (
        <div className={styles.noCodesMessage}>Failed to load codes.</div>
      )}
      {!loading &&
        !error &&
        (codes.length === 0 ? (
          <NoCodesMessage />
        ) : (
          <>
            <span className={sharedStyles.subtitle}>
              Redeem your code on the platform shown below. If you previously
              played during Community Playtests, you can just update or
              re-download the game from your library.
            </span>
            <div className={styles.codeSection}>
              {codes.map((code) => (
                <CodeRow
                  key={code.platformCode}
                  title={code.OfferDisplayName}
                  platform={EnumUtils.getStringValue(
                    code.deviceType,
                    ClientDeviceType
                  )}
                  code={code.platformCode}
                />
              ))}
            </div>
          </>
        ))}
    </div>
  );
};
