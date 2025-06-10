@echo off
echo 正在启动川渝十日漫游记交互式旅游指南服务器...
echo.
echo 请确保已安装Node.js

if not exist node_modules\http-server (
    echo 首次运行，正在安装必要组件...
    npm install -g http-server
)

echo.
echo 服务器已启动！
echo 请在浏览器中访问: http://localhost:8080
echo 按Ctrl+C并输入Y可以关闭服务器
echo.

http-server -p 8080

pause 