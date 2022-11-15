import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import classNames from "classnames";
import stylesRegistration from "./ContentItemRegistration.module.scss";
import {
  IRegistrationContentItemProps,
  RegistrationItemContent,
} from "./RegistrationContentItem";
import React, { useState } from "react";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";

export const HelpArticlesContentSet: React.FC<IRegistrationContentItemProps> = (
  props: IRegistrationContentItemProps
) => {
  const contentItem = props.contentItem;
  const definition = props.definition;

  const [helpArticlesList, setHelpArticlesList] = useState(null);

  const getTopHelpArticles = () => {
    Platform.ContentService.GetContentByTagAndType(
      "help-trending",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    ).then((contentSet: Content.ContentItemPublicContract) => {
      setHelpArticlesList(contentSet);
    });
  };

  const renderTopHelpArticles = () => {
    const contentSetItems: Content.ContentItemPublicContract[] =
      helpArticlesList.properties["ContentItems"];

    if (contentSetItems?.length > 0) {
      const topHelpArticles = Localizer.Registrationbenefits.TopHelpArticles;

      const allArticles = Localizer.Registrationbenefits.AllArticles;

      return (
        <div className={stylesRegistration.helpArticleListLinks}>
          <div className={stylesRegistration.helpArticlesHeader}>
            <strong>{topHelpArticles}</strong>
            <Anchor url={RouteHelper.Help()}>{allArticles}</Anchor>
          </div>
          <ul>
            {contentSetItems.map((item) => (
              <li key={`${item.contentId}-${Date.UTC}`}>
                <Anchor url={helpArticleLink(parseInt(item.contentId, 10))}>
                  {item.properties["Title"]}
                </Anchor>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  };

  const helpArticleLink = (id: number): string => {
    return RouteHelper.HelpArticle(id);
  };

  if (helpArticlesList === null) {
    getTopHelpArticles();
  }

  return (
    <div
      className={classNames(
        stylesRegistration.container,
        stylesRegistration.registrationHelp
      )}
    >
      <h3>{contentItem.properties["Title"]}</h3>
      <p>{contentItem.properties["Summary"]}</p>
      <div className={stylesRegistration.blocks}>
        {contentItem.properties["ContentItems"].map((item: any) => (
          <RegistrationItemContent
            contentItem={item}
            key={`${item.contentId}-${Date.UTC}`}
            definition={definition}
          />
        ))}
        {helpArticlesList !== null && renderTopHelpArticles()}
      </div>
    </div>
  );
};
