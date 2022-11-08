"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultComponents = exports.NodeType = exports.textFormatMap = exports.TextFormatType = void 0;
const react_1 = __importDefault(require("react"));
const DefaultComponent = __importStar(require("./DefaultComponents"));
/* These TextFormatTypes are occasionally sent down within a TextNode. The key-value pair of "[key: TextFormatType]: "" should only be used to style the supplied text in the TextNode"s {text: string} value */
exports.TextFormatType = {
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  STRIKE_THROUGH: "strikethrough",
  INLINE_CODE: "inlineCode",
  SUBSCRIPT: `subscript`,
  SUPERSCRIPT: `superscript`,
  BREAK: `break`,
};
exports.textFormatMap = {
  [exports.TextFormatType.BOLD]: ({ children }) =>
    react_1.default.createElement("b", null, children),
  [exports.TextFormatType.ITALIC]: ({ children }) =>
    react_1.default.createElement("em", null, children),
  [exports.TextFormatType.UNDERLINE]: ({ children }) =>
    react_1.default.createElement("u", null, children),
  [exports.TextFormatType.STRIKE_THROUGH]: ({ children }) =>
    react_1.default.createElement("s", null, children),
  [exports.TextFormatType.INLINE_CODE]: ({ children }) =>
    react_1.default.createElement("code", null, children),
  [exports.TextFormatType.SUBSCRIPT]: ({ children }) =>
    react_1.default.createElement("sub", null, children),
  [exports.TextFormatType.SUPERSCRIPT]: ({ children }) =>
    react_1.default.createElement("sup", null, children),
  [exports.TextFormatType.BREAK]: ({ children }) =>
    react_1.default.createElement("div", null, children),
};
exports.NodeType = {
  DOCUMENT: "doc",
  IMAGE: "img",
  LINK: "a",
  PARAGRAPH: "p",
  REFERENCE: "reference",
  EMBED: "embed",
  HEADING_1: "h1",
  HEADING_2: "h2",
  HEADING_3: "h3",
  HEADING_4: "h4",
  HEADING_5: "h5",
  HEADING_6: "h6",
  ORDER_LIST: "ol",
  UNORDER_LIST: "ul",
  LIST_ITEM: "li",
  FRAGMENT: "fragment",
  HR: "hr",
  TABLE: "table",
  /** I don't like this choice of thead for tableheader when there's tablehead below either, but it's how contentstack translates it */
  TABLE_HEADER: "thead",
  TABLE_BODY: "tbody",
  TABLE_FOOTER: "tfoot",
  TABLE_ROW: "tr",
  TABLE_HEAD: "th",
  TABLE_DATA: "td",
  BLOCK_QUOTE: "blockquote",
  CODE: "code",
  SOCIAL: "social-embeds",
};
exports.defaultComponents = {
  [exports.NodeType.DOCUMENT]: DefaultComponent.DefaultRootNode,
  [exports.NodeType.IMAGE]: DefaultComponent.DefaultImage,
  [exports.NodeType.LINK]: DefaultComponent.DefaultLink,
  [exports.NodeType.PARAGRAPH]: DefaultComponent.DefaultParagraph,
  [exports.NodeType.REFERENCE]: DefaultComponent.DefaultReference,
  [exports.NodeType.EMBED]: DefaultComponent.DefaultEmbed,
  [exports.NodeType.HEADING_1]: DefaultComponent.DefaultH1,
  [exports.NodeType.HEADING_2]: DefaultComponent.DefaultH2,
  [exports.NodeType.HEADING_3]: DefaultComponent.DefaultH3,
  [exports.NodeType.HEADING_4]: DefaultComponent.DefaultH4,
  [exports.NodeType.HEADING_5]: DefaultComponent.DefaultH5,
  [exports.NodeType.HEADING_6]: DefaultComponent.DefaultH6,
  [exports.NodeType.ORDER_LIST]: DefaultComponent.DefaultOrderedList,
  [exports.NodeType.UNORDER_LIST]: DefaultComponent.DefaultUnorderedList,
  [exports.NodeType.LIST_ITEM]: DefaultComponent.DefaultListItem,
  [exports.NodeType.FRAGMENT]: DefaultComponent.DefaultFragment,
  [exports.NodeType.HR]: DefaultComponent.DefaultHR,
  [exports.NodeType.TABLE]: DefaultComponent.DefaultTable,
  [exports.NodeType.TABLE_HEADER]: DefaultComponent.DefaultTableHeader,
  [exports.NodeType.TABLE_BODY]: DefaultComponent.DefaultTableBody,
  [exports.NodeType.TABLE_FOOTER]: DefaultComponent.DefaultTableFooter,
  [exports.NodeType.TABLE_ROW]: DefaultComponent.DefaultTableRow,
  [exports.NodeType.TABLE_HEAD]: DefaultComponent.DefaultTableHead,
  [exports.NodeType.TABLE_DATA]: DefaultComponent.DefaultTableData,
  [exports.NodeType.BLOCK_QUOTE]: DefaultComponent.DefaultBlockQuote,
  [exports.NodeType.CODE]: DefaultComponent.DefaultCodeBlock,
  [exports.NodeType.SOCIAL]: DefaultComponent.DefaultSocialEmbed,
};
//# sourceMappingURL=DefaultMapping.js.map
