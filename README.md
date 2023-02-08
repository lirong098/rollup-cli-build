## rollup-cli-build

#### 介绍

在使用[rollup](https://rollupjs.org/introduction/)的项目中，使用此工具可以在根目录下创建`.env`文件设置环境变量，并且内置了[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)打包时替换文件中的环境变量。
同时也内置了[rollup-plugin-uglify](https://github.com/TrySound/rollup-plugin-uglify)，默认开启`uglify`，可自定义覆盖，可禁用，具体见下文。

#### 安装

npm

```base
npm install rollup-cli-build --save-dev
```

yarn

```base
yarn add rollup-cli-build -D
```

#### 使用

##### 环境变量

在项目根目录创建以下文件来设置环境变量：

```base
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

例如，需要构建 commonjs 和 umd 俩种模块包，根目录创建.env.cjs 和.env.umd

```dotenv
# .env.cjs
CUSTOM_MODE=cjs
```

```dotenv
# .env.umd
CUSTOM_MODE=umd
```

在`package.json`中，设置不同环境 build 命令：

```json
{
  "scripts": {
    "build:[mode]": "rollup-cli-build --mode [mode]", // [mode]与.env.[mode]保持一致
    "build:cjs": "rollup-cli-build --mode cjs", // 例子
    "build:umd": "rollup-cli-build --mode umd", // 例子
    "build:es": "rollup-cli-build --mode es", // 例子
    ...
  }
}
```

在`rollup.config.js`文件中，使用环境变量。

```js
// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
export default {
  input: "src/index.js",
  plugins: [
    json(),
    commonjs({
      include: /node_modules/,
    }),
    resolve({
      browser: process.env.CUSTOM_MODE === "umd",
    }),
  ],
  output: [
    {
      file: `build/index.${process.env.CUSTOM_MODE}.js`,
      format: process.env.CUSTOM_MODE,
    },
  ],
};
```

运行构建对应命令即可根据 mode 读取不同的环境变量，进行构建。

```base
yarn build:cjs
or
npm run build:cjs
```

上面演示了运行不同的 build 命令读取对应的环境变量，**如果，需要将环境变量打包至代码中，请命名以 CLIENT**APP**\*开头的变量**。内置使用[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)。

```dotenv
# .env.cjs
CUSTOM_MODE=cjs
# 默认打包至客户端代码中
CLIENT__APP__URL=https://www.npmjs.com
```

##### uglify

内置的默认配置如下：

```js
var { uglify } = require("rollup-plugin-uglify");

function getUglifyPlugin() {
  return uglify({
    mangle: {
      toplevel: true,
      properties: true,
    },
  });
}
```

###### 自定义 uglify 配置

目前，不支持扩展 uglify 配置，因为，不想扩展 RollupOptions，增加用户理解成本。当工具识别到您自定义配置 uglify 时，内置的 uglify 将禁用。如果，您发现工具没有禁用 uglify，可以通过命令行，手动禁用 uglify，见下文。

```base
# 下载rollup-plugin-uglify
yarn add rollup-plugin-uglify -D
```

```js
// 在rollup.config.js中，根据自己需求配置
import { uglify } from "rollup-plugin-uglify";
export default {
  ...
  plugins: [
    uglify({
      mangle: {
        toplevel: true,
        properties: true,
      },
    })
  ],
  ...
};
```

###### 禁用 uglify

通过命令行配置`--no-uglify`参数，即可禁用内置的 uglify 插件，不会影响，自定义的 uglify。

```base
rollup-cli-build --no-uglify --mode cjs
```

#### 注意

- `.env`为公共环境变量
- `.env.[mode]`的环境变量生效优先级高于`.env`，

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
