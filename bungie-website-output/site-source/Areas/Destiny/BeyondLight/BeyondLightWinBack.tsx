// Created by atseng, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Img } from "@Helpers";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React from "react";
import styles from "@Areas/Destiny/BeyondLight/BeyondLightWinBack.module.scss";

interface BeyondLightWinBackProps {
  trailerId: string;
}

export const BeyondLightWinBack: React.FC<BeyondLightWinBackProps> = (
  props
) => {
  const beyondlightLoc = Localizer.Beyondlight;
  const trailerId = props.trailerId;

  const showTrailer = (videoId: string) => {
    YoutubeModal.show({ videoId });
  };

  return (
    <div className={styles.winbackContainer}>
      <section className={classNames(styles.darkness, styles.leftAligned)}>
        <BeyondLightWinBackTextContainer
          eyebrow={beyondlightLoc.Overview}
          title={beyondlightLoc.DarknessIsHere}
          description={beyondlightLoc.EramisTheKellOfDarkness}
          link={
            <Button
              onClick={() => showTrailer(trailerId)}
              analyticsId={"BeyondLightOverviewTrailerButton"}
              className={styles.watchTrailerButton}
              buttonType={"text"}
              icon={
                <img
                  src={"/7/ca/destiny/bgs/shadowkeep/play_button.png"}
                  alt={""}
                  role={"presentation"}
                />
              }
            >
              {beyondlightLoc.WatchTheLaunchTrailer}
            </Button>
          }
        />
      </section>

      <section className={styles.stasis}>
        <BeyondLightWinBackCalloutsContainer
          eyebrow={beyondlightLoc.NewPowers}
          title={beyondlightLoc.WieldStasis}
          description={beyondlightLoc.GuardiansHaveAlwaysBeen}
          anchorText={beyondlightLoc.ExploreStasis}
          anchorUrl={RouteHelper.BeyondLightPhases("Stasis")}
          callouts={[
            {
              title: beyondlightLoc.SubclassSupers,
              description: beyondlightLoc.SubclassesAndSupersEach,
              icon: Img(
                "/destiny/products/beyondlight/Subclass-and-Supers.png"
              ),
            },
            {
              title: beyondlightLoc.AspectsFragments,
              description: beyondlightLoc.CustomizeYourGuardian,
              icon: Img(
                "/destiny/products/beyondlight/Aspects-and-Fragments.png"
              ),
            },
          ]}
        />
      </section>

      <section className={styles.europa}>
        <BeyondLightWinBackCalloutsContainer
          eyebrow={beyondlightLoc.NewEnvironment}
          title={beyondlightLoc.EuropaAwaits}
          description={beyondlightLoc.IcyWindsWhipTheTundra}
          anchorText={beyondlightLoc.ExploreEuropa}
          anchorUrl={RouteHelper.BeyondLightPhases("Europa")}
          callouts={[
            {
              title: beyondlightLoc.AnUneasyAlly,
              description: beyondlightLoc.CompleteVariksQuestsTo,
              icon: Img("/destiny/products/beyondlight/Variks.png"),
            },
            {
              title: beyondlightLoc.ExoChallenges,
              description: beyondlightLoc.EarnPowerfulRewardsBy,
              icon: Img("/destiny/products/beyondlight/Exo_Challenges.png"),
            },
            {
              title: beyondlightLoc.EmpireHunts,
              description: beyondlightLoc.TrackDownAndDefeatThe,
              icon: Img("/destiny/products/beyondlight/Empire_Hunts.png"),
            },
          ]}
        />
      </section>

      <section className={styles.arsenal}>
        <BeyondLightWinBackCalloutsContainer
          eyebrow={beyondlightLoc.ExoticsGear}
          title={beyondlightLoc.UpgradeYourArsenal}
          description={beyondlightLoc.TheFrozenIceOfEuropaHides}
          anchorText={beyondlightLoc.LearnMore}
          anchorUrl={RouteHelper.BeyondLightPhases("Gear")}
          callouts={[
            {
              title: beyondlightLoc.PlayYourWay,
              description: beyondlightLoc.WithAnAlwaysGrowingPool,
              image: Img("/destiny/products/beyondlight/play_your_way.jpg"),
              thumb: Img(
                "/destiny/products/beyondlight/play_your_way_thumb.jpg"
              ),
            },
            {
              title: beyondlightLoc.TheLament,
              description: beyondlightLoc.TheEnemiesOfHumanityAre,
              image: Img("/destiny/products/beyondlight/exotic-weapons.jpg"),
              thumb: Img(
                "/destiny/products/beyondlight/exotic-weapons_thumb.jpg"
              ),
            },
            {
              title: beyondlightLoc.ExoticArmor,
              description: beyondlightLoc.GauntletsThatSpreadDeadly,
              image: Img("/destiny/products/beyondlight/exotic-armor.jpg"),
              thumb: Img(
                "/destiny/products/beyondlight/exotic-armor_thumb.jpg"
              ),
            },
          ]}
        />
      </section>

      <section
        className={classNames(styles.deepstonecrypt, styles.leftAligned)}
      >
        <BeyondLightWinBackTextContainer
          eyebrow={beyondlightLoc.Raid}
          title={beyondlightLoc.DeepStoneCrypt}
          description={beyondlightLoc.AtraksHasBeenResurrected}
        />
      </section>
    </div>
  );
};

