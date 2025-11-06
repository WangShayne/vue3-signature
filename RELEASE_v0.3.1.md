# 🚀 Release v0.3.1

## 📦 发布信息

- **版本号**: 0.3.1
- **发布日期**: 2025-11-06
- **类型**: 依赖升级 & 安全修复
- **npm 包**: https://www.npmjs.com/package/vue3-signature
- **GitHub**: https://github.com/WangShayne/vue3-signature

---

## ✨ 主要更新

### 🔼 依赖升级

#### 主要版本升级

| 依赖包 | 版本变化 | 影响 |
|--------|---------|------|
| **Vite** | 2.1.0 → 5.4.11 | 🚀 构建速度提升 65% |
| **TypeScript** | 4.8.2 → 5.7.2 | 🎯 更好的类型检查 |
| **@vitejs/plugin-vue** | 1.1.5 → 5.2.1 | ⚡ 更快的 Vue 编译 |
| **vue-tsc** | 1.8.27 → 2.1.10 | 🔧 改进的 Vue 类型支持 |
| **@vue/compiler-sfc** | 3.0.5 → 3.5.13 | 📦 最新的 Vue 编译器 |

### 🛡️ 安全修复

- ✅ 修复了 **7 个安全漏洞**
- ✅ 漏洞减少 **78%**（9 → 2）
- ✅ 消除了所有高危漏洞

```
之前: 9 个漏洞 (7 中等, 2 高危)
现在: 2 个漏洞 (2 中等, 0 高危)
```

剩余的 2 个中等漏洞仅影响开发环境，不影响生产构建。

### 🔧 技术改进

#### 1. 现代化配置
- ✅ 完全转换为 ES 模块语法
- ✅ 更新 TypeScript 配置使用 `verbatimModuleSyntax`
- ✅ 改进的模块解析策略

#### 2. 构建优化
- ✅ ES 模块输出为 `.mjs` 格式（更好的兼容性）
- ✅ 更快的构建速度（~0.4s vs ~1.1s）
- ✅ 更好的 Tree-shaking 支持

#### 3. 开发体验
- ✅ 修复 `npm ci` 兼容性问题
- ✅ package-lock.json 完全同步
- ✅ 更清晰的类型错误提示

---

## 📊 构建产物

### 文件变化

```
dist/
├── vue3-signature.mjs (新)    23.47 kB │ gzip: 6.77 kB
├── vue3-signature.umd.js      17.49 kB │ gzip: 5.76 kB
└── favicon.ico

types/
├── index.d.ts
├── utils.d.ts
└── Vue3Signature.vue.d.ts
```

### 包信息

- **包大小**: 23.3 kB（压缩后）
- **解压大小**: 88.1 kB
- **文件数量**: 9 个

---

## 🔄 向后兼容性

### ✅ 完全向后兼容

此版本**不包含任何破坏性更改**，所有现有代码无需修改即可工作：

```javascript
// 导入方式完全相同
import Vue3Signature from 'vue3-signature'

// 使用方式完全相同
createApp(App).use(Vue3Signature).mount('#app')
```

### 📦 自动模块选择

现代打包工具会自动选择最佳格式：

```javascript
// 使用 ES 模块（推荐）
import Vue3Signature from 'vue3-signature'  // → .mjs

// 使用 CommonJS
const Vue3Signature = require('vue3-signature')  // → .umd.js
```

---

## 📥 安装 & 升级

### 新安装

```bash
# npm
npm install vue3-signature@0.3.1

# yarn
yarn add vue3-signature@0.3.1

# pnpm
pnpm add vue3-signature@0.3.1
```

### 从 v0.3.0 升级

```bash
# npm
npm update vue3-signature

# yarn
yarn upgrade vue3-signature

# pnpm
pnpm update vue3-signature
```

**无需任何代码更改！** 🎉

---

## 🎯 性能对比

### 构建速度

| 操作 | v0.3.0 (Vite 2) | v0.3.1 (Vite 5) | 提升 |
|------|----------------|----------------|------|
| 库构建 | ~1.12s | ~0.40s | 🚀 **65% 更快** |
| 演示构建 | ~1.18s | ~1.03s | ⚡ **13% 更快** |

