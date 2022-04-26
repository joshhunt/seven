import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import ClickableImgCarousel, {
  ClickableImgCarouselProps,
  ICarouselSlide,
} from "@UI/Marketing/ClickableImgCarousel";
import { BnetStackPmpMediaCarousel } from "Generated/contentstack-types";
import React, { useEffect, useState } from "react";

type TCarouselProps = Omit<ClickableImgCarouselProps, "slides">;

type Props = DataReference<"pmp_media_carousel", BnetStackPmpMediaCarousel> &
  TCarouselProps & {};

type CarouselSlideItem = Props["data"]["slides"][number];

const getCarouselSlide = (slide: CarouselSlideItem) => {
  return (
    slide.inline_video_slide ??
    slide.screenshot_slide ??
    slide.screenshot_slide ??
    slide.video_slide
  );
};

const getCarouselSlideThumbnail = (slide: CarouselSlideItem) => {
  return (
    slide.inline_video_slide?.video_poster_image ??
    slide.screenshot_slide?.thumbnail_image ??
    slide.screenshot_slide?.screenshot_image ??
    slide.video_slide?.thumbnail_image
  );
};

export const PmpMediaCarousel: React.FC<Props> = (props) => {
  const { data, classes } = props;

  const [slides, setSlides] = useState<ICarouselSlide[] | null>(null);

  useEffect(() => {
    if (data) {
      const carouselSlides: ICarouselSlide[] = data?.slides?.map((s) => ({
        thumbnail: getCarouselSlideThumbnail(s)?.url,
        screenshot: s.screenshot_slide?.screenshot_image?.url,
        title: getCarouselSlide(s)?.slide_title,
        blurb: getCarouselSlide(s)?.slide_description,
        videoId: s?.video_slide?.video_id,
        inlineVideo: s?.inline_video_slide?.inline_video?.url,
      }));

      setSlides(carouselSlides);
    }
  }, [data]);

  return (
    <>{slides && <ClickableImgCarousel slides={slides} classes={classes} />}</>
  );
};
