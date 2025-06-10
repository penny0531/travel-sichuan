# 川渝十日漫游记 - 交互式旅游指南

这是一个功能完整的川渝十日游交互式旅游指南，包含行程规划、食宿推荐、高德地图导航和旅行贴士。

## 功能特点

- 详细的每日行程安排
- 餐厅和住宿推荐
- 高德地图集成，显示所有景点、酒店和餐厅位置
- 路线规划功能
- 消费数据可视化
- 实用旅行贴士

## 如何运行

由于浏览器安全策略限制，直接在浏览器中打开HTML文件时，高德地图API无法正常工作。您需要通过HTTP服务器来访问此网页。

### 方法1：使用Node.js（推荐）

1. 确保您已安装 [Node.js](https://nodejs.org/)
2. 打开命令行/终端，导航到项目目录
3. 运行以下命令：
   ```
   node server.js
   ```
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

## 高德地图API配置

在使用之前，您需要获取并配置高德地图API密钥：

1. 访问[高德开放平台](https://lbs.amap.com/)
2. 注册账号并登录
3. 创建应用，选择"Web端(JS API)"
4. 获取API密钥
5. 在`chuan-yu-travel.html`文件中，找到以下行：
   ```html
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=您的高德地图key"></script>
   ```
6. 将"您的高德地图key"替换为您获取的API密钥

## 文件说明

- `chuan-yu-travel.html` - 主HTML文件
- `travel-data.js` - 旅游数据（行程、住宿、餐厅和景点信息）
- `map-utils.js` - 高德地图相关功能
- `app.js` - 应用主要逻辑
- `server.js` - 本地HTTP服务器脚本

## 共享给朋友

如果您想与朋友共享此旅游指南，建议：

1. 部署到GitHub Pages或其他静态网站托管服务
2. 或将整个项目压缩发送给朋友，并指导他们按照上述方法运行

## 注意事项

- 高德地图API密钥有使用限制，请不要过度使用
- 部分价格和信息可能需要更新，请在出行前核实 