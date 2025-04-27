# html-auto-reload

> 自动检测 HTML 版本变化，提示用户刷新页面。支持 Vite 和 Webpack，轻量、零依赖。

<p align="center">
  <img src="https://img.shields.io/npm/v/html-auto-reload.svg" />
  <img src="https://img.shields.io/npm/dm/html-auto-reload.svg" />
  <img src="https://img.shields.io/github/license/dufan3715/html-auto-reload" />
</p>

---

## ✨ 特性

- 🛡️ 支持 **Vite** 和 **Webpack** 项目
- 🔥 检测资源版本变更，自动提示刷新
- 📦 无依赖，超轻量
- ⚙️ 支持错误捕捉、轮询检测、页面切换检测等高级配置
- 🌍 同时支持 **CommonJS** 和 **ES Module**

---

## 📦 安装

```bash
npm install html-auto-reload --save-dev
# 或
pnpm add html-auto-reload -D
# 或
yarn add html-auto-reload -D

```
## 🔥 使用方法
### 1. 服务端配置

```nginx
# nginx.conf

location ~* \.(html|htm)$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```
### 2. 客户端配置
#### 在 Vite 中使用

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { HtmlAutoReloadVitePlugin } from 'html-auto-reload';
// 或 import HtmlAutoReloadVitePlugin from 'html-auto-reload/vite'

export default defineConfig({
  plugins: [
    HtmlAutoReloadVitePlugin()
  ]
});

```

#### 在 Webpack 中使用
```ts
// webpack.config.js
const { HtmlAutoReloadWebpackPlugin } = require('html-auto-reload');
// 或 const HtmlAutoReloadWebpackPlugin = require('html-auto-reload/webpack').default;

module.exports = {
  // ...你的其他配置
  plugins: [
    new HtmlAutoReloadWebpackPlugin()
  ]
};
```
> ⚠️ 需要配合 html-webpack-plugin 使用。



## ⚙️ 配置项（Options）

| 参数 | 类型 | 默认值 | 描述 |
| ---- | ---- | ---- | ---- |
| once | boolean | true | 只询问一次刷新 |
| onvisibilitychange | boolean | true | 页面可见时重新检测 |
| onerror | boolean | true | 资源加载失败时检测 |
| polling | boolean or number | false | 是否开启轮询检测（默认间隔 1 分钟） |
| promptContent | string | "请求资源已更新，请刷新页面" | 弹窗提示内容 |


## 📖 工作原理

构建完成时生成一个 version.txt 文件，里面是构建时间戳。

页面加载时，脚本定时或事件触发去请求最新的 version.txt。

如果版本变了，弹出提示，允许用户刷新页面。


## 🛠️ 兼容性

| 构建工具 | 支持情况 |
| --- | --- |
| Vite | ✅ |
| Webpack + HtmlWebpackPlugin | ✅ | 


## 📜 License
MIT ©️ dufan3715