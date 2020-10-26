// Created by jlauer, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import { IContentfulAssetProps, ContentfulUtils } from "./ContentfulUtils";
import { Asset } from "contentful";

interface IContentfulAssetState {}

/**
 * ContentfulAsset - Renders a contentful asset
 *  *
 * @param {IContentfulAssetProps} props
 * @returns
 */
export class ContentfulAsset<T extends object> extends React.Component<
  IContentfulAssetProps<T>,
  IContentfulAssetState
> {
  constructor(props: IContentfulAssetProps<T>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { asset, entryCollection } = this.props;

    // Find the actual asset in the entry collection that matches the ID of the one in props
    const foundAsset = entryCollection.includes.Asset.find(
      (a) => a.sys.id === asset.sys.id
    );

    // Find the image in question ($todo jlauer - support videos and stuff)
    const image = foundAsset.fields.file.details.image;

    return (
      <div className="asset">
        <LinkIfSmall asset={foundAsset}>
          <img
            loading="lazy"
            src={foundAsset.fields.file.url}
            width={image.width}
            height={image.height}
          />
        </LinkIfSmall>
      </div>
    );
  }
}

interface ILinkIfSmallProps {
  asset: Asset;
}

/**
 * If we're at desktop size, show a modal. If not, link to the asset in a new tab.
 * @param asset
 * @param children
 * @constructor
 */
const LinkIfSmall: React.FC<ILinkIfSmallProps> = ({ asset, children }) => {
  const file = asset.fields.file;
  const image = file.details.image;
  const { height, width } = image;

  const [shouldLink, setShouldLink] = React.useState(false);

  const onResize = () => {
    if (width && height) {
      if (window.innerWidth < width && !shouldLink) {
        setShouldLink(true);
      } else if (window.innerWidth >= width && shouldLink) {
        setShouldLink(false);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <>
      {shouldLink ? (
        <a href={file.url} target="_blank">
          {children}
        </a>
      ) : (
        children
      )}
    </>
  );
};
