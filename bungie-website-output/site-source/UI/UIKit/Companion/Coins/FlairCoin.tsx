import * as React from "react";

export interface IFlairCoinProps {}

export class FlairCoin extends React.Component<IFlairCoinProps> {
  public render() {
    return <div className={`flair-coin`}>{this.props.children}</div>;
  }
}
