var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
var path = require("path");
var fs = require("fs");

function load(envPath) {
  try {
    dotenv.config({ path: envPath });
    dotenvExpand(env);
  } catch (err) {
    // only ignore error if file is not found
    if (err.toString().indexOf("ENOENT") < 0) {
      error(err);
    }
  }
}

function loadENv(mode) {
  var basePath = path.resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`);
  var localPath = `${basePath}.local`;
  try {
    fs.accessSync(localPath);
    load(localPath);
  } catch (err) {}
  try {
    fs.accessSync(basePath);
    load(basePath);
  } catch (err) {}
}
// 获取命令行中的mode参数的值，加载对应的.env.[mode]?.local文件
var argv = process.argv;
var modeIndex = argv && argv.indexOf("--mode") + 1;
var mode = argv[modeIndex] || "";

mode && loadENv(mode);
loadENv();
