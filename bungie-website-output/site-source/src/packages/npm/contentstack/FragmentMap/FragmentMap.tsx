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
exports.useFragmentMap = exports.createFragmentMap = exports.FragmentMapRenderer = void 0;
const react_1 = __importStar(require("react"));
/**
 * Given a map of fragment names to components, render components when given the name of the fragment and data
 */
class FragmentMapRenderer {
  constructor(map) {
    this.map = map;
  }
  /**
   * Render one fragment from the given $key
   * @param $key The individual node item from the connection. The TS type of this is usually called YourFragment$key
   */
  renderFragment($key) {
    // Get the fragment's name
    const fragmentTypeName = $key.__typename;
    if (!fragmentTypeName) {
      throw new Error(
        `The '__typename' property was not found in the data for this fragment. Please include the __typename property in your query for each node in this connection (e.g. edges { node { __typeName } }).`
      );
    }
    // Get the relevant component renderer for that key
    const componentOrRenderer = this.map[fragmentTypeName];
    if (!componentOrRenderer) {
      throw new Error(
        `Component not found in fragment map for typename ${fragmentTypeName}`
      );
    }
    const Component = componentOrRenderer;
    // render
    return react_1.default.createElement(Component, { $key: $key });
  }
  /**
   * Render a list of keys
   * @param $keys
   */
  renderFragments($keys) {
    return $keys.map((k, i) =>
      react_1.default.createElement(
        react_1.default.Fragment,
        { key: i },
        this.renderFragment(k)
      )
    );
  }
}
exports.FragmentMapRenderer = FragmentMapRenderer;
/**
 * A function that returns ways of rendering fragment components based on the fragment's name. The point of this is
 * to allow developers to deterministically render a given component when the data for that component comes back
 * in a list (so that we don't have to have large switch statements every time we have an array that may contain
 * more than one kind of data). This is useful with ContentStack, if we have an array of references of multiple
 * types.
 * @param _map The map of [fragment name] : [function to render the relevant component]
 * @param connectionData The data being used with the fragment map
 */
const createFragmentMap = (_map, connectionData) => {
  const edges = connectionData.edges ?? [];
  const validEdges = edges.filter((edge) => !!edge);
  const missingTypename =
    validEdges.length && validEdges.every((e) => !e.node?.__typename);
  if (missingTypename) {
    throw new Error(
      `The '__typename' property was not found in the data for this fragment. Please include the __typename property in your query for each node in this connection (e.g. edges { node { __typeName } }).`
    );
  }
  // create the map
  const mapRenderer = new FragmentMapRenderer(_map);
  // create the FragmentMap component
  const FragmentMappedList = (props) => {
    // Loop through the edges and grab the nodes inside
    const nodes = validEdges
      .filter((edge) => !!edge.node)
      .map((edge) => edge.node);
    // Render a fragment for each node
    return react_1.default.createElement(
      react_1.default.Fragment,
      null,
      mapRenderer.renderFragments(nodes)
    );
  };
  return {
    mapRenderer,
    FragmentMappedList,
  };
};
exports.createFragmentMap = createFragmentMap;
/**
 * A hook that returns ways of rendering fragment components based on the fragment's name. The point of this is
 * to allow developers to deterministically render a given component when the data for that component comes back
 * in a list (so that we don't have to have large switch statements every time we have an array that may contain
 * more than one kind of data). This is useful with ContentStack, if we have an array of references of multiple
 * types.
 * @param _map The map of [fragment name] : [function to render the relevant component]
 * @param connectionData The data being used with the fragment map
 */
const useFragmentMap = (_map, connectionData) => {
  let { mapRenderer, FragmentMappedList } = exports.createFragmentMap(
    _map,
    connectionData
  );
  // Re-run this if the map changes
  react_1.useEffect(() => {
    const updatedFragmentMap = exports.createFragmentMap(_map, connectionData);
    mapRenderer = updatedFragmentMap.mapRenderer;
    FragmentMappedList = updatedFragmentMap.FragmentMappedList;
  }, [_map, connectionData]);
  return {
    mapRenderer,
    FragmentMappedList,
  };
};
exports.useFragmentMap = useFragmentMap;
//# sourceMappingURL=FragmentMap.js.map
