"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.raw = void 0;
const {
  interpolateName
} = require("loader-utils");
const schema = require("./options.json");
function loader(content) {
  const {
    rootContext,
    _compiler,
    getOptions,
    emitFile
  } = this;
  const options = getOptions(schema);
  const {
    flags,
    outputPath,
    includeWebpackPublicPath
  } = options;
  const isWebpackPathIncluded = includeWebpackPublicPath || false;
  const name = interpolateName(this, "[name].[ext]", {
    context: rootContext,
    content
  });
  emitFile(name, content);
  console.log(`----> loader: ${JSON.stringify(outputPath || _compiler.options.output.path)} + ${require("path").sep} + ${isWebpackPathIncluded ? '__webpack_public_path__' : '""'} + ${JSON.stringify(name)}${typeof flags !== "undefined" ? `, ${JSON.stringify(options.flags)}` : ""}`);
  return `
try {
  process.dlopen(module, ${JSON.stringify(outputPath || _compiler.options.output.path)} + require("path").sep + ${isWebpackPathIncluded ? '__webpack_public_path__' : '""'} + ${JSON.stringify(name)}${typeof flags !== "undefined" ? `, ${JSON.stringify(options.flags)}` : ""});
} catch (error) {
  throw new Error('my-node-loader:\\n' + error);
}
`;
}
const raw = exports.raw = true;