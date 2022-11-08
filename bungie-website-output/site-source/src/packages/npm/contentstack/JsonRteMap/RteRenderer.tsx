"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentTypeDataPairFromChildren = exports.determineContentTypeUid = exports.useRteMap = exports.RteRenderer = void 0;
const react_1 = __importDefault(require("react"));
const DefaultMapping_1 = require("./DefaultMapping");
class RteRenderer {}
exports.RteRenderer = RteRenderer;
/**
 * Transforms attributes from a json string to javascript object so that it can be easily passed to a react component as html attributes
 */
RteRenderer.transformAttrs = (rteNodeAttrs, rteNodeType) => {
  const transformedRteNodeAttrs = { ...rteNodeAttrs };
  if (rteNodeAttrs.style) {
    transformedRteNodeAttrs.style = Object.keys(rteNodeAttrs.style).reduce(
      (previousStylePropertyName, currentStylePropertyName) => {
        const splitKey = currentStylePropertyName.split("-");
        const key = splitKey.reduce((prevKeySubStr, currKeySubStr, i) => {
          return (prevKeySubStr +=
            i === 0
              ? currKeySubStr
              : currKeySubStr[0].toUpperCase() + currKeySubStr.slice(1));
        }, "");
        previousStylePropertyName[key] =
          rteNodeAttrs.style[currentStylePropertyName];
        return previousStylePropertyName;
      },
      {}
    );
  }
  if (rteNodeAttrs.url) {
    transformedRteNodeAttrs.href =
      rteNodeType === DefaultMapping_1.NodeType.LINK ? rteNodeAttrs.url : "";
    transformedRteNodeAttrs.src =
      rteNodeType === DefaultMapping_1.NodeType.IMAGE ||
      rteNodeType === DefaultMapping_1.NodeType.EMBED
        ? rteNodeAttrs.url
        : "";
  }
  if (rteNodeAttrs["class-name"]) {
    transformedRteNodeAttrs.className = rteNodeAttrs["class-name"];
  }
  return transformedRteNodeAttrs;
};
RteRenderer.renderElementOrReference = (params) => {
  const { map, referenceMetas, referenceMap, meta } = params;
  const { data, contentTypeUid } = meta;
  // go through each element from the root node down and
  // if reference, retrieve from references and add as child
  // otherwise, render the element as child
  if (contentTypeUid === DefaultMapping_1.NodeType.REFERENCE && referenceMap) {
    const referenceData =
      referenceMetas.find(
        (ref) => data.attrs["content-type-uid"] === ref.contentTypeUid
      )?.data ?? {};
    const transformedReferenceAttrs = RteRenderer.transformAttrs(
      data.attrs,
      "reference"
    );
    const combinedData = {
      ...referenceData,
      attrs: transformedReferenceAttrs,
    };
    return RteRenderer.renderReference(combinedData, referenceMap);
  }
  return RteRenderer.renderElement(params);
};
/**
 * Renders any kind of node that is returned from the ContentStack json rte REST API response.
 * Iterates through and renders any children of a given node.
 * If provided the top node of the json_rte field, it loops through and renders the whole field in order.
 */
RteRenderer.renderElement = (params) => {
  const { map, referenceMetas, referenceMap, meta } = params;
  const { data, contentTypeUid } = meta;
  const mergedMap = {
    ...DefaultMapping_1.defaultComponents,
    ...map,
  };
  // Get the relevant component renderer for that key from the map
  const componentOrRenderer = mergedMap[contentTypeUid];
  if (!componentOrRenderer) {
    throw new Error(
      `Component not found in map for typename ${contentTypeUid}`
    );
  }
  const Component = componentOrRenderer;
  const transformedAttrs = RteRenderer.transformAttrs(
    data.attrs,
    contentTypeUid
  );
  // Unless we separate out the children from the initial node, they will be overwritten by the ReactNode's "children" property when we return the component
  const elementNode = {
    ...data,
    attrs: transformedAttrs,
    childMetas: exports.getComponentTypeDataPairFromChildren(data),
  };
  return react_1.default.createElement(
    Component,
    { data: elementNode },
    RteRenderer.renderChildren(
      elementNode.childMetas,
      map,
      referenceMetas,
      referenceMap
    )
  );
};
RteRenderer.renderReference = (referenceData, referenceMap) => {
  const contentTypeUid = referenceData._content_type_uid;
  if (!contentTypeUid || contentTypeUid === "undefined") {
    throw new Error(`Data malformed. Couldn't find the content type.`);
  }
  // Get the relevant component renderer for that key
  const componentOrRenderer = referenceMap[contentTypeUid];
  if (!componentOrRenderer) {
    throw new Error(
      `Component not found in reference map for typename ${contentTypeUid}.`
    );
  }
  const Component = componentOrRenderer;
  return react_1.default.createElement(
    Component,
    { data: referenceData },
    referenceData.children
  );
};
RteRenderer.renderChildren = (
  childMetas,
  map,
  referenceMetas,
  referenceMap
) => {
  return childMetas.map((childMeta, i) => {
    return react_1.default.createElement(
      react_1.default.Fragment,
      { key: i },
      childMeta.contentTypeUid === "text"
        ? RteRenderer.renderOrFormatText(childMeta.data).element
        : RteRenderer.renderElementOrReference({
            meta: childMeta,
            map,
            referenceMetas,
            referenceMap,
          })
    );
  });
};
RteRenderer.renderOrFormatText = (textNodeUnknownFormatting) => {
  const includesFormatting = Object.keys(textNodeUnknownFormatting).some(
    (r) => r !== "text"
  );
  if (includesFormatting) {
    return RteRenderer.renderFormattedText(textNodeUnknownFormatting);
  }
  return RteRenderer.renderText(textNodeUnknownFormatting.text);
};
RteRenderer.renderText = (text) => {
  return {
    element: react_1.default.createElement(
      react_1.default.Fragment,
      null,
      text
    ),
  };
};
RteRenderer.renderFormattedText = (textAndFormat) => {
  const text = textAndFormat["text"];
  const styles = Object.keys(textAndFormat).filter((k) => k !== "text");
  const treeBuilder = (child, Parent) =>
    react_1.default.createElement(Parent, null, child);
  let tree = react_1.default.createElement("span", null, text);
  styles.forEach((style) => {
    const formatWrapper = DefaultMapping_1.textFormatMap[style];
    tree = treeBuilder(tree, formatWrapper);
  });
  return { element: tree };
};
const useRteMap = (params) => {
  return {
    RenderedComponent: () => RteRenderer.renderElementOrReference(params),
  };
};
exports.useRteMap = useRteMap;
const determineContentTypeUid = (child) => {
  return (
    child.contentTypeUid ??
    child.type ??
    child.attrs?.["content-type-uid"] ??
    "text"
  );
};
exports.determineContentTypeUid = determineContentTypeUid;
const getComponentTypeDataPairFromChildren = (data) => {
  return data.children.map((child) => {
    return {
      contentTypeUid: exports.determineContentTypeUid(child),
      data: child,
    };
  });
};
exports.getComponentTypeDataPairFromChildren = getComponentTypeDataPairFromChildren;
//# sourceMappingURL=RteRenderer.js.map
