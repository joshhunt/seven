import { Respond } from "@Boot/Respond";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ResponsiveSize } from "@bungie/responsive";
import { GlobalAlertLevel } from "@Enum";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { EnumUtils } from "@Utilities/EnumUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import { BnetStackGlobalAlert } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./ServiceAlertBar.module.scss";
import React, { useState, useEffect } from "react";

export const ServiceAlertBar = () => {
  const [alerts, setAlerts] = useState<BnetStackGlobalAlert[]>([]);

  const responseCacheObject: Record<string, BnetStackGlobalAlert[]> = {};
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);

  useEffect(() => {
    if (responseCacheObject[locale]) {
      setAlerts(responseCacheObject[locale]);
    } else {
      ContentStackClient()
        .ContentType("global_alert")
        .Query()
        .language(locale)
        .toJSON()
        .find()
        .then((result: BnetStackGlobalAlert[][]) => {
          responseCacheObject[locale] = result[0] ?? [];
          setAlerts(result[0] ?? []);
        });
    }
  }, [locale]);

  return (
    <div className={styles.wrapper}>
      {alerts
        ?.filter((a) => a.enabled)
        .map((alert, i) => {
          return <GlobalAlert key={i} globalAlert={alert} />;
        })}
    </div>
  );
};

interface IGlobalAlertProps {
  globalAlert: BnetStackGlobalAlert;
}

export const GlobalAlert = (props: IGlobalAlertProps) => {
  const responsive = useDataStore(Responsive);

  const {
    title,
    alert_level,
    canned_messages,
    custom_message,
    click_through_link,
  } = props.globalAlert;

  const alertLevelString = EnumUtils.getStringValue(
    alert_level ?? 3,
    GlobalAlertLevel
  ).toLowerCase();

  document.documentElement.classList.add("service-alert-shown");

  const alertKey = canned_messages;

  const alertLink = !StringUtils.isNullOrWhiteSpace(click_through_link?.href)
    ? click_through_link?.href
    : RouteHelper.Help();

  return (
    <Anchor url={alertLink}>
      <div
        className={classNames(
          styles.globalServiceAlertBar,
          styles[alertLevelString]
        )}
        key={title}
      >
        <Icon
          iconName={"exclamation-circle"}
          iconType={"fa"}
          className={styles.icon}
        />
        <div className={styles.title}>{Localizer.Errors.ServiceAlert} </div>
        {
          <Respond
            at={ResponsiveSize.mobile}
            hide={true}
            responsive={responsive}
          >
            <AlertMessage customHTML={custom_message} alertKey={alertKey} />
          </Respond>
        }
      </div>
    </Anchor>
  );
};

interface IAlertMessageProps {
  customHTML: string;
  alertKey: string;
}

const AlertMessage = (props: IAlertMessageProps) => {
  const backupMessage = `Alert${props.alertKey}`;
  // I don't know why when you leave the customHTML box empty in firehose it saves it as a "<br>" but so be it
  const useCustomHtml =
    !StringUtils.isNullOrWhiteSpace(props.customHTML) &&
    props.customHTML !== "<br>";

  return useCustomHtml ? (
    <div dangerouslySetInnerHTML={sanitizeHTML(props.customHTML)} />
  ) : (
    <div className={styles.backupMessage}>
      {" "}
      {Localizer.Globals[backupMessage]}{" "}
    </div>
  );
};
