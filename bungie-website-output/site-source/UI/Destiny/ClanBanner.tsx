// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ClanBanner, GroupsV2, Platform, Utilities } from "@Platform";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ClanBanner.module.scss";

export interface ClanBannerProps {
  className: string;
  bannerSettings: GroupsV2.ClanBanner;
  canvasWidth?: number;
  canvasHeight?: number;
  imageWidth?: number;
  imageHeight?: number;
  offsetY?: number;
  showStaff: boolean;
  flagOverlayImagePath?: string;
  replaceCanvasWithImage: boolean;
  updateAble?: boolean;
  updatedBannerSettings?: GroupsV2.ClanBanner;
}

interface ISelectedClanBannerValues {
  selectedFlagImage: string;
  selectedDecalBgImage: string;
  selectedDecalFgImage: string;
  selectedGonfalonImage: string;
}

interface ISelectedClanBannerImageIDs {
  decalId: number;
  gonfalonId: number;
  gonfalonDetailId: number;
}

interface ISelectedClanBannerColorIDs {
  selectedDecalPrimaryColorId: number;
  selectedDecalSecondaryColorId: number;
  selectedGonfalonColorId: number;
  selectedGonfalonDetailColorId: number;
}

interface IClanBannerCanvasCtx {
  ctxEmblemfg: CanvasRenderingContext2D;
  ctxEmblembg: CanvasRenderingContext2D;
  ctxFlagdetail: CanvasRenderingContext2D;
  ctxStaff: CanvasRenderingContext2D;
  ctxBg: CanvasRenderingContext2D;
  ctxFinal: CanvasRenderingContext2D;
  ctxCombined: CanvasRenderingContext2D;
  ctxMasked: CanvasRenderingContext2D;
}

