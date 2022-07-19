// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { BasicNodeType } from "@bungie/contentstack/JsonRteMap/DefaultMapping";
import { RteMap } from "@bungie/contentstack/JsonRteMap/RteRenderer";
import {
  ContentTypeDataPair,
  ReferencedDataWithContentType,
} from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization/Localizer";
import { useRteMap } from "@bungie/contentstack";
import { NotFoundError } from "@CustomErrors";
import { NewsParams } from "@Routes/RouteParams";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BnetStackNewsArticle } from "Generated/contentstack-types";
import { Logger } from "../../Global/Logger";
import { RendererLogLevel } from "../../Platform/BnetPlatform.TSEnum";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { BodyClasses, SpecialBodyClasses } from "../../UI/HelmetUtils";
import { Grid, GridCol } from "../../UI/UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "../../UI/UIKit/Layout/ParallaxContainer";
import { WithUids } from "../../Utilities/GraphQLUtils";
import { useAsyncError } from "../../Utilities/ReactUtils";
import styles from "./NewsArticle.module.scss";

interface NewsArticleProps {}

/**
 * Show the details of the article in question
 */
const NewsArticle: React.FC<NewsArticleProps> = (props) => {
  const params = useParams<NewsParams>();
  const url = `/${params.articleUrl}`;
  const [renderable, setRenderable] = useState(null);
  const [articleData, setArticleData] = useState(null);
  const throwError = useAsyncError();
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);

  const PmpCallToAction: React.FC<ReferencedDataWithContentType<
    "pmp_call_to_action"
  >> = ({ data, children }) => {
    return (
      <div {...data?.attrs}>
        {data?.title}
        <>{children}</>
      </div>
    );
  };

  useEffect(() => {
    ContentStackClient()
      .ContentType("news_article")
      .Query()
      .where("url", url)
      .where("locale", locale)
      .includeEmbeddedItems()
      .toJSON()
      .find()
      .then((res): void => {
        // Assume there's only one match because otherwise we have a URL collision
        const matchingArticle = res?.[0]?.[0];
        setArticleData(matchingArticle);

        if (!matchingArticle) {
          throw new NotFoundError();
        }

        const referenceMetas = matchingArticle._embedded_items?.content?.map(
          (ref: any) => {
            return {
              contentTypeUid: ref._content_type_uid,
              data: ref,
            };
          }
        );

        const { RenderedComponent } = useRteMap({
          meta: {
            contentTypeUid: matchingArticle.content.type as BasicNodeType,
            data: matchingArticle.content,
          },
          map: {} as RteMap<BasicNodeType>,
          referenceMap: { pmp_call_to_action: PmpCallToAction },
          referenceMetas: referenceMetas,
        });

        setRenderable(RenderedComponent);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
        throwError(error);
      });
  }, [url, locale]);

  const { title, subtitle, date, image, content, author, uid } =
    articleData || {};

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
    timeString = Localizer.format(Localizer.time.timehago, {
      hoursAgo: DateTime.now().diff(creationDate).hours,
    });
  }

  return (
    <>
      <BungieHelmet title={title} description={subtitle} image={image?.url}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <ParallaxContainer
        className={styles.header}
        parallaxSpeed={2.5}
        isFadeEnabled={true}
        fadeOutSpeed={1000}
        backgroundOffset={0}
        style={{ backgroundImage: `url(${image?.url})` }}
      />
      <Grid isTextContainer={true}>
        <GridCol cols={12}>
          <h1 className={styles.title}>{title}</h1>
          <h3 className={styles.subtitle}>
            <span>{`${timeString} - ${author}`}</span>
          </h3>
          <div className={styles.articleContainer}>{renderable}</div>
        </GridCol>
      </Grid>
    </>
  );
};

export default NewsArticle;
