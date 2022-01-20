import { AnyNode } from "../json-to-html";
import { EmbeddedItem, EntryEmbedable } from "../Models/embedded-object";
import { Metadata, nodeToMetadata } from "../Models/metadata-model";
import MarkType from "../nodes/mark-type";
import TextNode from "../nodes/text-node";
import Node from "../nodes/node";
import Document from "../nodes/document";
import { Next, RenderMark, RenderNode, RenderOption } from "../options";
import { defaultNodeOption } from "../options/default-node-options";
import { findRenderString } from "./find-embeded-object";
import { EntryNode } from "../Models/json-rte-model";

export function enumerate(
  entries: EntryEmbedable[] | EmbeddedItem[],
  process: (entry: EntryEmbedable | EmbeddedItem) => void
) {
  for (const entry of entries) {
    process(entry);
  }
}

export function enumerateContents(
  content: Document | Document[],
  renderOption?: RenderOption,
  renderEmbed?: (metadata: Metadata) => EmbeddedItem | EntryNode
): string | string[] {
  if (!(content instanceof Array) && content.type !== "doc") {
    return (content as unknown) as string;
  }
  if (content instanceof Array) {
    const result: string[] = [];
    content.forEach((doc) => {
      result.push(enumerateContents(doc, renderOption, renderEmbed) as string);
    });
    return result;
  }
  const commonRenderOption = {
    ...defaultNodeOption,
    ...renderOption,
  };
  return nodeChildrenToHTML(content.children, commonRenderOption, renderEmbed);
}

export function textNodeToHTML(
  node: TextNode,
  renderOption: RenderOption
): string {
  let text = node.text;
  if (node.superscript) {
    text = (renderOption[MarkType.SUPERSCRIPT] as RenderMark)(text);
  }
  if (node.subscript) {
    text = (renderOption[MarkType.SUBSCRIPT] as RenderMark)(text);
  }
  if (node.inlineCode) {
    text = (renderOption[MarkType.INLINE_CODE] as RenderMark)(text);
  }
  if (node.strikethrough) {
    text = (renderOption[MarkType.STRIKE_THROUGH] as RenderMark)(text);
  }
  if (node.underline) {
    text = (renderOption[MarkType.UNDERLINE] as RenderMark)(text);
  }
  if (node.italic) {
    text = (renderOption[MarkType.ITALIC] as RenderMark)(text);
  }
  if (node.bold) {
    text = (renderOption[MarkType.BOLD] as RenderMark)(text);
  }
  return text;
}
export function referenceToHTML(
  node: Node,
  renderOption: RenderOption,
  renderEmbed?: (metadata: Metadata) => EmbeddedItem | EntryNode
): string {
  if (!renderEmbed) {
    return "";
  }
  const metadata = nodeToMetadata(
    node.attrs,
    ((node.children && node.children.length > 0
      ? node.children[0]
      : {}) as unknown) as TextNode
  );
  const item = renderEmbed(metadata);
  return findRenderString(item, metadata, renderOption);
}

function nodeChildrenToHTML(
  nodes: AnyNode[],
  renderOption: RenderOption,
  renderEmbed?: (metadata: Metadata) => EmbeddedItem | EntryNode
): string {
  return nodes
    .map<string>((node: AnyNode) => nodeToHTML(node, renderOption, renderEmbed))
    .join("");
}

function nodeToHTML(
  node: AnyNode,
  renderOption: RenderOption,
  renderEmbed?: (metadata: Metadata) => EmbeddedItem | EntryNode
): string {
  if (!node.type) {
    return textNodeToHTML(node as TextNode, renderOption);
  } else if ((node.type as string) === "reference") {
    return referenceToHTML(node, renderOption, renderEmbed);
  } else {
    const next: Next = (nodes) =>
      nodeChildrenToHTML(nodes, renderOption, renderEmbed);
    if (renderOption[node.type] !== undefined) {
      return (renderOption[node.type] as RenderNode)(node, next);
    } else {
      return (renderOption.default as RenderNode)(node, next);
    }
  }
}
