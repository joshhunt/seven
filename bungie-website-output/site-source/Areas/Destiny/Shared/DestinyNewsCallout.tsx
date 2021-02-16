import React from "react";
import { Anchor } from "@UI/Navigation/Anchor";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import styles from "./DestinyNewsCallouts.module.scss";

export interface IDestinyNewsCalloutProps {
  bgPath: string;
  newsCalloutTitle: string;
  newsCalloutLink: IMultiSiteLink;
}

export class DestinyNewsCallout extends React.Component<
  IDestinyNewsCalloutProps
> {
  constructor(props: IDestinyNewsCalloutProps) {
    super(props);
  }

  public render() {
    return (
      <Anchor className={styles.newsCallout} url={this.props.newsCalloutLink}>
        <div
          style={{ backgroundImage: `url(${this.props.bgPath})` }}
          className={styles.bgImage}
        />
        <div className={styles.textArea}>
          <div className={styles.title}>{this.props.newsCalloutTitle}</div>
        </div>
      </Anchor>
    );
  }
}
