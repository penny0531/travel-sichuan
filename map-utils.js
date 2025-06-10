// 地图功能工具
let map = null;
let currentMarkers = [];
let currentRoutes = [];
let currentLocation = null;
let selectedMarker = null;

// 初始化地图
function initMap() {
    map = new AMap.Map('map-container', {
        zoom: 6,
        center: [104.066541, 30.572269], // 默认中心设为成都
        viewMode: '3D'
    });
    
    // 添加控件
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Scale());
    
    // 获取当前位置
    getCurrentLocation();
}

// 获取当前位置
function getCurrentLocation() {
    AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            convert: true
        });
        
        geolocation.getCurrentPosition(function(status, result) {
            if (status === 'complete') {
                currentLocation = result.position;
                const marker = new AMap.Marker({
                    position: currentLocation,
                    icon: new AMap.Icon({
                        size: new AMap.Size(25, 34),
                        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                        imageSize: new AMap.Size(25, 34)
                    }),
                    offset: new AMap.Pixel(-13, -30)
                });
                marker.setMap(map);
                marker.setTitle('您当前的位置');
            } else {
                console.log('定位失败：' + result.message);
            }
        });
    });
}

// 清除所有标记和路线
function clearMapOverlays() {
    if (currentMarkers.length > 0) {
        map.remove(currentMarkers);
        currentMarkers = [];
    }
    
    if (currentRoutes.length > 0) {
        map.remove(currentRoutes);
        currentRoutes = [];
    }
}

// 根据日期显示行程标记
function showDayItinerary(day) {
    clearMapOverlays();
    
    // 找到对应日期的行程数据
    const dayData = travelData.days.find(d => d.day == day);
    if (!dayData) return;
    
    // 获取当天的景点、酒店和餐厅
    const city = dayData.city;
    let attractions = travelData.attractions.filter(a => a.city === city);
    let hotels = travelData.accommodations.hotels.filter(h => h.city === city);
    let restaurants = travelData.accommodations.restaurants.filter(r => r.city === city);
    
    // 创建标记点
    let locations = [];
    
    // 添加景点标记
    attractions.forEach(attraction => {
        const coords = attraction.coordinates.split(',').map(Number);
        const marker = createMarker(coords, attraction.name, 'attraction', attraction);
        currentMarkers.push(marker);
        locations.push(coords);
    });
    
    // 添加酒店标记
    hotels.forEach(hotel => {
        const coords = hotel.coordinates.split(',').map(Number);
        const marker = createMarker(coords, hotel.name, 'hotel', hotel);
        currentMarkers.push(marker);
        locations.push(coords);
    });
    
    // 添加餐厅标记
    restaurants.forEach(restaurant => {
        const coords = restaurant.coordinates.split(',').map(Number);
        const marker = createMarker(coords, restaurant.name, 'restaurant', restaurant);
        currentMarkers.push(marker);
        locations.push(coords);
    });
    
    // 调整地图视图以包含所有标记
    if (locations.length > 0) {
        map.setFitView(currentMarkers);
    }
}

// 根据类型显示特定地点
function showLocationsByType(type) {
    clearMapOverlays();
    
    let locations = [];
    
    if (type === 'attractions' || type === 'all') {
        travelData.attractions.forEach(attraction => {
            const coords = attraction.coordinates.split(',').map(Number);
            const marker = createMarker(coords, attraction.name, 'attraction', attraction);
            currentMarkers.push(marker);
            locations.push(coords);
        });
    }
    
    if (type === 'hotels' || type === 'all') {
        travelData.accommodations.hotels.forEach(hotel => {
            const coords = hotel.coordinates.split(',').map(Number);
            const marker = createMarker(coords, hotel.name, 'hotel', hotel);
            currentMarkers.push(marker);
            locations.push(coords);
        });
    }
    
    if (type === 'restaurants' || type === 'all') {
        travelData.accommodations.restaurants.forEach(restaurant => {
            const coords = restaurant.coordinates.split(',').map(Number);
            const marker = createMarker(coords, restaurant.name, 'restaurant', restaurant);
            currentMarkers.push(marker);
            locations.push(coords);
        });
    }
    
    // 调整地图视图以包含所有标记
    if (locations.length > 0) {
        map.setFitView(currentMarkers);
    }
}

// 创建标记点
function createMarker(coords, name, type, data) {
    let icon;
    
    switch (type) {
        case 'attraction':
            icon = new AMap.Icon({
                size: new AMap.Size(25, 34),
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                imageSize: new AMap.Size(25, 34)
            });
            break;
        case 'hotel':
            icon = new AMap.Icon({
                size: new AMap.Size(25, 34),
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_g.png',
                imageSize: new AMap.Size(25, 34)
            });
            break;
        case 'restaurant':
            icon = new AMap.Icon({
                size: new AMap.Size(25, 34),
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                imageSize: new AMap.Size(25, 34)
            });
            break;
        default:
            icon = new AMap.Icon({
                size: new AMap.Size(25, 34),
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                imageSize: new AMap.Size(25, 34)
            });
    }
    
    const marker = new AMap.Marker({
        position: coords,
        title: name,
        icon: icon,
        offset: new AMap.Pixel(-13, -30)
    });
    
    // 添加点击事件
    marker.on('click', function() {
        selectedMarker = {position: coords, data: data, type: type};
        showLocationDetails(data, type);
    });
    
    marker.setMap(map);
    return marker;
}

