// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { EntryEmbedable } from "@contentstack/utils";
import { NotFoundError } from "@CustomErrors";
import { NewsParams } from "@Routes/RouteParams";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Utils } from "contentstack";
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
import { defaultNodeOption } from "./RenderOption";

interface NewsArticleProps {}

/**
 * Show the details of the article in question
 */
const NewsArticle: React.FC<NewsArticleProps> = (props) => {
  const params = useParams<NewsParams>();
  const url = `/${params.articleUrl}`;
  const [result, setResult] = useState<[WithUids<BnetStackNewsArticle[]>]>(
    null
  );
  const throwError = useAsyncError();

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);

  useEffect(() => {
    ContentStackClient()
      .ContentType("news_article")
      .Query()
      .where("url", url)
      .where("locale", locale)
      .includeEmbeddedItems()
      .toJSON()
      .find()
      .then((res: [WithUids<BnetStackNewsArticle[]>]) => {
        res[0].forEach((entry: EntryEmbedable) =>
          Utils.jsonToHTML({
            entry,
            paths: ["content", "group.content"],
            renderOption: defaultNodeOption,
          })
        );
      })
      .catch((error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
        throwError(error);
      });
  }, [url, locale]);

  // Assume there's only one match because otherwise we have a URL collision
  const matchingArticle = result?.[0];

  if (result && !matchingArticle) {
    throw new NotFoundError();
  }

  if (!matchingArticle) {
    return null;
  }

  const { title, subtitle, date, image, content, author, uid } =
    matchingArticle?.[0] || {};

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
          <div
            className={styles.articleContainer}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </GridCol>
      </Grid>
    </>
  );
};

export default NewsArticle;
