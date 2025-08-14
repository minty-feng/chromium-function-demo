#!/bin/bash

echo "🚀 启动 PoolIcon 演示项目..."
echo ""

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 依赖未安装，正在安装..."
    npm install
    echo ""
fi

# 启动项目
echo "🔥 启动开发服务器..."
echo "📍 项目将在 http://localhost:3000 启动"
echo "🔄 按 Ctrl+C 停止服务器"
echo ""

npm start