// 显示地点详情
function showLocationDetails(data, type) {
    const locationDetails = document.getElementById('location-details');
    const locationName = document.getElementById('location-name');
    const locationAddress = document.getElementById('location-address');
    const locationInfo = document.getElementById('location-info');
    
    locationDetails.classList.remove('hidden');
    
    if (type === 'attraction') {
        locationName.textContent = data.name + ' (' + data.category + ')';
        locationAddress.textContent = data.address;
        locationInfo.textContent = data.info + ' | 门票: ' + data.price;
    } else if (type === 'hotel') {
        locationName.textContent = data.name;
        locationAddress.textContent = data.address;
        locationInfo.textContent = data.feature + ' | 价格: ' + data.price;
    } else if (type === 'restaurant') {
        locationName.textContent = data.name;
        locationAddress.textContent = data.address;
        locationInfo.textContent = data.feature + ' | 价格: ' + data.price;
    }
    
    // 滚动到详情区域
    locationDetails.scrollIntoView({behavior: 'smooth'});
}

// 规划路线
function planRoute(transportType) {
    if (!selectedMarker || !currentLocation) {
        alert('请先选择一个地点，并允许获取您的位置');
        return;
    }
    
    // 清除现有路线
    if (currentRoutes.length > 0) {
        map.remove(currentRoutes);
        currentRoutes = [];
    }
    
    const start = currentLocation;
    const end = selectedMarker.position;
    
    switch (transportType) {
        case 'driving':
            planDrivingRoute(start, end);
            break;
        case 'walking':
            planWalkingRoute(start, end);
            break;
        case 'transit':
            planTransitRoute(start, end);
            break;
    }
}

// 驾车路线规划
function planDrivingRoute(start, end) {
    AMap.plugin('AMap.Driving', function() {
        var driving = new AMap.Driving({
            map: map,
            panel: 'location-details'
        });
        
        driving.search(start, end, function(status, result) {
            if (status === 'complete') {
                console.log('绘制驾车路线完成');
                currentRoutes.push(driving.getRoute());
            } else {
                alert('路线规划失败：' + result);
            }
        });
    });
}

// 步行路线规划
function planWalkingRoute(start, end) {
    AMap.plugin('AMap.Walking', function() {
        var walking = new AMap.Walking({
            map: map,
            panel: 'location-details'
        });
        
        walking.search(start, end, function(status, result) {
            if (status === 'complete') {
                console.log('绘制步行路线完成');
                currentRoutes.push(walking.getRoute());
            } else {
                alert('路线规划失败：' + result);
            }
        });
    });
}

// 公交路线规划
function planTransitRoute(start, end) {
    AMap.plugin('AMap.Transfer', function() {
        var transfer = new AMap.Transfer({
            map: map,
            panel: 'location-details',
            city: selectedMarker.data.city
        });
        
        transfer.search(start, end, function(status, result) {
            if (status === 'complete') {
                console.log('绘制公交路线完成');
                currentRoutes.push(transfer.getRoute());
            } else {
                alert('路线规划失败：' + result);
            }
        });
    });
}

// 显示行程路线
function showTravelRoute(routeName) {
    clearMapOverlays();
    
    const routePoints = travelData.mapLocations.routePoints[routeName];
    if (!routePoints) return;
    
    const startCoords = routePoints[0].split(',').map(Number);
    const endCoords = routePoints[1].split(',').map(Number);
    
    // 添加起点和终点标记
    const startMarker = new AMap.Marker({
        position: startCoords,
        title: routeName.split('到')[0],
        icon: new AMap.Icon({
            size: new AMap.Size(25, 34),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new AMap.Size(25, 34)
        }),
        offset: new AMap.Pixel(-13, -30)
    });
    
    const endMarker = new AMap.Marker({
        position: endCoords,
        title: routeName.split('到')[1],
        icon: new AMap.Icon({
            size: new AMap.Size(25, 34),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            imageSize: new AMap.Size(25, 34)
        }),
        offset: new AMap.Pixel(-13, -30)
    });
    
    startMarker.setMap(map);
    endMarker.setMap(map);
    
    currentMarkers.push(startMarker, endMarker);
    
    // 绘制路线
    AMap.plugin('AMap.Driving', function() {
        var driving = new AMap.Driving({
            map: map,
            panel: 'location-details'
        });
        
        driving.search(startCoords, endCoords, function(status, result) {
            if (status === 'complete') {
                console.log('绘制路线完成');
                currentRoutes.push(driving.getRoute());
                
                // 调整地图视图以包含整个路线
                map.setFitView(currentMarkers.concat(currentRoutes));
            } else {
                console.log('路线规划失败：' + result);
                // 如果路线规划失败，至少显示起点和终点
                map.setFitView(currentMarkers);
            }
        });
    });
}

// 初始化地图事件监听
function initMapEvents() {
    // 日期选择
    document.getElementById('map-day-selector').addEventListener('change', function(e) {
        const day = e.target.value;
        if (day === 'all') {
            showLocationsByType('all');
        } else {
            showDayItinerary(day);
        }
    });
    
    // 类型选择
    document.getElementById('map-type-selector').addEventListener('change', function(e) {
        const type = e.target.value;
        showLocationsByType(type);
    });
    
    // 路线规划按钮
    document.getElementById('btn-driving').addEventListener('click', function() {
        planRoute('driving');
    });
    
    document.getElementById('btn-walking').addEventListener('click', function() {
        planRoute('walking');
    });
    
    document.getElementById('btn-transit').addEventListener('click', function() {
        planRoute('transit');
    });
} 