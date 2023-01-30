var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
var path = require("path");

function load(envPath) {
  try {
    const env = dotenv.config({ path: envPath });
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
  load(localPath);
  load(basePath);
}
// 获取命令行中的mode参数的值，加载对应的.env.[mode]?.local文件
var argv = process.argv;
var modeIndex = argv && argv.indexOf("--mode") + 1;
var mode = argv[modeIndex] || "";

mode && loadENv(mode);
loadENv();
