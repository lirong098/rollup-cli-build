#!/usr/bin/env node
var path = require("path");
var fs = require("fs");
var { loadConfigFile } = require("rollup/dist/loadConfigFile.js");
var rollup = require("rollup");
require("../lib/loadEnv.js");

const isArray = (p) =>
  p && Object.prototype.toString.call(p) === "[object Array]";

// 获取配置文件的路径
function getConfigFilePath() {
  let fileConfigPath;
  const possibleConfigPaths = [
    "./rollup.config.js",
    "./rollup.config.cjs",
    "./rollup.config.mjs",
  ];
  for (const p of possibleConfigPaths) {
    const resolvedPath = p && path.resolve(process.cwd(), p);
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      fileConfigPath = resolvedPath;
      break;
    }
  }
  if (!fileConfigPath) throw new Error("Rollup config file cannot be loaded");
  return fileConfigPath;
}

// 加载当前脚本旁边的配置文件；
loadConfigFile(getConfigFilePath()).then(async ({ options, warnings }) => {
  let config = isArray(options) ? options[0] : options || {};
  // “warnings”包装了CLI传递的默认`onwarn`处理程序。
  // 输出所有警告：
  // "warnings" wraps the default `onwarn` handler passed by the CLI.
  // This prints all warnings up to this point:
  console.log(`We currently have ${warnings.count} warnings`);

  // 输出所有延迟的警告：
  // This prints all deferred warnings
  warnings.flush();

  // options是一个带有其他“output”属性的“ inputOptions”对象，该属性包含一个“ outputOptions”数组。
  // 以下将生成所有输出，并将它们以与CLI相同的方式写入磁盘：
  // options is an "inputOptions" object with an additional "output"
  // property that contains an array of "outputOptions".
  // The following will generate all outputs and write them to disk the same
  // way the CLI does it:
  const bundle = await rollup.rollup(config);
  await Promise.all(config.output.map(bundle.write));

  // 你也可以将其直接传递给 "rollup.watch"
  // rollup.watch(options);
});
