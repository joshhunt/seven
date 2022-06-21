// Created by a-bphillips, 2022
// Copyright Bungie, Inc.
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { useEffect, useState } from "react";

type TWebpImages = { [key: string]: string | string[] | undefined };

/** Converts object of images to webp format if supported by browser */
export const useCSWebpImages = function <T extends TWebpImages>(
  imgObj: T
): Partial<T> {
  const [supportsWebp, setSupportsWebp] = useState(true);
  const [images, setImages] = useState<Partial<T>>({});

  // appends webp format query param to image url
  const appendWebpFormat = (img?: string) => {
    return UrlUtils.addQueryParam(img, "format", "webp");
  };

  useEffect(() => {
    if (supportsWebp && imgObj) {
      const webpImages: TWebpImages = { ...imgObj };

      // add webp format query param to each image url
      for (const imgKey in webpImages) {
        const img = webpImages[imgKey];

        webpImages[imgKey] =
          typeof img === "string"
            ? appendWebpFormat(img)
            : img?.map((image) => appendWebpFormat(image));
      }

      setImages(webpImages as T);
    } else {
      // if browser doesn't support webp, just use initial image values
      setImages(imgObj);
    }
  }, [supportsWebp, imgObj]);

  // check for browser support of webp images on load
  useEffect(() => {
    BrowserUtils.supportsWebp().then(setSupportsWebp);
  }, []);

  return images;
};
