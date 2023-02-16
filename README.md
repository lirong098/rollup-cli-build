> 一般在开发 npm 包时，需要构建多种模块的代码，比如，CommonJs、Es Module。大部分实现方法是通过命令行设置不同的环境变量。但是，如果环境变量特别多，怎么设置？能不能像 vue-cli 一样，使用.env.\[mode]文件来配置呢。没有找到对应的方法，然后，就看了[vue-cli-service](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve)的实现逻辑，模仿写了这个 rollup + dotenv + rollup-plugin-replace 的小工具。

# [rollup-cli-build](https://github.com/lirong098/rollup-cli-build)

## 简介

在项目的根目录下创建`.env`或`.env.production`和`rollup.config.js`文件设置/使用环境变量，并执行`rollup-cli-build --mode production`命名，工具就会加载对应的环境变量，并且会把`CLIENT__APP__*`开头的环境变量写入客户端代码。使用[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)实现。

同时也内置了压缩代码工具[rollup-plugin-uglify](https://github.com/TrySound/rollup-plugin-uglify)，默认开启`压缩`，当然，也可自定义覆盖，可禁用，具体见下文。

> 注：您无需安装 Rollup，工具已内置。

## 安装

npm

```base
npm install rollup-cli-build --save-dev
```

yarn

```base
yarn add rollup-cli-build -D
```

## 使用

### 环境变量

一、在项目根目录创建以下文件来设置环境变量：

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

二、在`package.json`中，设置不同环境 build 命令：

```json
{
  "scripts": {
    "build:[mode]": "rollup-cli-build --mode [mode]", // [mode]与.env.[mode]保持一致
    "build:cjs": "rollup-cli-build --mode cjs", // 例子
    "build:umd": "rollup-cli-build --mode umd", // 例子
    ...
  }
}
```

三、在根目录创建`rollup.config.js`文件

> 文件中即可使用环境变量

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

四、运行构建对应命令即可根据 mode 读取不同的环境变量，进行构建。

```base
yarn build:cjs
or
npm run build:cjs
```

上面演示了运行不同的 build 命令读取对应的环境变量，**如果，需要将环境变量打包至代码中，请命名以 CLIENT\_\_APP\_\_\*开头的变量**。内置使用[rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)。

```dotenv
# .env.cjs
CUSTOM_MODE=cjs
# 默认打包至客户端代码中
CLIENT__APP__URL=https://www.npmjs.com
```

### uglify 代码

默认开启[rollup-plugin-uglify](https://github.com/TrySound/rollup-plugin-uglify)进行编译，默认配置如下：

```js
var { uglify } = require("rollup-plugin-uglify");

function getUglifyPlugin() {
  return uglify({
    mangle: {
      toplevel: true,
    },
  });
}
```

> 如不满足您的需求，请查看下文自定义 uglify 配置。

#### 自定义 uglify 配置

目前，不支持**扩展** `uglify` 配置，因为，不想破坏[rollup 原本的配置](https://rollupjs.org/configuration-options/)，增加用户理解成本。当工具识别到您自定义配置 `uglify` 时，内置的 `uglify` 将禁用。如果，您发现工具没有禁用 uglify，可以通过命令行，手动禁用 `uglify`，见下文。

```base
# 下载
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

#### 禁用 uglify

通过命令行配置`--no-uglify`参数，即可禁用内置的`uglify` 插件，不会影响，自定义的`uglify`。

```base
rollup-cli-build --no-uglify --mode cjs
```

## 注意

- `.env`为公共环境变量
- `.env.[mode]`的环境变量生效优先级高于`.env`，

## 参考

[vue-cli-service](https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve)

## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
