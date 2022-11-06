// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { NewsCategory } from "@Areas/News/News";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { EnumUtils } from "@Utilities/EnumUtils";
import axios from "axios";
import React, { useState } from "react";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import Cookies from "js-cookie";

// @ts-ignore
import * as contentstack from "@contentstack/management";

export const NewsMigrator = () => {
  const { coreSettings } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const locales = coreSettings.userContentLocales.sort();
  let currentLocaleIndex = 0;
  let articleIndex = -1;
  let page = 1;
  let entryUid = "";
  let csAssetUid = "";
  let fhArticleId = "";
  let fetchedArticles: any[] = [];
  const [pageInput, setPageInput] = useState(1);
  const [itemsInput, setItemsInput] = useState(3);
  const itemsPerPage = 3;
  const apiKey = ConfigUtils.GetParameter("ContentStack", "ApiKey", "");
  const authToken = ConfigUtils.GetParameter(
    "ContentStack",
    "AuthorizationNews",
    ""
  );

  // Let's keep this off in Prod until we are ready, then do it via stage
  if (!ConfigUtils.SystemStatus("FirehoseNewsMigrator")) {
    return null;
  }

  const chooseCategoryFromTags = (tags: string[]) => {
    let category = EnumUtils.getStringValue(NewsCategory.none, NewsCategory);

    tags.forEach((tag) => {
      if (tag.toLowerCase() === "news-destiny") {
        category = EnumUtils.getStringValue(NewsCategory.destiny, NewsCategory);
      } else if (tag.toLowerCase() === "news-community") {
        category = EnumUtils.getStringValue(
          NewsCategory.community,
          NewsCategory
        );
      } else if (tag.toLowerCase() === "news-updates") {
        category = EnumUtils.getStringValue(NewsCategory.updates, NewsCategory);
      }
    });

    return category;
  };

  const handleLocaleIncrement = () => {
    if (currentLocaleIndex + 1 < locales.length) {
      currentLocaleIndex = currentLocaleIndex + 1;
      Cookies.set("bungleloc", locales[currentLocaleIndex].identifier);
      window.history.replaceState(
        null,
        null,
        `/7/${locales[currentLocaleIndex].identifier}/admin/migratenews`
      );
      getNewsByIdAndLocale(fhArticleId, locales[currentLocaleIndex].identifier);
    } else {
      handleLocaleRestart();
    }
  };

  const handleLocaleRestart = () => {
    currentLocaleIndex = 0;
    csAssetUid = "";
    entryUid = "";
    Cookies.set("bungleloc", "en");
    window.history.replaceState(null, null, "/7/en/admin/migratenews");

    handleArticleIncrement();
  };

  const handlePageIncrement = () => {
    page = page + 1;

    handleArticleRestart();
  };

  const handleArticleIncrement = () => {
    if (articleIndex + 1 < fetchedArticles.length || articleIndex === -1) {
      articleIndex = articleIndex + 1;

      if (currentLocaleIndex === locales?.length) {
        handleLocaleRestart();
      } else if (currentLocaleIndex === 0) {
        getEnglishNewsByPage();
      } else {
        getNewsByIdAndLocale(
          fhArticleId,
          locales[currentLocaleIndex]?.identifier
        );
      }
    } else {
      handlePageIncrement();
    }
  };

  const handleArticleRestart = () => {
    articleIndex = -1;
    handleLocaleRestart();
  };

  const createGlobalField = (url: string) => {
    const hostedURL: any = {};

    hostedURL.hosted_url = url;

    return hostedURL;
  };

  const updateContentStackArticle = (fhEntry: any) => {
    // @ts-ignore
    const { title, id, author, date, subtitle, content, tags } = fhEntry ?? {};

    const csLocale =
      BungieNetLocaleMap(locales[currentLocaleIndex].identifier) ||
      locales[currentLocaleIndex].identifier;

    const entry = {
      title,
      url: createGlobalField(`/${id}`),
      date,
      subtitle,
      image: csAssetUid,
      html_content: content,
      category: chooseCategoryFromTags(tags),
      tags: tags,
    };

    axios({
      method: "put",
      url: `https://api.contentstack.io/v3/content_types/news_article/entries/${entryUid}?locale=${csLocale}`,
      data: { entry: entry },
      headers: {
        api_key: apiKey,
        authorization: authToken,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        console.log(
          `Updated entry for ${locales[currentLocaleIndex].identifier}`
        );
        handleLocaleIncrement();
      })
      .catch(() => {
        console.log(
          `Error updating entry for ${locales[currentLocaleIndex].identifier}`
        );
        handleLocaleIncrement();
      });
  };

  const renderAndScrapeArticle = (fhArticle: any) => {
    console.log("rendering article");

    const articleInstance = axios.create({
      baseURL: `/${locales[currentLocaleIndex].identifier}/Explore/Detail/News`,
      headers: { content_type: "text/html; charset=utf-8" },
      responseType: "json",
    });

    articleInstance
      .get(`${fhArticle.contentId}`)
      .then((res) => {
        const sectionStart = res.data.search(
          `<div id="mainContent">`.toString()
        );
        const sectionEnd = res.data.search(`<div class="toast-message"`);

        const sectionAuthor = res.data.search(
          `<div class="metadata section-subheader">`
        );
        const authorEnd = res.data
          ?.slice(sectionAuthor, sectionAuthor + 100)
          .search(`</div>`);

        // @ts-ignore
        const articleMetaData: {
          date: string;
          image: string;
          author: string;
          subtitle: string;
          id: string;
          title: string;
          content: any;
          category: string;
          tags: string;
        } = {};
        articleMetaData.title = fhArticle.properties.Title;
        const firstPassContent = res.data?.slice(sectionStart, sectionEnd);
        const authorSplit = res.data
          ?.slice(sectionAuthor, sectionAuthor + authorEnd)
          ?.split("- ");
        const author = authorSplit.pop();
        const categoryBlob = firstPassContent?.split(
          `ServerVars.officialNewsContentTags = {}`
        );
        const secondPass =
          categoryBlob[0]?.slice(categoryBlob[0].search(">") + 1) +
          categoryBlob[1]?.slice(categoryBlob[1].search(`';`) + 2);
        const secondPassWithUpdatedUrls = secondPass
          ?.split("/pubassets/pkgs")
          .join("https://www.bungie.net/pubassets/pkgs");
        const contentAfterSubtitleIndex = secondPassWithUpdatedUrls.search(
          `<div class="content text-content">`
        );
        articleMetaData.content = secondPassWithUpdatedUrls?.slice(
          contentAfterSubtitleIndex
        );
        articleMetaData.id = fhArticle.contentId;
        articleMetaData.author =
          author ?? Localizer.Community.DefaultNewsItemAuthor;
        articleMetaData.date = fhArticle.creationDate;
        articleMetaData.subtitle = fhArticle.properties.Subtitle;
        if (fhArticle.tags) {
          articleMetaData.tags = fhArticle.tags;
          articleMetaData.category = chooseCategoryFromTags(fhArticle.tags);
        }
        // if we dont have an image yet, we can't render it anyway
        if (
          currentLocaleIndex === 0 &&
          !fhArticle.properties?.FrontPageBanner
        ) {
          handleArticleIncrement();

          return;
        } else {
          // We only need to create the asset the first time, after that, we can just fetch that asset from contentstack
          currentLocaleIndex === 0 && entryUid === ""
            ? createAssetForImage(
                articleMetaData,
                fhArticle.properties.FrontPageBanner
              )
            : updateContentStackArticle(articleMetaData);
        }
      })
      .catch((err) => console.log(err));
  };

  const getNewsByIdAndLocale = (articleId: string, locale: string) => {
    Platform.ContentService.GetContentById(
      articleId,
      locale,
      false,
      `?lc=${locale}`
    )
      .then((fhArticle) => {
        renderAndScrapeArticle(fhArticle);
      })
      .catch((err) => console.error(err));
  };

  const createAssetForImage = (articleMetaData: any, imagePath: string) => {
    const data = new FormData();

    if (imagePath.includes("FrontpageBanner_01.jpg")) {
      csAssetUid = "blt23669207da7d3d28";
      makeContentStackArticle(articleMetaData, "blt23669207da7d3d28");
    } else {
      fetch("https://firehose" + imagePath)
        .then((response) => {
          return response.blob();
        })
        .then((imageBlob) => {
          const imageAsFile = new File(
            [imageBlob],
            `${articleMetaData.title.toLowerCase()?.split(" ").join("")}.png`,
            { type: "image/png" }
          );
          data.append(
            "asset[upload]",
            imageAsFile,
            `${articleMetaData.title.toLowerCase()?.split(" ").join("")}.png`
          );
          data.append(
            "asset[description]",
            "Main image for article " + articleMetaData.title
          );
          data.append("asset[parent_uid]", "blt818a4c3c774a6585");
          data.append("asset[title]", articleMetaData.id + ".png");

          axios({
            method: "post",
            url: "https://api.contentstack.io/v3/assets?include_dimension=true",
            data: data,
            headers: {
              "Content-Type": "multipart/form-data",
              api_key: apiKey,
              authorization: authToken,
            },
          })
            .then((res) => {
              csAssetUid = res.data.asset.uid;
              makeContentStackArticle(articleMetaData, res.data.asset.uid);
              console.log("made en asset");
            })
            .catch((err: any) => console.log(err));
        });
    }
  };

  const makeContentStackArticle = (
    scrapedArticleData: any,
    assetUid: string
  ) => {
    // @ts-ignore
    const { title, id, author, date, subtitle, content, tags } =
      scrapedArticleData ?? {};

    const entry = {
      title,
      url: createGlobalField(`/${id}`),
      author,
      date,
      subtitle,
      image: assetUid,
      html_content: content,
      tags: tags,
      category: chooseCategoryFromTags(tags),
      locale: BungieNetLocaleMap(
        locales[currentLocaleIndex].identifier ||
          locales[currentLocaleIndex].identifier
      ),
    };

    axios({
      method: "post",
      url: "https://api.contentstack.io/v3/content_types/news_article/entries",
      data: { entry: entry },
      headers: {
        api_key: apiKey,
        authorization: authToken,
      },
    }).then((res: any) => {
      console.log("made en article");
      entryUid = res.data.entry.uid;
      handleLocaleIncrement();
    });
  };

  const getEnglishNewsByPage = () => {
    console.log("start with en");

    Platform.ContentService.GetNews(
      "All",
      "en",
      itemsInput ?? itemsPerPage,
      pageInput ?? page,
      null,
      function (error: Error) {
        console.log(`renderNewsContent: Search Failed (${error})`);
      }
    )
      .then((contents) => {
        fetchedArticles = contents.results;
        fhArticleId = fetchedArticles[articleIndex]?.contentId;
        renderAndScrapeArticle(contents.results[articleIndex]);
      })
      .catch((e) => console.log(e));
  };
  const pageString = "page";
  const itemsString = "items per page";
  const start = "start";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: `${
          Localizer.CurrentCultureName === "en" ? "green" : "lightgray"
        }`,
      }}
    >
      <label htmlFor={"page"}>{pageString}</label>
      <input
        name={"page"}
        value={pageInput}
        onChange={(e) => setPageInput(Number(e.target.value))}
      />
      <label htmlFor={"items"}>{itemsString}</label>
      <input
        name={"items"}
        value={itemsInput}
        onChange={(e) => setItemsInput(Number(e.target.value))}
      />
      <Button
        style={{ width: "33%", margin: "0.5rem" }}
        onClick={() => {
          articleIndex = 0;
          getEnglishNewsByPage();
        }}
      >
        {start}
      </Button>
    </div>
  );
};
