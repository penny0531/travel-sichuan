#!/bin/bash

echo "正在启动川渝十日漫游记交互式旅游指南服务器..."
echo "请确保已安装Node.js"

# 检查http-server是否已安装
if ! command -v http-server &> /dev/null; then
    echo "首次运行，正在安装必要组件..."
    npm install -g http-server
fi

echo ""
echo "服务器已启动！"
echo "请在浏览器中访问: http://localhost:8080"
echo "按Ctrl+C可以关闭服务器"
echo ""

http-server -p 8080

# 捕获Ctrl+C信号
trap 'echo "服务器已停止"; exit 0' INT 