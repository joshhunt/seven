// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useRteMap } from "@bungie/contentstack";
import { BasicNodeType } from "@bungie/contentstack/JsonRteMap/DefaultMapping";
import {
  RteMap,
  RteReferenceMap,
} from "@bungie/contentstack/JsonRteMap/RteRenderer";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { NotFoundError } from "@CustomErrors";
import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { ScrollToAnchorTags } from "@UI/Navigation/ScrollToAnchorTags";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { BnetStackGuide } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { GuideRouteParams, NewsParams } from "@Routes/Definitions/RouteParams";
import styles from "./Guide.module.scss";

interface GuideSectionProps {
  guideSection: BnetStackGuide["sections"][0]["guide_section"];
}

export const Guide: React.FC<any> = (props) => {
  const [data, setData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  let prevSection = 0;
  const responsive = useDataStore(Responsive);
  const location = useLocation();
  const params = useParams<GuideRouteParams>();
  const guideUrl = `/${params.guide}`;

  const RenderedSection: React.FC<GuideSectionProps> = ({ guideSection }) => {
    const { RenderedComponent } = useRteMap({
      meta: {
        contentTypeUid: guideSection?.content?.type as BasicNodeType,
        data: guideSection?.content,
      },
      map: {
        img: (mappedProps) => {
          return (
            <img
              onClick={() => {
                Modal.open(
                  <img
                    src={mappedProps?.data?.attrs?.src}
                    alt={mappedProps?.data?.className}
                  />
                );
              }}
              src={mappedProps?.data?.attrs?.src}
              alt={mappedProps?.data?.className}
            />
          );
        },
      } as RteMap<BasicNodeType>,
      referenceMap: {} as RteReferenceMap<null>,
      referenceMetas: null,
    });

    return <RenderedComponent />;
  };

  useEffect(() => {
    ContentStackClient()
      .ContentType("guide")
      .Query()
      .where("url", guideUrl)
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .find()
      .then((res): void => {
        const matchingEntry = res[0][0];
        // Assume there's only one match because otherwise we have a URL collision
        if (!matchingEntry) {
          throw new NotFoundError();
        }

        setData(matchingEntry);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      });
  }, []);

  useEffect(() => {
    if (selectedSection !== prevSection) {
      window.location.replace(
        `7${location?.pathname}#section${selectedSection + 1}`
      );
      prevSection = selectedSection;
    }
  }, [selectedSection]);

  const { header_image, title, sections } = data ?? {};

  if (!data) {
    return null;
  }

  return (
    <div className={styles.guide}>
      <ScrollToAnchorTags animate={true} />
      <div className={styles.header}>
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${header_image?.url})` }}
        />
        <h1>{title}</h1>
      </div>
      <div className={styles.sectionsWrapper}>
        {responsive.mobile ? (
          <select
            className={styles.sectionSelect}
            onChange={(e) => {
              setSelectedSection(Number(e?.currentTarget?.value));
            }}
          >
            {sections.map(
              (section: BnetStackGuide["sections"][0], i: number) => {
                return (
                  <option value={i} key={i}>
                    {section?.guide_section?.title}
                  </option>
                );
              }
            )}
          </select>
        ) : (
          <div className={styles.sectionTable}>
            {sections.map(
              (section: BnetStackGuide["sections"][0], i: number) => {
                return (
                  <div
                    key={`section${i + 1}`}
                    className={classNames({
                      [styles.current]: i === selectedSection,
                    })}
                    onClick={(e) => {
                      setSelectedSection(i);
                    }}
                  >
                    <a href={`7${location?.pathname}#section${i + 1}`}>
                      {section?.guide_section?.title}
                    </a>
                  </div>
                );
              }
            )}
          </div>
        )}

        <div className={styles.sections}>
          {sections.map((section: BnetStackGuide["sections"][0], i: number) => {
            return (
              <div
                key={i}
                className={styles.sectionItem}
                id={`section${i + 1}`}
              >
                <h2>{section?.guide_section?.title} </h2>
                <div className={styles.content}>
                  {section?.guide_section?.content?.type && (
                    <RenderedSection guideSection={section?.guide_section} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
