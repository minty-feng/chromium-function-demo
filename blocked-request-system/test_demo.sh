#!/bin/bash

# 双重触发机制测试演示脚本

echo "=========================================="
echo "双重触发机制测试演示"
echo "=========================================="

# 清理旧的数据库文件
echo "清理旧的数据库文件..."
rm -f blocked_requests.db

# 编译程序
echo ""
echo "编译程序..."
if command -v cmake &> /dev/null; then
    echo "使用 CMake 编译..."
    mkdir -p build
    cd build
    if cmake .. && make -j4; then
        echo "✅ 编译成功！"
        cd ..
    else
        echo "❌ CMake 编译失败，尝试使用 Makefile..."
        cd ..
        if make; then
            echo "✅ Makefile 编译成功！"
        else
            echo "❌ 编译失败"
            exit 1
        fi
    fi
else
    echo "使用 Makefile 编译..."
    if make; then
        echo "✅ 编译成功！"
    else
        echo "❌ 编译失败"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "开始测试双重触发机制"
echo "=========================================="

echo ""
echo "1. 启动浏览器模拟器（模拟拦截请求）..."
echo "   配置：10条触发刷新 + 1分钟定时刷新"
echo "   按 Enter 键启动..."

# 启动浏览器模拟器
./simulate_browser &
BROWSER_PID=$!

echo "浏览器模拟器已启动 (PID: $BROWSER_PID)"
echo "等待5秒让模拟器初始化..."

sleep 5

echo ""
echo "2. 启动数据库读取器（模拟外部程序）..."
echo "   配置：5秒扫描一次，每次处理100条记录"
echo "   按 Enter 键启动..."

# 启动数据库读取器（5秒扫描一次）
./reader_program 5 100 &
READER_PID=$!

echo "数据库读取器已启动 (PID: $READER_PID)"
echo ""

echo "=========================================="
echo "测试进行中..."
echo "=========================================="
echo "现在你可以看到："
echo "1. 浏览器模拟器随机生成拦截请求"
echo "2. 当达到10条时，立即触发刷新（数量触发）"
echo "3. 每1分钟自动刷新一次（时间触发）"
echo "4. 数据库读取器每60秒扫描一次数据库"
echo "5. 模拟上报过程并更新状态"
echo ""
echo "观察双重触发机制的工作情况..."
echo "按 Enter 键停止测试..."

read

echo ""
echo "=========================================="
echo "停止测试..."
echo "=========================================="

# 停止程序
echo "停止浏览器模拟器..."
kill $BROWSER_PID 2>/dev/null

echo "停止数据库读取器..."
kill $READER_PID 2>/dev/null

# 等待程序结束
sleep 2

echo ""
echo "=========================================="
echo "测试完成！"
echo "=========================================="

# 显示最终统计
echo ""
echo "最终数据库统计："
if [ -f "blocked_requests.db" ]; then
    sqlite3 blocked_requests.db "SELECT COUNT(*) as total_records FROM blocked_requests;"
    sqlite3 blocked_requests.db "SELECT COUNT(*) as unreported FROM blocked_requests WHERE reported = 0;"
    sqlite3 blocked_requests.db "SELECT COUNT(*) as reported FROM blocked_requests WHERE reported = 1;"
    sqlite3 blocked_requests.db "SELECT COUNT(*) as failed FROM blocked_requests WHERE reported = 1 AND report_status >= 400;"
else
    echo "数据库文件未找到"
fi

echo ""
echo "双重触发机制测试演示完成！"
echo "你可以查看上面的输出了解："
echo "- 数量触发的时机和频率"
echo "- 时间触发的规律"
echo "- 批量写入的性能"
echo "- 外部程序的读取和上报过程"
