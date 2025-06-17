// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { FC, memo, ReactNode } from "react";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import moment from "moment/moment";
import { DateTime } from "luxon";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";

import styles from "./SlimFooter.module.scss";

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

interface Props {
  links: LinkProps[];
  socialLinks: LinkProps[];
  siteLogo: LinkProps;
}
const SlimFooter: FC<Props> = ({ socialLinks, links, siteLogo }) => {
  const globalsLoc = Localizer.Globals;

  const copyright = Localizer.Format(globalsLoc.Copyright, {
    /*year: moment().year()*/
    year: DateTime.local().year,
  });

  const lucasCopyright = Localizer.nav.StarWars2024Lucasfilm;

  return (
    <footer className={styles.slimFooter}>
      <div className={styles.footerContainer}>
        {Array.isArray(socialLinks) && socialLinks?.length > 0 && (
          <ul className={styles.socialList}>
            {socialLinks.map((socialData) => (
              <Link key={socialData?.alt} {...socialData} />
            ))}
          </ul>
        )}

        <div className={styles.linksContainer}>
          {Array.isArray(links) && links?.length > 0 && (
            <ul className={styles.linkList}>
              {links?.map((link) => (
                <Link key={link.label} {...link} />
              ))}
            </ul>
          )}
        </div>

        <div className={styles.siteLogo}>
          {siteLogo?.img && (
            <Anchor url={siteLogo.href} aria-label={Localizer.Nav.Home}>
              <img src={siteLogo?.img} />
            </Anchor>
          )}
          <p dangerouslySetInnerHTML={sanitizeHTML(copyright)} />
          <p dangerouslySetInnerHTML={sanitizeHTML(lucasCopyright)} />
        </div>
      </div>
    </footer>
  );
};
export default memo(SlimFooter);
