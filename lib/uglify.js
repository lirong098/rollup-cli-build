var { uglify } = require("rollup-plugin-uglify");

function getUglifyPlugin() {
  return uglify({
    mangle: {
      toplevel: true,
    },
  });
}

function isNoUglify(plugins) {
  if (process.argv && process.argv.indexOf("--no-uglify") > -1) {
    // 命令行禁用
    return true;
  } else if (plugins && plugins.length) {
    // 自定义
    return plugins.some(function (item) {
      return item && item.name && item.name === "uglify";
    });
  }
  return false;
}

exports.getUglifyPlugin = getUglifyPlugin;
exports.isNoUglify = isNoUglify;