export const ClanBannerDisplay: React.FC<ClanBannerProps> = (props) => {
  const bannerCombinedCanvasRef = useRef<HTMLCanvasElement>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement>(null);
  const bannerMaskedCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const flagdetailCanvasRef = useRef<HTMLCanvasElement>(null);
  const emblembgCanvasRef = useRef<HTMLCanvasElement>(null);
  const emblemfgCanvasRef = useRef<HTMLCanvasElement>(null);
  const staffCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectedFlagImageRef = useRef<HTMLImageElement>(null);
  const selectedGonfalonImageRef = useRef<HTMLImageElement>(null);
  const selectedDecalBgImageRef = useRef<HTMLImageElement>(null);
  const selectedDecalFgImageRef = useRef<HTMLImageElement>(null);
  const flagOverlayImageRef = useRef<HTMLImageElement>(null);
  const flagStandImageRef = useRef<HTMLImageElement>(null);

  const [clanBannerSource, setClanBannerSource] = useState<
    ClanBanner.ClanBannerSource
  >(null);
  const [canvasCtx, setCanvasCtx] = useState<IClanBannerCanvasCtx>(null);
  const [selectedClanBannerValues, setSelectedClanBannerValues] = useState<
    ISelectedClanBannerValues
  >(null);
  const [selectedImages, setSelectedImages] = useState<
    ISelectedClanBannerImageIDs
  >();
  const [selectedColors, setSelectedColors] = useState<
    ISelectedClanBannerColorIDs
  >();
  const [imagesReady, setImagesReady] = useState<boolean>(false);
  const [canvasIsReadyToShow, setCanvasIsReadyToShow] = useState<boolean>(
    false
  );
  const [loadedOnceAlready, setLoadedOnceAlready] = useState(false);

  const setCanvasContexes = () => {
    const canvasEmblemfg = emblemfgCanvasRef.current;
    const canvasEmblembg = emblembgCanvasRef.current;
    const canvasFlagdetail = flagdetailCanvasRef.current;
    const canvasStaff = staffCanvasRef.current;
    const canvasBg = bgCanvasRef.current;
    const canvasFinal = finalCanvasRef.current;
    const canvasCombined = bannerCombinedCanvasRef.current;
    const canvasMasked = bannerMaskedCanvasRef.current;

    setCanvasCtx({
      ctxEmblemfg: canvasEmblemfg.getContext("2d"),
      ctxEmblembg: canvasEmblembg.getContext("2d"),
      ctxFlagdetail: canvasFlagdetail.getContext("2d"),
      ctxStaff: canvasStaff.getContext("2d"),
      ctxBg: canvasBg.getContext("2d"),
      ctxFinal: canvasFinal.getContext("2d"),
      ctxCombined: canvasCombined.getContext("2d"),
      ctxMasked: canvasMasked.getContext("2d"),
    });
  };

  const updateSelectedImages = () => {
    setSelectedImages({
      decalId:
        props.updatedBannerSettings?.decalId ?? props.bannerSettings.decalId,
      gonfalonDetailId:
        props.updatedBannerSettings?.gonfalonDetailId ??
        props.bannerSettings.gonfalonDetailId,
      gonfalonId:
        props.updatedBannerSettings?.gonfalonId ??
        props.bannerSettings.gonfalonId,
    });

    setSelectedClanBannerValues({
      selectedDecalBgImage: getDecalFromBannerSource(
        clanBannerSource.clanBannerDecals,
        props.updatedBannerSettings?.decalId ?? props.bannerSettings.decalId
      )?.backgroundPath,
      selectedDecalFgImage: getDecalFromBannerSource(
        clanBannerSource.clanBannerDecals,
        props.updatedBannerSettings?.decalId ?? props.bannerSettings.decalId
      )?.foregroundPath,
      selectedFlagImage: getImagePathFromBannerSource(
        clanBannerSource.clanBannerGonfalons,
        props.updatedBannerSettings?.gonfalonId ??
          props.bannerSettings.gonfalonId
      ),
      selectedGonfalonImage: getImagePathFromBannerSource(
        clanBannerSource.clanBannerGonfalonDetails,
        props.updatedBannerSettings?.gonfalonDetailId ??
          props.bannerSettings.gonfalonDetailId
      ),
    });
  };

  const updateSelectedColors = () => {
    setSelectedColors({
      selectedDecalPrimaryColorId: props.bannerSettings.decalColorId,
      selectedDecalSecondaryColorId:
        props.bannerSettings.decalBackgroundColorId,
      selectedGonfalonDetailColorId: props.bannerSettings.gonfalonDetailColorId,
      selectedGonfalonColorId: props.bannerSettings.gonfalonColorId,
    });
  };

  const getImagePathFromBannerSource = (
    items: { [p: number]: string },
    id: number
  ): string => {
    return items[id];
  };

  const getColorStringFromBannerSource = (
    items: { [p: number]: Utilities.PixelDataARGB },
    id: number
  ): string => {
    const color = items[id];

    return `${color?.red || 0},${color?.green || 0},${color?.blue || 0}`;
  };

  const getDecalFromBannerSource = (
    items: { [p: number]: ClanBanner.ClanBannerDecal },
    id: number
  ): ClanBanner.ClanBannerDecal => {
    return items[id];
  };

  const getCanvasImage = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    mask: HTMLImageElement,
    color: string
  ) => {
    try {
      if (mask !== undefined && mask !== null) {
        const maskWidth = mask.naturalWidth;
        const maskHeight = mask.naturalHeight;

        ctx.drawImage(
          mask,
          canvas.width / 2 - maskWidth / 2,
          props.offsetY,
          maskWidth,
          maskHeight
        );

        ctx.globalCompositeOperation = "source-in";
      }

      if (img !== undefined && img !== null) {
        const imgNatwidth = img.naturalWidth;
        const imgNatheight = img.naturalHeight;

        ctx.drawImage(
          img,
          canvas.width / 2 - imgNatwidth / 2,
          props.offsetY,
          imgNatwidth,
          imgNatheight
        );
      }

      if (color !== undefined && color !== null) {
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = `rgb(${color})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error(error);
    }

    return canvas;
  };

  const clearTheBanner = () => {
    //clear everything
    canvasCtx.ctxEmblemfg.globalCompositeOperation = "source-over";
    canvasCtx.ctxEmblembg.globalCompositeOperation = "source-over";
    canvasCtx.ctxFlagdetail.globalCompositeOperation = "source-over";
    canvasCtx.ctxBg.globalCompositeOperation = "source-over";
    canvasCtx.ctxStaff.globalCompositeOperation = "source-over";

    canvasCtx.ctxEmblemfg.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxEmblembg.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxFlagdetail.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxBg.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxStaff.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );

    canvasCtx.ctxFinal.globalCompositeOperation = "source-over";
    canvasCtx.ctxCombined.globalCompositeOperation = "source-over";
    canvasCtx.ctxMasked.globalCompositeOperation = "source-over";

    canvasCtx.ctxFinal.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxCombined.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxMasked.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
  };

  const mergeCanvases = (colors?: ISelectedClanBannerColorIDs) => {
    //reset globalCompositeOperation
    canvasCtx.ctxFinal.globalCompositeOperation = "source-over";
    canvasCtx.ctxCombined.globalCompositeOperation = "source-over";
    canvasCtx.ctxMasked.globalCompositeOperation = "source-over";

    canvasCtx.ctxFinal.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxCombined.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );
    canvasCtx.ctxMasked.clearRect(
      0,
      0,
      finalCanvasRef.current.width,
      finalCanvasRef.current.height
    );

    try {
      //combine the banner components
      if (props.showStaff) {
        canvasCtx.ctxCombined.drawImage(
          getCanvasImage(
            bgCanvasRef.current,
            canvasCtx.ctxBg,
            selectedFlagImageRef.current,
            null,
            getColorStringFromBannerSource(
              clanBannerSource.clanBannerGonfalonColors,
              colors?.selectedGonfalonColorId ??
                selectedColors.selectedGonfalonColorId
            )
          ),
          0,
          0,
          props.canvasWidth,
          props.canvasHeight
        );

        canvasCtx.ctxCombined.drawImage(
          getCanvasImage(
            flagdetailCanvasRef.current,
            canvasCtx.ctxFlagdetail,
            selectedGonfalonImageRef.current,
            null,
            getColorStringFromBannerSource(
              clanBannerSource.clanBannerGonfalonDetailColors,
              colors?.selectedGonfalonDetailColorId ??
                selectedColors.selectedGonfalonDetailColorId
            )
          ),
          0,
          0,
          props.canvasWidth,
          props.canvasHeight
        );
      }

      canvasCtx.ctxCombined.drawImage(
        getCanvasImage(
          emblembgCanvasRef.current,
          canvasCtx.ctxEmblembg,
          selectedDecalBgImageRef.current,
          null,
          getColorStringFromBannerSource(
            clanBannerSource.clanBannerDecalSecondaryColors,
            colors?.selectedDecalSecondaryColorId ??
              selectedColors.selectedDecalSecondaryColorId
          )
        ),
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );

      canvasCtx.ctxCombined.drawImage(
        getCanvasImage(
          emblemfgCanvasRef.current,
          canvasCtx.ctxEmblemfg,
          selectedDecalFgImageRef.current,
          null,
          getColorStringFromBannerSource(
            clanBannerSource.clanBannerDecalPrimaryColors,
            colors?.selectedDecalPrimaryColorId ??
              selectedColors.selectedDecalPrimaryColorId
          )
        ),
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );

      //add the flag overlay
      canvasCtx.ctxCombined.drawImage(
        flagOverlayImageRef.current,
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );

      //mask everything that we combined
      canvasCtx.ctxMasked.drawImage(
        selectedFlagImageRef.current,
        props.canvasWidth / 2 - props.imageWidth / 2,
        props.offsetY,
        props.imageWidth,
        props.imageHeight
      );

      props.showStaff
        ? (canvasCtx.ctxMasked.globalCompositeOperation = "source-in")
        : (canvasCtx.ctxMasked.globalCompositeOperation = "copy");

      canvasCtx.ctxMasked.drawImage(
        bannerCombinedCanvasRef.current,
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );

      //combine the masked and the stand for the final canvas
      canvasCtx.ctxFinal.drawImage(
        bannerMaskedCanvasRef.current,
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );

      if (props.showStaff) {
        canvasCtx.ctxFinal.drawImage(
          flagStandImageRef.current,
          props.canvasWidth / 2 - props.imageWidth / 2 - 10,
          6,
          props.canvasWidth * 0.85,
          props.canvasHeight * 0.85
        );
      }

      setCanvasIsReadyToShow(true);
    } catch (e) {
      if (e instanceof EvalError || e instanceof RangeError) {
        //Bnet.error(e.name + ": " + e.message);
      } else if (e instanceof ReferenceError) {
        //Bnet.error(`Something was undefined: ${e.message}`);
      } else {
        throw e;
      }
    }
  };

  const drawClanBanner = () => {
    mergeCanvases();
  };

  //load clan banner data
  useEffect(() => {
    if (clanBannerSource === null) {
      Platform.Destiny2Service.GetClanBannerSource().then((clanData) => {
        setClanBannerSource(clanData);
      });
    }
  }, []);

  //when clan banner source is ready -> setup the canvases
  useEffect(() => {
    if (clanBannerSource !== null) {
      setCanvasContexes();
    }
  }, [clanBannerSource]);

  //when canvases are ready -> load the images
  useEffect(() => {
    if (canvasCtx !== null) {
      updateSelectedColors();
      updateSelectedImages();
    }
  }, [canvasCtx]);

  //when the images are loaded -> start drawing
  useEffect(() => {
    if (imagesReady) {
      drawClanBanner();
    }
  }, [imagesReady]);

  let newNumber = 0;

  const imageLoaded = (imageName: string) => {
    newNumber++;

    //there are 6 images that need to be loaded total on first load
    if (newNumber === 5) {
      setImagesReady(true);
      setLoadedOnceAlready(true);
    }

    if (loadedOnceAlready) {
      switch (imageName) {
        case "decalBg":
        case "decalFg":
          if (newNumber === 2) {
            setImagesReady(true);
          }
          break;

        case "gonfalon":
        case "flag":
        case "flagOverlay":
          setImagesReady(true);
          break;
      }
    }
  };

  useEffect(() => {
    if (props.updatedBannerSettings) {
      mergeCanvases({
        selectedDecalPrimaryColorId:
          props.updatedBannerSettings?.decalColorId !==
          selectedColors.selectedDecalPrimaryColorId
            ? props.updatedBannerSettings.decalColorId
            : selectedColors.selectedDecalPrimaryColorId,
        selectedDecalSecondaryColorId:
          props.updatedBannerSettings?.decalBackgroundColorId !==
          selectedColors.selectedDecalSecondaryColorId
            ? props.updatedBannerSettings.decalBackgroundColorId
            : selectedColors.selectedDecalSecondaryColorId,
        selectedGonfalonDetailColorId:
          props.updatedBannerSettings?.gonfalonDetailColorId !==
          selectedColors.selectedGonfalonDetailColorId
            ? props.updatedBannerSettings.gonfalonDetailColorId
            : selectedColors.selectedGonfalonDetailColorId,
        selectedGonfalonColorId:
          props.updatedBannerSettings?.gonfalonColorId !==
          selectedColors.selectedGonfalonColorId
            ? props.updatedBannerSettings.gonfalonColorId
            : selectedColors.selectedGonfalonColorId,
      });

      setSelectedColors({
        selectedDecalPrimaryColorId:
          props.updatedBannerSettings?.decalColorId !==
          selectedColors.selectedDecalPrimaryColorId
            ? props.updatedBannerSettings.decalColorId
            : selectedColors.selectedDecalPrimaryColorId,
        selectedDecalSecondaryColorId:
          props.updatedBannerSettings?.decalBackgroundColorId !==
          selectedColors.selectedDecalSecondaryColorId
            ? props.updatedBannerSettings.decalBackgroundColorId
            : selectedColors.selectedDecalSecondaryColorId,
        selectedGonfalonDetailColorId:
          props.updatedBannerSettings?.gonfalonDetailColorId !==
          selectedColors.selectedGonfalonDetailColorId
            ? props.updatedBannerSettings.gonfalonDetailColorId
            : selectedColors.selectedGonfalonDetailColorId,
        selectedGonfalonColorId:
          props.updatedBannerSettings?.gonfalonColorId !==
          selectedColors.selectedGonfalonColorId
            ? props.updatedBannerSettings.gonfalonColorId
            : selectedColors.selectedGonfalonColorId,
      });

      if (
        props.updatedBannerSettings.decalId !== selectedImages.decalId ||
        props.updatedBannerSettings.gonfalonDetailId !==
          selectedImages.gonfalonDetailId ||
        props.updatedBannerSettings.gonfalonId !== selectedImages.gonfalonId
      ) {
        //
        setImagesReady(false);
        setCanvasIsReadyToShow(false);

        clearTheBanner();

        //redo the images
        updateSelectedImages();
      }
    }
  }, [props.updatedBannerSettings]);

  return (
    <div className={props.className}>
      {selectedClanBannerValues !== null && (
        <div style={{ display: "none" }}>
          <img
            src={selectedClanBannerValues.selectedFlagImage}
            ref={selectedFlagImageRef}
            onLoad={() => imageLoaded("flag")}
          />
          <img
            src={selectedClanBannerValues.selectedGonfalonImage}
            ref={selectedGonfalonImageRef}
            onLoad={() => imageLoaded("gonfalon")}
          />
          <img
            src={selectedClanBannerValues.selectedDecalBgImage}
            ref={selectedDecalBgImageRef}
            onLoad={() => imageLoaded("decalBg")}
          />
          <img
            src={selectedClanBannerValues.selectedDecalFgImage}
            ref={selectedDecalFgImageRef}
            onLoad={() => imageLoaded("decalFg")}
          />
          <img
            src={props.flagOverlayImagePath}
            ref={flagOverlayImageRef}
            onLoad={() => imageLoaded("flagOverlay")}
          />
          <img
            src={"/img/bannercreator/FlagStand00.png"}
            ref={flagStandImageRef}
            onLoad={() => imageLoaded("stand")}
          />
        </div>
      )}
      <div
        className={classNames(styles.canvases, {
          [styles.updateAble]: props.updateAble,
        })}
      >
        <canvas
          ref={bannerCombinedCanvasRef}
          id="bannerCombined"
          width="496"
          height="1034"
        />
        <canvas
          ref={finalCanvasRef}
          id="final"
          className={styles.finalCanvas}
          width="496"
          height="1034"
        />
        <canvas
          ref={bannerMaskedCanvasRef}
          id="bannerMasked"
          width="496"
          height="1034"
        />
        <canvas
          ref={bgCanvasRef}
          id="bg"
          className="flag"
          width="496"
          height="1034"
        />
        <canvas
          ref={flagdetailCanvasRef}
          id="flagdetail"
          className="flag"
          width="496"
          height="1034"
        />
        <canvas
          ref={emblembgCanvasRef}
          id="emblembg"
          className="emblem"
          width="496"
          height="1034"
        />
        <canvas
          ref={emblemfgCanvasRef}
          id="emblemfg"
          className="emblem"
          width="496"
          height="1034"
        />
        <canvas ref={staffCanvasRef} id="staff" width="496" height="1034" />
      </div>
      {canvasIsReadyToShow && (
        <div
          className={styles.clanBanner}
          style={{
            backgroundImage: `url(${finalCanvasRef.current.toDataURL(
              "image/png"
            )})`,
          }}
        />
      )}
    </div>
  );
};

ClanBannerDisplay.defaultProps = {
  imageWidth: 402,
  imageHeight: 594,
  canvasWidth: 496,
  canvasHeight: 1034,
  offsetY: 47,
  flagOverlayImagePath: "/img/bannercreator/flag_overlay.png",
};
