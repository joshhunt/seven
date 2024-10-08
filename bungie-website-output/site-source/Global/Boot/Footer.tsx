import { FooterLink } from "@Boot/FooterLink";
import { Localizer } from "@bungie/localization";
import { IMultiSiteLink, RouteHelper } from "@Global/Routes/RouteHelper";
import { SystemNames } from "@Global/SystemNames";
import { Models } from "@Platform";
import { IoIosArrowDropupCircle } from "@react-icons/all-files/io/IoIosArrowDropupCircle";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import moment from "moment";
import * as React from "react";
import styles from "./Footer.module.scss";

interface IFooterProps {
  coreSettings: Models.CoreSettingsConfiguration;
  className?: string;
  isFixed?: boolean;
}

interface IFooterState {
  showFooter: boolean;
}

/**
 * Footer that shows on most pages
 *  *
 * @param {IFooterProps} props
 * @returns
 */
export class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: IFooterProps) {
    super(props);

    this.state = {
      showFooter: false,
    };
  }

  public render() {
    const appsEnabled = ConfigUtils.SystemStatus("Applications");

    const navLoc = Localizer.Nav;
    const communityLoc = Localizer.Community;
    const globalsLoc = Localizer.Globals;

    const copyright = Localizer.Format(globalsLoc.Copyright, {
      year: moment().year(),
    });

    const toggleFooter = () => {
      if (this.props.isFixed) {
        this.setState({ showFooter: !this.state.showFooter });
      }
    };

    // get user's current locale (i.e. 'en', 'es', etc.)
    const userLanguage = Localizer.CurrentCultureName.toLowerCase();
    // get appropriate social media links based on user's locale
    const facebookUrl = ConfigUtils.GetParameter(
      SystemNames.FacebookUrlByLocale,
      userLanguage,
      "https://www.facebook.com/DestinyTheGame"
    );
    const twitterUrl = ConfigUtils.GetParameter(
      SystemNames.TwitterUrlByLocale,
      userLanguage,
      "https://twitter.com/DestinyTheGame"
    );
    const instagramUrl = ConfigUtils.GetParameter(
      SystemNames.InstagramUrlByLocale,
      userLanguage,
      "https://www.instagram.com/DestinyTheGame/"
    );

    const classes = classNames(styles.footer, {
      [this.props.className]: this.props.className,
      [styles.fixedFooter]: this.props.isFixed,
      [styles.showFooter]: this.state.showFooter,
    });

    return (
      <footer className={classes}>
        {this.props.isFixed && (
          <div className={styles.footerTrigger} onClick={() => toggleFooter()}>
            <SafelySetInnerHTML
              html={Localizer.Format(Localizer.Globals.copyright, {
                year: new Date().getFullYear(),
              })}
            />
            <IoIosArrowDropupCircle className={styles.footerTriggerIcon} />
          </div>
        )}
        <a href="/7">
          <img
            src="/7/ca/bungie/icons/logos/bungienet/bungie_logo_footer.png"
            className={styles.footerLogo}
          />
        </a>

        <div className={styles.navBottom}>
          <div className={styles.column}>
            <ul>
              {this.renderLink(
                RouteHelper.NewLight(),
                navLoc.NavTopGameCollapse
              )}
              {this.renderLink(RouteHelper.News(), navLoc.news)}
              {this.renderLink(
                RouteHelper.DestinyBuy(),
                navLoc.TopNavBuyDestiny2
              )}
              {this.renderLink(
                RouteHelper.DestinyBuy({ version: "Promo" }),
                navLoc.Expansions
              )}
              {this.renderLink("/episoderevenant", navLoc.TopNavEpisodes)}
              {this.renderLink(RouteHelper.MyClan(), navLoc.TopNavCommunity)}
              {this.renderLink(
                ConfigUtils.SystemStatus(SystemNames.FireteamFinderWebUI)
                  ? //game integrated fireteam finder
                    RouteHelper.FireteamFinder()
                  : ConfigUtils.SystemStatus(SystemNames.ReactFireteamUI)
                  ? //bnet only fireteam finder react
                    RouteHelper.DeprecatedReactFireteams()
                  : //bnet only fireteam finder razor
                    RouteHelper.Fireteams(),
                navLoc.ClanFireteams
              )}
              {appsEnabled &&
                this.renderLink(
                  ConfigUtils.SystemStatus(SystemNames.ApplicationsReactUI)
                    ? RouteHelper.ApplicationsReact()
                    : RouteHelper.Applications(),
                  navLoc.DeveloperPortal
                )}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(RouteHelper.Companion(), navLoc.topnavcompanion)}
              {this.renderLink(
                RouteHelper.SignIn(null, window.location.pathname),
                navLoc.SignUpSignIn
              )}
              {this.renderLink(
                RouteHelper.SeasonsProgress(),
                navLoc.TopNavSeasonPassProgress
              )}
              {this.renderLink(
                RouteHelper.NewTriumphs(),
                navLoc.TopNavTriumphs
              )}
              {this.renderLink(RouteHelper.CrossSave(), navLoc.CrossSave)}
              {this.renderLink(
                RouteHelper.Rewards(),
                navLoc.UserFlyout_Rewards
              )}
              {this.renderLink(
                RouteHelper.CodeRedemptionReact(),
                navLoc.UserFlyout_RedeemCodes
              )}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(RouteHelper.Help(), navLoc.help)}
              {this.renderLink(RouteHelper.GuideDestiny(), navLoc.Guides)}
              {this.renderLink(RouteHelper.Help(), navLoc.faq)}

              <FooterLink
                url={RouteHelper.LegalPage({ pageName: "sla" })}
                label={navLoc.Legal}
              />
              <FooterLink
                url={RouteHelper.LegalPage({
                  pageName: "terms",
                })}
                label={navLoc.Terms}
              />
              <FooterLink
                url={RouteHelper.LegalPage({
                  pageName: "privacypolicy",
                })}
                label={navLoc.Privacy}
              />
              {(Localizer.CurrentCultureName === "en" ||
                Localizer.CurrentCultureName === "ja") && (
                <FooterLink
                  url={RouteHelper.LegalPage({
                    pageName: "paymentservicesact",
                  })}
                  label={navLoc.paymentServicesAct}
                />
              )}
              <FooterLink
                url={RouteHelper.HelpStep(48626)}
                label={navLoc.DoNotSellMyInfo}
              />
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              <FooterLink
                url={RouteHelper.Careers().concat(
                  "?utm_source=BungieNet&utm_medium=footerlink&utm_campaign=BNET_2020"
                )}
                label={navLoc.Bungie}
              />
              <FooterLink
                url={RouteHelper.Careers("jobs")}
                label={navLoc.Careers}
              />
              <FooterLink
                url={RouteHelper.BungieTechBlog()}
                label={navLoc.TechBlog}
              />
              <FooterLink
                url={RouteHelper.PressKits()}
                label={navLoc.PressKit}
              />
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              <FooterLink
                url={RouteHelper.BungieStore().concat(
                  "?utm_source=BungieNet&utm_medium=footerlink&utm_campaign=BNET_2020"
                )}
                label={navLoc.store}
              />
              <FooterLink
                url={RouteHelper.BungieStore("collections/whats-new")}
                label={navLoc.WhatSNew}
              />
              <FooterLink
                url={RouteHelper.BungieStore("merchandise")}
                label={navLoc.Merchandise}
              />
              {this.renderLink(
                RouteHelper.BungieStore("collections/soundtracks"),
                navLoc.Soundtracks
              )}
              {this.renderLink(
                RouteHelper.BungieStore("collections/community-artist-series"),
                navLoc.CommunityArtistSeries
              )}
              {this.renderLink(
                RouteHelper.BungieStore("collections/bungie-rewards"),
                navLoc.BungieRewards
              )}
              {this.renderLink(
                RouteHelper.BungieStore("collections/last-chance"),
                navLoc.LastChance
              )}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(
                RouteHelper.Foundation().concat(
                  "?utm_source=BungieNet&utm_medium=footerlink&utm_campaign=BNET_2020"
                ),
                navLoc.AboutUsBungieFoundation
              )}
              {this.renderLink(
                RouteHelper.Foundation("littlelights"),
                navLoc.IpadsForKids
              )}
              {this.renderLink(
                RouteHelper.Foundation("news-events"),
                navLoc.NewsAmpEvents
              )}
              {this.renderLink(
                "https://bungiefoundation.donordrive.com/index.cfm?fuseaction=donate.event&eventID=506",
                navLoc.Donate
              )}
            </ul>
          </div>
        </div>
        <div className={classNames(styles.navBottom, styles.lower)}>
          <p
            className={styles.copyright}
            dangerouslySetInnerHTML={sanitizeHTML(copyright)}
          />

          <div className={styles.followUs}>
            <p>{Localizer.HelpText.FollowUs}</p>
            <ul>
              <li>
                <a
                  href={facebookUrl}
                  className="ir"
                  title={Localizer.Community.DestinyFacebook}
                />
              </li>
              <li className={styles.instagram}>
                <a
                  href={instagramUrl}
                  className="ir"
                  title={Localizer.Community.DestinyInstagram}
                />
              </li>
              <li className={styles.twitter}>
                <a
                  href={twitterUrl}
                  className="ir"
                  title={Localizer.Community.DestinyTwitter}
                />
              </li>
              <li className={styles.youtube}>
                <a
                  href="https://www.youtube.com/user/destinygame"
                  className="ir"
                  title={Localizer.Community.DestinyYoutube}
                />
              </li>
              <li className={styles.twitch}>
                <a
                  href="https://www.twitch.tv/bungie"
                  className="ir"
                  title={Localizer.Community.BungieTwitch}
                />
              </li>
              <li className={styles.tiktok}>
                <a
                  href="https://www.tiktok.com/@DestinyTheGame"
                  className="ir"
                  title={Localizer.Community.DestinyTikTok}
                />
              </li>
              <li className={styles.discord}>
                <a
                  href="https://discord.gg/destinygame"
                  className="ir"
                  title={Localizer.Community.DestinyDiscord}
                />
              </li>
              {Localizer.CurrentCultureName === "ru" && (
                <li className={styles.vk}>
                  <a
                    href={"https://vk.com/destinythegame"}
                    className={"ir"}
                    title={Localizer.Community.BungieVk}
                  />
                </li>
              )}
            </ul>
          </div>
          <div className={classNames(styles.esrb)}>
            <a href={communityLoc.ratingurl} className="esrb">
              <img
                src={communityLoc.ratingimage}
                alt={communityLoc.ratedtforteen}
              />
            </a>
          </div>
        </div>
        <div className={styles.appLinks}>
          {Localizer.Community.DownloadtheDestinyCompanionApp}
          <div>
            <a
              href="http://apps.apple.com/us/app/bungie-mobile/id441444902"
              className={styles.btnAppStore}
              style={{
                backgroundImage: `url("/img/theme/bungienet/btns/app-store-badges/app-store-badge-${Localizer.CurrentCultureName}.svg")`,
              }}
            >
              {Localizer.Actions.DownloadOnAppStore}
            </a>
            <a
              href="http://play.google.com/store/apps/details?id=com.bungieinc.bungiemobile"
              className={styles.btnGooglePlay}
              style={{
                backgroundImage: `url("/img/theme/bungienet/btns/google-play-badges/google-play-badge-${Localizer.CurrentCultureName}-1.png")`,
              }}
            >
              {Localizer.Actions.GetItOnGooglePlay}
            </a>
          </div>
        </div>
      </footer>
    );
  }

  private renderLink(url: IMultiSiteLink | string, label: string) {
    return (
      <li>
        <Anchor url={url}>{label}</Anchor>
      </li>
    );
  }
}
