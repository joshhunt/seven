const fs = require("fs-extra");
const pathLib = require("path");
const parser = require("@babel/parser");
const { default: generator } = require("@babel/generator");
const { default: traverse } = require("@babel/traverse");
const {
  converter: objectExpressionConverter,
} = require("babel-plugin-object-to-json-parse/dist/utils");

const ROUTE_DEFS_PATH =
  "./bungie-website-output/site-source/Global/Routes/RouteDefs.tsx";

const ROUTE_RE = /RouteDefs\.Areas\.(\w+)\.getAction\((?:"(\w+)")?\)/;

function getAreaNames(classAst) {
  const areaNamesAst = classAst.body.find(
    (node) => node.key.name === "AreaNames"
  );

  if (areaNamesAst.value.type !== "ObjectExpression") {
    throw new Error(
      "Found areaNamesAst, but its value is not an ObjectExpression"
    );
  }

  return objectExpressionConverter(areaNamesAst.value);
}

function makePath({ areaName, action, params }) {
  let path = `/en/${areaName}`;

  if (action && action !== "Index" && action !== "index") {
    path = `/en/${areaName}/${action}`;
  }

  if (params && params.path) {
    path += `/${params.path}`;
  }

  if (params && params.isOverride) {
    path = `/en/${areaName}/${params.path}`;
  }

  return `/7${path}`;
}

function getStringValueOfAreaName(areaNames, areaArg) {
  const areaNameProperty = areaArg.properties.find(
    (propAst) => propAst.key.name === "name"
  );

  if (!areaNameProperty) {
    throw new Error(
      "Could not find `name` property in the arguments to `new Area()`"
    );
  }

  return {
    areaName: areaNames[areaNameProperty.value.property.name],
    areaObjectName: areaNameProperty.value.property.name,
  };
}

function getRoutesFromAreaObject(areaArg) {
  const routesProperty = areaArg.properties.find(
    (propAst) => propAst.key.name === "routes"
  );

  if (!routesProperty) {
    throw new Error(
      "Could not find `routes` property in the arguments to `new Area()`"
    );
  }

  // assume its an array
  return routesProperty.value.elements.map((arrayValueAst) => {
    if (arrayValueAst.body.callee.name !== "ActionRoute") {
      throw new Error(
        "the value in the routes array is not a `new ActionRoute`. Instead its a " +
          arrayValueAst.body.callee.name
      );
    }

    const [_, routeNameAst, configAst] = arrayValueAst.body.arguments;

    if (routeNameAst.type !== "StringLiteral") {
      throw new Error(
        "Expected the second arg to `new ActionRoute()` to be a string, but it's a " +
          routeNameAst.type
      );
    }

    let routeConfig = {};

    if (configAst) {
      routeConfig = objectExpressionConverter(configAst);
    }

    return {
      action: routeNameAst.value,
      params: routeConfig,
    };
  });
}

function getComponentImportPath(areaArg) {
  const lazyComponentProperty = areaArg.properties.find(
    (propAst) => propAst.key.name === "lazyComponent"
  );

  return lazyComponentProperty.value.arguments[0].body.arguments[0].value;
}

function parse(code) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "classProperties", "jsx"],
  });
}

async function getRoutesFromRouteDefs() {
  const routeDefsJs = (await fs.readFile(ROUTE_DEFS_PATH)).toString();
  const routeDefsAst = parse(routeDefsJs);

  // Get the "RouteDefs" class
  const classAst = routeDefsAst.program.body.find(
    (node) =>
      node.declaration &&
      node.declaration.type === "ClassDeclaration" &&
      node.declaration.id.name === "RouteDefs"
  ).declaration.body;

  if (!classAst) {
    throw new Error("Unable to find the RouteDefs class");
  }

  const areaNames = getAreaNames(classAst);

  const areasAst = classAst.body.find((node) => node.key.name === "Areas");
  const areasObjectAst = areasAst.value;

  const areasObject = areasObjectAst.properties.map((objectPropertyAst) => {
    const isExpected =
      objectPropertyAst.value.type === "NewExpression" &&
      objectPropertyAst.value.callee.name === "Area";

    if (!isExpected) {
      throw new Error(
        "The value of a member in the public static Areas object is not `new Area()`"
      );
    }

    const newAreaArg = objectPropertyAst.value.arguments[0];

    const { areaName, areaObjectName } = getStringValueOfAreaName(
      areaNames,
      newAreaArg
    );
    const routes = getRoutesFromAreaObject(newAreaArg);
    const componentImportPath = getComponentImportPath(newAreaArg);

    if (!areaName) {
      throw new Error(
        "Could not find area name in " + generator(objectPropertyAst).code
      );
    }

    return { areaName, areaObjectName, componentImportPath, routes };
  });

  const routes = areasObject.flatMap(
    ({ areaName, areaObjectName, componentImportPath, routes }) =>
      routes.map(({ action, params }) => ({
        areaName,
        areaObjectName,
        componentImportPath,
        action,
        params,
        path: makePath({ areaName, action, params }),
      }))
  );

  const routeUrls = routes.map((r) => r.path);

  return routes;
}

