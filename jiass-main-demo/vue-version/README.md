# AdsPower Clone - Vue 3 版本

这是一个使用 Vue 3 和 Composition API 构建的 AdsPower 指纹浏览器管理软件的克隆版本。

## 技术栈

- **Vue 3** - 使用最新的 Vue 3 特性和 Composition API
- **Vite** - 现代化的构建工具
- **Pinia** - Vue 3 的状态管理库
- **Electron** - 跨平台桌面应用
- **CSS3** - 现代化的样式设计

## 项目结构

```
vue-version/
├── src/
│   ├── main.js                 # Electron 主进程
│   └── renderer/
│       ├── components/         # Vue 组件
│       │   ├── Header.vue
│       │   ├── Sidebar.vue
│       │   ├── ProfilesTab.vue
│       │   ├── ProfileCard.vue
│       │   ├── BrowsersTab.vue
│       │   ├── GroupsTab.vue
│       │   ├── SettingsTab.vue
│       │   ├── NewProfileModal.vue
│       │   └── ProfileDetailModal.vue
│       ├── js/
│       │   ├── main.js         # Vue 应用入口
│       │   └── App.vue         # 主应用组件
│       ├── styles/
│       │   └── main.css        # 样式文件
│       ├── dist/               # 构建输出目录
│       └── index.html          # 主页面
├── vite.config.js              # Vite 配置
└── package.json                # 项目依赖
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

- **App.vue** - 主应用组件，管理全局状态和路由
- **Header.vue** - 顶部导航栏，包含搜索和用户菜单
- **Sidebar.vue** - 左侧边栏，提供主要导航
- **ProfilesTab.vue** - 配置文件管理标签页
- **ProfileCard.vue** - 配置文件卡片组件
- **BrowsersTab.vue** - 浏览器管理标签页
- **GroupsTab.vue** - 分组管理标签页
- **SettingsTab.vue** - 设置管理标签页

### 模态框组件

- **NewProfileModal.vue** - 新建配置文件模态框
- **ProfileDetailModal.vue** - 配置文件详情编辑模态框

## Vue 3 特性使用

### Composition API

项目使用 Vue 3 的 Composition API 和 `<script setup>` 语法：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// 响应式数据
const profiles = ref([]);
const activeTab = ref('profiles');

// 计算属性
const currentTabComponent = computed(() => {
  // 根据当前标签页返回对应组件
});

// 生命周期
onMounted(() => {
  loadData();
});
</script>
```

### 响应式系统

- 使用 `ref()` 和 `reactive()` 管理响应式状态
- 使用 `computed()` 创建计算属性
- 使用 `watch()` 监听数据变化

### 组件通信

- 使用 `defineProps()` 定义组件属性
- 使用 `defineEmits()` 定义组件事件
- 使用 `v-model` 实现双向数据绑定

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

1. **组件化设计** - 模块化的组件架构
2. **响应式状态管理** - 使用 Vue 3 的响应式系统
3. **类型安全** - 使用 TypeScript 类型注解（可选）
4. **性能优化** - 使用 Vue 3 的编译时优化
5. **代码组织** - 清晰的目录结构和命名规范

## 与 React 版本对比

### 相似之处
- 相同的功能特性和用户界面
- 相同的 Electron 主进程架构
- 相同的数据存储方案

### 不同之处
- 使用 Vue 3 而不是 React 18
- 使用 Composition API 而不是 Hooks
- 使用 Vite 而不是 Webpack
- 使用 Pinia 而不是 Context API

## 故障排除

### 常见问题

1. **构建失败** - 确保所有依赖已正确安装
2. **组件不显示** - 检查 Vite 构建是否成功
3. **样式问题** - 确保 CSS 文件正确加载

### 调试技巧

- 使用 Vue DevTools 调试组件状态
- 检查主进程控制台输出
- 验证 Vite 构建输出

## 许可证

MIT License
