// Created by jlauer, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./NewsArticle.module.scss";
import { IContentfulEntryProps, ContentfulUtils } from "../../ContentfulUtils";
import { INewsArticleFields } from "../../Contracts/NewsArticleContracts";
import moment from "moment";
import Helmet from "react-helmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";

export const NewsArticle: React.FC<IContentfulEntryProps<
  INewsArticleFields
>> = ({ entry, entryCollection, children, className, style }) => {
  const { body, headerImage, subtitle, thumbnail, title } = entry.fields;

  const isUpdated = entry.sys.updatedAt !== entry.sys.createdAt;
  const attributionStyle = isUpdated ? "#Updated " : "#Published ";
  const timeSince = moment(entry.sys.updatedAt).fromNow();

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </Helmet>
      <div className={styles.banner}>
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${headerImage.fields.file.url})` }}
        />
      </div>
      <div className={styles.bodyWrapper}>
        <h1 className={styles.title}>{title}</h1>
        <small className={styles.attribution}>
          {attributionStyle} {timeSince}
        </small>
        <div className={styles.body}>
          {ContentfulUtils.renderRichText(body, entryCollection)}
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
