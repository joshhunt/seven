// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {S18Hero} from "@Areas/Seasons/ProductPages/Season18/Components/Hero/S18Hero";
import RewardsAndCalendar18 from "@Areas/Seasons/ProductPages/Season18/Components/SeasonPassRewards/S18SeasonPassRewards";
import S18FestivalRewards from "@Areas/Seasons/ProductPages/Season18/Components/FestivalRewards/S18FestivalRewards";
import S18FestivalGuns from "@Areas/Seasons/ProductPages/Season18/Components/FestivalGun/S18FestivalGuns";
import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
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
import {BnetStackS18ProductPage, BnetStackPmpCallout} from "../../../../Generated/contentstack-types";
import {ContentStackClient} from "../../../../Platform/ContentStack/ContentStackClient";
import styles from "./SeasonOfPlunder.module.scss"
import {SeasonUtils} from "@Utilities/SeasonUtils";

interface SeasonOfPlunderProps
{
}

/* All pmp component overrides can be specified globally here since they all reference the same stylesheet */
const pmpComponentOverrides: PartialPmpReferenceMap = {
	pmp_section_header: (ref) => (
		<PmpSectionHeader
			data={ref?.data}
			classes={{
				heading: styles.heading,
				smallTitle: styles.smallTitle,
			}}
		/>
	),
	pmp_callout: (ref) => (
		<PmpCallout data={ref?.data} classes={{}}/>
	),
	pmp_icon_action_cards: (ref) => (
		<PmpIconActionCards data={ref?.data} classes={{}}/>
	),
	pmp_info_thumbnail_group: (ref) => (
		<PmpInfoThumbnailGroup data={ref?.data} classes={{}}/>
	),
	pmp_media_carousel: (ref) => (
		<PmpMediaCarousel data={ref?.data} classes={{
			slideBlurb: styles.slideBlurb,
		}}/>
	),
	pmp_media: (ref) => (
		<PmpMedia data={ref?.data} classes={{}}/>
	),
	pmp_rewards_list: (ref) => (
		<PmpRewardsList data={ref?.data} classes={{ root: styles.rewardsList }}/>
	),
	pmp_stacked_info_thumb_blocks: (ref) => (
		<PmpStackedInfoThumbBlocks data={ref?.data} classes={{}}/>
	)
}

