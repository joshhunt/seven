import StyleType from "../embedded-types/style-type";
import { RenderOption } from ".";
import { Metadata } from "../Models/metadata-model";
import { EmbeddedItem } from "../Models/embedded-object";
import { EntryNode } from "../Models/json-rte-model";

export const defaultOptions: RenderOption = {
  [StyleType.BLOCK]: (item: EmbeddedItem | EntryNode) =>
    `<div><p>${item.title || item.uid}</p><p>Content type: <span>${
      item._content_type_uid ||
      (item.system ? item.system.content_type_uid : "")
    }</span></p></div>`,
  [StyleType.INLINE]: (item: EmbeddedItem | EntryNode) =>
    `<span>${item.title || item.uid}</span>`,
  [StyleType.LINK]: (item: EmbeddedItem | EntryNode, metadata: Metadata) =>
    `<a href="${item.url}">${
      metadata.text ||
      item.title ||
      item.uid ||
      (item.system ? item.system.uid : "")
    }</a>`,
  [StyleType.DISPLAY]: (item: EmbeddedItem | EntryNode, metadata: Metadata) =>
    `<img src="${item.url}" alt="${
      metadata.attributes.alt ||
      item.title ||
      item.filename ||
      item.uid ||
      (item.system ? item.system.uid : "")
    }" />`,
  [StyleType.DOWNLOAD]: (item: EmbeddedItem | EntryNode, metadata: Metadata) =>
    `<a href="${item.url}">${
      metadata.text ||
      item.title ||
      item.uid ||
      (item.system ? item.system.content_type_uid : "")
    }</a>`,
};
