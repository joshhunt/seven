// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {S17Hero} from "@Areas/Seasons/ProductPages/Season17/Components/Hero/S17Hero";
import {S17ProceduralEventSection} from "@Areas/Seasons/ProductPages/Season17/Components/S17EventSection/S17EventSection";
import {DefaultPmpComponents, extendDefaultComponents, PartialPmpReferenceMap} from "@Boot/ProceduralMarketingPageFallback";
import {Responsive} from "@Boot/Responsive";
import {useReferenceMap} from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import {BungieNetLocaleMap} from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import {useDataStore} from "@bungie/datastore/DataStoreHooks";
import {Localizer} from "@bungie/localization";
import {RouteHelper} from "@Routes/RouteHelper";
import {sanitizeHTML} from "@UI/Content/SafelySetInnerHTML";
import {DestinySkuTags} from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import {BodyClasses, SpecialBodyClasses} from "@UI/HelmetUtils";
import {PmpNavigationBar} from "@UI/Marketing/FragmentComponents/PmpNavigationBar";
import {PmpCallout} from "@UI/Marketing/Fragments/PmpCallout";
import {PmpIconActionCards} from "@UI/Marketing/Fragments/PmpIconActionCards/PmpIconActionCards";
import {PmpInfoThumbnailGroup} from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import {PmpMedia} from "@UI/Marketing/Fragments/PmpMedia";
import {PmpMediaCarousel} from "@UI/Marketing/Fragments/PmpMediaCarousel";
import {PmpRewardsList} from "@UI/Marketing/Fragments/PmpRewardsList/PmpRewardsList";
import {PmpSectionHeader} from "@UI/Marketing/Fragments/PmpSectionHeader";
import {PmpStackedInfoThumbBlocks} from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import {BungieHelmet} from "@UI/Routing/BungieHelmet";
import {Button} from "@UIKit/Controls/Button/Button";
import {BuyButton} from "@UIKit/Controls/Button/BuyButton";
import {bgImageFromStackFile, responsiveBgImage, responsiveBgImageFromStackFile, WithContentTypeUids} from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {BnetStackSeasonOfTheHaunted} from "../../../../Generated/contentstack-types";
import {ContentStackClient} from "../../../../Platform/ContentStack/ContentStackClient";
import styles from "./SeasonOfTheHaunted.module.scss"

interface SeasonOfTheHauntedProps
{
}

/* All pmp component overrides can be specified globally here since they all reference the same stylesheet */
const pmpComponentOverrides: PartialPmpReferenceMap = {
	pmp_section_header: (ref) => (
		<PmpSectionHeader
			data={ref?.data}
			classes={{
				root: styles.sectionHeader,
				heading: styles.heading,
				smallTitle: styles.smallTitle,
				blurb: styles.blurb,
				textWrapper: styles.textWrapper
			}}
		/>
	),
	pmp_callout: (ref) => (
		<PmpCallout data={ref?.data} classes={{root: styles.callout, heading: styles.heading, blurb: styles.blurb, textWrapper: styles.textWrapper, upperContent: styles.upperContent}}/>
	),
	pmp_icon_action_cards: (ref) => (
		<PmpIconActionCards data={ref?.data} classes={{}}/>
	),
	pmp_info_thumbnail_group: (ref) => (
		<PmpInfoThumbnailGroup data={ref?.data} classes={{root: styles.infoThumbGroup}}/>
	),
	pmp_media_carousel: (ref) => (
		<PmpMediaCarousel data={ref?.data} classes={{
			selectedPaginationIndicator: styles.selected,
			paginationIndicator: styles.carouselPaginationBar,
			slideBlurb: styles.carouselBlurb,
			slideTitle: styles.slideTitle
		}}/>
	),
	pmp_media: (ref) => (
		<PmpMedia data={ref?.data} classes={{tab: styles.tab, selectedTab: styles.selected}}/>
	),
	pmp_rewards_list: (ref) => (
		<PmpRewardsList data={ref?.data} classes={{ root: styles.rewardsList }}/>
	),
	pmp_stacked_info_thumb_blocks: (ref) => (
		<PmpStackedInfoThumbBlocks data={ref?.data} classes={{root: styles.stackedInfoBlock, blurb: styles.blurb}}/>
	)
}

