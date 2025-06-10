const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析请求URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 默认显示首页
    if (pathname === '/') {
        pathname = '/chuan-yu-travel.html';
    }
    
    // 获取文件扩展名
    const ext = path.parse(pathname).ext;
    
    // 定义文件路径
    const filePath = path.join(__dirname, pathname);
    
    // 映射文件扩展名到MIME类型
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    
    // 设置Content-Type头
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404);
                res.end('文件未找到');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end(`服务器错误: ${err.code}`);
            }
        } else {
            // 成功响应
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 设置服务器端口
const PORT = process.env.PORT || 3000;

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`请在浏览器中打开 http://localhost:${PORT} 查看您的旅游指南`);
    console.log('按 Ctrl+C 停止服务器');
}); 