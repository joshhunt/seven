export enum BasicSize {
  Tiny,
  Small,
  Medium,
  Large,
}

export type Coin<TCoinProps> = React.ReactElement<TCoinProps>;
export type CoinWithRenderable<TCoinProps> =
  | React.ReactElement<TCoinProps>
  | React.ReactNode;