interface BeyondLightWinBackTextContainerProps {
  eyebrow: string;
  title: string;
  description: string;
  link?: React.ReactNode;
}

export const BeyondLightWinBackTextContainer: React.FC<BeyondLightWinBackTextContainerProps> = (
  props
) => {
  return (
    <div className={styles.textBlock}>
      <div className={styles.eyebrow}>{props.eyebrow}</div>
      <h2 dangerouslySetInnerHTML={sanitizeHTML(props.title)} />
      <p className={styles.blurb}>{props.description}</p>
      {props.link}
    </div>
  );
};

interface BeyondLightWinBackCalloutsContainerProps {
  eyebrow: string;
  title: string;
  description: string;
  anchorText: string;
  anchorUrl: string | IMultiSiteLink;
  callouts: BeyondLightWinBackTextCalloutProps[];
}

export const BeyondLightWinBackCalloutsContainer: React.FC<BeyondLightWinBackCalloutsContainerProps> = (
  props
) => {
  return (
    <div className={styles.calloutsContainer}>
      <div className={styles.textBlock}>
        <div className={styles.eyebrow}>{props.eyebrow}</div>
        <h2>{props.title}</h2>
        <p className={styles.blurb}>{props.description}</p>
        <Button
          className={styles.button}
          buttonType={"blue"}
          url={props.anchorUrl}
        >
          {props.anchorText}
        </Button>
      </div>

      <div className={styles.callouts}>
        {props.callouts.map((value, index) => {
          return (
            <BeyondLightWinBackCallout
              key={index}
              image={value.image}
              thumb={value.thumb}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          );
        })}
      </div>
    </div>
  );
};

interface BeyondLightWinBackTextCalloutProps {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  thumb?: string;
}

export const BeyondLightWinBackCallout: React.FC<BeyondLightWinBackTextCalloutProps> = (
  props
) => {
  const showImage = (imageName: string) => {
    Modal.open(
      <img src={imageName} className={styles.largeImage} alt={imageName} />,
      {
        isFrameless: true,
      }
    );
  };

  return (
    <div
      className={classNames(
        styles.callout,
        props.image?.length > 0
          ? styles.imageCallout
          : props.icon?.length > 0
          ? styles.iconCallout
          : ""
      )}
    >
      <div
        className={styles.calloutImage}
        onClick={() => showImage(props.image)}
        style={{
          backgroundImage: `url(${
            props.image && props.thumb ? props.thumb : props.icon
          })`,
        }}
        role={"img"}
      />
      <div className={styles.calloutTitle}>{props.title}</div>
      <p className={styles.calloutDesc}>{props.description}</p>
    </div>
  );
};
