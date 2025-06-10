#!/bin/bash

echo "===== 川渝十日游 - GitHub & Netlify 部署脚本 ====="
echo ""

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
    
    # 创建.gitignore文件
    echo "创建.gitignore文件..."
    cat > .gitignore << EOL
.DS_Store
node_modules/
*.log
EOL
fi

# 询问GitHub仓库信息
echo "请输入您的GitHub用户名:"
read github_username

echo "请输入新仓库名称 (默认: travel-sichuan):"
read github_repo
github_repo=${github_repo:-travel-sichuan}

# 添加所有文件到Git
echo "添加文件到Git..."
git add .

echo "提交更改..."
echo "请输入提交信息 (默认: 初始提交):"
read commit_message
commit_message=${commit_message:-"初始提交 - 川渝十日游交互式旅游指南"}
git commit -m "$commit_message"

# 检查远程仓库是否已设置
remote_exists=$(git remote -v | grep origin)
if [ -z "$remote_exists" ]; then
    echo "添加GitHub远程仓库..."
    git remote add origin https://github.com/$github_username/$github_repo.git
fi

# 推送到GitHub
echo "推送到GitHub..."
echo "这将要求您输入GitHub凭据..."
git push -u origin master

echo ""
echo "GitHub部署完成!"
echo "仓库地址: https://github.com/$github_username/$github_repo"
echo ""

# 检查Netlify CLI是否已安装
if ! command -v netlify &> /dev/null; then
    echo "安装Netlify CLI..."
    npm install -g netlify-cli
fi

# 使用Netlify CLI部署
echo "开始部署到Netlify..."
echo "这将打开浏览器，请您在浏览器中授权Netlify访问..."
netlify deploy --prod

echo ""
echo "======================================="
echo "部署完成! 您的旅游指南现已上线!"
echo "请记得在高德开放平台中将Netlify网站域名添加到安全域名列表中"
echo "=======================================" 