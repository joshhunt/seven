"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSocialEmbed = exports.DefaultCodeBlock = exports.DefaultBlockQuote = exports.DefaultTableData = exports.DefaultTableHead = exports.DefaultTableRow = exports.DefaultTableFooter = exports.DefaultTableBody = exports.DefaultTableHeader = exports.DefaultTable = exports.DefaultHR = exports.DefaultListItem = exports.DefaultUnorderedList = exports.DefaultOrderedList = exports.DefaultH6 = exports.DefaultH5 = exports.DefaultH4 = exports.DefaultH3 = exports.DefaultH2 = exports.DefaultH1 = exports.DefaultEmbed = exports.DefaultRootNode = exports.DefaultReference = exports.DefaultParagraph = exports.DefaultLink = exports.DefaultImage = exports.DefaultFragment = void 0;
const react_1 = __importDefault(require("react"));
const DefaultMapping_1 = require("./DefaultMapping");
const validateType = (givenType, expectedType) => {
  if (givenType !== expectedType) {
    throw new Error(
      `The data type ${givenType} does not match the expected type for this component: ${expectedType}`
    );
  }
};
const verifyRequiredData = (providedData, requiredData) => {
  const missingData = requiredData.filter((rd) => !providedData[rd]);
  if (missingData.length >= 1) {
    throw new Error(
      `Expected ${missingData.map((mds) => mds).join(", ")} in component type`
    );
  }
};
const DefaultFragment = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.FRAGMENT);
  return react_1.default.createElement("span", { ...data.attrs }, children);
};
exports.DefaultFragment = DefaultFragment;
const DefaultImage = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.IMAGE);
  verifyRequiredData({ src: data.attrs.src }, ["src"]);
  const { url, href, ...props } = data.attrs;
  return react_1.default.createElement("img", { ...props });
};
exports.DefaultImage = DefaultImage;
const DefaultLink = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.LINK);
  verifyRequiredData({ href: data.attrs.href }, ["href"]);
  return react_1.default.createElement("a", { ...data.attrs }, children);
};
exports.DefaultLink = DefaultLink;
const DefaultParagraph = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.PARAGRAPH);
  return react_1.default.createElement("p", { ...data.attrs }, children);
};
exports.DefaultParagraph = DefaultParagraph;
const DefaultReference = ({ data, children }) => {
  return react_1.default.createElement("div", { ...data.attrs }, children);
};
exports.DefaultReference = DefaultReference;
const DefaultRootNode = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.DOCUMENT);
  return react_1.default.createElement("div", { ...data.attrs }, children);
};
exports.DefaultRootNode = DefaultRootNode;
const DefaultEmbed = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.EMBED);
  return react_1.default.createElement(
    "iframe",
    {
      ...data.attrs,
      style: { display: data.attrs?.style?.display || "block" },
    },
    children
  );
};
exports.DefaultEmbed = DefaultEmbed;
const DefaultH1 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_1);
  return react_1.default.createElement("h1", null, children);
};
exports.DefaultH1 = DefaultH1;
const DefaultH2 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_2);
  return react_1.default.createElement("h2", null, children);
};
exports.DefaultH2 = DefaultH2;
const DefaultH3 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_3);
  return react_1.default.createElement("h3", null, children);
};
exports.DefaultH3 = DefaultH3;
const DefaultH4 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_4);
  return react_1.default.createElement("h4", null, children);
};
exports.DefaultH4 = DefaultH4;
const DefaultH5 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_5);
  return react_1.default.createElement("h5", null, children);
};
exports.DefaultH5 = DefaultH5;
const DefaultH6 = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HEADING_6);
  return react_1.default.createElement("h6", null, children);
};
exports.DefaultH6 = DefaultH6;
const DefaultOrderedList = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.ORDER_LIST);
  return react_1.default.createElement("ol", null, children);
};
exports.DefaultOrderedList = DefaultOrderedList;
const DefaultUnorderedList = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.UNORDER_LIST);
  return react_1.default.createElement("ul", null, children);
};
exports.DefaultUnorderedList = DefaultUnorderedList;
const DefaultListItem = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.LIST_ITEM);
  return react_1.default.createElement("li", null, children);
};
exports.DefaultListItem = DefaultListItem;
const DefaultHR = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.HR);
  return react_1.default.createElement("hr", null);
};
exports.DefaultHR = DefaultHR;
const DefaultTable = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE);
  return react_1.default.createElement("table", null, children);
};
exports.DefaultTable = DefaultTable;
const DefaultTableHeader = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_HEADER);
  return react_1.default.createElement("thead", null, children);
};
exports.DefaultTableHeader = DefaultTableHeader;
const DefaultTableBody = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_BODY);
  return react_1.default.createElement("tbody", null, children);
};
exports.DefaultTableBody = DefaultTableBody;
const DefaultTableFooter = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_FOOTER);
  return react_1.default.createElement("tfoot", null, children);
};
exports.DefaultTableFooter = DefaultTableFooter;
const DefaultTableRow = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_ROW);
  return react_1.default.createElement("tr", null, children);
};
exports.DefaultTableRow = DefaultTableRow;
const DefaultTableHead = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_HEAD);
  return react_1.default.createElement("th", null, children);
};
exports.DefaultTableHead = DefaultTableHead;
const DefaultTableData = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.TABLE_DATA);
  return react_1.default.createElement("td", null, children);
};
exports.DefaultTableData = DefaultTableData;
const DefaultBlockQuote = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.BLOCK_QUOTE);
  return react_1.default.createElement("blockquote", null, children);
};
exports.DefaultBlockQuote = DefaultBlockQuote;
const DefaultCodeBlock = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.CODE);
  return react_1.default.createElement("code", null, children);
};
exports.DefaultCodeBlock = DefaultCodeBlock;
const DefaultSocialEmbed = ({ data, children }) => {
  validateType(data.type, DefaultMapping_1.NodeType.SOCIAL);
  return react_1.default.createElement(
    "div",
    {
      style: {
        display: "flex",
        maxWidth: "550px",
        width: "100%",
        marginTop: "10px",
        marginBottom: "10px",
      },
    },
    react_1.default.createElement("iframe", {
      scrolling: "no",
      frameBorder: 0,
      allowTransparency: true,
      allowFullScreen: true,
      style: {
        position: "static",
        visibility: "visible",
        width: "550px",
        height: "885px",
        display: "block",
        flexGrow: 1,
      },
      src: data.attrs.src,
    })
  );
};
exports.DefaultSocialEmbed = DefaultSocialEmbed;
//# sourceMappingURL=DefaultComponents.js.map
