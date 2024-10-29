// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { NotFoundError } from "@CustomErrors";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { FaCaretRight } from "@react-icons/all-files/fa/FaCaretRight";
import { NewsParams } from "@Routes/Definitions/RouteParams";
import { TwitterAPI, TwitterScript } from "@UI/Content/TwitterFeed";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UIKit/Controls/Modal/Modal";
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
      .language(locale)
      .toJSON()
      .find()
      .then((matchingArticles: BnetStackNewsArticle[][]): void => {
        const matchingArticle = matchingArticles[0][0];
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

  const codeSectionStart = "<pre";
  const codeSectionEnd = "/pre>";

  const separateCodeContentRecursive = (
    content: string,
    compoundedContent: string[]
  ) => {
    let finalArray: any[] = [];

    if (content?.length > 0) {
      const nextCodeStart = content.indexOf(codeSectionStart);
      const nextCodeEnd =
        content.indexOf(codeSectionEnd) + codeSectionEnd.length;

      if (nextCodeStart !== -1) {
        finalArray.push(content.slice(0, nextCodeStart));
        finalArray.push(content.slice(nextCodeStart, nextCodeEnd));
      } else {
        finalArray.push(content);
      }

      finalArray =
        nextCodeEnd - codeSectionEnd.length !== -1
          ? finalArray.concat(
              separateCodeContentRecursive(
                content.slice(nextCodeEnd),
                finalArray
              )
            )
          : finalArray;
    }

    return finalArray;
  };

  const luxonDate = DateTime?.fromISO(date?.toString());
  const timeSince = luxonDate?.diffNow();
  const timeHours = Math.abs(timeSince?.as("hours"));
  const timeString =
    timeHours > 24
      ? Localizer.Format(Localizer.time.MonthAbbrDayYear, {
          monthabbr: Localizer.time["monthabbr" + luxonDate.month],
          day: luxonDate.day,
          year: luxonDate.year,
        })
      : Localizer.time.TimeHoursSince;

  const time = Localizer.Format(timeString, {
    monthabbr: Localizer.time["MonthAbbr" + luxonDate?.month],
    month: luxonDate?.month,
    day: luxonDate?.day,
    year: luxonDate?.year,
    hours: Math.ceil(timeHours),
  });

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
        {html_content && (
          <GridCol cols={12}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles.subtitle}>
              <span>{`${time} - ${author}`}</span>
            </h3>
            <div className={styles.articleContainer}>
              {separateCodeContentRecursive(html_content, []) &&
                separateCodeContentRecursive(html_content, []).map(
                  (contentString: string, index: number) => {
                    if (contentString.indexOf(`class="collapsible"`) > -1) {
                      return (
                        <div
                          onClick={(e) => {
                            const targetElement: HTMLElement = e.target as HTMLElement;

                            if (
                              targetElement.className.indexOf(
                                "collapsible-trigger"
                              ) > -1
                            ) {
                              targetElement.classList.toggle("open");
                            }
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: contentString }}
                          />
                        </div>
                      );
                    }

                    if (contentString.indexOf(`<img`) > -1) {
                      return (
                        <div
                          onClick={(e) => {
                            const targetElement: HTMLImageElement = e.target as HTMLImageElement;

                            if (contentString.indexOf(targetElement.src) > -1) {
                              Modal.open(<img src={targetElement.src} />, {
                                isFrameless: true,
                              });
                            }
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: contentString }}
                          />
                        </div>
                      );
                    }

                    if (contentString.startsWith(codeSectionStart)) {
                      return (
                        <CollapsibleCodeBlock
                          codeContent={contentString}
                          codeSectionStart={codeSectionStart}
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
        )}
      </Grid>
    </>
  );
};

interface CollapsibleCodeBlockProps {
  codeContent: string;
  codeSectionStart: string;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({
  codeContent,
  codeSectionStart,
}) => {
  const [open, setOpen] = useState(false);
  const withOpenClass = `${codeContent.slice(
    0,
    codeSectionStart?.length
  )} class="${styles.open}" ${codeContent.slice(codeSectionStart?.length)}`;

  return (
    <div>
      <div
        className={styles.codeExpander}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? <FaCaretDown /> : <FaCaretRight />}
        {Localizer.News.Code}
      </div>
      {open && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: withOpenClass }} />
        </div>
      )}
    </div>
  );
};

export default NewsArticle;
