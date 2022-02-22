// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import classNames from "classnames";
import React, { HTMLProps } from "react";
import { Anchor } from "../Navigation/Anchor";
import { BungieHelmet } from "../Routing/BungieHelmet";
import styles from "./TwitterFeed.module.scss";

interface TwitterFeedProps extends HTMLProps<HTMLDivElement> {
  account: string;
}

const twitterWidgetScript = `window.twttr = (function (d, s, id)
{var js, fjs = d.getElementsByTagName(s)[0],
	t = window.twttr || {};
	if (d.getElementById(id))
	{return t;}
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js, fjs);
	t._e = [];
	t.ready = function (f)
	{t._e.push(f);};
	return t;}(document, 'script', 'twitter-wjs'))`;

const TwitterFeed: React.FC<TwitterFeedProps> = ({ account }) => {
  return (
    <div>
      <BungieHelmet>{<script>{twitterWidgetScript}</script>}</BungieHelmet>
      <a
        className={classNames("twitter-timeline", styles["twitter-timeline"])}
        href={`https://twitter.com${account}?ref_src=twsrc%5Etfw`}
        data-chrome="nofooter noheaders noborders"
        data-tweet-limit={2}
        data-width={"350"}
        data-height={"auto"}
        data-theme={"dark"}
      />
      <Anchor
        className={styles.readMore}
        url={`https://www.twitter.com${account}`}
      >
        {Localizer.News.ReadMore}
      </Anchor>
    </div>
  );
};

export default React.memo(TwitterFeed);
