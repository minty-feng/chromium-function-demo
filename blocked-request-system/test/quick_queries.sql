-- 拦截请求数据库快速查询脚本
-- 使用方法: sqlite3 test_blocked_requests.db < quick_queries.sql

-- 1. 查看表结构
.schema blocked_requests

-- 2. 查看前10条记录
SELECT 
    id,
    host,
    reason,
    datetime(timestamp/1000, 'unixepoch') as time,
    CASE reported WHEN 0 THEN '未上报' ELSE '已上报' END as status
FROM blocked_requests 
ORDER BY timestamp DESC 
LIMIT 10;

-- 3. 按拦截原因统计
SELECT 
    reason, 
    COUNT(*) as count 
FROM blocked_requests 
GROUP BY reason 
ORDER BY count DESC;

-- 4. 查看未上报记录数量
SELECT COUNT(*) as unreported_count FROM blocked_requests WHERE reported = 0;

-- 5. 查看已上报记录数量
SELECT COUNT(*) as reported_count FROM blocked_requests WHERE reported = 1;

-- 6. 按域名统计
SELECT 
    host, 
    COUNT(*) as count 
FROM blocked_requests 
GROUP BY host 
ORDER BY count DESC 
LIMIT 10;

-- 7. 查看最近1小时的记录
SELECT 
    host,
    reason,
    datetime(timestamp/1000, 'unixepoch') as time
FROM blocked_requests 
WHERE timestamp > (strftime('%s', 'now') * 1000 - 3600000)
ORDER BY timestamp DESC;

-- 8. 查看特定域名的记录
SELECT 
    url,
    reason,
    datetime(timestamp/1000, 'unixepoch') as time
FROM blocked_requests 
WHERE host LIKE '%google%'
ORDER BY timestamp DESC;

-- 9. 查看统计摘要
SELECT 
    '总记录数' as metric,
    COUNT(*) as value
FROM blocked_requests
UNION ALL
SELECT 
    '未上报记录',
    SUM(CASE WHEN reported = 0 THEN 1 ELSE 0 END)
FROM blocked_requests
UNION ALL
SELECT 
    '已上报记录',
    SUM(CASE WHEN reported = 1 THEN 1 ELSE 0 END)
FROM blocked_requests;

-- 10. 查看数据库大小信息
SELECT 
    '数据库文件大小' as info,
    page_count * page_size as size_bytes
FROM pragma_page_count(), pragma_page_size();