const SeasonOfPlunder = (props: SeasonOfPlunderProps) =>
{
	const [data, setData] = useState<null | BnetStackS18ProductPage>(null);
	const responsive = useDataStore(Responsive);
	
	const festivalSectionRef = useRef<HTMLDivElement | null>(null);

	const contentReferences: (`${keyof BnetStackS18ProductPage}.content` | keyof BnetStackS18ProductPage | string)[] = [
		"sub_nav",
		"story_section.content",
		"gear_section.content",
		"season_pass_section.content",
		"festival.content",
		"rewards_section.content",
		"light_section.content",
		"events_section.content",
		"bundle_section.content",
		"media_section.content",
		"learn_more_section.content"
	];

	useEffect(() =>
	{
		ContentStackClient().ContentType("s18_product_page")
			.Entry("blt673945d52ef43fa9")
			.language(BungieNetLocaleMap(Localizer.CurrentCultureName))
			.includeReference(contentReferences)
			.toJSON()
			.fetch()
			.then(setData)
	}, [])

	const scrollToFestivalSection = () => {
		festivalSectionRef?.current?.scrollIntoView({ behavior: "smooth" });
	}

	type TResponsiveBg = BnetStackS18ProductPage["story_section"]["top_bg"];

	const getResponsiveBg = useCallback((bg: TResponsiveBg) =>
	{
		const img = responsive.mobile ? bg?.mobile_bg : bg?.desktop_bg;

		return img?.url ? `url(${img?.url})` : undefined;
	}, [responsive])

	const {
		title,
		hero,
		sub_nav,
		sub_nav_btn_text,
		story_section,
		gear_section,
		festival,
		season_pass_section,
		rewards_section,
		light_section,
		events_section,
		bundle_section,
		cta_section,
		media_section,
		learn_more_section,
	} = data ?? {};
	
	const openBuyModal = () =>
	{
		DestinySkuSelectorModal.show({skuTag: DestinySkuTags.SilverBundle})
	}
	
	return (
		<div className={styles.seasonOfPlunder}>

			<BungieHelmet
				title={title}
			>
				<body className={classNames(SpecialBodyClasses(BodyClasses.NoSpacer | BodyClasses.HideServiceAlert))}/>
			</BungieHelmet>

			<div className={styles.pageFixedContent}>

				{/* HERO */}
				<S18Hero data={hero} scrollToEvent={scrollToFestivalSection}/>

				{/* SUB NAV */}
				<PmpNavigationBar
					data={sub_nav?.[0]}
					accentColor={"s18blue"}
					primaryColor={"s18blue"}
					buttonProps={{
						children: sub_nav_btn_text,
						onClick: openBuyModal,
						buttonType: "gold"
					}}
				/>

				{/* STORY */}
				<div
					id={"story"}
					className={classNames(styles.section, styles.story)}
					style={{ backgroundImage: [getResponsiveBg(story_section?.top_bg), getResponsiveBg(story_section?.bottom_bg)].filter(Boolean).join(", ") }}
				>
					<PmpSectionHeader data={story_section?.content?.[0]} classes={{
						root: styles.storySectionHeader
					}}/>
					<PmpCallout data={story_section?.content?.[1]} classes={{
						root: styles.storySectionCallout,
						heading: styles.storySectionHeading,
						thumbnailWrapper: styles.storySectionThumbnail,
					}}/>
					<div id={"activities"}>
						<PmpSectionHeader data={story_section?.content?.[2]} classes={{ root: styles.activitiesHeader }}/>
						<PmpIconActionCards data={story_section?.content?.[3]} classes={{}}/>
					</div>
				</div>

				{/* GEAR */}
				<div id={"gear"} className={classNames(styles.section, styles.gear)}>
					<S18ProceduralContent content={gear_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_section_header: (ref) => (
							<PmpSectionHeader
								data={ref?.data}
								classes={{
									root: styles.gearSectionHeader,
									heading: styles.heading,
									smallTitle: styles.smallTitle,
								}}
							/>
						),
					}}/>
				</div>

				{/* SEASON PASS */}
				<div id={"seasonPass"} className={classNames(styles.section, styles.seasonPass)} style={{backgroundImage: getResponsiveBg(season_pass_section?.bg)}}>
					<S18ProceduralContent content={season_pass_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_section_header: (ref) => (
							<PmpSectionHeader
								data={ref?.data}
								classes={{
									root: styles.seasonPassSectionHeader,
								}}
							/>
						),
					}}/>
				</div>

				{/* REWARDS */}
				<div id={"rewards"} className={classNames(styles.section, styles.rewards)} style={{backgroundImage: getResponsiveBg(rewards_section?.bg)}}>
					<h2 dangerouslySetInnerHTML={sanitizeHTML(rewards_section?.free_rewards_title)} className={styles.rewardsTitle} />
					<RewardsAndCalendar18 />
					<h3 dangerouslySetInnerHTML={sanitizeHTML(rewards_section?.season_pass_rewards_title)} className={styles.rewardsTitle} />
					<S18ProceduralContent content={rewards_section?.content} pmpComponents={pmpComponentOverrides} />
				</div>

				{/* LIGHT */}
				<div id={"light"} className={classNames(styles.section, styles.light)} style={{backgroundImage: getResponsiveBg(light_section?.bg)}}>
					<S18ProceduralContent content={light_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_section_header: (ref) => (
							<PmpSectionHeader
								data={ref?.data}
								classes={{
									root: styles.lightSectionHeader,
									heading: styles.lightSectionHeading,
								}}
							/>
						),
						pmp_callout: (ref) => (
							<PmpCallout data={ref?.data} classes={{
								root: styles.lightCallout,
								heading: styles.lightHeading,
								textWrapper: styles.lightTextWrapper,
							}}/>
						),
					}}/>
				</div>

				{/* EVENTS */}
				<div id={"events"} className={classNames(styles.section, styles.events)} style={{backgroundImage: getResponsiveBg(events_section?.bg)}}>
					<PmpSectionHeader data={events_section?.content?.[0]} classes={{
						root: styles.eventsSectionHeader
					}}/>
					<PmpSectionHeader data={events_section?.content?.[1]} classes={{
						root: styles.eventRewardsSectionHeader
					}}/>
					<PmpMediaCarousel data={events_section?.content[2]} />
				</div>

				{/* BUNDLE */}
				<div id={"bundle"} className={classNames(styles.section, styles.bundle)} style={{backgroundImage: getResponsiveBg(bundle_section?.bg)}}>
					<S18ProceduralContent content={bundle_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_section_header: (ref) => (
							<PmpSectionHeader
								data={ref?.data}
								classes={{
									root: styles.bundleSectionHeader,
									heading: styles.bundleSectionHeading,
								}}
							/>
						),
					}}/>
					<div className={styles.content}>
						<BuyButton
							url={RouteHelper.DestinyBuyDetail({ productFamilyTag: "silverbundle" })}
							buttonType={"teal"}
							className={styles.buyBtn}
						>{cta_section?.btn_text ?? ""}</BuyButton>
						<p className={styles.disclaimer} dangerouslySetInnerHTML={sanitizeHTML(bundle_section?.disclaimer)} />
					</div>
				</div>

				{/* CTA */}
				<div className={(classNames(styles.cta))} style={{ backgroundImage: getResponsiveBg(cta_section?.bg) }}>
					<img className={styles.logo} src={cta_section?.logo?.url} alt={""}/>
					<Button
						url={RouteHelper.DestinyBuyDetail({ productFamilyTag: "silverbundle" })}
						buttonType={"gold"}
					>{cta_section?.btn_text ?? ""}</Button>
				</div>

				{/* MEDIA */}
				<div id={"media"} className={classNames(styles.section, styles.media)}>
					<S18ProceduralContent content={media_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_media: (ref) => (
							<PmpMedia
								data={ref?.data}
								classes={{
									tab: styles.mediaTab,
									selectedTab: styles.mediaSelectedTab,
								}}
							/>
						),
					}}/>
				</div>
				
				{/* LEARN MORE */}
				<div id={"learnMore"} className={classNames(styles.section, styles.learnMore)}>
					<S18ProceduralContent content={learn_more_section?.content} pmpComponents={{
						...pmpComponentOverrides,
						pmp_section_header: (ref) => (
							<PmpSectionHeader
								data={ref?.data}
								classes={{
									root: styles.learnMoreSectionHeader,
									heading: styles.learnMoreHeading,
								}}
							/>
						),
					}}/>
				</div>		
				
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

interface S18ProceduralContentProps
{
	pmpComponents?: PartialPmpReferenceMap;
	content: TPmpComponentData[];
}

/* Renders group of content using useReferenceMap */
const S18ProceduralContent = (props: S18ProceduralContentProps) =>
{
	const {pmpComponents, content} = props;

	const {ReferenceMappedList} = useReferenceMap(extendDefaultComponents(pmpComponents), content as WithContentTypeUids<typeof content> ?? [])

	return (
		<ReferenceMappedList/>
	)
}

export default SeasonOfPlunder;