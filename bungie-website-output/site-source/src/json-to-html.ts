import Node from "./nodes/node";
import TextNode from "./nodes/text-node";
import Document from "./nodes/document";
import { Metadata } from "./Models/metadata-model";
import { EntryEmbedable } from "./Models/embedded-object";
import { findRenderContent } from "./helper/find-render-content";
import { RenderOption } from "./options";
import { findEmbeddedItems } from "./helper/find-embeded-object";
import { enumerate, enumerateContents } from "./helper/enumerate-entries";

export type AnyNode = TextNode | Node;

export function jsonToHTML(option: {
  entry: EntryEmbedable | EntryEmbedable[];
  paths: string[];
  renderOption?: RenderOption;
}) {
  if (option.entry instanceof Array) {
    enumerate(option.entry, (entry: EntryEmbedable) => {
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
    findRenderContent(key, option.entry, (content: Document | Document[]) => {
      return enumerateContents(
        content,
        option.renderOption,
        (metadata: Metadata) => {
          return findEmbeddedItems(metadata, option.entry)[0];
        }
      );
    });
  }
}
