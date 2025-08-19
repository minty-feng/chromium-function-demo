# 拦截请求系统测试指南

## 快速开始

### 1. 创建测试数据
```bash
# 编译并运行测试数据生成器
g++ -std=c++17 -Wall -Wextra -O2 -Isrc -c test/create_test_data.cpp -o test/create_test_data.o
g++ test/create_test_data.o libblocked_request_db.a -o test/create_test_data -lsqlite3

# 生成100条测试记录
./test/create_test_data
```

### 2. 运行测试脚本
```bash
# 运行数据库测试脚本
./test/test_database.sh

# 或直接使用SQL查询
sqlite3 test_blocked_requests.db < test/quick_queries.sql
```

### 3. 运行模拟程序
```bash
# 浏览器模拟器（生成新的拦截请求）
./test/simulate_browser

# 数据库读取程序（处理未上报的请求）
./test/reader_program
```

## 可用工具

### 1. 测试数据生成器 (`create_test_data`)
- **功能**：创建100条模拟拦截请求记录
- **数据特点**：
  - 10种不同的恶意域名
  - 10种不同的URL路径
  - 10种不同的拦截原因
  - 过去24小时内的随机时间戳
  - 所有记录初始状态为未上报

### 2. 数据库测试脚本 (`test_database.sh`)
- **功能**：演示各种数据库查询操作
- **包含测试**：
  - 基本信息统计
  - 按原因分类统计
  - 按域名分类统计
  - 时间范围查询
  - 特定域名查询
  - 表结构显示

### 3. SQL查询脚本 (`quick_queries.sql`)
- **功能**：提供常用的SQL查询示例
- **使用方法**：`sqlite3 test_blocked_requests.db < quick_queries.sql`

### 4. 浏览器模拟器 (`simulate_browser`)
- **功能**：模拟浏览器生成拦截请求
- **特点**：实时生成，可测试批量管理功能

### 5. 数据库读取程序 (`reader_program`)
- **功能**：读取并处理未上报的拦截请求
- **特点**：模拟上报过程，更新记录状态

## 数据库结构

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

## 常用操作命令

### 查看数据
```bash
# 查看所有记录
sqlite3 test_blocked_requests.db "SELECT * FROM blocked_requests LIMIT 10;"

# 查看未上报记录
sqlite3 test_blocked_requests.db "SELECT COUNT(*) FROM blocked_requests WHERE reported = 0;"

# 按原因统计
sqlite3 test_blocked_requests.db "SELECT reason, COUNT(*) FROM blocked_requests GROUP BY reason;"
```

### 数据管理
```bash
# 备份数据库
cp test_blocked_requests.db backup_$(date +%Y%m%d).db

# 重置数据库
rm test_blocked_requests.db
./create_test_data

# 查看数据库大小
ls -lh test_blocked_requests.db*
```

## 测试数据说明

### 域名类型
- **恶意软件**：malware-site.com, malicious-content.biz
- **钓鱼网站**：phishing-attempt.net, scam-website.com
- **广告追踪**：ads.doubleclick.net, tracker.google.com
- **隐私侵犯**：analytics.facebook.com
- **垃圾内容**：spam-site.org, fake-news.info

### 拦截原因
- 恶意软件、钓鱼网站、广告追踪、隐私侵犯
- 垃圾内容、虚假信息、诈骗网站、恶意脚本
- 可疑下载、追踪Cookie

### 标识店铺类型
- **Chrome/120.0.0.0** - Chrome浏览器
- **Firefox/121.0** - Firefox浏览器
- **Safari/17.2** - Safari浏览器
- **Edge/120.0.0.0** - Edge浏览器
- **Opera/104.0** - Opera浏览器

### 数据特点
- 100条记录，分布均匀
- 时间跨度：过去24小时
- 状态：全部未上报（初始状态）
- 随机组合：域名+路径+原因+标识店铺+标签页ID
- 标签页ID范围：1-20

## 性能测试

### 批量操作测试
```bash
# 测试批量插入性能
time ./test/create_test_data

# 测试批量查询性能
time sqlite3 test_blocked_requests.db "SELECT * FROM blocked_requests WHERE reported = 0;"
```

### 并发测试
```bash
# 同时运行多个程序
./test/simulate_browser &
./test/reader_program &
./test/test_database.sh
```

## 故障排除

### 常见问题
1. **数据库文件不存在**：运行 `./test/create_test_data`
2. **权限错误**：确保脚本有执行权限 `chmod +x test/*.sh`
3. **编译错误**：检查依赖库是否正确安装

### 调试技巧
```bash
# 查看详细错误信息
sqlite3 test_blocked_requests.db ".trace stdout"

# 检查数据库完整性
sqlite3 test_blocked_requests.db "PRAGMA integrity_check;"

# 查看数据库统计
sqlite3 test_blocked_requests.db "PRAGMA stats;"
```

## 扩展测试

### 自定义测试数据
修改 `test/create_test_data.cpp` 中的测试数据数组，添加新的域名、路径、原因、标识店铺或标签页ID。

### 压力测试
增加测试数据量，测试数据库在高负载下的性能。

### 集成测试
结合所有组件，测试完整的拦截请求处理流程。

---

**注意**：这些工具仅用于测试和开发目的，生产环境请使用适当的数据和配置。
