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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReferenceMap = exports.createReferenceMap = exports.ReferenceMapRenderer = void 0;
const react_1 = __importStar(require("react"));
/**
 * Given a map of reference names to components, render components when given the name of the reference and data
 */
class ReferenceMapRenderer {
  constructor(map) {
    this.map = map;
    /**
     * Render one reference from the given data
     * @param meta
     */
    this.renderReference = (meta) => {
      const { data, contentTypeUid } = meta;
      // Get the relevant component renderer for that key
      const componentOrRenderer = this.map[contentTypeUid];
      if (!componentOrRenderer) {
        throw new Error(
          `Component not found in map for typename ${contentTypeUid}`
        );
      }
      const Component = componentOrRenderer;
      // render
      return react_1.default.createElement(Component, { data: data });
    };
    /**
     * Render a list of keys
     * @param meta
     */
    this.renderReferences = (meta) => {
      return meta.map((k, i) =>
        react_1.default.createElement(
          react_1.default.Fragment,
          { key: i },
          this.renderReference(k)
        )
      );
    };
  }
}
exports.ReferenceMapRenderer = ReferenceMapRenderer;
/**
 * A function that returns ways of rendering reference components based on the reference's name. The point of this is
 * to allow developers to deterministically render a given component when the data for that component comes back
 * in a list (so that we don't have to have large switch statements every time we have an array that may contain
 * more than one kind of data). This is useful with ContentStack, if we have an array of references of multiple
 * types.
 * @param _map The map of [reference name] : [function to render the relevant component]
 * @param connectionData The data being used with the reference map
 */
const createReferenceMap = (_map, connectionData) => {
  // create the map
  const mapRenderer = new ReferenceMapRenderer(_map);
  // create the ReferenceMap component
  const ReferenceMappedList = () => {
    // If data items don't include the content type for some reason, skip them, and warn.
    const validData = connectionData.filter(
      (dataItem) => !!dataItem._content_type_uid
    );
    if (validData.length < connectionData.length) {
      const skippedItems = connectionData.filter(
        (dataItem) => !dataItem._content_type_uid
      );
      console.warn(
        `Some data was returned without content type metadata, and will not be rendered. Items skipped: ${skippedItems.length}.`,
        skippedItems
      );
    }
    // Loop through the edges and grab the nodes inside
    const pairs = validData.map((dataItem) => ({
      contentTypeUid: dataItem._content_type_uid,
      data: dataItem,
    }));
    // Render a reference for each node
    return react_1.default.createElement(
      react_1.default.Fragment,
      null,
      mapRenderer.renderReferences(pairs)
    );
  };
  return {
    mapRenderer,
    ReferenceMappedList,
  };
};
exports.createReferenceMap = createReferenceMap;
/**
 * A hook that returns ways of rendering reference components based on the reference's name. The point of this is
 * to allow developers to deterministically render a given component when the data for that component comes back
 * in a list (so that we don't have to have large switch statements every time we have an array that may contain
 * more than one kind of data). This is useful with ContentStack, if we have an array of references of multiple
 * types.
 * @param _map The map of [reference name] : [function to render the relevant component]
 * @param connectionData The data being used with the reference map
 */
const useReferenceMap = (_map, connectionData) => {
  let { mapRenderer, ReferenceMappedList } = exports.createReferenceMap(
    _map,
    connectionData
  );
  // Re-run this if the map changes
  react_1.useEffect(() => {
    const updatedReferenceMap = exports.createReferenceMap(
      _map,
      connectionData
    );
    mapRenderer = updatedReferenceMap.mapRenderer;
    ReferenceMappedList = updatedReferenceMap.ReferenceMappedList;
  }, [_map, connectionData]);
  return {
    mapRenderer,
    ReferenceMappedList,
  };
};
exports.useReferenceMap = useReferenceMap;
//# sourceMappingURL=ReferenceMap.js.map
