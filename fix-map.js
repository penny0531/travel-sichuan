// 修复高德地图加载问题
document.addEventListener('DOMContentLoaded', function() {
    // 检查地图容器是否存在
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        console.error('地图容器不存在');
        return;
    }
    
    // 检查AMap对象是否存在
    if (typeof AMap === 'undefined') {
        console.error('高德地图API未加载，尝试重新加载');
        
        // 重新加载高德地图API
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://webapi.amap.com/maps?v=2.0&key=9d4cfaadc1662d1da2db7afcadac99df&plugin=AMap.ToolBar,AMap.Driving,AMap.Walking,AMap.Transfer,AMap.Scale,AMap.PolyEditor,AMap.Geolocation';
        script.onload = function() {
            console.log('高德地图API重新加载成功');
            // 初始化地图
            if (typeof initMap === 'function') {
                setTimeout(initMap, 500);
            }
        };
        script.onerror = function() {
            console.error('高德地图API加载失败');
            // 显示错误信息
            if (mapContainer) {
                mapContainer.innerHTML = '<div style="padding: 20px; text-align: center;"><h3>地图加载失败</h3><p>请确认您的网络连接正常，并且高德地图API密钥已正确配置。</p></div>';
            }
        };
        document.head.appendChild(script);
        return;
    }
    
    // 如果AMap存在但地图未初始化
    if (typeof map === 'undefined' || map === null) {
        console.log('地图未初始化，尝试初始化');
        if (typeof initMap === 'function') {
            setTimeout(initMap, 500);
            setTimeout(initMapEvents, 1000);
        }
    }
    
    // 添加错误处理
    window.addEventListener('error', function(e) {
        if (e.message.includes('AMap') || e.message.includes('map')) {
            console.error('地图相关错误:', e.message);
        }
    });
}); 