const exts = [".tsx", ".ts", ".json", ".js", ".jsx"];
async function readSourceFile(baseBath) {
  const fullPath = pathLib.resolve(
    "./bungie-website-output/site-source/" + baseBath
  );

  const attempts = [fullPath, fullPath + "/index"].flatMap((p) =>
    exts.map((x) => p + x)
  );

  let lastError;
  for (const path of attempts) {
    try {
      return (await fs.readFile(path)).toString();
    } catch (e) {
      lastError = e;
    }
  }

  const msg = `Unable to open source file '${baseBath}'. Last error: ${lastError.toString()}\nTried to open:\n${attempts
    .map((v) => ` - ${v}`)
    .join("\n")}`;

  throw new Error(msg);
}

function traverseFile(code, ...opts) {
  const ast = parse(code);

  traverse(ast, ...opts);
}

function findRoute(routes, areaName, action) {
  return routes.find(
    (route) =>
      (route.areaName === areaName || route.areaObjectName === areaName) &&
      route.action.toLowerCase() === action.toLowerCase()
  );
}

function rootObjectName(memberExpression) {
  if (memberExpression.name) {
    return memberExpression.name;
  }

  if (memberExpression.object && memberExpression.object.name) {
    return memberExpression.object.name;
  }

  const children = memberExpression.object || memberExpression.callee;

  if (!children) {
    throw new Error(
      "unable to find children in\n" + generator(memberExpression).code
    );
  }

  return rootObjectName(children);
}

function makeGetActionCall(jsString) {
  const matches = jsString.match(ROUTE_RE);
  const [_, areaName, action] = matches || [];

  return { areaName, action: action || "Index" };
}

function resolveFromScope(variableName, path) {
  const binding = path.scope.bindings[variableName];
  const jsString = generator(binding.path.node.init).code;

  return makeGetActionCall(jsString);
}

function resolvePathAttribute(pathAttribute, path) {
  const valueExpression = pathAttribute.value.expression;
  const name = rootObjectName(valueExpression);

  if (name === "RouteDefs") {
    const jsString = generator(valueExpression).code;
    return makeGetActionCall(jsString);
  }

  return resolveFromScope(name, path);
}

async function parseAreaComponent(route, routes) {
  const filePath = route.componentImportPath.slice(1);
  const source = await readSourceFile(filePath);

  console.log("Parsing", filePath);

  traverseFile(source, {
    JSXOpeningElement: (path) => {
      const { node } = path;

      if (node.name.name === "Route" || node.name.name === "AsyncRoute") {
        const pathAttribute = node.attributes.find(
          (attr) => attr.name.name === "path"
        );

        const { areaName, action } = resolvePathAttribute(pathAttribute, path);

        if (!areaName) {
          throw new Error(
            "Unable to find/resolve path prop in:\n" + generator(node).code
          );
        }

        const route = findRoute(routes, areaName, action);

        if (!route) {
          console.log("");
          console.log("");
          console.log({ areaName, action });
          console.log("");
          console.log("");
          throw new Error("No found route");
        }

        console.log({
          areaName,
          action,
          routePath: route.path,
        });

        // process.exit(0);
      }
    },
  });
}

async function extractRoutes() {
  const routes = await getRoutesFromRouteDefs();
  console.log(routes);

  return routes;

  // await parseAreaComponent(
  //   { componentImportPath: "@Areas/Codes/CodesArea" },
  //   routes
  // );

  // console.log("\n\n\n\n\n");
  // for (const route of routes) {
  //   await parseAreaComponent(route, routes);
  // }
}

module.exports = extractRoutes;
