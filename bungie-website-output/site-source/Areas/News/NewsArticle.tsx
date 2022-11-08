// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { NotFoundError } from "@CustomErrors";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { FaCaretRight } from "@react-icons/all-files/fa/FaCaretRight";
import { NewsParams } from "@Routes/RouteParams";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { TwitterAPI, TwitterScript } from "@UI/Content/TwitterFeed";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BnetStackNewsArticle } from "Generated/contentstack-types";
import { Logger } from "@Global/Logger";
import { RendererLogLevel } from "@Enum";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "@UIKit/Layout/ParallaxContainer";
import styles from "./NewsArticle.module.scss";

declare global {
  interface Window {
    twttr: TwitterAPI;
  }
}

/**
 * Show the details of the article in question
 */
const NewsArticle = () => {
  const params = useParams<NewsParams>();
  const url = `/${params.articleUrl}`;
  const [articleData, setArticleData] = useState(null);
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const { mobile } = useDataStore(Responsive);

  useEffect(() => {
    ContentStackClient()
      .ContentType("news_article")
      .Query()
      .where("url.hosted_url", url)
      .where("locale", locale)
      .toJSON()
      .findOne()
      .then((matchingArticle: BnetStackNewsArticle): void => {
        // Assume there's only one match because otherwise we have a URL collision
        if (!matchingArticle) {
          throw new NotFoundError();
        }

        setArticleData(matchingArticle);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);

        throw new NotFoundError();
      });
  }, [url, locale]);

  window.twttr?.ready?.(function (twttr: any) {
    window.twttr?.widgets?.load();
  });

  const { title, subtitle, date, image, mobile_image, html_content, author } =
    articleData || {};

  const startSubstring = "<pre";
  const endSubstring = "/pre>";

  const separateCodeContentRecursive = (
    content: string,
    compoundedContent: string[]
  ) => {
    let finalArray: any[] = [];

    if (content?.length > 0) {
      const nextCodeStart = content.indexOf(startSubstring);
      const nextCodeEnd = content.indexOf(endSubstring) + endSubstring.length;

      if (nextCodeStart !== -1) {
        compoundedContent.push(content.slice(0, nextCodeStart));
        compoundedContent.push(content.slice(nextCodeStart, nextCodeEnd));
      } else {
        compoundedContent.push(content);
      }

      finalArray =
        nextCodeEnd - endSubstring.length !== -1
          ? finalArray.concat(
              separateCodeContentRecursive(
                content.slice(nextCodeEnd),
                finalArray
              )
            )
          : finalArray.concat(compoundedContent, finalArray);
    }

    return finalArray;
  };

  const now = DateTime.now();
  const creationDate = DateTime.fromISO(date);
  let timeString = "";
  if (now.diff(creationDate) > Duration.fromObject({ day: 1 })) {
    timeString = Localizer.Format(Localizer.time.MonthAbbrDayYear, {
      monthabbr: Localizer.time["monthabbr" + creationDate.month],
      day: creationDate.day,
      year: creationDate.year,
    });
  } else {
    timeString = Localizer.format(Localizer.time.timehourssince, {
      hours: DateTime.now().diff(creationDate).hours,
    });
  }

  return (
    <>
      <TwitterScript />
      <BungieHelmet title={title} description={subtitle} image={image?.url}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <ParallaxContainer
        className={styles.header}
        parallaxSpeed={2.5}
        isFadeEnabled={true}
        fadeOutSpeed={1000}
        backgroundOffset={0}
        style={{
          backgroundImage:
            mobile && mobile_image?.url
              ? `url(${mobile_image?.url})`
              : `url(${image?.url})`,
        }}
      />
      <Grid isTextContainer={true}>
        <GridCol cols={12}>
          <h1 className={styles.title}>{title}</h1>
          <h3 className={styles.subtitle}>
            <span>{`${timeString} - ${author}`}</span>
          </h3>
          <div className={styles.articleContainer}>
            {separateCodeContentRecursive(html_content, []) &&
              separateCodeContentRecursive(html_content, []).map(
                (contentString: string, index: number) => {
                  if (contentString.startsWith(startSubstring)) {
                    return (
                      <CollapsibleCodeBlock
                        codeContent={contentString}
                        startSubstring={startSubstring}
                        key={index}
                      />
                    );
                  }

                  return (
                    <div
                      dangerouslySetInnerHTML={{ __html: contentString }}
                      key={index}
                    />
                  );
                }
              )}
          </div>
        </GridCol>
      </Grid>
    </>
  );
};

interface CollapsibleCodeBlockProps {
  codeContent: string;
  startSubstring: string;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({
  codeContent,
  startSubstring,
}) => {
  const [open, setOpen] = useState(false);
  const withOpenClass = `${codeContent.slice(
    0,
    startSubstring?.length
  )} class="${styles.open}" ${codeContent.slice(startSubstring?.length)}`;

  return (
    <div
      onClick={() => {
        setOpen(!open);
      }}
      className={styles.codeExpander}
    >
      {open ? <FaCaretDown /> : <FaCaretRight />}
      {Localizer.News.Code}
      {open && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: withOpenClass }} />
        </div>
      )}
    </div>
  );
};

export default NewsArticle;
