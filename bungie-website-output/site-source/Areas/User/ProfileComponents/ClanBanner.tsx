// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ClanBanner, GroupsV2, Models, Platform, Utilities } from "@Platform";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ClanBanner.module.scss";

interface ClanBannerProps {
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
}

interface ISelectedClanBannerValues {
  selectedFlagImage: string;
  selectedDecalBgImage: string;
  selectedDecalFgImage: string;
  selectedDecalPrimaryColorId: string;
  selectedDecalSecondaryColorId: string;
  selectedGonfalonColorId: string;
  selectedGonfalonDetailColorId: string;
  selectedGonfalonImage: string;
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
  const [numImagesLoaded, addToReadyImages] = useState<number>(0);
  const [imagesReady, setImagesReady] = useState<boolean>(false);

  const [canvasIsReadyToShow, setCanvasIsReadyToShow] = useState<boolean>(
    false
  );

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
    setSelectedClanBannerValues({
      selectedDecalBgImage: getDecalFromBannerSource(
        clanBannerSource.clanBannerDecals,
        props.bannerSettings.decalId
      )?.backgroundPath,
      selectedDecalPrimaryColorId: getColorStringFromBannerSource(
        clanBannerSource.clanBannerDecalPrimaryColors,
        props.bannerSettings.decalColorId
      ),
      selectedDecalSecondaryColorId: getColorStringFromBannerSource(
        clanBannerSource.clanBannerDecalSecondaryColors,
        props.bannerSettings.decalBackgroundColorId
      ),
      selectedDecalFgImage: getDecalFromBannerSource(
        clanBannerSource.clanBannerDecals,
        props.bannerSettings.decalId
      )?.foregroundPath,
      selectedFlagImage: getImagePathFromBannerSource(
        clanBannerSource.clanBannerGonfalons,
        props.bannerSettings.gonfalonId
      ),
      selectedGonfalonColorId: getColorStringFromBannerSource(
        clanBannerSource.clanBannerGonfalonColors,
        props.bannerSettings.gonfalonColorId
      ),
      selectedGonfalonImage: getImagePathFromBannerSource(
        clanBannerSource.clanBannerGonfalonDetails,
        props.bannerSettings.gonfalonDetailId
      ),
      selectedGonfalonDetailColorId: getColorStringFromBannerSource(
        clanBannerSource.clanBannerGonfalonDetailColors,
        props.bannerSettings.gonfalonDetailColorId
      ),
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

  const mergeCanvases = () => {
    //clear everything

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
            selectedClanBannerValues.selectedGonfalonColorId
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
            selectedClanBannerValues.selectedGonfalonDetailColorId
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
          selectedClanBannerValues.selectedDecalSecondaryColorId
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
          selectedClanBannerValues.selectedDecalPrimaryColorId
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
      updateSelectedImages();
    }
  }, [canvasCtx]);

  //when the images are loaded -> start drawing
  useEffect(() => {
    if (imagesReady) {
      drawClanBanner();
    }
  }, [imagesReady]);

  const imageLoaded = () => {
    const newValue = numImagesLoaded + 1;

    addToReadyImages(newValue);

    //there are 6 images that need to be loaded total
    if (newValue === 6) {
      setImagesReady(true);
    }
  };

  return (
    <div className={props.className}>
      {selectedClanBannerValues !== null && (
        <div style={{ display: "none" }}>
          <img
            src={selectedClanBannerValues.selectedFlagImage}
            ref={selectedFlagImageRef}
            onLoad={() => imageLoaded()}
          />
          <img
            src={selectedClanBannerValues.selectedGonfalonImage}
            ref={selectedGonfalonImageRef}
            onLoad={() => imageLoaded()}
          />
          <img
            src={selectedClanBannerValues.selectedDecalBgImage}
            ref={selectedDecalBgImageRef}
            onLoad={() => imageLoaded()}
          />
          <img
            src={selectedClanBannerValues.selectedDecalFgImage}
            ref={selectedDecalFgImageRef}
            onLoad={() => imageLoaded()}
          />
          <img
            src={props.flagOverlayImagePath}
            ref={flagOverlayImageRef}
            onLoad={() => imageLoaded()}
          />
          <img
            src={"/img/bannercreator/FlagStand00.png"}
            ref={flagStandImageRef}
            onLoad={() => imageLoaded()}
          />
        </div>
      )}
      <div style={{ display: "none" }}>
        <canvas
          ref={bannerCombinedCanvasRef}
          id="bannerCombined"
          width="496"
          height="1034"
        />
        <canvas ref={finalCanvasRef} id="final" width="496" height="1034" />
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
