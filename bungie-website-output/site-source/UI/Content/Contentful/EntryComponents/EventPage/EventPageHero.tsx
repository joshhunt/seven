import React, { useRef, MutableRefObject, useState, useEffect } from "react";
import { IContentfulEntryProps } from "../../ContentfulUtils";
import { IEventPageSectionHeroFields } from "../../Contracts/EventPageContracts";
import { useDataStore } from "@Global/DataStore";
import { Responsive, ResponsiveSize, IResponsiveState } from "@Boot/Responsive";
import classNames from "classnames";
import styles from "../../../../Content/EventPage.module.scss";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Respond } from "@Boot/Respond";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { Asset, Entry } from "contentful";
import { IButtonItemFields } from "../../Contracts/BasicContracts";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";

const showVideo = (videoId: string, responsive: IResponsiveState) => {
  if (responsive.mobile) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.location.href = videoUrl;
  } else {
    YoutubeModal.show({ videoId });
  }
};

const onScroll = (
  heroRef: MutableRefObject<HTMLDivElement>,
  responsive: IResponsiveState
) => {
  if (heroRef.current) {
    if (responsive.mobile) {
      return;
    }

    const heroPosition = heroRef.current.getBoundingClientRect();
    const heroScrollData = BrowserUtils.viewportElementScrollData(heroPosition);

    return heroScrollData;
  }
};

export const EventPageHero: React.FC<IContentfulEntryProps<
  IEventPageSectionHeroFields
>> = (props) => {
  const heroRef = useRef<HTMLDivElement>();
  const responsive = useDataStore(Responsive);

  const [scrollData, setScrollData] = useState<IScrollViewportData | undefined>(
    {
      isVisible: false,
      percent: 0.47,
    }
  );

  const localOnScroll = () => {
    const newScrollData = onScroll(heroRef, responsive);
    requestAnimationFrame(() => setScrollData(newScrollData));
  };

  useEffect(() => {
    window.addEventListener("scroll", localOnScroll);

    return () => window.removeEventListener("scroll", localOnScroll);
  }, []);

  const { entry, entryCollection, children } = props;

  const assets = entryCollection.includes.Asset;

  const {
    heroBackgroundMobile,
    heroBackgrounds,
    heroButton,
    heroLogo,
    heroSubtitle,
    youtubeVideo,
  } = entry.fields;

  const useParallax = heroBackgrounds.length ?? 0 > 1;
  const mobileBackgroundAsset = assets.find(
    (asset) => asset.sys.id === heroBackgroundMobile.sys.id
  );
  const firstBackground = heroBackgrounds[0];
  const hasHeroBackgroundVideo = firstBackground.fields.file.contentType.includes(
    "video"
  );
  const heroBackgroundImage = responsive.mobile
    ? mobileBackgroundAsset
    : firstBackground;

  return (
    <>
      {!useParallax && (
        <>
          <div className={styles.hero} ref={heroRef}>
            {hasHeroBackgroundVideo ? (
              <div className={styles.heroBackgroundVideo}>
                <Respond
                  at={ResponsiveSize.mobile}
                  hide={true}
                  responsive={responsive}
                >
                  <video autoPlay={true} muted={true} loop={true}>
                    <source
                      src={firstBackground.fields.file.url}
                      type={firstBackground.fields.file.contentType}
                    />
                  </video>
                </Respond>
              </div>
            ) : (
              <div
                className={styles.heroBackgroundImage}
                style={{
                  backgroundImage: `url(${heroBackgroundImage.fields.file.url})`,
                }}
              />
            )}
            {children}
          </div>
        </>
      )}

      {useParallax && (
        <div
          className={styles.hero}
          style={{
            position: "relative",
            height: "1000px",
            width: "100%",
            marginTop: "-9rem",
            overflow: "hidden",
          }}
          ref={heroRef}
        >
          <HeroContent
            hasHeroBackgroundVideo={hasHeroBackgroundVideo}
            heroButton={heroButton}
            heroLogo={heroLogo}
            heroSubtitle={heroSubtitle}
            responsive={responsive}
            youtubeVideo={youtubeVideo}
          />

          {heroBackgrounds.map((bg, i) => (
            <ParallaxLayer
              key={i}
              layer={i}
              backgroundImage={bg.fields.file.url}
              scrollPercent={scrollData?.percent ?? 0}
            />
          ))}
        </div>
      )}
    </>
  );
};

interface IParallaxLayerProps {
  scrollPercent: number;
  layer: number;
  backgroundImage: string;
}

const ParallaxLayer = (props: IParallaxLayerProps) => {
  let transform = "";
  let zIndex = 1;

  if (props.layer === 0) {
    transform = `translateY(${
      props.scrollPercent * window.innerHeight * -0.5 +
      window.innerHeight * 0.25
    }px)`;
  } else if (props.layer === 1) {
    transform = `translateY(${
      props.scrollPercent * window.innerHeight * -0.15 +
      window.innerHeight * 0.075
    }px)`;
    zIndex = 8;
  } else {
    transform = `translateY(${
      props.scrollPercent * 100 + window.innerHeight * 0.01
    }px)`;
    zIndex = 10;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: "102%",
        backgroundImage: `url(${props.backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        transform: transform,
        zIndex: zIndex,
      }}
    />
  );
};

interface IHeroContentProps {
  hasHeroBackgroundVideo: boolean;
  youtubeVideo: string;
  heroSubtitle: string;
  responsive: IResponsiveState;
  heroLogo: Asset;
  heroButton: Entry<IButtonItemFields>;
}

const HeroContent: React.FC<IHeroContentProps> = ({
  heroSubtitle,
  responsive,
  youtubeVideo,
  hasHeroBackgroundVideo,
  heroButton,
  heroLogo,
}) => {
  return (
    <div
      className={classNames(styles.heroContent, {
        [styles.makeAbsolute]: hasHeroBackgroundVideo,
      })}
      style={{ zIndex: 30 }}
    >
      {youtubeVideo && (
        <button
          className={styles.playButton}
          onClick={() => showVideo(youtubeVideo, responsive)}
        >
          <div className={styles.playCircle}>
            <div className={styles.playIcon} />
          </div>
        </button>
      )}
      <div
        className={styles.heroLogo}
        style={
          heroLogo && { backgroundImage: `url(${heroLogo.fields.file.url})` }
        }
      />

      {heroSubtitle && (
        <div className={classNames(styles.date)}>{heroSubtitle}</div>
      )}

      {heroButton && (
        <BuyButton
          className={styles.heroButton}
          size={BasicSize.Medium}
          buttonType={heroButton.fields.color}
          url={heroButton.fields.buttonUrl}
          sheen={0.2}
        >
          {heroButton.fields.buttonText}
        </BuyButton>
      )}
    </div>
  );
};

export default EventPageHero;
