import StyleType from "../embedded-types/style-type";
import TextNode from "../nodes/text-node";
export interface Metadata {
  text: string;
  attributes: Attributes;

  itemUid: string | undefined;
  itemType: "entry" | "asset" | undefined;
  styleType: StyleType | undefined;
  contentTypeUid: string | undefined;
}

export interface Attributes {
  type?: "entry" | "asset";
  class?: string;
  [key: string]: any;
  "sys-style-type"?: string;
}

export interface EntryAttributes extends Attributes {
  "data-sys-entry-uid": string;
  "data-sys-entry-local": string;
  "data-sys-content-type-uid": string;
}

export interface AssetAttributes extends Attributes {
  "data-sys-asset-uid": string;
  "data-sys-asset-filelink": string;
  "data-sys-asset-contenttype": string;
}

export function createMetadata(attribute: Attributes): Metadata {
  return {
    text: attribute["#text"],
    itemUid: attribute["data-sys-entry-uid"] || attribute["data-sys-asset-uid"],
    itemType: attribute.type,
    styleType: attribute["sys-style-type"] as StyleType,
    attributes: attribute,
    contentTypeUid: attribute["data-sys-content-type-uid"],
  };
}

export function nodeToMetadata(
  attribute: Attributes,
  textNode: TextNode
): Metadata {
  return {
    text: textNode.text,
    itemUid: attribute["entry-uid"] || attribute["asset-uid"],
    itemType: attribute.type,
    styleType: attribute["display-type"] as StyleType,
    attributes: attribute,
    contentTypeUid: attribute["content-type-uid"],
  };
}

export function attributeToString(attributes: Attributes): string {
  let result = "";
  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      let element = attributes[key];
      if (element instanceof Array) {
        let elementString = "";
        let isFirst = true;
        element.forEach((value) => {
          if (isFirst) {
            elementString += `${value}`;
            isFirst = false;
          } else {
            elementString += `, ${value}`;
          }
        });
        element = elementString;
      } else if (typeof element === "object") {
        let elementString = "";
        for (const elementKey in element) {
          if (Object.prototype.hasOwnProperty.call(element, elementKey)) {
            const value = element[elementKey];
            elementString += `${elementKey}:${value}; `;
          }
        }
        element = elementString;
      }
      result += ` ${key}="${element}"`;
    }
  }
  return result;
}
