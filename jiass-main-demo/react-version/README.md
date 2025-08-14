# AdsPower Clone - React 18 版本

这是一个使用 React 18 和 TypeScript 构建的 AdsPower 指纹浏览器管理软件的克隆版本。

## 技术栈

- **React 18** - 使用最新的 React 18 特性
- **TypeScript** - 完整的类型支持
- **Electron** - 跨平台桌面应用
- **Webpack 5** - 现代化的构建工具
- **CSS3** - 现代化的样式设计

## 项目结构

```
react-version/
├── src/
│   ├── main.js                 # Electron 主进程
│   └── renderer/
│       ├── components/         # React 组件 (TSX)
│       │   ├── Header.tsx
│       │   ├── Sidebar.tsx
│       │   ├── ProfilesTab.tsx
│       │   ├── ProfileCard.tsx
│       │   ├── BrowsersTab.tsx
│       │   ├── GroupsTab.tsx
│       │   ├── SettingsTab.tsx
│       │   ├── NewProfileModal.tsx
│       │   └── ProfileDetailModal.tsx
│       ├── js/
│       │   └── App.tsx        # 主应用组件
│       ├── styles/
│       │   └── main.css       # 样式文件
│       ├── dist/              # 构建输出目录
│       │   └── bundle.js      # Webpack 构建的包
│       └── index.html         # 主页面
├── webpack.config.js          # Webpack 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖
```

## 功能特性

- **配置文件管理** - 创建、编辑、删除浏览器配置文件
- **浏览器管理** - 管理不同的浏览器实例
- **分组管理** - 对配置文件进行分组管理
- **设置管理** - 应用配置和用户偏好设置
- **响应式设计** - 支持不同屏幕尺寸

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 构建并启动应用
npm run dev

# 或者分别执行
npm run build
npm start
```

### 构建

```bash
npm run build
```

### 监听文件变化

```bash
npm run watch
```

## 组件说明

### 主要组件

- **App.tsx** - 主应用组件，管理全局状态和路由
- **Header.tsx** - 顶部导航栏，包含搜索和用户菜单
- **Sidebar.tsx** - 左侧边栏，提供主要导航
- **ProfilesTab.tsx** - 配置文件管理标签页
- **ProfileCard.tsx** - 配置文件卡片组件
- **BrowsersTab.tsx** - 浏览器管理标签页
- **GroupsTab.tsx** - 分组管理标签页
- **SettingsTab.tsx** - 设置管理标签页

### 模态框组件

- **NewProfileModal.tsx** - 新建配置文件模态框
- **ProfileDetailModal.tsx** - 配置文件详情编辑模态框

## 类型定义

项目使用 TypeScript 提供完整的类型支持：

```typescript
interface Profile {
    id: string;
    name: string;
    description?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Browser {
    id: string;
    name: string;
    version?: string;
}

interface Group {
    id: string;
    name: string;
    description?: string;
    profileCount?: number;
}

interface Settings {
    appName?: string;
    language?: string;
    autoSave?: boolean;
    debugMode?: boolean;
}
```

## 样式系统

使用现代化的 CSS3 特性：

- Flexbox 和 Grid 布局
- CSS 变量和自定义属性
- 响应式设计
- 平滑过渡动画
- 现代化的视觉设计

## 数据持久化

使用 Electron Store 进行本地数据存储：

- 配置文件数据
- 浏览器配置
- 分组信息
- 用户设置

## 开发最佳实践

1. **类型安全** - 所有组件都使用 TypeScript 接口
2. **组件化** - 模块化的组件设计
3. **状态管理** - 使用 React Hooks 管理状态
4. **错误处理** - 完善的错误边界和异常处理
5. **性能优化** - 使用 React.memo 和 useCallback 优化性能

## 故障排除

### 常见问题

1. **构建失败** - 确保所有 TypeScript 类型错误已修复
2. **组件不显示** - 检查 webpack 构建是否成功
3. **样式问题** - 确保 CSS 文件正确加载

### 调试技巧

- 使用 Chrome DevTools 调试渲染进程
- 检查主进程控制台输出
- 验证 webpack 构建输出

## 许可证

MIT License
