import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Emails/Emails.module.scss";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitchIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@Areas/Home/Components/SocialIcons";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { PlatformErrorCodes } from "@Enum";
import { Contract, Platform, User } from "@Platform";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";

interface LinkProps {
  img?: string;
  alt?: string;
  href: IMultiSiteLink | any;
  label?: string;
  node?: ReactNode;
}

const Link: FC<LinkProps> = ({ img, alt, href, label, node }) =>
  href ? (
    <li>
      <Anchor
        url={href}
        className={styles.link}
        aria-label={label ?? alt ?? null}
      >
        {label && label}
        {node && node}
      </Anchor>
    </li>
  ) : null;

const Unsubscribe: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [unsubscribeResponse, setUnsubscribeResponse] = useState<
    User.UserEmailVerificationResponse
  >();
  const [errorResponse, setErrorResponse] = useState<PlatformError>();
  const communityLoc = Localizer.Community;
  const socialLinks = [
    {
      href: "https://twitter.com/bungie",
      alt: communityLoc.BungieTwitter,
      node: <TwitterIcon title={communityLoc.BungieTwitter} />,
    },
    {
      href: "https://www.youtube.com/user/Bungie",
      alt: communityLoc.BungieYoutube,
      node: <YouTubeIcon title={communityLoc.BungieYoutube} />,
    },
    {
      href: "https://www.instagram.com/bungie/",
      alt: communityLoc.BungieInstagram,
      node: <InstagramIcon title={communityLoc.BungieInstagram} />,
    },
    {
      href: "https://www.facebook.com/Bungie",
      alt: communityLoc.BungieFacebook,
      node: <FacebookIcon title={communityLoc.BungieFacebook} />,
    },
    {
      href: "https://www.twitch.tv/bungie",
      alt: communityLoc.BungieTwitch,
      node: <TwitchIcon title={communityLoc.BungieTwitch} />,
    },
    {
      href: "https://www.linkedin.com/company/bungie",
      alt: communityLoc.BungieLinkedIn,
      node: <LinkedInIcon title={communityLoc.BungieLinkedIn} />,
    },
  ];

  useEffect(() => {
    const unsubscribeEmailInput: User.UserEmailVerificationRequest = {
      tokenGuid: params.get("id"),
    };
    Platform.UserService.UnsubscribeEmail(unsubscribeEmailInput)
      .then((response) => {
        setUnsubscribeResponse(response);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        setErrorResponse(e);
      });
  }, []);

  if (errorResponse?.errorCode === PlatformErrorCodes.EmailUnsubscribeFail) {
    return (
      <div className={styles.emailContainer}>
        <h1 className="section-header">{Localizer.emails.UnsubscribeError}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: Localizer.userpages.UnsubEmailFail,
          }}
        />
      </div>
    );
  } else if (
    errorResponse?.errorCode === PlatformErrorCodes.EmailUnsubscribeFailNew
  ) {
    return (
      <div className={styles.emailContainer}>
        <h1 className="section-header">{Localizer.emails.UnsubscribeError}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: Localizer.userpages.UnsubEmailFailNew,
          }}
        />
      </div>
    );
  } else if (errorResponse?.message) {
    return (
      <div className={styles.emailContainer}>
        <h1 className="section-header">{Localizer.emails.UnsubscribeError}</h1>
        <p>{errorResponse?.message}</p>
      </div>
    );
  }

  return (
    <SpinnerContainer loading={!unsubscribeResponse}>
      <div className={styles.emailContainer}>
        <h1 className="section-header">
          {Localizer.emails.UnsubscribeSuccess}
        </h1>
        <h4>{Localizer.emails.UnsubscribeMessage}</h4>
        <div className={styles.socialContainer}>
          {Array.isArray(socialLinks) && socialLinks?.length > 0 && (
            <ul className={styles.socialList}>
              {socialLinks.map((socialData) => (
                <Link key={socialData?.alt} {...socialData} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </SpinnerContainer>
  );
};

export default React.memo(Unsubscribe);
