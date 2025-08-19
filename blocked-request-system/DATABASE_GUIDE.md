# 拦截请求数据库操作指南

## 数据库结构

### 表结构：`blocked_requests`

```sql
CREATE TABLE blocked_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主键ID，自动递增
    url TEXT NOT NULL,                     -- 被拦截的完整URL
    host TEXT NOT NULL,                    -- 主机名/域名
    reason TEXT NOT NULL,                  -- 拦截原因
    timestamp INTEGER NOT NULL,            -- 拦截时间戳（毫秒）
    reported INTEGER DEFAULT 0,            -- 是否已上报（0=未上报，1=已上报）
    browser_id TEXT DEFAULT '',            -- 标识店铺
    tab_id INTEGER DEFAULT 0               -- 标签页ID
);
```

### 索引
- `idx_timestamp` - 时间戳索引，用于按时间排序和查询
- `idx_reported` - 上报状态索引，用于快速查询未上报记录
- `idx_host` - 主机名索引，用于按域名查询
- `idx_browser_id` - 标识店铺索引，用于按店铺查询
- `idx_tab_id` - 标签页ID索引，用于按标签页查询

## 常用SQL查询命令

### 1. 查看所有记录
```sql
SELECT * FROM blocked_requests ORDER BY timestamp DESC LIMIT 100;
```

### 2. 查看未上报的记录
```sql
SELECT * FROM blocked_requests WHERE reported = 0 ORDER BY timestamp ASC;
```

### 3. 查看已上报的记录
```sql
SELECT * FROM blocked_requests WHERE reported = 1 ORDER BY timestamp DESC;
```

### 4. 按域名查询
```sql
SELECT * FROM blocked_requests WHERE host LIKE '%google%';
```

### 5. 按时间范围查询
```sql
-- 查询最近1小时的记录
SELECT * FROM blocked_requests 
WHERE timestamp > (strftime('%s', 'now') * 1000 - 3600000);

-- 查询特定日期的记录
SELECT * FROM blocked_requests 
WHERE date(timestamp/1000, 'unixepoch') = '2024-01-15';
```

### 6. 按拦截原因统计
```sql
SELECT reason, COUNT(*) as count 
FROM blocked_requests 
GROUP BY reason 
ORDER BY count DESC;
```

### 7. 查看统计信息
```sql
SELECT 
    COUNT(*) as total_requests,
    SUM(CASE WHEN reported = 0 THEN 1 ELSE 0 END) as unreported,
    SUM(CASE WHEN reported = 1 THEN 1 ELSE 0 END) as reported
FROM blocked_requests;
```

### 8. 按标识店铺查询
```sql
-- 查看特定店铺的拦截记录
SELECT * FROM blocked_requests WHERE browser_id = 'Chrome/120.0.0.0';

-- 按店铺统计拦截次数
SELECT browser_id, COUNT(*) as count 
FROM blocked_requests 
GROUP BY browser_id 
ORDER BY count DESC;
```

### 9. 按标签页查询
```sql
-- 查看特定标签页的拦截记录
SELECT * FROM blocked_requests WHERE tab_id = 5;

-- 按标签页统计拦截次数
SELECT tab_id, COUNT(*) as count 
FROM blocked_requests 
GROUP BY tab_id 
ORDER BY count DESC;
```

### 10. 组合查询示例
```sql
-- 查看特定店铺在特定标签页的拦截记录
SELECT * FROM blocked_requests 
WHERE browser_id = 'Firefox/121.0' 
AND tab_id = 10;

-- 按店铺和标签页组合统计
SELECT browser_id, tab_id, COUNT(*) as count 
FROM blocked_requests 
GROUP BY browser_id, tab_id 
ORDER BY count DESC;
```

### 11. 清理已上报的旧记录
```sql
-- 删除7天前已上报的记录
DELETE FROM blocked_requests 
WHERE reported = 1 
AND timestamp < (strftime('%s', 'now') * 1000 - 7 * 24 * 3600 * 1000);
```

## 命令行操作示例

### 1. 使用sqlite3命令行工具
```bash
# 打开数据库
sqlite3 test_blocked_requests.db

# 查看表结构
.schema blocked_requests

# 查看所有记录
SELECT * FROM blocked_requests LIMIT 10;

# 查看未上报记录数量
SELECT COUNT(*) FROM blocked_requests WHERE reported = 0;

# 退出
.quit
```

### 2. 使用项目自带的程序
```bash
# 创建测试数据
./test/create_test_data

# 运行浏览器模拟器
./test/simulate_browser

# 运行数据库读取程序
./test/reader_program
```

## 数据格式说明

### 时间戳格式
- 存储格式：Unix时间戳（毫秒）
- 转换示例：
  ```sql
  -- 时间戳转可读时间
  SELECT datetime(timestamp/1000, 'unixepoch') as readable_time 
  FROM blocked_requests LIMIT 5;
  
  -- 当前时间转时间戳
  SELECT strftime('%s', 'now') * 1000 as current_timestamp;
  ```

### 上报状态
- `0` = 未上报
- `1` = 已上报

### URL格式
- 完整URL，包含协议、域名和路径
- 示例：`https://malware-site.com/malware.exe`

## 性能优化建议

### 1. 查询优化
- 使用索引字段进行查询（timestamp, reported, host, browser_id, tab_id）
- 避免使用 `SELECT *`，只查询需要的字段
- 使用 `LIMIT` 限制结果集大小
- 利用复合索引进行多字段查询

### 2. 批量操作
- 使用批量插入：`AddBlockedRequests()`
- 定期清理旧数据：`DeleteReportedRequests()`

### 3. 数据库配置
- 已启用WAL模式提高并发性能
- 设置适当的超时时间（5秒）
- 使用NORMAL同步模式平衡性能和数据安全

## 常见问题

### Q: 如何备份数据库？
```bash
# 复制数据库文件
cp test_blocked_requests.db backup_$(date +%Y%m%d_%H%M%S).db

# 或使用sqlite3导出
sqlite3 test_blocked_requests.db ".backup backup.db"
```

### Q: 如何重置数据库？
```bash
# 删除数据库文件
rm test_blocked_requests.db

# 重新运行程序会自动创建新数据库
```

### Q: 如何查看数据库大小？
```bash
ls -lh test_blocked_requests.db*
# 查看主数据库文件和WAL文件大小
```

## 测试数据说明

测试数据包含以下类型：
- **恶意软件站点**：malware-site.com, malicious-content.biz
- **钓鱼网站**：phishing-attempt.net, scam-website.com
- **广告追踪**：ads.doubleclick.net, tracker.google.com
- **隐私侵犯**：analytics.facebook.com
- **垃圾内容**：spam-site.org, fake-news.info

每条记录包含：
- 随机生成的URL和路径
- 过去24小时内的随机时间戳
- 25%的记录标记为已上报状态
- 多样化的拦截原因
- 5种不同的标识店铺（Chrome/120.0.0.0, Firefox/121.0, Safari/17.2, Edge/120.0.0.0, Opera/104.0）
- 1-20范围内的随机标签页ID
