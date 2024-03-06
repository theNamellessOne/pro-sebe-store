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
    outputPath,
  } = options;
  const name = interpolateName(this, "[name].[ext]", {
    context: rootContext,
    content
  });
  emitFile(name, content);
  console.log(`----> loader: ${JSON.stringify(outputPath || _compiler.options.output.path)} + ${require("path").sep} + ${JSON.stringify(name)}`);

  return `
try {
  process.dlopen(module, require('node:path').join(${JSON.stringify(outputPath || _compiler.options.output.path)}, require("path").sep, ${JSON.stringify(name)}), require('node:os').constants.dlopen.RTLD_NOW);
} catch (error) {
  throw new Error('my-node-loader:\\n' + error);
}
`;
}
const raw = exports.raw = true;