// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import * as React from "react";
import { BungieHelmet } from "../Routing/BungieHelmet";
import styles from "./TwitterFeed.module.scss";

export interface TwitterAPI {
  _e?: (() => void)[];
  ready?: (f: (twttr: any) => void) => void;
  widgets?: {
    load?: () => void;
    createTweet?: (
      id: string,
      container: HTMLElement,
      options?: any
    ) => Promise<HTMLElement>;
  };
}

declare global {
  interface Window {
    twttr: TwitterAPI;
  }
}

export const TwitterScript: React.FC = () => {
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

  return <BungieHelmet>{<script>{twitterWidgetScript}</script>}</BungieHelmet>;
};

export class TwitterFeed extends React.Component {
  private twitterLoadingTries = 0;

  constructor(props: {} | Readonly<{}>) {
    super(props);
  }

  public componentDidMount() {
    if (!window.twttr?.widgets) {
      const tryLoadTwitter = new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
          this.twitterLoadingTries += 1;

          if (this.twitterLoadingTries >= 8) {
            clearInterval(interval);
            this.twitterLoadingTries = 0;
          }

          if (window.twttr?.widgets?.load) {
            resolve();
            clearInterval(interval);
            this.twitterLoadingTries = 0;
            this.setState({ visible: true });
          }
        }, 30);
      });

      tryLoadTwitter.then(() => window.twttr.widgets.load());
    } else {
      window.twttr.widgets.load();
    }
  }

  public render() {
    return (
      <>
        <TwitterScript />
        <a
          className={classNames(
            "twitter-timeline",
            "twitter-timeline-rendered",
            styles["twitter-timeline"]
          )}
          href={`https://twitter.com/Bungie?ref_src=twsrc%5Etfw`}
          data-chrome="nofooter noheaders noborders"
          data-tweet-limit={2}
          data-width={"350px"}
          data-theme={"dark"}
        />
        <Anchor
          className={styles.readMore}
          url={`https://www.twitter.com/Bungie`}
        >
          {Localizer.News.ViewMore}
        </Anchor>
      </>
    );
  }
}
