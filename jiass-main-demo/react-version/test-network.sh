#!/bin/bash

# 网络环境模拟测试脚本
# 用于测试 Electron 应用在网络差的情况下的表现

echo "=== Electron 网络环境测试脚本 ==="
echo ""

# 检查是否安装了必要的工具
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v electron &> /dev/null; then
    echo "❌ electron 未安装，正在安装..."
    npm install -g electron
fi

echo "📁 进入项目目录..."
cd /Users/didi/Workspace/chromium-function-demo/jiass-main-demo/react-version

echo "🔧 安装依赖..."
npm install

echo ""
echo "=== 测试场景选择 ==="
echo "1. 正常网络环境测试"
echo "2. 模拟网络慢的情况"
echo "3. 模拟网络断开的情况"
echo "4. 模拟网络超时的情况"
echo "5. 运行所有测试"
echo ""

read -p "请选择测试场景 (1-5): " choice

case $choice in
    1)
        echo "🌐 测试正常网络环境..."
        ELECTRON_URL="https://www.google.com" npm run dev
        ;;
    2)
        echo "🐌 模拟网络慢的情况..."
        echo "提示: 在浏览器中打开 loading.html 查看效果"
        ELECTRON_URL="https://httpbin.org/delay/15" npm run dev
        ;;
    3)
        echo "❌ 模拟网络断开的情况..."
        ELECTRON_URL="https://nonexistent-domain-12345.com" npm run dev
        ;;
    4)
        echo "⏰ 模拟网络超时的情况..."
        ELECTRON_URL="https://httpbin.org/delay/20" npm run dev
        ;;
    5)
        echo "🔄 运行所有测试场景..."
        
        echo ""
        echo "1️⃣ 正常网络测试..."
        ELECTRON_URL="https://www.google.com" timeout 15s npm run dev || true
        
        echo ""
        echo "2️⃣ 网络慢测试..."
        ELECTRON_URL="https://httpbin.org/delay/15" timeout 25s npm run dev || true
        
        echo ""
        echo "3️⃣ 网络断开测试..."
        ELECTRON_URL="https://nonexistent-domain-12345.com" timeout 15s npm run dev || true
        
        echo ""
        echo "✅ 所有测试完成"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "=== 测试说明 ==="
echo "• loading.html 文件包含了完整的网络状态检测和重试逻辑"
echo "• 可以通过修改 main.js 中的 checkNetworkConnection 函数来调整网络检测"
echo "• 支持手动重试和自动重试机制"
echo "• 显示详细的网络状态信息和连接时间"
echo ""
echo "💡 提示: 可以在浏览器中直接打开 loading.html 文件查看效果"
