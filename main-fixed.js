// Analytics Dashboard - GitHub Pages Compatible Version
// Simple JavaScript without ES6 modules for GitHub Pages compatibility

// Global variables
let dashboardLinks = [];
let currentPeriod = 'daily';
let refreshInterval = null;
let charts = {};
let lastUpdateTime = new Date();

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    await initializeData();
    setupEventListeners();
    initializeCharts();
    startAutoRefresh();
    updateUI();
}

async function initializeData() {
    dashboardLinks = [
        {
            id: "giris-bot",
            name: "Giriş Bot",
            shortUrl: "https://cutt.ly/2rJxA8Z3",
            status: "active",
            clicks: { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0 },
            trend: [0,0 ,0 , 0, 0, 0, 0]
        },
        {
            id: "mail-abonelik",
            name: "Mail Abonelik",
            shortUrl: "https://cutt.ly/TrM8Utl8",
            status: "active",
            clicks: { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0 },
            trend: [0,0 ,0 , 0, 0, 0, 0]
        },
            {
            id: "fikret-sms",
            name: "Fikret SMS",
            shortUrl: " https://cutt.ly/75OTL",
            status: "active",
            clicks: { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0 },
            trend: [0,0 ,0 , 0, 0, 0, 0]
        },
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
}

function setupEventListeners() {
    // Period filter buttons
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            changePeriod(e.target.dataset.period);
        });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });
    }

    // Add link button
    const addLinkBtn = document.getElementById('addLinkBtn');
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', function() {
            showAddLinkModal();
        });
    }

    // Modal close buttons
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    if (closeModal) closeModal.addEventListener('click', hideAddLinkModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideAddLinkModal);

    // Add link form
    const addLinkForm = document.getElementById('addLinkForm');
    if (addLinkForm) {
        addLinkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewLink();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterLinks(e.target.value);
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            filterByStatus(e.target.value);
        });
    }

    // Settings save button
    const saveSettings = document.getElementById('saveSettings');
    if (saveSettings) {
        saveSettings.addEventListener('click', saveSettingsHandler);
    }

    // Theme selection
    document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', function() {
            selectTheme(card.dataset.theme);
        });
    });

    // Card hover effects
    document.querySelectorAll('.card-hover').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    scale: 1.02,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });

        card.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    });
}

function initializeCharts() {
    initPerformanceChart();
}

function initPerformanceChart() {
    const chartDom = document.getElementById('performanceChart');
    if (!chartDom || typeof echarts === 'undefined') return;

    const myChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Tıklamalar',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#4a90a4'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(74, 144, 164, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(74, 144, 164, 0.05)'
                        }]
                    }
                },
                data: dashboardLinks[0].trend
            }
        ]
    };

    myChart.setOption(option);
    charts.performance = myChart;

    // Make chart responsive
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

