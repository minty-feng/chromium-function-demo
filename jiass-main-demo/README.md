# AdsPower Clone - 指纹浏览器管理工具

一个功能完整的指纹浏览器管理工具，提供配置文件管理、浏览器管理、分组管理和设置管理等功能。支持纯JavaScript、React和Vue三种技术栈实现。

## 🚀 核心功能

### 配置文件管理
- **创建/编辑/删除** 浏览器配置文件
- **标签系统** 支持多标签分类管理
- **状态管理** 活跃/非活跃状态切换
- **搜索过滤** 实时搜索配置文件名称和描述
- **导入导出** 支持JSON格式配置文件导入导出

### 浏览器管理
- **浏览器信息** 显示名称、版本、平台、状态
- **状态监控** 实时监控浏览器运行状态
- **版本管理** 支持多版本浏览器管理

### 分组管理
- **分组创建** 按功能或用途创建分组
- **配置文件关联** 将配置文件分配到不同分组
- **分组统计** 显示每个分组的配置文件数量

### 设置管理
- **界面设置** 主题切换（浅色/深色）、语言选择
- **功能设置** 自动保存、通知开关
- **系统设置** 应用名称、调试模式等

## 🏗️ 技术架构

### 纯JavaScript版本 (`vanilla-version/`)
- **技术栈**: 原生JavaScript + Electron
- **特点**: 无框架依赖，轻量级，性能优秀
- **适用场景**: 追求轻量级、无依赖的项目
- **文件结构**: 单文件应用，易于理解和维护

### React版本 (`react-version/`)
- **技术栈**: React 19 + TypeScript + Electron
- **特点**: 组件化开发，类型安全，生态丰富
- **适用场景**: 大型项目，团队协作开发
- **文件结构**: 组件化架构，支持热重载

### Vue版本 (`vue-version/`)
- **技术栈**: Vue 3 + Vite + Electron
- **特点**: 渐进式框架，学习曲线平缓
- **适用场景**: 中小型项目，快速原型开发
- **文件结构**: 单文件组件，开发体验优秀

## 🛠️ 环境要求

### 系统要求
- **操作系统**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **内存**: 最低 4GB，推荐 8GB+
- **存储**: 最低 2GB 可用空间

### 开发环境
- **Node.js**: 18.x 版本（必须）
- **包管理器**: npm 9+ 或 yarn 1.22+
- **Git**: 2.20+ 版本

## 📦 依赖管理

### Node.js版本管理
```bash
# 安装nvm (如果未安装)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载shell配置
source ~/.bashrc  # Linux/macOS
# 或
source ~/.zshrc   # macOS zsh

# 安装Node.js 18
nvm install 18
nvm use 18

# 验证版本
node --version  # 应该显示 v18.x.x
npm --version   # 应该显示 9.x.x
```

### 项目依赖安装
```bash
# 进入项目目录
cd chromium_analysis

# 安装所有版本的依赖
cd vanilla-version && npm install
cd ../react-version && npm install
cd ../vue-version && npm install
```

## 🚀 启动运行

### 纯JavaScript版本
```bash
cd vanilla-version

# 构建项目
npm run build

# 启动应用
npm start

# 开发模式（自动构建+启动）
npm run dev
```

### React版本
```bash
cd react-version

# 构建项目
npm run build

# 启动应用
npm start

# 开发模式
npm run dev
```

### Vue版本
```bash
cd vue-version

# 构建项目
npm run build

# 启动应用
npm start

# 开发模式
npm run dev
```

## 🐛 调试指南

### 开发者工具
```bash
# 启动时自动打开开发者工具
npm run dev

# 手动打开开发者工具
# 在应用中按 F12 或 Ctrl+Shift+I (Windows/Linux)
# 或 Cmd+Option+I (macOS)
```

### 日志调试
```bash
# 查看主进程日志
npm start 2>&1 | tee app.log

# 查看渲染进程日志
# 在开发者工具控制台中查看
```

### 常见问题排查
```bash
# 清理依赖缓存
rm -rf node_modules package-lock.json
npm install

# 清理构建缓存
rm -rf dist/ build/
npm run build

# 检查Node.js版本
node --version
nvm current
```

## 📱 窗口配置

