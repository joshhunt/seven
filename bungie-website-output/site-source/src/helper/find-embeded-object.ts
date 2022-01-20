import { defaultOptions } from "../options/default-options";
import { EntryEmbedable, EmbeddedItem } from "../Models/embedded-object";
import { RenderOption, RenderContentType, RenderItem } from "../options/index";
import { EntryAttributes, Metadata } from "../Models/metadata-model";
import { EntryNode } from "../Models/json-rte-model";

// This function will find Embedded object present in string
export function findEmbeddedEntry(
  uid: string,
  contentTypeUid: string,
  embeddeditems: (EmbeddedItem | EntryNode)[] = []
): (EmbeddedItem | EntryNode)[] {
  return embeddeditems.filter((entry: any) => {
    if (
      (entry.uid &&
        (entry as EmbeddedItem).uid === uid &&
        (entry as EmbeddedItem)._content_type_uid === contentTypeUid) ||
      (entry.system &&
        (entry as EntryNode).system.uid === uid &&
        (entry as EntryNode).system.content_type_uid === contentTypeUid)
    ) {
      return entry;
    }
  });
}

export function findEmbeddedAsset(
  uid: string,
  embeddedAssets: (EmbeddedItem | EntryNode)[] = []
): (EmbeddedItem | EntryNode)[] {
  return embeddedAssets.filter((asset: any) => {
    if (
      (asset.uid && (asset as EmbeddedItem).uid === uid) ||
      (asset.system && (asset as EntryNode).system.uid === uid)
    ) {
      return asset;
    }
  });
}

export function findGQLEmbeddedItems(
  metadata: Metadata,
  items: (EmbeddedItem | EntryNode)[]
): (EmbeddedItem | EntryNode)[] {
  if (metadata.itemType === "entry") {
    return findEmbeddedEntry(metadata.itemUid, metadata.contentTypeUid, items);
  } else {
    return findEmbeddedAsset(metadata.itemUid, items);
  }
}

export function findEmbeddedItems(
  object: Metadata,
  entry: EntryEmbedable
): (EmbeddedItem | EntryNode)[] {
  if (object && object !== undefined && entry && entry !== undefined) {
    if (entry._embedded_items !== undefined) {
      const entryEmbedable = entry;
      const items = Object.values(entryEmbedable._embedded_items || []).reduce(
        (accumulator, value) => accumulator.concat(value),
        []
      );
      return findGQLEmbeddedItems(object, items);
    }
  }
  return [];
}

export function findRenderString(
  item: EmbeddedItem | EntryNode,
  metadata: Metadata,
  renderOptions?: RenderOption
): string {
  if ((!item && item === undefined) || (!metadata && metadata === undefined)) {
    return "";
  }

  if (renderOptions && renderOptions[metadata.styleType] !== undefined) {
    const renderFunction = renderOptions[metadata.styleType] as RenderItem;

    if (
      (metadata.attributes as EntryAttributes)["data-sys-content-type-uid"] !==
        undefined &&
      typeof renderFunction !== "function" &&
      renderFunction[
        (metadata.attributes as EntryAttributes)["data-sys-content-type-uid"]
      ] !== undefined
    ) {
      return (renderFunction as RenderContentType)[
        (metadata.attributes as EntryAttributes)["data-sys-content-type-uid"]
      ](item, metadata);
    } else if (
      (metadata.attributes as EntryAttributes)["data-sys-content-type-uid"] !==
        undefined &&
      typeof renderFunction !== "function" &&
      (renderFunction as RenderContentType).$default !== undefined
    ) {
      return (renderFunction as RenderContentType).$default(item, metadata);
    } else if (
      metadata.contentTypeUid !== undefined &&
      typeof renderFunction !== "function" &&
      renderFunction[metadata.contentTypeUid] !== undefined
    ) {
      return (renderFunction as RenderContentType)[metadata.contentTypeUid](
        item,
        metadata
      );
    } else if (
      metadata.contentTypeUid !== undefined &&
      typeof renderFunction !== "function" &&
      (renderFunction as RenderContentType).$default !== undefined
    ) {
      return (renderFunction as RenderContentType).$default(item, metadata);
    } else if (typeof renderFunction === "function") {
      return renderFunction(item, metadata);
    }
  }
  const defaultRenderFunction = defaultOptions[
    metadata.styleType
  ] as RenderItem;
  return defaultRenderFunction(item, metadata);
}
