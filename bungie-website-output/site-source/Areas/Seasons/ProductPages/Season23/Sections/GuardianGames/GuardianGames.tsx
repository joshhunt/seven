import React, { memo } from "react";
import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import FeaturedImage from "@Areas/Seasons/ProductPages/Season23/Components/FeaturedImage/FeaturedImage";
import { PmpCallout } from "@UI/Marketing/Fragments/PmpCallout";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { PmpSectionHeader } from "@UI/Marketing/Fragments/PmpSectionHeader";
import styles from "./GuardianGames.module.scss";

const GuardianGames: React.FC<{
  data: any;
}> = ({ data }) => {
  const getSection = (title: string) =>
    data?.content?.find((tag: any) => tag?.title === title);

  return (
    <>
      <Stripes />
      <ConfettiWrapper bgImgUrl={data?.background_img?.url}>
        <PmpSectionHeader
          classes={{
            root: styles.guardianGamesRoot,
            secondaryHeading: styles.sectionEyebrow,
            heading: styles.guardianGamesTitle,
            videoBtn: styles.videoBtn,
            btnWrapper: styles.btnWrapper,
            blurb: styles.ggBlurb,
            headingsFlexWrapper: styles.ggHeadingFlexWrapper,
            textWrapper: styles.ggSectionOneTextWrapper,
          }}
          data={getSection("S23 - GG - 1")}
        />
        <PmpInfoThumbnailGroup
          data={getSection("S23 - GG - 2")}
          classes={{
            blurb: styles.baseCopy,
            heading: styles.baseCopy,
            root: styles.ggGunThumbnailRoot,
            thumbnail: styles.ggThumbnailImg,
          }}
        />
        <FeaturedImage
          content={getSection("S23 - GG - 3")}
          image={data?.featured_image}
        />
        <PmpInfoThumbnailGroup
          data={getSection("S23 - GG - 4")}
          classes={{
            blurb: styles.baseCopy,
            thumbnail: styles.hideThumbnails,
            thumbBlockWrapper: styles.thumbBlockWrapper,
            root: styles.bottomSpacing,
            heading: styles.styledThumbnailHeader,
          }}
        />
        <PmpCallout
          classes={{
            upperContent: styles.eventWrapper,
            asideImg: styles.eventAsideImg,
            root: styles.eventBannerRoot,
          }}
          data={getSection("S23 - GG - 5")}
        />
        <PmpStackedInfoThumbBlocks
          classes={{
            root: styles.medalPanelRootWrapper,
          }}
          data={getSection("S23 - GG - 6")}
          reverseAlignment
        />
      </ConfettiWrapper>
      <img
        src={data?.bumper_img.url}
        className={styles.ggBottomBannerImg}
        alt=""
      />
      <Stripes />
    </>
  );
};

const Stripes = () => {
  return (
    <div className={styles.stripes}>
      <div className={styles.stripe1} />
      <div className={styles.stripe2} />
      <div className={styles.stripe3} />
    </div>
  );
};

const ConfettiWrapper = ({
  children,
  bgImgUrl,
}: {
  children: any;
  bgImgUrl: string;
}) => {
  const wrapperBG = {
    backgroundImage: `url(${bgImgUrl})`,
  };

  return (
    <div className={styles.confettiWrapper} style={wrapperBG}>
      {children}
    </div>
  );
};

const getDynamicHeadingStyle = (index: number) => {
  const colors = ["#8C0200", "#194573", "#9E6800"];
  const color = colors[index % colors.length];

  return { color };
};

export default memo(GuardianGames);
