// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Breadcrumb } from "@Areas/Clan/Shared/Breadcrumb";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { ClanWithSideBannerView } from "@Areas/Clan/Shared/ClanWithSideBannerView";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { ClanBanner, GroupsV2, Platform, Utilities } from "@Platform";
import { FaAngleRight } from "@react-icons/all-files/fa/FaAngleRight";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/RouteParams";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Accordion } from "@UIKit/Layout/Accordion";
import { NumberUtils } from "@Utilities/NumberUtils";
import classNames from "classnames";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./EditBanner.module.scss";

export const EditBanner: React.FC = () => {
  const clansLoc = Localizer.Clans;
  const params = useParams<IClanParams>();
  const history = useHistory();
  const clanId = params?.clanId ?? "0";

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);

  const clan = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === clanId
  );
  const canEditBanner = ClanUtils.canEditClanBanner(
    clan,
    globalState.loggedInUser
  );

  const [clanBannerSource, setClanBannerSource] = useState<
    ClanBanner.ClanBannerSource
  >();
  const [clanBanner, setClanBanner] = useState<GroupsV2.ClanBanner>();
  const [updatedBannerSettings, setUpdatedBannerSettings] = useState<
    GroupsV2.ClanBanner
  >();

  const [fadeBanner, setFadeBanner] = useState(false);

  const observedElemRef = useRef<HTMLDivElement>(null);

  const scrollHandler = () => {
    const viewportHeight = window.innerHeight;
    const scrolledPosition = observedElemRef?.current?.getBoundingClientRect()
      ?.top;

    setFadeBanner(scrolledPosition < viewportHeight / 2);
  };

  //load clan banner data
  useEffect(() => {
    if (!clanBannerSource) {
      Platform.Destiny2Service.GetClanBannerSource().then((clanData) => {
        setClanBannerSource(clanData);
      });
    }

    window.addEventListener("scroll", () => scrollHandler());

    return () => {
      window.removeEventListener("scroll", () => scrollHandler());
    };
  }, []);

  useEffect(() => {
    if (clan && !clanBanner && clan.group?.clanInfo?.clanBannerData) {
      setClanBanner(clan.group.clanInfo.clanBannerData);
    }
  }, [clan]);

  if (!clan || !clanBannerSource) {
    return null;
  }

  if (!canEditBanner) {
    history.push(RouteHelper.NewClanSettings({ clanId: clanId }).url);
  }

  const getColorStringFromBannerSource = (
    item: Utilities.PixelDataARGB
  ): string => {
    return `${item?.red || 0},${item?.green || 0},${item?.blue || 0}`;
  };

  const selectedSquareDecalId =
    updatedBannerSettings?.decalId ??
    clan.group.clanInfo.clanBannerData.decalId;
  const selectedSquareDecal = Object.entries(
    clanBannerSource.clanBannerDecalsSquare
  ).find((d) => {
    return parseInt(d[0], 10) === selectedSquareDecalId;
  });

  const selectedSquareDetailId =
    updatedBannerSettings?.gonfalonDetailId ??
    clan.group.clanInfo.clanBannerData.gonfalonDetailId;
  const selectedSquareDetail = Object.entries(
    clanBannerSource.clanBannerGonfalonDetailsSquare
  ).find((d) => {
    return parseInt(d[0], 10) === selectedSquareDetailId;
  });

  const selectedDecalPrimaryColorId =
    updatedBannerSettings?.decalColorId ??
    clan.group.clanInfo.clanBannerData.decalColorId;
  const selectedDecalPrimaryColor = Object.entries(
    clanBannerSource.clanBannerDecalPrimaryColors
  )?.find((c) => parseInt(c[0], 10) === selectedDecalPrimaryColorId)?.[1];
  const selectedDecalSecondaryColorId =
    updatedBannerSettings?.decalBackgroundColorId ??
    clan.group.clanInfo.clanBannerData.decalBackgroundColorId;
  const selectedDecalSecondaryColor = Object.entries(
    clanBannerSource.clanBannerDecalSecondaryColors
  )?.find((c) => parseInt(c[0], 10) === selectedDecalSecondaryColorId)?.[1];
  const selectedDetailColorId =
    updatedBannerSettings?.gonfalonDetailColorId ??
    clan.group.clanInfo.clanBannerData.gonfalonDetailColorId;
  const selectedDetailColor = Object.entries(
    clanBannerSource.clanBannerGonfalonDetailColors
  )?.find((c) => parseInt(c[0], 10) === selectedDetailColorId)?.[1];
  const selectedGonfalonColorId =
    updatedBannerSettings?.gonfalonColorId ??
    clan.group.clanInfo.clanBannerData.gonfalonColorId;
  const selectedGonfalonColor = Object.entries(
    clanBannerSource.clanBannerGonfalonColors
  )?.find((c) => parseInt(c[0], 10) === selectedGonfalonColorId)?.[1];

  const saveBanner = () => {
    Platform.GroupV2Service.EditClanBanner(updatedBannerSettings, clanId)
      .then(() => {
        Modal.open(<p>{clansLoc.ChangesHaveBeenSuccessfully}</p>);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const randomize = () => {
    const randomEmblemNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerDecalsSquare).length - 1
    );
    const randomEmblemColorNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerDecalPrimaryColors).length - 1
    );
    const randomEmblemBgColorNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerDecalSecondaryColors).length - 1
    );

    const randomFlagNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerGonfalons).length - 1
    );
    const randomFlagColorNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerGonfalonColors).length - 1
    );

    const randomDetailNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerGonfalonDetailsSquare).length - 1
    );
    const randomDetailColorNum = NumberUtils.getRandomIntInclusive(
      0,
      Object.values(clanBannerSource.clanBannerGonfalonDetailColors).length - 1
    );

    setUpdatedBannerSettings({
      decalId: Number(
        Object.keys(clanBannerSource.clanBannerDecalsSquare).at(randomEmblemNum)
      ),
      decalColorId: Number(
        Object.keys(clanBannerSource.clanBannerDecalPrimaryColors).at(
          randomEmblemColorNum
        )
      ),
      gonfalonId: Number(
        Object.keys(clanBannerSource.clanBannerGonfalons).at(randomFlagNum)
      ),
      decalBackgroundColorId: Number(
        Object.keys(clanBannerSource.clanBannerDecalSecondaryColors).at(
          randomEmblemBgColorNum
        )
      ),
      gonfalonDetailColorId: Number(
        Object.keys(clanBannerSource.clanBannerGonfalonDetailColors).at(
          randomDetailColorNum
        )
      ),
      gonfalonDetailId: Number(
        Object.keys(clanBannerSource.clanBannerGonfalonDetails).at(
          randomDetailNum
        )
      ),
      gonfalonColorId: Number(
        Object.keys(clanBannerSource.clanBannerGonfalonColors).at(
          randomFlagColorNum
        )
      ),
    });
  };

  const triggerElement = (
    title: string,
    selectedBackgroundStyleProperties: CSSProperties,
    selectedClassName: string
  ) => {
    return (
      <>
        <div
          className={classNames(styles.selected, selectedClassName)}
          style={selectedBackgroundStyleProperties}
        />
        <FaAngleRight />
        {title}
      </>
    );
  };

  return (
    <ClanWithSideBannerView
      clanBannerProps={{
        bannerSettings: clanBanner,
        showStaff: true,
        replaceCanvasWithImage: true,
        updateAble: true,
        updatedBannerSettings: updatedBannerSettings,
        className: styles.clanBannerDisplay,
      }}
      className={styles.clanBannerEditor}
      clanContentContainerClassName={styles.bannerOptions}
      clanId={clanId}
    >
      <BungieHelmet title={""} description={""}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <Breadcrumb clanId={clanId} />
      <h3>{clansLoc.BannerCreator}</h3>

      <Accordion
        className={styles.optionsAccordion}
        triggersClassName={styles.trigger}
        collapsiblesClassName={styles.pickers}
        items={[
          {
            defaultOpen: true,
            triggerElement: triggerElement(
              clansLoc.BannerEmblem,
              {
                backgroundImage: `url(${selectedSquareDecal?.[1].foregroundPath}), url(${selectedSquareDecal?.[1].backgroundPath})`,
              },
              styles.emblem
            ),
            collapsibleElement: (
              <>
                {Object.entries(clanBannerSource.clanBannerDecalsSquare)?.map(
                  (d, i) => (
                    <div
                      key={i + "decal"}
                      onClick={() => {
                        if (
                          parseInt(d[0], 10) !==
                          (updatedBannerSettings?.decalId ??
                            selectedSquareDecalId)
                        ) {
                          setUpdatedBannerSettings({
                            decalId: parseInt(d[0], 10),
                            decalColorId:
                              updatedBannerSettings?.decalColorId ??
                              clanBanner.decalColorId,
                            decalBackgroundColorId:
                              updatedBannerSettings?.decalBackgroundColorId ??
                              clanBanner.decalBackgroundColorId,
                            gonfalonColorId:
                              updatedBannerSettings?.gonfalonColorId ??
                              clanBanner.gonfalonColorId,
                            gonfalonDetailId:
                              updatedBannerSettings?.gonfalonDetailId ??
                              clanBanner.gonfalonDetailId,
                            gonfalonDetailColorId:
                              updatedBannerSettings?.gonfalonDetailColorId ??
                              clanBanner.gonfalonDetailColorId,
                            gonfalonId:
                              updatedBannerSettings?.gonfalonId ??
                              clanBanner.gonfalonId,
                          });
                        }
                      }}
                      className={classNames(styles.picker, styles.emblem, {
                        [styles.active]:
                          (updatedBannerSettings?.decalId ??
                            selectedSquareDecalId) === parseInt(d[0], 10),
                      })}
                      style={{
                        backgroundImage: `url(${d[1].foregroundPath}), url(${d[1].backgroundPath})`,
                      }}
                    />
                  )
                )}
              </>
            ),
          },
          {
            triggerElement: triggerElement(
              clansLoc.EmblemForegroundColor,
              {
                backgroundColor: `rgb(${getColorStringFromBannerSource(
                  selectedDecalPrimaryColor
                )})`,
              },
              styles.color
            ),
            collapsibleElement: (
              <>
                {Object.entries(
                  clanBannerSource.clanBannerDecalPrimaryColors
                )?.map((c, i) => (
                  <div
                    key={i + "primaryColor"}
                    onClick={() => {
                      if (
                        parseInt(c[0], 10) !==
                        (updatedBannerSettings?.decalColorId ??
                          selectedDecalPrimaryColorId)
                      ) {
                        setUpdatedBannerSettings({
                          decalId:
                            updatedBannerSettings?.decalId ??
                            clanBanner.decalId,
                          decalColorId: parseInt(c[0], 10),
                          decalBackgroundColorId:
                            updatedBannerSettings?.decalBackgroundColorId ??
                            clanBanner.decalBackgroundColorId,
                          gonfalonColorId:
                            updatedBannerSettings?.gonfalonColorId ??
                            clanBanner.gonfalonColorId,
                          gonfalonDetailId:
                            updatedBannerSettings?.gonfalonDetailId ??
                            clanBanner.gonfalonDetailId,
                          gonfalonDetailColorId:
                            updatedBannerSettings?.gonfalonDetailColorId ??
                            clanBanner.gonfalonDetailColorId,
                          gonfalonId:
                            updatedBannerSettings?.gonfalonId ??
                            clanBanner.gonfalonId,
                        });
                      }
                    }}
                    className={classNames(styles.picker, styles.color, {
                      [styles.active]:
                        (updatedBannerSettings?.decalColorId ??
                          selectedDecalPrimaryColorId) === parseInt(c[0], 10),
                    })}
                    style={{
                      backgroundColor: `rgb(${getColorStringFromBannerSource(
                        c[1]
                      )})`,
                    }}
                  />
                ))}
              </>
            ),
          },
          {
            triggerElement: triggerElement(
              clansLoc.EmblemBackgroundColor,
              {
                backgroundColor: `rgb(${getColorStringFromBannerSource(
                  selectedDecalSecondaryColor
                )})`,
              },
              styles.color
            ),
            collapsibleElement: (
              <>
                {Object.entries(
                  clanBannerSource.clanBannerDecalSecondaryColors
                )?.map((c, i) => (
                  <div
                    key={i + "secondaryColor"}
                    onClick={() => {
                      if (
                        parseInt(c[0], 10) !==
                        (updatedBannerSettings?.decalBackgroundColorId ??
                          selectedDecalSecondaryColorId)
                      ) {
                        setUpdatedBannerSettings({
                          decalId:
                            updatedBannerSettings?.decalId ??
                            clanBanner.decalId,
                          decalColorId:
                            updatedBannerSettings?.decalColorId ??
                            clanBanner.decalColorId,
                          decalBackgroundColorId: parseInt(c[0], 10),
                          gonfalonColorId:
                            updatedBannerSettings?.gonfalonColorId ??
                            clanBanner.gonfalonColorId,
                          gonfalonDetailId:
                            updatedBannerSettings?.gonfalonDetailId ??
                            clanBanner.gonfalonDetailId,
                          gonfalonDetailColorId:
                            updatedBannerSettings?.gonfalonDetailColorId ??
                            clanBanner.gonfalonDetailColorId,
                          gonfalonId:
                            updatedBannerSettings?.gonfalonId ??
                            clanBanner.gonfalonId,
                        });
                      }
                    }}
                    className={classNames(styles.picker, styles.color, {
                      [styles.active]:
                        (updatedBannerSettings?.decalBackgroundColorId ??
                          selectedDecalSecondaryColorId) === parseInt(c[0], 10),
                    })}
                    style={{
                      backgroundColor: `rgb(${getColorStringFromBannerSource(
                        c[1]
                      )})`,
                    }}
                  />
                ))}
              </>
            ),
          },
          {
            triggerElement: triggerElement(
              clansLoc.BannerDetail,
              { backgroundImage: `url(${selectedSquareDetail[1]})` },
              styles.emblem
            ),
            collapsibleElement: (
              <>
                {Object.entries(
                  clanBannerSource.clanBannerGonfalonDetailsSquare
                )?.map((d, i) => (
                  <div
                    className={classNames(styles.picker, styles.emblem, {
                      [styles.active]:
                        (updatedBannerSettings?.gonfalonDetailId ??
                          selectedSquareDetailId) === parseInt(d[0], 10),
                    })}
                    onClick={() => {
                      if (
                        parseInt(d[0], 10) !==
                        (updatedBannerSettings?.gonfalonDetailId ??
                          selectedSquareDetailId)
                      ) {
                        setUpdatedBannerSettings({
                          decalId:
                            updatedBannerSettings?.decalId ??
                            clanBanner.decalId,
                          decalColorId:
                            updatedBannerSettings?.decalColorId ??
                            clanBanner.decalColorId,
                          decalBackgroundColorId:
                            updatedBannerSettings?.decalBackgroundColorId ??
                            clanBanner.decalBackgroundColorId,
                          gonfalonColorId:
                            updatedBannerSettings?.gonfalonColorId ??
                            clanBanner.gonfalonColorId,
                          gonfalonDetailId: parseInt(d[0], 10),
                          gonfalonDetailColorId:
                            updatedBannerSettings?.gonfalonDetailColorId ??
                            clanBanner.gonfalonDetailColorId,
                          gonfalonId:
                            updatedBannerSettings?.gonfalonId ??
                            clanBanner.gonfalonId,
                        });
                      }
                    }}
                    key={i + `detail`}
                    style={{ backgroundImage: `url(${d[1]})` }}
                  />
                ))}
              </>
            ),
          },
          {
            triggerElement: triggerElement(
              clansLoc.DetailColor,
              {
                backgroundColor: `rgb(${getColorStringFromBannerSource(
                  selectedDetailColor
                )})`,
              },
              styles.color
            ),
            collapsibleElement: (
              <>
                {Object.entries(
                  clanBannerSource.clanBannerGonfalonDetailColors
                )?.map((c, i) => (
                  <div
                    key={i + "detailColor"}
                    onClick={() => {
                      if (
                        parseInt(c[0], 10) !==
                        (updatedBannerSettings?.gonfalonDetailColorId ??
                          selectedDetailColorId)
                      ) {
                        setUpdatedBannerSettings({
                          decalId:
                            updatedBannerSettings?.decalId ??
                            clanBanner.decalId,
                          decalColorId:
                            updatedBannerSettings?.decalColorId ??
                            clanBanner.decalColorId,
                          decalBackgroundColorId:
                            updatedBannerSettings?.decalBackgroundColorId ??
                            clanBanner.decalBackgroundColorId,
                          gonfalonColorId:
                            updatedBannerSettings?.gonfalonColorId ??
                            clanBanner.gonfalonColorId,
                          gonfalonDetailId:
                            updatedBannerSettings?.gonfalonDetailId ??
                            clanBanner.gonfalonDetailId,
                          gonfalonDetailColorId: parseInt(c[0], 10),
                          gonfalonId:
                            updatedBannerSettings?.gonfalonId ??
                            clanBanner.gonfalonId,
                        });
                      }
                    }}
                    className={classNames(styles.picker, styles.color, {
                      [styles.active]:
                        (updatedBannerSettings?.gonfalonDetailColorId ??
                          selectedDetailColorId) === parseInt(c[0], 10),
                    })}
                    style={{
                      backgroundColor: `rgb(${getColorStringFromBannerSource(
                        c[1]
                      )})`,
                    }}
                  />
                ))}
              </>
            ),
          },
          {
            triggerElement: triggerElement(
              clansLoc.BannerColor,
              {
                backgroundColor: `rgb(${getColorStringFromBannerSource(
                  selectedGonfalonColor
                )})`,
              },
              styles.color
            ),
            collapsibleElement: (
              <>
                {Object.entries(clanBannerSource.clanBannerGonfalonColors)?.map(
                  (c, i) => (
                    <div
                      key={i + "flagColor"}
                      onClick={() => {
                        setUpdatedBannerSettings({
                          decalId:
                            updatedBannerSettings?.decalId ??
                            clanBanner.decalId,
                          decalColorId:
                            updatedBannerSettings?.decalColorId ??
                            clanBanner.decalColorId,
                          decalBackgroundColorId:
                            updatedBannerSettings?.decalBackgroundColorId ??
                            clanBanner.decalBackgroundColorId,
                          gonfalonColorId: parseInt(c[0], 10),
                          gonfalonDetailId:
                            updatedBannerSettings?.gonfalonDetailId ??
                            clanBanner.gonfalonDetailId,
                          gonfalonDetailColorId:
                            updatedBannerSettings?.gonfalonDetailColorId ??
                            clanBanner.gonfalonDetailColorId,
                          gonfalonId:
                            updatedBannerSettings?.gonfalonId ??
                            clanBanner.gonfalonId,
                        });
                      }}
                      className={classNames(styles.picker, styles.color, {
                        [styles.active]:
                          selectedGonfalonColorId === parseInt(c[0], 10),
                      })}
                      style={{
                        backgroundColor: `rgb(${getColorStringFromBannerSource(
                          c[1]
                        )})`,
                      }}
                    />
                  )
                )}
              </>
            ),
          },
        ]}
      />
      <Button buttonType={"clear"} onClick={() => randomize()}>
        {clansLoc.Randomize}
      </Button>
      <Button buttonType={"gold"} onClick={() => saveBanner()}>
        {clansLoc.UpdateBanner}
      </Button>
    </ClanWithSideBannerView>
  );
};
