# 项目结构说明

## 📁 目录结构

```
blocked_request_system/
├── src/                           # 核心源代码
│   ├── blocked_request_db.h      # 数据库管理头文件
│   ├── blocked_request_db.cc     # 数据库管理实现
│   ├── smart_batch_manager.h     # 批量管理头文件
│   └── smart_batch_manager.cc    # 批量管理实现
├── test/                          # 测试代码和工具
│   ├── create_test_data.cpp      # 测试数据生成器
│   ├── create_test_data          # 编译后的测试数据生成器
│   ├── simulate_browser.cpp      # 浏览器模拟器
│   ├── simulate_browser          # 编译后的浏览器模拟器
│   ├── reader_program.cpp        # 数据库读取程序
│   ├── reader_program            # 编译后的数据库读取程序
│   ├── test_database.sh          # 数据库测试脚本
│   └── quick_queries.sql         # SQL查询示例
├── build/                         # CMake构建目录
├── CMakeLists.txt                 # CMake构建配置
├── Makefile                       # Make构建配置
├── README.md                      # 项目主说明
├── README_TESTING.md              # 测试系统说明
├── DATABASE_GUIDE.md              # 数据库操作指南
├── PROJECT_STRUCTURE.md           # 项目结构说明（本文件）
└── test_blocked_requests.db      # 测试数据库文件
```

## 🏗️ 构建系统

### Makefile 构建
```bash
# 编译整个项目
make

# 清理编译文件
make clean

# 查看帮助
make help
```

### CMake 构建
```bash
# 创建构建目录
mkdir -p build && cd build

# 配置和编译
cmake .. && make
```

## 🔧 核心组件

### 1. 数据库管理 (`src/blocked_request_db.*`)
- **功能**：SQLite数据库的封装管理
- **特性**：支持WAL模式、多进程并发、批量操作
- **字段**：id, url, host, reason, timestamp, reported, browser_id, tab_id

### 2. 批量管理 (`src/smart_batch_manager.*`)
- **功能**：智能批量处理拦截请求
- **特性**：自动刷新、定时刷新、大小触发刷新

## 🧪 测试工具

### 1. 测试数据生成器 (`test/create_test_data`)
- **功能**：生成100条模拟拦截请求记录
- **数据特点**：包含10种域名、10种路径、10种原因、5种标识店铺、1-20标签页ID

### 2. 浏览器模拟器 (`test/simulate_browser`)
- **功能**：模拟浏览器生成拦截请求
- **特性**：实时生成、随机延迟、批量管理

### 3. 数据库读取程序 (`test/reader_program`)
- **功能**：读取并处理未上报的拦截请求
- **特性**：模拟上报过程、状态更新、统计信息

### 4. 数据库测试脚本 (`test/test_database.sh`)
- **功能**：演示各种数据库查询操作
- **包含测试**：基本信息、分类统计、时间查询、特定查询

## 📊 数据库结构

### 表：`blocked_requests`
```sql
CREATE TABLE blocked_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主键ID
    url TEXT NOT NULL,                     -- 完整URL
    host TEXT NOT NULL,                    -- 域名
    reason TEXT NOT NULL,                  -- 拦截原因
    timestamp INTEGER NOT NULL,            -- 时间戳（毫秒）
    reported INTEGER DEFAULT 0,            -- 上报状态
    browser_id TEXT DEFAULT '',            -- 标识店铺
    tab_id INTEGER DEFAULT 0               -- 标签页ID
);
```

### 索引
- `idx_timestamp` - 时间戳索引
- `idx_reported` - 上报状态索引
- `idx_host` - 域名索引
- `idx_browser_id` - 标识店铺索引
- `idx_tab_id` - 标签页ID索引

## 🚀 快速开始

### 1. 编译项目
```bash
make clean && make
```

### 2. 创建测试数据
```bash
./test/create_test_data
```

### 3. 运行测试
```bash
./test/test_database.sh
```

### 4. 运行模拟器
```bash
./test/simulate_browser
```

## 📝 开发说明

### 添加新的核心功能
1. 在 `src/` 目录下创建新的源文件
2. 更新 `Makefile` 和 `CMakeLists.txt`
3. 在 `src/` 目录下编译

### 添加新的测试
1. 在 `test/` 目录下创建新的测试文件
2. 更新 `Makefile` 和 `CMakeLists.txt`
3. 在 `test/` 目录下编译

### 数据库字段修改
1. 更新 `src/blocked_request_db.h` 中的结构体
2. 更新 `src/blocked_request_db.cc` 中的SQL语句
3. 更新测试数据生成器
4. 更新文档说明

## 🔍 文件说明

### 核心文件
- `blocked_request_db.*` - 数据库管理核心
- `smart_batch_manager.*` - 批量处理管理
- `browser_view.*` - 浏览器视图（如果存在）
- `global_infobar.*` - 全局信息栏（如果存在）

### 测试文件
- `create_test_data.*` - 测试数据生成
- `simulate_browser.*` - 浏览器模拟
- `reader_program.*` - 数据读取测试
- `test_database.sh` - 数据库测试脚本
- `quick_queries.sql` - SQL查询示例

### 配置文件
- `Makefile` - Make构建配置
- `CMakeLists.txt` - CMake构建配置
- `*.md` - 各种说明文档

## 📚 相关文档

- `README.md` - 项目总体说明
- `README_TESTING.md` - 测试系统详细说明
- `DATABASE_GUIDE.md` - 数据库操作完整指南
- `USAGE.md` - 使用说明（如果存在）

---

**注意**：此项目结构支持多进程并发访问SQLite数据库，使用WAL模式确保数据一致性。
