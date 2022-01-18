import Node from "./node";
import NodeType from "./node-type";

export default class Document extends Node {
  type: NodeType.DOCUMENT;

  constructor() {
    super();
    this.type = NodeType.DOCUMENT;
  }
}
