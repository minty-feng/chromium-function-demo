#!/bin/bash

echo "=== 拦截请求数据库测试脚本 ==="
echo

# 检查数据库文件是否存在
if [ ! -f "test_blocked_requests.db" ]; then
    echo "错误：数据库文件不存在，请先运行 ./create_test_data"
    exit 1
fi

echo "1. 数据库基本信息："
echo "   文件大小：$(ls -lh test_blocked_requests.db | awk '{print $5}')"
echo "   记录总数：$(sqlite3 test_blocked_requests.db "SELECT COUNT(*) FROM blocked_requests;")"
echo

echo "2. 按拦截原因统计："
sqlite3 test_blocked_requests.db "SELECT reason, COUNT(*) as count FROM blocked_requests GROUP BY reason ORDER BY count DESC;"
echo

echo "3. 按域名统计（前10个）："
sqlite3 test_blocked_requests.db "SELECT host, COUNT(*) as count FROM blocked_requests GROUP BY host ORDER BY count DESC LIMIT 10;"
echo

echo "4. 最近5条记录："
sqlite3 test_blocked_requests.db "SELECT id, host, reason, datetime(timestamp/1000, 'unixepoch') as time FROM blocked_requests ORDER BY timestamp DESC LIMIT 5;"
echo

echo "5. 未上报记录数量："
unreported=$(sqlite3 test_blocked_requests.db "SELECT COUNT(*) FROM blocked_requests WHERE reported = 0;")
echo "   未上报：$unreported 条"
echo

echo "6. 测试特定域名查询（包含'google'的域名）："
sqlite3 test_blocked_requests.db "SELECT host, reason, datetime(timestamp/1000, 'unixepoch') as time FROM blocked_requests WHERE host LIKE '%google%' ORDER BY timestamp DESC;"
echo

echo "7. 测试时间范围查询（最近1小时）："
sqlite3 test_blocked_requests.db "SELECT host, reason, datetime(timestamp/1000, 'unixepoch') as time FROM blocked_requests WHERE timestamp > (strftime('%s', 'now') * 1000 - 3600000) ORDER BY timestamp DESC;" 2>/dev/null || echo "   无最近1小时的记录"
echo

echo "8. 数据库表结构："
sqlite3 test_blocked_requests.db ".schema blocked_requests"
echo

echo "=== 测试完成 ==="
echo
echo "更多查询示例请查看 quick_queries.sql 文件"
echo "完整操作指南请查看 DATABASE_GUIDE.md 文件"
