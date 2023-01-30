## @yeez/rollup-cli-build

#### 介绍

在使用[rollup](https://rollupjs.org/introduction/)的项目中，可以在根目录下创建`.env`文件设置环境变量。

#### 安装

npm

```base
npm install @yeez/rollup-cli-build --save-dev
```

yarn

```base
yarn add @yeez/rollup-cli-build -D
```

#### 使用

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

在项目根目录创建`rollup.config.js`文件，此文件内即可使用自定义的环境变量。

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

#### 注意

- `.env`为公共环境变量
- `.env.[mode]`的环境变量生效优先级高于`.env`，

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
