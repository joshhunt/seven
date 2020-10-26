import { Content, Platform } from "@Platform";
import React, { useState } from "react";
import stylesRegistration from "./ContentItemRegistration.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@Global/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import classNames from "classnames";
import {
  RegistrationBlockTypeConfig,
  RegistrationBlockTypeDefinition,
} from "./RegistrationBlockTypeDefinitions";
import { HelpArticlesContentSet } from "./HelpContentItem";

const DEBUG_REPEAT_NUMBER = 0;

export interface IRegistrationContentItemProps {
  contentItem: Content.ContentItemPublicContract;
  definition?: RegistrationBlockTypeDefinition;
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
        <RegistrationItemContent contentItem={contentItem} definition={def} />
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
      <h3>{contentItem.properties["Title"]}</h3>
      <p>{contentItem.properties["Summary"]}</p>
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
        {contentItem.properties["ContentItems"].map((item) => (
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
          style={{
            backgroundImage: `url(${getFirehoseImage(
              contentItem.properties["Image"]
            )})`,
          }}
        />
      </div>
    );
  }

  return (
    <div className={stylesRegistration[def.blockClassName]}>
      <div
        className={stylesRegistration.background}
        style={{
          backgroundImage: `url(${getFirehoseImage(
            contentItem.properties["Image"]
          )})`,
        }}
      />
      <div className={stylesRegistration.content}>
        {hasIcon && (
          <span
            className={stylesRegistration.icon}
            style={{
              backgroundImage: `url(${getFirehoseImage(
                contentItem.properties["Icon"]
              )})`,
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
                  url={contentItem.properties["Hyperlink"]}
                  buttonType={"gold"}
                >
                  {linkButtonLabel(contentItem)}
                </Button>
              )}
              {props.definition.hasLink && (
                <Anchor url={contentItem.properties["Hyperlink"]}>
                  {linkButtonLabel(contentItem)}
                </Anchor>
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
      style={{
        backgroundImage: `url(${getFirehoseImage(
          contentItem.properties["Image"]
        )})`,
      }}
    >
      <strong>{contentItem.properties["Title"]}</strong>
      <p>{contentItem.properties["SubTitle"]}</p>
    </div>
  );
};

//
// can go away since this is all for debugging
//
const getFirehoseImage = (path) => {
  return path;

  //gets the image from bnetdev since I don't get the firehose assets
  //return `https://bnetdev.bungie.bng.local${path}`;
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