const SeasonOfTheHaunted = (props: SeasonOfTheHauntedProps) =>
{
	const [data, setData] = useState<null | BnetStackSeasonOfTheHaunted>(null);
	const responsive = useDataStore(Responsive);
	
	const eventSectionRef = useRef<HTMLDivElement | null>(null);

	const contentReferences: (`${keyof BnetStackSeasonOfTheHaunted}.content` | keyof BnetStackSeasonOfTheHaunted | string)[] = [
		"story_section.content",
		"activities_section.content",
		"light_section.content",
		"gear_section.content",
		"season_pass_section.content",
		"rewards_section.content",
		"silver_bundle_section.content",
		"media_section.content",
		"learn_more_section.content",
		"sub_nav",
		"solstice_content_chunks.content_with_background.content"
	];

	useEffect(() =>
	{
		ContentStackClient().ContentType("season_of_the_haunted")
			.Entry("bltf44e3114347dbb31")
			.language(BungieNetLocaleMap(Localizer.CurrentCultureName))
			.includeReference(contentReferences)
			.toJSON()
			.fetch()
			.then(setData)
	}, [])

	const scrollToEventSection = () => {
		eventSectionRef?.current?.scrollIntoView({ behavior: "smooth" });
	}

	type TResponsiveBg = BnetStackSeasonOfTheHaunted["story_section"]["top_bg"];

	const getResponsiveBg = useCallback((bg: TResponsiveBg) =>
	{
		const img = responsive.mobile ? bg?.mobile_bg : bg?.desktop_bg;

		return img?.url ? `url(${img?.url})` : undefined;
	}, [responsive])

	const {
		story_section,
		activities_section,
		gear_section,
		hero,
		light_section,
		media_section,
		season_pass_section,
		rewards_section,
		silver_bundle_section,
		title,
		learn_more_section,
		sub_nav,
		sub_nav_btn_text,
		cta_section,
		solstice_content_chunks,
		solstice_section
	} = data ?? {};

	const openBuyModal = () =>
	{
		DestinySkuSelectorModal.show({skuTag: DestinySkuTags.SilverBundle})
	}

	return (
		<div className={styles.seasonOfTheHaunted}>

			<BungieHelmet
				title={title}
			>
				<body className={classNames(SpecialBodyClasses(BodyClasses.NoSpacer | BodyClasses.HideServiceAlert))}/>
			</BungieHelmet>

			<div className={styles.pageFixedContent}>

				{/* HERO */}
				<S17Hero data={hero} scrollToEvent={scrollToEventSection}/>

				{/* SUB NAV */}
				<PmpNavigationBar
					data={sub_nav?.[0]}
					accentColor={"gold"}
					primaryColor={"plum"}
					buttonProps={{
						children: sub_nav_btn_text,
						onClick: openBuyModal,
						buttonType: "gold"
					}}
				/>

				{/* STORY */}
				<div id={"story"} className={classNames(styles.section, styles.story)} style={{ backgroundImage: getResponsiveBg(story_section?.bottom_bg) }}>
					<div className={classNames(styles.sectionWrapper, styles.leviathan)}>
						<div className={styles.bg} style={{ backgroundImage: getResponsiveBg(story_section?.top_bg) }}/>
						<div className={styles.bgGradient}/>
						<S17FloatingGhosts ghosts={story_section?.ghost_images?.map(g => g?.url)}/>
						<PmpSectionHeader data={story_section?.content?.[0]} classes={{ heading: styles.heading, blurb: styles.blurb, root: styles.sectionHeader }}/>
					</div>
					<div className={classNames(styles.sectionWrapper, styles.ghosts)}>
						<div className={styles.bg} style={{ backgroundImage: getResponsiveBg(story_section?.ghosts_bg) }}/>
						<PmpSectionHeader data={story_section?.content?.[1]} classes={{ heading: styles.heading, blurb: styles.blurb, root: styles.sectionHeader }}/>
					</div>
					<div className={styles.bottomBg} style={{ backgroundImage: getResponsiveBg(story_section?.bottom_bg) }}/>
					<PmpCallout data={story_section?.content?.[2]} classes={{root: styles.callout, heading: styles.heading}}/>
				</div>

				{/* ACTIVITIES */}
				<div id={"activities"} className={classNames(styles.section, styles.activities)} style={{backgroundImage: getResponsiveBg(activities_section?.bg)}}>
					<S17ProceduralContent content={activities_section?.content} pmpComponents={pmpComponentOverrides}/>
				</div>
				
				{/* SOLSTICE */}
				<div className={styles.solstice}>
					<div className={styles.sectionIdAnchor} id={"Solstice"} ref={eventSectionRef}/>
					<img className={styles.heroImg} src={responsive.mobile ? solstice_section?.hero_bg?.mobile_bg?.url : solstice_section?.hero_bg?.desktop_bg?.url}/>
					<S17ProceduralEventSection contentChunks={solstice_content_chunks} pmpComponentOverrides={pmpComponentOverrides}/>
				</div>

				{/* GEAR */}
				<div id={"gear"} className={classNames(styles.section, styles.gear)}>
					<S17ProceduralContent content={gear_section?.content} pmpComponents={pmpComponentOverrides}/>
				</div>

				{/* SEASON PASS */}
				<div id={"seasonPass"} className={classNames(styles.section, styles.seasonPass)} style={{backgroundImage: getResponsiveBg(season_pass_section?.bg)}}>
					<S17ProceduralContent content={season_pass_section?.content} pmpComponents={pmpComponentOverrides}/>
				</div>

				{/* REWARDS */}
				<div id={"rewards"} className={classNames(styles.section, styles.rewards)} style={{backgroundImage: getResponsiveBg(rewards_section?.bg)}}>
					<S17ProceduralContent content={rewards_section?.content} pmpComponents={pmpComponentOverrides}/>
				</div>

				{/* LIGHT */}
				<div id={"light"} className={classNames(styles.section, styles.light)} style={{backgroundImage: responsive.mobile ? `url(${light_section?.bg?.mobile_bg?.url})` : undefined}}>
					<S17LightSectionBgVideo video={light_section?.bg_video?.url} poster={light_section?.bg?.desktop_bg?.url}/>
					<S17ProceduralContent content={light_section?.content} pmpComponents={pmpComponentOverrides}/>
				</div>

				{/* SILVER BUNDLE */}
				<div id={"bundle"} className={classNames(styles.section, styles.silverBundle)} style={{backgroundImage: getResponsiveBg(silver_bundle_section?.bg)}}>
					<S17ProceduralContent content={silver_bundle_section?.content} pmpComponents={pmpComponentOverrides}/>
					<div className={styles.content}>
						<BuyButton
							// analyticsId={data?.btn_analytics_id}
							className={styles.buyBtn}
							buttonType={"gold"}
							url={RouteHelper.DestinyBuyDetail({productFamilyTag: "silverbundle"})}
						>{silver_bundle_section?.buy_btn_text}</BuyButton>
						<p className={styles.disclaimer} dangerouslySetInnerHTML={sanitizeHTML(silver_bundle_section?.disclaimer)}/>
					</div>
				</div>
				
				{/* CTA */}
				<div className={(classNames(styles.cta))} style={{ backgroundImage: getResponsiveBg(cta_section?.bg) }}>
					<img className={styles.logo} src={cta_section?.logo?.url}/>
					<Button
						url={RouteHelper.DestinyBuyDetail({ productFamilyTag: "silverbundle" })}
						buttonType={"gold"}
						className={styles.buyBtn}
					>{cta_section?.btn_text ?? ""}</Button>
				</div>
			</div>

			{/* MEDIA */}
			<div id={"media"} className={classNames(styles.section, styles.media)}>
				<S17ProceduralContent content={media_section?.content} pmpComponents={pmpComponentOverrides}/>
			</div>

			{/* LINKS */}
			<div className={classNames(styles.section, styles.links)}>
				<S17ProceduralContent content={learn_more_section?.content} pmpComponents={pmpComponentOverrides}/>
			</div>
		</div>
	);
};

