var replace = require("rollup-plugin-replace");
var prefixRE = /^CLIENT__APP__/;

function getReplaceEnvConfig() {
  const env = {};
  Object.keys(process.env).forEach((key) => {
    if (prefixRE.test(key) || key === "NODE_ENV") {
      env[key] = process.env[key];
    }
  });
  return replace({
    "process.env": JSON.stringify(env),
  });
}

exports.getReplaceEnvConfig = getReplaceEnvConfig;
