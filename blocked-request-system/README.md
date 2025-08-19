# 拦截请求数据库系统

用于记录和管理被拦截网络请求的SQLite数据库系统demo。

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    指纹浏览器     │    │   SQLite数据库   │    │   外部上报程序   │
│                 │    │                │    │                 │
│ - 拦截请求       │───▶│ - 存储拦截记录   │◀───│ - 读取未上报记录   │
│ - 记录到数据库    │    │ - 管理上报状态   │    │ - 批量上报到服务器 │
│ - 不涉及网络      │    │ - 提供查询接口   │    │ - 更新上报状态    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 主要特性

### 1. 数据库设计
- **高性能**: 使用SQLite3，支持WAL模式，并发性能优秀
- **完整记录**: 记录URL、主机、路径、方法、来源、用户代理等完整信息
- **状态管理**: 跟踪每条记录的上报状态，支持重试和失败处理
- **索引优化**: 针对常用查询字段建立索引，查询性能优秀

### 2. 上报客户端
- **异步处理**: 后台线程自动上报，不阻塞主程序
- **批量上报**: 支持批量处理，提高网络效率
- **重试机制**: 内置重试逻辑，提高上报成功率
- **配置灵活**: 支持自定义API地址、密钥、间隔等参数

### 3. 线程安全
- **多线程支持**: 数据库操作和上报操作都是线程安全的
- **资源管理**: 自动管理数据库连接和线程生命周期

## 文件结构

```
blocked_request_system/
├── blocked_request_db.h      # 数据库操作头文件
├── blocked_request_db.cc     # 数据库操作实现
├── report_client.h           # 上报客户端头文件
├── report_client.cc          # 上报客户端实现
├── example.cpp               # 使用示例程序
├── CMakeLists.txt            # CMake构建文件
└── README.md                 # 本文档
```

## 数据库表结构

```sql
CREATE TABLE blocked_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- 主键ID
  url TEXT NOT NULL,                       -- 被拦截的URL
  host TEXT NOT NULL,                      -- 主机名
  path TEXT NOT NULL,                      -- 路径
  method TEXT NOT NULL,                    -- HTTP方法
  referrer TEXT,                           -- 来源页面
  user_agent TEXT,                         -- 用户代理
  profile_id TEXT,                         -- 浏览器Profile ID
  tab_id TEXT,                             -- 标签页ID
  reason TEXT NOT NULL,                    -- 拦截原因
  timestamp INTEGER NOT NULL,              -- 时间戳
  reported INTEGER DEFAULT 0,              -- 是否已上报
  report_timestamp INTEGER,                -- 上报时间戳
  report_response TEXT,                    -- 上报响应
  report_status INTEGER                    -- 上报状态码
);
```

## 使用方法

### 1. 在浏览器中集成

```cpp
#include "blocked_request_db.h"

// 初始化数据库
BlockedRequestDB db;
db.Initialize("/path/to/blocked_requests.db");

// 记录被拦截的请求
BlockedRequest request;
request.url = "https://ads.example.com/track";
request.host = "ads.example.com";
request.path = "/track";
request.method = "GET";
request.referrer = "https://www.example.com/page1";
request.user_agent = "Mozilla/5.0...";
request.profile_id = "profile1";
request.tab_id = "tab1";
request.reason = "广告追踪域名";
request.timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()).count();

db.AddBlockedRequest(request);
```

### 2. 外部程序上报

```cpp
#include "report_client.h"

// 初始化上报客户端
ReportClient client("/path/to/blocked_requests.db");
client.Initialize();

// 配置上报参数
ReportConfig config;
config.api_url = "https://api.example.com/report";
config.api_key = "your_api_key";
config.batch_size = 100;
config.report_interval_ms = 5000;

client.SetConfig(config);

// 启动自动上报
client.StartReporting();

// 或者手动上报
client.ReportOnce();
```

## 编译和安装

### 依赖要求
- C++17 编译器
- SQLite3 开发库
- libcurl 开发库
- CMake 3.10+

### 编译步骤

```bash
# 创建构建目录
mkdir build && cd build

# 配置
cmake ..

# 编译
make -j$(nproc)

# 安装（可选）
sudo make install
```

### 运行示例

```bash
# 运行示例程序
./bin/example
```

## 配置说明

### 数据库配置
- **WAL模式**: 默认启用，提高并发性能
- **超时设置**: 5秒忙等待超时
- **同步模式**: NORMAL模式，平衡性能和安全性

### 上报配置
- **批量大小**: 默认100条记录一批
- **重试次数**: 默认3次
- **重试延迟**: 默认1秒
- **上报间隔**: 默认5秒
- **SSL验证**: 默认启用

## 性能优化

### 1. 数据库优化
- 使用预编译语句，避免重复解析SQL
- 批量操作使用事务，提高写入性能
- 合理设置索引，优化查询性能

### 2. 网络优化
- 批量上报减少网络请求次数
- 异步处理不阻塞主程序
- 支持HTTP/HTTPS，自动重试失败请求

### 3. 内存优化
- 使用智能指针管理资源
- 及时释放数据库连接
- 限制查询结果集大小

## 监控和调试

### 统计信息
```cpp
auto stats = db.GetStatistics();
std::cout << "总记录数: " << stats.total_requests << std::endl;
std::cout << "未上报: " << stats.unreported_requests << std::endl;
std::cout << "已上报: " << stats.reported_requests << std::endl;
std::cout << "上报失败: " << stats.failed_reports << std::endl;
```

### 上报状态
```cpp
auto report_stats = client.GetStats();
std::cout << "总上报数: " << report_stats.total_reported << std::endl;
std::cout << "总失败数: " << report_stats.total_failed << std::endl;
std::cout << "服务运行中: " << report_stats.is_running << std::endl;
```

## 故障排除

### 常见问题

1. **数据库初始化失败**
   - 检查文件路径权限
   - 确认SQLite3库已安装

2. **上报失败**
   - 检查网络连接
   - 验证API地址和密钥
   - 查看错误日志

3. **性能问题**
   - 调整批量大小
   - 优化数据库索引
   - 检查磁盘I/O性能

### 日志记录
系统支持回调函数记录详细的上报结果，便于调试和监控。

## 扩展功能

### 1. 数据导出
可以添加CSV、JSON等格式的数据导出功能。

### 2. 数据分析
可以集成数据分析工具，分析拦截模式。

### 3. 实时监控
可以添加Web界面，实时监控系统状态。

## 许可证

本项目遵循BSD许可证，详见LICENSE文件。

## 贡献

欢迎提交Issue和Pull Request来改进这个系统。
