import { Next, RenderOption } from ".";
import MarkType from "../nodes/mark-type";
import Node from "../nodes/node";
import NodeType from "../nodes/node-type";

export const defaultNodeOption: RenderOption = {
  [NodeType.DOCUMENT]: (node: Node) => {
    return ``;
  },
  [NodeType.PARAGRAPH]: (node: Node, next: Next) => {
    return `<p>${next(node.children)}</p>`;
  },
  [NodeType.LINK]: (node: Node, next: Next) => {
    return `<a href="${node.attrs.href}">${next(node.children)}</a>`;
  },
  [NodeType.IMAGE]: (node: Node, next: Next) => {
    return `<img src="${node.attrs.src}" />${next(node.children)}`;
  },
  [NodeType.EMBED]: (node: Node, next: Next) => {
    return `<iframe src="${node.attrs.src}">${next(node.children)}</iframe>`;
  },
  [NodeType.HEADING_1]: (node: Node, next: Next) => {
    return `<h1>${next(node.children)}</h1>`;
  },
  [NodeType.HEADING_2]: (node: Node, next: Next) => {
    return `<h2>${next(node.children)}</h2>`;
  },
  [NodeType.HEADING_3]: (node: Node, next: Next) => {
    return `<h3>${next(node.children)}</h3>`;
  },
  [NodeType.HEADING_4]: (node: Node, next: Next) => {
    return `<h4>${next(node.children)}</h4>`;
  },
  [NodeType.HEADING_5]: (node: Node, next: Next) => {
    return `<h5>${next(node.children)}</h5>`;
  },
  [NodeType.HEADING_6]: (node: Node, next: Next) => {
    return `<h6>${next(node.children)}</h6>`;
  },
  [NodeType.ORDER_LIST]: (node: Node, next: Next) => {
    return `<ol>${next(node.children)}</ol>`;
  },
  [NodeType.UNORDER_LIST]: (node: Node, next: Next) => {
    return `<ul>${next(node.children)}</ul>`;
  },
  [NodeType.LIST_ITEM]: (node: Node, next: Next) => {
    return `<li>${next(node.children)}</li>`;
  },
  [NodeType.HR]: (node: Node, next: Next) => {
    return `<hr>`;
  },
  [NodeType.TABLE]: (node: Node, next: Next) => {
    return `<table>${next(node.children)}</table>`;
  },
  [NodeType.TABLE_HEADER]: (node: Node, next: Next) => {
    return `<thead>${next(node.children)}</thead>`;
  },
  [NodeType.TABLE_BODY]: (node: Node, next: Next) => {
    return `<tbody>${next(node.children)}</tbody>`;
  },
  [NodeType.TABLE_FOOTER]: (node: Node, next: Next) => {
    return `<tfoot>${next(node.children)}</tfoot>`;
  },
  [NodeType.TABLE_ROW]: (node: Node, next: Next) => {
    return `<tr>${next(node.children)}</tr>`;
  },
  [NodeType.TABLE_HEAD]: (node: Node, next: Next) => {
    return `<th>${next(node.children)}</th>`;
  },
  [NodeType.TABLE_DATA]: (node: Node, next: Next) => {
    return `<td>${next(node.children)}</td>`;
  },
  [NodeType.BLOCK_QUOTE]: (node: Node, next: Next) => {
    return `<blockquote>${next(node.children)}</blockquote>`;
  },
  [NodeType.CODE]: (node: Node, next: Next) => {
    return `<code>${next(node.children)}</code>`;
  },

  ["reference"]: (node: Node, next: Next) => {
    return ``;
  },
  ["default"]: (node: Node, next: Next) => {
    return next(node.children);
  },

  [MarkType.BOLD]: (text: string) => {
    return `<strong>${text}</strong>`;
  },
  [MarkType.ITALIC]: (text: string) => {
    return `<em>${text}</em>`;
  },
  [MarkType.UNDERLINE]: (text: string) => {
    return `<u>${text}</u>`;
  },
  [MarkType.STRIKE_THROUGH]: (text: string) => {
    return `<strike>${text}</strike>`;
  },
  [MarkType.INLINE_CODE]: (text: string) => {
    return `<span>${text}</span>`;
  },
  [MarkType.SUBSCRIPT]: (text: string) => {
    return `<sub>${text}</sub>`;
  },
  [MarkType.SUPERSCRIPT]: (text: string) => {
    return `<sup>${text}</sup>`;
  },
};
