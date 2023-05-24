// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { FC, useMemo, useState, useEffect } from "react";
import classNames from "classnames";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import LocaleSwitcher from "@UI/Navigation/LocaleSwitcher";

import styles from "./Navigation.module.scss";

interface Props {
  isTopOfPage?: boolean;
}

const Navigation: FC<Props> = ({ isTopOfPage = true }) => {
  const navLoc = Localizer.Nav;

  const [menuExpanded, setMenuExpanded] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  /* Capture Resize */
  useEffect(() => {
    const debouncedHandleResize = () =>
      window.requestAnimationFrame(() =>
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
        })
      );

    window.addEventListener("resize", debouncedHandleResize);

    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  /* Reset menu state on resize */
  useEffect(() => {
    setMenuExpanded(false);
  }, [dimensions]);

  const composedLinkClass = useMemo(
    () =>
      classNames(styles.links, {
        [styles.active]: menuExpanded,
        [styles.inactive]: !menuExpanded,
        [styles.activeDefault]: isTopOfPage,
        [styles.activeScroll]: !isTopOfPage,
      }),
    [menuExpanded, isTopOfPage]
  );

  const composedWrapperClass = useMemo(
    () =>
      classNames(styles.topNav, {
        [styles.defaultNav]: isTopOfPage,
        [styles.scrollNav]: !isTopOfPage || menuExpanded,
      }),
    [isTopOfPage, menuExpanded]
  );

  const composedLogoClass = useMemo(
    () =>
      classNames(styles.logo, {
        [styles.defaultLogo]: isTopOfPage,
        [styles.scrollLogo]: !isTopOfPage,
      }),
    [isTopOfPage]
  );

  return (
    <header className={composedWrapperClass}>
      <div className={styles.primaryNav}>
        <div className={styles.menuContainer}>
          <div
            className={styles.smallMenu}
            onClick={(e) => {
              e.preventDefault();
              setMenuExpanded(!menuExpanded);
            }}
          />
          <Anchor url={RouteHelper.Home} aria-label={navLoc.Bungie}>
            <img
              src={"/7/ca/bungie/icons/logos/bungienet/bungie_logo_basic.svg"}
              className={composedLogoClass}
            />
          </Anchor>
        </div>
        <div className={styles.linkContainer}>
          <nav className={composedLinkClass}>
            <Anchor url={RouteHelper.DestinyHome()}>
              {navLoc.NavTopGameCollapse}
            </Anchor>
            <Anchor
              url={
                "https://www.marathonthegame.com?CID=bungie_net:web:bnet_home:bnet_header:marathon:bng:2024_05"
              }
            >
              {navLoc.Marathon}
            </Anchor>
            <Anchor url={RouteHelper.Careers()}>{navLoc.AboutUsCareers}</Anchor>
          </nav>

          <div className={styles.locale}>
            <LocaleSwitcher
              classes={{
                wrapper: styles.localeWrapper,
                options: styles.localeOptions,
                trigger: styles.localeTrigger,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
