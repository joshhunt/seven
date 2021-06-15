import styles from "@Areas/Registration/Apps.module.scss";
import { Content } from "@Platform";
import { UrlUtils } from "@Utilities/UrlUtils";
import React from "react";
import stylesRegistration from "./ContentItemRegistration.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@Global/Localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import {
  RegistrationBlockTypeConfig,
  RegistrationBlockTypeDefinition,
} from "./RegistrationBlockTypeDefinitions";
import { HelpArticlesContentSet } from "./HelpContentItem";

const DEBUG_REPEAT_NUMBER = 0;

export interface IRegistrationContentItemProps {
  contentItem: Content.ContentItemPublicContract;
  noTitles?: boolean;
  definition?: RegistrationBlockTypeDefinition;
  itemClassName?: string;
}

/**
 * RegistrationContentItem - used to render contentItems in the Registration Area Only
 *  *
 * @param {IRegistrationContentItemProps} props
 * @returns
 */
export const RegistrationContentItem: React.FC<IRegistrationContentItemProps> = (
  props: IRegistrationContentItemProps
) => {
  const contentItem = props.contentItem;

  if (typeof contentItem === "undefined") {
    return null;
  }

  if (
    contentItem.cType === "ContentSet" &&
    contentItem.properties["ContentItems"]?.length
  ) {
    const childBlockTypeDefinition = RegistrationBlockTypeConfig.find(
      (d) => contentItem.properties["ContentItems"][0].tags.indexOf(d.tag) > -1
    );

    if (contentItem.tags.indexOf("registration-benefits-help") > -1) {
      return (
        <HelpArticlesContentSet
          contentItem={contentItem}
          definition={childBlockTypeDefinition}
        />
      );
    } else {
      return (
        <ContentSet
          contentItem={contentItem}
          definition={childBlockTypeDefinition}
          noTitles={props.noTitles}
        />
      );
    }
  } else {
    if (contentItem.properties["BannerType"]?.length > 0) {
      return <GenericBanner contentItem={contentItem} />;
    }

    const def = RegistrationBlockTypeConfig.find(
      (d) => contentItem.tags.indexOf(d.tag) > -1
    );

    if (typeof def !== "undefined") {
      if (DEBUG_REPEAT_NUMBER?.valueOf() > 0) {
        //debugging - chose a number to repeat the blocks
        const array = new Array(DEBUG_REPEAT_NUMBER).fill("");

        return (
          <React.Fragment>
            {array.map((i) => (
              <RegistrationItemContent
                contentItem={contentItem}
                definition={def}
                key={i}
              />
            ))}
          </React.Fragment>
        );
      }

      return (
        <RegistrationItemContent
          contentItem={contentItem}
          definition={def}
          itemClassName={props.itemClassName}
        />
      );
    }

    console.log(
      `Content type missing Definition on Registration Page: ${contentItem}`
    );
  }

  return null;
};

export const ContentSet: React.FC<IRegistrationContentItemProps> = (
  props: IRegistrationContentItemProps
) => {
  const contentItem = props.contentItem;
  const def = props.definition;

  const className = classNames(
    stylesRegistration.container,
    typeof def.wrapperClassName !== "undefined"
      ? stylesRegistration[def.wrapperClassName]
      : ""
  );

  const hyperLinkContentDefined =
    contentItem.properties["HyperLink"]?.length > 0;

  return (
    <div className={className}>
      {props.noTitles ? (
        <div className={styles.emptyStyling} />
      ) : (
        <>
          <h3>{contentItem.properties["Title"]}</h3>
          <p>{contentItem.properties["Summary"]}</p>
        </>
      )}
      {hyperLinkContentDefined &&
        def?.wrapperLinkLabelLocKey?.length > 0 &&
        Localizer.Registrationbenefits[def.wrapperLinkLabelLocKey]?.length >
          0 && (
          <Anchor url={contentItem.properties["LinkName"]}>
            {linkButtonLabel(
              contentItem,
              Localizer.Registrationbenefits[def.wrapperLinkLabelLocKey]
            )}
          </Anchor>
        )}
      <div className={stylesRegistration.blocks}>
        {contentItem.properties["ContentItems"].map((item: any) => (
          <RegistrationContentItem
            contentItem={item}
            key={`${item.contentId}-${Date.UTC}`}
            definition={def}
          />
        ))}
      </div>
    </div>
  );
};

export const RegistrationItemContent: React.FC<IRegistrationContentItemProps> = (
  props: IRegistrationContentItemProps
) => {
  const contentItem = props.contentItem;
  const def = props.definition;

  const hyperLinkContentDefined =
    contentItem.properties["Hyperlink"]?.length > 0;
  const hasIcon = contentItem.properties["Icon"]?.length > 0;

  const hasCustomHtml = contentItem.properties["CustomHTML"]?.length > 0;

  if (hasCustomHtml) {
    return contentItem.properties["CustomHTML"];
  }

  if (def.tag === "registration-community" || def.tag === "registration-apps") {
    return (
      <div className={stylesRegistration[def.blockClassName]}>
        <div
          className={stylesRegistration.background}
          style={{ backgroundImage: `url(${contentItem.properties["Image"]})` }}
        />
      </div>
    );
  }

  const hyperlink = contentItem.properties["Hyperlink"];
  const hyperlinkHost =
    hyperlink.split("//")[1]?.split("/")[0]?.replace("www.", "") ?? "";

  const analyticsId =
    !UrlUtils.isBungieNetUrl(hyperlinkHost) && hyperlinkHost.length > 0
      ? `registration-${hyperlinkHost}`
      : "";

  return (
    <div
      className={classNames(stylesRegistration[def.blockClassName], {
        [props.itemClassName]: props.itemClassName,
      })}
    >
      <div
        className={stylesRegistration.background}
        style={{ backgroundImage: `url(${contentItem.properties["Image"]})` }}
      />
      <div className={stylesRegistration.content}>
        {hasIcon && (
          <span
            className={stylesRegistration.icon}
            style={{
              backgroundImage: `url(${contentItem.properties["Icon"]})`,
            }}
          />
        )}
        <div>
          <strong>{contentItem.properties["Title"]}</strong>
          <p>{contentItem.properties["SubTitle"]}</p>
          {hyperLinkContentDefined && (
            <React.Fragment>
              {props.definition.hasButton && (
                <Button
                  url={hyperlink}
                  buttonType={"gold"}
                  analyticsId={analyticsId}
                >
                  {linkButtonLabel(contentItem)}
                </Button>
              )}
              {props.definition.hasLink && (
                <Anchor url={hyperlink}>{linkButtonLabel(contentItem)}</Anchor>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export const GenericBanner: React.FC<IRegistrationContentItemProps> = (
  props: IRegistrationContentItemProps
) => {
  const contentItem = props.contentItem;
  const leftAlign =
    props.contentItem.properties["BannerType"] === "leftAligned";

  return (
    <div
      className={classNames(stylesRegistration.genericBanner, {
        [stylesRegistration.leftAligned]: leftAlign,
      })}
      style={{ backgroundImage: `url(${contentItem.properties["Image"]})` }}
    >
      <strong>{contentItem.properties["Title"]}</strong>
      <p>{contentItem.properties["SubTitle"]}</p>
    </div>
  );
};

const linkButtonLabel = (
  cItem: Content.ContentItemPublicContract,
  customLabel = ""
) => {
  // generates a label for a link/button if there is none
  if (customLabel.length) {
    return customLabel;
  }

  if (cItem.properties["HyperlinkLabel"]?.length > 0) {
    return cItem.properties["HyperlinkLabel"];
  }

  return "Needs Label";
};
