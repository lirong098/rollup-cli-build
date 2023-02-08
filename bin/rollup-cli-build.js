#!/usr/bin/env node
require("../lib/loadEnv.js");
var fs = require("fs");
var path = require("path");
var rollup = require("rollup");
var { loadConfigFile } = require("rollup/dist/loadConfigFile.js");
var { getReplaceEnvConfig } = require("../lib/replaceEnv");
var { getUglifyPlugin, isNoUglify } = require("../lib/uglify");

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

// 加载当前脚本旁边的配置文件
loadConfigFile(getConfigFilePath()).then(async ({ options, warnings }) => {
  let config = isArray(options) ? options[0] : options || {};
  if (!config.plugins) config.plugins = [];
  // 使用replace插件，将环境变量插入app中
  config.plugins.unshift(getReplaceEnvConfig());
  // 默认压缩代码
  if (!isNoUglify(config.plugins)) config.plugins.push(getUglifyPlugin());

  console.log(`We currently have ${warnings.count} warnings`);

  warnings.flush();

  const bundle = await rollup.rollup(config);
  await Promise.all(config.output.map(bundle.write));
});
