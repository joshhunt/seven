import React, { FC } from "react";
import { ClientDeviceType } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import styles from "@Areas/Codes/GameCodes/GameCodesSection.module.scss";
import { CodeRow } from "@Areas/Codes/GameCodes/CodeRowItem";
import { useMarketplaceCodes } from "@Areas/Marathon/Playtests/Hooks/useMarketplaceCodes";

export const PlaytestsStatus: FC = () => {
  const { codes, loading, error } = useMarketplaceCodes();

  const NoCodesMessage = () => (
    <div className={styles.noCodesMessage}>
      You don't have any game codes available.
    </div>
  );

  return (
    <>
      <h1 className={styles.loadingContainer}>
        Welcome to the Marathon Technical Playtest
      </h1>
      {loading && (
        <div className={styles.loadingContainer}>Loading game codes...</div>
      )}
      {!loading && error && (
        <div className={styles.noCodesMessage}>Failed to load codes.</div>
      )}
      {!loading &&
        !error &&
        (codes?.length === 0 ? (
          <NoCodesMessage />
        ) : (
          codes?.map((code, index) => (
            <CodeRow
              key={index}
              title={code.OfferDisplayName}
              platform={EnumUtils.getStringValue(
                code.deviceType,
                ClientDeviceType
              )}
              code={code.platformCode}
            />
          ))
        ))}
    </>
  );
};