### 统一配置
所有版本使用相同的窗口配置：
- **初始尺寸**: 1200x800 像素
- **最小尺寸**: 1200x800 像素
- **显示模式**: 延迟显示，等待内容加载完成
- **图标**: 统一的应用程序图标

### 响应式设计
- **桌面端**: 固定侧边栏 + 自适应内容区域
- **移动端**: 水平侧边栏 + 单列内容布局
- **平板端**: 自适应布局，支持触摸操作

## 🔧 构建配置

### Webpack配置 (纯JS/React版本)
```javascript
// 开发模式
npm run build    // 构建开发版本
npm run dev      // 开发模式 + 热重载

// 生产模式
npm run build:prod  // 构建生产版本
npm run pack        // 打包应用
npm run dist        // 分发版本
```

### Vite配置 (Vue版本)
```javascript
// 开发模式
npm run dev        // 开发服务器 + 热重载

// 构建模式
npm run build      // 构建生产版本
npm run preview    // 预览构建结果
```

## 📦 打包发布

### Electron Builder配置
```bash
# 安装打包工具
npm install --save-dev electron-builder

# 打包应用
npm run pack      # 生成可执行文件
npm run dist      # 生成安装包

# 平台特定打包
npm run pack:win  # Windows版本
npm run pack:mac  # macOS版本
npm run pack:linux # Linux版本
```

### 发布流程
```bash
# 1. 更新版本号
npm version patch  # 补丁版本
npm version minor  # 次要版本
npm version major  # 主要版本

# 2. 构建项目
npm run build

# 3. 打包应用
npm run pack

# 4. 测试打包结果
# 在目标平台上测试应用

# 5. 发布
npm publish        # 发布到npm
# 或手动分发可执行文件
```

## 🧪 测试

### 单元测试
```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 监听模式
npm run test:watch
```

### 集成测试
```bash
# 端到端测试
npm run test:e2e

# 性能测试
npm run test:perf
```

## 📊 性能优化

### 渲染优化
- **虚拟滚动**: 大量数据时的性能优化
- **懒加载**: 按需加载组件和资源
- **缓存策略**: 智能缓存减少重复请求

### 内存管理
- **垃圾回收**: 及时释放不需要的资源
- **内存监控**: 实时监控内存使用情况
- **泄漏检测**: 防止内存泄漏

## 🔒 安全特性

### 数据安全
- **本地存储**: 敏感数据本地加密存储
- **权限控制**: 细粒度的功能权限管理
- **安全通信**: IPC通信安全验证

### 网络安全
- **代理支持**: 支持HTTP/HTTPS代理
- **证书管理**: 自定义证书导入
- **安全策略**: 可配置的安全策略

## 🌐 国际化

### 语言支持
- **中文**: 简体中文 (zh-CN)
- **英文**: 美式英语 (en-US)
- **扩展性**: 支持添加更多语言

### 本地化
- **日期格式**: 根据地区自动调整
- **数字格式**: 支持不同地区的数字表示
- **货币符号**: 多货币支持

## 📈 监控与分析

### 性能监控
- **启动时间**: 应用启动性能监控
- **内存使用**: 实时内存使用情况
- **CPU占用**: 进程CPU使用率

### 错误追踪
- **错误日志**: 详细的错误信息记录
- **崩溃报告**: 自动生成崩溃报告
- **性能分析**: 性能瓶颈识别

## 🤝 贡献指南

### 开发流程
1. **Fork** 项目仓库
2. **创建** 功能分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 代码规范
- **JavaScript**: ESLint + Prettier
- **TypeScript**: TSLint + Prettier
- **Vue**: Vue ESLint Plugin
- **React**: React ESLint Plugin

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **Electron**: 跨平台桌面应用框架
- **React**: 用户界面库
- **Vue**: 渐进式JavaScript框架
- **Vite**: 下一代前端构建工具
- **Webpack**: 模块打包工具

## 📞 联系方式

- **项目主页**: [GitHub Repository](https://github.com/your-username/ads-power-clone)
- **问题反馈**: [Issues](https://github.com/your-username/ads-power-clone/issues)
- **功能建议**: [Discussions](https://github.com/your-username/ads-power-clone/discussions)

---

**注意**: 本项目仅供学习和研究使用，请遵守相关法律法规和平台政策。
