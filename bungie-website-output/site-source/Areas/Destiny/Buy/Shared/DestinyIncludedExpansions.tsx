import React, { FC, useEffect, useState } from "react";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { BorderedTitle } from "@Areas/Destiny/Buy/Components";
import { GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import styles from "./DestinyIncludedExpansions.module.scss";

interface DestinyIncludedExpansionsProps {
  entryId?: string;
  contentUid?: string;
}

const DestinyIncludedExpansions: FC<DestinyIncludedExpansionsProps> = ({
  entryId,
  contentUid,
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (entryId && contentUid) {
      ContentStackClient()
        .ContentType(contentUid)
        .Entry(entryId)
        .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
        .toJSON()
        .fetch()
        .then(setData);
    }
  }, []);
  const { Trailer } = Localizer.Buyflow;

  return data?.uid ? (
    <>
      {data?.section_name && (
        <BorderedTitle
          sectionTitle={data.section_name}
          classes={{ wrapper: styles.borderSpacing }}
        />
      )}
      <GridCol cols={12} className={styles.container}>
        {data?.edge_of_fate_bg?.url && (
          <div
            style={{ backgroundImage: `url(${data.edge_of_fate_bg.url})` }}
            className={styles.backgroundItem}
          >
            {data?.edge_of_fate_logo?.url && (
              <img src={data.edge_of_fate_logo.url} className={styles.logo} />
            )}
            {data?.edge_of_fate_date && (
              <p className={styles.date}>{data.edge_of_fate_date}</p>
            )}
          </div>
        )}
        {data?.renegades_bg?.url && (
          <div
            style={{ backgroundImage: `url(${data.renegades_bg.url})` }}
            className={styles.backgroundItem}
          >
            {data?.renegades_logo?.url && (
              <img src={data.renegades_logo.url} className={styles.logo} />
            )}
            {data?.renegades_date && (
              <p className={styles.date}>{data?.renegades_date}</p>
            )}
          </div>
        )}
      </GridCol>
      <BorderedTitle
        sectionTitle={Trailer}
        classes={{ wrapper: styles.borderSpacing }}
      />
    </>
  ) : null;
};

export default DestinyIncludedExpansions;