### 文件大小

```
ES 模块: 23.47 kB (gzip: 6.77 kB)
UMD 模块: 17.49 kB (gzip: 5.76 kB)
```

---

## 🔍 详细变更

### 配置文件更新

#### `package.json`
```diff
- "module": "./dist/vue3-signature.es.js",
+ "module": "./dist/vue3-signature.mjs",

  "exports": {
    ".": {
-     "import": "./dist/vue3-signature.es.js",
+     "import": "./dist/vue3-signature.mjs",
      "require": "./dist/vue3-signature.umd.js"
    }
  }
```

#### `tsconfig.json`
```diff
- "target": "es2016",
- "module": "commonjs",
- "moduleResolution": "node",
- "importsNotUsedAsValues": "error",

+ "target": "ES2020",
+ "module": "ESNext",
+ "moduleResolution": "bundler",
+ "verbatimModuleSyntax": true,
+ "isolatedModules": true,
+ "resolveJsonModule": true
```

#### `vite.config.js`
```diff
- const path = require("path");
+ import { resolve } from "path";
+ import { fileURLToPath } from "url";
+ import { dirname } from "path";
+ 
+ const __filename = fileURLToPath(import.meta.url);
+ const __dirname = dirname(__filename);
```

---

## ⚠️ 注意事项

### 开发环境警告

你可能会看到以下警告（仅在开发时）：

```
The CJS build of Vite's Node API is deprecated.
```

**这是正常的**，不影响功能，未来版本会解决。

### 剩余安全漏洞

剩余的 2 个中等严重程度漏洞：

```
esbuild <=0.24.2
└── 仅影响开发服务器
└── 不影响生产构建
└── 需要 Vite 7.x 完全修复
```

---

## 🧪 测试验证

### ✅ 所有测试通过

```bash
✓ 库构建测试通过
✓ 演示应用构建通过
✓ TypeScript 类型检查通过
✓ npm ci 兼容性测试通过
✓ GitHub Actions 部署测试通过
```

### 🔗 在线演示

访问更新后的在线演示：
https://wangshayne.github.io/vue3-signature/

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md) | 详细的升级说明 |
| [README.md](./README.md) | 项目文档（英文） |
| [README.zh-CN.md](./README.zh-CN.md) | 项目文档（中文） |
| [DEPLOY.md](./DEPLOY.md) | GitHub Pages 部署指南 |

---

## 🎉 总结

这是一个**维护性更新**，重点是：

1. ✅ **现代化工具链** - 升级到最新稳定版本
2. ✅ **安全性提升** - 大幅减少安全漏洞
3. ✅ **性能优化** - 更快的构建速度
4. ✅ **完全兼容** - 无破坏性更改

### 升级原因

- 🛡️ 修复安全漏洞
- ⚡ 提升开发体验
- 🔧 修复 CI/CD 兼容性问题
- 🚀 使用最新的构建工具

### 推荐操作

**强烈建议所有用户升级到 v0.3.1**

升级简单、安全、无风险：
```bash
npm update vue3-signature
```

---

## 🔗 快速链接

- **NPM**: https://www.npmjs.com/package/vue3-signature
- **GitHub**: https://github.com/WangShayne/vue3-signature
- **在线演示**: https://wangshayne.github.io/vue3-signature/
- **问题反馈**: https://github.com/WangShayne/vue3-signature/issues
- **更新日志**: https://github.com/WangShayne/vue3-signature/releases

---

## 🙏 致谢

感谢所有贡献者和使用者的支持！

特别感谢：
- [signature_pad](https://github.com/szimek/signature_pad) - 核心签名库
- [Vite](https://vitejs.dev/) - 现代化构建工具
- [Vue.js](https://vuejs.org/) - 优秀的前端框架

---

<div align="center">
  <p><strong>vue3-signature v0.3.1 已发布！</strong></p>
  <p>立即升级体验更快、更安全的版本 🚀</p>
  <br>
  <p>Made with ❤️ by <a href="https://github.com/WangShayne">Shayne Wang</a></p>
  <p>Powered by <a href="https://github.com/szimek/signature_pad">signature_pad</a></p>
</div>

