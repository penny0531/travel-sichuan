document.addEventListener('DOMContentLoaded', () => {
    const daySelector = document.getElementById('day-selector');
    const dailyContent = document.getElementById('daily-content');
    const mainNavButtons = document.querySelectorAll('.nav-button');
    const views = {
        itinerary: document.getElementById('itinerary-view'),
        accommodations: document.getElementById('accommodations-view'),
        map: document.getElementById('map-view'),
        tips: document.getElementById('tips-view')
    };

    let activeDay = 1;
    let costChartInstance = null;
    
    // 渲染日期选择器
    function renderDaySelector() {
        daySelector.innerHTML = travelData.days.map(day => `
            <button data-day="${day.day}" class="day-button ${day.day === activeDay ? 'active-day' : 'inactive-day'} text-sm sm:text-base py-3 px-2 rounded-lg font-bold shadow-sm transition-all duration-300">
                第 ${day.day} 天<span class="hidden md:inline"> | ${day.city}</span>
            </button>
        `).join('');
    }

    // 渲染每日内容
    function renderDailyContent(day) {
        const dayData = travelData.days.find(d => d.day === day);
        dailyContent.innerHTML = `
            <div class="p-6 content-card animate-fade-in">
                <h2 class="text-2xl font-bold mb-4 text-teal-700">${dayData.title}</h2>
                <div class="flex items-center text-gray-600 mb-6">
                    <span class="font-bold mr-2">${dayData.transport}</span> | <span class="ml-2">${dayData.city}</span>
                </div>
                <div class="space-y-4 mb-6">
                    ${dayData.schedule.map(item => `
                        <div class="flex items-start">
                            <span class="text-2xl mr-4">${item.icon}</span>
                            <div>
                                <h4 class="font-semibold text-gray-800">${item.time}</h4>
                                <p class="text-gray-600">${item.activity}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-6 border-t pt-6 bg-teal-50 p-4 rounded-lg">
                    <h3 class="font-bold text-lg text-teal-800 mb-2">本日亮点：${dayData.highlight.name}</h3>
                    <p class="text-gray-700">${dayData.highlight.desc}</p>
                </div>
            </div>
            <div class="p-6 content-card">
                <h3 class="text-xl font-bold mb-4 text-teal-700">交通与地图</h3>
                <p class="text-gray-600 mb-4">查看本日行程的地图路线和相关地点</p>
                <button data-day="${dayData.day}" class="view-on-map bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">在地图中查看</button>
            </div>
        `;
        
        // 添加在地图中查看按钮的事件
        document.querySelectorAll('.view-on-map').forEach(btn => {
            btn.addEventListener('click', function() {
                const day = this.dataset.day;
                switchView('map');
                document.getElementById('map-day-selector').value = day;
                showDayItinerary(day);
            });
        });
    }
    
    // 渲染住宿和餐厅列表
    function renderAccommodations() {
        const hotelList = document.getElementById('hotel-list');
        const restaurantList = document.getElementById('restaurant-list');
        const filter = document.querySelector('.filter-btn.active-day').dataset.filter;

        const filterData = (data) => filter === 'all' ? data : data.filter(item => item.city === filter);

        hotelList.innerHTML = filterData(travelData.accommodations.hotels).map(item => `
            <div class="accommodation-card border-l-4 border-teal-500 pl-4" data-city="${item.city}">
                <h4 class="font-bold">${item.name} (${item.city})</h4>
                <p class="text-sm text-gray-600">${item.feature} | <span class="font-semibold text-red-500">${item.price}</span></p>
                <p class="text-xs text-gray-500 mt-1">${item.address}</p>
                <button data-coords="${item.coordinates}" data-type="hotel" data-index="${travelData.accommodations.hotels.indexOf(item)}" class="show-on-map mt-2 text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded hover:bg-teal-200 transition-colors">在地图中查看</button>
            </div>
        `).join('');

        restaurantList.innerHTML = filterData(travelData.accommodations.restaurants).map(item => `
            <div class="accommodation-card border-l-4 border-amber-500 pl-4" data-city="${item.city}">
                <h4 class="font-bold">${item.name} (${item.city})</h4>
                <p class="text-sm text-gray-600">${item.feature} | <span class="font-semibold text-red-500">${item.price}</span></p>
                <p class="text-xs text-gray-500 mt-1">${item.address}</p>
                <button data-coords="${item.coordinates}" data-type="restaurant" data-index="${travelData.accommodations.restaurants.indexOf(item)}" class="show-on-map mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200 transition-colors">在地图中查看</button>
            </div>
        `).join('');
        
        // 添加在地图中查看按钮的事件
        document.querySelectorAll('.show-on-map').forEach(btn => {
            btn.addEventListener('click', function() {
                const coords = this.dataset.coords.split(',').map(Number);
                const type = this.dataset.type;
                const index = this.dataset.index;
                
                switchView('map');
                clearMapOverlays();
                
                let data;
                if (type === 'hotel') {
                    data = travelData.accommodations.hotels[index];
                    document.getElementById('map-type-selector').value = 'hotels';
                } else if (type === 'restaurant') {
                    data = travelData.accommodations.restaurants[index];
                    document.getElementById('map-type-selector').value = 'restaurants';
                }
                
                const marker = createMarker(coords, data.name, type, data);
                currentMarkers.push(marker);
                map.setZoomAndCenter(15, coords);
                
                // 显示详情
                showLocationDetails(data, type);
            });
        });
    }

    // 渲染消费图表
    function renderCostChart() {
        const ctx = document.getElementById('costChart').getContext('2d');
        const hotelData = travelData.accommodations.hotels;
        const restaurantData = travelData.accommodations.restaurants;

        const processPrices = (data, filterCity) => {
            const filteredData = filterCity === 'all' ? data : data.filter(item => item.city === filterCity);
            if (filteredData.length === 0) return [0, 0];
            const prices = filteredData.map(item => {
                const priceNumbers = item.price.match(/\d+/g).map(Number);
                return { low: priceNumbers[0], high: priceNumbers[1] || priceNumbers[0] };
            });
            const avgLow = prices.reduce((acc, p) => acc + p.low, 0) / prices.length;
            const avgHigh = prices.reduce((acc, p) => acc + p.high, 0) / prices.length;
            return [avgLow, avgHigh];
        };

        const chengduHotels = processPrices(hotelData, '成都');
        const jiuzhaigouHotels = processPrices(hotelData, '九寨沟');
        const chongqingHotels = processPrices(hotelData, '重庆');
        const chengduRestaurants = processPrices(restaurantData, '成都');
        const jiuzhaigouRestaurants = processPrices(restaurantData, '九寨沟');
        const chongqingRestaurants = processPrices(restaurantData, '重庆');

        if (costChartInstance) {
            costChartInstance.destroy();
        }

        costChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['成都酒店', '九寨沟酒店', '重庆酒店', '成都餐厅', '九寨沟餐厅', '重庆餐厅'],
                datasets: [{
                    label: '最低人均 (元)',
                    data: [chengduHotels[0], jiuzhaigouHotels[0], chongqingHotels[0], chengduRestaurants[0], jiuzhaigouRestaurants[0], chongqingRestaurants[0]],
                    backgroundColor: 'rgba(20, 184, 166, 0.6)',
                    borderColor: 'rgba(13, 148, 136, 1)',
                    borderWidth: 1
                }, {
                    label: '最高人均 (元)',
                    data: [chengduHotels[1], jiuzhaigouHotels[1], chongqingHotels[1], chengduRestaurants[1], jiuzhaigouRestaurants[1], chongqingRestaurants[1]],
                    backgroundColor: 'rgba(245, 158, 11, 0.6)',
                    borderColor: 'rgba(217, 119, 6, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // 渲染旅行贴士
    function renderTips() {
        const accordion = document.getElementById('tips-accordion');
        accordion.innerHTML = travelData.tips.map((tip, index) => `
            <div class="content-card">
                <button class="accordion-button w-full flex justify-between items-center text-left p-4">
                    <h3 class="font-semibold text-lg text-teal-800">${tip.title}</h3>
                    <span class="text-2xl text-teal-500 transform transition-transform duration-300">▾</span>
                </button>
                <div class="accordion-content">
                    <p class="p-4 pt-0 text-gray-600">${tip.content}</p>
                </div>
            </div>
        `).join('');
    }

    // 切换视图
    function switchView(viewName) {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        views[viewName].classList.remove('hidden');

        mainNavButtons.forEach(btn => {
            if (btn.dataset.view === viewName) {
                btn.classList.replace('inactive-nav', 'active-nav');
            } else {
                btn.classList.replace('active-nav', 'inactive-nav');
            }
        });
        
        if (viewName === 'accommodations') {
            renderAccommodations();
            renderCostChart();
        } else if (viewName === 'tips') {
            renderTips();
        } else if (viewName === 'map' && !map) {
            // 初始化地图
            initMap();
            initMapEvents();
            showLocationsByType('all');
        }
    }

    // 初始化事件监听
    function initEventListeners() {
        // 日期选择
        daySelector.addEventListener('click', e => {
            if (e.target.classList.contains('day-button')) {
                activeDay = parseInt(e.target.dataset.day);
                renderDaySelector();
                renderDailyContent(activeDay);
            }
        });

        // 主导航按钮
        mainNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                switchView(button.dataset.view);
            });
        });

        // 城市筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.replace('active-day', 'inactive-day'));
                this.classList.replace('inactive-day', 'active-day');
                renderAccommodations();
                renderCostChart();
            });
        });

        // 贴士手风琴
        document.getElementById('tips-view').addEventListener('click', e => {
            const button = e.target.closest('.accordion-button');
            if (button) {
                const content = button.nextElementSibling;
                const icon = button.querySelector('span');
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    document.querySelectorAll('.accordion-content').forEach(item => {
                        item.style.maxHeight = null;
                        item.previousElementSibling.querySelector('span').style.transform = 'rotate(0deg)';
                    });
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    }

    // 初始化应用
    function initApp() {
        renderDaySelector();
        renderDailyContent(activeDay);
        initEventListeners();
    }

    // 启动应用
    initApp();
}); 