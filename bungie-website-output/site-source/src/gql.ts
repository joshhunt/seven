import Node from "./nodes/node";
import TextNode from "./nodes/text-node";
import { RenderOption } from "./options";
import { JsonRTE } from "./Models/json-rte-model";
import { Metadata } from "./Models/metadata-model";
import { findRenderContent } from "./helper/find-render-content";
import { findGQLEmbeddedItems } from "./helper/find-embeded-object";
import { EmbeddedItem, EntryEmbedable } from "./Models/embedded-object";
import { enumerate, enumerateContents } from "./helper/enumerate-entries";

export type AnyNode = TextNode | Node;

function jsonToHTML(option: {
  entry: EmbeddedItem | EmbeddedItem[];
  paths: string[];
  renderOption?: RenderOption;
}) {
  if (option.entry instanceof Array) {
    enumerate(option.entry, (entry: EmbeddedItem) => {
      jsonToHTML({
        entry,
        paths: option.paths,
        renderOption: option.renderOption,
      });
    });
  } else {
    enumerateKeys({
      entry: option.entry,
      paths: option.paths,
      renderOption: option.renderOption,
    });
  }
}

function enumerateKeys(option: {
  entry: EntryEmbedable;
  paths: string[];
  renderOption?: RenderOption;
}) {
  for (const key of option.paths) {
    findRenderContent(key, option.entry, (content: JsonRTE) => {
      if (content && content.json) {
        const edges = content.embedded_itemsConnection
          ? content.embedded_itemsConnection.edges
          : [];
        const items = Object.values(edges || []).reduce(
          (accumulator, value) => accumulator.concat(value.node),
          []
        );
        return enumerateContents(
          content.json,
          option.renderOption,
          (metadata: Metadata) => {
            return findGQLEmbeddedItems(metadata, items)[0];
          }
        );
      }
      return (content as unknown) as string;
    });
  }
}
export const GQL = {
  jsonToHTML,
};