function changePeriod(period) {
    currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-period="${period}"]`).classList.add('active');
    
    // Update chart data based on period
    updateChartData(period);
}

function updateChartData(period) {
    if (!charts.performance) return;
    
    let data, labels;
    
    switch(period) {
        case 'daily':
            data = dashboardLinks[0].trend;
            labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            break;
        case 'weekly':
            data = [1200, 1350, 1100, 1450, 1600, 1300, 1550];
            labels = ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4', 'Hafta 5', 'Hafta 6', 'Hafta 7'];
            break;
        case 'monthly':
            data = [4500, 5200, 4800, 6100, 5800, 7200, 6900];
            labels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem'];
            break;
    }
    
    charts.performance.setOption({
        xAxis: [{
            data: labels
        }],
        series: [{
            data: data
        }]
    });
}

function refreshData() {
    // Show loading state
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.innerHTML = `
            <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        `;
    }
    
    // Simulate refresh
    setTimeout(function() {
        lastUpdateTime = new Date();
        updateUI();
        
        // Reset refresh button
        if (refreshBtn) {
            refreshBtn.innerHTML = `
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
            `;
        }
    }, 1000);
}

function startAutoRefresh() {
    // Clear existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    // Set new interval (1 minute)
    refreshInterval = setInterval(function() {
        refreshData();
    }, 60000);
}

function updateUI() {
    // Update last update time
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        const minutes = Math.floor((now - lastUpdateTime) / 60000);
        if (minutes === 0) {
            lastUpdateElement.textContent = 'Şimdi güncellendi';
        } else {
            lastUpdateElement.textContent = `${minutes} dakika önce güncellendi`;
        }
    }

    // Update metrics
    updateMetrics();
}

function updateMetrics() {
    const totalClicks = dashboardLinks.reduce(function(sum, link) {
        return sum + link.clicks.total;
    }, 0);
    
    const todayClicks = dashboardLinks.reduce(function(sum, link) {
        return sum + link.clicks.daily;
    }, 0);
    
    const activeLinks = dashboardLinks.filter(function(link) {
        return link.status === 'active';
    }).length;

    const totalClicksElement = document.getElementById('totalClicks');
    const todayClicksElement = document.getElementById('todayClicks');
    const activeLinksElement = document.getElementById('activeLinks');
    const lastUpdateTimeElement = document.getElementById('lastUpdateTime');

    if (totalClicksElement) totalClicksElement.textContent = formatNumber(totalClicks);
    if (todayClicksElement) todayClicksElement.textContent = formatNumber(todayClicks);
    if (activeLinksElement) activeLinksElement.textContent = activeLinks;
    if (lastUpdateTimeElement) lastUpdateTimeElement.textContent = 'Şimdi';
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showAddLinkModal() {
    const modal = document.getElementById('addLinkModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function hideAddLinkModal() {
    const modal = document.getElementById('addLinkModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function addNewLink() {
    const linkName = document.getElementById('linkName').value;
    const originalUrl = document.getElementById('originalUrl').value;
    const shortUrl = document.getElementById('shortUrl').value;

    if (!linkName || !originalUrl || !shortUrl) {
        alert('Lütfen tüm alanları doldurun!');
        return;
    }

    const newLink = {
        id: shortUrl.toLowerCase().replace(/\s+/g, '-'),
        name: linkName,
        shortUrl: `cutt.ly/${shortUrl}`,
        status: 'active',
        clicks: { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0 },
        trend: [0, 0, 0, 0, 0, 0, 0]
    };

    dashboardLinks.push(newLink);
    hideAddLinkModal();
    refreshData();

    // Reset form
    document.getElementById('addLinkForm').reset();

    // Show success message
    showSuccessMessage('Link başarıyla eklendi!');
}

function filterLinks(searchTerm) {
    const linkCards = document.querySelectorAll('[data-link-id]');
    linkCards.forEach(function(card) {
        const linkName = card.querySelector('h3').textContent.toLowerCase();
        const linkUrl = card.querySelector('p').textContent.toLowerCase();
        
        if (linkName.includes(searchTerm.toLowerCase()) || linkUrl.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterByStatus(status) {
    const linkCards = document.querySelectorAll('[data-link-id]');
    linkCards.forEach(function(card) {
        const statusElement = card.querySelector('.status-active, .status-paused, .status-inactive');
        let cardStatus = 'active';
        
        if (statusElement.classList.contains('status-paused')) {
            cardStatus = 'paused';
        } else if (statusElement.classList.contains('status-inactive')) {
            cardStatus = 'inactive';
        }

        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectTheme(theme) {
    document.querySelectorAll('.radio-card').forEach(function(card) {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('selected');
}

function saveSettingsHandler() {
    // Simulate saving settings
    const saveBtn = document.getElementById('saveSettings');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>Kaydediliyor...</span>
    `;

    setTimeout(function() {
        saveBtn.innerHTML = originalText;
        showSuccessMessage('Ayarlar başarıyla kaydedildi!');
    }, 1500);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg success-message';
    successDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(successDiv);

    setTimeout(function() {
        successDiv.remove();
    }, 3000);
}
