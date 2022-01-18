import { HTMLElement } from "node-html-parser";

export function elementToJson(element: HTMLElement): object {
  let obj: any = { ...element.rawAttributes };

  element.childNodes.forEach((chileNode) => {
    const node: HTMLElement = chileNode as HTMLElement;
    obj = {
      ...obj,
      ...parseElement(node),
    };
  });
  return obj;
}

function parseElement(node: HTMLElement): any {
  const obj: any = {};
  if (node.nodeType === 3) {
    obj["#text"] = node.text;
  } else if (node.nodeType === 1) {
    obj[node.tagName.toLowerCase()] = elementToJson(node);
  }
  return obj;
}
