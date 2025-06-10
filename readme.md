# 川渝十日漫游记 - 交互式旅游指南

这是一个功能完整的川渝十日游交互式旅游指南，包含行程规划、食宿推荐、地图导航和旅行贴士。

## 功能特点

- 详细的每日行程安排
- 餐厅和住宿推荐
- 地图集成，显示所有景点、酒店和餐厅位置
- 路线规划功能
- 消费数据可视化
- 实用旅行贴士

## 如何运行

### 方法1：使用Node.js（推荐）

1. 确保您已安装 [Node.js](https://nodejs.org/)
2. 打开命令行/终端，导航到项目目录
3. 运行以下命令：
   ```
   node server.js
   ```
   或使用提供的快捷脚本：
   - Windows: 双击 `run.bat`
   - Mac/Linux: 在终端中运行 `./run.sh` (可能需要先执行 `chmod +x run.sh` 来添加执行权限)
4. 在浏览器中访问 http://localhost:3000

### 方法2：使用Visual Studio Code的Live Server

1. 安装 [Visual Studio Code](https://code.visualstudio.com/)
2. 安装 Live Server 扩展（在扩展市场中搜索"Live Server"）
3. 在VS Code中打开项目文件夹
4. 右键点击`chuan-yu-travel.html`文件
5. 选择"Open with Live Server"

### 方法3：使用Python创建简单服务器

1. 确保您已安装 [Python](https://www.python.org/)
2. 打开命令行/终端，导航到项目目录
3. 运行以下命令：
   - Python 3: `python -m http.server`
   - Python 2: `python -m SimpleHTTPServer`
4. 在浏览器中访问 http://localhost:8000

## 特别说明：地图功能

本项目使用Cursor MCP地图功能，无需配置外部地图API。只有在Cursor编辑器中打开时，地图功能才能正常工作。如果您在其他环境中查看，地图部分会显示为列表视图。

## 文件说明

- `chuan-yu-travel.html` - 主HTML文件
- `travel-data.js` - 旅游数据（行程、住宿、餐厅和景点信息）
- `cursor-mcp-map.js` - Cursor MCP地图相关功能
- `app.js` - 应用主要逻辑
- `server.js` - 本地HTTP服务器脚本
- `run.bat`/`run.sh` - 快速启动脚本

## 部署到Netlify

如果您想部署到Netlify以便在线访问：

1. 确保已安装Git
2. 运行提供的部署脚本：
   ```
   ./deploy-to-netlify.sh
   ```
   (在Windows上，您需要使用Git Bash或WSL运行此脚本)
3. 按照脚本提示操作，输入GitHub信息
4. 完成后，您将获得Netlify部署链接

**注意**：部署到Netlify后，请使用Cursor打开网站链接以获得完整的地图功能体验。

## 注意事项

- 本项目中的价格和信息可能需要更新，请在出行前核实
- 最佳体验请在Cursor编辑器环境中查看

## 共享给朋友

如果您想与朋友共享此旅游指南，建议：

1. 部署到GitHub Pages或其他静态网站托管服务
2. 或将整个项目压缩发送给朋友，并指导他们按照上述方法运行 