import classNames from "classnames";
import * as React from "react";
import styles from "./Footer.module.scss";
import { RouteHelper, IMultiSiteLink } from "@Global/Routes/RouteHelper";
import { Localizer } from "@Global/Localizer";
import moment from "moment";
import { Models } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface IFooterProps {
  coreSettings: Models.CoreSettingsConfiguration;
}

interface IFooterState {}

/**
 * Footer that shows on most pages
 *  *
 * @param {IFooterProps} props
 * @returns
 */
export class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: IFooterProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const appsEnabled = ConfigUtils.SystemStatus("Applications");

    const navLoc = Localizer.Nav;
    const communityLoc = Localizer.Community;
    const globalsLoc = Localizer.Globals;

    const copyright = Localizer.Format(globalsLoc.Copyright, {
      year: moment().year(),
    });

    return (
      <footer className={styles.footer}>
        <a href="/">
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
              {this.renderLink(RouteHelper.Seasons(), navLoc.TopNavSeasons)}
              {this.renderLink(RouteHelper.MyClan(), navLoc.TopNavCommunity)}
              {this.renderLink(RouteHelper.Fireteams(), navLoc.ClanFireteams)}
              {appsEnabled &&
                this.renderLink(
                  RouteHelper.Applications(),
                  navLoc.DeveloperPortal
                )}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(RouteHelper.Companion(), navLoc.topnavcompanion)}
              {this.renderLink(
                RouteHelper.SignIn(null, location.pathname),
                navLoc.SignUpSignIn
              )}
              {this.renderLink(
                RouteHelper.SeasonsProgress(),
                navLoc.TopNavSeasonProgress
              )}
              {this.renderLink(RouteHelper.Triumphs(), navLoc.TopNavTriumphs)}
              {this.renderLink(RouteHelper.CrossSave(), navLoc.CrossSave)}
              {this.renderLink(
                RouteHelper.PCMigration(),
                navLoc.UserFlyout_PcMove
              )}
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

              {this.renderLink(RouteHelper.LegalTermsOfUse(), navLoc.Terms)}
              {this.renderLink(
                RouteHelper.LegalPrivacyPolicy(),
                navLoc.Privacy
              )}
              {(Localizer.CurrentCultureName === "en" ||
                Localizer.CurrentCultureName === "ja") &&
                this.renderLink(
                  RouteHelper.LegalPaymentServicesAct(),
                  navLoc.paymentServicesAct
                )}
              {this.renderLink(
                RouteHelper.HelpStep(48626),
                navLoc.DoNotSellMyInfo
              )}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(
                RouteHelper.Careers().concat(
                  "?utm_source=BungieNet&utm_medium=footerlink&utm_campaign=BNET_2020"
                ),
                navLoc.Bungie
              )}
              {this.renderLink(RouteHelper.Careers("careers"), navLoc.Careers)}
              {this.renderLink(
                RouteHelper.BungieNewsRoom,
                navLoc.BungieNewsRoom
              )}
              {this.renderLink(RouteHelper.PressKits(), navLoc.PressKit)}
            </ul>
          </div>
          <div className={styles.column}>
            <ul>
              {this.renderLink(
                RouteHelper.BungieStore().concat(
                  "?utm_source=BungieNet&utm_medium=footerlink&utm_campaign=BNET_2020"
                ),
                navLoc.store
              )}
              {this.renderLink(
                RouteHelper.BungieStore("collections/whats-new"),
                navLoc.WhatSNew
              )}
              {this.renderLink(
                RouteHelper.BungieStore("collections"),
                navLoc.Merchandise
              )}
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
                RouteHelper.Foundation("ipadforkids"),
                navLoc.IpadsForKids
              )}
              {this.renderLink(
                RouteHelper.Foundation("news-events"),
                navLoc.NewsAmpEvents
              )}
              {this.renderLink(
                "https://thebungiefoundation.kindful.com/",
                navLoc.Donate
              )}
            </ul>
          </div>
        </div>
        <div className={classNames(styles.navBottom, styles.lower)}>
          <p
            className={styles.copyright}
            dangerouslySetInnerHTML={{ __html: copyright }}
          />

          <div className={styles.followUs}>
            <p>{Localizer.HelpText.FollowUs}</p>
            <ul>
              <li className={styles.facebook}>
                <a
                  href="https://www.facebook.com/Bungie"
                  className="ir"
                  title={Localizer.Community.BungieFacebook}
                />
              </li>
              <li className={styles.instagram}>
                <a
                  href="https://www.instagram.com/bungie/"
                  className="ir"
                  title={Localizer.Community.BungieInstagram}
                />
              </li>
              <li className={styles.twitter}>
                <a
                  href="https://twitter.com/bungie"
                  className="ir"
                  title={Localizer.Community.BungieTwitter}
                />
              </li>
              <li className={styles.youtube}>
                <a
                  href="http://www.youtube.com/user/Bungie"
                  className="ir"
                  title={Localizer.Community.BungieYoutube}
                />
              </li>
              <li className={styles.twitch}>
                <a
                  href="https://www.twitch.tv/bungie"
                  className="ir"
                  title={Localizer.Community.BungieTwitch}
                />
              </li>
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
