#!/bin/bash

echo "===== 川渝十日游 - GitHub 部署脚本 ====="
echo ""

# 确保所有更改已提交
git add .
echo "添加所有文件到Git"

# 提交更改
read -p "请输入提交信息: " commit_message
git commit -m "$commit_message"
echo "提交更改"

# 推送到GitHub
git push
echo "推送到GitHub"

echo ""
echo "======================================="
echo "部署完成! 您的代码已推送到GitHub!"
echo "Netlify应该会自动检测更改并重新部署网站。"
echo "=======================================" 