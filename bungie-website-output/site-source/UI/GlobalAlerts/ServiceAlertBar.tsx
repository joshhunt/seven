import { Respond } from "@Boot/Respond";
import { IResponsiveState, ResponsiveSize } from "@Boot/Responsive";
import { GlobalAlertLevel, GlobalAlertType } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./ServiceAlertBar.module.scss";

interface IServiceAlertProps extends GlobalStateComponentProps<"responsive"> {}

interface IServiceAlertState {
  contentItem: Content.ContentItemPublicContract[];
}

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IServiceAlertProps} props
 * @returns
 */
class ServiceAlertBarInner extends React.Component<
  IServiceAlertProps,
  IServiceAlertState
> {
  constructor(props: IServiceAlertProps) {
    super(props);

    this.state = {
      contentItem: null,
    };
  }

  public componentDidMount() {
    Platform.ContentService.GetContentByTagAndType(
      "global-alert-content-set",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    ).then((contentSet) => {
      if (contentSet) {
        const allItems: Content.ContentItemPublicContract[] =
          contentSet.properties["ContentItems"];
        const globalAlerts = allItems.filter((i) => i.cType === "GlobalAlert");

        this.setState({
          contentItem: globalAlerts,
        });
      }
    });
  }

  public render() {
    return (
      <div className={styles.wrapper}>
        {this.state.contentItem?.map((firehoseItem, i) => {
          return (
            <GlobalAlert
              key={i}
              globalAlert={firehoseItem}
              responsiveState={this.props.globalState.responsive}
            />
          );
        })}
      </div>
    );
  }
}

interface IGlobalAlertProps {
  globalAlert: Content.ContentItemPublicContract;
  responsiveState: IResponsiveState;
}

const GlobalAlert = (props: IGlobalAlertProps) => {
  const alert = props.globalAlert.properties;
  let alertLevelString = isNaN(alert.AlertLevel)
    ? alert.AlertLevel
    : GlobalAlertLevel[alert.AlertLevel];

  document.documentElement.classList.add("service-alert-shown");

  if (alertLevelString === "Unknown") {
    alertLevelString = GlobalAlertLevel[3];
  }

  alert.AlertType = GlobalAlertType.GlobalAlert;
  alert.AlertTimestamp = alert.creationDate;
  const alertKey = alert.CannedMessage;

  const alertLink =
    alert.AlertLink !== null &&
    typeof alert.AlertLink === "string" &&
    !StringUtils.isNullOrWhiteSpace(alert.AlertLink)
      ? alert.AlertLink.toLowerCase()
      : RouteHelper.Help();

  return (
    <Anchor url={alertLink}>
      <div
        className={classNames(
          styles.globalServiceAlertBar,
          styles[alertLevelString.toLowerCase()]
        )}
        key={alert.Title}
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
            responsive={props.responsiveState}
          >
            <AlertMessage customHTML={alert.CustomHTML} alertKey={alertKey} />
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
    <div> {Localizer.Globals[backupMessage]} </div>
  );
};

export const ServiceAlertBar = withGlobalState(ServiceAlertBarInner, [
  "responsive",
]);