/* Mapped type of props for each pmp component */
type DefaultComponentParameters = {
	[key in keyof typeof DefaultPmpComponents]: Parameters<typeof DefaultPmpComponents[key]>[0];
}

/* 'data' prop type for any pmp component defined in 'DefaultPmpComponents'; 
Used for type checking of content passed in to procedural content component */
type TPmpComponentData = DefaultComponentParameters[keyof DefaultComponentParameters]["data"];

interface S17ProceduralContentProps
{
	pmpComponents?: PartialPmpReferenceMap;
	content: TPmpComponentData[];
}

/* Renders group of content using useReferenceMap */
const S17ProceduralContent = (props: S17ProceduralContentProps) =>
{
	const {pmpComponents, content} = props;

	const {ReferenceMappedList} = useReferenceMap(extendDefaultComponents(pmpComponents), content as WithContentTypeUids<typeof content> ?? [])

	return (
		<ReferenceMappedList/>
	)
}

const S17FloatingGhosts = (props: { ghosts?: string[] }) =>
{
	return (
		<div className={styles.ghostsWrapper}>
			{props.ghosts?.map((ghostImg, i) => {
				return (
					<div key={i} className={styles.ghostWrapper}>
						<img src={ghostImg} className={styles.ghostImg}/>
					</div>
				)
			})}
		</div>
	)
}

const S17LightSectionBgVideo = (props: { video?: string; poster?: string }) =>
{
	const {mobile} = useDataStore(Responsive);

	return (props.video && !mobile && (
		<video className={styles.lightVideo} poster={props.poster} autoPlay muted loop playsInline>
			<source src={props.video} type={"video/mp4"}/>
		</video>
	) || null)
}

export default SeasonOfTheHaunted;